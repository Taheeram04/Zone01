// components/impact-hero.jsx
import { useEffect, useRef, useState, useMemo } from 'react';
import { Container } from './layout.jsx';
import impact1 from '../assets/impact.png';
import impact2 from '../assets/impact2.jpeg';
import impact3 from '../assets/impact3.jpg';
import ImpactCrossZoom from './impact-cross-zoom.jsx';

/**
 * Impact Statistics Data
 * Configurable data object powering the hero stat row.
 */
export const IMPACT_STATS = [
  {
    id: 'paid-work',
    numericValue: 89,
    prefix: '',
    suffix: '%',
    formattedDisplay: '89%',
    label: 'In paid work',
    type: 'ring',
  },
  {
    id: 'average-income',
    numericValue: 7200,
    prefix: 'USD',
    suffix: '',
    hasComma: true,
    formattedDisplay: 'USD 7,200',
    label: 'Average annual income',
    type: 'rising-line',
  },
  {
    id: 'time-to-employment',
    numericValue: 6,
    prefix: '~',
    suffix: 'weeks',
    formattedDisplay: '~6 weeks',
    label: 'Median time to employment after graduation',
    type: 'timeline',
  },
];

export const STATS_NOTE = 'As of August 2026';

export const APPRENTICE_DATA = {
  total: 97,
  employed: 86,
  unplaced: 11,
  label: '86 of 97 apprentices in paid work',
};

const IMPACT_IMAGES = [
  {
    src: impact1,
    alt: 'Zone01 Kisumu learners engaged in collaborative peer-to-peer coding',
  },
  {
    src: impact2,
    alt: 'Zone01 Kisumu students focused on projects at their workstations',
  },
  {
    src: impact3,
    alt: 'Zone01 Kisumu coding campus community and tech leaders',
  },
];

// Precompute exactly 97 points in phyllotaxis spiral (Fermat's spiral with golden angle)
const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5)); // ~2.39996323 rad (137.507764 deg)

function generatePhyllotaxisDots() {
  const dots = [];
  const cx = 200;
  const cy = 200;
  const maxR = 170;
  const c = maxR / Math.sqrt(APPRENTICE_DATA.total - 0.5);

  for (let i = 0; i < APPRENTICE_DATA.total; i++) {
    const r = c * Math.sqrt(i + 0.6);
    const theta = i * GOLDEN_ANGLE;
    const x = cx + r * Math.cos(theta);
    const y = cy + r * Math.sin(theta);
    dots.push({
      id: i,
      x: Number(x.toFixed(1)),
      y: Number(y.toFixed(1)),
      isLitTarget: i < APPRENTICE_DATA.employed, // first 86 lit, last 11 hollow
    });
  }
  return dots;
}

/**
 * ImpactHero
 *
 * Hero section for the "Our Impact" page based on Figma designs and specifications:
 * - Electric blue background (#0063F9) with faint dot grid shifting toward cursor on desktop
 * - Staggered reveal for "Our" and "Impact"
 * - Tagline "Potential was never the problem, access was."
 * - Prominent Hero Photograph Card with the overlapping "RESULTS, NOT RHETORIC" card from impacthero.png,
 *   smoothly transitioning between impact.png, impact2.jpeg, and impact3.jpg via ImpactCrossZoom
 * - Centrepiece: Spiral phyllotaxis field of exactly 97 dots with sweeping sequence (86 lit, 11 hollow),
 *   subtle shimmer wave, gentle rotation, and hover tooltips
 * - Single stat row along the lower part with heavy display numerals and monospace captions
 * - 89% ring self-drawing to exactly 89% in step with apprentice counter
 * - Large dark-blue grain circle drifting behind the photo card
 * - Fully responsive: 2-column top + bottom stats on desktop; gracefully stacked on tablet and mobile
 */
