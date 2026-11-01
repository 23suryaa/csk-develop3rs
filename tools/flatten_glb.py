"""
Flatten a CAD scene graph into one mesh per material.

An Onshape assembly arrives as thousands of nodes referencing hundreds of
meshes, each split into hundreds of primitives. Even after decimation that
was 242,737 draw calls and 45.9 MB of JSON just to describe the accessors —
the scene graph, not the geometry, was the bottleneck.

This bakes every node's world transform into its vertices, concatenates
everything sharing a material, then decimates each merged bucket. Output is
one node, one mesh, and one primitive per material: ~79 draw calls instead
of a quarter million, and the JSON shrinks to a few kilobytes.

Usage: python tools/flatten_glb.py in.glb out.glb 600000
"""
import sys, os, json, struct, time
from collections import defaultdict
import numpy as np
import fast_simplification

t0 = time.time()
def log(m): print(f"[{time.time()-t0:6.1f}s] {m}", flush=True)

SRC    = sys.argv[1] if len(sys.argv) > 1 else "assets/robot-color.glb"
DST    = sys.argv[2] if len(sys.argv) > 2 else "assets/robot-web.glb"
TARGET = int(sys.argv[3]) if len(sys.argv) > 3 else 600_000

CT = {5120:np.int8,5121:np.uint8,5122:np.int16,5123:np.uint16,5125:np.uint32,5126:np.float32}
NC = {"SCALAR":1,"VEC2":2,"VEC3":3,"VEC4":4,"MAT4":16}

raw  = open(SRC,"rb").read()
jlen = struct.unpack("<I", raw[12:16])[0]
g    = json.loads(raw[20:20+jlen])
BIN  = raw[20+jlen+8 : 20+jlen+8+struct.unpack("<I", raw[20+jlen:20+jlen+4])[0]]
log(f"loaded {len(raw)/2**20:.1f} MB · {len(g.get('materials',[]))} materials")

def acc(i):
    a=g["accessors"][i]; bv=g["bufferViews"][a["bufferView"]]
    dt=np.dtype(CT[a["componentType"]]).newbyteorder("<"); n=NC[a["type"]]
    off=bv.get("byteOffset",0)+a.get("byteOffset",0)
    st=bv.get("byteStride")
    if st and st!=dt.itemsize*n:
        out=np.empty((a["count"],n),dt)
        for k in range(a["count"]): out[k]=np.frombuffer(BIN,dt,n,off+k*st)
        return out
    return np.frombuffer(BIN,dt,a["count"]*n,off).reshape(a["count"],n)

def node_matrix(n):
    if "matrix" in n:
        return np.array(n["matrix"], np.float64).reshape(4,4).T   # glTF is column-major
    M = np.eye(4)
    if "scale" in n:       M = np.diag([*n["scale"],1.0]) @ M
    if "rotation" in n:
        x,y,z,w = n["rotation"]
        R = np.array([
            [1-2*(y*y+z*z), 2*(x*y-z*w),   2*(x*z+y*w)],
            [2*(x*y+z*w),   1-2*(x*x+z*z), 2*(y*z-x*w)],
            [2*(x*z-y*w),   2*(y*z+x*w),   1-2*(x*x+y*y)]], np.float64)
        T = np.eye(4); T[:3,:3] = R; M = T @ M
    if "translation" in n:
        T = np.eye(4); T[:3,3] = n["translation"]; M = T @ M
    return M

# ── pass 1: record instances only (cheap — no geometry yet) ───────
plan = defaultdict(list)          # material -> [(primitive, matrix), ...]
stats = {"inst":0, "tris":0}

