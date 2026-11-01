"""
Merge primitives within each mesh, by material — the ftc772.org approach.

The earlier mistake was baking every node's transform to flatten the scene.
That collapses draw calls but duplicates instanced geometry: 9M mesh
triangles become 63M rendered ones, and no compression saves you after that.

Instancing is what keeps the file small, so keep it. The actual problem is
that Onshape emits ~81,774 separate primitives across 287 meshes, which costs
242,737 draw calls and 45.9 MB of JSON just to describe.

So: leave nodes and instancing untouched, and only merge primitives that sit
in the same mesh and share a material. Original vertex normals are carried
through unchanged, so shading quality is exactly what Onshape exported.

No decimation at all — Draco does the size work afterwards.

Usage: python tools/merge_prims.py "full robot.glb" assets/robot-merged.glb
"""
import sys, os, json, struct, time
from collections import defaultdict
import numpy as np

t0 = time.time()
def log(m): print(f"[{time.time()-t0:6.1f}s] {m}", flush=True)

SRC = sys.argv[1] if len(sys.argv) > 1 else "full robot.glb"
DST = sys.argv[2] if len(sys.argv) > 2 else "assets/robot-merged.glb"

CT = {5120:np.int8,5121:np.uint8,5122:np.int16,5123:np.uint16,5125:np.uint32,5126:np.float32}
NC = {"SCALAR":1,"VEC2":2,"VEC3":3,"VEC4":4}

raw  = open(SRC,"rb").read()
jlen = struct.unpack("<I", raw[12:16])[0]
g    = json.loads(raw[20:20+jlen])
BIN  = raw[20+jlen+8 : 20+jlen+8+struct.unpack("<I", raw[20+jlen:20+jlen+4])[0]]
log(f"loaded {len(raw)/2**20:.1f} MB · {len(g['meshes'])} meshes · "
    f"{sum(len(m['primitives']) for m in g['meshes']):,} primitives")

def acc(i):
    a=g["accessors"][i]; bv=g["bufferViews"][a["bufferView"]]
    dt=np.dtype(CT[a["componentType"]]).newbyteorder("<"); n=NC[a["type"]]
    off=bv.get("byteOffset",0)+a.get("byteOffset",0); st=bv.get("byteStride")
    if st and st!=dt.itemsize*n:
        out=np.empty((a["count"],n),dt)
        for k in range(a["count"]): out[k]=np.frombuffer(BIN,dt,n,off+k*st)
        return out
    return np.frombuffer(BIN,dt,a["count"]*n,off).reshape(a["count"],n)

chunks, accessors, views = [], [], []
cursor = 0
def push(a):
    global cursor
    b=np.ascontiguousarray(a).tobytes(); pad=(-len(b))%4
    views.append({"buffer":0,"byteOffset":cursor,"byteLength":len(b)})
    chunks.append(b+b"\0"*pad); cursor+=len(b)+pad
    return len(views)-1

new_meshes, tris, out_prims = [], 0, 0
for mi, mesh in enumerate(g["meshes"]):
    groups = defaultdict(list)
    for pr in mesh["primitives"]:
        if pr.get("mode",4)!=4 or "POSITION" not in pr["attributes"]: continue
        groups[pr.get("material",-1)].append(pr)

    prims=[]
    for mat, plist in groups.items():
        Ps, Ns, Fs, base = [], [], [], 0
        has_n = all("NORMAL" in p["attributes"] for p in plist)
        for pr in plist:
            P = acc(pr["attributes"]["POSITION"]).astype(np.float32)
            F = (acc(pr["indices"]).reshape(-1).astype(np.int64) if "indices" in pr
                 else np.arange(len(P), dtype=np.int64))
            Ps.append(P); Fs.append(F + base)
            if has_n: Ns.append(acc(pr["attributes"]["NORMAL"]).astype(np.float32))
            base += len(P)
        P = np.concatenate(Ps); I = np.concatenate(Fs)
        N = np.concatenate(Ns) if has_n else None
        tris += len(I)//3

        idt = np.uint16 if len(P) < 65536 else np.uint32
        I = np.ascontiguousarray(I.astype(idt))
        ip = push(np.ascontiguousarray(P))
        accessors.append({"bufferView":ip,"componentType":5126,"count":len(P),
                          "type":"VEC3","min":P.min(0).tolist(),"max":P.max(0).tolist()})
        attrs={"POSITION":len(accessors)-1}
        if N is not None:
            inn=push(np.ascontiguousarray(N))
            accessors.append({"bufferView":inn,"componentType":5126,"count":len(N),"type":"VEC3"})
            attrs["NORMAL"]=len(accessors)-1
        ii=push(I)
        accessors.append({"bufferView":ii,
                          "componentType":5123 if idt is np.uint16 else 5125,
                          "count":len(I),"type":"SCALAR"})
        pr_out={"attributes":attrs,"indices":len(accessors)-1}
        if mat>=0: pr_out["material"]=mat
        prims.append(pr_out); out_prims+=1

    new_meshes.append({**{k:v for k,v in mesh.items() if k!="primitives"},"primitives":prims})
    if mi % 50 == 0: log(f"  mesh {mi}/{len(g['meshes'])}")

log(f"primitives {sum(len(m['primitives']) for m in g['meshes']):,} -> {out_prims:,} · {tris:,} mesh triangles")

out = {k:v for k,v in g.items() if k in ("asset","scene","scenes","nodes","materials")}
out.setdefault("asset", {"version":"2.0"})
out["meshes"]=new_meshes; out["accessors"]=accessors
out["bufferViews"]=views; out["buffers"]=[{"byteLength":cursor}]
for m in out.get("materials",[]): m.setdefault("doubleSided", True)

js=json.dumps(out,separators=(",",":")).encode(); js+=b" "*((-len(js))%4)
blob=b"".join(chunks)
os.makedirs(os.path.dirname(DST) or ".", exist_ok=True)
with open(DST,"wb") as f:
    f.write(struct.pack("<4sII",b"glTF",2,12+8+len(js)+8+len(blob)))
    f.write(struct.pack("<I4s",len(js),b"JSON")); f.write(js)
    f.write(struct.pack("<I4s",len(blob),b"BIN\0")); f.write(blob)
log(f"wrote {DST} ({os.path.getsize(DST)/2**20:.2f} MB · JSON {len(js)/1024:.0f} KB · {out_prims:,} primitives)")
