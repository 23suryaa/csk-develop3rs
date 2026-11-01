# CSK Develop3rs — FTC Team 23441

A single-page static site. No build step, no npm, no framework.
Theme: white surfaces, fine borders, soft blue light — brand cyan
`#48C4FC` sampled straight from the team logo.

```
23441 website/
├── index.html          ← structure + all prose copy
├── robots.html         ← robots page (KHRONOS auto-loads; others click-to-load)
├── timeline.html       ← Season Timeline (SEASON_LOG in script.js)
├── gallery.html        ← photo gallery (GALLERY in script.js)
├── portfolios.html     ← engineering portfolios (PORTFOLIOS in script.js)
├── styles.css          ← all styling (colors & type at the very top)
├── script.js           ← TEAM / RECORD / STATS / POSTS / SPONSORS + behavior
├── tools/
│   ├── gltf_to_glb.py  ← repack Onshape .gltf (base64) into a real .glb
│   ├── stl_to_glb.py   ← STL → web GLB (weld + decimate)
│   └── build_levels.py ← uncompressed quality levels for comparison
└── assets/
    ├── logo.png        ← original white logo (for dark backgrounds)
    ├── logo-dark.png   ← recolored for white backgrounds ✓ in use
    ├── robot-color.glb ← interactive 3D robot, with real CAD colors
    ├── roboneer.glb    ← ROBONEER, same pipeline (source D:\SURYAA\ROBONEER.gltf)
    ├── robot.jpg       ← fallback photo (TODO — still missing)
    ├── team/           ← member photos
    └── sponsors/       ← sponsor logos
```

---

## Run it locally

**A web server is required** — browsers block `.glb` files over
`file://`, so double-clicking `index.html` shows the fallback instead of
the 3D robot.

```bash
python -m http.server 8823
```

Then open <http://127.0.0.1:8823>. Add `?debug=1` to reveal the mesh /
orientation dev panel on the robot viewer.

---

## Editing

### Content that rebuilds itself — `script.js`

Everything above the `END OF CONTENT` line is meant to be edited.

| Array / const  | Controls                                    |
|----------------|---------------------------------------------|
| `TEAM`         | Roster grid                                 |
| `STATS`        | Per-season OPR + world rank                 |
| `RECORD`       | Every event, award, and match record        |
| `POSTS`        | Season log entries                          |
| `SPONSORS`     | Sponsor tiers                               |
| `TEAM_EMAIL`   | Where the contact form goes                 |

### Prose — `index.html`

Search for `TODO` (~15 of them). Mostly robot specs, outreach numbers,
social handles, and roster size.

### Theme — `styles.css`

The `:root` block holds every color and font:

```css
--brand:   #48C4FC;  /* logo cyan — glows, highlights   */
--brand-2: #0A8BDE;  /* readable blue on white          */
--ink:     #0B1220;  /* headlines                       */
```

---

## Competition data is real

