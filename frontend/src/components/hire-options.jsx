// components/hire-options.jsx
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Container } from './layout.jsx';
import { HIRING_OPTIONS, PROCESS_STEPS } from './hire.data.js';

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.05 },
  },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] },
  },
};

const stepsContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.22, delayChildren: 0.1 },
  },
};

const stepItem = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
  },
};

const stepNode = {
  hidden: { scale: 0, backgroundColor: '#EAF2FF', color: '#0063F9' },
  visible: {
    scale: 1,
    backgroundColor: '#0063F9',
    color: '#FFFFFF',
    transition: { type: 'spring', stiffness: 360, damping: 22 },
  },
};

const progressLine = {
  hidden: { scaleX: 0 },
  visible: {
    scaleX: 1,
    transition: { duration: 1.5, ease: [0.16, 1, 0.3, 1] },
  },
};

/**
 * Engagement models (shortlist, internship, partnership, delivery team) plus
 * the four-step hiring process, so employers can see both the "what" and the
 * "what happens next" in one place.
 */
// Set to true to show the "Four ways to work with Zone01 talent" block again.
// The content and interaction are kept intact but disabled for now.
const HIRING_OPTIONS_ENABLED = false;

const HireOptions = () => (
  <section id="options" data-nav-theme="light" className="bg-white pb-6 pt-10 md:pb-8 md:pt-14">
    <Container>
      {HIRING_OPTIONS_ENABLED && (
        <>
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="font-sans text-[1.875rem] font-black leading-tight tracking-tight text-secondary sm:text-section-headline">
              Four ways to work with Zone01 talent.
            </h2>
            <p className="mx-auto mt-4 max-w-2xl font-sans text-base leading-relaxed text-black-900/65">
              Start with a single hire or build a long-term pipeline. Every route
              begins with the same thing: a clear brief.
            </p>
          </div>

          <motion.ol
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            variants={container}
            className="mt-12 border-t border-secondary/15"
          >
            {HIRING_OPTIONS.map((option) => (
              <motion.li
                key={option.index}
                variants={item}
                className="group grid gap-x-8 gap-y-3 border-b border-secondary/15 py-8 transition-colors duration-300 hover:bg-campus-bg/70 md:grid-cols-[0.9fr_1.25fr] md:items-start md:py-10"
              >
                <h3 className="font-sans text-cta-headline font-black leading-tight tracking-tight text-secondary">
                  {option.title}
                </h3>

                <div>
                  <p className="font-sans text-body-m leading-relaxed text-black-900/65">
                    {option.body}
                  </p>
                  <a
                    href="#request"
                    className="group/link mt-5 inline-flex items-center gap-2 font-sans text-body-m font-semibold text-primary transition-colors hover:text-secondary"
                  >
                    {option.cta}
                    <ArrowRight
                      className="h-3.5 w-3.5 transition-transform group-hover/link:translate-x-1"
                      aria-hidden="true"
                    />
                  </a>
                </div>
              </motion.li>
            ))}
          </motion.ol>
        </>
      )}

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.2 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="mt-16 overflow-hidden rounded-3xl bg-tint-blue p-7 sm:p-10"
      >
        <div className="flex flex-col items-center gap-3 text-center">
          <h3 className="font-sans text-cta-headline font-black tracking-tight text-secondary">
            Engage with our talent.
          </h3>
        </div>

        <motion.ol
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.35 }}
          variants={stepsContainer}
          className="relative mt-8 grid gap-7 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6"
        >
          <span
            aria-hidden="true"
            className="absolute inset-x-0 top-0 hidden h-px bg-secondary/15 lg:block"
          />
          <motion.span
            aria-hidden="true"
            variants={progressLine}
            className="absolute inset-x-0 top-0 hidden h-px origin-left bg-primary lg:block"
          />
          <motion.span
            aria-hidden="true"
            initial={{ left: '0%', opacity: 0 }}
            whileInView={{ left: '100%', opacity: [0, 1, 1, 0] }}
            viewport={{ once: false, amount: 0.35 }}
            transition={{
              duration: 1.5,
              ease: [0.16, 1, 0.3, 1],
              times: [0, 0.1, 0.9, 1],
            }}
            className="absolute top-0 z-20 hidden h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary lg:block"
          />

          {PROCESS_STEPS.map((step) => (
            <motion.li
              key={step.index}
              variants={stepItem}
              className="relative z-10 border-t border-secondary/15 pt-5"
            >
              <motion.span
                variants={stepNode}
                className="absolute -top-3 left-0 flex h-6 w-6 items-center justify-center rounded-full font-mono text-[10px] font-bold"
              >
                {step.index}
              </motion.span>
              <motion.h4
                variants={stepItem}
                className="mt-2 font-sans text-base font-bold text-secondary"
              >
                {step.title}
              </motion.h4>
              <motion.p
                variants={stepItem}
                className="mt-1.5 font-sans text-body-m leading-relaxed text-black-900/60"
              >
                {step.body}
              </motion.p>
            </motion.li>
          ))}
        </motion.ol>
      </motion.div>
    </Container>
  </section>
);

export default HireOptions;
