// components/how-to-apply.jsx
import { useCallback, useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import './how-to-apply.css';

/*
 * "How to Apply" — an organic, scroll-driven onboarding timeline.
 *
 * A single smooth wavy SVG path flows down the canvas. A blue Pac-Man rides the
 * path: it orients to the curve tangent, opens its mouth toward whichever side
 * the matching step sits on, and grows from 1× at Step 1 to 2.5× at Step 4.
 * Step cards alternate sides and slide/fade in as the Pac-Man reaches them.
 *
 * The path is regenerated from the stage's measured pixel size (Catmull-Rom →
 * cubic Bézier), so it never distorts on resize; everything downstream reads
 * positions back via getPointAtLength().
 */

const STEPS = [
  {
    label: 'Step 1',
    text: 'Play the 95-minute online-cognitive games to uncover your potential. You have three attempts to play the games successfully.',
  },
  {
    label: 'Step 2',
    text: "We invite the successful applicants for the 4-week intense in-person selection process we call The 'Piscine'. Once selected, you will join the next Zone01 Kisumu cohort.",
  },
  {
    label: 'Step 3',
    text: 'Become an apprentice and complete the one year in-person training at our campus. Our peer-to-peer learning experience will transform you into a highly skilled full-stack engineer.',
  },
  {
    label: 'Step 4',
    text: 'Become an AI-ready Talent. We will put you on a path to guaranteed employment with our partner companies.',
  },
];

/* ---- Configurable animation constants ------------------------------------ */

const PATH_ANCHORS_Y = [0.05, 0.13, 0.4, 0.66, 0.87, 0.97]; // wave node heights
const STEP_TOP = [13, 40, 66, 87]; // card positions (% of stage height)
const SIDES = ['right', 'left', 'right', 'left'];

// Small callouts that sit on the wave between Step 1 and Step 2.
const WAYPOINTS = [
  { lines: ['Welcome to Check-in.', 'We would like to meet you!'], u: 0.225, side: 'right' },
  { lines: ['ONBOARDING'], u: 0.305, side: 'left' },
];

const BASE_SCALE = 1; // Pac-Man scale at Step 1
const MAX_SCALE = 2.5; // Pac-Man scale at Step 4
const MOUTH_CLOSED = 10; // degrees, half-angle when closed
const MOUTH_OPEN = 42; // degrees, half-angle when wide open
const STEP_WINDOW = 0.085; // progress window around a step that opens the mouth
const LOCAL_R = 18; // Pac-Man local radius (viewBox units)

const EASE = [0.16, 1, 0.3, 1];

// Celebration: the Pac-Man bursts/dies at the end, then the confetti keeps going.
const CELEBRATE_AT = 0.95; // scroll progress where the Pac-Man dies
const PAC_BURST_MS = 260; // pause after the Pac-Man dies before the confetti
const CELEBRATION_INTERVAL = 1500; // ms between confetti bursts while celebrating
const CONFETTI_COLORS = ['#0063f9', '#facc15', '#22c55e', '#ec4899', '#06b6d4', '#f97316'];

// Precomputed once at module load so it stays stable across renders.
const CONFETTI_PIECES = Array.from({ length: 30 }, (_, i) => {
  const angle = (Math.PI * 2 * i) / 30 + Math.random() * 0.5;
  const distance = 70 + Math.random() * 110;
  return {
    tx: `${Math.cos(angle) * distance}px`,
    ty: `${Math.sin(angle) * distance - 36}px`,
    rot: `${Math.round(Math.random() * 720 - 360)}deg`,
    delay: `${Math.round(Math.random() * 140)}ms`,
    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
    size: 6 + Math.round(Math.random() * 7),
  };
});

/* ---- Helpers ------------------------------------------------------------- */

// Convert a list of points into a smooth cubic-Bézier path (Catmull-Rom).
const catmullRom2bezier = (points) => {
  if (points.length < 2) return '';
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i += 1) {
    const p0 = points[i - 1] || points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] || p2;
    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${c1x} ${c1y}, ${c2x} ${c2y}, ${p2.x} ${p2.y}`;
  }
  return d;
};

// Build the wave's anchor points for a given stage size.
const buildAnchors = (w, h) => {
  const cx = w / 2;
  const amp = w * (w < 640 ? 0.14 : 0.12);
  return PATH_ANCHORS_Y.map((ty, i) => {
    const isEnd = i === 0 || i === PATH_ANCHORS_Y.length - 1;
    const side = isEnd ? 'center' : SIDES[i - 1];
    const x = side === 'center' ? cx : side === 'right' ? cx + amp : cx - amp;
    return { x, y: ty * h };
  });
};

// A classic Pac-Man wedge: circle with a mouth removed toward +x.
const pacShape = (radius, halfDeg) => {
  const a = (halfDeg * Math.PI) / 180;
  const x = radius * Math.cos(a);
  const y = radius * Math.sin(a);
  return `M 0 0 L ${x} ${-y} A ${radius} ${radius} 0 1 0 ${x} ${y} Z`;
};

// A one-shot confetti burst that celebrates reaching the final milestone.
const Celebration = ({ x, y }) => (
  <div className="hta-celebration" style={{ left: x, top: y }} aria-hidden="true">
    <span className="hta-celebration__ring" />
    {CONFETTI_PIECES.map((piece, i) => (
      <span
        key={i}
        className="hta-confetti"
        style={{
          '--tx': piece.tx,
          '--ty': piece.ty,
          '--rot': piece.rot,
          '--c': piece.color,
          '--d': piece.delay,
          width: piece.size,
          height: piece.size,
        }}
      />
    ))}
  </div>
);

const HowToApply = () => {
  const stageRef = useRef(null);
  const pathRef = useRef(null);
  const clipRef = useRef(null);
  const pacRef = useRef(null);
  const mouthRef = useRef(null);
  const geomRef = useRef({ total: 0, nodes: [] });
  const rafRef = useRef(0);
  const activeRef = useRef(0);
  const celebratingRef = useRef(false);

  const [size, setSize] = useState({ w: 0, h: 0 });
  const [active, setActive] = useState(0);
  const [waypoints, setWaypoints] = useState([]);
  const [endPoint, setEndPoint] = useState(null);
  const [endReached, setEndReached] = useState(false);
  const [celebrating, setCelebrating] = useState(false);
  const [burst, setBurst] = useState(0);

  const rawId = useId();
  const clipId = `hta-clip-${rawId.replace(/:/g, '')}`;

  /* Measure the stage so the SVG can be generated at 1:1 pixel scale. */
  useLayoutEffect(() => {
    const el = stageRef.current;
    if (!el) return undefined;

    const measure = () => setSize({ w: el.clientWidth, h: el.clientHeight });
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    measure();

    return () => ro.disconnect();
  }, []);

  /* The wavy path, regenerated whenever the stage size changes. */
  const d = useMemo(() => {
    if (!size.w || !size.h) return '';
    return catmullRom2bezier(buildAnchors(size.w, size.h));
  }, [size.w, size.h]);

  /* Paint the Pac-Man onto the path for the current scroll progress. */
  const paint = useCallback(() => {
    const stage = stageRef.current;
    const path = pathRef.current;
    const pac = pacRef.current;
    const mouth = mouthRef.current;
    const clip = clipRef.current;
    const geom = geomRef.current;
    if (!stage || !path || !pac || !mouth || !geom.total) return;

    const rect = stage.getBoundingClientRect();
    const vh = window.innerHeight || 1;
    const startY = vh * 0.12;
    const endY = vh * 0.88 - rect.height;

    let p = (startY - rect.top) / (startY - endY || 1);
    p = Math.max(0, Math.min(1, p));

    // The Pac-Man dies on reaching the end; the celebration follows shortly.
    const inZone = p >= CELEBRATE_AT;
    pac.style.opacity = inZone ? '0' : '1';
    if (inZone !== celebratingRef.current) {
      celebratingRef.current = inZone;
      setEndReached(inZone);
      if (!inZone) setCelebrating(false);
    }

    const len = p * geom.total;
    const pt = path.getPointAtLength(len);
    const ahead = path.getPointAtLength(Math.min(len + 1, geom.total));
    const tangent = (Math.atan2(ahead.y - pt.y, ahead.x - pt.x) * 180) / Math.PI;

    // Mouth opens + body turns toward the nearest step's side.
    let weight = 0;
    let side = 'right';
    geom.nodes.forEach((node) => {
      const bump = Math.max(0, 1 - Math.abs(p - node.u) / STEP_WINDOW);
      if (bump > weight) {
        weight = bump;
        side = node.side;
      }
    });

    const faceAngle = side === 'right' ? 0 : 180;
    const rotate = tangent + (faceAngle - tangent) * weight;

    // Growth: 1× at Step 1 → MAX_SCALE at Step 4.
    const first = geom.nodes[0]?.u ?? 0.18;
    const last = geom.nodes[geom.nodes.length - 1]?.u ?? 0.81;
    const growth = Math.max(0, Math.min(1, (p - first) / (last - first || 1)));
    const scale = BASE_SCALE + (MAX_SCALE - BASE_SCALE) * growth;

    const radiusPx = Math.max(10, Math.min(18, stage.clientWidth * 0.02));
    const localScale = (radiusPx * scale) / LOCAL_R;

    mouth.setAttribute('d', pacShape(LOCAL_R, MOUTH_CLOSED + (MOUTH_OPEN - MOUTH_CLOSED) * weight));
    pac.setAttribute('transform', `translate(${pt.x} ${pt.y}) rotate(${rotate}) scale(${localScale})`);
    if (clip) clip.setAttribute('height', Math.max(0, pt.y + 2));

    const reached = geom.nodes.reduce((acc, node, i) => (p >= node.u - 0.02 ? i + 1 : acc), 0);
    if (reached !== activeRef.current) {
      activeRef.current = reached;
      setActive(reached);
    }
  }, []);

  /* Recompute path geometry (length + step positions) whenever it changes. */
  useEffect(() => {
    const path = pathRef.current;
    if (!path || !d || !size.w || !size.h) return;

    const total = path.getTotalLength();
    const anchors = buildAnchors(size.w, size.h);
    const end = path.getPointAtLength(total);
    const SAMPLES = 480;

    const nodes = SIDES.map((side, i) => {
      const target = anchors[i + 1];
      let bestU = (i + 1) / (SIDES.length + 1);
      let bestDist = Infinity;
      for (let s = 0; s <= SAMPLES; s += 1) {
        const u = s / SAMPLES;
        const q = path.getPointAtLength(u * total);
        const dist = (q.x - target.x) ** 2 + (q.y - target.y) ** 2;
        if (dist < bestDist) {
          bestDist = dist;
          bestU = u;
        }
      }
      return { u: bestU, side };
    });

    geomRef.current = { total, nodes };
    setEndPoint(end);
    setWaypoints(
      WAYPOINTS.map((w) => {
        const pt = path.getPointAtLength(w.u * total);
        return { ...w, x: pt.x, y: pt.y };
      }),
    );
    paint();
  }, [d, size.w, size.h, paint]);

  /* Once the Pac-Man dies, start the celebration after a short beat. */
  useEffect(() => {
    if (!endReached) return undefined;

    const id = window.setTimeout(() => setCelebrating(true), PAC_BURST_MS);
    return () => window.clearTimeout(id);
  }, [endReached]);

  /* Keep the confetti going for as long as we're at the end. */
  useEffect(() => {
    if (!celebrating) return undefined;

    const id = window.setInterval(() => setBurst((b) => b + 1), CELEBRATION_INTERVAL);
    return () => window.clearInterval(id);
  }, [celebrating]);

  /* Scroll / resize drive the animation. */
  useEffect(() => {
    const schedule = () => {
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = 0;
        paint();
      });
    };

    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    paint();

    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [paint]);

  /* Clicking a step scrolls the Pac-Man to that milestone. */
  const scrollToStep = useCallback((i) => {
    const stage = stageRef.current;
    const geom = geomRef.current;
    if (!stage || !geom.total) return;

    const rect = stage.getBoundingClientRect();
    const stageTop = rect.top + window.scrollY;
    const vh = window.innerHeight;
    const startY = vh * 0.12;
    const endY = vh * 0.88 - rect.height;
    const u = geom.nodes[i]?.u ?? (i + 1) / (SIDES.length + 1);
    const top = u * (startY - endY) - startY + stageTop;

    window.scrollTo({ top, behavior: 'smooth' });
  }, []);

  return (
    <section id="how-to-apply" data-nav-theme="light" aria-labelledby="how-to-apply-title" className="hta">
      <div className="hta__inner">
        <header className="hta__head">
          <h2 id="how-to-apply-title" className="hta__title">
            How to Apply
          </h2>
          <p className="hta__lead">
            Follow the path — four steps from potential to placement.
          </p>
        </header>

        <div ref={stageRef} className="hta__stage">
          <svg
            className="hta-wave"
            viewBox={`0 0 ${size.w || 1} ${size.h || 1}`}
            preserveAspectRatio="xMidYMid meet"
            aria-hidden="true"
          >
            <defs>
              <clipPath id={clipId} clipPathUnits="userSpaceOnUse">
                <rect ref={clipRef} x="0" y="0" width={size.w || 1} height="0" />
              </clipPath>
            </defs>

            <path ref={pathRef} d={d} className="hta-wave__base" />
            <path d={d} className="hta-wave__trail" clipPath={`url(#${clipId})`} />

            <g ref={pacRef} className="hta-pac">
              <path ref={mouthRef} className="hta-pac__body" />
              <circle className="hta-pac__eye" cx="1.8" cy="-8.1" r="3" />
              <circle className="hta-pac__pupil" cx="3.4" cy="-8.1" r="1.4" />
            </g>
          </svg>

          {STEPS.map((step, i) => {
            const visible = active > i;
            const fromRight = SIDES[i] === 'right';

            return (
              <button
                key={step.label}
                type="button"
                onClick={() => scrollToStep(i)}
                className={`hta-step hta-step--${SIDES[i]}`}
                style={{ top: `${STEP_TOP[i]}%` }}
                aria-label={`Jump to ${step.label}`}
              >
                <motion.div
                  className="hta-step__card"
                  initial={false}
                  animate={
                    visible
                      ? { opacity: 1, x: 0 }
                      : { opacity: 0, x: fromRight ? 36 : -36 }
                  }
                  transition={{ duration: 0.55, ease: EASE }}
                >
                  <span className="hta-step__index">{`0${i + 1}`}</span>
                  <p className="hta-step__label">{step.label}</p>
                  <p className="hta-step__text">{step.text}</p>
                </motion.div>
              </button>
            );
          })}

          {/* Waypoint callouts on the wave between Step 1 and Step 2. */}
          {waypoints.map((wp) => (
            <div
              key={wp.lines[0]}
              className={`hta-waypoint hta-waypoint--${wp.side}${active >= 1 ? ' is-visible' : ''}`}
              style={{ left: wp.x, top: wp.y }}
            >
              {wp.lines.map((line) => (
                <span key={line} className="hta-waypoint__line">
                  {line}
                </span>
              ))}
            </div>
          ))}

          {/* Confetti celebration at the end of the wave. */}
          {celebrating && endPoint && (
            <Celebration key={burst} x={endPoint.x} y={endPoint.y} />
          )}
        </div>
      </div>
    </section>
  );
};

export default HowToApply;
