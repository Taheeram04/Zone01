// components/know-us.jsx
import { motion } from 'framer-motion';
import { Container } from './layout.jsx';
import { EASE } from './orbit-showcase.config.js';

/*
 * "Know Us" — a static About section.
 *
 * The copy is shown directly (no typewriter intro, no blur transition, no
 * looping). The "Our Model Works" carousel is embedded just below this section.
 */

const ABOUT_PARAGRAPHS = [
  'Zone01 Kisumu, LakeHub Foundation\u2019s flagship project, is a disruptive digital training, that is entirely free and open to all without any grade requirement. Zone01 Kisumu admits candidates between 18-35 years, trains and supports them through monthly stipends for 12-months, then helps place them in tech jobs.',
  'Founded in 2023 through a pioneering partnership between LakeHub Foundation, the County Government of Kisumu, 01 Talent, and the United Cities and Local Governments of Africa (UCLGA), Zone01 Kisumu has been built on the conviction that technology and youth are the twin engines of economic transformation.',
];

const KnowUs = () => (
  <section
    data-nav-theme="light"
    aria-labelledby="know-us-title"
    className="relative w-full overflow-hidden bg-white pb-8 pt-8 sm:pb-10 sm:pt-10 md:pb-12 md:pt-12 lg:pb-14 lg:pt-14"
  >
    <Container className="relative">
      {/* Main title. */}
      <motion.h2
        id="know-us-title"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.7, ease: EASE }}
        className="text-center font-sans font-black leading-[1.02] tracking-tight text-black-900 text-[clamp(2.25rem,5.5vw,4rem)]"
      >
        Know <span className="text-primary">Us</span>
      </motion.h2>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
        className="mx-auto mt-10 max-w-5xl space-y-6 md:mt-14"
      >
        {ABOUT_PARAGRAPHS.map((paragraph, i) => (
          <p
            key={i}
            className="text-center font-mono text-[clamp(0.82rem,1.5vw,1.02rem)] leading-relaxed text-black-900/80"
          >
            {paragraph}
          </p>
        ))}
      </motion.div>
    </Container>
  </section>
);

export default KnowUs;
