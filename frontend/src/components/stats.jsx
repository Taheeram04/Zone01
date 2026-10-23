// components/stats.jsx
import { motion, useInView, useMotionValue, useTransform, animate } from 'framer-motion';
import { useRef, useEffect } from 'react';
import { Container } from './layout.jsx';
import { KineticHeading } from './whocanapply.jsx';
import { useSnapCarousel } from '../hooks/useSnapCarousel.js';

// Headline figure kept in the white card.
const primaryStat = { value: '$7,250', label: 'Average Annual Income' };

// Two stacked stat columns shown next to the card.
const statColumns = [
  [
    { value: '$2,553', label: 'Highest Monthly Earning' },
    { value: '257', label: 'Apprentices' },
  ],
  [
    { value: '90%', label: 'Employment Rate' },
    { value: '1,576', label: 'Apprentices trained in Golang' },
  ],
];

// Featured figure, vertically centred in the right column.
const featuredStat = { value: '30,057', label: 'Applications' };

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 35, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const statItemVariants = {
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

/**
 * Automated count-up ticker animation using Framer Motion's
 * useMotionValue, useTransform, and animate hook on visibility.
 * Animates GPU/RAF-driven numbers smoothly without React re-render overhead.
 */
const CountUp = ({
  value,
  duration = 2,
  delay = 0,
  inView = false,
  className = '',
}) => {
  const match = value.match(/^([^\d]*)([\d,]+)([^\d]*)$/);
  const prefix = match ? match[1] : '';
  const target = match ? parseInt(match[2].replace(/,/g, ''), 10) : 0;
  const suffix = match ? match[3] : '';
  const hasCommas = match ? match[2].includes(',') : false;

  const count = useMotionValue(0);
  const spanRef = useRef(null);

  const display = useTransform(count, (latest) => {
    const rounded = Math.round(latest);
    return `${prefix}${hasCommas ? rounded.toLocaleString() : rounded}${suffix}`;
  });

  useEffect(() => {
    if (!inView) return;

    const controls = animate(count, target, {
      duration,
      delay,
      ease: [0.16, 1, 0.3, 1],
    });

    return () => controls.stop();
  }, [inView, target, duration, delay, count]);

  useEffect(() => {
    const unsubscribe = display.on('change', (latest) => {
      if (spanRef.current) {
        spanRef.current.textContent = latest;
      }
    });
    return () => unsubscribe();
  }, [display]);

  return (
    <motion.span ref={spanRef} className={className}>
      {prefix}0{suffix}
    </motion.span>
  );
};

const Stats = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });
  const mobileStats = [primaryStat, ...statColumns.flat(), featuredStat];
  const {
    trackRef: mobileTrackRef,
    index: mobileIndex,
    handleScroll: handleMobileScroll,
    goTo: goToMobileStat,
  } = useSnapCarousel(mobileStats.length);

  return (
    <section ref={sectionRef} data-nav-theme="dark" className="relative bg-primary overflow-hidden py-16 md:py-24">
      <Container className="relative z-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={containerVariants}
        >
          <KineticHeading
            as="h2"
            className="font-mono font-bold text-sm md:text-base text-white uppercase tracking-wide mb-8 md:mb-10"
            text="Our Impact"
            delay={0.05}
          />

          {/* Mobile: swipeable impact cards */}
          <div className="md:hidden">
            <div
              ref={mobileTrackRef}
              onScroll={handleMobileScroll}
              className="-mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {mobileStats.map((stat, statIndex) => (
                <div
                  key={stat.label}
                  className="w-[78%] flex-none snap-center rounded-2xl bg-white p-6 shadow-[0_24px_45px_-24px_rgba(0,0,0,0.45)]"
                >
                  <CountUp
                    value={stat.value}
                    duration={1.8}
                    delay={0.1 + statIndex * 0.05}
                    inView={isInView}
                    className="block font-sans font-extrabold text-primary text-[2.75rem] leading-none whitespace-nowrap"
                  />
                  <p className="mt-3 font-mono text-sm font-bold text-secondary">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-5 flex items-center justify-center gap-1">
              {mobileStats.map((stat, statIndex) => (
                <button
                  key={stat.label}
                  type="button"
                  onClick={() => goToMobileStat(statIndex)}
                  aria-label={`Show ${stat.label}`}
                  aria-current={statIndex === mobileIndex}
                  className="flex h-6 w-6 items-center justify-center"
                >
                  <span
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      statIndex === mobileIndex ? 'w-6 bg-white' : 'w-1.5 bg-white/40'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="hidden md:flex flex-col lg:flex-row lg:items-stretch gap-10 md:gap-12 lg:gap-8 xl:gap-12">
            {/* Headline card */}
            <motion.div
              variants={cardVariants}
              whileHover={{
                y: -6,
                scale: 1.015,
                boxShadow: '0 20px 35px -10px rgba(0, 58, 147, 0.3)',
              }}
              transition={{ type: 'spring', stiffness: 350, damping: 25 }}
              className="relative bg-white flex-shrink-0 w-full max-w-sm lg:max-w-[260px] xl:max-w-xs p-6 sm:p-8 cursor-default self-stretch flex flex-col justify-center"
              style={{
                clipPath: 'polygon(0 0, 82% 0, 100% 18%, 100% 100%, 0 100%)',
              }}
            >
              <CountUp
                value={primaryStat.value}
                duration={2}
                delay={0.1}
                inView={isInView}
                className="block font-sans font-extrabold text-primary text-5xl sm:text-6xl xl:text-7xl mb-2 leading-none whitespace-nowrap"
              />
              <p className="font-mono font-bold text-sm text-black-900 max-w-[190px]">
                {primaryStat.label}
              </p>
            </motion.div>

            {/* Centre metrics */}
            <div className="flex flex-1 flex-col sm:flex-row sm:items-center sm:justify-evenly gap-y-10 gap-x-6 lg:gap-x-8">
              {statColumns.map((column, columnIndex) => (
                <div key={columnIndex} className="flex flex-col gap-10">
                  {column.map((stat, index) => (
                    <motion.div
                      key={stat.label}
                      variants={statItemVariants}
                      whileHover={{ y: -3, scale: 1.02 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                      className="text-left"
                    >
                      <CountUp
                        value={stat.value}
                        duration={1.8}
                        delay={0.25 + (columnIndex * 2 + index) * 0.1}
                        inView={isInView}
                        className="block font-sans font-extrabold text-white text-4xl sm:text-5xl mb-1 leading-none whitespace-nowrap"
                      />
                      <p className="font-mono font-bold text-body-s text-white whitespace-nowrap">
                        {stat.label}
                      </p>
                    </motion.div>
                  ))}
                </div>
              ))}
            </div>

            {/* Featured metric card — far right, matching the first metric shape */}
            <motion.div
              variants={cardVariants}
              whileHover={{
                y: -6,
                scale: 1.015,
                boxShadow: '0 20px 35px -10px rgba(0, 58, 147, 0.3)',
              }}
              transition={{ type: 'spring', stiffness: 350, damping: 25 }}
              className="relative bg-white flex-shrink-0 w-full max-w-sm lg:max-w-[260px] xl:max-w-xs p-6 sm:p-8 cursor-default self-stretch flex flex-col justify-center"
              style={{
                clipPath: 'polygon(0 0, 82% 0, 100% 18%, 100% 100%, 0 100%)',
              }}
            >
              <CountUp
                value={featuredStat.value}
                duration={2}
                delay={0.35}
                inView={isInView}
                className="block font-sans font-extrabold text-primary text-5xl sm:text-6xl xl:text-7xl mb-2 leading-none whitespace-nowrap"
              />
              <p className="font-mono font-bold text-sm text-black-900 max-w-[190px]">
                {featuredStat.label}
              </p>
            </motion.div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
};

export default Stats;
