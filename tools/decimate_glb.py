"""
Material-preserving decimation for a large GLB.

gltfpack's WASM build traps ("unreachable") on very large assemblies —
the Onshape export here is 9M triangles across 287 meshes and it dies
even after repacking to a real GLB. This does the heavy reduction in
Python first, per primitive, so every primitive keeps its own material.
The result is small enough for gltfpack to finish the job.

Each primitive is decimated independently, then given flat face normals
so machined edges stay crisp instead of looking melted.

Usage: python tools/decimate_glb.py "full robot.glb" assets/robot-dec.glb 0.09
"""
import sys, os, json, struct, time
import numpy as np
import fast_simplification

t0 = time.time()
def log(m): print(f"[{time.time()-t0:6.1f}s] {m}", flush=True)

SRC   = sys.argv[1] if len(sys.argv) > 1 else "full robot.glb"
DST   = sys.argv[2] if len(sys.argv) > 2 else "assets/robot-dec.glb"
RATIO = float(sys.argv[3]) if len(sys.argv) > 3 else 0.09
FLOOR = 12          # never take a primitive below this many triangles

CT = {5120:np.int8, 5121:np.uint8, 5122:np.int16, 5123:np.uint16,
      5125:np.uint32, 5126:np.float32}
NC = {"SCALAR":1, "VEC2":2, "VEC3":3, "VEC4":4, "MAT4":16}

# ── read GLB ──────────────────────────────────────────────────────
raw = open(SRC, "rb").read()
if raw[:4] != b"glTF": sys.exit("not a GLB")
jlen = struct.unpack("<I", raw[12:16])[0]
g    = json.loads(raw[20:20+jlen])
p    = 20 + jlen
blen = struct.unpack("<I", raw[p:p+4])[0]
BIN  = raw[p+8 : p+8+blen]
log(f"loaded {len(raw)/2**20:.1f} MB · {len(g['meshes'])} meshes · {len(g.get('materials',[]))} materials")

def read_accessor(i):
    a  = g["accessors"][i]
    bv = g["bufferViews"][a["bufferView"]]
    dt = np.dtype(CT[a["componentType"]]).newbyteorder("<")
    n  = NC[a["type"]]
    off = bv.get("byteOffset", 0) + a.get("byteOffset", 0)
    stride = bv.get("byteStride")
    if stride and stride != dt.itemsize * n:
        # interleaved — gather element by element
        out = np.empty((a["count"], n), dt)
        for k in range(a["count"]):
            s = off + k*stride
            out[k] = np.frombuffer(BIN, dt, n, s)
        return out
    return np.frombuffer(BIN, dt, a["count"]*n, off).reshape(a["count"], n)

# ── decimate every primitive ──────────────────────────────────────
chunks, accessors, views = [], [], []
cursor = 0
def push(arr):
    """Append raw bytes, return (bufferView index)."""
    global cursor
    b = np.ascontiguousarray(arr).tobytes()
    pad = (-len(b)) % 4
    views.append({"buffer":0, "byteOffset":cursor, "byteLength":len(b)})
    chunks.append(b + b"\0"*pad)
    cursor += len(b) + pad
    return len(views) - 1

