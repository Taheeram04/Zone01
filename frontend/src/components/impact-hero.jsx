// components/impact-hero.jsx
import { motion } from 'framer-motion';
import { Container } from './layout.jsx';
import impact1 from '../assets/impact.png';
import impact2 from '../assets/impact2.jpeg';
import impact3 from '../assets/impact3.jpeg';
import ImpactCrossZoom from './impact-cross-zoom.jsx';

const IMPACT_IMAGES = [
  {
    src: impact1,
    alt: 'Zone01 Kisumu learners engaged in collaborative peer-to-peer coding',
  },
  {
    src: impact2,
    alt: 'Zone01 Kisumu students focused on projects at their workstations',
  },
  {
    src: impact3,
    alt: 'Zone01 Kisumu coding campus community and tech leaders',
  },
];

/**
 * ImpactHero
 * Hero section for the "Our Impact" page based on Figma designs.
 * Features an electric blue background (#0063F9), the bold "Our Impact" title,
 * and a stylized photograph of Zone01 students with an integrated "RESULTS, NOT RHETORIC" badge
 * and an ultra-smooth cross-zoom transition cycling through campus imagery.
 */
const ImpactHero = () => {
  return (
    <section
      data-nav-theme="dark"
      className="relative w-full min-h-[92svh] lg:min-h-screen bg-primary overflow-hidden flex flex-col justify-center pt-28 pb-16 sm:pt-32 sm:pb-20 lg:py-0"
    >
      <Container className="relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-10 lg:gap-8 xl:gap-12 min-h-[70vh] lg:min-h-[80vh]">
          {/* Left Column: Heading */}
          <div className="lg:col-span-5 xl:col-span-6 flex flex-col justify-start lg:justify-center">
            <motion.h1
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="font-sans font-black tracking-tight leading-[1.04] text-[clamp(2.75rem,6.5vw,5.5rem)]"
            >
              <span className="text-white">Our </span>
              <span className="text-black-900">Impact</span>
            </motion.h1>
          </div>

          {/* Right Column: Hero Photograph with overlapping Slogan Tab */}
          <div className="lg:col-span-7 xl:col-span-6 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-[580px] lg:max-w-[620px] xl:max-w-[720px]">
              {/* Photo Card: maintains exact aspect ratio, rounded corners, and overflow clipping */}
              <div
                className="relative z-0 isolate overflow-hidden rounded-[28px] sm:rounded-[36px] xl:rounded-[40px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.35)] aspect-[752/858] w-full"
              >
                <ImpactCrossZoom
                  images={IMPACT_IMAGES}
                  holdTime={5}
                  duration={2.2}
                  fadeEase="power2.inOut"
                  zoomEase="power2.inOut"
                />
              </div>

              {/* Slogan Tab: Completely static cutout badge overlapping photo with rounded right corners */}
              <div
                className="absolute top-1/2 -translate-y-1/2 -left-4 sm:-left-8 md:-left-12 lg:-left-16 xl:-left-20 z-30 bg-primary rounded-r-[24px] sm:rounded-r-[32px] xl:rounded-r-[36px] py-8 sm:py-12 md:py-16 xl:py-20 pl-4 sm:pl-8 md:pl-10 xl:pl-12 pr-6 sm:pr-8 md:pr-10 xl:pr-12 flex flex-col justify-center select-none pointer-events-none"
              >
                <div className="font-sans font-black text-white text-base sm:text-xl md:text-2xl lg:text-[26px] xl:text-[32px] leading-[1.12] tracking-tight uppercase whitespace-nowrap">
                  <p>RESULTS,</p>
                  <p>NOT</p>
                  <p>RHETORIC</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default ImpactHero;
