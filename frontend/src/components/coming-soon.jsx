// components/coming-soon.jsx
import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import Button from './button.jsx';
import { Container } from './layout.jsx';
import mascotUpper from '../assets/mascot-upper.png';
import mascotLegLeft from '../assets/mascot-leg-left.png';
import mascotLegRight from '../assets/mascot-leg-right.png';

const PAGE_TITLES = {
  '/about': 'About Us',
  '/community': 'Community',
  '/impact': 'Our Impact',
  '/hire': 'Hire Talent',
  '/donate': 'Donate',
};

const getTitle = (pathname) => {
  if (PAGE_TITLES[pathname]) return PAGE_TITLES[pathname];
  const fallback = pathname.replace(/^\//, '').replace(/[-/]/g, ' ').trim();
  return fallback ? fallback.replace(/\b\w/g, (c) => c.toUpperCase()) : 'This page';
};

/*
 * Loop timeline (total 5.5s):
 *   enter (1.0s) -> show / says "Coming Soon!" (3.0s) -> run away with the words (1.5s)
 */
const PHASE_MS = { enter: 1000, show: 3000, run: 1500 };

const kidVariants = {
  enter: { x: -420, transition: { duration: 0.95, ease: [0.22, 1, 0.36, 1] } },
  show: { x: 0, transition: { duration: 0.6, ease: [0.34, 1.4, 0.64, 1] } },
  run: { x: 780, transition: { duration: 1.45, ease: 'easeIn' } },
};

const wordsVariants = {
  enter: { opacity: 0, x: -16, scale: 0.9, transition: { duration: 0.2 } },
  show: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: { duration: 0.35, delay: 0.25, ease: 'easeOut' },
  },
  run: {
    opacity: 0,
    x: 320,
    scale: 0.85,
    transition: { duration: 1.15, ease: 'easeIn' },
  },
};

/**
 * The mascot is split into separate body parts (upper body, left leg, right
 * leg). Each leg swings around its hip on a walk cycle so the kid takes real
 * alternating steps instead of sliding rigidly like a puppet.
 *
 * Leg pivot points are percentages of the sprite canvas (296 x 556).
 */
const LEFT_HIP = '34% 72%';
const RIGHT_HIP = '66% 72%';

const Mascot = ({ running, still }) => {
  const stride = running ? 0.46 : 1.5;
  const lift = running ? 11 : 5;
  const swing = running ? 7 : 3;
  const times = [0, 0.25, 0.5, 0.75, 1];

  // left and right legs are half a cycle out of phase
  const legLeft = {
    y: [0, -lift, 0, 0, 0],
    rotate: [-swing, 0, swing, 0, -swing],
  };
  const legRight = {
    y: [0, 0, 0, -lift, 0],
    rotate: [swing, 0, -swing, 0, swing],
  };
  const legTransition = { duration: stride, repeat: Infinity, ease: 'easeInOut', times };

  const body = {
    y: [0, -3, 0, -3, 0],
    rotate: [0, 1, 0, -1, 0],
  };
  const bodyTransition = { duration: stride, repeat: Infinity, ease: 'easeInOut', times };

  return (
    <div className="relative inline-block leading-none">
      {/* Speed lines trailing behind while running */}
      <motion.span
        aria-hidden="true"
        className="absolute right-full top-1/2 mr-1 hidden h-[3px] w-10 -translate-y-1/2 rounded-full bg-primary/30 sm:block"
        animate={still ? { opacity: 0 } : running ? { opacity: [0, 0.9, 0], scaleX: [0.6, 1.15, 0.6] } : { opacity: 0 }}
        transition={{ duration: 0.46, repeat: Infinity, ease: 'easeOut' }}
      />

      {/* Ground shadow, squashing on each footfall */}
      <motion.span
        aria-hidden="true"
        className="absolute bottom-[-8px] left-1/2 h-3 w-[72%] rounded-full bg-black/30 blur-[3px]"
        animate={
          still
            ? { x: '-50%', scaleX: 1, opacity: 0.25 }
            : { x: '-50%', scaleX: [1, 0.78, 1, 0.78, 1], opacity: [0.3, 0.16, 0.3, 0.16, 0.3] }
        }
        transition={still ? { duration: 0 } : { duration: stride, repeat: Infinity, ease: 'easeInOut', times }}
      />

      {/* Legs sit behind the upper body */}
      <motion.img
        src={mascotLegLeft}
        alt=""
        aria-hidden="true"
        draggable="false"
        className="absolute inset-0 h-full w-full select-none"
        style={{ transformOrigin: LEFT_HIP }}
        animate={still ? { y: 0, rotate: 0 } : legLeft}
        transition={still ? { duration: 0 } : legTransition}
      />
      <motion.img
        src={mascotLegRight}
        alt=""
        aria-hidden="true"
        draggable="false"
        className="absolute inset-0 h-full w-full select-none"
        style={{ transformOrigin: RIGHT_HIP }}
        animate={still ? { y: 0, rotate: 0 } : legRight}
        transition={still ? { duration: 0 } : legTransition}
      />

      {/* Upper body on top, defining the box size */}
      <motion.img
        src={mascotUpper}
        alt="Cartoon mascot saying the page is coming soon"
        draggable="false"
        className="relative block h-40 w-auto select-none drop-shadow-[0_12px_16px_rgba(9,44,62,0.2)] sm:h-60 md:h-72"
        animate={still ? { y: 0, rotate: 0 } : body}
        transition={still ? { duration: 0 } : bodyTransition}
      />
    </div>
  );
};

