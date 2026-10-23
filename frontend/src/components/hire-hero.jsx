// components/hire-hero.jsx
import { motion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import Button from './button.jsx';
import { Container } from './layout.jsx';
import { hireContactUrl } from '../constants.js';
import serviceHero from '../assets/service-hero.webp';

/**
 * Full-bleed employer hero for /hire, using the Zone01 service photograph with
 * the same deep-blue wash as the About hero.
 */
const HireHero = () => (
  <section
    data-nav-theme="dark"
    className="relative flex min-h-[85svh] w-full items-center overflow-hidden"
  >
    <img
      src={serviceHero}
      alt="Zone01 developers collaborating at the Kisumu campus"
      className="absolute inset-0 h-full w-full object-cover object-center"
    />

      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(120deg, rgba(0,99,249,0.55) 0%, rgba(8,50,110,0.86) 55%, rgba(3,20,48,0.95) 100%)',
        }}
      />

    <Container className="relative z-10 pb-24 pt-32">
      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="font-mono text-body-s uppercase tracking-[0.28em] text-accent"
      >
        Hire Talent
      </motion.p>

      <motion.h1
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="mt-5 max-w-5xl font-sans text-[clamp(2rem,6vw,4.5rem)] font-black leading-[1.05] tracking-tight text-white"
      >
        Access <span className="text-accent">AI-ready talent,</span> tailored for
        your business.
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.15 }}
        className="mt-6 max-w-2xl font-sans text-base leading-relaxed text-white/90 sm:text-lg"
      >
        We make hiring easy, fast and reliable. From technical roles to creative
        projects, our AI-ready talent pool has you covered.
      </motion.p>

      <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
        <Button
          variant="primary"
          href={hireContactUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full"
        >
          Talk to an expert
        </Button>
        <Button variant="outline" href="#services" className="rounded-full">
          Explore services
        </Button>
      </div>
    </Container>

    <a
      href="#services"
      aria-label="Scroll to our services"
      className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 rounded-full p-2 text-white/70 transition-colors hover:text-white focus:outline-none focus:ring-2 focus:ring-white/60"
    >
      <ArrowDown className="h-6 w-6 animate-bounce" />
    </a>
  </section>
);

export default HireHero;
