import { motion } from 'framer-motion';
import { Container } from './layout.jsx';
import { KineticHeading } from './whocanapply.jsx';

const campusFeatures = [
  {
    title: '< TUITION-FREE TRAINING >',
    description:
      'We do not charge any tuition fees, registration fees or examination fees throughout the duration of training.',
  },
  {
    title: '< STUDY STIPEND >',
    description:
      'During the training period, we support our talent with paid monthly stipend among other benefits to support them in fully focusing on their learning journey.',
  },
  {
    title: '< HIGH MARKET VALUE >',
    description:
      'Our talent are hired by top tech companies,with ahigh average starting salary of 30%above market level with similar qualifications.',
  },
  {
    title: '< HOLISTIC TALENT DEVELOPMENT >',
    description:
      'We support our talent as whole people by nurturing their mental,physical,emotional and professional growth.',
  },
  {
    title: '< PRESTIGIOUS ALUMNI CLUB >',
    description:
      'Join a network of more then 100,000 digital peer to peer alumni globally that provide a supportive eco-system for peer to peer learning and collaboration.',
  },
  {
    title: '< JOB ALIGNMENT >',
    description:
      'We support our talent to secure roles both locally and internationally with our partners,upon fully completing the training. Our talent are hired by top tech companies, with a high average starting salary of 30% above market rates.',
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
    <section className="relative w-full bg-campus-bg py-20 md:py-28 overflow-hidden">
      <Container className="max-w-[1400px]">
        {/* Section Heading */}
        <div className="text-center mb-16 md:mb-20">
          <KineticHeading
            as="h2"
            text="Why Zone01 Kisumu?"
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
              className="flex flex-col items-start cursor-default"
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
              <h3 className="font-mono font-medium text-body-m text-primary tracking-wide mb-3">
                {feature.title}
              </h3>

              {/* Description */}
              <p className="font-mono text-body-s text-black-900/80 leading-[1.7] max-w-sm">
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
