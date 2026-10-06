import { motion } from 'framer-motion';
import { Container } from './layout.jsx';
import { KineticHeading, TypewriterText } from './whocanapply.jsx';
import whoIsItFor1 from '../assets/whoisitfor1.png';
import whoIsItFor2 from '../assets/whoisitfor2.png';
import whoIsItFor3 from '../assets/whoisitfor3.JPG';

const targetAudience = [
  {
    image: whoIsItFor1,
    title: 'EARLY CAREER STARTERS',
    description:
      'Finished highschool or college and looking to build world-class tech skills?',
    alt: 'Early career learner at Zone01 Kisumu',
  },
  {
    image: whoIsItFor2,
    title: 'CAREER SWITCHERS',
    description:
      'Looking for a mid career switch into the exciting world of tech returning from an absence',
    alt: 'Career switcher learner at Zone01 Kisumu',
  },
  {
    image: whoIsItFor3,
    title: 'EXPERIENCED PROFESSIONALS',
    description:
      'Having wealth of experience but looking to reskill and keep up with global digital transformation and trends?',
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
  return (
    <section className="relative w-full bg-white py-16 md:py-24 overflow-hidden">
      <Container className="max-w-[1400px]">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <KineticHeading
            as="h2"
            text="Who is it for?"
            className="font-sans font-black text-black-900 text-[30px] md:text-section-headline leading-tight tracking-tight text-center mb-3"
          />
          <TypewriterText
            text="World class education made accessible to all in Kisumu, regardless of experience"
            className="font-mono text-body-s md:text-body-m text-black-900/80 max-w-xl mx-auto leading-relaxed"
            speed={22}
            delay={200}
          />
        </div>

        {/* 3-Column Card Grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10"
        >
          {targetAudience.map((item) => (
            <motion.div
              key={item.title}
              variants={cardVariants}
              whileHover={{ y: -6 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="flex flex-col group cursor-default"
            >
              {/* Image Frame with Aspect Ratio matching design */}
              <div className="relative w-full aspect-[4/4.3] rounded-2xl overflow-hidden bg-slate-100 shadow-sm">
                <motion.img
                  src={item.image}
                  alt={item.alt}
                  className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
                  loading="lazy"
                />
              </div>

              {/* Category / Title */}
              <h3 className="font-sans font-bold text-body-m text-primary tracking-wider uppercase mt-6 mb-3">
                {item.title}
              </h3>

              {/* Description */}
              <p className="font-mono text-body-s text-black-900/80 leading-[1.6] max-w-xs">
                {item.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </section>
  );
};

export default WhoIsItFor;
