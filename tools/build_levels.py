"""
Build quality levels from the raw STL, with NO compression and NO
quantisation. Float32 positions + float32 flat normals, straight through.

  python tools/build_levels.py max        -> every triangle, ~966 MB
  python tools/build_levels.py 2000000    -> decimated to N triangles

The "max" path streams chunk-by-chunk from a memory-mapped STL, so peak
RAM stays near 100 MB even though the output is ~1 GB.
"""
import sys, os, gc, json, struct, time
import numpy as np

t0 = time.time()
def log(m): print(f"[{time.time()-t0:6.1f}s] {m}", flush=True)

SRC  = "full robot.stl"
MODE = sys.argv[1] if len(sys.argv) > 1 else "max"

size  = os.path.getsize(SRC)
n_tri = struct.unpack("<I", open(SRC, "rb").read(84)[80:84])[0]
rec   = np.dtype([("n", "<f4", 3), ("v", "<f4", (3, 3)), ("a", "<u2")])
mm    = np.memmap(SRC, dtype=rec, mode="r", offset=84, shape=(n_tri,))
CH    = 400_000

# ── bounding box + unit detection ─────────────────────────────────
lo = np.full(3,  np.inf); hi = np.full(3, -np.inf)
for s in range(0, n_tri, CH):
    v = mm["v"][s:s+CH].reshape(-1, 3)
    lo = np.minimum(lo, v.min(0)); hi = np.maximum(hi, v.max(0))
span = float(np.max(hi - lo))
unit = 1.0 if span < 10 else (0.001 if span > 100 else 0.0254)
cx, cy, mz = (lo[0]+hi[0])/2, (lo[1]+hi[1])/2, lo[2]
log(f"{n_tri:,} triangles, span {span:.3f} -> unit {unit}")

def orient_pos(v):
    """Z-up CAD -> Y-up glTF, centred, resting on the ground plane."""
    x = (v[:, 0] - cx) * unit
    y = (v[:, 2] - mz) * unit
    z = -(v[:, 1] - cy) * unit
    return np.stack([x, y, z], 1).astype(np.float32)

def orient_nrm(v):
    return np.stack([v[:, 0], v[:, 2], -v[:, 1]], 1).astype(np.float32)

# transformed bbox, computed analytically from the source bbox
bmin = [ (lo[0]-cx)*unit, (lo[2]-mz)*unit, -(hi[1]-cy)*unit ]
bmax = [ (hi[0]-cx)*unit, (hi[2]-mz)*unit, -(lo[1]-cy)*unit ]

MAT = {"name": "aluminium", "doubleSided": True,
       "pbrMetallicRoughness": {"baseColorFactor": [0.62, 0.64, 0.66, 1.0],
                                "metallicFactor": 0.85, "roughnessFactor": 0.38}}

def gltf_json(count, nbytes_pos, total):
    return {
      "asset": {"version": "2.0", "generator": "FTC23441 build_levels"},
      "scene": 0, "scenes": [{"nodes": [0]}],
      "nodes": [{"mesh": 0, "name": "robot"}],
      "meshes": [{"name": "robot", "primitives": [
          {"attributes": {"POSITION": 0, "NORMAL": 1}, "material": 0}]}],
      "materials": [MAT],
      "buffers": [{"byteLength": total}],
      "bufferViews": [
          {"buffer": 0, "byteOffset": 0, "byteLength": nbytes_pos, "target": 34962},
          {"buffer": 0, "byteOffset": nbytes_pos, "byteLength": total-nbytes_pos, "target": 34962}],
      "accessors": [
          {"bufferView": 0, "componentType": 5126, "count": count, "type": "VEC3",
           "min": [float(v) for v in bmin], "max": [float(v) for v in bmax]},
          {"bufferView": 1, "componentType": 5126, "count": count, "type": "VEC3"}],
    }

