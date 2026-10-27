// components/hire-difference.jsx
import { motion } from 'framer-motion';
import { BadgeCheck, Brain, Users } from 'lucide-react';
import { Container } from './layout.jsx';
import { DIFFERENTIATORS } from './hire.data.js';
import peerReview from '../assets/whyhire-01.webp';
import selfLearning from '../assets/whyhire-02.webp';
import collaboration from '../assets/whyhire-03.webp';

const ICONS = [BadgeCheck, Brain, Users];
const PHOTOS = [peerReview, selfLearning, collaboration];

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  },
};

/**
 * Proof section: why the 01 model produces a different kind of junior
 * engineer. Header follows the Career Paths type scale, on the same
 * powder-blue canvas.
 */
const HireDifference = () => (
  <section id="why" data-nav-theme="light" className="bg-powder-blue pb-10 pt-10 md:pb-14 md:pt-14">
    <Container>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={container}
        className="mx-auto max-w-5xl text-center"
      >
        <motion.h2
          variants={item}
          className="font-sans text-[1.875rem] font-black leading-[1.1] tracking-[-0.02em] text-secondary sm:text-section-headline"
        >
          Why Zone01 engineers are different
        </motion.h2>

        <motion.p
          variants={item}
          className="mx-auto mt-4 max-w-2xl font-sans text-body-l font-medium leading-[1.6] text-secondary/70"
        >
          Selected on potential. Proven on performance.
        </motion.p>

        <motion.p
          variants={item}
          className="mx-auto mt-5 max-w-2xl font-sans text-body-m leading-relaxed text-black-900/65"
        >
          No lectures, no certificates to hide behind. Engineers earn their
          progress by shipping work that survives peer review, then defend it.
        </motion.p>
      </motion.div>

      <motion.ul
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        variants={container}
        className="mt-12 grid items-start gap-4 md:mt-16 md:grid-cols-3"
      >
        {DIFFERENTIATORS.map((pillar, index) => {
          const Icon = ICONS[index % ICONS.length];

          return (
            <motion.li
              key={pillar.title}
              variants={item}
              className={`group relative flex flex-col overflow-hidden bg-white p-7 pb-8 transition-transform duration-300 hover:-translate-y-1.5 sm:p-8 ${
                index === 1 ? 'md:mt-10' : ''
              }`}
            >
              <img
                src={PHOTOS[index % PHOTOS.length]}
                alt=""
                aria-hidden="true"
                loading="lazy"
                className="pointer-events-none absolute inset-0 h-full w-full scale-105 object-cover opacity-0 transition duration-500 ease-out group-hover:scale-100 group-hover:opacity-100 max-md:scale-100 max-md:opacity-100"
              />
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-secondary/90 via-secondary/70 to-secondary/45 opacity-0 transition-opacity duration-500 group-hover:opacity-100 max-md:opacity-100"
              />

              <span
                aria-hidden="true"
                className="absolute inset-y-0 left-0 z-10 w-1 origin-top scale-y-0 bg-primary transition-transform duration-300 group-hover:scale-y-100"
              />

              <div className="relative z-10 flex items-center gap-3 text-primary transition-colors duration-300 group-hover:text-white max-md:text-white">
                <span className="font-mono text-xl font-semibold leading-none">
                  {pillar.index}
                </span>
                <span
                  className="h-px flex-1 bg-secondary/10 transition-colors duration-300 group-hover:bg-white/30 max-md:bg-white/30"
                  aria-hidden="true"
                />
                <Icon
                  className="h-5 w-5 flex-none text-primary/50 transition-colors duration-300 group-hover:text-white/80 max-md:text-white/80"
                  aria-hidden="true"
                />
              </div>

              <h3 className="relative z-10 mt-6 font-sans text-lg font-bold leading-snug text-secondary transition-colors duration-300 group-hover:text-white max-md:text-white">
                {pillar.title}
              </h3>
              <p className="relative z-10 mt-3 font-sans text-body-m leading-relaxed text-black-900/65 transition-colors duration-300 group-hover:text-white/85 max-md:text-white/85">
                {pillar.body}
              </p>
            </motion.li>
          );
        })}
      </motion.ul>

    </Container>
  </section>
);

export default HireDifference;
