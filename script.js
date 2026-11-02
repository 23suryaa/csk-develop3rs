/* ══════════════════════════════════════════════════════════════════
   CSK DEVELOP3RS · FTC 23441

   ┌─────────────────────────────────────────────────────────────┐
   │  EDIT THE CONTENT BLOCK BELOW. The page rebuilds itself.    │
   │  No build step — save and reload.                           │
   │                                                             │
   │  The hero stat row is hand-written in index.html from the   │
   │  FTCScout API as of 2026-07-26.                             │
   │  https://api.ftcscout.org/rest/v1/teams/23441               │
   └─────────────────────────────────────────────────────────────┘
   ══════════════════════════════════════════════════════════════════ */

/* ═══════════════════ CONTENT — EDIT FREELY ═══════════════════════ */

/* ── ROSTER ───────────────────────────────────────────────────────
   From the TEAM MEMBERS sheet. photo: "assets/team/name.jpg" (4:5
   portrait, head near the top), or "" for an initials monogram.
   note: specialty, shown on the back of the card — "" to hide.
   group: "coach" → first row, "captain" → second row, anything else
   (or nothing) → the last row.  */
const TEAM = [
  { name: "Chandra A.",       role: "Head Coach",   group: "coach",   photo: "assets/team/chandra.jpg",      note: "" },
  { name: "Ramakrishnan N.",  role: "Head Coach",   group: "coach",   photo: "assets/team/ramakrishnan.jpg", note: "" },
  { name: "Suryaa R.",        role: "Team Captain & Primary Driver", group: "captain", photo: "assets/team/suryaa.jpg",       note: "CAD Design & Mechanics Subsystem Coordinator" },
  { name: "Pranav A.",        role: "Team Captain & Drive Coach", group: "captain", photo: "assets/team/pranav.jpg",       note: "Tele-Op Programming & Camera Vision" },
  { name: "Sachin S.",        role: "Mechanics Head & Secondary Driver", photo: "assets/team/sachin.jpg",     note: "Robot Construction & CAD Design" },
  { name: "Aahan N.",         role: "Programming Head & Drive Coach", photo: "assets/team/aahan.jpg",    note: "Autonomous Programming & Robot Localization" },
  { name: "Anish R.",         role: "Engineering Portfolio Head & Mechanics Member", photo: "assets/team/anish.jpg", note: "Portfolio Development & Robot Construction" },
  { name: "Krish B.",         role: "Programming Member & Outreach Member", photo: "assets/team/krish.jpg", note: "Subsystem Programming & Portfolio Development" },
  { name: "Ankit C.",         role: "Outreach Member & Finances", photo: "assets/team/ankit.jpg", note: "Communications & Fundraising" },
];

const SPONSORS = [
  { tier: "Title Sponsor", cls: "tier--title", items: [
      { name: "CSK Foundation",       logo: "assets/sponsors/csk.png",       url: "https://cskfoundation.org" },
  ]},
  { tier: "Supporting Sponsors", cls: "", items: [
      { name: "Intuitive Foundation", logo: "assets/sponsors/intuitive.png", url: "https://www.intuitive-foundation.org" },
      { name: "Gene Haas Foundation", logo: "assets/sponsors/haas.png",      url: "https://www.ghaasfoundation.org" },
      { name: "Softbox LLC",          logo: "assets/sponsors/softbox.png",   url: "" },   // TODO: no site found
      { name: "4aiSoft",              logo: "assets/sponsors/4aisoft.png",   url: "https://www.4aisoft.com" },
      { name: "CNC Madness",          logo: "assets/sponsors/cncmadness.png", url: "https://cncmadness.com" },
  ]},
  { tier: "Partners & Tools", cls: "", items: [
      { name: "Onshape",              logo: "assets/sponsors/onshape.png",   url: "https://www.onshape.com" },
      { name: "REV Robotics",         logo: "assets/sponsors/rev.png",       url: "https://www.revrobotics.com" },
      { name: "goBILDA",              logo: "assets/sponsors/gobilda.png",   url: "https://www.gobilda.com" },
      { name: "FIRST",                logo: "assets/sponsors/first.png",     url: "https://www.firstinspires.org" },
  ]},
];

/* ── SEASON TIMELINE (timeline.html) ────────────────────────────────
   From the Robotics Content Breakdown. One timeline per season,
   newest first, split into meets.
     { meet: "Meet 1", date: "2024-11-17", photos: [ … ] }  a point on the
         line; photos whose story happens AT that meet sit on the point.
     { photo, title, text }  a moment between two meets.
   photo: base path — "-sm.webp" is used on the line, ".webp" full size.
   Meet dates are from FTCScout.  */
const SEASON_LOG = [
  { id: "decode", name: "DECODE", years: "2025–2026", stops: [
      { meet: "Season Kickoff" },
      { meet: "Meet 0", date: "2025-10-25", photos: [
        { photo: "assets/log/07", title: "Roboneer (24 Hour Build Robot) at Meet 0", text: "Ranked 1st Place." },
      ]},
      { photo: "assets/log/08", title: "Khronos v1", text: "Intake subsystem initial testing phase with visual LED feedback." },
      { photo: "assets/log/09", title: "Khronos v1", text: "Full robot hardware + software completion. Ready for Meet 1." },
      { meet: "Meet 1", date: "2025-11-15", photos: [
        { photo: "assets/log/10", title: "Khronos v2 Running at Meet 1", text: "Intake speed and autonomous software upgrades." },
      ]},
      { meet: "Meet 2", date: "2025-12-06", photos: [
        { photo: "assets/log/11", title: "Southern California Match-Point Record", text: "Set at Meet 2 with Team 30099 OmicronX." },
      ]},
      { meet: "Meet 3", date: "2025-12-20", photos: [
        { photo: "assets/log/12", title: "Driving Team Parking Robot during Match 5", text: "Competing at Meet 3." },
      ]},
      { meet: "InterLeague Tournament", date: "2026-02-14", photos: [
        { photo: "assets/log/13", title: "InterLeague Tournament Judging Pit", text: "Completed Khronos with reinforced carbon fiber CNC plates." },
        { photo: "assets/log/14", title: "Finalist Alliance and Think Award Winners", text: "InterLeague Tournament. Advancing to the State Competition." },
      ]},
      { photo: "assets/log/15", title: "Celebratory Dinner Post-ILTs", text: "Hotpot with the team." },
      { meet: "State Championship", date: "2026-03-07", photos: [
        { photo: "assets/log/16", title: "State Tournament Judging Pit", text: "12-foot-tall design poster. 8 total banners." },
        { photo: "assets/log/17", title: "State Tournament 1st Place Think Award Winners", text: "" },
      ]},
  ]},
  { id: "into-the-deep", name: "INTO THE DEEP", years: "2024–2025", stops: [
      { meet: "Season Kickoff" },
      { photo: "assets/log/01", title: "Setting up Outtake Slides for v1 of the ORCA", text: "Belting slides and Virtual Four Bar." },
      { photo: "assets/log/02", title: "First Iteration of the ORCA Completed", text: "Intake v1, servo powered. Utilized a Virtual Four Bar." },
      { meet: "Meet 1", date: "2024-11-17", photos: [
        { photo: "assets/log/03", title: "Making Adjustments to v1 ORCA at Meet 1", text: "First competition of the season." },
      ]},
      { meet: "Meet 2", date: "2024-12-08" },
      { photo: "assets/log/04", title: "Finished ORCA v2", text: "Ready for competition with an improved outtake system and a more efficient intake with software automations." },
      { meet: "Meet 3", date: "2025-01-26", photos: [
        { photo: "assets/log/05", title: "On the Way to Meet 3", text: "Final competition before the InterLeague Tournament." },
      ]},
      { meet: "InterLeague Tournament", date: "2025-02-16", photos: [
        { photo: "assets/log/06", title: "Post InterLeague Tournament", text: "Design Award 1st Place Winner." },
      ]},
  ]},
];

/* Gallery (gallery.html) — photos only, no captions. */
// Starts at 02: photo 01 was a duplicate of 05 (same shot twice in the PDF).
const GALLERY = Array.from({ length: 16 }, (_, i) => `assets/gallery/${String(i + 2).padStart(2, '0')}`);

/* Engineering portfolios (portfolios.html). pages: rendered page images
   in assets/portfolio/<key>/NN.webp (+ -sm.webp thumbnails). */
const PORTFOLIOS = [
  { key: "decode", name: "DECODE",        years: "2025–2026", robot: "KHRONOS", pages: 16,
    pdf: "assets/portfolio/CSK-Develop3rs-Portfolio-DECODE-2025-26.pdf", size: "12 MB" },
  { key: "itd",    name: "Into The Deep", years: "2024–2025", robot: "ORCA",    pages: 16,
    pdf: "assets/portfolio/CSK-Develop3rs-Portfolio-Into-The-Deep-2024-25.pdf", size: "11 MB" },
];

/* Contact form target. Leave FORM_ENDPOINT empty to open the
   visitor's email client; paste a Formspree URL for real delivery. */
const TEAM_EMAIL    = "cskdevelop3rsftc@gmail.com";
const FORM_ENDPOINT = "";                              // TODO: optional

/* ═════════════════ END OF CONTENT — logic below ══════════════════ */


const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = s => String(s).replace(/[&<>"']/g, c =>
  ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));

const initials = n => n.trim().split(/\s+/).slice(0,2).map(w => w[0]||'').join('').toUpperCase() || '?';
const fmtDate = iso => {
  const d = new Date(iso + 'T00:00:00');
  return isNaN(d) ? iso : d.toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' });
};

/* Swap a missing image for text. A real listener, not inline
   onerror, so names containing quotes stay safe. */
function wireFallbacks(root) {
  $$('img[data-fallback]', root).forEach(img => {
    img.addEventListener('error', () => {
      const s = document.createElement('span');
      s.className = img.dataset.fallbackClass || '';
      s.textContent = img.dataset.fallback;
      img.replaceWith(s);
    }, { once: true });
  });
}

/* ── roster ─────────────────────────────────────────────────────── */
/* Row 1: coaches + captains. Row 2: everyone else. */
const TEAM_ROWS = [['coach', 'captain'], ['member']];
const FLIP_ICON = `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M2.5 6.5a5.5 5.5 0 0 1 10-2.2M13.5 9.5a5.5 5.5 0 0 1-10 2.2"/><path d="M12.8 1.8v2.8H10M3.2 14.2v-2.8H6"/></svg>`;

function memberCard(m, i) {
  const pic = m.photo
    ? `<img src="${esc(m.photo)}" alt="${esc(m.name)}" loading="lazy"
            data-fallback="${esc(initials(m.name))}" data-fallback-class="mbr__mono">`
    : `<span class="mbr__mono">${esc(initials(m.name))}</span>`;
  return `
    <article class="mbr" data-reveal style="--d:${(i % 5) * 70}ms"
             tabindex="0" role="button" aria-pressed="false" aria-label="${esc(m.name)}, ${esc(m.role)} — flip for details">
      <div class="mbr__inner">
        <div class="mbr__face mbr__front">
          <div class="mbr__pic">${pic}</div>
          <div class="mbr__body">
            <h3 class="mbr__name">${esc(m.name)}</h3>
            <span class="mbr__role">${esc(m.role)}</span>
          </div>
          <span class="mbr__glare"></span>
          <span class="mbr__flip" aria-hidden="true">${FLIP_ICON}<b>Flip</b></span>
        </div>
        <div class="mbr__face mbr__back" aria-hidden="true">
          ${m.photo ? `<img class="mbr__bimg" src="${esc(m.photo)}" alt="" loading="lazy">` : ''}
          <span class="mbr__big">${esc(initials(m.name))}</span>
          <span class="mbr__kicker">CSK Develop3rs · 23441</span>
          <h3 class="mbr__bname">${esc(m.name)}</h3>
          <span class="mbr__role">${esc(m.role)}</span>
          ${m.note ? `<div class="mbr__spec"><span>Specialty</span><p>${esc(m.note)}</p></div>` : ''}
        </div>
      </div>
    </article>`;
}

