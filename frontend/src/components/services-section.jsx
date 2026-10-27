// components/services-section.jsx
import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Container } from './layout.jsx';
import { hireContactUrl } from '../constants.js';
import iconOne from '../assets/service-icon-1.svg';
import iconTwo from '../assets/service-icon-2.svg';
import iconThree from '../assets/service-icon-3.svg';
import iconFour from '../assets/service-icon-4.svg';
import photoOne from '../assets/service-photo-1.webp';
import photoTwo from '../assets/service-photo-2.webp';
import photoThree from '../assets/service-photo-3.webp';
import photoFour from '../assets/service-photo-4.webp';

const CARD_ICONS = [iconOne, iconTwo, iconThree, iconFour];
const SERVICE_PHOTOS = [photoFour, photoTwo, photoThree, photoOne];
const EASE = [0.16, 1, 0.3, 1];

/**
 * "Our Services" — an interactive service console instead of a card grid.
 * The four offerings are tabs across the top; the selected service fills a
 * flat primary-blue detail panel with its description, a single action and a
 * framed photograph of Zone01 talent at work.
 */
const ServicesSection = ({ services }) => {
  const [active, setActive] = useState(0);
  const tabRefs = useRef([]);
  const sectionRef = useRef(null);
  const reduced = useReducedMotion();

  // Always open on the first service (Software Development as a Service)
  // whenever the section scrolls back into view.
  useEffect(() => {
    const node = sectionRef.current;
    if (!node || typeof IntersectionObserver === 'undefined') return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setActive(0);
      },
      { threshold: 0.25 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const safeActive = services.length
    ? Math.min(active, services.length - 1)
    : 0;
  const activeService = services[safeActive];
  const activeIcon =
    activeService?.image || CARD_ICONS[safeActive % CARD_ICONS.length];
  const activePhoto = SERVICE_PHOTOS[safeActive % SERVICE_PHOTOS.length];

  const handleKeyDown = (event) => {
    const last = services.length - 1;
    let next;

    if (event.key === 'ArrowRight') next = safeActive === last ? 0 : safeActive + 1;
    else if (event.key === 'ArrowLeft') next = safeActive === 0 ? last : safeActive - 1;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = last;
    else return;

    event.preventDefault();
    setActive(next);
    tabRefs.current[next]?.focus();
  };

  return (
    <section
      ref={sectionRef}
      id="services"
      data-nav-theme="light"
      className="bg-white pb-10 pt-10 md:pb-14 md:pt-14"
    >
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-sans text-[1.875rem] font-black leading-[1.1] tracking-[-0.02em] text-secondary sm:text-section-headline">
            Our Services
          </h2>
          <p className="mx-auto mt-5 max-w-2xl font-sans text-base leading-relaxed text-black-900/65">
            From a single specialist to a full delivery team, we make hiring easy,
            fast and reliable with a payment model that only moves when you are
            happy with the work.
          </p>
        </div>

        {services.length ? (
          <div
            className="mt-12 overflow-hidden bg-primary"
            style={{
              clipPath:
                'polygon(0 0, 100% 0, 100% calc(100% - 28px), calc(100% - 28px) 100%, 0 100%)',
            }}
          >
            <div
              role="tablist"
              aria-label="Our services"
              className="grid grid-cols-2 border-b border-white/20 md:grid-cols-4"
            >
              {services.map((service, index) => {
                const selected = index === safeActive;

                return (
                  <button
                    key={service.id || service.slug}
                    ref={(element) => {
                      tabRefs.current[index] = element;
                    }}
                    type="button"
                    role="tab"
                    id={`service-tab-${index}`}
                    aria-selected={selected}
                    aria-controls="service-panel"
                    tabIndex={selected ? 0 : -1}
                    onClick={() => setActive(index)}
                    onMouseEnter={() => setActive(index)}
                    onFocus={() => setActive(index)}
                    onKeyDown={handleKeyDown}
                    className={`relative flex flex-col gap-1 border-r border-white/20 px-4 py-4 text-left transition-colors last:border-r-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white sm:px-5 sm:py-5 ${
                      selected
                        ? 'bg-black/10 text-white'
                        : 'text-white hover:bg-white/10'
                    }`}
                  >
                    <span
                      className={`font-sans text-body-s leading-snug sm:text-body-m ${
                        selected ? 'font-bold' : 'font-semibold'
                      }`}
                    >
                      {service.title || service.name}
                    </span>
                    {selected && (
                      <motion.span
                        layoutId="service-tab-indicator"
                        aria-hidden="true"
                        className="absolute inset-x-0 bottom-0 h-0.5 bg-white"
                        transition={{
                          type: 'spring',
                          stiffness: 420,
                          damping: 34,
                        }}
                      />
                    )}
                  </button>
                );
              })}
            </div>

            <div className="grid md:grid-cols-[1.3fr_0.7fr]">
              <motion.div
                key={safeActive}
                initial={reduced ? false : { opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, ease: EASE }}
                id="service-panel"
                role="tabpanel"
                aria-labelledby={`service-tab-${safeActive}`}
                className="relative p-7 sm:p-10 md:p-12"
              >
                <h3 className="max-w-xl font-sans text-cta-headline font-black leading-tight tracking-tight text-white">
                  {activeService.title || activeService.name}
                </h3>
                <p className="mt-4 max-w-xl font-sans text-body-m leading-relaxed text-white">
                  {activeService.description}
                </p>

                <a
                  href={hireContactUrl(
                    activeService.title || activeService.name,
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-sans text-body-m font-semibold text-primary transition-colors hover:bg-white/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                >
                  Talk to us
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </a>
              </motion.div>

              <div className="relative aspect-[16/10] overflow-hidden border-t border-white/20 md:aspect-auto md:border-l md:border-t-0">
                <AnimatePresence initial={false}>
                  <motion.img
                    key={safeActive}
                    src={activePhoto}
                    alt=""
                    aria-hidden="true"
                    initial={
                      reduced
                        ? { opacity: 0 }
                        : { opacity: 0, scale: 1.16, filter: 'blur(12px)' }
                    }
                    animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                    exit={
                      reduced
                        ? { opacity: 0 }
                        : { opacity: 0, scale: 1.03, filter: 'blur(8px)' }
                    }
                    transition={{ duration: reduced ? 0.01 : 1, ease: EASE }}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                </AnimatePresence>

                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-secondary/95 via-secondary/30 to-transparent"
                />

                {!reduced && (
                  <motion.span
                    key={`sheen-${safeActive}`}
                    aria-hidden="true"
                    initial={{ x: '-130%', skewX: -14 }}
                    animate={{ x: '130%', skewX: -14 }}
                    transition={{ duration: 1.2, ease: 'easeInOut', delay: 0.15 }}
                    className="pointer-events-none absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-white/25 to-transparent"
                  />
                )}

                <div className="absolute inset-x-0 bottom-0 z-10 flex items-center gap-3 p-5 sm:p-6">
                  <span className="flex h-10 w-10 flex-none items-center justify-center rounded-full border border-white/30 bg-white/15 backdrop-blur-sm">
                    <img
                      src={activeIcon}
                      alt=""
                      aria-hidden="true"
                      className={`h-4 w-4 ${activeService.image ? '' : 'invert'}`}
                    />
                  </span>
                  <motion.p
                    key={`caption-${safeActive}`}
                    initial={reduced ? false : { opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2, ease: EASE }}
                    className="font-mono text-body-s uppercase leading-relaxed tracking-[0.18em] text-white/90"
                  >
                    Built and peer-reviewed by Zone01 talent
                  </motion.p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <p className="mt-12 text-center font-mono text-body-m text-black-900/60">
            Our service catalogue is being updated. Check back soon.
          </p>
        )}
      </Container>
    </section>
  );
};

export default ServicesSection;
