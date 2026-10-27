/* eslint-disable react-refresh/only-export-components */
// components/headline-results.jsx
import { useEffect, useRef, useState, useMemo } from 'react';
import { Container } from './layout.jsx';

/**
 * Headline Results Data
 * Configurable data object powering the Headline Results bento grid.
 * All figures, copy, and layout metadata editable in one place.
 */
export const HEADLINE_DATA = {
  header: {
    title: 'Headline results.',
    dateBadge: 'As of August 2026',
  },
  keyOutcome: {
    id: 'employment-rate',
    eyebrow: 'Key outcome',
    numericValue: 89,
    formattedDisplay: '89%',
    label: 'Employment rate',
    sublabel: 'In paid work',
    remainderLabel: 'In training',
    remainderRaw: 11,
    remainderDisplay: '11%',
    theme: 'blue',
  },
  placement: {
    id: 'paid-work',
    eyebrow: 'Placement',
    numericValue: 86,
    formattedDisplay: '86',
    label: 'Apprentices and graduates in paid work',
    totalDots: 97,
    employedDots: 86,
    theme: 'white',
  },
  speed: {
    id: 'time-to-employment',
    eyebrow: 'Speed',
    numericValue: 6,
    prefix: '~',
    suffix: 'weeks',
    formattedDisplay: '~6 weeks',
    label: 'Median time to employment after graduation',
    theme: 'white',
  },
  cohort: {
    id: 'inaugural-cohort',
    eyebrow: 'Cohort',
    numericValue: 97,
    formattedDisplay: '97',
    label: 'Inaugural cohort apprentices',
    theme: 'white',
  },
  demand: {
    id: 'applications-received',
    eyebrow: 'Demand',
    numericValue: 28000,
    hasComma: true,
    suffix: '+',
    formattedDisplay: '28,000+',
    label: 'Applications received',
    theme: 'blue',
  },
  incomeTrajectory: {
    id: 'income-trajectory',
    eyebrow: 'Earnings trajectory',
    badge: '$7,200 average annual income',
    bars: [
      { id: 'intake', value: '$60', raw: 60, heightPct: 24, label: 'At intake' },
      { id: 'first-paid', value: '$320', raw: 320, heightPct: 46, label: 'First paid engagement' },
      { id: 'current-avg', value: '$600', raw: 600, heightPct: 68, label: 'Current average' },
      { id: 'top-earners', value: '$2,500', raw: 2500, heightPct: 100, label: 'Top earners' },
    ],
    theme: 'white',
  },
  genderEquity: {
    id: 'gender-equity',
    eyebrow: 'Gender equity',
    numericValue: 2,
    suffix: ' women',
    formattedDisplay: '2 women',
    label: 'Earning more than $2,300 per month',
    theme: 'blue',
  },
};

/**
 * HeadlineResults
 *
 * Redesigned bento grid for the Impact page:
 * - Perfect row alignment: all cards in each row share identical top and height with consistent gaps
 * - Fixed 28,000+ card caption: reads "Applications received"
 * - Fixed employment rate: 89% (replaces 90%)
 * - Row 1 & 2 Left: Large blue "Key outcome" card (spans 2 columns and 2 rows on desktop) with 89% ring,
 *   Selection card dark-blue grain texture, central number count-up, and 11% light-grey grain dot
 * - Row 1 Right: The 86 card with a 97-dot matrix (86 filled brand blue, 11 outlined) and the ~6 weeks card with sliding timeline
 * - Row 2 Right: The 97 cohort card and the 28,000+ card with a narrowing funnel line from 28,000 to 97
 * - Row 3: Wide income trajectory card with 4 rising bars ($60, $320, $600, $2,500) and "$7,200 average annual income" badge,
 *   plus the "2 women" card with highlighted figure icons
 * - Alternating white and brand-blue aesthetic, subtle grain on blue cards, 24px radius, soft shadows, and hover lift
 * - Single-trigger IntersectionObserver motion with real text rendered from start and full reduced-motion support
 * - Responsive: 12-column desktop bento (lg:), 2 columns on tablet (min-[600px]:), 1 stacked column below 600px
 */