def walk(i, parent):
    n = g["nodes"][i]
    M = parent @ node_matrix(n)
    if "mesh" in n:
        stats["inst"] += 1
        for pr in g["meshes"][n["mesh"]]["primitives"]:
            if pr.get("mode",4) != 4 or "POSITION" not in pr["attributes"]: continue
            cnt = (g["accessors"][pr["indices"]]["count"]//3 if "indices" in pr
                   else g["accessors"][pr["attributes"]["POSITION"]]["count"]//3)
            plan[pr.get("material",-1)].append((pr, M))
            stats["tris"] += cnt
    for c in n.get("children",[]): walk(c, M)

for s in g.get("scenes",[{"nodes":[]}]):
    for r in s.get("nodes",[]): walk(r, np.eye(4))
log(f"planned {stats['inst']:,} instances · {stats['tris']:,} rendered triangles · {len(plan)} materials")

share = TARGET / max(stats["tris"], 1)
CAP = 2_500_000     # never hold more than this many triangles at once

def weld_decimate(P, F, target):
    """Weld coincident vertices, drop degenerates, decimate toward target."""
    q = np.round(P.astype(np.float64) * 1e5).astype(np.int64)
    _, first, inv = np.unique(q.view([('', q.dtype)]*3).ravel(),
                              return_index=True, return_inverse=True)
    P = np.ascontiguousarray(P[first]); F = inv[F]
    good = (F[:,0]!=F[:,1]) & (F[:,1]!=F[:,2]) & (F[:,0]!=F[:,2])
    F = F[good]
    if len(F) == 0: return P, F
    for _ in range(3):
        if len(F) <= target: break
        before = len(F)
        try:
            vp, vf = fast_simplification.simplify(P, F.astype(np.int32),
                                                  1.0 - target/len(F), agg=8)
            P, F = np.asarray(vp, np.float32), np.asarray(vf, np.int64)
        except Exception: break
        if len(F) >= before*0.93: break
    return P, F

def build_bucket(items):
    """Bake + merge instances, decimating whenever the buffer gets large."""
    Ps, Fs, n, held = [], [], 0, 0
    curP = curF = None
    for pr, M in items:
        P = acc(pr["attributes"]["POSITION"]).astype(np.float64)
        F = (acc(pr["indices"]).reshape(-1,3).astype(np.int64) if "indices" in pr
             else np.arange(len(P),dtype=np.int64).reshape(-1,3))
        P = ((P @ M[:3,:3].T) + M[:3,3]).astype(np.float32)
        Ps.append(P); Fs.append(F + n); n += len(P); held += len(F)
        if held > CAP:
            P2 = np.concatenate(Ps); F2 = np.concatenate(Fs)
            Ps, Fs = [], []
            if curP is not None:
                F2 = F2 + len(curP)
                P2 = np.concatenate([curP, P2]); F2 = np.concatenate([curF, F2])
            curP, curF = weld_decimate(P2, F2, max(int(len(F2)*share), 8))
            n, held = len(curP), 0
            Ps, Fs, n = [curP], [curF], len(curP)
            curP = curF = None
    P = np.concatenate(Ps); F = np.concatenate(Fs)
    return weld_decimate(P, F, max(int(len(F)*share*1.0), 8))
chunks, accessors, views = [], [], []
cursor = 0
def push(a):
    global cursor
    b = np.ascontiguousarray(a).tobytes(); pad=(-len(b))%4
    views.append({"buffer":0,"byteOffset":cursor,"byteLength":len(b)})
    chunks.append(b+b"\0"*pad); cursor += len(b)+pad
    return len(views)-1

prims, total = [], 0
import gc
for bi, (mat, items) in enumerate(sorted(plan.items(), key=lambda kv: -len(kv[1]))):
    P, F = build_bucket(items)
    gc.collect()
    if len(F) == 0: continue

    fn = np.cross(P[F[:,1]]-P[F[:,0]], P[F[:,2]]-P[F[:,0]])
    N  = np.zeros_like(P)
    for k in range(3): np.add.at(N, F[:,k], fn)
    ln = np.linalg.norm(N,axis=1,keepdims=True)
    N  = np.divide(N,ln,out=np.zeros_like(N),where=ln>0).astype(np.float32)

    idt = np.uint16 if len(P) < 65536 else np.uint32
    I   = np.ascontiguousarray(F.reshape(-1).astype(idt))
    P   = np.ascontiguousarray(P, np.float32)

    ip, inn, ii = push(P), push(N), push(I)
    accessors += [
      {"bufferView":ip,"componentType":5126,"count":len(P),"type":"VEC3",
       "min":P.min(0).tolist(),"max":P.max(0).tolist()},
      {"bufferView":inn,"componentType":5126,"count":len(N),"type":"VEC3"},
      {"bufferView":ii,"componentType":5123 if idt is np.uint16 else 5125,
       "count":len(I),"type":"SCALAR"}]
    pr = {"attributes":{"POSITION":len(accessors)-3,"NORMAL":len(accessors)-2},
          "indices":len(accessors)-1}
    if mat >= 0: pr["material"] = mat
    prims.append(pr); total += len(F)

log(f"merged into {len(prims)} primitives · {total:,} triangles")

out = {
  "asset": g.get("asset", {"version":"2.0"}),
  "scene": 0, "scenes":[{"nodes":[0]}],
  "nodes":[{"mesh":0,"name":"robot"}],
  "meshes":[{"name":"robot","primitives":prims}],
  "materials": g.get("materials", []),
  "accessors": accessors, "bufferViews": views,
  "buffers":[{"byteLength":cursor}],
}
for m in out["materials"]:
    m.pop("pbrMetallicRoughness",{}).pop("baseColorTexture",None) if False else None
    m.setdefault("doubleSided", True)

js = json.dumps(out, separators=(",",":")).encode(); js += b" "*((-len(js))%4)
blob = b"".join(chunks)
with open(DST,"wb") as f:
    f.write(struct.pack("<4sII", b"glTF",2,12+8+len(js)+8+len(blob)))
    f.write(struct.pack("<I4s",len(js),b"JSON")); f.write(js)
    f.write(struct.pack("<I4s",len(blob),b"BIN\0")); f.write(blob)
log(f"wrote {DST} ({os.path.getsize(DST)/2**20:.2f} MB · JSON {len(js)/1024:.0f} KB · "
    f"{total:,} tris · {len(prims)} draw calls)")
