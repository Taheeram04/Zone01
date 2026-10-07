import { motion } from 'framer-motion';
import { Container } from './layout.jsx';
import { KineticHeading } from './whocanapply.jsx';

const campusFeatures = [
  {
    title: '< TUITION-FREE TRAINING >',
    description:
      'We do not charge any tuition fees, registration fees or examination fees throughout the duration of the training.',
  },
  {
    title: '< STUDY STIPEND >',
    description:
      'During the training period, we support our talent with paid monthly stipends among other benefits to support them in fully focusing on their learning journey.',
  },
  {
    title: '< HIGH MARKET VALUE >',
    description:
      'Our talent are hired by top tech companies, with a high average starting salary of 30% above market level with similar qualifications.',
  },
  {
    title: '< HOLISTIC TALENT DEVELOPMENT >',
    description:
      'We support our talent as whole people by nurturing their mental, physical, emotional and professional growth.',
  },
  {
    title: '< PRESTIGIOUS ALUMNI CLUB >',
    description:
      'Join a network of more than 100,000 digital peer to peer alumni globally that provide a supportive ecosystem for peer-to-peer learning and collaboration.',
  },
  {
    title: '< JOB ALIGNMENT >',
    description:
      'We support our talent to secure roles locally and internationally with our partners upon fully completing the training. Our talent are hired by top tech companies, with a high average starting salary of 30% above market rates.',
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
        {/* Incomplete rectangle border framing the whole section */}
        <div className="relative px-6 sm:px-10 md:px-14 py-12 md:py-16">
          {/* Subtle Corner Brackets Framing the Section */}
          <div className="absolute top-0 left-0 pointer-events-none p-1">
            <svg
              width="22"
              height="22"
              viewBox="0 0 20 20"
              fill="none"
              className="text-black-900/50"
              aria-hidden="true"
            >
              <path
                d="M1 19V6C1 3.23858 3.23858 1 6 1H19"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>

          <div className="absolute top-0 right-0 pointer-events-none p-1">
            <svg
              width="22"
              height="22"
              viewBox="0 0 20 20"
              fill="none"
              className="text-black-900/50 rotate-90"
              aria-hidden="true"
            >
              <path
                d="M1 19V6C1 3.23858 3.23858 1 6 1H19"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>

          <div className="absolute bottom-0 left-0 pointer-events-none p-1">
            <svg
              width="22"
              height="22"
              viewBox="0 0 20 20"
              fill="none"
              className="text-black-900/50 -rotate-90"
              aria-hidden="true"
            >
              <path
                d="M1 19V6C1 3.23858 3.23858 1 6 1H19"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>

          <div className="absolute bottom-0 right-0 pointer-events-none p-1">
            <svg
              width="22"
              height="22"
              viewBox="0 0 20 20"
              fill="none"
              className="text-black-900/50 rotate-180"
              aria-hidden="true"
            >
              <path
                d="M1 19V6C1 3.23858 3.23858 1 6 1H19"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>

          {/* Section Heading */}
          <div className="text-center mb-12 md:mb-20">
            <KineticHeading
              as="h2"
              text="Why Zone01 Kisumu?"
              className="font-sans font-black text-black-900 text-[32px] sm:text-[40px] md:text-[48px] lg:text-[54px] leading-tight tracking-tight text-center"
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
                className="flex flex-col items-center text-center cursor-default px-2"
              >
                {/* Title with brackets */}
                <motion.h3
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                  className="font-mono font-bold text-[18px] sm:text-[19px] md:text-[21px] text-primary tracking-wide mb-3 text-center cursor-default"
                >
                  {feature.title}
                </motion.h3>

                {/* Description */}
                <p className="w-full text-center font-mono text-[15px] sm:text-[16px] md:text-[17px] text-black-900/85 leading-[1.7] max-w-md mx-auto">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </Container>
    </section>
  );
};

export default WhyOurCampus;
