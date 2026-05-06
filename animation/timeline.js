/* ============================================================
   Quarry — From Foundations to Form
   Deterministic 8s timeline at 30fps.

   Single source of truth: renderFrame(t) where t is seconds [0..8].
   Both the interactive HUD and the headless renderer call this.
   ============================================================ */

const DURATION = 8.0;          // seconds
const FPS = 30;

// ---------- math helpers ----------
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const lerp = (a, b, t) => a + (b - a) * t;
const smoothstep = (a, b, x) => {
  const t = clamp((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};
const easeInOutCubic = (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
const easeInCubic = (t) => t * t * t;
const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4);
const easeOutBack = (t) => {
  const c1 = 1.70158, c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
};

// segment(t, a, b) → 0 before a, 1 after b, interpolated within
const segment = (t, a, b, ease = easeInOutCubic) => {
  if (t <= a) return 0;
  if (t >= b) return 1;
  return ease((t - a) / (b - a));
};

// ---------- DOM cache ----------
const $ = (id) => document.getElementById(id);
const els = {};

function cacheDom() {
  els.stage = $('stage');
  els.legacy = $('legacy');
  els.legacyChars = document.querySelectorAll('.legacy-name .char');
  els.gridFine = document.querySelector('.grid-fill-fine');
  els.gridCoarse = document.querySelector('.grid-fill-coarse');
  els.gridLayer = document.querySelector('.grid');
  els.counter = $('counter');
  els.counterValue = $('counter-value');
  els.counterRule = document.querySelector('.counter-rule');
  els.cadLines = $('cad-lines');
  els.qGroup = $('q-group');
  els.qWire = $('q-wire');
  els.qGlass = $('q-glass');
  els.qSolid = $('q-solid');
  els.qSpecRect = $('q-spec-rect');
  els.wordQuarry = document.querySelector('.word-quarry');
  els.wordArch = document.querySelector('.word-arch');
  els.wordFormerly = document.querySelector('.word-formerly');
  els.bloom = $('bloom');
}

// ---------- CAD line generation ----------
// Generate a deterministic set of architectural construction lines
// that draw progressively through the counter beat. Lines hint at
// the Q without being literal — they should feel like surveying.
function generateCadLines() {
  const g = els.cadLines;
  // Q sits at translate(280, 660) scale 1, geometry 520x600 → bbox 280..800 x 660..1260
  const QX = 280, QY = 660, QW = 520, QH = 600;
  const cx = QX + QW / 2; // 540
  const cy = QY + QH / 2; // 960
  const lines = [];

  // 1. Outer construction lines: a frame that hints at the Q's bbox, with extension marks
  lines.push(['line', QX - 80, QY, QX + QW + 80, QY]);                       // top extension
  lines.push(['line', QX - 80, QY + QH, QX + QW + 80, QY + QH]);             // bottom extension
  lines.push(['line', QX, QY - 60, QX, QY + QH + 60]);                       // left extension
  lines.push(['line', QX + QW, QY - 60, QX + QW, QY + QH + 60]);             // right extension

  // 2. Center cross-hairs (registration)
  lines.push(['line', cx - 90, cy, cx + 90, cy]);
  lines.push(['line', cx, cy - 90, cx, cy + 90]);

  // 3. Diagonals from Q corners (surveying triangulation)
  lines.push(['line', QX, QY, QX + QW, QY + QH]);
  lines.push(['line', QX + QW, QY, QX, QY + QH]);

  // 4. Two short hash marks above and below (dimension ticks)
  lines.push(['path', `M ${QX} ${QY - 40} L ${QX} ${QY - 20} M ${QX + QW} ${QY - 40} L ${QX + QW} ${QY - 20} M ${QX} ${QY - 30} L ${QX + QW} ${QY - 30}`]);
  lines.push(['path', `M ${QX} ${QY + QH + 40} L ${QX} ${QY + QH + 20} M ${QX + QW} ${QY + QH + 40} L ${QX + QW} ${QY + QH + 20} M ${QX} ${QY + QH + 30} L ${QX + QW} ${QY + QH + 30}`]);

  // 5. Inner sub-grid: 3x3 rule-of-thirds within the Q bbox
  for (let i = 1; i < 3; i++) {
    lines.push(['line', QX, QY + (QH / 3) * i, QX + QW, QY + (QH / 3) * i]);
    lines.push(['line', QX + (QW / 3) * i, QY, QX + (QW / 3) * i, QY + QH]);
  }

  // 6. Tail-direction guideline (hint at the diagonal tail of the Q)
  lines.push(['line', QX + 380, QY + 380, QX + QW + 100, QY + QH + 100]);

  // Append to SVG
  lines.forEach(([type, ...args], i) => {
    const el = document.createElementNS('http://www.w3.org/2000/svg', type);
    if (type === 'line') {
      el.setAttribute('x1', args[0]);
      el.setAttribute('y1', args[1]);
      el.setAttribute('x2', args[2]);
      el.setAttribute('y2', args[3]);
    } else {
      el.setAttribute('d', args[0]);
    }
    g.appendChild(el);
    // length for stroke-dash control
    const len = el.getTotalLength ? el.getTotalLength() : 1200;
    el.style.setProperty('--len', len);
    el.dataset.len = len;
    el.dataset.index = i;
    el.style.strokeDasharray = len;
    el.style.strokeDashoffset = len;
  });
}

// ---------- per-beat computations ----------

function renderLegacy(t) {
  // 0.0–0.6: fade in
  // 1.8–2.4: dim (legacy stays faintly during counter)
  // 5.0–6.4: fragment downward + fade out
  const fadeIn = segment(t, 0.0, 0.6, easeOutCubic);
  const dim = segment(t, 1.8, 2.4, easeInOutCubic);  // 1 → dimmed
  const frag = segment(t, 5.0, 6.4, easeInCubic);

  const baseOpacity = fadeIn * (1 - 0.55 * dim);
  els.legacy.style.opacity = (1 - frag) * baseOpacity;

  // Character fragmentation: each char picks up a small downward translate + rotation
  // staggered by index, only kicks in during 5.0–6.4
  els.legacyChars.forEach((ch) => {
    const i = parseInt(ch.dataset.i, 10);
    if (Number.isNaN(i)) return;
    const stagger = (i % 8) * 0.04;
    const local = clamp((t - (5.0 + stagger)) / 1.0);
    const drop = easeInCubic(local) * (60 + (i % 4) * 30);
    const rot = easeInCubic(local) * ((i % 2 === 0 ? 1 : -1) * (4 + (i % 3)));
    ch.style.transform = `translateY(${drop}px) rotate(${rot}deg)`;
    ch.style.opacity = (1 - local).toFixed(3);
  });
}

function renderGrid(t) {
  // 0.6–1.4: fade in to 8%
  // 5.0–6.0: fade out (give visual room for Q reveal)
  // 6.5–8.0: stay at near-zero
  const fadeIn = segment(t, 0.6, 1.4, easeOutCubic);
  const fadeOut = segment(t, 5.0, 6.0, easeInOutCubic);
  els.gridLayer.style.opacity = (fadeIn * 0.08 * (1 - fadeOut)).toFixed(4);
}

function renderCounter(t) {
  // 2.0–2.2: fade in + rule expand
  // 2.0–4.85: tick 1987 → 2026 with ease-in-out
  // 4.85–5.0: hold + small pulse
  // 5.0–5.4: scale up + fade out
  const fadeIn = segment(t, 1.95, 2.2, easeOutCubic);
  const fadeOut = segment(t, 5.0, 5.4, easeInCubic);
  const opacity = fadeIn * (1 - fadeOut);
  els.counter.style.opacity = opacity.toFixed(3);

  // value ramp
  let yearProgress;
  if (t < 2.0) {
    yearProgress = 0;
  } else if (t > 4.85) {
    yearProgress = 1;
  } else {
    // ease-in-out: lingers at 1987, accelerates middle, settles into 2026
    yearProgress = easeInOutCubic((t - 2.0) / (4.85 - 2.0));
  }
  const year = Math.floor(lerp(1987, 2026, yearProgress));
  els.counterValue.textContent = String(Math.min(2026, year));

  // glow on counter (pulse near lock)
  const lockPulse = segment(t, 4.78, 4.95, easeOutCubic) * (1 - segment(t, 4.95, 5.2, easeOutCubic));
  const glow = 18 + lockPulse * 60;
  const glowOpac = 0.35 + lockPulse * 0.7;
  els.counterValue.style.textShadow = `0 0 ${glow}px rgba(244, 122, 53, ${glowOpac})`;

  // counter rule width: 0 → 360 during 2.0–2.4, then expands to 540 on lock
  const ruleA = segment(t, 2.0, 2.4, easeOutCubic);
  const ruleB = segment(t, 4.85, 5.0, easeOutCubic);
  const ruleW = ruleA * 360 + ruleB * 180;
  els.counterRule.style.width = `${ruleW}px`;

  // pre-lock scale nudge: 5.0–5.13 quick 1.0 → 1.04, then 5.13–5.4 back to 0.96 as it fades
  const nudgeUp = segment(t, 5.0, 5.13, easeOutCubic);
  const nudgeDown = segment(t, 5.13, 5.4, easeInOutCubic);
  const scale = 1.0 + nudgeUp * 0.04 - nudgeDown * 0.08;
  els.counterValue.style.transform = `scale(${scale})`;
}

function renderCadLines(t) {
  // CAD lines progressively draw 2.0–4.85, then 5.0–5.6 they "settle" (fade out as Q forms)
  // They reach full draw at 4.85.
  const lines = els.cadLines.querySelectorAll('line, path');
  const total = lines.length;
  const drawWindow = [2.05, 4.85];

  lines.forEach((el, i) => {
    const len = parseFloat(el.dataset.len);
    // staggered start: each line begins drawing in sequence
    const stagger = (i / total) * (drawWindow[1] - drawWindow[0]) * 0.7;
    const startAt = drawWindow[0] + stagger;
    const endAt = startAt + 0.5;
    const drawn = segment(t, startAt, endAt, easeOutCubic);
    const fadeOut = segment(t, 5.0, 5.6, easeInOutCubic);
    el.style.strokeDashoffset = (len * (1 - drawn)).toFixed(2);
    el.style.opacity = (drawn * (1 - fadeOut) * 0.85).toFixed(3);
  });
}

function renderQ(t) {
  // Stages:
  //   5.4 – 6.5: wireframe Q (edge-only) draws in over the converged CAD lines
  //   6.5 – 6.95: glass Q crossfades from wireframe
  //   6.95 – 7.25: solid Q crossfades from glass
  //   7.1 – 7.5: specular sweep across Q silhouette
  //   7.6 – 8.0: settle

  const wireIn  = segment(t, 5.4, 6.2, easeOutCubic);
  const wireOut = segment(t, 6.5, 6.95, easeInOutCubic);
  els.qWire.style.opacity = (wireIn * (1 - wireOut)).toFixed(3);

  const glassIn  = segment(t, 6.5, 6.95, easeOutCubic);
  const glassOut = segment(t, 6.95, 7.25, easeInOutCubic);
  els.qGlass.style.opacity = (glassIn * (1 - glassOut * 0.85)).toFixed(3);

  const solidIn = segment(t, 6.95, 7.30, easeOutCubic);
  els.qSolid.style.opacity = solidIn.toFixed(3);

  // Specular sweep: a thin white band moves left-to-right across the Q from 7.1–7.5
  const sweep = segment(t, 7.10, 7.55, easeInOutCubic);
  const specOp = segment(t, 7.10, 7.20) * (1 - segment(t, 7.45, 7.60));
  els.qSpecRect.style.opacity = specOp.toFixed(3);
  // x position: travel from -300 → 800 (covers the full Q box and a bit of overrun)
  const sx = lerp(-300, 800, sweep);
  els.qSpecRect.setAttribute('x', sx.toFixed(1));

  // Q group transform:
  //   5.4 → 6.5: scale from 0.92 → 1.0 (forming)
  //   5.0 → 5.13 → 5.4: small "breath" pulse over the lock
  //   7.6 → 8.0: micro-settle (1.0 → 1.012)
  const formIn = segment(t, 5.4, 6.5, easeOutQuart);
  const formScale = 0.92 + formIn * 0.08;
  const breath = segment(t, 5.0, 5.13, easeOutCubic) - segment(t, 5.13, 5.4, easeInOutCubic);
  const settle = segment(t, 7.6, 8.0, easeOutCubic) * 0.012;
  const scale = formScale * (1 + breath * 0.02 + settle);
  els.qGroup.setAttribute('transform', `scale(${scale.toFixed(4)})`);
  // Apply transform-origin via CSS (already set in stylesheet, but ensure for SVG):
  els.qGroup.style.transformOrigin = '540px 960px';
  els.qGroup.style.transformBox = 'view-box';
}

function renderWordmark(t) {
  // QUARRY: 7.0–7.4 rise + fade
  // ARCHITECTS: 7.2–7.6 rise + fade
  // Formerly: 7.5–7.9 fade in (no rise)
  const qIn = segment(t, 7.0, 7.4, easeOutQuart);
  const aIn = segment(t, 7.2, 7.6, easeOutQuart);
  const fIn = segment(t, 7.55, 7.95, easeOutCubic);

  els.wordQuarry.style.opacity = qIn.toFixed(3);
  els.wordQuarry.style.transform = `translateY(${(1 - qIn) * 60}px)`;

  els.wordArch.style.opacity = aIn.toFixed(3);
  els.wordArch.style.transform = `translateY(${(1 - aIn) * 40}px)`;

  els.wordFormerly.style.opacity = (fIn * 0.55).toFixed(3);
}

function renderBloom(t) {
  // Bloom flash: peaks at 7.7, decays to 8.0; also a small initial flash on solid lock at 7.0
  const lockFlash = segment(t, 6.95, 7.05, easeOutCubic) * (1 - segment(t, 7.05, 7.3, easeOutCubic));
  const finalBloom = segment(t, 7.5, 7.75, easeOutCubic) * (1 - segment(t, 7.75, 8.0, easeInOutCubic));
  const op = lockFlash * 0.5 + finalBloom * 0.85;
  els.bloom.style.opacity = op.toFixed(3);
}

function renderCamera(t) {
  // Camera = subtle scale on the whole stage (we don't use this much; reserved for cinematic finish)
  // Light camera ease-in across reveal: 6.5 → 8.0 stage scales 1.0 → 1.015
  const ease = segment(t, 6.5, 8.0, easeOutQuart);
  const scale = 1.0 + ease * 0.015;
  els.stage.style.transform = `scale(${scale})`;
  els.stage.style.transformOrigin = '50% 55%';
}

// ---------- main render ----------
function renderFrame(t) {
  t = clamp(t, 0, DURATION);
  renderGrid(t);
  renderLegacy(t);
  renderCounter(t);
  renderCadLines(t);
  renderQ(t);
  renderWordmark(t);
  renderBloom(t);
  renderCamera(t);
}

// expose for headless renderer
window.renderFrame = renderFrame;
window.QUARRY_DURATION = DURATION;
window.QUARRY_FPS = FPS;

// ---------- HUD playback ----------
let playing = false;
let startedAt = 0;
let pausedT = 0;

function loop(now) {
  if (!playing) return;
  const elapsed = (now / 1000) - startedAt + pausedT;
  if (elapsed >= DURATION) {
    renderFrame(DURATION);
    setTime(DURATION);
    playing = false;
    return;
  }
  renderFrame(elapsed);
  setTime(elapsed);
  requestAnimationFrame(loop);
}

function setTime(t) {
  const scrub = $('scrub');
  if (scrub) scrub.value = t.toFixed(4);
  const ro = $('time-readout');
  if (ro) ro.textContent = `${t.toFixed(2)} / ${DURATION.toFixed(2)}s`;
}

function play() {
  if (pausedT >= DURATION) pausedT = 0;
  startedAt = performance.now() / 1000;
  playing = true;
  requestAnimationFrame(loop);
}
function pause() {
  if (!playing) return;
  pausedT = (performance.now() / 1000) - startedAt + pausedT;
  playing = false;
}
function restart() {
  pausedT = 0;
  startedAt = performance.now() / 1000;
  playing = true;
  requestAnimationFrame(loop);
}

function bindHud() {
  $('play')?.addEventListener('click', play);
  $('pause')?.addEventListener('click', pause);
  $('restart')?.addEventListener('click', restart);
  $('scrub')?.addEventListener('input', (e) => {
    pause();
    pausedT = parseFloat(e.target.value);
    renderFrame(pausedT);
    setTime(pausedT);
  });
  $('toggle-safe')?.addEventListener('change', (e) => {
    document.body.classList.toggle('show-safe', e.target.checked);
  });
}

// ---------- preview scaling ----------
function applyPreviewScale() {
  // If the viewport is smaller than 1080x1920, scale stage proportionally
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const sx = vw / 1080;
  const sy = vh / 1920;
  const s = Math.min(sx, sy, 1);
  if (s < 1) {
    document.body.classList.add('preview');
    document.documentElement.style.setProperty('--preview-scale', s.toFixed(4));
    // center on screen
    els.stage.style.position = 'absolute';
    els.stage.style.left = '50%';
    els.stage.style.top = '0';
    els.stage.style.marginLeft = `${-540 * s}px`;
    els.stage.style.marginTop = `${(vh - 1920 * s) / 2}px`;
  }
}

// ---------- init ----------
function init() {
  cacheDom();
  generateCadLines();
  bindHud();

  // headless mode flag — set by ?headless=1 query
  const params = new URLSearchParams(window.location.search);
  if (params.has('headless')) {
    document.body.classList.add('headless');
  } else {
    applyPreviewScale();
    window.addEventListener('resize', applyPreviewScale);
  }

  // Initial frame
  renderFrame(0);
  setTime(0);

  // Auto-play in interactive mode (delay 200ms so fonts can load)
  if (!params.has('headless')) {
    setTimeout(play, 250);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
