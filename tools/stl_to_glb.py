"""
STL -> GLB for the web, tuned for huge CAD exports on limited RAM.

Pipeline:
  1. memory-map the binary STL (no full read into RAM)
  2. weld duplicate vertices via bit-exact grid quantisation
  3. quadric-error decimation down to a web-sized triangle budget
  4. un-index + flat face normals (crisp mechanical look, not "melted")
  5. Z-up/mm  ->  glTF Y-up/metres, centred, resting on the ground plane
  6. write GLB

Usage:  python tools/stl_to_glb.py "full robot.stl" assets/robot.glb 220000
"""
import sys, os, gc, json, struct, time
import numpy as np

t0 = time.time()
def log(msg):
    print(f"[{time.time()-t0:6.1f}s] {msg}", flush=True)

SRC    = sys.argv[1] if len(sys.argv) > 1 else "full robot.stl"
DST    = sys.argv[2] if len(sys.argv) > 2 else "assets/robot.glb"
TARGET = int(sys.argv[3]) if len(sys.argv) > 3 else 220_000

# ── 1. map the STL ────────────────────────────────────────────────
size = os.path.getsize(SRC)
with open(SRC, "rb") as f:
    n_tri = struct.unpack("<I", f.read(84)[80:84])[0]
if size != 84 + n_tri * 50:
    sys.exit("Not a binary STL (size does not match triangle count).")
log(f"source: {size/2**20:.1f} MB, {n_tri:,} triangles")

rec = np.dtype([("n", "<f4", 3), ("v", "<f4", (3, 3)), ("a", "<u2")])
mm  = np.memmap(SRC, dtype=rec, mode="r", offset=84, shape=(n_tri,))

# ── 2. weld vertices ──────────────────────────────────────────────
# Bounding box first, streamed so we never hold the whole array.
CH = 1_000_000
lo = np.full(3,  np.inf, np.float64)
hi = np.full(3, -np.inf, np.float64)
for s in range(0, n_tri, CH):
    v = mm["v"][s:s+CH].reshape(-1, 3)
    lo = np.minimum(lo, v.min(0)); hi = np.maximum(hi, v.max(0))
ext = np.maximum(hi - lo, 1e-9)
log(f"bbox {lo.round(1)} .. {hi.round(1)}  (extent {ext.round(1)})")

# 21 bits per axis -> ~2M steps across the model; bit-identical STL
# vertices always land in the same cell, so this is an exact weld.
BITS  = 21
scale = ((1 << BITS) - 1) / ext
codes = np.empty(n_tri * 3, np.int64)
for s in range(0, n_tri, CH):
    v = np.asarray(mm["v"][s:s+CH].reshape(-1, 3), np.float64)
    q = ((v - lo) * scale).astype(np.int64)
    codes[s*3:s*3 + len(q)] = (q[:, 0] << (2*BITS)) | (q[:, 1] << BITS) | q[:, 2]
log("quantised vertices")

uniq, first, inv = np.unique(codes, return_index=True, return_inverse=True)
del codes; gc.collect()
log(f"welded: {n_tri*3:,} -> {len(uniq):,} vertices")

allv   = mm["v"].reshape(-1, 3)
points = np.ascontiguousarray(allv[first], dtype=np.float32)
del uniq, first, allv, mm; gc.collect()

faces = inv.reshape(-1, 3).astype(np.int32)
del inv; gc.collect()

# drop degenerate triangles (any two corners welded together)
good  = (faces[:,0] != faces[:,1]) & (faces[:,1] != faces[:,2]) & (faces[:,0] != faces[:,2])
if not good.all():
    log(f"dropping {(~good).sum():,} degenerate triangles")
    faces = np.ascontiguousarray(faces[good])
del good; gc.collect()
log(f"mesh: {len(points):,} verts / {len(faces):,} tris")

# ── 3. decimate ───────────────────────────────────────────────────
import fast_simplification
if len(faces) > TARGET:
    reduction = 1.0 - TARGET / len(faces)
    log(f"decimating to ~{TARGET:,} tris (reduction {reduction:.4f}) — this is the slow part")
    points, faces = fast_simplification.simplify(points, faces, reduction)
    points = np.asarray(points, np.float32)
    faces  = np.asarray(faces,  np.int32)
    log(f"decimated: {len(points):,} verts / {len(faces):,} tris")
