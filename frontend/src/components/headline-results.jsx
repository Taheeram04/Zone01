// components/headline-results.jsx
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Container } from './layout.jsx';
import { HEADLINE_STATISTICS } from './headline-results.data.js';

gsap.registerPlugin(ScrollTrigger);

/**
 * HeadlineResults
 * Modern bento-grid statistics section:
 * - Perfectly center-aligned cards on the page with zero edge clipping across all screen sizes
 * - Center-aligned card contents (eyebrows, numbers, units, labels) for clean symmetry
 * - Design tokens strictly applied from index.css (fonts, sizes, colors, radii)
 * - Strict 2-color palette: Brand Blue and White tokens
 * - Montserrat for large numbers, units, and headings; IBM Plex Mono for labels, eyebrows, and tags
 * - Dollar sign '$' prefix rendered with identical font size, weight, and baseline as the number
 * - Numbers count up once strictly on scroll (no replaying on hover)
 * - Fine-pointer hover & focus color inversion with subtle lift/scale
 * - Touch devices skip hover; prefers-reduced-motion respected
 */
export default function HeadlineResults() {
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);
  const numberRefs = useRef([]);

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

  // GSAP animation: card entrance and number count-up strictly on scroll
  useEffect(() => {
    if (reducedMotion) return;

    const cards = cardsRef.current.filter(Boolean);
    const numberEls = numberRefs.current.filter(Boolean);
    if (!cards.length || !numberEls.length) return;

    let ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          once: true,
          onLeave: () => {
            // Jump cleanly to final numbers if scrolled past quickly
            tl.progress(1);
          },
        },
      });

      // Reset numeric spans to 0 at the start of animation
      tl.set(numberEls, { textContent: '0' });

      // Cards subtle fade and rise
      tl.from(cards, {
        opacity: 0,
        y: 16,
        duration: 0.6,
        stagger: 0.04,
        ease: 'power3.out',
      });

      // Numbers count up to target over 2.0s with power2.out strictly once on scroll
      HEADLINE_STATISTICS.forEach((stat, idx) => {
        const numEl = numberRefs.current[idx];
        if (!numEl) return;

        const proxy = { val: 0 };
        tl.to(
          proxy,
          {
            val: stat.numericValue,
            duration: 2.0,
            ease: 'power2.out',
            onUpdate: () => {
              const current = Math.round(proxy.val);
              numEl.textContent = stat.hasComma
                ? current.toLocaleString('en-US')
                : String(current);
            },
            onComplete: () => {
              numEl.textContent = stat.hasComma
                ? stat.numericValue.toLocaleString('en-US')
                : String(stat.numericValue);
            },
          },
          0.08 + idx * 0.03
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section
      id="headline-results"
      ref={sectionRef}
      data-nav-theme="light"
      aria-labelledby="headline-results-title"
      className="relative w-full bg-campus-bg py-8 sm:py-10 lg:py-12 overflow-hidden"
    >
      {/* Scoped CSS for fine-pointer hover inversion, focus states, and reduced motion */}
      <style>{`
        @media (hover: hover) and (pointer: fine) {
          .bento-card-blue:hover {
            background-color: var(--color-white) !important;
            border-color: rgba(0, 99, 249, 0.2) !important;
            transform: translateY(-5px);
            box-shadow: 0 16px 36px -10px rgba(0, 99, 249, 0.25);
          }
          .bento-card-blue:hover .bento-sync-color {
            color: var(--color-primary) !important;
          }
          .bento-card-blue:hover .bento-num-scale {
            transform: scale(1.02);
          }

          .bento-card-white:hover {
            background-color: var(--color-primary) !important;
            border-color: var(--color-primary) !important;
            transform: translateY(-5px);
            box-shadow: 0 16px 36px -10px rgba(0, 99, 249, 0.35);
          }
          .bento-card-white:hover .bento-sync-color {
            color: var(--color-white) !important;
          }
          .bento-card-white:hover .bento-num-scale {
            transform: scale(1.02);
          }
        }

        .bento-card-blue:focus-visible {
          background-color: var(--color-white) !important;
          border-color: rgba(0, 99, 249, 0.2) !important;
          transform: translateY(-5px);
          box-shadow: 0 16px 36px -10px rgba(0, 99, 249, 0.25);
        }
        .bento-card-blue:focus-visible .bento-sync-color {
          color: var(--color-primary) !important;
        }
        .bento-card-blue:focus-visible .bento-num-scale {
          transform: scale(1.02);
        }

        .bento-card-white:focus-visible {
          background-color: var(--color-primary) !important;
          border-color: var(--color-primary) !important;
          transform: translateY(-5px);
          box-shadow: 0 16px 36px -10px rgba(0, 99, 249, 0.35);
        }
        .bento-card-white:focus-visible .bento-sync-color {
          color: var(--color-white) !important;
        }
        .bento-card-white:focus-visible .bento-num-scale {
          transform: scale(1.02);
        }

        @media (prefers-reduced-motion: reduce) {
          .bento-card-blue,
          .bento-card-white,
          .bento-num-scale {
            transition: none !important;
            transform: none !important;
          }
        }
      `}</style>

      {/* Container wrapper: removes w-full to prevent horizontal overflow and right-edge clipping */}
      <Container className="relative z-10">
        <div className="w-full max-w-7xl mx-auto">
          {/* Center-aligned Section Header */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 sm:gap-3 mb-6 sm:mb-8 text-center">
            <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
              <h2
                id="headline-results-title"
                className="font-sans font-black text-section-headline text-black-900 tracking-tight leading-tight text-center"
              >
                Headline results.
              </h2>
              <span className="inline-flex items-center px-3 py-0.5 rounded-full font-mono font-medium text-body-s tracking-wide bg-primary/10 text-primary border border-primary/20 whitespace-nowrap">
                As of August 2026
              </span>
            </div>
          </div>

          {/* Center-aligned Bento Grid: 12-column on desktop, 2-column on tablet, 1-column on mobile */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-3 sm:gap-4 lg:gap-4.5 justify-center">
            {HEADLINE_STATISTICS.map((stat, idx) => {
              const isBlue = stat.theme === 'blue';
              const cardThemeClass = isBlue
                ? 'bento-card-blue bg-primary border-transparent shadow-[0_10px_28px_-8px_rgba(0,99,249,0.32)]'
                : 'bento-card-white bg-white border-black-900/10 shadow-[0_4px_20px_rgba(0,0,0,0.04)]';

              const defaultNumColor = isBlue ? 'text-white' : 'text-primary';
              const defaultUnitColor = isBlue ? 'text-white' : 'text-primary';
              const defaultEyebrowColor = isBlue ? 'text-white' : 'text-primary';
              const defaultLabelColor = isBlue ? 'text-white' : 'text-black-900';

              // Compact numeric scale optimized for all screen sizes
              const numSizeClass = 'text-section-headline sm:text-stat-number';

              const labelSizeClass = stat.isHero
                ? 'text-body-m sm:text-body-l'
                : 'text-body-s sm:text-body-m';

              return (
                <div
                  key={stat.id}
                  ref={(el) => {
                    cardsRef.current[idx] = el;
                  }}
                  tabIndex={0}
                  role="region"
                  aria-label={`${stat.formattedDisplay} - ${stat.label}`}
                  className={`group flex flex-col items-center justify-between p-4 sm:p-5 lg:p-5.5 rounded-[20px] sm:rounded-[24px] border transition-[transform,background-color,border-color,box-shadow] duration-300 ease-out cursor-default outline-none text-center focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${cardThemeClass} ${stat.gridClass}`}
                >
                  {/* Eyebrow Tag: Center-aligned */}
                  <div className="flex items-center justify-center mb-2 sm:mb-2.5 w-full">
                    <span
                      className={`font-mono font-medium text-body-s uppercase tracking-wider transition-colors duration-300 bento-sync-color ${defaultEyebrowColor}`}
                    >
                      {stat.eyebrow}
                    </span>
                  </div>

                  {/* Figure: Center-aligned count-up numeric layer and accessible values */}
                  <div className="w-full flex flex-col items-center justify-center my-auto">
                    <div className="flex items-baseline justify-center flex-wrap">
                      {/* Dollar sign prefix rendered at the exact same size and style as the number */}
                      {stat.prefix && (
                        <span
                          className={`font-sans font-black ${numSizeClass} tracking-tight leading-none inline-block origin-center transition-[color,transform] duration-300 ease-out bento-sync-color bento-num-scale ${defaultNumColor}`}
                        >
                          {stat.prefix}
                        </span>
                      )}

                      {/* Animated Number: rendered with final value initially for SSR/no-JS */}
                      <span
                        ref={(el) => {
                          numberRefs.current[idx] = el;
                        }}
                        className={`font-sans font-black ${numSizeClass} tracking-tight leading-none tabular-nums inline-block origin-center transition-[color,transform] duration-300 ease-out bento-sync-color bento-num-scale ${defaultNumColor}`}
                      >
                        {stat.hasComma
                          ? stat.numericValue.toLocaleString('en-US')
                          : stat.numericValue}
                      </span>

                      {/* Suffix if any (e.g. '%', '+', ' weeks', ' women') */}
                      {stat.suffix && (
                        <span
                          className={`font-sans font-bold text-cta-headline align-top ml-1 transition-colors duration-300 bento-sync-color ${defaultUnitColor}`}
                        >
                          {stat.suffix.trim()}
                        </span>
                      )}
                    </div>

                    {/* Statistic Label: Center-aligned */}
                    <p
                      className={`font-mono font-medium ${labelSizeClass} mt-2 sm:mt-2.5 leading-snug transition-colors duration-300 text-center bento-sync-color ${defaultLabelColor}`}
                    >
                      {stat.label}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
}