function renderTeam() {
  const host = $('#roster'); if (!host) return;
  host.innerHTML = TEAM_ROWS.map(groups => {
    const list = TEAM.filter(m => groups.includes(['coach', 'captain'].includes(m.group) ? m.group : 'member'));
    return list.length ? `<div class="roster__row">${list.map(memberCard).join('')}</div>` : '';
  }).join('');
  wireFallbacks(host);
  initTeamCards(host);
}

/* Hover: the card tilts toward the cursor and a soft light follows it.
   Click / Enter / Space: flips to the back. Mouse only for the tilt —
   on touch the tap just flips. */
function initTeamCards(host) {
  const still = matchMedia('(prefers-reduced-motion:reduce)').matches;
  $$('.mbr', host).forEach(card => {
    const inner = $('.mbr__inner', card);
    const reset = () => {
      card.classList.remove('is-hover');
      inner.style.setProperty('--rx', '0deg'); inner.style.setProperty('--ry', '0deg');
    };
    if (!still) {
      card.addEventListener('pointermove', e => {
        if (e.pointerType !== 'mouse') return;
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
        card.classList.add('is-hover');
        inner.style.setProperty('--ry', `${((x - .5) * 16).toFixed(2)}deg`);
        inner.style.setProperty('--rx', `${((.5 - y) * 12).toFixed(2)}deg`);
        card.style.setProperty('--mx', `${(x * 100).toFixed(1)}%`);
        card.style.setProperty('--my', `${(y * 100).toFixed(1)}%`);
      });
      card.addEventListener('pointerleave', reset);
    }
    let t;
    const flip = () => {
      const on = card.classList.toggle('is-flipped');
      card.setAttribute('aria-pressed', on);
      card.classList.add('is-flipping');
      clearTimeout(t); t = setTimeout(() => card.classList.remove('is-flipping'), 760);
    };
    card.addEventListener('click', flip);
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); flip(); }
    });
  });
}

/* ── season timeline (timeline.html) ──────────────────────────────────
   Vertical line per season. Meets are labelled markers on the line;
   photos taken AT a meet branch off its marker, photos from between
   meets sit on smaller dots in between. Hover grows a photo; click opens
   the shared full view. */
const EXPAND_ICON = `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9.5 2.5h4v4M6.5 13.5h-4v-4M13.5 2.5L9 7M2.5 13.5L7 9"/></svg>`;

const logTile = (m, k, side) => `
  <div class="tl__pin tl__pin--${side}">
    <button type="button" class="tl__tile" data-k="${k}" aria-label="${esc(m.title)} — open">
      <img class="tl__img" src="${esc(m.photo)}-sm.webp" alt="${esc(m.title)}" loading="lazy">
      <span class="tl__view">${EXPAND_ICON}View</span>
    </button>
  </div>`;

function renderTimeline() {
  const host = $('#timeline'); if (!host) return;
  const all = [];
  host.innerHTML = SEASON_LOG.map(s => {
    let flip = 0, last = '';
    const put = (m, where) => all.push({ ...m, season: s, where }) - 1;
    const rows = s.stops.map(st => {
      if (st.meet) {
        last = st.meet;
        const date = st.date ? fmtDate(st.date) : '';
        const where = date ? `${st.meet} · ${date}` : st.meet;
        const ph = (st.photos || []).map(m => [m, put(m, where)]);
        // Two photos: one each side of the line. One: alternate sides.
        let L = '', R = '';
        if (ph.length >= 2) { L = logTile(...ph[0], 'l'); R = ph.slice(1).map(p => logTile(...p, 'r')).join(''); }
        else if (ph.length) { flip++ % 2 ? (R = logTile(...ph[0], 'r')) : (L = logTile(...ph[0], 'l')); }
        return `
          <div class="tl__row tl__row--meet${ph.length ? '' : ' is-bare'}" role="listitem">
            <div class="tl__meet"><b>${esc(st.meet)}</b>${date ? `<span>${esc(date)}</span>` : ''}</div>
            ${ph.length ? `<div class="tl__side tl__side--l">${L}</div>
            <span class="tl__dot tl__dot--meet" aria-hidden="true"></span>
            <div class="tl__side tl__side--r">${R}</div>` : ''}
          </div>`;
      }
      const k = put(st, `After ${last}`), r = flip++ % 2;
      return `
        <div class="tl__row" role="listitem">
          <div class="tl__side tl__side--l">${r ? '' : logTile(st, k, 'l')}</div>
          <span class="tl__dot" aria-hidden="true"></span>
          <div class="tl__side tl__side--r">${r ? logTile(st, k, 'r') : ''}</div>
        </div>`;
    }).join('');
    return `
      <section class="tl-season" id="${esc(s.id)}">
        <header class="tl-season__head">
          <span class="sec__eyebrow">${esc(s.years)}</span>
          <h2 class="sec__title sec__title--display">${esc(s.name)}</h2>
        </header>
        <div class="tl" role="list"><span class="tl__fill" aria-hidden="true"></span>${rows}</div>
      </section>`;
  }).join('');

  // Each row slides in from its side as it scrolls into view.
  const io = new IntersectionObserver((es, obs) => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('is-in'); obs.unobserve(e.target); }
  }), { rootMargin: '0px 0px -10% 0px', threshold: 0.12 });
  $$('.tl__row', host).forEach(el => io.observe(el));

  // The blue line fills to the middle of the screen; points it has passed light up.
  const lines = $$('.tl', host);
  let ticking = false;
  const paint = () => {
    ticking = false;
    const mid = innerHeight * 0.55;
    lines.forEach(l => {
      const r = l.getBoundingClientRect();
      l.style.setProperty('--p', Math.min(1, Math.max(0, (mid - r.top) / r.height)).toFixed(4));
      $$('.tl__row', l).forEach(row => row.classList.toggle('is-past', row.getBoundingClientRect().top + 24 < mid));
    });
  };
  const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(paint); } };
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', onScroll);
  paint();

  const list = all.map(m => ({
    src: m.photo + '.webp', title: m.title, text: m.text, date: m.where,
    eyebrow: `${esc(m.season.name)}<span>${esc(m.season.years)}</span>`,
  }));
  host.addEventListener('click', e => {
    const t = e.target.closest('.tl__tile'); if (t) openViewer(list, +t.dataset.k, t);
  });
}

/* ── gallery (gallery.html) ── photos only; click for the full view. */
function renderGallery() {
  const host = $('#gallery'); if (!host) return;
  host.innerHTML = GALLERY.map((p, i) => `
    <button type="button" class="gal__item" data-k="${i}" style="--i:${i % 6}" aria-label="Open photo ${i + 1} of ${GALLERY.length}">
      <img src="${esc(p)}-sm.webp" alt="CSK Develop3rs gallery photo ${i + 1}" loading="lazy">
    </button>`).join('');
  const io = new IntersectionObserver((es, obs) => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('is-in'); obs.unobserve(e.target); }
  }), { threshold: 0.1 });
  $$('.gal__item', host).forEach(el => io.observe(el));
  const list = GALLERY.map((p, i) => ({ src: p + '.webp', label: `${i + 1} / ${GALLERY.length}` }));
  host.addEventListener('click', e => {
    const t = e.target.closest('.gal__item'); if (t) openViewer(list, +t.dataset.k, t, 'photo');
  });
}

/* ── engineering portfolios (portfolios.html) ── */
function renderPortfolios() {
  const host = $('#portfolios'); if (!host) return;
  const pad = n => String(n).padStart(2, '0');
  host.innerHTML = PORTFOLIOS.map((p, i) => `
    <article class="pf" data-reveal style="--d:${i * 90}ms">
      <button type="button" class="pf__cover" data-pf="${i}" aria-label="Read the ${esc(p.name)} portfolio">
        <span class="pf__sheet pf__sheet--2" aria-hidden="true"></span>
        <span class="pf__sheet pf__sheet--1" aria-hidden="true"></span>
        <img src="assets/portfolio/${esc(p.key)}/01-sm.webp" alt="${esc(p.name)} portfolio cover" loading="lazy">
        <span class="tl__view">${EXPAND_ICON}Read</span>
      </button>
      <div class="pf__body">
        <span class="sec__eyebrow">${esc(p.name)}<span>${esc(p.years)}</span></span>
        <h2 class="pf__title">${esc(p.robot)} Engineering Portfolio</h2>
        <p class="pf__meta">${p.pages} pages</p>
        <div class="pf__acts">
          <button type="button" class="btn btn--primary" data-pf="${i}">Read portfolio</button>
          <a class="btn btn--ghost" href="${esc(p.pdf)}" download>Download PDF <small>${esc(p.size)}</small></a>
        </div>
      </div>
    </article>`).join('');
  observeReveals();
  host.addEventListener('click', e => {
    const b = e.target.closest('[data-pf]'); if (!b) return;
    const p = PORTFOLIOS[+b.dataset.pf];
    const pages = Array.from({ length: p.pages }, (_, n) => ({
      src: `assets/portfolio/${p.key}/${pad(n + 1)}.webp`, label: `Page ${n + 1} / ${p.pages}` }));
    openViewer(pages, 0, $('.pf__cover', b.closest('.pf')), 'page');
  });
}

/* ── full view ──────────────────────────────────────────────────────
   One viewer for the season timeline (photo + story), the gallery (photo),
   the portfolios (page) and the About garage clip (video). Grows out of
   whatever was clicked and shrinks back into it; ← → and Esc work while
   it's open. onClose runs once it has shrunk back. */
let viewer = null;
function openViewer(list, k, fromEl, mode = 'story', onClose) {
  if (!viewer) viewer = buildViewer();
  viewer.open(list, k, fromEl, mode, onClose);
}

