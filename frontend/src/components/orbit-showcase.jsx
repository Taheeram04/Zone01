// components/orbit-showcase.jsx
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import {
  AnimatePresence,
  motion,
  useAnimationControls,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'framer-motion';
import {
  ARC_X,
  ARC_Y,
  DISC_SCALE_OUT,
  EASE,
  FLIP_MS,
  HERO,
  NODE_OFFSET,
  ORBIT,
  PARTICLES,
  PARTICLE_BURST_MS,
  PARTICLE_FLOAT_S,
  PARTICLE_RETURN_MS,
  PARTICLE_Z,
  RETIRE,
  SPIN_DEG,
  nodeTs,
  wavePath,
  wavePoint,
} from './orbit-showcase.config.js';

/* ==========================================================================
   OrbitShowcase — a controlled "spinning platter" sequence canvas
   --------------------------------------------------------------------------
   Layer 1  orbital frame + vertical wavy trail (background)
   Layer 2  the spinning circular hero disc (midground)
   Layer 3  accent particles that burst out on the Z-axis on every swap
   Nodes    interactive index indicators riding the wave's crests / valleys

   This component is fully controlled: pass `active` and `onSelect`.
   All timing / easing / dispersion knobs live in orbit-showcase.config.js.
   ========================================================================== */

const Particle = ({ p, burst }) => {
  const controls = useAnimationControls();

  useEffect(() => {
    let alive = true;

    (async () => {
      await controls.start({
        x: Math.cos(p.dir) * p.distance,
        y: Math.sin(p.dir) * p.distance,
        z: PARTICLE_Z,
        scale: p.scaleOut,
        opacity: 0.05,
        rotate: p.rotate,
        transition: {
          duration: PARTICLE_BURST_MS / 1000,
          ease: EASE,
          delay: p.delay,
        },
      });
      if (!alive) return;

      controls.start({
        x: 0,
        y: 0,
        z: 0,
        scale: 1,
        opacity: p.baseOpacity,
        rotate: 0,
        transition: { duration: PARTICLE_RETURN_MS / 1000, ease: EASE },
      });
    })();

    return () => {
      alive = false;
    };
  }, [burst, controls, p]);

  return (
    <motion.span
      className="absolute"
      style={{
        left: `${p.x}%`,
        top: `${p.y}%`,
        width: p.size,
        height: p.size,
        marginLeft: -p.size / 2,
        marginTop: -p.size / 2,
        transformStyle: 'preserve-3d',
      }}
      animate={{
        y: [0, -p.float, 0, p.float * 0.6, 0],
        rotate: [0, p.rotate * 0.2, 0, -p.rotate * 0.12, 0],
      }}
      transition={{
        duration: PARTICLE_FLOAT_S,
        repeat: Infinity,
        ease: 'easeInOut',
        delay: p.delay,
      }}
    >
      <motion.span
        className={`block h-full w-full ${
          p.kind === 'square' ? 'rounded-[2px]' : 'rounded-full'
        } ${p.kind === 'ring' ? 'border-2' : ''}`}
        style={
          p.kind === 'ring'
            ? { borderColor: p.tone }
            : { backgroundColor: p.tone }
        }
        initial={{ opacity: p.baseOpacity }}
        animate={controls}
      />
    </motion.span>
  );
};

const OrbitShowcase = ({
  slides = [],
  active = 0,
  onSelect = () => {},
  className = '',
}) => {
  const reduced = useReducedMotion();
  const rootRef = useRef(null);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [retired, setRetired] = useState(false);

  /* Measure the canvas so the SVG is generated at 1:1 pixel scale. */
  useLayoutEffect(() => {
    const el = rootRef.current;
    if (!el) return undefined;

    const measure = () => setSize({ w: el.clientWidth, h: el.clientHeight });
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    measure();

    return () => ro.disconnect();
  }, []);

  /* Scroll-linked "retire": the orbital frame drifts up and fades as the
     section leaves the viewport (the hero + particles stay). */
  const { scrollYProgress } = useScroll({
    target: rootRef,
    offset: ['start end', 'end start'],
  });
  const retireY = useTransform(scrollYProgress, [RETIRE.start, RETIRE.end], ['0%', RETIRE.y]);
  const retireOpacity = useTransform(scrollYProgress, [RETIRE.start, RETIRE.end], [1, 0]);
  useMotionValueEvent(scrollYProgress, 'change', (v) =>
    setRetired(v > RETIRE.end - 0.06),
  );

  const d = useMemo(
    () => (size.w && size.h ? wavePath(size.w, size.h) : ''),
    [size.w, size.h],
  );
  const nodes = useMemo(
    () => nodeTs(slides.length).map((t) => wavePoint(size.w, size.h, t)),
    [slides.length, size.w, size.h],
  );

  const hero = slides[active];

  const discVariants = reduced
    ? {
        enter: { opacity: 0 },
        center: { opacity: 1, transition: { duration: 0.25 } },
        exit: { opacity: 0, transition: { duration: 0.2 } },
      }
    : {
        enter: {
          rotate: -SPIN_DEG,
          scale: DISC_SCALE_OUT,
          opacity: 0,
          x: `-${ARC_X}`,
          y: ARC_Y,
        },
        center: {
          rotate: 0,
          scale: 1,
          opacity: 1,
          x: 0,
          y: 0,
          transition: { duration: FLIP_MS / 1000, ease: EASE },
        },
        exit: {
          rotate: SPIN_DEG,
          scale: DISC_SCALE_OUT,
          opacity: 0,
          x: ARC_X,
          y: `-${ARC_Y}`,
          transition: { duration: FLIP_MS / 1000, ease: EASE },
        },
      };

  return (
    <motion.div
      ref={rootRef}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.8, ease: EASE }}
      className={`relative mx-auto aspect-square w-full max-w-[560px] overflow-hidden ${className}`}
      style={{ perspective: 1200, isolation: 'isolate' }}
    >
      {/* Layer 1a — static framing around the disc -------------------------- */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <span
          className="absolute rounded-full border border-primary/25"
          style={{
            width: `${HERO.ring * 100}%`,
            aspectRatio: '1',
            left: `${HERO.cx * 100}%`,
            top: `${HERO.cy * 100}%`,
            transform: 'translate(-50%, -50%)',
          }}
        />
        <span
          className="absolute rounded-full bg-tint-blue"
          style={{
            width: `${(HERO.size + 0.06) * 100}%`,
            aspectRatio: '1',
            left: `${HERO.cx * 100}%`,
            top: `${HERO.cy * 100}%`,
            transform: 'translate(-50%, -50%)',
          }}
        />
      </div>

      {/* Layer 1b — orbital frame + wavy trail (retires on scroll) ---------- */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{ y: retireY, opacity: retireOpacity }}
      >
        {/* semi-cropped orbital circle */}
        <span
          className="absolute rounded-full border border-primary/20"
          style={{
            width: `${ORBIT.size * 100}%`,
            aspectRatio: '1',
            left: `${ORBIT.cx * 100}%`,
            top: `${ORBIT.cy * 100}%`,
            transform: 'translate(-50%, -50%)',
          }}
        />
        {/* vertical wavy motion trail */}
        <svg
          className="absolute inset-0 h-full w-full overflow-visible"
          viewBox={`0 0 ${size.w || 1} ${size.h || 1}`}
          preserveAspectRatio="none"
        >
          <path
            d={d}
            fill="none"
            stroke="#0063f9"
            strokeWidth={2}
            strokeLinecap="round"
            strokeDasharray="1 9"
            opacity={0.45}
          />
        </svg>
      </motion.div>

      {/* Layer 3 — accent particles (foreground) --------------------------- */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-20"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {PARTICLES.map((p) => (
          <Particle key={p.id} p={p} burst={active} />
        ))}
      </div>

      {/* Layer 2 — spinning hero disc -------------------------------------- */}
      <div
        className="absolute z-10 rounded-full"
        style={{
          width: `${HERO.size * 100}%`,
          aspectRatio: '1',
          left: `${HERO.cx * 100}%`,
          top: `${HERO.cy * 100}%`,
          transform: 'translate(-50%, -50%)',
          boxShadow: '0 0 0 8px #ffffff, 0 0 0 9px rgba(0, 99, 249, 0.18)',
        }}
      >
        <AnimatePresence initial={false} mode="sync">
          <motion.div
            key={active}
            variants={discVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="absolute inset-0 overflow-hidden rounded-full"
            style={{ transformStyle: 'preserve-3d', willChange: 'transform, opacity' }}
          >
            {hero?.wide ? (
              <>
                <img
                  src={hero.src}
                  alt=""
                  aria-hidden="true"
                  className="absolute inset-0 h-full w-full scale-110 object-cover blur-md"
                />
                <img
                  src={hero.src}
                  alt={hero.alt || ''}
                  draggable="false"
                  className="relative h-full w-full object-contain"
                />
              </>
            ) : (
              <img
                src={hero?.src}
                alt={hero?.alt || ''}
                draggable="false"
                className="h-full w-full object-cover"
                style={{ objectPosition: hero?.position }}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Index indicator nodes (ride the wave) ----------------------------- */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-30"
        style={{ y: retireY, opacity: retireOpacity }}
      >
        {slides.map((slide, i) => {
          const pos = nodes[i];
          if (!pos) return null;
          const isActive = i === active;

          return (
            <button
              key={slide.src || i}
              type="button"
              onClick={() => onSelect(i)}
              aria-label={`Show ${slide.alt || `step ${i + 1}`}`}
              aria-pressed={isActive}
              className={`group absolute -translate-x-1/2 -translate-y-1/2 focus:outline-none ${
                retired ? 'pointer-events-none' : 'pointer-events-auto'
              }`}
              style={{
                left: `${pos.x + NODE_OFFSET.x}px`,
                top: `${pos.y + NODE_OFFSET.y}px`,
              }}
            >
              <span
                className={`block overflow-hidden rounded-full border-2 bg-white transition-all duration-300 ease-out group-focus-visible:ring-2 group-focus-visible:ring-primary/60 ${
                  isActive
                    ? 'scale-110 border-primary'
                    : 'border-white/80 group-hover:border-primary/70'
                }`}
                style={{
                  width: 'clamp(30px, 8vw, 44px)',
                  height: 'clamp(30px, 8vw, 44px)',
                }}
              >
                <img
                  src={slide.src}
                  alt=""
                  draggable="false"
                  className={slide.wide ? 'h-full w-full object-contain' : 'h-full w-full object-cover'}
                />
              </span>
            </button>
          );
        })}
      </motion.div>
    </motion.div>
  );
};

export default OrbitShowcase;