`RECORD` and `STATS` were pulled from the
[FTCScout API](https://api.ftcscout.org/rest/v1/teams/23441) on
**2026-07-26** — all 19 events across three seasons, with real rankings
and match records. Nothing is rounded up or invented.

Highlights already on the page:

| Season | OPR | World rank | Notes |
|--------|-----|-----------|-------|
| 2025–26 DECODE | 114.4 | #448 / 8,357 | Auto ranked #276 |
| 2024–25 INTO THE DEEP | 35.1 | #4,187 / 7,641 | Design Award |
| 2023–24 CENTERSTAGE | 45.9 | #2,288 / 6,664 | Rookie season |

Awards: Think Award (1st) at the LA Championship, Think Award (1st) +
Finalist Alliance at Palmdale, Design Award (1st) in 2024–25.

**Two events need checking.** `Western Edge Premier Event` (Long Beach,
2026-05-28) and `Canadian Rockies Premier Event @ KDays` (Edmonton,
2026-07-24) are listed on FTCScout with **no match data**. They're on the
page marked as such. If you didn't attend, delete those rows from
`RECORD`; if you did, add the results.

To refresh after a competition:

```bash
curl -s "https://api.ftcscout.org/rest/v1/teams/23441/events/2025"
curl -s "https://api.ftcscout.org/rest/v1/teams/23441/quick-stats?season=2025"
curl -s "https://api.ftcscout.org/rest/v1/teams/23441/awards"
```

(Use `curl`, not Python `urllib` — the API 403s on the default urllib
user agent.)

---

## The 3D robot

`assets/robot-color.glb` — drag to rotate, scroll to zoom, auto-rotates
when idle. Rendered by [`<model-viewer>`](https://modelviewer.dev).

### Why the GLTF export matters

The first attempt used `full robot.stl`. **STL cannot store color,
materials, or part boundaries** — it's a flat bag of triangles, so the
robot came out uniform grey with no way to recover the real appearance.

Your Onshape **GLTF** export carries 79 materials and 287 meshes, so the
robot renders in its actual CAD colors. Always export glTF/GLB, not STL,
when the model is destined for the web.

### Rebuilding after a CAD change — three commands

```bash
# 1. Onshape: right-click Assembly tab → Export → GLTF, Resolution Medium
#    Onshape embeds the buffer as base64 (~33% bloat). Repack to real GLB:
python tools/gltf_to_glb.py "full robot.gltf" "full robot.glb"

# 2. Merge primitives by material — kills draw calls, keeps instancing:
python tools/merge_prims.py "full robot.glb" assets/robot-merged.glb

# 3. Draco-compress. This is what makes it web-sized:
npx gltf-pipeline -i assets/robot-merged.glb -o assets/robot-color.glb -d \
  --draco.compressionLevel 7 --draco.quantizePositionBits 12 --draco.quantizeNormalBits 8

rm assets/robot-merged.glb "full robot.glb"    # intermediates, ~680 MB
```

**No decimation anywhere.** All 9,068,746 triangles from your CAD survive.

### Why this pipeline, and what didn't work

The first attempts decimated hard to hit a size target, which is what made
the robot look bad. Two things were actually wrong, neither of them
triangle count:

1. **81,774 primitives.** Onshape splits each mesh into hundreds of
   primitives. Describing them took **45.9 MB of JSON** — half the file was
   metadata — and cost **242,737 draw calls**, which no compression fixes.
   `merge_prims.py` groups primitives sharing a material within each mesh:
   **81,774 → 372**, JSON **45.9 MB → 947 KB**, in about 5 seconds.

2. **No compression.** Draco stores geometry at roughly 2 bytes/triangle
   versus ~28 raw. That alone is 252 MB → 17.3 MB.

Approaches that failed, so nobody repeats them:

- **gltfpack** traps with a WASM `unreachable` on this model at any size —
  it chokes on the primitive count, not the bytes.
- **Baking the scene graph flat** (`tools/flatten_glb.py`) collapses draw
  calls to ~79, but duplicates instanced geometry: 9M mesh triangles become
  63M real ones and it ran out of memory. Instancing is what keeps the file
  small — keep it.
- **Decimating first** plateaus around 1.4M triangles no matter how
  aggressive the settings, because each part is a separate closed shell.

### How it compares

Benchmarked against [ftc772.org](https://ftc772.org/robot/), which uses the
same `<model-viewer>` + Draco approach:

| | ftc772.org | This site |
|---|---|---|
| File size | 44.98 MB | **17.30 MB** |
| Mesh triangles | 11.4M | 9.07M |
| Rendered triangles | 50.1M | **63.0M** |
| Draw calls | 2,007 | **1,498** |

They serve theirs from Cloudflare, which is why it loads in ~1.3 s despite
being 45 MB. Hosting matters as much as file size — see below.

### Up-axis

CAD is Z-up, glTF is Y-up. If the robot loads on its side, open the page
with `?debug=1` and use **FLIP / SPIN** to find the right orientation,
then paste the readout into `index.html`:

```html
<model-viewer orientation="0deg 90deg 0deg" ...>
```

### Hosting the 17 MB model

Draco needs a decoder, which `<model-viewer>` fetches automatically from
Google's CDN — no setup, same as ftc772 does.

17.3 MB is fine on broadband and slow on venue wifi. Two things help a lot:

- **Put it behind a CDN.** Cloudflare Pages and Netlify both do this free
  and both serve GLB with compression. This matters more than shaving
  megabytes off the file.
- **Keep `assets/robot.jpg`.** It's the poster shown while the model
  streams, so the hero never looks empty.

If you later want a lightweight version for phones, re-run step 3 with
`--draco.quantizePositionBits 10`, or decimate `robot-merged.glb` before
compressing. Don't decimate the source — quality dies fast, as the earlier
attempts showed.

### Unused experiments

`tools/stl_to_glb.py`, `tools/build_levels.py`, and `tools/flatten_glb.py`
are from the STL path and the flattening attempt. They're kept because they
document what was tried, but **nothing in the current pipeline uses them.**
Only `gltf_to_glb.py` and `merge_prims.py` matter now.

---

## Before publishing

- [ ] Add `assets/robot.jpg` — it's the poster frame and the fallback
      when WebGL is unavailable
- [ ] Add `assets/sponsors/csk.png` (CSK Foundation logo)
- [ ] Replace every `TODO` in `index.html` and `script.js`
- [ ] Real names and roles in `TEAM`
- [ ] Confirm the two Premier Events above
- [ ] Confirm `TEAM_EMAIL` — currently a guess from the CSK Foundation domain
- [ ] Real Instagram / GitHub links
- [ ] Delete the `<div class="dbg">` block once you've settled the mesh
- [ ] Photo consent for any student under 18, per your policy
- [ ] Check it on a phone

**Do not deploy the big files.** `.gitignore` excludes the STL, the GLTF,
and `robot-max.glb`. GitHub hard-blocks anything over 100 MB, so
`robot-2m.glb` (137 MB) and `robot-max.glb` (922 MB) cannot be pushed at
all. Only `robot-color.glb` ships.

---

## Notes for whoever inherits this

- Nothing needs a build step. Edit, save, refresh.
- Text inserted from `script.js` is HTML-escaped, so an apostrophe or `&`
  in a name won't break the page.
- Respects `prefers-reduced-motion`.
- The white logo is invisible on white, so `assets/logo-dark.png` is a
  recolored variant (white letterforms → deep slate, cyan preserved).
  `assets/logo.png` is the original, for dark backgrounds.
- The FIRST® trademark disclaimer in the footer is required by FIRST's
  branding rules — leave it in.