def write_glb(path, count, emit_pos, emit_nrm):
    """emit_* are generators yielding float32 (k,3) chunks."""
    nb = count * 12
    total = nb * 2
    js = json.dumps(gltf_json(count, nb, total), separators=(",", ":")).encode()
    js += b" " * ((-len(js)) % 4)
    os.makedirs(os.path.dirname(path) or ".", exist_ok=True)
    with open(path, "wb") as f:
        f.write(struct.pack("<4sII", b"glTF", 2, 12 + 8 + len(js) + 8 + total))
        f.write(struct.pack("<I4s", len(js), b"JSON")); f.write(js)
        f.write(struct.pack("<I4s", total, b"BIN\0"))
        for gen in (emit_pos, emit_nrm):
            done = 0
            for arr in gen():
                f.write(np.ascontiguousarray(arr, np.float32).tobytes())
                done += len(arr)
                if done % 4_000_000 < CH*3:
                    log(f"  ...{done/count*100:.0f}% of one stream")
    log(f"wrote {path}  ({os.path.getsize(path)/2**20:.1f} MB, {count//3:,} tris)")

# ══ MAX: no weld, no decimation, straight from the STL ════════════
if MODE == "max":
    count = n_tri * 3

    def positions():
        for s in range(0, n_tri, CH):
            yield orient_pos(np.asarray(mm["v"][s:s+CH].reshape(-1, 3), np.float64))

    def normals():
        # Recomputed from geometry rather than trusting the STL header
        # normals, which some exporters leave zeroed.
        for s in range(0, n_tri, CH):
            t = np.asarray(mm["v"][s:s+CH], np.float64)
            nr = np.cross(t[:, 1] - t[:, 0], t[:, 2] - t[:, 0])
            ln = np.linalg.norm(nr, axis=1, keepdims=True)
            nr = np.divide(nr, ln, out=np.zeros_like(nr), where=ln > 0)
            yield orient_nrm(np.repeat(nr, 3, axis=0))

    write_glb("assets/robot-max.glb", count, positions, normals)
    sys.exit()

# ══ Decimated but still uncompressed float32 ═════════════════════
TARGET = int(MODE)
BITS = 21
scale = ((1 << BITS) - 1) / np.maximum(hi - lo, 1e-9)
codes = np.empty(n_tri * 3, np.int64)
for s in range(0, n_tri, CH):
    v = np.asarray(mm["v"][s:s+CH].reshape(-1, 3), np.float64)
    q = ((v - lo) * scale).astype(np.int64)
    codes[s*3:s*3+len(q)] = (q[:,0] << (2*BITS)) | (q[:,1] << BITS) | q[:,2]
uniq, first, inv = np.unique(codes, return_index=True, return_inverse=True)
del codes; gc.collect()
points = np.ascontiguousarray(mm["v"].reshape(-1,3)[first], np.float32)
faces  = inv.reshape(-1,3).astype(np.int32)
del uniq, first, inv; gc.collect()
good = (faces[:,0]!=faces[:,1]) & (faces[:,1]!=faces[:,2]) & (faces[:,0]!=faces[:,2])
faces = np.ascontiguousarray(faces[good]); del good; gc.collect()
log(f"welded {len(points):,} verts / {len(faces):,} tris")

import fast_simplification
if len(faces) > TARGET:
    points, faces = fast_simplification.simplify(points, faces, 1.0 - TARGET/len(faces))
    points = np.asarray(points, np.float32); faces = np.asarray(faces, np.int32)
    log(f"decimated to {len(faces):,} tris")

tri = points[faces]; del points, faces; gc.collect()
nr  = np.cross(tri[:,1]-tri[:,0], tri[:,2]-tri[:,0])
ln  = np.linalg.norm(nr, axis=1, keepdims=True)
nr  = np.repeat(np.divide(nr, ln, out=np.zeros_like(nr), where=ln>0), 3, axis=0)
pos = orient_pos(tri.reshape(-1,3).astype(np.float64))
nrm = orient_nrm(nr)
del tri, nr; gc.collect()

out = f"assets/robot-{len(pos)//3//1000}k.glb"
write_glb(out, len(pos), lambda: iter([pos]), lambda: iter([nrm]))
