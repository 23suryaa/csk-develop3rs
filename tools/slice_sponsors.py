"""
Cut the sponsor logo sheet into individual transparent PNGs.

The sheet is a 5x2 grid of black artwork on white, but a purely automatic
split does not survive it: several logos have parts that overlap their
neighbour's row (goBILDA's symbol carries a long descender, the dot over
INTUITIVE's i sits up in goBILDA's band, and cnc madness's flare spikes
reach up beside onshape). So each logo gets a hand-set search region and
the script tightens it to the real ink bounds — regions only need to be
roughly right, and being generous is safe.

Two logos share the far-right region and cannot be split by geometry,
because the flare crosses between them. They separate cleanly by tone
instead: onshape is printed very pale, cnc madness is solid black, so a
luminance band picks out one and leaves the other.

Transparency is derived from luminance rather than keyed on a colour:
alpha = how far the pixel sits from white, RGB forced to black. That
keeps antialiased edges clean instead of leaving a white fringe around
every letter once the logo sits on a coloured background.

    python tools/slice_sponsors.py sponsors.png assets/sponsors
"""
import sys, os
import numpy as np
from PIL import Image

SRC = sys.argv[1] if len(sys.argv) > 1 else "sponsors.png"
OUT = sys.argv[2] if len(sys.argv) > 2 else "assets/sponsors"
PAD = 8            # transparent margin kept around each crop

# name, list of search boxes (x0, y0, x1, y1), luminance window = ink.
# Most logos need one box. Two need two, because goBILDA's symbol hangs
# down beside the dot of INTUITIVE's i — they share a band of rows and
# only separate by column, so each claims its own slice of it.
SOLID = (0, 200)   # normal black artwork
PALE  = (200, 253) # onshape, printed almost white
REGIONS = [
    ("rev",        [(  80, 300,  340, 430)],                          SOLID),
    ("haas",       [( 360, 300,  660, 430)],                          SOLID),
    ("softbox",    [( 685, 315,  975, 405)],                          SOLID),
    ("gobilda",    [(1010, 315, 1310, 400), (1010, 400, 1100, 436)],  SOLID),
    ("onshape",    [(1320, 315, 1605, 400)],                          PALE),
    ("first",      [(  70, 455,  360, 545)],                          SOLID),
    ("4aisoft",    [( 370, 455,  650, 545)],                          SOLID),
    ("csk",        [( 685, 412,  975, 550)],                          SOLID),
    ("intuitive",  [(1140, 404, 1185, 437), (1010, 437, 1310, 550)],  SOLID),
    ("cncmadness", [(1320, 350, 1800, 560)],                          SOLID),
]

img = Image.open(SRC).convert("RGB")
a   = np.asarray(img).astype(np.float32)
lum = 0.2126 * a[:, :, 0] + 0.7152 * a[:, :, 1] + 0.0722 * a[:, :, 2]
print(f"{SRC}  {img.width}x{img.height}\n")

os.makedirs(OUT, exist_ok=True)
for name, boxes, (lo, hi) in REGIONS:
    ink = (lum >= lo) & (lum <= hi)
    mask = np.zeros_like(ink)
    for x0, y0, x1, y1 in boxes:
        mask[y0:y1, x0:x1] = ink[y0:y1, x0:x1]
    if not mask.any():
        print(f"  {name:12} NOTHING FOUND in {boxes}")
        continue

    ys, xs = np.flatnonzero(mask.any(axis=1)), np.flatnonzero(mask.any(axis=0))
    crop   = lum[ys[0]:ys[-1] + 1, xs[0]:xs[-1] + 1]
    keep   = mask[ys[0]:ys[-1] + 1, xs[0]:xs[-1] + 1]

    # Alpha is distance from white. A pale logo would come out at ~4%
    # opacity, so its range is stretched back to full — the artwork is
    # flat colour, so this restores density without inventing detail.
    alpha = np.where(keep, 255.0 - crop, 0.0)
    peak  = alpha.max()
    if peak < 200:
        alpha *= 255.0 / peak
        print(f"  {name:12} pale source (peak alpha {peak:.0f}/255) — normalised")

    h, w = alpha.shape
    rgba = np.zeros((h + PAD * 2, w + PAD * 2, 4), np.uint8)
    rgba[PAD:PAD + h, PAD:PAD + w, 3] = np.clip(alpha, 0, 255).astype(np.uint8)

    path = os.path.join(OUT, name + ".png")
    Image.fromarray(rgba, "RGBA").save(path)
    print(f"  {name:12} {w:4}x{h:<4} at ({xs[0]},{ys[0]})  -> {path}")