function buildViewer() {
  const view = document.createElement('div');
  view.className = 'tlm'; view.hidden = true;
  view.setAttribute('role', 'dialog'); view.setAttribute('aria-modal', 'true'); view.setAttribute('aria-labelledby', 'tlm-title');
  const arrow = d => `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="${d}"/></svg>`;
  view.innerHTML = `
    <div class="tlm__bg" data-close></div>
    <article class="tlm__card">
      <button type="button" class="tlm__x" data-close aria-label="Close">${arrow('M4 4l8 8M12 4l-8 8')}</button>
      <div class="tlm__media"><img class="tlm__img" alt=""><video class="tlm__vid" controls playsinline preload="auto" hidden></video></div>
      <div class="tlm__body">
        <span class="sec__eyebrow tlm__season"></span>
        <span class="tlm__date"></span>
        <h3 class="tlm__title" id="tlm-title"></h3>
        <p class="tlm__text"></p>
        <div class="tlm__nav">
          <button type="button" class="tlm__btn" data-step="-1" aria-label="Previous">${arrow('M10 3L5 8l5 5')}</button>
          <span class="tlm__count"></span>
          <button type="button" class="tlm__btn" data-step="1" aria-label="Next">${arrow('M6 3l5 5-5 5')}</button>
        </div>
      </div>
    </article>`;
  document.body.appendChild(view);
  const card = $('.tlm__card', view), img = $('.tlm__img', view), vid = $('.tlm__vid', view);
  const still = matchMedia('(prefers-reduced-motion:reduce)').matches;
  let list = [], cur = 0, from = null, onClose = null;

  const fill = k => {
    const m = list[k]; cur = k;
    img.hidden = !!m.video; vid.hidden = !m.video;
    if (m.video) {
      if (vid.getAttribute('src') !== m.video) vid.src = m.video;
      vid.poster = m.poster || ''; vid.currentTime = m.start || 0;
      view.style.setProperty('--ar', m.ar || 16 / 9);
      vid.setAttribute('aria-label', m.label || '');
    } else {
      vid.pause();
      img.src = m.src; img.alt = m.title || m.label || '';
    }
    $('.tlm__season', view).innerHTML = m.eyebrow || '';
    $('.tlm__date', view).textContent = m.date || '';
    $('.tlm__title', view).textContent = m.title || '';
    $('.tlm__text', view).textContent = m.text || '';
    $('.tlm__count', view).textContent = m.label || `${k + 1} / ${list.length}`;
    // Preload the neighbours so prev / next is instant.
    [k - 1, k + 1].forEach(n => { const o = list[(n + list.length) % list.length]; if (o?.src) new Image().src = o.src; });
  };

  // Grow the card out of the clicked element (FLIP), or shrink back into it.
  const morph = (el, opening) => {
    if (still || !el || !el.isConnected) return Promise.resolve();
    const a = el.getBoundingClientRect(), b = card.getBoundingClientRect();
    const t = `translate(${a.left - b.left}px, ${a.top - b.top}px) scale(${a.width / b.width}, ${a.height / b.height})`;
    card.style.transformOrigin = '0 0';
    return card.animate(opening ? [{ transform: t, opacity: .35 }, { transform: 'none', opacity: 1 }]
                                : [{ transform: 'none', opacity: 1 }, { transform: t, opacity: 0 }],
      { duration: opening ? 520 : 380, easing: 'cubic-bezier(.2,.8,.2,1)' }).finished;
  };

  const close = async () => {
    if (view.hidden) return;
    view.classList.remove('is-open');
    vid.pause();
    await morph(from, false);
    view.hidden = true; document.documentElement.classList.remove('tlm-lock');
    from?.focus?.({ preventScroll: true });
    onClose?.(vid.hidden ? 0 : vid.currentTime); onClose = null;
  };
  const step = d => {
    if (list.length < 2) return;
    const k = (cur + d + list.length) % list.length;
    card.classList.add('is-swapping');
    setTimeout(() => { fill(k); card.classList.remove('is-swapping'); }, still ? 0 : 160);
  };

  view.addEventListener('click', e => {
    if (e.target.closest('[data-close]')) close();
    const b = e.target.closest('[data-step]'); if (b) step(+b.dataset.step);
  });
  addEventListener('keydown', e => {
    if (view.hidden) return;
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowRight') step(1);
    else if (e.key === 'ArrowLeft') step(-1);
  });

  return {
    open(l, k, el, mode, done) {
      list = l; from = el; onClose = done || null;
      view.dataset.mode = mode;
      fill(k);
      // Start with sound straight away, while the click still counts as a
      // user gesture — browsers block audible play() otherwise.
      if (list[k].video) { vid.muted = false; vid.play().catch(() => {}); }
      view.hidden = false; document.documentElement.classList.add('tlm-lock');
      requestAnimationFrame(() => view.classList.add('is-open'));
      morph(el, true).then(() => $('.tlm__x', view).focus({ preventScroll: true }));
    },
  };
}

/* ── about videos (index.html) ─────────────────────────────────────
   Each garage clip plays muted on a loop (the only way browsers allow
   autoplay). Click opens it in the full view, picking up from the same
   moment with sound; closing it resumes the silent loop from wherever
   the viewer stopped. */
function initAboutVideo() {
  const still = matchMedia('(prefers-reduced-motion:reduce)').matches;
  $$('.about-video').forEach(btn => {
    const clip = $('video', btn);
    if (still) { clip.removeAttribute('autoplay'); clip.pause(); }
    btn.addEventListener('click', () => {
      clip.pause();
      openViewer([{ video: clip.currentSrc || clip.src, poster: clip.poster, start: clip.currentTime,
                    ar: clip.videoWidth / clip.videoHeight || clip.width / clip.height,
                    label: btn.dataset.label || '' }], 0, btn, 'video',
        t => { clip.currentTime = t; if (!still) clip.play().catch(() => {}); });
    });
  });
}

/* ── sponsor wall ───────────────────────────────────────────────────
   One flat grid, laid out like the sheet the logos came from: no cards,
   no tier headings, just the marks on the page. Tier order is kept, so
   the title sponsor still leads. */
function renderSponsors() {
  const host = $('#tiers'); if (!host) return;
  host.innerHTML = SPONSORS.flatMap(t => t.items).map(sp => {
    const inner = sp.logo
      ? `<img src="${esc(sp.logo)}" alt="${esc(sp.name)}" loading="lazy"
              data-fallback="${esc(sp.name)}" data-fallback-class="wall__name">`
      : `<span class="wall__name">${esc(sp.name)}</span>`;
    return sp.url
      ? `<a class="wall__item" href="${esc(sp.url)}" target="_blank" rel="noopener"
            title="${esc(sp.name)}">${inner}</a>`
      : `<span class="wall__item" title="${esc(sp.name)}">${inner}</span>`;
  }).join('');
  wireFallbacks(host);
}

/* ── sponsor ticker ─────────────────────────────────────────────────
   Every tier goes in here, tools included — a marquee wants length.  */
const TICKER = {
  logo:   33,   // row height — logos fit inside it (px)
  pad:    16,   // bar padding above and below the row (px)
  gap:    74,   // space between items (px)
  speed:  33,   // pixels per second
  alpha: 0.64,  // logo opacity at rest
  fade:    4,   // % of the bar each end dissolves over
  label:   14,  // "Sponsored by" size (px)
};

/* logo height and padding set the bar height, which the hero subtracts
   from its own — so they go on :root, not on the bar itself */
function applyTicker() {
  const r = document.documentElement.style;
  r.setProperty('--tk-logo',  TICKER.logo + 'px');
  r.setProperty('--tk-pad',   TICKER.pad + 'px');
  r.setProperty('--tk-gap',   TICKER.gap + 'px');
  r.setProperty('--tk-alpha', TICKER.alpha);
  r.setProperty('--tk-fade',  TICKER.fade + '%');
  r.setProperty('--tk-label', TICKER.label + 'px');
}

// set by renderTicker so the tuner can re-measure after a size change
let refitTicker = null;

function renderTicker() {
  const win = $('#ticker'), track = $('#ticker-track');
  if (!win || !track) return;

  const items = SPONSORS.flatMap(t => t.items);
  if (!items.length) { win.remove(); return; }

  const cell = sp => {
    const inner = sp.logo
      ? `<img src="${esc(sp.logo)}" alt="${esc(sp.name)}" loading="lazy"
              data-fallback="${esc(sp.name)}">`
      : esc(sp.name);
    return sp.url
      ? `<a class="ticker__item" href="${esc(sp.url)}" target="_blank" rel="noopener">${inner}</a>`
      : `<span class="ticker__item">${inner}</span>`;
  };
  const once = items.map(cell).join('');

  // Lay one pass down first so it can be measured. With only a handful of
  // sponsors a single pass is narrower than the bar, which would leave a
  // visible hole mid-loop — so repeat it until it covers the width, then
  // mirror the whole thing. The -50% slide needs two identical halves.
  const fit = () => {
    track.innerHTML = once;
    const one = track.scrollWidth;
    if (!one) return;
    const reps = Math.max(1, Math.ceil(win.clientWidth / one) + 1);
    const half = once.repeat(reps);
    track.innerHTML = half + `<span aria-hidden="true" style="display:contents">${half}</span>`;
    track.style.setProperty('--tk-dur', (one * reps) / TICKER.speed + 's');
    wireFallbacks(track);
  };

  applyTicker();
  refitTicker = fit;
  fit();
  // logos and the display face both change the measurement
  if (document.fonts?.ready) document.fonts.ready.then(fit);
  let t; addEventListener('resize', () => { clearTimeout(t); t = setTimeout(fit, 180); });
}

const TICKER_SPEC = [
  ['logo',  'Logo height',  16, 120,  1,    'px'],
  ['pad',   'Bar padding',   0,  80,  1,    'px'],
  ['gap',   'Spacing',      10, 200,  2,    'px'],
  ['speed', 'Speed',         4, 160,  1,    'px/s'],
  ['alpha', 'Logo opacity',  0.1, 1,  0.01, ''],
  ['fade',  'Edge fade',     0,  25,  0.5,  '%'],
  ['label', 'Label size',    8,  20,  0.5,  'px'],
];

function initTickerTuner() {
  if (!new URLSearchParams(location.search).has('ticker')) {
    console.info('[23441] add ?ticker=1 to adjust the sponsor bar');
    return;
  }
  const el = document.createElement('aside');
  el.className = 'cam cam--left';
  el.style.maxHeight = 'calc(100vh - 110px)';
  el.style.overflowY = 'auto';
  el.innerHTML = '<b>Sponsor bar</b>' + TICKER_SPEC.map(sp =>
    `<label>${esc(sp[1])} <span id="tv-${sp[0]}"></span><input type="range" id="ts-${sp[0]}" min="${sp[2]}" max="${sp[3]}" step="${sp[4]}"></label>`
  ).join('') + '<button type="button" class="btn btn--primary" id="tk-copy">Copy settings</button>';
  document.body.appendChild(el);

  TICKER_SPEC.forEach(([k, , , , , unit]) => {
    const i = $(`#ts-${k}`, el), o = $(`#tv-${k}`, el);
    i.value = TICKER[k];
    o.textContent = TICKER[k] + (unit || '');
    i.addEventListener('input', () => {
      TICKER[k] = parseFloat(i.value);
      o.textContent = TICKER[k] + (unit || '');
      applyTicker();
      // height, spacing and speed all change the loop length
      if (k === 'logo' || k === 'gap' || k === 'speed') refitTicker?.();
    });
  });
  $('#tk-copy', el).addEventListener('click', async () => {
    const txt = 'const TICKER = ' + JSON.stringify(TICKER, null, 2) + ';';
    try { await navigator.clipboard.writeText(txt); } catch { console.log(txt); }
    const b = $('#tk-copy', el), old = b.textContent;
    b.textContent = 'Copied';
    setTimeout(() => { b.textContent = old; }, 1600);
  });
}

/* ── scroll reveal ──────────────────────────────────────────────── */
let revealObserver;
function observeReveals() {
  if (!('IntersectionObserver' in window)) {
    $$('[data-reveal]').forEach(el => el.classList.add('is-in')); return;
  }
  revealObserver ||= new IntersectionObserver((es, obs) => {
    es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('is-in'); obs.unobserve(e.target); } });
  }, { rootMargin: '0px 0px -10% 0px', threshold: 0.06 });
  $$('[data-reveal]:not(.is-in)').forEach(el => revealObserver.observe(el));
}