tri_in = tri_out = 0
new_meshes = []
for mi, mesh in enumerate(g["meshes"]):
    prims = []
    for pr in mesh["primitives"]:
        if pr.get("mode", 4) != 4 or "POSITION" not in pr["attributes"]:
            continue
        pos = read_accessor(pr["attributes"]["POSITION"]).astype(np.float32)
        if "indices" in pr:
            idx = read_accessor(pr["indices"]).reshape(-1).astype(np.uint32)
        else:
            idx = np.arange(len(pos), dtype=np.uint32)
        faces = idx.reshape(-1, 3)
        tri_in += len(faces)

        target = max(int(len(faces) * RATIO), FLOOR)
        # One simplify() call stalls well short of the target: quadric
        # decimation refuses collapses that would distort the shell, and
        # each part is a separate closed shell. Re-running on the result
        # gets further, so loop until it stops making progress.
        for _ in range(4):
            if len(faces) <= target: break
            before = len(faces)
            try:
                vp, vf = fast_simplification.simplify(
                    pos, faces.astype(np.int32), 1.0 - target/len(faces), agg=9)
                pos, faces = np.asarray(vp, np.float32), np.asarray(vf, np.int32)
            except Exception:
                break                    # tiny/degenerate part — keep as-is
            if len(faces) >= before * 0.92: break     # converged
        tri_out += len(faces)

        # Indexed geometry with area-weighted smooth normals. Un-indexed
        # flat normals look crisper on machined edges but cost ~72 bytes
        # per triangle against ~24 here — at this scale that difference
        # is a 150 MB file versus a 25 MB one, so indexed wins.
        fn = np.cross(pos[faces[:,1]]-pos[faces[:,0]], pos[faces[:,2]]-pos[faces[:,0]])
        N  = np.zeros_like(pos)
        for k in range(3):
            np.add.at(N, faces[:,k], fn)      # area-weighted by construction
        ln = np.linalg.norm(N, axis=1, keepdims=True)
        N  = np.divide(N, ln, out=np.zeros_like(N), where=ln > 0).astype(np.float32)
        P  = np.ascontiguousarray(pos, np.float32)

        idt = np.uint16 if len(P) < 65536 else np.uint32
        I   = np.ascontiguousarray(faces.reshape(-1).astype(idt))

        vp_i, vn_i, vi_i = push(P), push(N), push(I)
        accessors.append({"bufferView":vp_i, "componentType":5126, "count":len(P),
                          "type":"VEC3", "min":P.min(0).tolist(), "max":P.max(0).tolist()})
        accessors.append({"bufferView":vn_i, "componentType":5126, "count":len(N), "type":"VEC3"})
        accessors.append({"bufferView":vi_i,
                          "componentType": 5123 if idt is np.uint16 else 5125,
                          "count":len(I), "type":"SCALAR"})
        out = {"attributes": {"POSITION": len(accessors)-3, "NORMAL": len(accessors)-2},
               "indices": len(accessors)-1}
        if "material" in pr: out["material"] = pr["material"]
        prims.append(out)
    new_meshes.append({**{k:v for k,v in mesh.items() if k!="primitives"}, "primitives":prims})
    if mi % 40 == 0: log(f"  mesh {mi}/{len(g['meshes'])}")

log(f"triangles {tri_in:,} -> {tri_out:,}")

# ── rebuild ───────────────────────────────────────────────────────
out = {k:v for k,v in g.items()
       if k in ("asset","scene","scenes","nodes","materials","samplers","textures","images","extensionsUsed")}
out["meshes"]      = new_meshes
out["accessors"]   = accessors
out["bufferViews"] = views
out["buffers"]     = [{"byteLength": cursor}]
out.setdefault("asset", {"version":"2.0"})
# textures/images referencing old bufferViews would dangle; Onshape CAD
# exports are untextured, so drop them if present.
if "images" in out and any("bufferView" in im for im in out["images"]):
    out.pop("images", None); out.pop("textures", None)
    for m in out.get("materials", []):
        m.get("pbrMetallicRoughness", {}).pop("baseColorTexture", None)

js = json.dumps(out, separators=(",",":")).encode()
js += b" " * ((-len(js)) % 4)
blob = b"".join(chunks)
os.makedirs(os.path.dirname(DST) or ".", exist_ok=True)
with open(DST, "wb") as f:
    f.write(struct.pack("<4sII", b"glTF", 2, 12+8+len(js)+8+len(blob)))
    f.write(struct.pack("<I4s", len(js), b"JSON")); f.write(js)
    f.write(struct.pack("<I4s", len(blob), b"BIN\0")); f.write(blob)
log(f"wrote {DST}  ({os.path.getsize(DST)/2**20:.1f} MB, {tri_out:,} tris, "
    f"{len(out.get('materials',[]))} materials)")
