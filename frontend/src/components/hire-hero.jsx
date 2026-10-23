// components/hire-hero.jsx
import { motion } from 'framer-motion';
import Button from './button.jsx';
import HirePartners from './hire-partners.jsx';
import { Container } from './layout.jsx';
import serviceHero from '../assets/service-hero.webp';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] },
});

/**
 * Employer hero for /hire. Opens with the promise — potential proven through
 * performance — and hands off to the proof band rendered directly below it.
 */
const HireHero = () => (
  <section
    data-nav-theme="dark"
    className="relative flex min-h-screen w-full items-end overflow-hidden"
    style={{ minHeight: '100svh' }}
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
          'linear-gradient(115deg, rgba(0,99,249,0.40) 0%, rgba(8,50,110,0.62) 50%, rgba(3,20,48,0.74) 100%)',
      }}
    />

    <Container className="relative z-10 pb-28 pt-32 sm:pb-32 md:pb-36">
      <motion.h1
        {...fadeUp(0)}
        className="max-w-5xl font-sans text-[3rem] font-black leading-[1.04] tracking-tight text-white sm:text-[4.5rem] lg:text-hero-h1"
      >
        Hire for{' '}
        <span className="relative inline-block text-accent">
          potential
          <svg
            aria-hidden="true"
            viewBox="0 0 220 12"
            preserveAspectRatio="none"
            className="absolute -bottom-2 left-0 h-2.5 w-full text-accent/50"
          >
            <path
              d="M2 8c48-5 96-6 144-5 26 1 50 3 72 5"
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinecap="round"
            />
          </svg>
        </span>
        , proven through performance.
      </motion.h1>

      <motion.p
        {...fadeUp(0.12)}
        className="mt-7 max-w-7xl text-balance font-sans text-base leading-relaxed text-white/85 sm:text-body-l"
      >
        Zone01 engineers are selected from 28,000+ applicants on cognitive
        potential, then trained through months of intensive, project-based,
        peer-reviewed work. 86 of 97 of our inaugural apprentices and graduates
        are now in paid work.
      </motion.p>

      <motion.div
        {...fadeUp(0.2)}
        className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center"
      >
        <Button
          variant="primary"
          href="#request"
          className="!px-6 !py-2 rounded-full text-body-m whitespace-nowrap !font-sans"
        >
          Request a talent shortlist
        </Button>
        <Button
          variant="outline"
          href="#profiles"
          className="!px-6 !py-2 rounded-full text-body-m whitespace-nowrap !font-sans"
        >
          View talent profiles
        </Button>
      </motion.div>
    </Container>

    <div className="absolute inset-x-0 bottom-0 z-20">
      <HirePartners />
    </div>
  </section>
);

export default HireHero;