export default function HeadlineResults() {
  const sectionRef = useRef(null);

  // Check prefers-reduced-motion
  const [reducedMotion, setReducedMotion] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
    return false;
  });

  useEffect(() => {
    const rmQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleRmChange = (e) => setReducedMotion(e.matches);
    rmQuery.addEventListener('change', handleRmChange);
    return () => rmQuery.removeEventListener('change', handleRmChange);
  }, []);

  // Motion states: animProgress initialized to 1 so real text is rendered immediately
  const [hasScrolledIn, setHasScrolledIn] = useState(false);
  const [animProgress, setAnimProgress] = useState(1);

  useEffect(() => {
    if (reducedMotion) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setHasScrolledIn(true);
      setAnimProgress(1);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasScrolledIn) {
          setHasScrolledIn(true);
          // Start counting up from 0 to 1
          setAnimProgress(0);

          let rafId = null;
          let startTime = null;
          const duration = 1600; // 1.6s smooth count-up

          const step = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const elapsed = timestamp - startTime;
            const t = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const ease = 1 - Math.pow(1 - t, 3);
            setAnimProgress(ease);

            if (t < 1) {
              rafId = requestAnimationFrame(step);
            } else {
              setAnimProgress(1);
            }
          };

          rafId = requestAnimationFrame(step);

          return () => {
            if (rafId) cancelAnimationFrame(rafId);
          };
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [reducedMotion, hasScrolledIn]);

  // Ring dimensions for Key Outcome Card (89%)
  const RING_RADIUS = 52;
  const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS; // ~326.72
  const targetRingPct = 0.89;
  const ringOffset = RING_CIRCUMFERENCE * (1 - targetRingPct * animProgress);

  // Number values calculated from animation progress
  const employmentDisplay = Math.round(animProgress * HEADLINE_DATA.keyOutcome.numericValue);
  const placementDisplay = Math.round(animProgress * HEADLINE_DATA.placement.numericValue);
  const speedDisplay = Math.max(1, Math.round(animProgress * HEADLINE_DATA.speed.numericValue));
  const cohortDisplay = Math.round(animProgress * HEADLINE_DATA.cohort.numericValue);
  const demandCount = Math.round(animProgress * HEADLINE_DATA.demand.numericValue);
  const demandDisplay = demandCount.toLocaleString('en-US');
  const womenDisplay = Math.round(animProgress * HEADLINE_DATA.genderEquity.numericValue);

  // 97-dot matrix configuration for the 86 Card
  const dotsList = useMemo(() => {
    const list = [];
    const cols = 10;
    const total = 97;
    for (let i = 0; i < total; i++) {
      const col = i % cols;
      const row = Math.floor(i / cols);
      list.push({
        id: i,
        x: col * 15 + 8,
        y: row * 15 + 8,
        isEmployed: i < HEADLINE_DATA.placement.employedDots,
      });
    }
    return list;
  }, []);

  const litDotsCount = Math.floor(animProgress * HEADLINE_DATA.placement.employedDots);

  return (
    <section
      id="headline-results"
      ref={sectionRef}
      data-nav-theme="light"
      aria-labelledby="headline-results-title"
      className="relative w-full bg-campus-bg py-12 sm:py-16 lg:py-20 overflow-hidden"
    >
      <style>{`
        /* Card Reveal Stagger Animation */
        @keyframes headlineCardReveal {
          from {
            opacity: 0;
            transform: translateY(22px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .bento-card {
          opacity: 1;
          transform: translateY(0);
          transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .card-reveal-active {
          animation: headlineCardReveal 0.65s cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        @media (prefers-reduced-motion: reduce) {
          .card-reveal-active {
            animation: none !important;
          }
          .bento-card {
            transition: none !important;
          }
        }

        @media (hover: hover) and (pointer: fine) {
          .bento-card:hover {
            transform: translateY(-4px) !important;
          }
          .bento-card-blue:hover {
            box-shadow: 0 20px 40px -10px rgba(0, 99, 249, 0.42);
          }
          .bento-card-white:hover {
            box-shadow: 0 16px 36px -8px rgba(0, 0, 0, 0.08);
          }
        }
      `}</style>

      {/* Lightweight SVG Grain Filters (aligned with selection-section.jsx) */}
      <svg
        aria-hidden="true"
        className="sr-only absolute pointer-events-none"
        style={{ width: 0, height: 0, position: 'absolute' }}
      >
        <defs>
          {/* Dark circle stipple noise */}
          <filter id="headline-dark-grain" x="0%" y="0%" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.95" numOctaves="4" result="turb" />
            <feColorMatrix
              type="matrix"
              in="turb"
              values="
                0 0 0 0 0
                0 0 0 0 0.35
                0 0 0 0 0.90
                0 0 0 1 0"
              result="colored"
            />
          </filter>

          {/* Light grey circle monochrome grain */}
          <filter id="headline-grey-grain" x="0%" y="0%" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.95" numOctaves="4" result="turb" />
            <feColorMatrix
              type="matrix"
              in="turb"
              values="
                0.33 0.33 0.33 0 0.1
                0.33 0.33 0.33 0 0.1
                0.33 0.33 0.33 0 0.1
                0    0    0    1 0"
              result="mono"
            />
            <feComponentTransfer>
              <feFuncR type="linear" slope="1.8" intercept="-0.25" />
              <feFuncG type="linear" slope="1.8" intercept="-0.25" />
              <feFuncB type="linear" slope="1.8" intercept="-0.25" />
            </feComponentTransfer>
          </filter>
        </defs>
      </svg>

      <Container className="relative z-10">
        <div className="w-full max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-3.5 mb-8 sm:mb-10 lg:mb-12 text-center">
            <h2
              id="headline-results-title"
              className="font-sans font-black text-section-headline text-black-900 tracking-tight leading-tight"
            >
              {HEADLINE_DATA.header.title}
            </h2>
            <span className="inline-flex items-center px-3.5 py-1 rounded-full font-mono font-medium text-body-s tracking-wide bg-primary/10 text-[#0052d4] border border-primary/20 whitespace-nowrap">
              {HEADLINE_DATA.header.dateBadge}
            </span>
          </div>

          {/* Bento Grid: 12-column Desktop (lg:), 2-column Tablet (min-[600px]:), 1-column Mobile below 600px */}
          <div className="grid grid-cols-1 min-[600px]:grid-cols-2 lg:grid-cols-12 gap-4 sm:gap-5 lg:gap-6 auto-rows-fr">
            
            {/* ========================================================================= */}
            {/* ROW 1 & 2 (LEFT): Large Blue "Key outcome" Card (Spans 2 columns & 2 rows on desktop) */}
            {/* ========================================================================= */}
            <div
              tabIndex={0}
              role="region"
              aria-label={`${HEADLINE_DATA.keyOutcome.eyebrow}: ${HEADLINE_DATA.keyOutcome.formattedDisplay} ${HEADLINE_DATA.keyOutcome.label}`}
              style={{ animationDelay: '0ms' }}
              className={`bento-card bento-card-blue min-[600px]:col-span-2 lg:col-span-6 lg:row-span-2 relative overflow-hidden bg-primary rounded-[24px] p-6 sm:p-8 lg:p-10 flex flex-col justify-between shadow-[0_10px_28px_-8px_rgba(0,99,249,0.32)] border border-transparent outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary min-h-[380px] sm:min-h-[440px] lg:min-h-[540px] ${hasScrolledIn ? 'card-reveal-active' : ''}`}
            >
              {/* Cropped Dark Blue Grain Circle (Selection Card convention) */}
              <div
                aria-hidden="true"
                className="absolute rounded-full overflow-hidden pointer-events-none select-none"
                style={{
                  width: '68%',
                  aspectRatio: '1 / 1',
                  right: '-12%',
                  bottom: '-14%',
                  backgroundColor: '#004ABB',
                }}
              >
                <div className="w-full h-full rounded-full relative bg-[#003E9E]">
                  <div
                    className="absolute inset-0 rounded-full"
                    style={{ filter: 'url(#headline-dark-grain)' }}
                  />
                </div>
              </div>

              {/* Small Light Grey Grain Dot for Remainder (11%) */}
              <div
                aria-hidden="true"
                className="absolute rounded-full overflow-hidden pointer-events-none select-none"
                style={{
                  width: '18%',
                  aspectRatio: '1 / 1',
                  right: '18%',
                  bottom: '12%',
                  backgroundColor: '#DFDFDF',
                }}
              >
                <div
                  className="absolute inset-0 rounded-full opacity-85"
                  style={{
                    filter: 'url(#headline-grey-grain)',
                    mixBlendMode: 'multiply',
                  }}
                />
              </div>

              {/* Top Eyebrow */}
              <div className="relative z-10 flex items-center justify-between w-full">
                <span className="font-mono font-semibold text-xs sm:text-[13px] text-white uppercase tracking-wider">
                  {HEADLINE_DATA.keyOutcome.eyebrow}
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/15 border border-white/20 font-mono text-xs text-white font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  Primary Metric
                </span>
              </div>

              {/* Central Graphic: 89% Ring with Display Number in Center */}
              <div className="relative z-10 flex flex-col items-center justify-center my-auto py-4">
                <div className="relative w-36 h-36 sm:w-44 sm:h-44 lg:w-48 lg:h-48 flex items-center justify-center">
                  <svg
                    role="img"
                    aria-label={`Circular progress indicator showing ${employmentDisplay}% employment rate`}
                    className="w-full h-full transform -rotate-90"
                    viewBox="0 0 120 120"
                  >
                    {/* Background track */}
                    <circle
                      cx="60"
                      cy="60"
                      r={RING_RADIUS}
                      stroke="rgba(255, 255, 255, 0.22)"
                      strokeWidth="8"
                      fill="none"
                    />
                    {/* Active filling ring */}
                    <circle
                      cx="60"
                      cy="60"
                      r={RING_RADIUS}
                      stroke="#FFFFFF"
                      strokeWidth="8"
                      strokeLinecap="round"
                      fill="none"
                      strokeDasharray={RING_CIRCUMFERENCE}
                      strokeDashoffset={ringOffset}
                      style={{ willChange: 'stroke-dashoffset' }}
                    />
                  </svg>

                  {/* Centered Number Display */}
                  <div className="absolute inset-0 flex items-center justify-center select-none">
                    <span className="font-sans font-black text-white text-[44px] sm:text-[54px] lg:text-[62px] tracking-tight leading-none">
                      {employmentDisplay}%
                    </span>
                  </div>
                </div>

                {/* Caption beneath ring */}
                <h3 className="font-sans font-black text-white text-xl sm:text-2xl lg:text-3xl mt-4 sm:mt-5 tracking-tight text-center">
                  {HEADLINE_DATA.keyOutcome.label}
                </h3>
                <p className="font-mono font-medium text-xs sm:text-sm text-white text-center mt-1 sm:mt-1.5 max-w-sm">
                  {HEADLINE_DATA.keyOutcome.sublabel}
                </p>
              </div>

              {/* Bottom Legend */}
              <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-white/15">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-white shrink-0" />
                  <span className="font-mono text-xs sm:text-[13px] text-white">
                    89% In paid work (86 apprentices)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#DFDFDF] shrink-0" />
                  <span className="font-mono text-xs sm:text-[13px] text-white">
                    11% In training (11 apprentices)
                  </span>
                </div>
              </div>
            </div>

            {/* ========================================================================= */}
            {/* ROW 1 (RIGHT - 1): The 86 Card with 97-Dot Matrix (86 blue, 11 outlined) */}
            {/* ========================================================================= */}
            <div
              tabIndex={0}
              role="region"
              aria-label={`${HEADLINE_DATA.placement.eyebrow}: ${HEADLINE_DATA.placement.formattedDisplay} ${HEADLINE_DATA.placement.label}`}
              style={{ animationDelay: '80ms' }}
              className={`bento-card bento-card-white min-[600px]:col-span-1 lg:col-span-3 lg:row-span-1 bg-white rounded-[24px] p-5 sm:p-6 flex flex-col justify-between border border-black-900/10 shadow-[0_4px_20px_rgba(0,0,0,0.04)] outline-none focus-visible:ring-2 focus-visible:ring-primary min-h-[250px] ${hasScrolledIn ? 'card-reveal-active' : ''}`}
            >
              {/* Eyebrow */}
              <div className="flex items-center justify-between">
                <span className="font-mono font-semibold text-xs text-primary uppercase tracking-wider">
                  {HEADLINE_DATA.placement.eyebrow}
                </span>
                <span className="font-mono text-[11px] text-black-900/70">
                  86 / 97
                </span>
              </div>

              {/* 97-Dot Matrix Graphic */}
              <div className="my-3 py-1 flex items-center justify-center">
                <svg
                  role="img"
                  aria-label="Matrix of 97 dots representing inaugural apprentices with 86 filled brand blue for employed and 11 outlined for training"
                  viewBox="0 0 156 156"
                  className="w-full max-w-[150px] h-auto overflow-visible select-none"
                >
                  {dotsList.map((dot) => {
                    const isLit = dot.isEmployed && dot.id < litDotsCount;
                    return (
                      <circle
                        key={dot.id}
                        cx={dot.x}
                        cy={dot.y}
                        r="4.2"
                        fill={isLit ? '#0063F9' : 'none'}
                        stroke="#0063F9"
                        strokeWidth={isLit ? '0' : '1.5'}
                        strokeOpacity={isLit ? '1' : '0.4'}
                        style={{
                          transition: 'fill 0.2s ease, opacity 0.2s ease',
                        }}
                      />
                    );
                  })}
                </svg>
              </div>

              {/* Figure & Label */}
              <div>
                <div className="font-sans font-black text-primary text-3xl sm:text-4xl tracking-tight leading-none">
                  {placementDisplay}
                </div>
                <p className="font-mono text-xs sm:text-[13px] text-black-900/80 mt-1.5 leading-snug">
                  {HEADLINE_DATA.placement.label}
                </p>
              </div>
            </div>

            {/* ========================================================================= */}
            {/* ROW 1 (RIGHT - 2): The 6 Weeks Card with Sliding Timeline */}
            {/* ========================================================================= */}
            <div
              tabIndex={0}
              role="region"
              aria-label={`${HEADLINE_DATA.speed.eyebrow}: ${HEADLINE_DATA.speed.formattedDisplay} ${HEADLINE_DATA.speed.label}`}
              style={{ animationDelay: '160ms' }}
              className={`bento-card bento-card-white min-[600px]:col-span-1 lg:col-span-3 lg:row-span-1 bg-white rounded-[24px] p-5 sm:p-6 flex flex-col justify-between border border-black-900/10 shadow-[0_4px_20px_rgba(0,0,0,0.04)] outline-none focus-visible:ring-2 focus-visible:ring-primary min-h-[250px] ${hasScrolledIn ? 'card-reveal-active' : ''}`}
            >
              {/* Eyebrow */}
              <div className="flex items-center justify-between">
                <span className="font-mono font-semibold text-xs text-primary uppercase tracking-wider">
                  {HEADLINE_DATA.speed.eyebrow}
                </span>
                <span className="font-mono text-[11px] text-black-900/70">
                  Weeks to Hire
                </span>
              </div>

              {/* Timeline Graphic */}
              <div className="my-auto py-4">
                <svg
                  role="img"
                  aria-label="Timeline indicator showing 6 weeks median time to employment"
                  viewBox="0 0 160 40"
                  className="w-full h-auto overflow-visible"
                >
                  {/* Track line */}
                  <line
                    x1="10"
                    y1="20"
                    x2="150"
                    y2="20"
                    stroke="rgba(0, 99, 249, 0.18)"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                  {/* Tick Marks */}
                  <line x1="10" y1="14" x2="10" y2="26" stroke="rgba(0, 99, 249, 0.35)" strokeWidth="2" />
                  <line x1="80" y1="15" x2="80" y2="25" stroke="rgba(0, 99, 249, 0.35)" strokeWidth="2" />
                  <line x1="150" y1="14" x2="150" y2="26" stroke="rgba(0, 99, 249, 0.35)" strokeWidth="2" />
                  {/* Active drawn line to 6 weeks (~50%) */}
                  <line
                    x1="10"
                    y1="20"
                    x2={10 + 70 * animProgress}
                    y2="20"
                    stroke="#0063F9"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />
                  {/* Sliding dot */}
                  <circle
                    cx={10 + 70 * animProgress}
                    cy="20"
                    r="5"
                    fill="#0063F9"
                  />
                  <circle
                    cx={10 + 70 * animProgress}
                    cy="20"
                    r="9"
                    fill="#0063F9"
                    opacity="0.25"
                  />
                </svg>
                <div className="flex justify-between font-mono text-[10px] text-black-900/70 px-1 mt-1">
                  <span>Day 0</span>
                  <span className="font-bold text-primary">~6 wks</span>
                  <span>12 wks</span>
                </div>
              </div>

              {/* Figure & Label */}
              <div>
                <div className="font-sans font-black text-primary text-3xl sm:text-4xl tracking-tight leading-none">
                  ~{speedDisplay} <span className="text-xl font-bold">weeks</span>
                </div>
                <p className="font-mono text-xs sm:text-[13px] text-black-900/80 mt-1.5 leading-snug">
                  {HEADLINE_DATA.speed.label}
                </p>
              </div>
            </div>

            {/* ========================================================================= */}
            {/* ROW 2 (RIGHT - 1): The 97 Cohort Card */}
            {/* ========================================================================= */}
            <div
              tabIndex={0}
              role="region"
              aria-label={`${HEADLINE_DATA.cohort.eyebrow}: ${HEADLINE_DATA.cohort.formattedDisplay} ${HEADLINE_DATA.cohort.label}`}
              style={{ animationDelay: '240ms' }}
              className={`bento-card bento-card-white min-[600px]:col-span-1 lg:col-span-3 lg:row-span-1 bg-white rounded-[24px] p-5 sm:p-6 flex flex-col justify-between border border-black-900/10 shadow-[0_4px_20px_rgba(0,0,0,0.04)] outline-none focus-visible:ring-2 focus-visible:ring-primary min-h-[250px] ${hasScrolledIn ? 'card-reveal-active' : ''}`}
            >
              {/* Eyebrow */}
              <div className="flex items-center justify-between">
                <span className="font-mono font-semibold text-xs text-primary uppercase tracking-wider">
                  {HEADLINE_DATA.cohort.eyebrow}
                </span>
                <span className="font-mono text-[11px] text-black-900/70">
                  Cohort 1
                </span>
              </div>

              {/* Cohort Graphic: Staged concentric circles */}
              <div className="my-auto py-3 flex items-center justify-center">
                <div
                  role="img"
                  aria-label="Concentric circle badge for inaugural cohort of 97 apprentices"
                  className="relative w-20 h-20 flex items-center justify-center"
                >
                  <div className="absolute inset-0 rounded-full border-2 border-dashed border-primary/25 animate-[spin_30s_linear_infinite]" />
                  <div className="w-14 h-14 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                    <span className="font-sans font-black text-primary text-xl">
                      97
                    </span>
                  </div>
                </div>
              </div>

              {/* Figure & Label */}
              <div>
                <div className="font-sans font-black text-primary text-3xl sm:text-4xl tracking-tight leading-none">
                  {cohortDisplay}
                </div>
                <p className="font-mono text-xs sm:text-[13px] text-black-900/80 mt-1.5 leading-snug">
                  {HEADLINE_DATA.cohort.label}
                </p>
              </div>
            </div>

            {/* ========================================================================= */}
            {/* ROW 2 (RIGHT - 2): The 28,000+ Card with Funnel Line (Narrowing to 97) */}
            {/* ========================================================================= */}
            <div
              tabIndex={0}
              role="region"
              aria-label={`${HEADLINE_DATA.demand.eyebrow}: ${HEADLINE_DATA.demand.formattedDisplay} ${HEADLINE_DATA.demand.label}`}
              style={{ animationDelay: '320ms' }}
              className={`bento-card bento-card-blue min-[600px]:col-span-1 lg:col-span-3 lg:row-span-1 bg-primary rounded-[24px] p-5 sm:p-6 flex flex-col justify-between shadow-[0_10px_28px_-8px_rgba(0,99,249,0.32)] border border-transparent outline-none focus-visible:ring-2 focus-visible:ring-primary text-white min-h-[250px] relative overflow-hidden ${hasScrolledIn ? 'card-reveal-active' : ''}`}
            >
              {/* Subtle grain texture overlay */}
              <div
                aria-hidden="true"
                className="absolute inset-0 opacity-[0.14] pointer-events-none select-none rounded-[24px]"
                style={{ filter: 'url(#headline-dark-grain)' }}
              />

              {/* Eyebrow */}
              <div className="relative z-10 flex items-center justify-between">
                <span className="font-mono font-semibold text-xs text-white uppercase tracking-wider">
                  {HEADLINE_DATA.demand.eyebrow}
                </span>
                <span className="font-mono text-[11px] text-white">
                  Top 0.35%
                </span>
              </div>

              {/* Funnel Line Graphic: 28,000 tapering down to 97 */}
              <div className="relative z-10 my-auto py-2">
                <svg
                  role="img"
                  aria-label="Funnel graph showing 28,000+ applicants tapering down to 97 cohort apprentices"
                  viewBox="0 0 160 50"
                  className="w-full h-auto overflow-visible"
                >
                  {/* Top wide line */}
                  <line x1="20" y1="8" x2="140" y2="8" stroke="rgba(255, 255, 255, 0.4)" strokeWidth="2" strokeDasharray="3 3" />
                  <text x="20" y="5" fill="rgba(255, 255, 255, 0.75)" fontSize="9" fontFamily="monospace">28k</text>
                  <text x="140" y="5" textAnchor="end" fill="rgba(255, 255, 255, 0.75)" fontSize="9" fontFamily="monospace">Apps</text>
                  
                  {/* Tapered funnel curves */}
                  <path
                    d="M 20,10 C 60,10 70,36 74,42"
                    stroke="#FFFFFF"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    fill="none"
                    strokeDasharray={80}
                    strokeDashoffset={80 * (1 - animProgress)}
                  />
                  <path
                    d="M 140,10 C 100,10 90,36 86,42"
                    stroke="#FFFFFF"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    fill="none"
                    strokeDasharray={80}
                    strokeDashoffset={80 * (1 - animProgress)}
                  />

                  {/* Narrow base: 97 cohort */}
                  <circle cx="80" cy="42" r="4.5" fill="#FFFFFF" />
                  <text x="80" y="49" textAnchor="middle" fill="#FFFFFF" fontSize="8" fontFamily="monospace" fontWeight="bold">97</text>
                </svg>
              </div>

              {/* Figure & Label */}
              <div className="relative z-10">
                <div className="font-sans font-black text-white text-3xl sm:text-4xl tracking-tight leading-none">
                  {demandDisplay}+
                </div>
                <p className="font-mono text-xs sm:text-[13px] text-white mt-1.5 leading-snug">
                  {HEADLINE_DATA.demand.label}
                </p>
              </div>
            </div>

            {/* ========================================================================= */}
            {/* ROW 3 (LEFT): Wide Income Card with 4 Rising Bars & $7,200 Badge */}
            {/* ========================================================================= */}
            <div
              tabIndex={0}
              role="region"
              aria-label={`${HEADLINE_DATA.incomeTrajectory.eyebrow}: ${HEADLINE_DATA.incomeTrajectory.badge}`}
              style={{ animationDelay: '400ms' }}
              className={`bento-card bento-card-white min-[600px]:col-span-2 lg:col-span-8 bg-white rounded-[24px] p-6 sm:p-7 lg:p-8 flex flex-col justify-between border border-black-900/10 shadow-[0_4px_20px_rgba(0,0,0,0.04)] outline-none focus-visible:ring-2 focus-visible:ring-primary min-h-[300px] ${hasScrolledIn ? 'card-reveal-active' : ''}`}
            >
              {/* Header with Eyebrow and Badge */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="font-mono font-semibold text-xs sm:text-[13px] text-primary uppercase tracking-wider">
                  {HEADLINE_DATA.incomeTrajectory.eyebrow}
                </span>
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-primary/10 text-[#0052d4] border border-primary/20 font-mono font-bold text-xs sm:text-sm">
                  <span className="w-2 h-2 rounded-full bg-primary" />
                  {HEADLINE_DATA.incomeTrajectory.badge}
                </span>
              </div>

              {/* Four Rising Bars Graphic */}
              <div className="my-auto pt-6 pb-2">
                <div
                  role="img"
                  aria-label="Bar chart showing income growth across four milestones: $60 at intake, $320 first paid engagement, $600 current average, $2,500 top earners"
                  className="grid grid-cols-4 gap-2 sm:gap-4 md:gap-6 items-end h-[160px] sm:h-[180px] w-full border-b border-black-900/10 pb-2"
                >
                  {HEADLINE_DATA.incomeTrajectory.bars.map((bar, i) => {
                    const barScale = animProgress;
                    return (
                      <div key={bar.id} className="flex flex-col items-center h-full justify-end">
                        {/* Numerical value on top of bar */}
                        <span className="font-sans font-black text-black-900 text-sm sm:text-base md:text-lg mb-2">
                          {bar.value}
                        </span>

                        {/* Bar column that grows from baseline */}
                        <div className="w-full max-w-[64px] sm:max-w-[76px] lg:max-w-[88px] bg-primary/10 rounded-t-lg relative overflow-hidden flex items-end" style={{ height: `${bar.heightPct}%` }}>
                          <div
                            className="w-full rounded-t-lg bg-gradient-to-t from-primary to-[#3A86FA] transition-all duration-700 ease-out"
                            style={{
                              height: '100%',
                              transformOrigin: 'bottom',
                              transform: `scaleY(${barScale})`,
                              transitionDelay: `${i * 120}ms`,
                            }}
                          />
                        </div>

                        {/* Label beneath baseline with clean wrapping and no truncation */}
                        <div className="min-h-[34px] sm:min-h-[38px] flex items-start justify-center mt-2.5">
                          <span className="font-mono text-[10px] sm:text-xs text-black-900/70 text-center leading-tight">
                            {bar.label}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Bottom Explanatory Note */}
              <p className="font-mono text-xs text-black-900/70 mt-3">
                Tracking monthly earnings progression from student enrollment to full-time career placement.
              </p>
            </div>

            {/* ========================================================================= */}
            {/* ROW 3 (RIGHT): "2 Women" Card with Highlighted Figure Icons */}
            {/* ========================================================================= */}
            <div
              tabIndex={0}
              role="region"
              aria-label={`${HEADLINE_DATA.genderEquity.eyebrow}: ${HEADLINE_DATA.genderEquity.formattedDisplay} ${HEADLINE_DATA.genderEquity.label}`}
              style={{ animationDelay: '480ms' }}
              className={`bento-card bento-card-blue min-[600px]:col-span-2 lg:col-span-4 bg-primary rounded-[24px] p-6 sm:p-7 lg:p-8 flex flex-col justify-between shadow-[0_10px_28px_-8px_rgba(0,99,249,0.32)] border border-transparent outline-none focus-visible:ring-2 focus-visible:ring-primary text-white min-h-[300px] relative overflow-hidden ${hasScrolledIn ? 'card-reveal-active' : ''}`}
            >
              {/* Subtle grain texture overlay */}
              <div
                aria-hidden="true"
                className="absolute inset-0 opacity-[0.14] pointer-events-none select-none rounded-[24px]"
                style={{ filter: 'url(#headline-dark-grain)' }}
              />

              {/* Eyebrow */}
              <div className="relative z-10 flex items-center justify-between">
                <span className="font-mono font-semibold text-xs sm:text-[13px] text-white uppercase tracking-wider">
                  {HEADLINE_DATA.genderEquity.eyebrow}
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-black/15 text-white font-mono text-[11px]">
                  Top 2%
                </span>
              </div>

              {/* Two Highlighted Figure Icons */}
              <div
                role="img"
                aria-label="Two highlighted figure icons indicating women high earners"
                className="relative z-10 my-auto py-4 flex items-center justify-center gap-6"
              >
                {[1, 2].map((num) => (
                  <div
                    key={num}
                    className="relative flex flex-col items-center group"
                  >
                    <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl bg-white/15 backdrop-blur-xs border border-white/25 flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-110">
                      <svg
                        viewBox="0 0 24 24"
                        className="w-9 h-9 sm:w-10 sm:h-10 fill-white"
                        aria-hidden="true"
                      >
                        <path d="M12 2a5 5 0 1 0 5 5 5 5 0 0 0-5-5zm0 12c-4.42 0-8 2.24-8 5v2a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-2c0-2.76-3.58-5-8-5z" />
                      </svg>
                    </div>
                    <span className="w-2 h-2 rounded-full bg-[#35D6B4] mt-2 shadow-[0_0_8px_#35D6B4]" />
                  </div>
                ))}
              </div>

              {/* Figure & Label */}
              <div className="relative z-10">
                <div className="font-sans font-black text-white text-3xl sm:text-4xl tracking-tight leading-none">
                  {womenDisplay} <span className="text-2xl font-bold">women</span>
                </div>
                <p className="font-mono text-xs sm:text-sm text-white mt-2 leading-snug">
                  {HEADLINE_DATA.genderEquity.label}
                </p>
              </div>
            </div>

          </div>
        </div>
      </Container>
    </section>
  );
}
