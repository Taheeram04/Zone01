// components/careers.jsx
import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { APPLICATION_URL } from '../constants.js';
import artificialIntelligence from '../assets/careers/artificial-intelligence.webp';
import cloudDevOps from '../assets/careers/cloud-devops.webp';
import javaFullstack from '../assets/careers/java-fullstack.webp';
import videoGames from '../assets/careers/video-games-development.webp';
import webApp from '../assets/careers/web-app-development.webp';
import mobileApp from '../assets/careers/mobile-app-development.webp';
import dataEngineering from '../assets/careers/data-engineering.webp';
import cyberSecurity from '../assets/careers/cyber-security.webp';
import blockchain from '../assets/careers/blockchain.webp';
import './careers.css';

/*
 * "Career Paths" — a 3D carousel of flat career-path profile cards.
 *
 * The stage is viewed from a shallow isometric angle. The incoming card
 * swings in on the vertical Y axis from the side of the stage while the
 * outgoing card spins away and slides off-screen, both pushed into depth so
 * the swap reads as one continuous camera move. Each card carries its own
 * solid backdrop colour, so the next profile is revealed as the cards trade
 * places with momentum-based spring easing.
 */

const BRANCHES = [
  { name: 'Artificial Intelligence', image: artificialIntelligence },
  { name: 'Cloud & DevOps', image: cloudDevOps },
  { name: 'Java FullStack', image: javaFullstack },
  { name: 'Video Games Development', image: videoGames },
  { name: 'Web App Development', image: webApp },
  { name: 'Mobile App Development', image: mobileApp },
  { name: 'Data Engineering', image: dataEngineering },
  { name: 'Cyber Security', image: cyberSecurity },
  { name: 'Blockchain', image: blockchain },
];

const AUTO_MS = 4600;

const cardVariants = {
  enter: (direction) => ({
    x: direction > 0 ? '120%' : '-120%',
    y: direction > 0 ? 18 : -18,
    z: -150,
    rotateY: direction > 0 ? 82 : -82,
    rotateX: 10,
    rotateZ: direction > 0 ? 5.5 : -5.5,
    scale: 0.82,
    opacity: 0,
    filter: 'blur(10px)',
  }),
  center: {
    x: 0,
    y: 0,
    z: 0,
    rotateY: 0,
    rotateX: 4.5,
    rotateZ: 0,
    scale: 1,
    opacity: 1,
    filter: 'blur(0px)',
  },
  exit: (direction) => ({
    x: direction > 0 ? '-120%' : '120%',
    y: direction > 0 ? -14 : 14,
    z: -110,
    rotateY: direction > 0 ? -82 : 82,
    rotateX: 10,
    rotateZ: direction > 0 ? -5.5 : 5.5,
    scale: 0.84,
    opacity: 0,
    filter: 'blur(10px)',
  }),
};

const reducedCardVariants = {
  enter: { opacity: 0, x: 0, z: 0, rotateY: 0, rotateX: 0, rotateZ: 0, scale: 1 },
  center: { opacity: 1, x: 0, z: 0, rotateY: 0, rotateX: 0, rotateZ: 0, scale: 1 },
  exit: { opacity: 0, x: 0, z: 0, rotateY: 0, rotateX: 0, rotateZ: 0, scale: 1 },
};

const cardTransition = {
  x: { type: 'spring', stiffness: 380, damping: 32, mass: 0.78 },
  y: { type: 'spring', stiffness: 340, damping: 30, mass: 0.78 },
  z: { type: 'spring', stiffness: 320, damping: 30, mass: 0.78 },
  rotateY: { type: 'spring', stiffness: 310, damping: 27, mass: 0.78 },
  rotateX: { type: 'spring', stiffness: 300, damping: 28, mass: 0.78 },
  rotateZ: { type: 'spring', stiffness: 320, damping: 27, mass: 0.78 },
  scale: { type: 'spring', stiffness: 380, damping: 27, mass: 0.78 },
  filter: { duration: 0.26, ease: 'easeOut' },
  opacity: { duration: 0.2, ease: 'easeOut' },
};

