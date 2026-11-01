"""
Repack a .gltf with a base64-embedded buffer into a real .glb.

Onshape emits the whole mesh buffer as a `data:` URI, which makes the
file ~33% larger than the data it holds and forces any downstream tool
to hold both the base64 text and the decoded bytes at once. gltfpack's
WASM build runs out of memory on that. Converting to GLB first — where
the buffer is a raw binary chunk — avoids the problem entirely.

Usage: python tools/gltf_to_glb.py "full robot.gltf" "full robot.glb"
"""
import sys, os, json, base64, struct, mmap, time

t0 = time.time()
def log(m): print(f"[{time.time()-t0:6.1f}s] {m}", flush=True)

SRC = sys.argv[1] if len(sys.argv) > 1 else "full robot.gltf"
DST = sys.argv[2] if len(sys.argv) > 2 else "full robot.glb"

f  = open(SRC, "rb")
mm = mmap.mmap(f.fileno(), 0, access=mmap.ACCESS_READ)
log(f"source {os.path.getsize(SRC)/2**20:.1f} MB")

MARK = b"data:application/octet-stream;base64,"
i = mm.find(MARK)
if i < 0:
    sys.exit("No base64 buffer found — is it already a .glb, or using an external .bin?")
b64_start = i + len(MARK)
b64_end   = mm.find(b'"', b64_start)          # payload runs to the closing quote
log(f"base64 payload {(b64_end-b64_start)/2**20:.1f} MB")

# Decode straight to a temp file in 4-char-aligned chunks so we never
# hold the decoded buffer and the base64 text in memory together.
tmp = DST + ".bin.tmp"
CH  = 24_000_000                               # multiple of 4
written = 0
with open(tmp, "wb") as out:
    p = b64_start
    while p < b64_end:
        n = min(CH, b64_end - p)
        n -= n % 4
        if n == 0:
            n = b64_end - p
        out.write(base64.b64decode(mm[p:p+n]))
        p += n
        written = out.tell()
log(f"decoded to {written/2**20:.1f} MB")

# Rebuild the JSON with the giant string removed.
head = bytes(mm[:b64_start - len(MARK)])
tail = bytes(mm[b64_end:])
mm.close(); f.close()
g = json.loads(head + tail)
g["buffers"] = [{"byteLength": written}]       # GLB buffer 0 = the BIN chunk
log(f"json rebuilt ({len(g.get('meshes',[]))} meshes, {len(g.get('materials',[]))} materials)")

js = json.dumps(g, separators=(",", ":")).encode()
js += b" " * ((-len(js)) % 4)
bin_pad = (-written) % 4
total = 12 + 8 + len(js) + 8 + written + bin_pad

with open(DST, "wb") as o:
    o.write(struct.pack("<4sII", b"glTF", 2, total))
    o.write(struct.pack("<I4s", len(js), b"JSON")); o.write(js)
    o.write(struct.pack("<I4s", written + bin_pad, b"BIN\0"))
    with open(tmp, "rb") as b:
        while (c := b.read(1 << 24)):
            o.write(c)
    o.write(b"\0" * bin_pad)
os.remove(tmp)
log(f"wrote {DST}  ({os.path.getsize(DST)/2**20:.1f} MB)")
