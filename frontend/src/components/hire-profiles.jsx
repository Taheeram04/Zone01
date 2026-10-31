// components/hire-profiles.jsx
import { motion } from 'framer-motion';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { Container } from './layout.jsx';
import { hireContactUrl } from '../constants.js';
import { TALENT_PROFILES } from './hire.data.js';

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

const item = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
  },
};

/**
 * Anonymised snapshot of the current pipeline, presented as a typographic
 * roster rather than a card grid: role, note and a direct enquiry link on
 * one line.
 */
const HireProfiles = () => (
  <section id="profiles" data-nav-theme="light" className="bg-tint-blue pb-10 pt-4 md:pb-14 md:pt-6">
    <Container>
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="font-sans text-[1.875rem] font-black leading-tight tracking-tight text-secondary sm:text-section-headline">
          Specialization
        </h2>
        
        <a
          href="#request"
          className="group mt-6 inline-flex items-center gap-2 rounded-full border border-primary px-6 py-3 font-sans text-body-m font-semibold text-primary transition-colors hover:bg-primary hover:text-white"
        >
          Request full portfolios
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </a>
      </div>

      <motion.ul
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        variants={container}
        className="mt-10 border-t border-secondary/20"
      >
        {TALENT_PROFILES.map((profile) => {
          return (
            <motion.li
              key={profile.label}
              variants={item}
              className="group grid gap-x-8 gap-y-4 border-b border-secondary/20 py-6 transition-colors duration-300 hover:bg-white/60 lg:grid-cols-[1fr_auto] lg:items-start"
            >
              <div>
                <h3 className="font-sans text-lg font-bold leading-snug text-secondary">
                  {profile.role}
                </h3>

                <p className="mt-2 font-sans text-body-m leading-relaxed text-black-900/65">
                  {profile.body}
                </p>

                {/* Profile tag chips intentionally hidden. Data kept in hire.data.js.
                <ul className="mt-3 flex flex-wrap gap-2">
                  {profile.tags.map((tag) => (
                    <li
                      key={tag}
                      className="rounded-full border border-secondary/15 bg-white/70 px-2.5 py-0.5 font-mono text-[11px] text-secondary/70"
                    >
                      {tag}
                    </li>
                  ))}
                </ul>
                */}
              </div>

              <a
                href={hireContactUrl(profile.role)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 font-sans text-body-m font-semibold text-primary transition-colors hover:text-secondary lg:self-center"
              >
                Ask about this profile
                <ArrowUpRight
                  className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </a>
            </motion.li>
          );
        })}
      </motion.ul>

    </Container>
  </section>
);

export default HireProfiles;
