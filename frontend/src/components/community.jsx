// components/community.jsx
import { motion } from 'framer-motion';
import { Container } from './layout.jsx';
import communityHeroImg from '../assets/community-hero.webp';

/**
 * Community — "Our Partners" hero.
 * Full-bleed group photograph with a deep blue wash and the "OUR PARTNERS"
 * statement centred on top. Mirrors the About hero so the two pages share the
 * same visual language.
 */
const Community = () => {
  return (
    <section
      data-nav-theme="dark"
      className="relative flex min-h-screen w-full items-center justify-center overflow-hidden"
      style={{ minHeight: '100svh' }}
    >
      {/* Background layer — the partners group photograph, sharp and full-bleed */}
      <img
        src={communityHeroImg}
        alt="Zone01 Kisumu team and visitors gathered on stage"
        className="absolute inset-0 h-full w-full object-cover object-center"
      />

      {/* Overlay: deep blue wash, lighter top-left into a deeper bottom-right */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(135deg, rgba(0,99,249,0.38) 0%, rgba(9,44,62,0.58) 48%, rgba(4,26,54,0.82) 100%)',
        }}
      />

      {/* Text layer — centred */}
      <Container className="relative z-10 py-28 sm:py-32">
        <div className="mx-auto max-w-6xl text-center">
          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="font-sans font-black uppercase leading-[1.04] tracking-tight text-white text-[clamp(2rem,7vw,5rem)]"
          >
            Our Partners
          </motion.h1>
        </div>
      </Container>
    </section>
  );
};

export default Community;
