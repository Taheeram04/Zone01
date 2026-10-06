// components/stats.jsx
import { motion, useInView, useMotionValue, useTransform, animate } from 'framer-motion';
import { useRef, useEffect } from 'react';
import { Container } from './layout.jsx';
import { KineticHeading } from './whocanapply.jsx';

const stats = [
  { value: '$2,500', label: 'Top monthly earnings' },
  { value: '90%', label: 'Already earning a paycheck.' },
  { value: '86', label: 'Apprentices and graduates in paid work.' },
  { value: '97', label: 'Inaugural cohort Apprentices' },
];

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

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
  const isInView = useInView(sectionRef, { once: true, amount: 0.25 });

  return (
    <section ref={sectionRef} className="relative bg-primary overflow-hidden py-16 md:py-24">


      <Container className="relative z-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={containerVariants}
        >
          <KineticHeading
            as="p"
            className="font-mono text-body-s text-white/80 uppercase tracking-wide mb-10"
            text="Results from our first year"
            delay={0.05}
          />

          <div className="flex flex-col md:flex-row md:items-center gap-10 md:gap-16">
            <motion.div
              variants={cardVariants}
              whileHover={{
                y: -6,
                scale: 1.015,
                boxShadow: '0 20px 35px -10px rgba(0, 58, 147, 0.3)',
              }}
              transition={{ type: 'spring', stiffness: 350, damping: 25 }}
              className="relative bg-white flex-shrink-0 w-full max-w-sm p-8 cursor-default"
              style={{
                clipPath: 'polygon(0 0, 82% 0, 100% 18%, 100% 100%, 0 100%)',
              }}
            >
              <CountUp
                value="$7,200"
                duration={2}
                delay={0.1}
                inView={isInView}
                className="block font-sans font-extrabold text-primary text-5xl md:text-6xl mb-2"
              />
              <p className="font-mono text-body-s text-black-900/70">
                Average Annual Income
              </p>
            </motion.div>

            <div className="grid grid-cols-2 gap-x-10 gap-y-10">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  variants={statItemVariants}
                  whileHover={{ y: -3, scale: 1.02 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                >
                  <CountUp
                    value={stat.value}
                    duration={1.8}
                    delay={0.25 + index * 0.12}
                    inView={isInView}
                    className="block font-sans font-extrabold text-white text-5xl md:text-6xl mb-1"
                  />
                  <p className="font-mono text-body-s text-white/80 max-w-[180px]">
                    {stat.label}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          <motion.p
            variants={fadeUp}
            className="font-mono text-body-s text-white/70 text-center mt-14"
          >
            As of August 2026 . Period covered: Program inception 2024 .{' '}
            <a
              href="#"
              className="underline hover:text-accent transition-colors duration-200 inline-block hover:scale-105"
            >
              Explore our Impact
            </a>
          </motion.p>
        </motion.div>
      </Container>
    </section>
  );
};

export default Stats;