else:
    log("already under target, skipping decimation")
gc.collect()

# ── 4. un-index + flat normals ────────────────────────────────────
tri = points[faces]                       # (m, 3, 3)
del points, faces; gc.collect()
nrm = np.cross(tri[:,1] - tri[:,0], tri[:,2] - tri[:,0])
ln  = np.linalg.norm(nrm, axis=1, keepdims=True)
nrm = np.divide(nrm, ln, out=np.zeros_like(nrm), where=ln > 0)
nrm = np.repeat(nrm, 3, axis=0).astype(np.float32)
pos = tri.reshape(-1, 3).astype(np.float32)
del tri; gc.collect()

# ── 5. orient for glTF: Z-up -> Y-up, centred, resting on ground ──
# Units are guessed from the bounding box: an FTC robot is ~0.5 m, so a
# model that already measures <10 is in metres, ~500 is in millimetres,
# and ~20 is in inches.
span = float(np.max(hi - lo))
unit = 1.0 if span < 10 else (0.001 if span > 100 else 0.0254)
log(f"largest dimension {span:.3f} source units -> unit scale {unit} "
    f"({span*unit:.3f} m tall/wide)")

mn, mx = pos.min(0), pos.max(0)
pos -= np.array([(mn[0]+mx[0])/2, (mn[1]+mx[1])/2, mn[2]], np.float32)
pos = np.stack([pos[:,0], pos[:,2], -pos[:,1]], 1) * np.float32(unit)
nrm = np.stack([nrm[:,0], nrm[:,2], -nrm[:,1]], 1)
log(f"oriented; final size {(pos.max(0)-pos.min(0)).round(3)} m")

# ── 6. write GLB ──────────────────────────────────────────────────
pos = np.ascontiguousarray(pos); nrm = np.ascontiguousarray(nrm)
blob = pos.tobytes() + nrm.tobytes()
nbytes_pos = pos.nbytes
count = len(pos)

gltf = {
  "asset": {"version": "2.0", "generator": "FTC23441 stl_to_glb"},
  "scene": 0,
  "scenes": [{"nodes": [0]}],
  "nodes": [{"mesh": 0, "name": "robot"}],
  "meshes": [{"name": "robot", "primitives": [
      {"attributes": {"POSITION": 0, "NORMAL": 1}, "material": 0}]}],
  "materials": [{
      "name": "aluminium",
      "pbrMetallicRoughness": {
          "baseColorFactor": [0.62, 0.64, 0.66, 1.0],
          "metallicFactor": 0.85, "roughnessFactor": 0.38},
      "doubleSided": True}],
  "buffers": [{"byteLength": len(blob)}],
  "bufferViews": [
      {"buffer": 0, "byteOffset": 0,          "byteLength": nbytes_pos,       "target": 34962},
      {"buffer": 0, "byteOffset": nbytes_pos, "byteLength": len(blob)-nbytes_pos, "target": 34962}],
  "accessors": [
      {"bufferView": 0, "componentType": 5126, "count": count, "type": "VEC3",
       "min": pos.min(0).tolist(), "max": pos.max(0).tolist()},
      {"bufferView": 1, "componentType": 5126, "count": count, "type": "VEC3"}],
}

def chunk(data, kind):
    pad = (-len(data)) % 4
    data += (b" " if kind == b"JSON" else b"\0") * pad
    return struct.pack("<I4s", len(data), kind) + data

j = chunk(json.dumps(gltf, separators=(",", ":")).encode(), b"JSON")
b = chunk(blob, b"BIN\0")
os.makedirs(os.path.dirname(DST) or ".", exist_ok=True)
with open(DST, "wb") as f:
    f.write(struct.pack("<4sII", b"glTF", 2, 12 + len(j) + len(b)) + j + b)

log(f"wrote {DST}  ({os.path.getsize(DST)/2**20:.1f} MB, {count//3:,} tris)")
