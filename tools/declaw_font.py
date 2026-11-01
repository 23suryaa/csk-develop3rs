"""
Remove Supercharge's lightning-bolt flourishes by clipping outlines at the
baseline.

The bolts on A T Q V W X etc. are drawn into the letter outlines — there is
no GSUB table, so no stylistic alternate can switch them off. They are the
only thing in the font below y=0 (the whole -466 descent exists for them).

CSS clipping at the baseline isn't enough: each bolt's top edge runs ALONG
y=0 (on the T, from (552,0) to (814,0)), so a horizontal sliver survives.
This clips the contours themselves against the half-plane y >= 0, which
drops those edges as well.

Curves are preserved: in these glyphs every segment that crosses the
baseline is a straight line, so the intersection maths is exact. Any glyph
whose crossing segments involve an off-curve point is skipped and reported.

Writes a new font — the original file is not modified.

Usage: python tools/declaw_font.py superchargeexpand.ttf assets/fonts/
"""
import sys, os
from fontTools.ttLib import TTFont
from fontTools.pens.ttGlyphPen import TTGlyphPen

SRC = sys.argv[1] if len(sys.argv) > 1 else "superchargeexpand.ttf"
OUT = sys.argv[2] if len(sys.argv) > 2 else "assets/fonts/"
Y = 0                                   # clip plane: the baseline

f = TTFont(SRC)
glyf, cmap = f["glyf"], f.getBestCmap()

def clip(pts, flags):
    """Sutherland-Hodgman against y >= Y, carrying on/off-curve flags."""
    out_p, out_f, n, skipped = [], [], len(pts), False
    for i in range(n):
        cx, cy = pts[i];        cf = flags[i]
        px, py = pts[i-1];      pf = flags[i-1]
        cin, pin = cy >= Y, py >= Y
        if cin != pin:
            # segment crosses the plane — exact only for a straight line
            if not (cf & 1) or not (pf & 1):
                skipped = True
            t = (Y - py) / (cy - py)
            out_p.append((round(px + (cx - px) * t), Y)); out_f.append(1)
        if cin:
            out_p.append((int(cx), int(cy))); out_f.append(cf)
    return out_p, out_f, skipped

changed, skipped = [], []
for code, gn in sorted(cmap.items()):
    g = glyf[gn]
    if g.numberOfContours <= 0 or g.yMin >= Y:
        continue
    g.expand(glyf)
    coords, ends, flags = g.getCoordinates(glyf)
    pen, start, bad = TTGlyphPen(None), 0, False
    for e in ends:
        p, fl, sk = clip(list(coords[start:e+1]), list(flags[start:e+1]))
        bad |= sk
        if len(p) >= 3:
            pen.moveTo(p[0])
            i = 1
            while i < len(p):
                if fl[i] & 1:
                    pen.lineTo(p[i]); i += 1
                else:                       # quadratic: control + endpoint
                    nxt = p[(i+1) % len(p)]
                    pen.qCurveTo(p[i], nxt); i += 2
            pen.closePath()
        start = e + 1
    if bad:
        skipped.append(chr(code)); continue
    glyf[gn] = pen.glyph()
    glyf[gn].recalcBounds(glyf)
    changed.append(chr(code))

# ── port kerning into GPOS ────────────────────────────────────────
# The font ships 1663 pairs in a legacy `kern` table and no GPOS. Browsers
# read kerning from GPOS and ignore the legacy table, so none of it was
# being applied — "AM" has a -82 pair that was silently dropped, which is
# what made the letter spacing look uneven.
if "kern" in f and "GPOS" not in f:
    from fontTools.feaLib.builder import addOpenTypeFeaturesFromString
    pairs = {p: v for p, v in f["kern"].kernTables[0].kernTable.items() if v}
    order = set(f.getGlyphOrder())
    lines = [f"pos {l} {r} {v};" for (l, r), v in pairs.items()
             if l in order and r in order]
    addOpenTypeFeaturesFromString(f, "feature kern {\n" + "\n".join(lines) + "\n} kern;")
    print(f"  ported {len(lines)} kern pairs into GPOS")

# the descent existed purely for the bolts, so tighten the vertical metrics
f["hhea"].descent = 0
f["OS/2"].usWinDescent = 0
f["OS/2"].sTypoDescender = 0
f["head"].yMin = min(glyf[g].yMin for g in glyf.keys()
                     if glyf[g].numberOfContours > 0)

for name, sub in (("name", 1), ("full", 4), ("ps", 6)):
    pass
for rec in f["name"].names:
    try:
        v = rec.toUnicode()
    except Exception:
        continue
    if rec.nameID in (1, 3, 4, 6):
        rec.string = v.replace("Supercharge", "Supercharge NB")   # No Bolts

os.makedirs(OUT, exist_ok=True)
base = os.path.join(OUT, "supercharge-expanded")
for flavor, ext in ((None, ".ttf"), ("woff2", ".woff2"), ("woff", ".woff")):
    f.flavor = flavor
    f.save(base + ext)
    print(f"  {base+ext:44} {os.path.getsize(base+ext)/1024:5.0f} KB")

print(f"\nclipped {len(changed)} glyphs: {''.join(changed)}")
if skipped:
    print(f"skipped (curve crosses baseline): {''.join(skipped)}")
print("new yMin:", f["head"].yMin, "| hhea descent:", f["hhea"].descent)
