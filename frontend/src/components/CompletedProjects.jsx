import { useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { Container } from './layout.jsx';

/**
 * Completed Projects data.
 * Easily edit or extend project entries here.
 */
const PROJECTS = [
  {
    id: 'chichwa',
    number: '01',
    title: 'Chichwa',
    category: 'AgriTech & Marketplace',
    description: 'A digital agricultural management and marketplace platform connecting farmers, cooperatives, and buyers across Kenya for transparent produce trading and direct market access.',
    image: chichwaImg,
    href: 'https://chichwa.ke/en/',
    panelBg: '#0063F9',
    textColor: '#FFFFFF',
  },
  {
    id: 'chiro',
    number: '02',
    title: 'Chiro',
    category: '[Category]',
    description: '[One or two lines on what was built and who it serves.]',
    image: '',
    href: '#',
    panelBg: '#092C3E',
    textColor: '#FFFFFF',
  },
  {
    id: 'flexi-ride',
    number: '03',
    title: 'Flexi Ride',
    category: '[Category]',
    description: '[One or two lines on what was built and who it serves.]',
    image: '',
    href: '#',
    panelBg: '#BBD6FF',
    textColor: '#092C3E',
  },
  {
    id: 'lms',
    number: '04',
    title: 'LMS',
    category: '[Category]',
    description: '[One or two lines on what was built and who it serves.]',
    image: '',
    href: '#',
    panelBg: '#0A4FBF',
    textColor: '#FFFFFF',
  },
  {
    id: 'local-leaders-fund',
    number: '05',
    title: 'Local Leaders Fund',
    category: '[Category]',
    description: '[One or two lines on what was built and who it serves.]',
    image: '',
    href: '#',
    panelBg: '#E6F0FF',
    textColor: '#092C3E',
  },
  {
    id: 'replay-lab',
    number: '06',
    title: 'Replay Lab',
    category: '[Category]',
    description: '[One or two lines on what was built and who it serves.]',
    image: '',
    href: '#',
    panelBg: '#0063F9',
    textColor: '#FFFFFF',
  },
];

const EASE = [0.2, 0.7, 0.2, 1];

/**
 * ProjectCard Component
 * Displays a single project card with image placeholder, metadata, and hover/focus effects.
 */
export const ProjectCard = ({ project }) => {
  const isExternal = Boolean(project.href && (project.href.startsWith('http://') || project.href.startsWith('https://')));

  return (
    <a
      href={project.href || '#'}
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noopener noreferrer' : undefined}
      className="group relative flex flex-col h-full bg-white border border-[#D5E3F7] rounded-[6px] overflow-hidden transition-all duration-300 ease-out hover:-translate-y-[10px] hover:border-[#0063F9] hover:shadow-[0_24px_48px_-16px_rgba(9,44,62,0.28)] focus-visible:-translate-y-[10px] focus-visible:border-[#0063F9] focus-visible:shadow-[0_24px_48px_-16px_rgba(9,44,62,0.28)] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#0063F9] focus-visible:outline-offset-2 motion-reduce:transform-none motion-reduce:transition-none motion-reduce:shadow-none"
    >
      {/* Top 240px Image Area */}
      <div
        className="relative w-full h-[240px] overflow-hidden shrink-0"
        style={{ backgroundColor: project.panelBg }}
      >
        {project.image ? (
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-[800ms] cubic-bezier(0.2,0.7,0.2,1) group-hover:scale-[1.08] group-focus-visible:scale-[1.08] motion-reduce:transform-none motion-reduce:transition-none"
          />
        ) : (
          <div className="w-full h-full relative flex items-center justify-center overflow-hidden transition-transform duration-[800ms] cubic-bezier(0.2,0.7,0.2,1) group-hover:scale-[1.08] group-focus-visible:scale-[1.08] motion-reduce:transform-none motion-reduce:transition-none">
            {/* Subtle diagonal line pattern */}
            <div
              aria-hidden="true"
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage: `repeating-linear-gradient(
                  45deg,
                  ${project.textColor} 0,
                  ${project.textColor} 1px,
                  transparent 0,
                  transparent 12px
                )`,
                opacity: 0.14,
              }}
            />
            {/* Placeholder label */}
            <span
              className="font-mono text-[13px] tracking-wider font-medium select-none z-10"
              style={{ color: project.textColor }}
            >
              [PROJECT IMAGE]
            </span>
          </div>
        )}

        {/* Item number at top left (01 to 06) */}
        <span
          className="absolute top-4 left-4 z-20 font-mono text-body-s font-medium tracking-wider transition-transform duration-300 ease-out group-hover:translate-x-[6px] group-focus-visible:translate-x-[6px] motion-reduce:transform-none motion-reduce:transition-none"
          style={{
            color: project.image ? '#FFFFFF' : project.textColor,
            textShadow: project.image ? '0 1px 3px rgba(0,0,0,0.6)' : 'none',
          }}
        >
          {project.number}
        </span>
      </div>

      {/* Body with 28px padding */}
      <div className="p-[28px] flex flex-col flex-1 justify-between gap-6">
        <div>
          {/* Category */}
          <span className="font-mono text-body-s uppercase text-[#0A4FBF] font-medium tracking-wider block mb-2">
            {project.category}
          </span>

          {/* Title */}
          <h3 className="font-sans text-cta-headline font-black text-[#092C3E] leading-snug mb-2">
            {project.title}
          </h3>

          {/* Description */}
          <p className="font-sans text-body-m font-normal leading-[1.6] text-[#3B5566]">
            {project.description}
          </p>
        </div>

        {/* View project link-style label */}
        <div className="inline-flex items-center gap-2 font-sans text-body-m font-semibold text-[#0063F9]">
          <span>View project</span>
          <svg
            className="w-4 h-4 transition-transform duration-300 ease-out group-hover:translate-x-[8px] group-focus-visible:translate-x-[8px] motion-reduce:transform-none"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2.5"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </div>
      </div>

      {/* 4px bar sweeping across bottom edge from left to right */}
      <span
        aria-hidden="true"
        className="absolute bottom-0 left-0 right-0 h-[4px] bg-[#0063F9] origin-left scale-x-0 transition-transform duration-300 ease-out group-hover:scale-x-100 group-focus-visible:scale-x-100 motion-reduce:transform-none motion-reduce:transition-none"
      />
    </a>
  );
};