const ComingSoon = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const prefersReducedMotion = useReducedMotion();
  const [phase, setPhase] = useState(prefersReducedMotion ? 'show' : 'enter');

  useEffect(() => {
    if (prefersReducedMotion) return undefined;

    const next = phase === 'enter' ? 'show' : phase === 'show' ? 'run' : 'enter';
    const timer = setTimeout(() => setPhase(next), PHASE_MS[phase]);
    return () => clearTimeout(timer);
  }, [phase, prefersReducedMotion]);

  const title = getTitle(pathname);
  const running = phase !== 'show';

  return (
    <section data-nav-theme="light" className="relative w-full min-h-[100svh] bg-tint-blue overflow-hidden flex flex-col">
      {/* Soft decorative blobs */}
      <div className="pointer-events-none absolute -top-24 -left-24 h-64 w-64 rounded-full bg-blob-blue/60 sm:h-80 sm:w-80" aria-hidden="true" />
      <div className="pointer-events-none absolute -bottom-28 -right-16 h-64 w-64 rounded-full bg-blob-blue/50 sm:h-80 sm:w-80" aria-hidden="true" />

      <div className="relative z-10 flex flex-1 flex-col justify-center pt-28 pb-20">
        <Container className="text-center">
          <p className="font-mono text-body-s uppercase tracking-[0.25em] text-primary mb-2">
            {title}
          </p>
        </Container>

        {/* Animation stage — full-bleed so the mascot has room to run */}
        <div className="relative flex h-56 w-full items-center justify-center overflow-hidden sm:h-80">
          <div className="flex items-center justify-center gap-2 sm:gap-8">
            <motion.div variants={kidVariants} initial="enter" animate={phase} className="shrink-0">
              <Mascot running={running} still={prefersReducedMotion} />
            </motion.div>

            <motion.div
              variants={wordsVariants}
              initial="enter"
              animate={phase}
              className="relative shrink-0"
            >
              <div className="relative rounded-3xl rounded-bl-none border-2 border-primary/15 bg-white px-4 py-3 shadow-xl sm:px-8 sm:py-6">
                <span className="block font-sans text-lg font-black tracking-tight text-primary sm:text-4xl">
                  Coming Soon!
                </span>
                <span className="mt-1 hidden font-mono text-body-s text-black-900/60 sm:block">
                  we are still cooking this page
                </span>
                {/* Speech tail */}
                <span className="absolute -bottom-3 left-6 h-5 w-5 rotate-45 border-b-2 border-l-2 border-primary/15 bg-white" />
              </div>
            </motion.div>
          </div>
        </div>

        <Container className="text-center">
          <p className="mx-auto mt-4 max-w-md font-mono text-sm md:text-body-m text-black-900/70 leading-relaxed">
            Our mascot is keeping this spot warm. The <span className="font-semibold text-black-900">{title}</span> page
            is on its way — check back soon.
          </p>

          <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-center">
            <Button variant="primary" className="w-full sm:w-auto" onClick={() => navigate('/')}>
              Back to home
            </Button>
            <Button variant="outline" className="w-full sm:w-auto" onClick={() => navigate('/community')}>
              Explore the community
            </Button>
          </div>
        </Container>
      </div>
    </section>
  );
};

export default ComingSoon;
