// components/stats.jsx
import { motion, useInView, useMotionValue, useTransform, animate } from 'framer-motion';
import { useRef, useEffect } from 'react';
import { Container } from './layout.jsx';
import { KineticHeading } from './whocanapply.jsx';

// Headline figure kept in the white card.
const primaryStat = { value: '$7,200', label: 'Average Annual Income' };

// Two stacked stat columns shown next to the card.
const statColumns = [
  [
    { value: '1,500', label: 'Trained in Go Language' },
    { value: '250', label: 'Apprentices' },
  ],
  [
    { value: '90%', label: 'Employment Rate' },
    { value: '$2,800', label: 'Highest Monthly Earning' },
  ],
];

// Featured figure, vertically centred in the right column.
const featuredStat = { value: '30,000', label: 'Applications' };

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

    // Restart from zero every time the section re-enters view, so the ticker
    // replays on each visit rather than only on the first scroll/refresh.
    count.set(0);
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
  const isInView = useInView(sectionRef, { amount: 0.2 });

  return (
    <section ref={sectionRef} className="relative bg-primary overflow-hidden py-16 md:py-24">


      <Container className="relative z-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={containerVariants}
        >
          <KineticHeading
            as="p"
            className="font-mono font-bold text-xl md:text-2xl text-white uppercase tracking-wide mb-8 md:mb-10"
            text="Our Impact"
            delay={0.05}
          />

          <div className="flex flex-col lg:flex-row lg:items-stretch gap-10 md:gap-12 lg:gap-10 xl:gap-16">
            {/* Headline metric card — far left */}
            <motion.div
              variants={cardVariants}
              whileHover={{
                y: -6,
                scale: 1.015,
                boxShadow: '0 20px 35px -10px rgba(0, 58, 147, 0.3)',
              }}
              transition={{ type: 'spring', stiffness: 350, damping: 25 }}
              className="relative bg-white flex-shrink-0 w-full max-w-sm lg:max-w-[240px] xl:max-w-xs p-6 sm:p-8 cursor-default self-stretch flex flex-col justify-center"
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

            {/* Centre metrics — clean white typography over the blue grid */}
            <div className="flex flex-1 flex-col items-center justify-center gap-10 text-center sm:flex-row sm:items-center sm:justify-evenly sm:text-left">
              {statColumns.map((column, columnIndex) => (
                <div key={columnIndex} className="flex flex-col gap-10">
                  {column.map((stat, index) => (
                    <motion.div
                      key={stat.label}
                      variants={statItemVariants}
                      whileHover={{ y: -3, scale: 1.02 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                    >
                      <CountUp
                        value={stat.value}
                        duration={1.8}
                        delay={0.25 + (columnIndex * 2 + index) * 0.1}
                        inView={isInView}
                        className="block font-sans font-extrabold text-white text-4xl sm:text-5xl mb-1 leading-none whitespace-nowrap"
                      />
                      <p className="font-mono font-bold text-base md:text-lg text-white leading-snug">
                        {stat.label}
                      </p>
                    </motion.div>
                  ))}
                </div>
              ))}
            </div>

            {/* Featured metric card — far right, matching the left for balance */}
            <motion.div
              variants={cardVariants}
              whileHover={{
                y: -6,
                scale: 1.015,
                boxShadow: '0 20px 35px -10px rgba(0, 58, 147, 0.3)',
              }}
              transition={{ type: 'spring', stiffness: 350, damping: 25 }}
              className="relative bg-white flex-shrink-0 w-full max-w-sm lg:max-w-[240px] xl:max-w-xs p-6 sm:p-8 cursor-default self-stretch flex flex-col justify-center"
              style={{
                // Mirrored so the clipped corner sits on the left, facing the centre.
                clipPath: 'polygon(100% 0, 18% 0, 0 18%, 0 100%, 100% 100%)',
              }}
            >
              <CountUp
                value={featuredStat.value}
                duration={2}
                delay={0.35}
                inView={isInView}
                className="block font-sans font-black text-primary text-5xl sm:text-6xl xl:text-7xl mb-2 leading-none tracking-tight whitespace-nowrap"
              />
              <p className="font-mono font-bold text-sm text-black-900 whitespace-nowrap">
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