export default function ImpactHero() {
  const sectionRef = useRef(null);
  const dots = useMemo(() => generatePhyllotaxisDots(), []);

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

  // Track inView and isRevealed (default to revealed on mount to prevent any invisible content flash)
  const [inView, setInView] = useState(true);
  const [isRevealed, setIsRevealed] = useState(true);

  useEffect(() => {
    if (reducedMotion) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
      },
      { threshold: 0.05 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [reducedMotion]);

  // Subtle scroll parallax tracking (active only when in view and motion allowed)
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    if (reducedMotion || !inView) return;

    let rafId = null;
    const handleScroll = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        rafId = null;
        setScrollY(window.scrollY);
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [reducedMotion, inView]);

  // Desktop dot grid cursor shift
  const [cursorOffset, setCursorOffset] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    if (reducedMotion || !inView || !sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const normX = Math.max(-1, Math.min(1, (e.clientX - centerX) / (rect.width / 2)));
    const normY = Math.max(-1, Math.min(1, (e.clientY - centerY) / (rect.height / 2)));
    setCursorOffset({
      x: Number((normX * 8).toFixed(1)),
      y: Number((normY * 8).toFixed(1)),
    });
  };

  const handleMouseLeave = () => {
    setCursorOffset({ x: 0, y: 0 });
  };

  // Sweeping phyllotaxis and stat 1 progress over 2.4s
  const [sweepProgress, setSweepProgress] = useState(() => (reducedMotion ? 1 : 0));
  const [stat2Progress, setStat2Progress] = useState(() => (reducedMotion ? 1 : 0));
  const [stat3Progress, setStat3Progress] = useState(() => (reducedMotion ? 1 : 0));
  const [isCompleted, setIsCompleted] = useState(() => reducedMotion);

  useEffect(() => {
    if (reducedMotion) {
      setSweepProgress(1);
      setStat2Progress(1);
      setStat3Progress(1);
      setIsCompleted(true);
      return;
    }

    let rafId1, rafId2, rafId3;

    // 1. Stat 1 & 97-dot spiral sweep
    const timer1 = setTimeout(() => {
      let startTime = null;
      const duration = 2400;
      const step1 = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const t = Math.min(elapsed / duration, 1);
        const ease = 1 - Math.pow(1 - t, 2.5);
        setSweepProgress(ease);
        if (t < 1) {
          rafId1 = requestAnimationFrame(step1);
        } else {
          setSweepProgress(1);
          setIsCompleted(true);
        }
      };
      rafId1 = requestAnimationFrame(step1);
    }, 250);

    // 2. Stat 2 (income)
    const timer2 = setTimeout(() => {
      let startTime = null;
      const duration = 2000;
      const step2 = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const t = Math.min(elapsed / duration, 1);
        const ease = 1 - Math.pow(1 - t, 2.8);
        setStat2Progress(ease);
        if (t < 1) {
          rafId2 = requestAnimationFrame(step2);
        } else {
          setStat2Progress(1);
        }
      };
      rafId2 = requestAnimationFrame(step2);
    }, 450);

    // 3. Stat 3 (timeline)
    const timer3 = setTimeout(() => {
      let startTime = null;
      const duration = 1800;
      const step3 = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const t = Math.min(elapsed / duration, 1);
        const ease = 1 - Math.pow(1 - t, 2.8);
        setStat3Progress(ease);
        if (t < 1) {
          rafId3 = requestAnimationFrame(step3);
        } else {
          setStat3Progress(1);
        }
      };
      rafId3 = requestAnimationFrame(step3);
    }, 600);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      if (rafId1) cancelAnimationFrame(rafId1);
      if (rafId2) cancelAnimationFrame(rafId2);
      if (rafId3) cancelAnimationFrame(rafId3);
    };
  }, [reducedMotion]);

  // Current count of lit dots during sweeping entrance (0 to 86)
  const litCount = reducedMotion ? APPRENTICE_DATA.employed : Math.floor(sweepProgress * APPRENTICE_DATA.employed);

  // Parallax translation values
  const photoParallax = reducedMotion ? 0 : Math.max(-16, Math.min(16, scrollY * 0.025));

  // 89% Ring constants
  const RING_RADIUS = 26;
  const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS; // ~163.36
  const ringOffset = reducedMotion
    ? RING_CIRCUMFERENCE * (1 - 0.89)
    : RING_CIRCUMFERENCE - RING_CIRCUMFERENCE * 0.89 * sweepProgress;

  return (
    <section
      ref={sectionRef}
      data-nav-theme="dark"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full min-h-[calc(100vh-4.5rem)] lg:min-h-[calc(100svh-4.5rem)] bg-primary overflow-hidden flex flex-col justify-between pt-20 pb-8 sm:pt-24 sm:pb-10"
    >
      <style>{`
        @keyframes spiral-rotation {
          0% { transform: rotate(-4deg); }
          50% { transform: rotate(4deg); }
          100% { transform: rotate(-4deg); }
        }
        @keyframes dot-shimmer {
          0% { opacity: 0.85; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.15); filter: drop-shadow(0 0 3px rgba(255,255,255,0.75)); }
          100% { opacity: 0.85; transform: scale(1); }
        }
        @keyframes photo-reveal {
          from {
            opacity: 0;
            transform: translateX(24px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes tab-slide {
          from {
            opacity: 0;
            transform: translateY(-50%) translateX(-24px);
          }
          to {
            opacity: 1;
            transform: translateY(-50%) translateX(0);
          }
        }
      `}</style>

      {/* Faint dot grid drifting toward cursor, desktop only */}
      <div
        aria-hidden="true"
        className="hidden lg:block absolute inset-0 pointer-events-none select-none z-0 overflow-hidden"
      >
        <div
          className="absolute inset-[-40px] transition-transform duration-300 ease-out"
          style={{
            backgroundImage:
              'radial-gradient(circle, rgba(255, 255, 255, 0.14) 1.25px, transparent 1.25px)',
            backgroundSize: '32px 32px',
            transform: reducedMotion
              ? 'none'
              : `translate3d(${cursorOffset.x}px, ${cursorOffset.y}px, 0)`,
            maskImage:
              'radial-gradient(ellipse at center, rgba(0,0,0,0.7) 35%, rgba(0,0,0,0) 80%)',
            WebkitMaskImage:
              'radial-gradient(ellipse at center, rgba(0,0,0,0.7) 35%, rgba(0,0,0,0) 80%)',
          }}
        />
      </div>

      <Container className="relative z-10 w-full flex-1 flex flex-col justify-between">
        {/* Main Hero Area: Responsive Grid */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-x-12 lg:gap-y-6 items-center pt-2 sm:pt-4">
          
          {/* 1. Heading & Tagline: order-1 on mobile, top-left on desktop */}
          <div className="order-1 lg:col-span-6 flex flex-col justify-center w-full">
            <h1 className="font-sans font-black tracking-tight leading-[1.05] text-[clamp(2.25rem,6vw,5.25rem)] select-none">
              <span className="text-white">Our </span>
              <span className="text-black-900">Impact</span>
            </h1>

          </div>

          {/* 2. Hero Photograph Card: order-2 on mobile, right column spanning rows on desktop */}
          <div className="order-2 lg:order-2 lg:col-span-6 lg:row-span-2 lg:col-start-7 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-[460px] sm:max-w-[520px] lg:max-w-[540px] xl:max-w-[620px] 2xl:max-w-[680px] mx-auto lg:mr-0">
              
              {/* Photo Card: maintains aspect ratio (752/858), rounded corners, shadow, and smooth transitions */}
              <div
                className="relative z-0 isolate overflow-hidden rounded-[26px] sm:rounded-[36px] xl:rounded-[42px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.35)] aspect-[752/858] w-full"
                style={{
                  transform: `translate3d(0, ${photoParallax}px, 0)`,
                  animation: reducedMotion ? 'none' : 'photo-reveal 0.9s cubic-bezier(0.16,1,0.3,1) both',
                  willChange: 'transform',
                }}
              >
                <ImpactCrossZoom
                  images={IMPACT_IMAGES}
                  holdTime={5}
                  duration={2.2}
                  fadeEase="power2.inOut"
                  zoomEase="power2.inOut"
                />
              </div>

              {/* Slogan Tab: "RESULTS, NOT RHETORIC" card layered on/above the photo card from impacthero.png */}
              <div
                className="absolute top-[42%] -translate-y-1/2 -left-3 sm:-left-6 md:-left-8 lg:-left-10 xl:-left-14 z-30 bg-primary rounded-r-[20px] sm:rounded-r-[28px] xl:rounded-r-[36px] py-5 sm:py-8 md:py-10 xl:py-14 pl-3 sm:pl-6 md:pl-8 xl:pl-10 pr-4 sm:pr-7 md:pr-9 xl:pr-11 flex flex-col justify-center select-none pointer-events-none"
                style={{
                  animation: reducedMotion ? 'none' : 'tab-slide 0.8s cubic-bezier(0.16,1,0.3,1) 0.15s both',
                  willChange: 'transform, opacity',
                }}
              >
                {/* Slogan Typography */}
                <div className="font-sans font-black text-white text-xs sm:text-base md:text-lg lg:text-[22px] xl:text-[27px] leading-[1.12] tracking-tight uppercase whitespace-nowrap">
                  <p>RESULTS,</p>
                  <p>NOT</p>
                  <p>RHETORIC</p>
                </div>
              </div>

            </div>
          </div>

          {/* 3. Centrepiece: Spiral phyllotaxis field of 97 dots: order-3 on mobile, bottom-left on desktop */}
          <div className="order-3 lg:order-3 lg:col-span-6 pt-4 lg:pt-2 border-t border-white/15 lg:border-t-0 flex flex-col sm:flex-row items-center sm:items-center gap-5 sm:gap-6">
            {/* Dot Spiral Graphic */}
            <div
              role="img"
              aria-label={APPRENTICE_DATA.label}
              className="relative flex items-center justify-center w-[160px] h-[160px] sm:w-[180px] sm:h-[180px] lg:w-[200px] lg:h-[200px] shrink-0"
            >
              <svg
                viewBox="0 0 400 400"
                className="w-full h-full overflow-visible select-none"
              >
                <g
                  style={{
                    transformOrigin: '200px 200px',
                    animation: isCompleted && !reducedMotion
                      ? 'spiral-rotation 24s ease-in-out infinite'
                      : 'none',
                    animationPlayState: inView ? 'running' : 'paused',
                  }}
                >
                  {dots.map((dot) => {
                    const isLit = dot.isLitTarget && (reducedMotion || dot.id < litCount);
                    const isHollow = !dot.isLitTarget;

                    return (
                      <g
                        key={dot.id}
                        className="cursor-pointer group transition-transform duration-200 hover:scale-150"
                        style={{
                          transformOrigin: `${dot.x}px ${dot.y}px`,
                        }}
                      >
                        {isLit ? (
                          <circle
                            cx={dot.x}
                            cy={dot.y}
                            r="4.2"
                            fill="#FFFFFF"
                            style={{
                              animation: isCompleted && !reducedMotion
                                ? 'dot-shimmer 3.5s ease-in-out infinite'
                                : 'none',
                              animationDelay: `${(dot.id * 38) % 3500}ms`,
                              animationPlayState: inView ? 'running' : 'paused',
                              transformOrigin: `${dot.x}px ${dot.y}px`,
                              transition: 'fill 0.25s ease, opacity 0.25s ease',
                            }}
                          />
                        ) : isHollow ? (
                          <circle
                            cx={dot.x}
                            cy={dot.y}
                            r="4.2"
                            stroke="rgba(255, 255, 255, 0.65)"
                            strokeWidth="1.5"
                            fill="none"
                          />
                        ) : (
                          <circle
                            cx={dot.x}
                            cy={dot.y}
                            r="4.2"
                            fill="rgba(255, 255, 255, 0.18)"
                          />
                        )}
                        <title>
                          {dot.isLitTarget
                            ? `Apprentice #${dot.id + 1}: In paid work (86 of 97)`
                            : `Apprentice #${dot.id + 1}: In training / transition (11 hollow outlines)`}
                        </title>
                      </g>
                    );
                  })}
                </g>
              </svg>
            </div>

            {/* Monospace Badge & Legend */}
            <div className="flex flex-col items-center sm:items-start text-center sm:text-left gap-2">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-xs border border-white/15 select-none shadow-xs">
                <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                <span className="font-mono text-xs sm:text-[13px] text-white/95 tracking-wide font-medium">
                  {APPRENTICE_DATA.label}
                </span>
              </div>
              <p className="font-sans text-xs sm:text-sm text-white leading-relaxed max-w-[280px]">
                86 employed in tech, 11 progressing in advanced training. Exactly 97 lives transformed.
              </p>
            </div>
          </div>

        </div>

        {/* 4. Bottom Full-Width Stat Row */}
        <div className="w-full pt-8 sm:pt-10 lg:pt-12 mt-8 lg:mt-10 border-t border-white/15">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-6 lg:gap-12 xl:gap-16 w-full items-start">
            
            {/* Stat 1: 89% In paid work with 89% filling ring */}
            <div
              className="flex flex-col justify-start"
              role="group"
              aria-label={`${IMPACT_STATS[0].label}: ${IMPACT_STATS[0].formattedDisplay}`}
            >
              <div className="h-12 sm:h-14 flex items-center mb-2 sm:mb-3">
                <svg
                  className="w-12 h-12 sm:w-14 sm:h-14"
                  viewBox="0 0 64 64"
                  aria-hidden="true"
                >
                  {/* Background track */}
                  <circle
                    cx="32"
                    cy="32"
                    r={RING_RADIUS}
                    stroke="rgba(255, 255, 255, 0.25)"
                    strokeWidth="5"
                    fill="none"
                  />
                  {/* Self-drawing active ring filling to exactly 89% */}
                  <circle
                    cx="32"
                    cy="32"
                    r={RING_RADIUS}
                    stroke="#FFFFFF"
                    strokeWidth="5"
                    strokeLinecap="round"
                    fill="none"
                    strokeDasharray={RING_CIRCUMFERENCE}
                    strokeDashoffset={ringOffset}
                    transform="rotate(-90 32 32)"
                    style={{ willChange: 'stroke-dashoffset' }}
                  />
                </svg>
              </div>

              {/* Display Numeral: heavy display type */}
              <div
                className="font-sans font-black tracking-tight leading-none text-white text-[clamp(48px,6vw,96px)] whitespace-nowrap"
                aria-label={IMPACT_STATS[0].formattedDisplay}
              >
                {reducedMotion
                  ? IMPACT_STATS[0].formattedDisplay
                  : `${Math.round(sweepProgress * IMPACT_STATS[0].numericValue)}%`}
              </div>

              {/* Caption: 16 to 18px monospace */}
              <p className="font-mono text-[16px] sm:text-[17px] md:text-[18px] text-white leading-snug tracking-tight mt-3 sm:mt-4 max-w-[280px]">
                {IMPACT_STATS[0].label}
              </p>
            </div>

            {/* Stat 2: USD 7,200 Average annual income with rising line */}
            <div
              className="flex flex-col justify-start"
              role="group"
              aria-label={`${IMPACT_STATS[1].label}: ${IMPACT_STATS[1].formattedDisplay}`}
            >
              <div className="h-12 sm:h-14 flex items-center mb-2 sm:mb-3">
                <svg
                  className="w-16 h-10 sm:w-20 sm:h-11"
                  viewBox="0 0 76 40"
                  aria-hidden="true"
                >
                  {/* Baseline guide */}
                  <line
                    x1="4"
                    y1="34"
                    x2="72"
                    y2="34"
                    stroke="rgba(255, 255, 255, 0.2)"
                    strokeWidth="1.5"
                    strokeDasharray="3 3"
                  />
                  {/* Self-drawing rising trend curve */}
                  <path
                    d="M 6,32 C 24,32 34,22 48,14 S 62,8 70,6"
                    stroke="#FFFFFF"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    fill="none"
                    strokeDasharray={75}
                    strokeDashoffset={reducedMotion ? 0 : 75 * (1 - stat2Progress)}
                    style={{ willChange: 'stroke-dashoffset' }}
                  />
                  {/* Endpoint peak dot */}
                  <circle
                    cx="70"
                    cy="6"
                    r="3.5"
                    fill="#FFFFFF"
                    style={{
                      opacity: reducedMotion || stat2Progress > 0.8 ? 1 : 0,
                      transition: 'opacity 0.2s ease',
                    }}
                  />
                </svg>
              </div>

              {/* Display Numeral */}
              <div
                className="flex flex-wrap items-baseline font-sans font-black tracking-tight leading-none text-white text-[clamp(48px,6vw,96px)]"
                aria-label={IMPACT_STATS[1].formattedDisplay}
              >
                <span className="text-[0.45em] font-extrabold text-white mr-2 tracking-normal align-baseline">
                  USD
                </span>
                <span>
                  {reducedMotion
                    ? '7,200'
                    : Math.round(stat2Progress * IMPACT_STATS[1].numericValue).toLocaleString('en-US')}
                </span>
              </div>

              {/* Caption */}
              <p className="font-mono text-[16px] sm:text-[17px] md:text-[18px] text-white leading-snug tracking-tight mt-3 sm:mt-4 max-w-[280px]">
                {IMPACT_STATS[1].label}
              </p>
            </div>

            {/* Stat 3: ~6 weeks Median time to employment after graduation with timeline */}
            <div
              className="flex flex-col justify-start"
              role="group"
              aria-label={`${IMPACT_STATS[2].label}: ${IMPACT_STATS[2].formattedDisplay}`}
            >
              <div className="h-12 sm:h-14 flex items-center mb-2 sm:mb-3">
                <svg
                  className="w-20 h-8 sm:w-24 sm:h-9"
                  viewBox="0 0 84 28"
                  aria-hidden="true"
                >
                  {/* Track line */}
                  <line
                    x1="6"
                    y1="14"
                    x2="78"
                    y2="14"
                    stroke="rgba(255, 255, 255, 0.22)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                  {/* Tick marks */}
                  <line x1="6" y1="9" x2="6" y2="19" stroke="rgba(255, 255, 255, 0.35)" strokeWidth="2" />
                  <line x1="42" y1="10" x2="42" y2="18" stroke="rgba(255, 255, 255, 0.35)" strokeWidth="2" />
                  <line x1="78" y1="9" x2="78" y2="19" stroke="rgba(255, 255, 255, 0.35)" strokeWidth="2" />
                  {/* Active filled line up to the dot */}
                  <line
                    x1="6"
                    y1="14"
                    x2={6 + (reducedMotion ? 1 : stat3Progress) * 72}
                    y2="14"
                    stroke="#FFFFFF"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                  {/* Sliding dot */}
                  <circle
                    cx={6 + (reducedMotion ? 1 : stat3Progress) * 72}
                    cy="14"
                    r="4.5"
                    fill="#FFFFFF"
                  />
                  <circle
                    cx={6 + (reducedMotion ? 1 : stat3Progress) * 72}
                    cy="14"
                    r="8"
                    fill="#FFFFFF"
                    opacity="0.25"
                  />
                </svg>
              </div>

              {/* Display Numeral */}
              <div
                className="flex flex-wrap items-baseline font-sans font-black tracking-tight leading-none text-white text-[clamp(48px,6vw,96px)]"
                aria-label={IMPACT_STATS[2].formattedDisplay}
              >
                <span className="text-[0.55em] font-extrabold text-white mr-1 align-baseline">
                  ~
                </span>
                <span>
                  {reducedMotion
                    ? '6'
                    : Math.max(1, Math.round(stat3Progress * IMPACT_STATS[2].numericValue))}
                </span>
                <span className="text-[0.42em] font-bold text-white ml-2 tracking-normal align-baseline">
                  weeks
                </span>
              </div>

              {/* Caption */}
              <p className="font-mono text-[16px] sm:text-[17px] md:text-[18px] text-white leading-snug tracking-tight mt-3 sm:mt-4 max-w-[280px]">
                {IMPACT_STATS[2].label}
              </p>
            </div>

          </div>

          {/* Note: As of August 2026 */}
          <div className="mt-6 sm:mt-8 flex items-center gap-2 font-mono text-xs sm:text-sm text-white/60 tracking-wider uppercase">
            <span className="inline-block w-2 h-2 rounded-full bg-accent/80" />
            <span>{STATS_NOTE}</span>
          </div>
        </div>

      </Container>
    </section>
  );
}