/**
 * CompletedProjects Section Component
 */
export default function CompletedProjects() {
  const sectionRef = useRef(null);
  const gridRef = useRef(null);
  const prefersReduced = useReducedMotion();

  // Scroll reveal triggered once with threshold ~0.15
  const headerInView = useInView(sectionRef, { once: true, amount: 0.15 });
  const gridInView = useInView(gridRef, { once: true, amount: 0.15 });

  const headerContainerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: prefersReduced ? 0 : 0.12,
      },
    },
  };

  const fadeUpVariants = {
    hidden: prefersReduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 36 },
    visible: {
      opacity: 1,
      y: 0,
      transition: prefersReduced
        ? { duration: 0 }
        : {
            duration: 0.8,
            ease: EASE,
          },
    },
  };

  const gridContainerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: prefersReduced ? 0 : 0.12,
      },
    },
  };

  return (
    <section
      ref={sectionRef}
      id="completed-projects"
      aria-labelledby="completed-projects-title"
      className="relative w-full bg-[#F3F7FF] py-[72px] lg:py-[120px]"
    >
      <Container>
        {/* Header Row */}
        <motion.div
          initial="hidden"
          animate={headerInView ? 'visible' : 'hidden'}
          variants={headerContainerVariants}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12 sm:mb-14 lg:mb-16"
        >
          <div className="max-w-none">
            {/* H2 Title */}
            <motion.h2
              id="completed-projects-title"
              variants={fadeUpVariants}
              className="font-sans font-black text-[#092C3E] text-[30px] md:text-section-headline leading-[1.15] tracking-tight mb-4 2xl:whitespace-nowrap"
            >
              Real projects, built and delivered by our learners.
            </motion.h2>

            {/* Placeholder Paragraph */}
            <motion.p
              variants={fadeUpVariants}
              className="font-sans text-[16px] md:text-body-l font-normal text-[#3B5566] leading-relaxed max-w-2xl"
            >
              [A showcase of production software, digital solutions, and community systems engineered and deployed by our apprentices.]
            </motion.p>
          </div>

          {/* Primary Button */}
          <motion.div variants={fadeUpVariants} className="shrink-0">
            <a
              href="#"
              className="group inline-flex items-center justify-center gap-2 min-h-[48px] px-6 py-3 bg-[#0063F9] text-white font-sans font-semibold text-body-m rounded-[4px] hover:bg-[#092C3E] hover:-translate-y-[3px] transition-all duration-300 ease-out focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#0063F9] focus-visible:outline-offset-2 motion-reduce:transform-none motion-reduce:transition-none"
            >
              <span>View all projects</span>
              <svg
                className="w-4 h-4 transition-transform duration-300 ease-out group-hover:translate-x-[6px] group-focus-visible:translate-x-[6px] motion-reduce:transform-none"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2.5"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </a>
          </motion.div>
        </motion.div>

        {/* Cards Grid */}
        <motion.div
          ref={gridRef}
          initial="hidden"
          animate={gridInView ? 'visible' : 'hidden'}
          variants={gridContainerVariants}
          className="flex snap-x snap-mandatory gap-[28px] overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {PROJECTS.map((project) => (
            <motion.div
              key={project.id}
              variants={fadeUpVariants}
              className="w-[85vw] max-w-[360px] flex-none snap-start sm:w-[340px] lg:w-[380px]"
            >
              <ProjectCard project={project} />
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </section>
  );
}
