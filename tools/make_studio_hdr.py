"""
Generate a small studio HDR environment for the 3D viewer.

model-viewer's built-in "neutral" environment is a flat, even wash with no
bright sources in it. Specular highlights are *reflections of light sources* —
if the environment has none, lowering roughness does nothing and everything
reads as faint no matter how the materials are set.

This writes a compact equirectangular Radiance HDR containing three real
softboxes (key, fill, rim) over a graded sky. Because it is genuinely high
dynamic range — the key light is ~60x the background — metals get crisp
highlights and coloured plastics get a clean sheen.

256x128 keeps it around 128 KB, which is plenty: model-viewer prefilters the
map into mip levels for IBL, so resolution barely matters for the lighting.

Usage: python tools/make_studio_hdr.py assets/studio.hdr
"""
import sys, os
import numpy as np

DST = sys.argv[1] if len(sys.argv) > 1 else "assets/studio.hdr"
W, H = 256, 128

# equirectangular direction vectors
u = (np.arange(W) + 0.5) / W
v = (np.arange(H) + 0.5) / H
theta = (u * 2 - 1) * np.pi                 # azimuth, -pi..pi
phi   = (0.5 - v) * np.pi                   # elevation, +pi/2 (top) .. -pi/2
T, P = np.meshgrid(theta, phi)
D = np.stack([np.cos(P)*np.sin(T), np.sin(P), np.cos(P)*np.cos(T)], -1)

# ── graded sky: cool above, warm-neutral at the horizon, dark floor ──
# Kept deliberately dim. A bright uniform ambient lights every surface
# equally, which flattens form — the contrast has to come from the softboxes
# below, not from the sky.
t = np.clip((D[...,1] + 1) / 2, 0, 1)[..., None]
top    = np.array([0.20, 0.24, 0.31])
horiz  = np.array([0.30, 0.31, 0.34])
floor  = np.array([0.05, 0.05, 0.06])
img = np.where(t > 0.5, horiz + (top-horiz)*(t-0.5)*2, floor + (horiz-floor)*t*2)

def softbox(direction, intensity, tightness, tint=(1,1,1)):
    """A smooth bright blob centred on `direction`."""
    L = np.array(direction, float); L /= np.linalg.norm(L)
    dot = np.clip(D @ L, -1, 1)
    return (intensity * np.exp(-((1-dot)/tightness)))[..., None] * np.array(tint)

# key: high front-left, sharp enough to make a defined highlight
img += softbox((-0.55,  0.70,  0.45), 62.0, 0.015, (1.00, 0.99, 0.96))
# fill: opposite side, broad and soft, stops shadows going black
img += softbox(( 0.80,  0.40,  0.25), 13.0, 0.075, (0.95, 0.97, 1.00))
# rim: behind and above, separates the robot from a white page
img += softbox(( 0.05,  0.45, -0.90), 30.0, 0.030, (0.97, 0.99, 1.00))
# overhead bounce
img += softbox(( 0.00,  1.00,  0.00),  6.0, 0.220)

img = np.clip(img, 0, None)

# ── encode as Radiance RGBE ───────────────────────────────────────
m = img.max(-1)
out = np.zeros((H, W, 4), np.uint8)
nz = m > 1e-32
mant, expo = np.frexp(m[nz])                # m = mant * 2**expo, mant in [0.5,1)
scale = (mant * 256.0 / m[nz])[..., None]
out[nz, :3] = np.clip(img[nz] * scale, 0, 255).astype(np.uint8)
out[nz,  3] = (expo + 128).astype(np.uint8)

# A flat (non-RLE) scanline is misread as RLE if it happens to start with
# 0x02,0x02,<width hi>,<width lo>. Perturb any such pixel rather than risk it.
hi, lo = (W >> 8) & 0xFF, W & 0xFF
for y in range(H):
    if out[y,0,0] == 2 and out[y,0,1] == 2 and out[y,0,2] == hi and out[y,0,3] == lo:
        out[y,0,2] = max(0, int(out[y,0,2]) - 1)

os.makedirs(os.path.dirname(DST) or ".", exist_ok=True)
with open(DST, "wb") as f:
    f.write(b"#?RADIANCE\n")
    f.write(b"FORMAT=32-bit_rle_rgbe\n\n")
    f.write(f"-Y {H} +X {W}\n".encode())
    f.write(out.tobytes())

peak = float(img.max())
print(f"wrote {DST}  ({os.path.getsize(DST)/1024:.0f} KB, {W}x{H})")
print(f"dynamic range: background ~{float(np.median(img)):.2f} -> peak {peak:.1f}  ({peak/max(np.median(img),1e-6):.0f}x)")
