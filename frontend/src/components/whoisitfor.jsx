import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from './button.jsx';
import { Container } from './layout.jsx';
import { KineticHeading, TypewriterText } from './whocanapply.jsx';
import whoIsItFor1 from '../assets/whoisitfor1.png';
import whoIsItFor2 from '../assets/whoisitfor2.png';
import whoIsItFor3 from '../assets/whoisitfor3.png';

const targetAudience = [
  {
    image: whoIsItFor1,
    title: 'EARLY CAREER STARTERS',
    description:
      'Finished High School or College and looking to build world-class tech skills?',
    alt: 'Early career learner at Zone01 Kisumu',
  },
  {
    image: whoIsItFor2,
    title: 'CAREER SWITCHERS',
    description:
      'Looking for a mid career switch into the exciting world of tech?',
    alt: 'Career switcher learner at Zone01 Kisumu',
  },
  {
    image: whoIsItFor3,
    title: 'EXPERIENCED PROFESSIONALS',
    description:
      'Having a wealth of experience but looking to re-skill to keep up with global digital transformation and trends?',
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
  const navigate = useNavigate();

  return (
    <section data-nav-theme="light" className="relative w-full bg-white py-16 md:py-24 overflow-hidden">
      <Container>
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <KineticHeading
            as="h2"
            text="Who is it for?"
            className="font-sans font-black text-black-900 text-[36px] sm:text-[44px] md:text-[50px] lg:text-[56px] leading-tight tracking-tight text-center mb-3"
          />
          <TypewriterText
            text="World class education made accessible to all in Kisumu, regardless of experience and background"
            className="font-mono text-[15px] sm:text-[16px] md:text-[18px] text-black-900/85 max-w-2xl mx-auto leading-relaxed"
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
          className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12 lg:gap-16 justify-items-center"
        >
          {targetAudience.map((item) => (
            <motion.div
              key={item.title}
              variants={cardVariants}
              whileHover={{ y: -6 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="flex flex-col items-center text-center group cursor-default w-full"
            >
              {/* Image Frame with Aspect Ratio matching design */}
              <div className="relative w-full aspect-[4/3.5] sm:aspect-[4/4.3] rounded-2xl overflow-hidden bg-slate-100 shadow-sm">
                <motion.img
                  src={item.image}
                  alt={item.alt}
                  className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
                  loading="lazy"
                />
              </div>

              {/* Category / Title */}
              <h3 className="w-full text-center font-sans font-bold text-[18px] sm:text-[19px] md:text-[21px] text-primary tracking-wider uppercase mt-5 mb-2.5 md:mt-6 md:mb-3">
                {item.title}
              </h3>

              {/* Description */}
              <p className="w-full text-center font-mono text-[15px] sm:text-[16px] md:text-[17px] text-black-900/85 leading-[1.65] max-w-sm mx-auto">
                {item.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Apply CTA Button centered below the cards */}
        <div className="mt-12 md:mt-16 flex justify-center">
          <Button
            variant="primary"
            onClick={() => navigate('/apply')}
            className="w-full sm:w-auto px-8 py-3"
          >
            Apply now
          </Button>
        </div>
      </Container>
    </section>
  );
};

export default WhoIsItFor;
