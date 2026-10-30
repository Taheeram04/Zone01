import { motion } from 'framer-motion';
import Button from './button.jsx';
import { Container } from './layout.jsx';
import { KineticHeading, TypewriterText } from './whocanapply.jsx';
import { APPLICATION_URL } from '../constants.js';
import { useSnapCarousel } from '../hooks/useSnapCarousel.js';
import whoIsItFor1 from '../assets/whoisitfor1.webp';
import whoIsItFor1Small from '../assets/whoisitfor1-700.webp';
import whoIsItFor2 from '../assets/whoisitfor2.webp';
import whoIsItFor2Small from '../assets/whoisitfor2-360.webp';
import aokutu from '../assets/aokutu.JPG';
import aokutuSmall from '../assets/aokutu-360.JPG';

const targetAudience = [
  {
    image: whoIsItFor1,
    small: whoIsItFor1Small,
    width: 1600,
    smallWidth: 700,
    title: 'EARLY CAREER STARTERS',
    description:
      'Finished High School or College and looking to build world-class tech skills?',
    alt: 'Early career learner at Zone01 Kisumu',
  },
  {
    image: whoIsItFor2,
    small: whoIsItFor2Small,
    width: 604,
    smallWidth: 360,
    title: 'CAREER SWITCHERS',
    description:
      'Looking for a mid career switch into the exciting world of tech?',
    alt: 'Career switcher learner at Zone01 Kisumu',
  },
  {
    image: aokutu,
    small: aokutuSmall,
    width: 604,
    smallWidth: 360,
    title: 'EXPERIENCED PROFESSIONALS',
    description:
      'Having a wealth of experience but looking to re-skill to keep up with global digital trends?',
    alt: 'Experienced professional learner at Zone01 Kisumu',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.16,
      delayChildren: 0.12,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.75,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const WhoIsItFor = () => {
  const { trackRef, index, handleScroll, goTo } = useSnapCarousel(targetAudience.length);

  return (
    <section data-nav-theme="light" className="relative w-full bg-white pt-6 pb-16 md:pt-8 md:pb-24 overflow-hidden">
      <Container className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <KineticHeading
            as="h2"
            text="Who is it for?"
            className="font-sans font-black text-black-900 text-[36px] sm:text-[44px] md:text-[50px] lg:text-[56px] leading-tight tracking-tight text-center mb-3"
          />
          <TypewriterText
            text="World class education made accessible to all, regardless of experience and background"
            className="font-mono text-[15px] sm:text-[16px] md:text-[18px] text-black-900/85 max-w-2xl mx-auto leading-relaxed"
            speed={22}
            delay={200}
          />
        </div>

        {/* 3-Column Card Grid */}
        <motion.div
          ref={trackRef}
          onScroll={handleScroll}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={containerVariants}
          className="-mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:mx-0 md:grid md:grid-cols-3 md:gap-6 lg:gap-8 md:overflow-visible md:px-0 md:pb-0"
        >
          {targetAudience.map((item) => (
            <motion.div
              key={item.title}
              variants={cardVariants}
              whileHover={{ y: -6 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="flex w-[85%] flex-none snap-center flex-col items-center text-center group cursor-default md:w-full"
            >
              {/* Image Frame with Aspect Ratio matching design */}
              <div className="relative w-full aspect-[4/3.5] sm:aspect-[4/4.3] rounded-2xl overflow-hidden bg-slate-100 shadow-sm">
                <motion.img
                  src={item.image}
                  srcSet={`${item.small} ${item.smallWidth}w, ${item.image} ${item.width}w`}
                  sizes="(min-width: 768px) 25vw, 85vw"
                  alt={item.alt}
                  className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
                  loading="lazy"
                />
              </div>

              {/* Category / Title */}
              <h3 className="w-full text-center font-sans font-bold text-[15px] sm:text-[17px] md:text-[16px] lg:text-[18px] xl:text-[19px] text-primary tracking-wide uppercase mt-5 mb-2.5 md:mt-6 md:mb-3 whitespace-nowrap">
                {item.title}
              </h3>

              {/* Description */}
              <p className="w-full text-center font-mono text-[15px] sm:text-[16px] md:text-[17px] text-black-900/85 leading-[1.65] max-w-sm mx-auto">
                {item.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Mobile pagination */}
        <div className="mt-5 flex items-center justify-center gap-1 md:hidden">
          {targetAudience.map((item, i) => (
            <button
              key={item.title}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Show ${item.title}`}
              aria-current={i === index}
              className="flex h-6 w-6 items-center justify-center"
            >
              <span
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === index ? 'w-6 bg-primary' : 'w-1.5 bg-secondary/20'
                }`}
              />
            </button>
          ))}
        </div>

        {/* Apply CTA Button centered below the cards */}
        <div className="mt-8 md:mt-16 flex justify-center">
          <Button
            variant="primary"
            href={APPLICATION_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-8 py-3"
          >
            Apply Now
          </Button>
        </div>
      </Container>
    </section>
  );
};

export default WhoIsItFor;
