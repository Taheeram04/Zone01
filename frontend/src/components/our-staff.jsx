// components/our-staff.jsx
import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa6';
import { Container } from './layout.jsx';
import { KineticHeading } from './whocanapply.jsx';
import staff01 from '../assets/01 Dorcas.webp';
import staff02 from '../assets/02 Caleb.webp';
import staff03 from '../assets/03 Torsten.webp';
import staff04 from '../assets/04 Paul.webp';
import staff05 from '../assets/05 ALPHA.webp';
import staff06 from '../assets/06 Bellah.webp';
import staff07 from '../assets/07 Rodgers.webp';
import staff08 from '../assets/08 Deril.webp';
import staff09 from '../assets/09 Daisy.webp';
import staff10 from '../assets/010 Lydiah.webp';

/*
 * "Our Staff" — a 3D glowing card carousel.
 *
 * Cards ride a shared 3D ring: the focal card sits flat and centre stage while
 * its neighbours angle away, shrink and recede on the Z-axis. The focal card
 * pulses a soft brand-blue glow, echoing the reference "3D Glowing Card
 * Carousel" effect. Autoplay advances one card every AUTOPLAY_MS and pauses
 * while hovered or off-screen.
 */

const STAFF = [
  { name: 'Dorcas', src: staff01 },
  { name: 'Caleb', src: staff02 },
  { name: 'Torsten', src: staff03 },
  { name: 'Paul', src: staff04 },
  { name: 'Alpha', src: staff05 },
  { name: 'Bellah', src: staff06 },
  { name: 'Rodgers', src: staff07 },
  { name: 'Deril', src: staff08 },
  { name: 'Daisy', src: staff09 },
  { name: 'Lydiah', src: staff10 },
];

/** How long each focal card holds before the next one slides in (ms). */
const AUTOPLAY_MS = 4500;

/** How many cards to render on each side of the focal card. */
const VISIBLE_RANGE = 3;

/** Horizontal spacing between cards, as a percentage of a card's width. */
const GAP = 62;

/** How far side cards spin away from the viewer (deg). */
const SPIN_DEG = 34;

/** Static / pulsing glow shadows. Kept at two layers so they interpolate. */
const GLOW_IDLE = '0 0 14px rgba(0, 99, 249, 0.16), 0 0 34px rgba(0, 99, 249, 0.06)';
const GLOW_LOW = '0 0 26px rgba(0, 99, 249, 0.55), 0 0 70px rgba(153, 194, 255, 0.35)';
const GLOW_HIGH = '0 0 48px rgba(0, 99, 249, 0.95), 0 0 110px rgba(153, 194, 255, 0.6)';

const OurStaff = () => {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { amount: 0.35 });
  const reduced = useReducedMotion();

  const count = STAFF.length;

  // Autoplay: one step at a time, only while visible, hovered-off and motion is OK.
  useEffect(() => {
    if (reduced || !inView || paused) return undefined;
    const timer = window.setTimeout(
      () => setActive((current) => (current + 1) % count),
      AUTOPLAY_MS,
    );
    return () => window.clearTimeout(timer);
  }, [active, inView, paused, reduced, count]);

  const step = (dir) => setActive((current) => (current + dir + count) % count);

  return (
    <section
      ref={sectionRef}
      data-nav-theme="dark"
      aria-labelledby="our-staff-title"
      className="relative w-full overflow-hidden bg-secondary py-16 md:py-24"
    >
      {/* Ambient glow behind the stage */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[min(80vw,560px)] w-[min(80vw,560px)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/25 blur-[130px]"
      />

      <Container className="relative">
        <div className="mb-10 text-center md:mb-14">
          <p className="mb-2 font-mono text-body-s uppercase tracking-[0.25em] text-blob-blue">
            &lt; Our People &gt;
          </p>
          <KineticHeading
            as="h2"
            id="our-staff-title"
            text="Our Staff"
            className="font-sans font-black leading-tight tracking-tight text-white text-[30px] md:text-section-headline"
          />
        </div>

        {/* 3D stage — every card shares one grid cell and is transformed out */}
        <div
          className="relative grid h-[clamp(320px,80vw,470px)] place-items-center"
          style={{ perspective: 1400 }}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {STAFF.map((member, i) => {
            let offset = i - active;
            if (offset > count / 2) offset -= count;
            if (offset < -count / 2) offset += count;

            const abs = Math.abs(offset);
            const isActive = offset === 0;
            const hidden = abs > VISIBLE_RANGE;
            const pulse = isActive && !reduced;

            return (
              <motion.button
                key={member.name}
                type="button"
                onClick={() => setActive(i)}
                aria-label={`Show staff member ${member.name}`}
                aria-pressed={isActive}
                aria-hidden={hidden || undefined}
                tabIndex={isActive ? 0 : -1}
                className="group relative block cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-[#0b1a26] outline-none focus-visible:ring-2 focus-visible:ring-primary/70"
                style={{
                  gridArea: '1 / 1',
                  width: 'clamp(175px, 44vw, 290px)',
                  aspectRatio: '4 / 5',
                  zIndex: 100 - abs,
                  pointerEvents: hidden ? 'none' : 'auto',
                }}
                animate={{
                  x: `${offset * GAP}%`,
                  rotateY: -offset * SPIN_DEG,
                  scale: 1 - abs * 0.14,
                  z: -abs * 150,
                  opacity: hidden ? 0 : Math.max(0, 1 - abs * 0.14),
                  boxShadow: pulse ? [GLOW_LOW, GLOW_HIGH] : GLOW_IDLE,
                }}
                transition={{
                  x: { type: 'spring', stiffness: 240, damping: 28 },
                  rotateY: { type: 'spring', stiffness: 240, damping: 28 },
                  scale: { type: 'spring', stiffness: 240, damping: 28 },
                  z: { type: 'spring', stiffness: 240, damping: 28 },
                  opacity: { duration: 0.4, ease: 'easeOut' },
                  boxShadow: pulse
                    ? { duration: 2, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }
                    : { duration: 0.4, ease: 'easeOut' },
                }}
              >
                <img
                  src={member.src}
                  alt={member.name}
                  draggable="false"
                  loading="lazy"
                  className="h-full w-full object-cover object-top"
                />

                {/* Name plate */}
                <span className="pointer-events-none absolute inset-x-0 bottom-0 block bg-gradient-to-t from-black/90 via-black/55 to-transparent px-4 pb-4 pt-12 text-left">
                  <span className="block font-sans text-base font-black uppercase tracking-tight text-white">
                    {member.name}
                  </span>
                </span>
              </motion.button>
            );
          })}

          {/* Prev / next controls */}
          <button
            type="button"
            onClick={() => step(-1)}
            aria-label="Previous staff member"
            className="absolute left-0 top-1/2 z-[200] flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white backdrop-blur transition hover:bg-primary hover:text-white md:h-12 md:w-12"
          >
            <FaChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => step(1)}
            aria-label="Next staff member"
            className="absolute right-0 top-1/2 z-[200] flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white backdrop-blur transition hover:bg-primary hover:text-white md:h-12 md:w-12"
          >
            <FaChevronRight className="h-4 w-4" />
          </button>
        </div>

        {/* Index dots */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-2 md:mt-10">
          {STAFF.map((member, i) => (
            <button
              key={member.name}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Show ${member.name}`}
              aria-pressed={i === active}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === active
                  ? 'w-7 bg-primary shadow-[0_0_12px_rgba(0,99,249,0.8)]'
                  : 'w-2 bg-white/30 hover:bg-white/60'
              }`}
            />
          ))}
        </div>
      </Container>
    </section>
  );
};

export default OurStaff;