const posterTransition = {
  type: 'spring',
  stiffness: 240,
  damping: 27,
  mass: 0.9,
};

const Careers = () => {
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState(1);
  const [paused, setPaused] = useState(false);
  const reduced = useReducedMotion();
  const branch = BRANCHES[active];

  useEffect(() => {
    if (reduced || paused) return undefined;
    const timer = setTimeout(() => {
      setDirection(1);
      setActive((current) => (current + 1) % BRANCHES.length);
    }, AUTO_MS);
    return () => clearTimeout(timer);
  }, [active, reduced, paused]);

  const goTo = (target) => {
    if (target === active) return;
    setDirection(target > active ? 1 : -1);
    setActive(target);
  };

  // Arrow buttons wrap around, so "previous" from the first path lands on the last.
  const step = (delta) => {
    setDirection(delta);
    setActive((current) => (current + delta + BRANCHES.length) % BRANCHES.length);
  };

  return (
    <section id="careers" data-nav-theme="light" aria-labelledby="careers-title" className="careers">
      <div aria-hidden="true" className="careers__backdrop">
        <span className="careers__blob careers__blob--tr" />
        <span className="careers__blob careers__blob--lm" />
        <span className="careers__blob careers__blob--rm" />
        <span className="careers__blob careers__blob--bl" />
        <span className="careers__blob careers__blob--br" />
      </div>

      <div className="careers__content">
        <div className="careers__head">
          <h2 id="careers-title" className="careers__title">
            Career Paths
          </h2>
          <p className="careers__subtitle">
            What is your true passion? Pursue a career path of your choice and become an
            expert through real world experience.
          </p>
        </div>

        <div
          className="careers__carousel"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocusCapture={() => setPaused(true)}
          onBlurCapture={() => setPaused(false)}
        >
          <button
            type="button"
            className="careers__nav careers__nav--prev"
            aria-label="Previous career path"
            aria-controls="careers-stage"
            onClick={() => step(-1)}
          >
            <ChevronLeft aria-hidden="true" size={22} strokeWidth={2.5} />
          </button>

          <div className="careers__stage" id="careers-stage">
            <AnimatePresence initial={false} custom={direction} mode="sync">
              <motion.a
                key={branch.name}
                custom={direction}
                variants={reduced ? reducedCardVariants : cardVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={reduced ? { duration: 0 } : cardTransition}
                href={APPLICATION_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="careers__card"
                aria-label={`Start ${branch.name} at Zone01 Kisumu (opens in a new tab)`}
                style={{ transformStyle: 'preserve-3d' }}
              >
                <motion.img
                  key={branch.image}
                  src={branch.image}
                  alt={branch.name}
                  className="careers__image"
                  loading="eager"
                  decoding="async"
                  initial={reduced ? false : { scale: 1.14 }}
                  animate={{ scale: 1 }}
                  transition={reduced ? { duration: 0 } : posterTransition}
                />
                <span aria-hidden="true" className="careers__ring" />
                <span aria-hidden="true" className="careers__sheen" />
              </motion.a>
            </AnimatePresence>
          </div>

          <button
            type="button"
            className="careers__nav careers__nav--next"
            aria-label="Next career path"
            aria-controls="careers-stage"
            onClick={() => step(1)}
          >
            <ChevronRight aria-hidden="true" size={22} strokeWidth={2.5} />
          </button>
        </div>

        <div className="careers__dots" role="tablist" aria-label="Tech branches">
          {BRANCHES.map((b, i) => (
            <button
              key={b.name}
              type="button"
              role="tab"
              aria-selected={i === active}
              aria-label={b.name}
              className={`careers__dot${i === active ? ' is-active' : ''}`}
              onClick={() => goTo(i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Careers;