/* ── header + scrollspy ─────────────────────────────────────────── */
function initHeader() {
  const hdr = $('#hdr');
  const links = $$('.nav a[href^="#"]');
  const secs = links.map(a => ({ a, sec: $(a.getAttribute('href')) })).filter(x => x.sec);
  const onScroll = () => {
    hdr.classList.toggle('is-stuck', window.scrollY > 16);
    const y = window.scrollY + window.innerHeight * 0.3;
    let cur = null;
    for (const { a, sec } of secs) if (sec.offsetTop <= y) cur = a;
    links.forEach(a => a.classList.toggle('is-active', a === cur));
  };
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ── mobile menu ────────────────────────────────────────────────── */
function initMenu() {
  const burger = $('#burger'), nav = $('#nav');
  if (!burger || !nav) return;
  const setOpen = o => {
    nav.classList.toggle('is-open', o);
    burger.setAttribute('aria-expanded', String(o));
    burger.setAttribute('aria-label', o ? 'Close menu' : 'Open menu');
    document.body.classList.toggle('is-locked', o);
  };
  burger.addEventListener('click', () => setOpen(!nav.classList.contains('is-open')));
  nav.addEventListener('click', e => { if (e.target.tagName === 'A') setOpen(false); });
  addEventListener('keydown', e => { if (e.key === 'Escape') setOpen(false); });
  matchMedia('(min-width:1020px)').addEventListener('change', e => { if (e.matches) setOpen(false); });
}

/* ── counters ───────────────────────────────────────────────────── */
function initCounters() {
  const els = $$('[data-count]');
  if (!els.length || !('IntersectionObserver' in window)) return;
  if (matchMedia('(prefers-reduced-motion:reduce)').matches) return;
  const io = new IntersectionObserver((es, obs) => {
    es.forEach(e => {
      if (!e.isIntersecting) return;
      obs.unobserve(e.target);
      const el = e.target, raw = el.dataset.count;
      const end = Number(raw) || 0;
      const dp = (raw.split('.')[1] || '').length;     // keep "5.4" as 5.4
      const t0 = performance.now();
      const tick = now => {
        const p = Math.min((now - t0) / 1100, 1);
        const v = end * (1 - Math.pow(1 - p, 3));
        el.textContent = dp
          ? v.toFixed(dp)
          : Math.round(v).toLocaleString();
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
  }, { threshold: .5 });
  els.forEach(el => io.observe(el));
}

/* ── contact form ───────────────────────────────────────────────── */
function initForm() {
  const form = $('#form'), note = $('#form-note');
  if (!form) return;
  form.addEventListener('submit', async e => {
    e.preventDefault();
    note.classList.remove('err');
    let bad = null;
    $$('input,textarea', form).forEach(f => {
      const ok = f.checkValidity();
      f.classList.toggle('invalid', !ok);
      if (!ok && !bad) bad = f;
    });
    if (bad) { note.textContent = 'Please fill in the highlighted fields.'; note.classList.add('err'); bad.focus(); return; }

    const d = Object.fromEntries(new FormData(form).entries());
    if (FORM_ENDPOINT) {
      note.textContent = 'Sending…';
      try {
        const res = await fetch(FORM_ENDPOINT, { method:'POST', headers:{Accept:'application/json'}, body:new FormData(form) });
        if (!res.ok) throw new Error(res.status);
        form.reset(); note.textContent = '✓ Message sent — we usually reply within a few days.';
      } catch {
        note.textContent = 'Send failed. Email us directly at ' + TEAM_EMAIL;
        note.classList.add('err');
      }
      return;
    }
    const subject = `[FTC 23441] ${d.topic || 'Website enquiry'} — ${d.name}`;
    const body = `${d.message}\n\n—\n${d.name}\n${d.email}`;
    location.href = `mailto:${TEAM_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    note.textContent = '✓ Opening your email app… if nothing happens, write to ' + TEAM_EMAIL;
  });
}

/* ══════════════════════════════════════════════════════════════════
   MATERIAL TUNING

   The shipped .glb keeps Onshape's original materials (metallic 0,
   roughness 1 — perfectly matte) so there is one clean baseline, and
   these values are applied over the top at runtime. Editing TUNE is
   therefore always non-destructive: nothing compounds, and the .glb
   never needs rebuilding to change how the robot looks.

   Materials are classified by CHROMA (max channel - min channel), not
   HLS saturation — saturation is inflated near white, so [0.97,0.98,1.0]
   scores 1.0 there despite being visually white.

   These values were dialled in on the real model. Edit them here.
   ══════════════════════════════════════════════════════════════════ */
const TUNE = {
  // classification thresholds
  chromaCut:  0.135,   // above this a material counts as coloured
  lightCut:   0.72,    // neutral above this luminance = white plastic
  darkCut:    0.24,    // neutral below this = black plastic / motors

  // coloured parts — Onshape's colours are pale, so deepen them
  chroma:     2.2,     // chroma multiplier (higher = more vivid)
  colLum:     0.48,    // luminance ceiling (lower = deeper)
  colMetal:   0.82,
  colRough:   0.12,

  // mid greys = aluminium / steel. metalLum darkens them, which is what
  // makes metal read as metal instead of pale grey
  metalLum:   0.23,
  metalMetal: 0.88,
  metalRough: 0.17,

  // white plastic / polycarb — colour must stay bright, so no darkening
  whiteMetal: 0.09,
  whiteRough: 0.17,

  // black plastic, motors, servos
  darkMetal:  1,
  darkRough:  0.12,

  // Pure black needs its own treatment. Onshape exports the sponsor
  // plates as flat [0,0,0] (it cannot export decal images), and a pure
  // black surface at metallic 1 / low roughness is a perfect black
  // mirror — it reads as a hole in the robot. Lifting it slightly and
  // roughening it makes it read as the matte black panel it really is.
  blackCut:   0.03,    // luminance at or below this = "pure black"
  blackLift:  0.055,   // floor applied to the base colour
  blackMetal: 0.30,
  blackRough: 0.48,

  // scene
  exposure:   0.93,
  shadow:     1.15,
};

/* Materials hidden completely.

   Onshape cannot export decal images, so the sponsor logos arrive as flat
   black blocks instead of artwork. Material 18 is that strip — 9
   primitives, 16.2 x 5.9 cm, one per logo. The real logos live in the
   Sponsors section of the page, where they're actually legible.

   Nothing else is hidden. Earlier attempts at removing the white plate
   (32, 33, 35, 37, 50, 54, 73) are all reverted and visible again.

   Hidden rather than deleted, so the .glb never needs rebuilding — add or
   remove indices here and reload. */
const HIDE_MATERIALS = [18];   // KHRONOS only — see TUNE_PROFILES

/* Per-robot overrides, picked by data-tune="…" on the <model-viewer>.
   No data-tune (KHRONOS) → plain TUNE + HIDE_MATERIALS, exactly as before.

   "deep": ROBONEER and ORCA. Their black panels are large and flat, and at
   darkMetal 1 / darkRough .12 they mirror the bright studio light and read
   grey. Darker base, less metal, a touch rougher → a sharp, deep black that
   still catches an edge highlight. Their material 18 is a real part (grey
   on ROBONEER, the yellow on ORCA), so nothing is hidden. */
const TUNE_PROFILES = {
  deep: {
    hide:       [],
    darkCut:    0.26,   // ROBONEER's body panels are 0.251 grey — just over
                        // the default .24, so they were shading as aluminium
    // Fully metallic, so reflectance = base colour: darkening the base is
    // what actually darkens the panel. (Lower metalness doesn't help — a
    // dielectric still reflects ~4% of the bright studio light as grey.)
    darkScale:  0.32,   // multiplies the dark base colour (1 = untouched)
    darkMetal:  1,
    darkRough:  0.22,
    blackLift:  0.018,
    blackMetal: 0.45,
    blackRough: 0.36,
  },
};

const LUM = c => 0.2126*c[0] + 0.7152*c[1] + 0.0722*c[2];

/* Apply TUNE to the live model. `originals` holds untouched base colours
   so every pass starts clean rather than stacking on the last one. */
function applyTune(mv, originals) {
  const mats = mv.model?.materials;
  if (!mats) return null;
  const count = { colour:0, white:0, metal:0, dark:0, black:0, hidden:0 };
  const prof = TUNE_PROFILES[mv.dataset.tune] || {};
  const TUNE_ = { darkScale: 1, ...TUNE, ...prof };
  const hide = prof.hide ?? HIDE_MATERIALS;

  mats.forEach((m, i) => {
    const p = m.pbrMetallicRoughness;
    const src = originals[i];

    if (hide.includes(i)) {
      m.setAlphaMode?.('BLEND');
      p.setBaseColorFactor([0, 0, 0, 0]);
      p.setMetallicFactor(0);
      p.setRoughnessFactor(1);
      count.hidden++;
      return;
    }

    const rgb = src.slice(0, 3), alpha = src[3] ?? 1;
    const chroma = Math.max(...rgb) - Math.min(...rgb);
    const L = LUM(rgb);

    if (chroma >= TUNE.chromaCut) {
      let out = rgb.map(v => L + (v - L) * TUNE.chroma);
      const bl = LUM(out);
      if (bl > 1e-6) {
        const k = Math.min(L, TUNE.colLum) / bl;
        out = out.map(v => v * k);
      }
      p.setBaseColorFactor([...out.map(v => Math.min(Math.max(v, 0), 1)), alpha]);
      p.setMetallicFactor(TUNE.colMetal);
      p.setRoughnessFactor(TUNE.colRough);
      count.colour++;
    } else if (L >= TUNE.lightCut) {
      p.setBaseColorFactor(src);                    // untouched — stays white
      p.setMetallicFactor(TUNE.whiteMetal);
      p.setRoughnessFactor(TUNE.whiteRough);
      count.white++;
    } else if (L <= TUNE.blackCut) {
      // sponsor plates and other flat-black faces
      p.setBaseColorFactor([...rgb.map(v => Math.max(v, TUNE_.blackLift)), alpha]);
      p.setMetallicFactor(TUNE_.blackMetal);
      p.setRoughnessFactor(TUNE_.blackRough);
      count.black++;
    } else if (L <= TUNE_.darkCut) {
      p.setBaseColorFactor([...rgb.map(v => v * TUNE_.darkScale), alpha]);
      p.setMetallicFactor(TUNE_.darkMetal);
      p.setRoughnessFactor(TUNE_.darkRough);
      count.dark++;
    } else {
      // darken toward metalLum so aluminium reads as metal, not pale grey
      const k = L > 1e-6 ? TUNE.metalLum / L : 1;
      p.setBaseColorFactor([...rgb.map(v => Math.min(v * k, 1)), alpha]);
      p.setMetallicFactor(TUNE.metalMetal);
      p.setRoughnessFactor(TUNE.metalRough);
      count.metal++;
    }
  });

  mv.exposure = TUNE.exposure;
  mv.shadowIntensity = TUNE.shadow;
  return count;
}

/* ══════════════════════════════════════════════════════════════════
   HEXAGON PHOTO CLUSTER

   Drop photos into assets/hex/ and list them below. Square-ish crops
   work best — each tile is a pointy-top hexagon, so anything very wide
   or very tall gets cropped hard at the points.

   x / y are percentages of the cluster box, w is a percentage of its
   width. depth drives the pointer parallax (higher = moves more).
   ══════════════════════════════════════════════════════════════════ */
/* Cluster placement — the box the hexagons live in, as opposed to HEX
   below which frames the photo inside each tile. Adjust with ?hex=1. */
const HEXBOX = {
  size:  730,   // largest the cluster gets (px)
  vw:     42,   // ...but never wider than this share of the viewport (%)
  x:     2.8,   // distance from the right edge, in multiples of --pad
  y:      -4,   // nudge up from centre (px)
};

function applyHexBox() {
  const r = document.documentElement.style;
  r.setProperty('--hx-max',  HEXBOX.size + 'px');
  r.setProperty('--hx-vw',   HEXBOX.vw + 'vw');
  r.setProperty('--hx-x',    HEXBOX.x);
  r.setProperty('--hx-y',    HEXBOX.y + 'px');
}

const HEX = [
  { src:"assets/hex/6.jpg", alt:"Think Award and Finalist Alliance, Palmdale 2026", x:50, y:21, w:40, depth:1,   lift:12, dur:7.5, iz:1.20, ix:0,  iy:-6 },
  { src:"assets/hex/1.jpg", alt:"KHRONOS, this season's robot",                    x:19, y:43, w:33, depth:1.7, lift:9,  dur:8.5, iz:1.05, ix:-1, iy:-2 },
  { src:"assets/hex/3.jpg", alt:"Engineering portfolios in the pit",               x:81, y:43, w:33, depth:1.7, lift:14, dur:6.8, iz:1.09, ix:0,  iy:-2 },
  { src:"assets/hex/4.jpg", alt:"The CSK Develop3rs at competition",               x:50, y:62, w:46, depth:0.6, lift:10, dur:9.2, iz:1.19, ix:0,  iy:0  },
  { src:"assets/hex/5.jpg", alt:"ORCA, our previous competition robot",            x:18, y:82, w:30, depth:2.2, lift:13, dur:7.9, iz:1.31, ix:2,  iy:-2 },
  { src:"assets/hex/2.jpg", alt:"The team with ORCA and the season trophy",        x:82, y:82, w:30, depth:2.2, lift:8,  dur:8.8, iz:1.55, ix:-1, iy:0  },
];

/* Bump when you replace anything in assets/hex/ — without it the browser
   keeps serving the old file and edits appear to do nothing. */
const HEX_V = 3;

function renderHexes() {
  applyHexBox();
  const host = $('#hexes');
  if (!host) return;
  host.innerHTML = HEX.map((t, i) => {
    const style = `--x:${t.x}%; --y:${t.y}%; --w:${t.w}%; --depth:${t.depth};` +
                  `--lift:${t.lift}px; --dur:${t.dur}s; --d:${i * 110}ms;` +
                  `--iz:${t.iz ?? 1}; --ix:${t.ix ?? 0}%; --iy:${t.iy ?? 0}%`;
    const inner = t.src
      ? `<img src="${esc(t.src)}?v=${HEX_V}" alt="${esc(t.alt || '')}" loading="lazy" decoding="async"
              data-fallback="${i + 1}">`
      : `<div class="hex__ph"><b>${i + 1}</b>add photo</div>`;
    return `<figure class="hex" data-i="${i}" style="${style}">
              <div class="hex__ring">
                <div class="hex__inner" style="--src:url(&quot;${esc(t.src)}?v=${HEX_V}&quot;)">${inner}</div>
              </div>
            </figure>`;
  }).join('');

  // missing files degrade to a numbered slot rather than a broken image
  $$('img[data-fallback]', host).forEach(img => {
    img.addEventListener('error', () => {
      const d = document.createElement('div');
      d.className = 'hex__ph';
      d.innerHTML = `<b>${img.dataset.fallback}</b>add photo`;
      img.replaceWith(d);
    }, { once: true });
  });

  // Pointer parallax. Events only update a target; a rAF loop eases the
  // actual value toward it, so motion stays smooth however irregularly
  // pointermove happens to fire.
  if (!matchMedia('(prefers-reduced-motion:reduce)').matches) {
    const hero = $('.hero');
    let tx = 0, ty = 0, cx = 0, cy = 0, raf = null, idle = 0;

    const tick = () => {
      cx += (tx - cx) * 0.11;
      cy += (ty - cy) * 0.11;
      host.style.setProperty('--mx', cx.toFixed(4));
      host.style.setProperty('--my', cy.toFixed(4));
      // stop once it has settled, restart on the next move
      if (Math.abs(tx - cx) < 0.0005 && Math.abs(ty - cy) < 0.0005 && ++idle > 12) {
        raf = null; return;
      }
      if (Math.abs(tx - cx) > 0.0005 || Math.abs(ty - cy) > 0.0005) idle = 0;
      raf = requestAnimationFrame(tick);
    };
    const wake = () => { idle = 0; if (!raf) raf = requestAnimationFrame(tick); };

    hero?.addEventListener('pointermove', e => {
      const r = hero.getBoundingClientRect();
      tx = (e.clientX - r.left) / r.width  - .5;
      ty = (e.clientY - r.top)  / r.height - .5;
      wake();
    }, { passive: true });
    hero?.addEventListener('pointerleave', () => { tx = 0; ty = 0; wake(); });
  }

  initHexTuner(host);
}

/* Per-tile framing panel (?hex=1). Click a hexagon to select it, drag it
   to pan, or use the sliders. "Copy settings" emits the whole HEX array. */
function initHexTuner(host) {
  if (!new URLSearchParams(location.search).has('hex')) {
    console.info('[23441] add ?hex=1 to adjust each hexagon');
    return;
  }
  document.body.classList.add('hex-tune');
  let sel = 0;

  const el = document.createElement('aside');
  el.className = 'cam cam--left';
  el.innerHTML = `<b>Cluster</b>
    <div id="hb-read" style="margin:-2px 0 10px;font:500 11px/1.45 var(--mono);color:var(--ink-4)"></div>
    <label>Size <span id="hbv-size"></span><input type="range" id="hb-size" min="300" max="2200" step="10"></label>
    <label>Max width <span id="hbv-vw"></span><input type="range" id="hb-vw" min="25" max="100" step="1"></label>
    <label>From right <span id="hbv-x"></span><input type="range" id="hb-x" min="0" max="7" step="0.1"></label>
    <label>Up / down <span id="hbv-y"></span><input type="range" id="hb-y" min="-160" max="160" step="2"></label>

    <b style="margin-top:14px">Photo framing</b>
    <div id="hx-tabs" style="display:flex;gap:4px;margin-bottom:10px;flex-wrap:wrap"></div>
    <label>Zoom <span id="hxv-iz"></span><input type="range" id="hx-iz" min="0.7" max="3"  step="0.01"></label>
    <label>Move across <span id="hxv-ix"></span><input type="range" id="hx-ix" min="-60" max="60" step="1"></label>
    <label>Move up/down <span id="hxv-iy"></span><input type="range" id="hx-iy" min="-60" max="60" step="1"></label>
    <button type="button" class="btn btn--primary" id="hx-copy">Copy settings</button>`;
  document.body.appendChild(el);

  /* Width is a min() of two things, so dragging Size does nothing while
     Max width is the smaller of the pair. Name whichever is binding. */
  const readBox = () => {
    const terms = [
      ['Size',      HEXBOX.size],
      ['Max width', innerWidth * HEXBOX.vw / 100],
    ].sort((a, b) => a[1] - b[1]);
    const [who, val] = terms[0];
    $('#hb-read', el).innerHTML =
      `${Math.round($('#hexes')?.offsetWidth || 0)}px wide<br>` +
      `<span style="color:var(--brand-2)">limited by ${who}</span> (${Math.round(val)}px)`;
  };

  [['size','px'],['vw','vw'],['x','x pad'],['y','px']].forEach(([k, unit]) => {
    const i = $(`#hb-${k}`, el), o = $(`#hbv-${k}`, el);
    i.value = HEXBOX[k];
    o.textContent = HEXBOX[k] + unit;
    i.addEventListener('input', () => {
      HEXBOX[k] = parseFloat(i.value);
      o.textContent = HEXBOX[k] + unit;
      applyHexBox();
      readBox();
    });
  });
  addEventListener('resize', readBox);
  requestAnimationFrame(readBox);

  const tabs = $('#hx-tabs', el);
  tabs.innerHTML = HEX.map((_, i) =>
    `<button type="button" data-t="${i}" style="flex:1;min-width:30px;padding:6px 0;border:1px solid var(--line-2);
      border-radius:6px;background:var(--card);color:var(--ink-2);font:600 11px var(--mono);cursor:pointer">${i + 1}</button>`
  ).join('');

  const paint = () => {
    const t = HEX[sel];
    $('#hx-iz', el).value = t.iz; $('#hxv-iz', el).textContent = Number(t.iz).toFixed(2) + 'x';
    $('#hx-ix', el).value = t.ix; $('#hxv-ix', el).textContent = t.ix + '%';
    $('#hx-iy', el).value = t.iy; $('#hxv-iy', el).textContent = t.iy + '%';
    $$('#hx-tabs button', el).forEach((b, i) => {
      b.style.background = i === sel ? 'var(--brand-2)' : 'var(--card)';
      b.style.color = i === sel ? '#fff' : 'var(--ink-2)';
    });
    $$('.hex', host).forEach((h, i) => h.classList.toggle('is-sel', i === sel));
  };
  const push = () => {
    const t = HEX[sel], node = $$('.hex', host)[sel];
    node.style.setProperty('--iz', t.iz);
    node.style.setProperty('--ix', t.ix + '%');
    node.style.setProperty('--iy', t.iy + '%');
  };

  tabs.addEventListener('click', e => {
    const b = e.target.closest('button[data-t]');
    if (b) { sel = +b.dataset.t; paint(); }
  });
  ['iz', 'ix', 'iy'].forEach(k => {
    $(`#hx-${k}`, el).addEventListener('input', ev => {
      HEX[sel][k] = parseFloat(ev.target.value);
      paint(); push();
    });
  });

  // click to select, drag to pan that tile
  let drag = null;
  host.addEventListener('pointerdown', e => {
    const h = e.target.closest('.hex');
    if (!h) return;
    sel = +h.dataset.i; paint();
    drag = { x: e.clientX, y: e.clientY, ix: HEX[sel].ix, iy: HEX[sel].iy, w: h.offsetWidth, h: h.offsetHeight };
    h.setPointerCapture(e.pointerId);
    e.preventDefault();
  });
  host.addEventListener('pointermove', e => {
    if (!drag) return;
    HEX[sel].ix = Math.round(Math.max(-60, Math.min(60, drag.ix + (e.clientX - drag.x) / drag.w * 100)));
    HEX[sel].iy = Math.round(Math.max(-60, Math.min(60, drag.iy + (e.clientY - drag.y) / drag.h * 100)));
    paint(); push();
  });
  ['pointerup', 'pointercancel'].forEach(ev => host.addEventListener(ev, () => { drag = null; }));

  $('#hx-copy', el).addEventListener('click', async () => {
    const NL = String.fromCharCode(10);
    const txt = 'const HEX = [' + NL + HEX.map(t =>
      `  { src:"${t.src}", alt:"${t.alt}", x:${t.x}, y:${t.y}, w:${t.w}, ` +
      `depth:${t.depth}, lift:${t.lift}, dur:${t.dur}, iz:${Number(t.iz).toFixed(2)}, ix:${t.ix}, iy:${t.iy} },`
    ).join(NL) + NL + '];' + NL + NL +
      'const HEXBOX = ' + JSON.stringify(HEXBOX, null, 2) + ';';
    try { await navigator.clipboard.writeText(txt); } catch { console.log(txt); }
    const b = $('#hx-copy', el), old = b.textContent;
    b.textContent = 'Copied'; setTimeout(() => { b.textContent = old; }, 1600);
  });

  paint();
}

/* ── kicker width ────────────────────────────────────────────────────
   Match the label's overall width to the first title line. The rules
   either side flex, so setting a width on the kicker stretches them and
   keeps the text centred — no hand-tuned multiplier that only lines up
   at one viewport size. */
/* Position and proportions of the label. Adjust live with ?kick=1. */
const KICK = {
  widthMul: 1.00,   // x the measured "TEAM" width
  dx:         19,   // nudge across (px)
  dy:          9,   // nudge down (px)
  gapBelow:   19,   // space to the title (px)
  size:     14.5,   // text size (px)
  tracking: 0.14,   // letter-spacing (em)
  gap:        14,   // space between rule and text (px)
  rule:        1,   // rule thickness (px)
  alpha:    0.65,   // rule opacity
};

function syncKicker() {
  const k = $('.hero__kicker'), line = $('.hero__name span');
  if (!k || !line) return;
  const s = k.style;
  s.setProperty('--k-dx',    KICK.dx + 'px');
  s.setProperty('--k-dy',    KICK.dy + 'px');
  s.setProperty('--k-mb',    KICK.gapBelow + 'px');
  s.setProperty('--k-size',  KICK.size + 'px');
  s.setProperty('--k-track', KICK.tracking + 'em');
  s.setProperty('--k-gap',   KICK.gap + 'px');
  s.setProperty('--k-rule',  KICK.rule + 'px');
  s.setProperty('--k-alpha', KICK.alpha);
  const w = line.getBoundingClientRect().width;
  if (w > 0) k.style.width = Math.round(w * KICK.widthMul) + 'px';
}

const KICK_SPEC = [
  ['Position'],
  ['dx',       'Move across',   -200, 200,  1,    'px'],
  ['dy',       'Move up/down',  -120, 120,  1,    'px'],
  ['gapBelow', 'Space below',      0, 80,   1,    'px'],
  ['Proportions'],
  ['widthMul', 'Width',         0.35, 1.8,  0.01, 'x'],
  ['size',     'Text size',        8, 30,   0.5,  'px'],
  ['tracking', 'Letter spacing',   0, 0.8,  0.01, 'em'],
  ['gap',      'Rule gap',         2, 50,   1,    'px'],
  ['Rules'],
  ['rule',     'Thickness',        1, 6,    1,    'px'],
  ['alpha',    'Opacity',          0, 1,    0.05, ''],
];

/* Per-letter spacing for "TEAM". The face's built-in kerning only closes
   part of the A-M gap, so each pair gets its own override here, in em so
   it scales with the title. Adjust live with ?letters=1. */
const LETTERS = { l0: -0.020, l1: 0.105, l2: -0.150, l3: -0.035 };  // after T, E, A, M

function applyLetters() {
  const line = $('.hero__name > span');
  if (!line) return;
  Object.entries(LETTERS).forEach(([k, v]) => line.style.setProperty('--' + k, v + 'em'));
  syncKicker();                       // width changed, so re-match the label
}

function initLetterTuner() {
  applyLetters();
  if (!new URLSearchParams(location.search).has('letters')) {
    console.info('[23441] add ?letters=1 to adjust letter spacing in TEAM');
    return;
  }
  const NAMES = [['l0','After T'],['l1','After E'],['l2','After A'],['l3','After M']];
  const el = document.createElement('aside');
  el.className = 'cam cam--left';
  el.innerHTML = '<b>TEAM letter spacing</b>' + NAMES.map(([k, label]) =>
    `<label>${label} <span id="lv-${k}"></span>
       <input type="range" id="lsl-${k}" min="-0.25" max="0.35" step="0.005"></label>`
  ).join('') + '<button type="button" class="btn btn--primary" id="let-copy">Copy settings</button>';
  document.body.appendChild(el);

  NAMES.forEach(([k]) => {
    const i = $(`#lsl-${k}`, el), o = $(`#lv-${k}`, el);
    i.value = LETTERS[k]; o.textContent = Number(LETTERS[k]).toFixed(3) + 'em';
    i.addEventListener('input', () => {
      LETTERS[k] = parseFloat(i.value);
      o.textContent = LETTERS[k].toFixed(3) + 'em';
      applyLetters();
    });
  });
  $('#let-copy', el).addEventListener('click', async () => {
    const txt = 'const LETTERS = ' + JSON.stringify(LETTERS) + ';';
    try { await navigator.clipboard.writeText(txt); } catch { console.log(txt); }
    const b = $('#let-copy', el), old = b.textContent;
    b.textContent = 'Copied'; setTimeout(() => { b.textContent = old; }, 1600);
  });
}

function initKickTuner() {
  if (!new URLSearchParams(location.search).has('kick')) {
    console.info('[23441] add ?kick=1 to adjust the CSK Develop3rs label');
    return;
  }
  const el = document.createElement('aside');
  el.className = 'cam cam--left';
  el.innerHTML = '<b>Label</b>' + KICK_SPEC.map(s => s.length === 1
    ? `<h4 style="margin:12px 0 7px;font:600 10px/1 var(--mono);letter-spacing:.14em;text-transform:uppercase;color:var(--brand-2)">${esc(s[0])}</h4>`
    : `<label>${esc(s[1])} <span id="kv-${s[0]}"></span>
         <input type="range" id="ks-${s[0]}" min="${s[2]}" max="${s[3]}" step="${s[4]}"></label>`
  ).join('') + '<button type="button" class="btn btn--primary" id="kick-copy">Copy settings</button>';
  document.body.appendChild(el);

  KICK_SPEC.filter(s => s.length > 1).forEach(([k, , , , , unit]) => {
    const i = $(`#ks-${k}`, el), o = $(`#kv-${k}`, el);
    i.value = KICK[k]; o.textContent = KICK[k] + (unit || '');
    i.addEventListener('input', () => {
      KICK[k] = parseFloat(i.value);
      o.textContent = KICK[k] + (unit || '');
      syncKicker();
    });
  });
  $('#kick-copy', el).addEventListener('click', async () => {
    const txt = 'const KICK = ' + JSON.stringify(KICK, null, 2) + ';';
    try { await navigator.clipboard.writeText(txt); } catch { console.log(txt); }
    const b = $('#kick-copy', el), old = b.textContent;
    b.textContent = 'Copied'; setTimeout(() => { b.textContent = old; }, 1600);
  });
}

function initKicker() {
  syncKicker();
  // web fonts land after first paint and change the measurement
  document.fonts?.ready.then(syncKicker).catch(() => {});
  initKickTuner();
  initLetterTuner();
  let t; addEventListener('resize', () => { clearTimeout(t); t = setTimeout(syncKicker, 120); });
}

/* ── header logo shadow ─────────────────────────────────────────────
   The logo is white artwork on a white page, so a tight dark shadow
   traces its edges to make the shape read, with a softer one beneath
   for lift. Adjust live with ?logo=1. */
const LOGO = {
  size:       29,    // logo height (px)
  edgeBlur:    6,    // wide, faint ambient glow (px)
  edgeAlpha: 0.11,
  midY:      1.5,    // the shadow doing the real work
  midBlur:   1.5,
  midAlpha:  0.62,
  softY:       2,    // soft lift, switched off
  softBlur:    7,
  softAlpha:   0,
};

function applyLogo() {
  const r = document.documentElement.style;
  const ink = (a) => `rgba(11,18,32,${a})`;
  r.setProperty('--lg-size', LOGO.size + 'px');
  r.setProperty('--lg-filter',
    `drop-shadow(0 0 ${LOGO.edgeBlur}px ${ink(LOGO.edgeAlpha)}) ` +
    `drop-shadow(0 ${LOGO.midY}px ${LOGO.midBlur}px ${ink(LOGO.midAlpha)}) ` +
    `drop-shadow(0 ${LOGO.softY}px ${LOGO.softBlur}px ${ink(LOGO.softAlpha)})`);
}

const LOGO_SPEC = [
  ['Size'],
  ['size',      'Logo height',   16, 64,  1,    'px'],
  ['Edge trace'],
  ['edgeBlur',  'Blur',           0, 6,   0.1,  'px'],
  ['edgeAlpha', 'Strength',       0, 1,   0.01, ''],
  ['Grounding'],
  ['midY',      'Offset',         0, 10,  0.5,  'px'],
  ['midBlur',   'Blur',           0, 12,  0.5,  'px'],
  ['midAlpha',  'Strength',       0, 1,   0.01, ''],
  ['Soft lift'],
  ['softY',     'Offset',         0, 20,  0.5,  'px'],
  ['softBlur',  'Blur',           0, 30,  0.5,  'px'],
  ['softAlpha', 'Strength',       0, 1,   0.01, ''],
];

function initLogoTuner() {
  applyLogo();
  if (!new URLSearchParams(location.search).has('logo')) {
    console.info('[23441] add ?logo=1 to adjust the header logo shadow');
    return;
  }
  const el = document.createElement('aside');
  el.className = 'cam cam--left';
  el.style.maxHeight = 'calc(100vh - 110px)';
  el.style.overflowY = 'auto';
  el.innerHTML = '<b>Logo shadow</b>' + LOGO_SPEC.map(s => s.length === 1
    ? `<h4 style="margin:12px 0 7px;font:600 10px/1 var(--mono);letter-spacing:.14em;text-transform:uppercase;color:var(--brand-2)">${esc(s[0])}</h4>`
    : `<label>${esc(s[1])} <span id="gv-${s[0]}"></span><input type="range" id="gs-${s[0]}" min="${s[2]}" max="${s[3]}" step="${s[4]}"></label>`
  ).join('') + '<button type="button" class="btn btn--primary" id="lg-copy">Copy settings</button>';
  document.body.appendChild(el);

  LOGO_SPEC.filter(s => s.length > 1).forEach(([k, , , , , unit]) => {
    const i = $(`#gs-${k}`, el), o = $(`#gv-${k}`, el);
    i.value = LOGO[k];
    o.textContent = LOGO[k] + (unit || '');
    i.addEventListener('input', () => {
      LOGO[k] = parseFloat(i.value);
      o.textContent = LOGO[k] + (unit || '');
      applyLogo();
    });
  });
  $('#lg-copy', el).addEventListener('click', async () => {
    const txt = 'const LOGO = ' + JSON.stringify(LOGO, null, 2) + ';';
    try { await navigator.clipboard.writeText(txt); } catch { console.log(txt); }
    const b = $('#lg-copy', el), old = b.textContent;
    b.textContent = 'Copied';
    setTimeout(() => { b.textContent = old; }, 1600);
  });
}

/* ── rising sparkles ────────────────────────────────────────────────
   Canvas rather than DOM nodes: one texture instead of N layers.
   Every value below is adjustable live with ?spark=1.              */
const SPARK = {
  style:      1,     // 0 soft dot | 1 four-point star | 2 cross | 3 diamond
  density:   92,     // lower = more particles
  size:    1.70,     // overall scale
  speed:   1.00,     // rise speed
  rate:    1.00,     // overall time scale — 1 matches the display refresh
  glow:    0.45,     // halo spread
  core:    0.20,     // how hard the centre is
  flare:   0.33,     // spike length
  alpha:   0.95,     // overall opacity
  drift:   1.00,     // sideways wander
  fadeTop: 0.42,     // fade out over the top fraction of the hero
  textDim: 0.52,     // brightness behind the copy
};

function initSparks() {
  const cv = $('#sparks');
  if (!cv || matchMedia('(prefers-reduced-motion:reduce)').matches) return;
  const ctx = cv.getContext('2d', { alpha: true });
  const hero = $('.hero');
  let W = 0, H = 0, dpr = 1, parts = [], raf = null, onScreen = true, safeX = 0;

  const PAL = [[0,150,255],[0,190,255],[20,120,245],[0,214,255]];

  const SPRITE = 128;
  let sprites = [];

  // the bright mark at the centre of a sprite
  function shape(x, m) {
    const st = SPARK.style, fl = SPARK.flare;
    x.beginPath();
    if (st === 0) { x.arc(m, m, m * 0.16, 0, Math.PI * 2); return; }
    if (st === 3) {
      const r = m * fl * 0.72;
      x.moveTo(m, m - r); x.lineTo(m + r * 0.55, m);
      x.lineTo(m, m + r); x.lineTo(m - r * 0.55, m); x.closePath(); return;
    }
    const pts = 8, step = Math.PI * 2 / pts;
    for (let i = 0; i < pts; i++) {
      const inner = st === 2 ? m * fl * 0.20 : m * 0.10;
      const rad = i % 2 ? inner : m * fl;
      const px = m + Math.cos(i * step) * rad, py = m + Math.sin(i * step) * rad;
      i ? x.lineTo(px, py) : x.moveTo(px, py);
    }
    x.closePath();
  }

  function buildSprites() {
    sprites = PAL.map(([r, g, b]) => {
      const c = document.createElement('canvas');
      c.width = c.height = SPRITE;
      const x = c.getContext('2d'), m = SPRITE / 2;
      const spread = Math.max(0.05, Math.min(1, SPARK.glow));
      const hard = Math.max(0.02, Math.min(0.5, 0.13 * SPARK.core));
      const grd = x.createRadialGradient(m, m, 0, m, m, m * spread);
      // on white the core must stay saturated — a white centre vanishes
      grd.addColorStop(0, `rgba(${r},${g},${b},1)`);
      grd.addColorStop(hard, `rgba(${r},${g},${b},0.9)`);
      grd.addColorStop(Math.min(hard + 0.22, 0.95), `rgba(${r},${g},${b},0.26)`);
      grd.addColorStop(1, `rgba(${r},${g},${b},0)`);
      x.fillStyle = grd;
      x.fillRect(0, 0, SPRITE, SPRITE);
      if (SPARK.style !== 0 && SPARK.flare > 0.02) {
        x.globalCompositeOperation = 'lighter';
        x.fillStyle = `rgba(${r},${g},${b},0.9)`;
        shape(x, m); x.fill();
      }
      return c;
    });
  }

  const spawn = (seed = false) => ({
    x: (Math.random() < 0.66 && safeX > 0)
         ? safeX + Math.random() * Math.max(60, W - safeX)
         : Math.random() * W,
    y: seed ? Math.random() * H : H + 20 + Math.random() * 60,
    r: 1.1 + Math.random() * 2.9,
    vy: 0.05 + Math.random() * 0.14,
    drift: (Math.random() - 0.5) * 0.16,
    sway: Math.random() * Math.PI * 2,
    swaySpd: 0.004 + Math.random() * 0.009,
    life: 0,
    max: 3400 + Math.random() * 1800,
    ci: Math.random() < 0.12 ? 3 : Math.floor(Math.random() * 3),
  });

  const resize = () => {
    const r = cv.getBoundingClientRect();
    dpr = Math.min(devicePixelRatio || 1, 2);
    W = r.width; H = r.height;
    cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const copy = $('.hero__in > div');
    safeX = (copy && matchMedia('(min-width:960px)').matches)
      ? copy.getBoundingClientRect().right - r.left + 30 : 0;
    const target = Math.round(Math.min(60, Math.max(10, W * H / (SPARK.density * 1000))));
    parts = Array.from({ length: target }, () => spawn(true));
  };

  /* Motion is scaled by elapsed time rather than counted in frames, so a
     dropped frame costs frame rate instead of slowing the particles down.
     The baseline is the display's own refresh interval, measured once at
     startup, not a hard-coded 60fps — these were tuned by eye on a real
     screen, and forcing 60 makes them crawl at half pace on a 120Hz
     panel. Median of the first samples, so a janky load frame can't skew
     it, and clamped to the range of plausible refresh rates.
     dt is capped because a backgrounded tab can hand back a gap of
     seconds, which would otherwise teleport every particle. */
  let last = 0, baseMs = 0, cal = [];
  const frame = (now) => {
    const gap = last ? now - last : 0;
    if (!baseMs && gap > 0) {
      cal.push(gap);
      if (cal.length >= 24) {
        const mid = cal.slice().sort((a, b) => a - b)[cal.length >> 1];
        baseMs = Math.min(34, Math.max(4, mid));
      }
    }
    const dt = last ? Math.min(3, gap / (baseMs || 16.667)) * SPARK.rate : SPARK.rate;
    last = now;

    ctx.clearRect(0, 0, W, H);
    ctx.globalCompositeOperation = 'source-over';
    const pal = sprites;

    for (const p of parts) {
      p.life += dt;
      p.y -= p.vy * SPARK.speed * dt;
      p.sway += p.swaySpd * dt;
      p.x += (p.drift + Math.sin(p.sway) * 0.35) * SPARK.drift * dt;

      const inFade  = Math.min(1, p.life / 90);
      const outFade = Math.min(1, (p.max - p.life) / 260);
      const height  = Math.min(1, Math.max(0, p.y / (H * SPARK.fadeTop)));
      const ramp = 160;
      const xMask = safeX <= 0 ? 1
        : SPARK.textDim + (1 - SPARK.textDim) *
          Math.min(1, Math.max(0, (p.x - (safeX - ramp)) / ramp));
      const a = inFade * outFade * height * xMask * SPARK.alpha;

      if (a > 0.01) {
        const s = p.r * 11 * SPARK.size;
        ctx.globalAlpha = Math.min(1, a);
        ctx.drawImage(pal[p.ci], p.x - s / 2, p.y - s / 2, s, s);
        ctx.globalAlpha = 1;
      }
      if (p.life > p.max || p.y < -20) Object.assign(p, spawn());
    }
    ctx.globalCompositeOperation = 'source-over';
    raf = running() ? requestAnimationFrame(frame) : null;
  };

  // Two independent reasons to pause: the hero scrolled off screen, and the
  // tab went to the background. They have to stay separate — folding them
  // into one flag latches it off, because coming back only clears one.
  const running = () => onScreen && !document.hidden;
  const start = () => { if (!raf && running()) { last = 0; raf = requestAnimationFrame(frame); } };
  const stop  = () => { if (raf) cancelAnimationFrame(raf); raf = null; };
  const sync  = () => running() ? start() : stop();

  new ResizeObserver(resize).observe(cv);
  new IntersectionObserver(es => { onScreen = es[0].isIntersecting; sync(); },
    { threshold: 0 }).observe(hero || cv);
  document.addEventListener('visibilitychange', sync);

  buildSprites(); resize(); start();
  initSparkTuner(() => { buildSprites(); resize(); });
}

const SPARK_SPEC = [
  ['Look'],
  ['glow',    'Glow spread',    0.15, 1,   0.01, ''],
  ['core',    'Core hardness',  0.2,  3,   0.05, ''],
  ['flare',   'Spike length',   0,    1,   0.01, ''],
  ['alpha',   'Opacity',        0.1,  1,   0.01, ''],
  ['Amount'],
  ['density', 'More  <-  ->  fewer', 8, 120, 1, ''],
  ['size',    'Size',           0.3,  3,   0.05, 'x'],
  ['Motion'],
  ['rate',    'Overall rate',   0.2,  4,   0.05, 'x'],
  ['speed',   'Rise speed',     0.2,  4,   0.05, 'x'],
  ['drift',   'Sideways',       0,    3,   0.05, 'x'],
  ['Fading'],
  ['fadeTop', 'Fade near top',  0.02, 0.6, 0.01, ''],
  ['textDim', 'Dim over text',  0,    1,   0.02, ''],
];

function initSparkTuner(rebuild) {
  if (!new URLSearchParams(location.search).has('spark')) {
    console.info('[23441] add ?spark=1 to adjust the sparkles');
    return;
  }
  const STYLES = ['Dot', 'Star', 'Cross', 'Diamond'];
  const el = document.createElement('aside');
  el.className = 'cam cam--left';
  el.style.maxHeight = 'calc(100vh - 110px)';
  el.style.overflowY = 'auto';
  el.innerHTML =
    '<b>Sparkles</b><div id="sp-styles" style="display:flex;gap:4px;margin-bottom:12px">' +
    STYLES.map((s, i) =>
      `<button type="button" data-s="${i}" style="flex:1;padding:6px 0;border:1px solid var(--line-2);border-radius:6px;background:var(--card);color:var(--ink-2);font:600 10px var(--mono);cursor:pointer">${s}</button>`
    ).join('') + '</div>' +
    SPARK_SPEC.map(s => s.length === 1
      ? `<h4 style="margin:12px 0 7px;font:600 10px/1 var(--mono);letter-spacing:.14em;text-transform:uppercase;color:var(--brand-2)">${esc(s[0])}</h4>`
      : `<label>${esc(s[1])} <span id="spv-${s[0]}"></span><input type="range" id="sps-${s[0]}" min="${s[2]}" max="${s[3]}" step="${s[4]}"></label>`
    ).join('') +
    '<button type="button" class="btn btn--primary" id="sp-copy">Copy settings</button>';
  document.body.appendChild(el);

  const paintStyles = () => $$('#sp-styles button', el).forEach((b, i) => {
    b.style.background = i === SPARK.style ? 'var(--brand-2)' : 'var(--card)';
    b.style.color = i === SPARK.style ? '#fff' : 'var(--ink-2)';
  });
  $('#sp-styles', el).addEventListener('click', e => {
    const b = e.target.closest('button[data-s]');
    if (!b) return;
    SPARK.style = Number(b.dataset.s); paintStyles(); rebuild();
  });
  paintStyles();

  SPARK_SPEC.filter(s => s.length > 1).forEach(([k, , , , , unit]) => {
    const i = $(`#sps-${k}`, el), o = $(`#spv-${k}`, el);
    i.value = SPARK[k];
    o.textContent = SPARK[k] + (unit || '');
    i.addEventListener('input', () => {
      SPARK[k] = parseFloat(i.value);
      o.textContent = SPARK[k] + (unit || '');
      rebuild();
    });
  });
  $('#sp-copy', el).addEventListener('click', async () => {
    const txt = 'const SPARK = ' + JSON.stringify(SPARK, null, 2) + ';';
    try { await navigator.clipboard.writeText(txt); } catch { console.log(txt); }
    const b = $('#sp-copy', el), old = b.textContent;
    b.textContent = 'Copied';
    setTimeout(() => { b.textContent = old; }, 1600);
  });
}

/* ── camera helper (?cam=1) ─────────────────────────────────────────
   Drag the robot to the angle you want, then copy the values. Paste the
   result over camera-orbit / field-of-view on <model-viewer> in
   index.html to make it the starting position. */
function initCameraHelper(mv) {
  if (!new URLSearchParams(location.search).has('cam')) {
    console.info('[23441] add ?cam=1 to the URL to capture a start position');
    return;
  }

  // Auto-rotate would drift away from whatever you line up, so it's off
  // while capturing. It still runs normally on the real page.
  mv.removeAttribute('auto-rotate');

  const el = document.createElement('aside');
  el.className = 'cam';
  el.innerHTML = `
    <b>Camera start position</b>
    <code id="cam-out">—</code>
    <label>Distance <span id="cam-rv"></span>
      <input type="range" id="cam-r" min="0.35" max="2.2" step="0.01"></label>
    <label>Field of view <span id="cam-fv"></span>
      <input type="range" id="cam-f" min="8" max="50" step="0.5"></label>
    <button type="button" class="btn btn--primary" id="cam-copy">Copy values</button>`;
  document.body.appendChild(el);

  const out = $('#cam-out', el), rS = $('#cam-r', el), fS = $('#cam-f', el);
  const deg = r => (r * 180 / Math.PI);
  let text = '';

  const read = () => {
    const o = mv.getCameraOrbit(), f = mv.getFieldOfView();
    text = `camera-orbit="${deg(o.theta).toFixed(1)}deg ${deg(o.phi).toFixed(1)}deg ${o.radius.toFixed(3)}m"\n`
         + `field-of-view="${f.toFixed(1)}deg"`;
    out.textContent = text;
    if (document.activeElement !== rS) rS.value = o.radius;
    if (document.activeElement !== fS) fS.value = f;
    $('#cam-rv', el).textContent = o.radius.toFixed(2) + 'm';
    $('#cam-fv', el).textContent = f.toFixed(1) + '°';
  };

  // Distance and FOV can't be set by dragging because zoom is disabled,
  // so drive them from here instead.
  rS.addEventListener('input', () => {
    const o = mv.getCameraOrbit();
    mv.cameraOrbit = `${deg(o.theta)}deg ${deg(o.phi)}deg ${rS.value}m`;
  });
  fS.addEventListener('input', () => { mv.fieldOfView = `${fS.value}deg`; });

  mv.addEventListener('camera-change', read);
  $('#cam-copy', el).addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(text); } catch { console.log(text); }
    const b = $('#cam-copy', el), old = b.textContent;
    b.textContent = 'Copied';
    setTimeout(() => { b.textContent = old; }, 1600);
  });
  read();
}

/* ── layout tuner (?layout=1) ───────────────────────────────────────
   Size and position of the robot viewer and its caption. Drag the
   sliders, hit Copy, and paste the result back into the `.stage` block
   in styles.css (and camera-orbit in index.html). */
function initLayoutTuner(stage, mv) {
  if (!new URLSearchParams(location.search).has('layout')) return;

  const cap = $('.stage__cap', stage);
  const css = getComputedStyle(stage);
  const px  = name => parseFloat(css.getPropertyValue(name)) || 0;
  const deg = r => r * 180 / Math.PI;

  // [label, unit, min, max, step, read, write]
  const split = stage.closest('.split');
  const big   = $('.bigtitle');
  const bcss  = () => getComputedStyle(big);
  const KNOBS = {
    title: [
      ['Size', 'px', 24, 160, 1, () => parseFloat(bcss().fontSize),
        v => big.style.setProperty('--bt-size', v + 'px')],
      ['Gap below', 'px', 0, 140, 1, () => parseFloat(bcss().marginBottom),
        v => big.style.setProperty('--bt-gap', v + 'px')],
      ['Letter spacing', 'px', -6, 30, 0.5, () => parseFloat(bcss().letterSpacing) || 0,
        v => big.style.setProperty('--bt-track', v + 'px')],
    ],
    section: [
      ['Gap under heading (pull up)', 'px', -200, 40, 1,
        () => parseFloat(getComputedStyle(split).marginTop) || 0,
        v => split.style.setProperty('--split-pull', v + 'px')],
    ],
    robot: [
      ['Zoom (camera distance)', 'm', 1.0, 2.6, 0.01,
        () => mv.getCameraOrbit().radius,
        v => { const o = mv.getCameraOrbit(); mv.cameraOrbit = `${deg(o.theta)}deg ${deg(o.phi)}deg ${v}m`; }],
      ['Box height',   'px', 260, 760, 1,  () => mv.getBoundingClientRect().height, v => stage.style.setProperty('--cad-h', v + 'px')],
      ['Move left/right', 'px', -200, 200, 1, () => px('--cad-x'), v => stage.style.setProperty('--cad-x', v + 'px')],
      ['Move up/down',    'px', -200, 200, 1, () => px('--cad-y'), v => stage.style.setProperty('--cad-y', v + 'px')],
    ],
    caption: [
      ['Text size',       'px', 9, 20, 0.5,   () => px('--cap-size'), v => stage.style.setProperty('--cap-size', v + 'px')],
      ['Move left/right', 'px', -200, 200, 1, () => px('--cap-x'), v => stage.style.setProperty('--cap-x', v + 'px')],
      ['Move up/down',    'px', -200, 200, 1, () => px('--cap-y'), v => stage.style.setProperty('--cap-y', v + 'px')],
    ],
  };

  const el = document.createElement('details');
  el.className = 'cam cam--left lay';
  el.open = true;
  el.innerHTML = `<summary>Robot layout</summary><div>
    <h4>"Our Robots" title</h4><div data-g="title"></div>
    <h4>Section</h4><div data-g="section"></div>
    <h4>Robot</h4><div data-g="robot"></div>
    <h4>Caption</h4><div data-g="caption"></div>
    <h4>Settings to send</h4><code id="lay-out"></code>
    <div class="row">
      <button type="button" class="btn btn--primary" id="lay-copy">Copy</button>
      <button type="button" class="btn" id="lay-reset">Reset</button>
    </div></div>`;
  document.body.appendChild(el);

  const out = $('#lay-out', el);
  const vals = {};
  const fmt = (v, u) => (u === 'm' ? (+v).toFixed(2) : Math.round(v * 2) / 2) + u;
  const render = () => {
    out.textContent =
      `title size: ${fmt(vals['title0'], 'px')}\n` +
      `title gap: ${fmt(vals['title1'], 'px')}\n` +
      `title spacing: ${fmt(vals['title2'], 'px')}\n` +
      `section pull: ${fmt(vals['section0'], 'px')}\n` +
      `robot zoom: ${fmt(vals['robot0'], 'm')}\n` +
      `robot box height: ${fmt(vals['robot1'], 'px')}\n` +
      `robot x/y: ${fmt(vals['robot2'], 'px')} / ${fmt(vals['robot3'], 'px')}\n` +
      `caption size: ${fmt(vals['caption0'], 'px')}\n` +
      `caption x/y: ${fmt(vals['caption1'], 'px')} / ${fmt(vals['caption2'], 'px')}`;
  };

  Object.entries(KNOBS).forEach(([g, list]) => {
    const host = $(`[data-g="${g}"]`, el);
    list.forEach(([label, unit, min, max, step, read, write], i) => {
      const key = g + i, v0 = read();
      vals[key] = v0;
      const lab = document.createElement('label');
      lab.innerHTML = `${label} <span>${fmt(v0, unit)}</span>
        <input type="range" min="${min}" max="${max}" step="${step}" value="${v0}">`;
      const input = $('input', lab), span = $('span', lab);
      input.addEventListener('input', () => {
        vals[key] = +input.value; write(+input.value);
        span.textContent = fmt(input.value, unit); render();
      });
      host.appendChild(lab);
    });
  });

  $('#lay-copy', el).addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(out.textContent); } catch { console.log(out.textContent); }
    const b = $('#lay-copy', el); b.textContent = 'Copied';
    setTimeout(() => { b.textContent = 'Copy'; }, 1600);
  });
  $('#lay-reset', el).addEventListener('click', () => location.reload());
  render();
}

