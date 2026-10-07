// components/orbit-showcase.config.js
/*
 * Tuning surface for the SequencePlatter (OrbitShowcase). Every value that
 * controls timing, easing, geometry, particle dispersion and node snapping
 * lives here so the component stays purely presentational.
 */

/* ---- Sequence timing ------------------------------------------------------ */

/**
 * Autoplay cadence between steps (ms). Set to 0 to disable autoplay.
 * On the Our Model Works page the carousel simply loops back to step 1.
 */
export const AUTOPLAY_MS = 3000;

/** Duration of the platter focal-swap itself (ms). */
export const FLIP_MS = 620;

/** Shared non-linear easing curve (power4-style ease-in-out). */
export const EASE = [0.65, 0, 0.35, 1];

/* ---- Spinning platter ----------------------------------------------------- */

/** How far the outgoing / incoming disc spins on the swap (deg). */
export const SPIN_DEG = 150;

/** Arc travel of the disc while it swaps (percentage of the disc). */
export const ARC_X = '16%';
export const ARC_Y = '14%';

/** Scale the disc shrinks to as it flies out. */
export const DISC_SCALE_OUT = 0.58;

/* ---- Particle dispersion (Z-axis explosion) ------------------------------- */

/** Number of foreground accent particles. */
export const PARTICLE_COUNT = 18;

/** Burst-out / return durations (ms) and idle float loop (s). */
export const PARTICLE_BURST_MS = 720;
export const PARTICLE_RETURN_MS = 950;
export const PARTICLE_FLOAT_S = 7;

/** Base outward travel (% of panel) and Z-axis dispersion (px). */
export const PARTICLE_DISTANCE = 34;
export const PARTICLE_Z = 170;

/** Peak scale the particles fly out to. */
export const PARTICLE_SCALE_OUT = 1.9;

/* ---- Orbital frame (fractions of the square panel) ------------------------ */

export const ORBIT = { cx: 1.15, cy: 0.5, size: 1.5 };
export const HERO = { cx: 0.62, cy: 0.5, size: 0.56, ring: 0.7 };

/* ---- Vertical wavy trail (fractions of the square panel) ------------------ */

export const WAVE = {
  startX: 0.3,
  endX: 0.14,
  amp: 0.06,
  cycles: 2.5,
  startY: 0.05,
  endY: 0.95,
};

/** Pixel offsets applied to every indicator node (node snapping offsets). */
export const NODE_OFFSET = { x: 0, y: 0 };

/* ---- Retire (fade the orbital frame as the section scrolls away) ---------- */

export const RETIRE = { start: 0.8, end: 1, y: '-50%' };

/* ---- Geometry helpers ----------------------------------------------------- */

const ACCENT_TONES = ['#0063F9', '#99C2FF', '#DCE9FC'];

/** A point on the wavy trail for normalised progress t (0..1). */
export const wavePoint = (w, h, t) => {
  const x =
    (WAVE.startX +
      (WAVE.endX - WAVE.startX) * t +
      WAVE.amp * Math.sin(2 * Math.PI * WAVE.cycles * t)) *
    w;
  const y = (WAVE.startY + (WAVE.endY - WAVE.startY) * t) * h;
  return { x, y };
};

/** The wavy trail as an SVG path string for a given panel size. */
export const wavePath = (w, h, samples = 140) => {
  let d = '';
  for (let i = 0; i <= samples; i += 1) {
    const { x, y } = wavePoint(w, h, i / samples);
    d += `${i === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)} `;
  }
  return d.trim();
};

/** Normalised progress values of the wave's crests / valleys. */
export const nodeTs = (count) =>
  Array.from({ length: count }, (_, k) => (0.25 + k * 0.5) / WAVE.cycles);

/** Deterministic particle field centred on the hero disc. */
export const PARTICLES = Array.from({ length: PARTICLE_COUNT }, (_, i) => {
  const angle = (i * 137.508) % 360; // golden-angle spread
  const rad = (angle * Math.PI) / 180;
  const radius = 20 + ((i * 9) % 26);
  const kind = i % 5 === 0 ? 'ring' : i % 2 === 0 ? 'circle' : 'square';

  return {
    id: i,
    x: HERO.cx * 100 + Math.cos(rad) * radius,
    y: HERO.cy * 100 + Math.sin(rad) * radius,
    size: 6 + (i % 4) * 3.5,
    dir: rad,
    distance: PARTICLE_DISTANCE + ((i * 13) % 26),
    float: 5 + (i % 4) * 2,
    baseOpacity: kind === 'ring' ? 0.7 : 0.9,
    scaleOut: PARTICLE_SCALE_OUT + (i % 3) * 0.3,
    rotate: 60 + (i % 4) * 45,
    delay: (i % 6) * 0.035,
    tone: ACCENT_TONES[i % ACCENT_TONES.length],
    kind,
  };
});
