"""
Give an Onshape glTF export usable PBR materials, and deepen its colours.

Two problems with a raw Onshape export:

1. Every material is metallicFactor 0 / roughnessFactor 1 — perfectly matte,
   zero specular response. Nothing catches a highlight, so nothing reads as
   having shape.

2. Onshape's default appearances are very pale. The large panels on this
   robot are [0.79, 0.82, 0.93] — a near-white blue at 86% lightness. On a
   white page that is indistinguishable from washed out.

Colours are classified by CHROMA (max channel - min channel), not by HLS
saturation. HLS saturation is inflated near white: [0.97, 0.98, 1.00] scores
1.00 there despite being visually white, which caused whites to be treated as
saturated colours and left the actual blues untouched.

For genuine colours, chroma is scaled up and luminance pulled down — pale
tints have to get *darker* to read as colours at all. Neutrals are split into
white / aluminium / dark, since forcing white plastic to metallic makes it
render dark (a metal has no diffuse term).

Only the JSON chunk is rewritten; Draco payloads pass through byte-for-byte.

Usage: python tools/tune_materials.py assets/robot-color.glb [chroma] [maxlum]
"""
import sys, os, json, struct

SRC    = sys.argv[1] if len(sys.argv) > 1 else "assets/robot-color.glb"
CHROMA = float(sys.argv[2]) if len(sys.argv) > 2 else 2.40   # colour intensity multiplier
MAXLUM = float(sys.argv[3]) if len(sys.argv) > 3 else 0.66   # ceiling for coloured parts

NEUTRAL   = 0.055   # chroma below this = neutral
LIGHT_CUT = 0.72    # neutral above this luminance = white plastic
DARK_CUT  = 0.24    # neutral below this = black plastic / motors

def lum(c): return 0.2126*c[0] + 0.7152*c[1] + 0.0722*c[2]

raw  = open(SRC, "rb").read()
jlen = struct.unpack("<I", raw[12:16])[0]
g    = json.loads(raw[20:20+jlen])
rest = raw[20+jlen:]                       # BIN chunk, untouched

n = {"colour":0, "white":0, "metal":0, "dark":0}
for m in g.get("materials", []):
    p = m.setdefault("pbrMetallicRoughness", {})
    c = (p.get("baseColorFactor") or [1,1,1,1])
    rgb, alpha = c[:3], (c[3] if len(c) > 3 else 1.0)
    chroma = max(rgb) - min(rgb)
    L = lum(rgb)

    if chroma >= NEUTRAL:
        # push the colour away from grey, then darken it so it reads as
        # a colour rather than a tint — pale blues must get deeper
        boosted = [L + (v - L) * CHROMA for v in rgb]
        bl = lum(boosted)
        if bl > 1e-6:
            k = min(L, MAXLUM) / bl
            boosted = [v * k for v in boosted]
        p["baseColorFactor"] = [min(max(v, 0.0), 1.0) for v in boosted] + [alpha]
        p["roughnessFactor"] = 0.30
        p["metallicFactor"]  = 0.06
        n["colour"] += 1
    elif L >= LIGHT_CUT:
        # white plastic / polycarb / prints — dielectric, colour untouched
        p["roughnessFactor"] = 0.26
        p["metallicFactor"]  = 0.03
        n["white"] += 1
    elif L <= DARK_CUT:
        # black plastic, motors, servos — glossy but not metal
        p["roughnessFactor"] = 0.30
        p["metallicFactor"]  = 0.30
        n["dark"] += 1
    else:
        # mid greys are aluminium and steel in an FTC build
        p["roughnessFactor"] = 0.17
        p["metallicFactor"]  = 0.88
        n["metal"] += 1
    m.setdefault("doubleSided", True)

js = json.dumps(g, separators=(",", ":")).encode()
js += b" " * ((-len(js)) % 4)
with open(SRC, "wb") as f:
    f.write(struct.pack("<4sII", b"glTF", 2, 12 + 8 + len(js) + len(rest)))
    f.write(struct.pack("<I4s", len(js), b"JSON"))
    f.write(js)
    f.write(rest)

print(f"chroma x{CHROMA}, luminance capped at {MAXLUM}")
print(f"  coloured {n['colour']:3}   metallic 0.06  roughness 0.30  (deepened)")
print(f"  white    {n['white']:3}   metallic 0.03  roughness 0.26  (colour untouched)")
print(f"  metal    {n['metal']:3}   metallic 0.88  roughness 0.17")
print(f"  dark     {n['dark']:3}   metallic 0.30  roughness 0.30")
print(f"-> {os.path.getsize(SRC)/2**20:.2f} MB")