/* ── 3D robot ───────────────────────────────────────────────────── */
/* One viewer per `.stage`. The dev tools (debug panel, ?cam, ?layout)
   build page-level panels with fixed ids, so they attach to the first
   stage (KHRONOS) only. */
function initRobots3D() {
  if (new URLSearchParams(location.search).has('debug')) document.body.classList.add('debug');
  $$('.stage').forEach((stage, i) => initRobot3D(stage, $('model-viewer', stage), i === 0));
}

function initRobot3D(stage, mv, primary) {
  if (!stage || !mv) return;

  const fallbackImg = $('.stage__fallback', stage);
  const bar  = $('.stage__prog span', stage);
  const pct  = $('.stage__pct', stage);
  const dbg  = $('.dbg', stage), stat = $('#dbg-stat', stage);

  const giveUp = () => {
    stage.classList.add('is-dead');
    if (!fallbackImg) return;
    fallbackImg.hidden = false;
    fallbackImg.addEventListener('error', () => {
      fallbackImg.hidden = true; stage.classList.add('no-photo');
    }, { once: true });
  };

  const MB = b => b >= 1048576 ? (b/1048576).toFixed(1)+' MB' : (b/1024).toFixed(0)+' KB';
  let t0 = performance.now(), current = mv.getAttribute('src');
  const transferred = url => {
    const e = performance.getEntriesByName(new URL(url, location.href).href).pop();
    return e ? (e.transferSize || e.encodedBodySize || 0) : 0;
  };
  const label = () => dbg?.querySelector('button.is-on')?.textContent || '';

  mv.addEventListener('progress', e => {
    const p = e.detail.totalProgress;
    if (bar) bar.style.width = (p*100).toFixed(1) + '%';
    if (pct) pct.textContent = Math.round(p*100) + '%';
    if (stat && p < 1) stat.textContent = `${label()} · ${(p*100).toFixed(0)}% · ${((performance.now()-t0)/1000).toFixed(1)}s`;
  });

  mv.addEventListener('load', () => {
    stage.classList.add('is-ready');
    // The camera picks its distance from the canvas size at load time, so
    // re-frame once layout has settled or the robot sits tiny in the view.
    requestAnimationFrame(() => mv.updateFraming?.());

    // Materials ship untouched; tune them here so there's one baseline.
    const originals = (mv.model?.materials || []).map(
      m => (m.pbrMetallicRoughness.baseColorFactor || [1,1,1,1]).slice());
    applyTune(mv, originals);
    if (primary) { initCameraHelper(mv); initLayoutTuner(stage, mv); }
    // Clear any leftover overrides from the retired slider panel.
    try { localStorage.removeItem('tune23441'); } catch {}
    const secs = (performance.now() - t0) / 1000;
    if (stat) setTimeout(() => {
      const b = transferred(current);
      const tris = dbg?.querySelector('button.is-on')?.dataset.tris || '';
      stat.classList.remove('err');
      stat.textContent = `${label()} · ${tris} tris · ${b ? MB(b) : '—'} · ${secs.toFixed(1)}s`;
    }, 60);
    if (dbg) $$('button[data-src]', dbg).forEach(b => b.disabled = false);
  });

  mv.addEventListener('error', () => {
    if (stat) { stat.classList.add('err'); stat.textContent = `${label()} · failed (likely out of memory)`; }
    if (dbg) $$('button[data-src]', dbg).forEach(b => b.disabled = false);
    if (!stage.classList.contains('is-ready')) giveUp();
  });

  /* orientation finder — CAD is Z-up, glTF is Y-up, and STL records
     neither. Cycle until it sits right, then bake the value into the
     `orientation` attribute in index.html. */
  const UPS = [[0,0],[90,0],[-90,0],[180,0],[0,90],[0,-90]];
  let upi = 0, yaw = 0;
  const orientEl = $('#dbg-orient', stage);
  const applyOrientation = () => {
    const [pitch, roll] = UPS[upi];
    const v = `${roll}deg ${pitch}deg ${yaw}deg`;
    mv.setAttribute('orientation', v);
    if (orientEl) orientEl.textContent = `orientation ${v}`;
    requestAnimationFrame(() => mv.updateFraming?.());
  };
  $('#dbg-flip', stage)?.addEventListener('click', () => { upi = (upi+1) % UPS.length; applyOrientation(); });
  $('#dbg-spin', stage)?.addEventListener('click', () => { yaw = (yaw+90) % 360; applyOrientation(); });
  $('#dbg-reset', stage)?.addEventListener('click', () => { upi = 0; yaw = 0; applyOrientation(); });

  dbg?.addEventListener('click', e => {
    const btn = e.target.closest('button[data-src]');
    if (!btn || btn.classList.contains('is-on')) return;
    $$('button[data-src]', dbg).forEach(b => { b.classList.remove('is-on'); b.disabled = true; });
    btn.classList.add('is-on');
    if (bar) bar.style.width = '0%';
    if (stat) { stat.classList.remove('err'); stat.textContent = `${btn.textContent} · starting…`; }
    t0 = performance.now(); current = btn.dataset.src; mv.src = current;
  });

  // Click-to-load: a viewer with data-src and no src waits behind its
  // blurred poster, so only KHRONOS costs anything on page load.
  const gate = $('.gate', stage);
  const start = () => { t0 = performance.now(); current = mv.dataset.src; mv.src = current; };
  if (gate && mv.dataset.src && !mv.getAttribute('src')) {
    stage.classList.add('is-gated');
    gate.addEventListener('click', () => {
      stage.classList.replace('is-gated', 'is-opening');
      start();
    }, { once: true });
  }

  // Auto-load (KHRONOS): hold the download until the rest of the page has
  // finished loading and the browser is idle. Decoding 9M triangles ties
  // up the main thread, and doing it during page load froze the site.
  if (mv.hasAttribute('data-autoload') && !mv.getAttribute('src')) {
    const idle = () => 'requestIdleCallback' in window
      ? requestIdleCallback(start, { timeout: 2000 }) : setTimeout(start, 200);
    document.readyState === 'complete' ? idle() : addEventListener('load', idle, { once: true });
  }

  // Re-frame on container resize too (orientation change, window drag).
  if ('ResizeObserver' in window) {
    let rt;
    new ResizeObserver(() => {
      clearTimeout(rt);
      rt = setTimeout(() => mv.updateFraming?.(), 180);
    }).observe(stage);
  }

  if (!('customElements' in window)) { giveUp(); return; }
  customElements.whenDefined('model-viewer').catch(giveUp);
  setTimeout(() => { if (!customElements.get('model-viewer')) giveUp(); }, 9000);
}

/* ── boot ───────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  renderTeam(); renderTimeline(); renderGallery(); renderPortfolios(); renderSponsors(); renderTicker(); initTickerTuner();
  observeReveals(); initLogoTuner(); renderHexes(); initSparks(); initKicker(); initHeader(); initMenu(); initCounters(); initForm(); initAboutVideo(); initRobots3D();
  const y = $('#year'); if (y) y.textContent = new Date().getFullYear();
});
