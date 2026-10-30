import { useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { Container } from './layout.jsx';
import olpsKenyaImg from '../assets/projects/olps-kenya.webp';
import bongoHubImg from '../assets/projects/bongohub.webp';
import algocdkImg from '../assets/projects/algocdk.webp';
import argusImg from '../assets/projects/argus.webp';
import efpitchImg from '../assets/projects/efpitch.webp';
import kisumuExplorersImg from '../assets/projects/kisumu-explorers.webp';
import yayaAiImg from '../assets/projects/yaya-ai.webp';
import replayLabbImg from '../assets/projects/replaylabb.webp';

/**
 * Completed Projects data.
 * Sourced from the learner project submission sheet.
 */
const PROJECTS = [
  {
    id: 'olps-kenya',
    title: 'OLPS Kenya',
    category: 'Health · Community',
    description:
      'Founded in 1992, OLPS restores health and dignity through HIV care, maternal health, education and livelihood programmes for vulnerable families in Kisumu and across Kenya.',
    image: olpsKenyaImg,
    href: 'https://olpskenya.org/',
    panelBg: '#201509',
    textColor: '#FFFFFF',
  },
  {
    id: 'bongohub',
    title: 'BongoHub',
    category: 'Creative Network · Community',
    description:
      'A community-driven network connecting 50+ creatives, projects and places across East Africa — from artists and filmmakers to designers and social entrepreneurs.',
    image: bongoHubImg,
    href: 'https://www.bongohub.net/',
    panelBg: '#241307',
    textColor: '#FFFFFF',
  },
  {
    id: 'algocdk',
    title: 'Algocdk',
    category: 'Fintech · Trading',
    description:
      'An algorithmic trading platform for Deriv with market analysis, bot automation and custom indicators.',
    image: algocdkImg,
    href: 'https://algocdk.site',
    panelBg: '#06182E',
    textColor: '#FFFFFF',
  },
  {
    id: 'argus',
    title: 'Argus',
    category: 'AI · Developer Tooling',
    description:
      'An AI agent command centre for monitoring coding agents, catching failures and approving work from your phone.',
    image: argusImg,
    href: 'https://argus-web.netlify.app/',
    panelBg: '#050806',
    textColor: '#FFFFFF',
  },
  {
    id: 'efpitch',
    title: 'efpitch',
    category: 'Esports · Tournaments',
    description:
      'A remote eFootball tournament platform with verified scores, anti-cheat checks and nationwide access.',
    image: efpitchImg,
    href: 'https://efpitch.com',
    panelBg: '#1B0E05',
    textColor: '#FFFFFF',
  },
  {
    id: 'kisumu-explorers',
    title: 'Kisumu Explorers',
    category: 'Travel · Community',
    description:
      'Hikes, tours and community adventures that help builders unplug, explore Kisumu and touch grass.',
    image: kisumuExplorersImg,
    href: '#',
    panelBg: '#07231A',
    textColor: '#FFFFFF',
  },
  {
    id: 'yaya-ai',
    title: 'Yaya AI',
    category: 'AI · Careers',
    description:
      'An AI job-automation platform that helps candidates apply to more roles in less time.',
    image: yayaAiImg,
    href: '#',
    panelBg: '#170B2E',
    textColor: '#FFFFFF',
  },
  {
    id: 'replaylabb',
    title: 'ReplayLabb',
    category: 'Developer Tools · API Debugging',
    description:
      'A local-first API debugging app that captures traffic, redacts secrets and replays failures to prove fixes.',
    image: replayLabbImg,
    href: 'https://replaylabb.vercel.app/',
    panelBg: '#080D0D',
    textColor: '#FFFFFF',
  },
];

const EASE = [0.2, 0.7, 0.2, 1];

/**
 * ProjectCard Component
 * Displays a single project card with image placeholder, metadata, and hover/focus effects.
 */
export const ProjectCard = ({ project }) => {
  return (
    <a
      href={project.href || '#'}
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
      className="relative w-full bg-[#F3F7FF] pt-[72px] pb-[32px] lg:pt-[120px] lg:pb-[40px]"
    >
      <Container>
        {/* Header Row */}
        <motion.div
          initial="hidden"
          animate={headerInView ? 'visible' : 'hidden'}
          variants={headerContainerVariants}
          className="flex flex-col items-center text-center gap-6 mb-12 sm:mb-14 lg:mb-16"
        >
          <div className="max-w-5xl">
            {/* H2 Title */}
            <motion.h2
              id="completed-projects-title"
              variants={fadeUpVariants}
              className="font-sans font-black text-[#092C3E] text-[30px] md:text-section-headline leading-[1.15] tracking-tight mb-4 2xl:whitespace-nowrap"
            >
              Real projects, built and delivered by our learners.
            </motion.h2>

            {/* Section intro */}
            <motion.p
              variants={fadeUpVariants}
              className="mx-auto font-sans text-[16px] md:text-body-l font-normal text-[#3B5566] leading-relaxed max-w-2xl"
            >
              Explore production software, digital products and community platforms built by
              Zone01 Kisumu apprentices — from trading tools and developer infrastructure to
              esports, travel and career technology.
            </motion.p>
          </div>
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
