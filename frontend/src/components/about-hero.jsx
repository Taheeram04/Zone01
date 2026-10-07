// components/about-hero.jsx
import { motion } from 'framer-motion';
import { Container } from './layout.jsx';
import aboutUs from '../assets/about us.JPG';

/**
 * AboutHero
 * Full-bleed "About Us" hero built from the team photograph, with a deep blue
 * gradient wash (lighter top-left to deeper bottom-right) and the mission
 * statement centred on top in bold white type.
 */
const AboutHero = () => {
  return (
    <section
      data-nav-theme="dark"
      className="relative flex min-h-screen w-full items-center justify-center overflow-hidden"
      style={{ minHeight: '100svh' }}
    >
      {/* Background layer — the team photograph, sharp and full-bleed */}
      <img
        src={aboutUs}
        alt="The Zone01 Kisumu team gathered at the campus"
        className="absolute inset-0 h-full w-full object-cover object-center"
      />

      {/* Overlay: deep blue wash, lighter top-left into a deeper bottom-right */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(135deg, rgba(0,99,249,0.42) 0%, rgba(9,44,62,0.62) 48%, rgba(4,26,54,0.86) 100%)',
        }}
      />

      {/* Text layer — centred */}
      <Container className="relative z-10 py-28 sm:py-32">
        <div className="mx-auto max-w-6xl text-center">
          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="font-sans font-black text-white tracking-tight leading-[1.06] text-[clamp(1.25rem,6.2vw,4.5rem)]"
          >
            <span className="whitespace-nowrap">Tackling youth unemployment</span>
            <br />
            at scale.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="mx-auto mt-8 max-w-3xl font-sans text-base leading-relaxed text-white/90 sm:text-lg md:text-xl"
          >
            We identify the{' '}
            <strong className="font-black text-white">top 1%</strong> of talent
            and elevate them to be among the{' '}
            <strong className="font-black text-white">top 10%</strong> of income
            earners within one year.
          </motion.p>
        </div>
      </Container>
    </section>
  );
};

export default AboutHero;
