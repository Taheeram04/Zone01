// components/our-model-section.jsx
import { motion } from 'framer-motion';
import { Container } from './layout.jsx';
import OrbitShowcase from './orbit-showcase.jsx';
import { useSequence } from './use-sequence.js';
import { EASE } from './orbit-showcase.config.js';
import { STEPS } from './our-model.data.js';

/*
 * "Our Model Works" section — the five-stage list (left) kept in sync with the
 * OrbitShowcase platter (right), followed by the blue mission band.
 *
 * Embedded inline on the About page, directly below "Know Us".
 */
const OurModelSection = ({ heading = 'Our Model Works' }) => {
  const { active, goTo } = useSequence(STEPS.length);

  return (
    <section
      id="our-model"
      data-nav-theme="light"
      aria-label="Our Model Works steps"
      className="relative w-full overflow-hidden bg-white pb-16 pt-4 sm:pb-20 sm:pt-5 md:pb-24 md:pt-6 lg:pb-28 lg:pt-8"
    >
      <Container className="relative">
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease: EASE }}
          className="text-center font-sans font-black leading-[1.02] tracking-tight text-black-900 text-[clamp(2.25rem,5.5vw,4rem)]"
        >
          {heading}
        </motion.h2>

        <div className="mt-10 flex flex-col-reverse gap-12 md:mt-14 md:grid md:grid-cols-2 md:items-center md:gap-16">
          {/* Left / content side */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
          >
            <ol className="space-y-6">
              {STEPS.map((step, i) => {
                const isActive = i === active;
                return (
                  <li key={step.title}>
                    <button
                      type="button"
                      onClick={() => goTo(i)}
                      aria-pressed={isActive}
                      className={`block w-full text-left transition-opacity duration-500 ease-out ${
                        isActive ? 'opacity-100' : 'opacity-30 hover:opacity-60'
                      }`}
                    >
                      <span className="flex items-baseline gap-3">
                        <span className="font-mono text-sm font-bold tracking-[0.2em] text-primary">
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        <span className="font-sans text-xl font-black uppercase tracking-tight text-black-900 sm:text-2xl">
                          {step.title}
                        </span>
                      </span>
                      <span className="mt-2 block pl-8 font-mono text-base leading-relaxed text-black-900/80 sm:text-lg">
                        {step.text}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>
          </motion.div>

          {/* Right / animation side */}
          <OrbitShowcase slides={STEPS} active={active} onSelect={goTo} />
        </div>
      </Container>

      {/* Full-width blue mission band. */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.7, ease: EASE }}
        className="mt-14 bg-primary px-[clamp(1.25rem,5vw,8rem)] py-6 sm:py-8"
      >
        <p className="mx-auto max-w-4xl text-center font-mono font-medium leading-relaxed text-white text-[clamp(0.85rem,1.6vw,1.15rem)]">
          &ldquo;We filter for the highest potential &ndash; not credentials.&rdquo;
        </p>
      </motion.div>
    </section>
  );
};

export default OurModelSection;
