import { motion } from 'framer-motion';
import { Container } from './layout.jsx';
import { KineticHeading } from './whocanapply.jsx';

const campusFeatures = [
  {
    title: '< TUITION-FREE TRAINING >',
    description:
      'Get trained without paying any tuition fees, no registration fees, no examination fees are required throughout the duration of the course.',
  },
  {
    title: '< JOB GUARANTEE >',
    description:
      'Guaranteed job placement by local and global top hiring talent agencies upon fully covering the self-paced learning content.',
  },
  {
    title: '< STUDY STIPEND >',
    description:
      'During the 1-year training period, our talent get monthly stipend among other benefits to support them in fully focusing on their learning journey.',
  },
  {
    title: '< PARTNERS CLUB >',
    description:
      'Connect and join a network of more than 100,000 digital peer to peer alumni globally that provide a supportive ecosystem for peer-to-peer learning and collaboration.',
  },
  {
    title: '< HIGH MARKET VALUE >',
    description:
      'Hired by top tech companies, with a high average starting salary of 30% above market level with similar qualifications.',
  },
  {
    title: '< SUPERIOR TALENT >',
    description:
      'Fully adaptable and equipped with hard and soft skills to work collaboratively in a fast-moving tech environment',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const WhyOurCampus = () => {
  return (
    <section data-nav-theme="light" className="relative w-full bg-campus-bg py-16 md:py-28 overflow-hidden">
      <Container>
        {/* Section Heading */}
        <div className="text-center mb-12 md:mb-20">
          <KineticHeading
            as="h2"
            text="Why our campus"
            className="font-sans font-black text-black-900 text-[30px] md:text-section-headline leading-tight tracking-tight text-center"
          />
        </div>

        {/* 6-Item Feature Grid (2 rows x 3 columns) */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 lg:gap-x-16 gap-y-12 md:gap-y-16"
        >
          {campusFeatures.map((feature) => (
            <motion.div
              key={feature.title}
              variants={itemVariants}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="flex flex-col items-center text-center cursor-default"
            >
              {/* Corner bracket icon accent matching HOME.png */}
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                className="text-black-900/60 mb-3"
                aria-hidden="true"
              >
                <path
                  d="M1 19V6C1 3.23858 3.23858 1 6 1H19"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>

              {/* Title with brackets */}
              <motion.h3
                whileHover={{ scale: 1.15 }}
                transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                className="font-mono font-medium text-body-m text-primary tracking-wide mb-3 text-center cursor-default"
              >
                {feature.title}
              </motion.h3>

              {/* Description */}
              <p className="w-full text-center font-mono text-body-s text-black-900/80 leading-[1.7]">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </section>
  );
};

export default WhyOurCampus;
