import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { Container } from './layout.jsx';
import chichwaImg from '../assets/Chichwa.webp';
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
  {
    id: 'kisumu-explorers',
    title: 'Kisumu Explorers',
    category: 'Travel · Community',
    description:
      'Hikes, tours and community adventures that help builders unplug, explore Kisumu and touch grass.',
    image: kisumuExplorersImg,
    href: 'https://kisumuexplorers.netlify.app/',
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
    href: null,
    comingSoon: true,
    panelBg: '#170B2E',
    textColor: '#FFFFFF',
  },
];

const EASE = [0.2, 0.7, 0.2, 1];

/**
 * Only absolute web URLs should open outside the site. Relative paths, hash
 * links, mailto:, tel: and other schemes stay in the current tab.
 */
const isExternalHref = (href) => {
  if (!href) return false;

  try {
    const url = new URL(href, window.location.origin);
    return (
      (url.protocol === 'http:' || url.protocol === 'https:') &&
      url.origin !== window.location.origin
    );
  } catch {
    return false;
  }
};

/**
 * ProjectCard Component
 * Displays a single project card with image placeholder, metadata, and hover/focus effects.
 */
export const ProjectCard = ({ project }) => {
  const isExternal = isExternalHref(project.href);
  const isComingSoon = Boolean(project.comingSoon || !project.href);
  const Card = isComingSoon ? 'div' : 'a';
  const cardProps = isComingSoon
    ? {}
    : {
        href: project.href,
        target: isExternal ? '_blank' : undefined,
        rel: isExternal ? 'noopener noreferrer' : undefined,
      };

  return (
    <Card
      {...cardProps}
      className={`group relative flex flex-col h-full bg-white border border-[#D5E3F7] rounded-[6px] overflow-hidden transition-all duration-300 ease-out motion-reduce:transform-none motion-reduce:transition-none motion-reduce:shadow-none ${
        isComingSoon
          ? 'cursor-default'
          : 'hover:-translate-y-[10px] hover:border-[#0063F9] hover:shadow-[0_24px_48px_-16px_rgba(9,44,62,0.28)] focus-visible:-translate-y-[10px] focus-visible:border-[#0063F9] focus-visible:shadow-[0_24px_48px_-16px_rgba(9,44,62,0.28)] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#0063F9] focus-visible:outline-offset-2'
      }`}
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

        {isComingSoon && (
          <span className="absolute right-3 top-3 rounded-full bg-white/95 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-[#0A4FBF] shadow-sm">
            Coming soon
          </span>
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

        {/* View project / coming-soon label */}
        {isComingSoon ? (
          <div className="inline-flex items-center gap-2 font-sans text-body-m font-semibold text-[#3B5566]">
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="9" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 7v5l3 2" />
            </svg>
            <span>Coming soon</span>
          </div>
        ) : (
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
        )}
      </div>

      {/* 4px bar sweeping across bottom edge from left to right */}
      {!isComingSoon && (
        <span
          aria-hidden="true"
          className="absolute bottom-0 left-0 right-0 h-[4px] bg-[#0063F9] origin-left scale-x-0 transition-transform duration-300 ease-out group-hover:scale-x-100 group-focus-visible:scale-x-100 motion-reduce:transform-none motion-reduce:transition-none"
        />
      )}
    </Card>
  );
};

/**
 * CompletedProjects Section Component
 */
export default function CompletedProjects() {
  const sectionRef = useRef(null);
  const gridRef = useRef(null);
  const prefersReduced = useReducedMotion();
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  // Scroll reveal triggered once with threshold ~0.15
  const headerInView = useInView(sectionRef, { once: true, amount: 0.15 });
  const gridInView = useInView(gridRef, { once: true, amount: 0.15 });

  // Keep the arrow states in sync with how far the track can actually scroll.
  const updateArrows = useCallback(() => {
    const el = gridRef.current;
    if (!el) return;

    const maxScroll = Math.max(0, el.scrollWidth - el.clientWidth);
    setCanPrev(el.scrollLeft > 1);
    setCanNext(el.scrollLeft < maxScroll - 1);
  }, []);

  useEffect(() => {
    const el = gridRef.current;
    if (!el) return undefined;

    updateArrows();

    const onResize = () => updateArrows();
    window.addEventListener('resize', onResize);

    let observer;
    if (typeof ResizeObserver !== 'undefined') {
      observer = new ResizeObserver(onResize);
      observer.observe(el);
      Array.from(el.children).forEach((child) => observer.observe(child));
    }

    return () => {
      window.removeEventListener('resize', onResize);
      observer?.disconnect();
    };
  }, [updateArrows]);

  // Advance by the real distance between two rendered cards. Card widths are
  // breakpoint-dependent (1, 2, 3 or 4 per view), so measuring adjacent cards
  // keeps the step in sync with whatever width is actually visible.
  const scrollProjects = useCallback(
    (direction) => {
      const el = gridRef.current;
      if (!el || !el.children.length) return;

      const first = el.children[0];
      const second = el.children[1];
      const step = second
        ? second.getBoundingClientRect().left - first.getBoundingClientRect().left
        : first.getBoundingClientRect().width;

      el.scrollBy({
        left: direction * step,
        behavior: prefersReduced ? 'auto' : 'smooth',
      });
    },
    [prefersReduced]
  );

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
      className="relative w-full bg-[#F3F7FF] pt-[40px] pb-[32px] lg:pt-[64px] lg:pb-[40px]"
    >
      <Container>
        {/* Header Row */}
        <motion.div
          initial="hidden"
          animate={headerInView ? 'visible' : 'hidden'}
          variants={headerContainerVariants}
          className="flex flex-col items-center text-center gap-6 mb-12 sm:mb-14 lg:mb-16"
        >
          <div className="max-w-6xl">
            {/* H2 Title */}
            <motion.h2
              id="completed-projects-title"
              variants={fadeUpVariants}
              className="font-sans font-black text-[#092C3E] text-[30px] md:text-section-headline leading-[1.15] tracking-tight mb-4 2xl:whitespace-nowrap"
            >
              Real projects, built and delivered by our learners
            </motion.h2>

            {/* Section intro */}
            <motion.p
              variants={fadeUpVariants}
              className="body-copy mx-auto font-sans text-[16px] md:text-body-l font-normal text-[#3B5566] leading-relaxed max-w-none"
            >
              Explore production software, digital products and community platforms built by
              Zone01 Kisumu apprentices from trading tools and developer infrastructure to
              esports, travel and career technology.
            </motion.p>
          </div>
        </motion.div>

        {/* Cards Grid */}
        <div className="mx-auto w-full max-w-[1600px]">
          <motion.div
            ref={gridRef}
            onScroll={updateArrows}
            initial="hidden"
            animate={gridInView ? 'visible' : 'hidden'}
            variants={gridContainerVariants}
            id="completed-projects-track"
            className="flex snap-x snap-mandatory gap-[28px] overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {PROJECTS.map((project) => (
              <motion.div
                key={project.id}
                variants={fadeUpVariants}
                className="w-[85vw] max-w-[360px] flex-none snap-start sm:w-[calc((100%-28px)/2)] sm:max-w-none lg:w-[calc((100%-56px)/3)] xl:w-[calc((100%-84px)/4)]"
              >
                <ProjectCard project={project} />
              </motion.div>
            ))}
          </motion.div>

          {/* Prev / next controls, kept outside the scroll track so the cards
              stay clickable on every breakpoint. */}
          <div className="mt-6 flex items-center justify-center gap-3 md:mt-8">
            <button
              type="button"
              onClick={() => scrollProjects(-1)}
              disabled={!canPrev}
              aria-label="Previous projects"
              aria-controls="completed-projects-track"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[#D5E3F7] bg-white text-[#0063F9] shadow-[0_8px_24px_-8px_rgba(9,44,62,0.35)] transition duration-200 ease-out hover:bg-[#0063F9] hover:text-white focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#0063F9] focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-[#0063F9] motion-reduce:transition-none md:h-12 md:w-12"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2.5"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <button
              type="button"
              onClick={() => scrollProjects(1)}
              disabled={!canNext}
              aria-label="Next projects"
              aria-controls="completed-projects-track"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[#D5E3F7] bg-white text-[#0063F9] shadow-[0_8px_24px_-8px_rgba(9,44,62,0.35)] transition duration-200 ease-out hover:bg-[#0063F9] hover:text-white focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#0063F9] focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-[#0063F9] motion-reduce:transition-none md:h-12 md:w-12"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2.5"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </Container>
    </section>
  );
}
