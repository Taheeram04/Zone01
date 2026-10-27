// components/ImpactStories.jsx
import { useState } from 'react';
import { Container } from './layout.jsx';
import { STORIES } from '../data/stories.data.js';
import { Reveal, usePrefersReducedMotion } from './impact-shared.jsx';
import ImpactStoryModal from './ImpactStoryModal.jsx';

export default function ImpactStories() {
  const reduced = usePrefersReducedMotion();
  const isDev = import.meta.env.DEV;
  const items = STORIES.filter((s) => {
    if (!s.consent) return false;
    if (s.status === 'published') return true;
    if (isDev && s.status === 'placeholder') return true;
    return false;
  }).slice(0, 3);

  const [active, setActive] = useState(null);

  const openModal = (story) => {
    if (!reduced && document.startViewTransition) {
      document.startViewTransition(() => setActive(story));
    } else {
      setActive(story);
    }
  };

  if (items.length === 0) return null;

  const featured = items.find((s) => s.featured) || items[0];
  const others = items.filter((s) => s.id !== featured.id).slice(0, 2);

  return (
    <section className="relative w-full bg-white py-24 sm:py-28 lg:py-32">
      <Container>
        <div className="mb-12 sm:mb-16 lg:mb-20">
          <h2 className="font-sans font-black text-black-900 tracking-tight leading-tight text-[clamp(2rem,5vw,4rem)]">
            Impact <span className="text-primary">stories</span>
          </h2>
          <p className="font-mono text-sm sm:text-base text-black-900/70 mt-2">Our success is your success!</p>
        </div>

        <Reveal>
          <article className="relative grid grid-cols-1 lg:grid-cols-12 gap-0 rounded-[28px] overflow-hidden border border-black-900/10 shadow-[0_10px_40px_rgba(0,0,0,0.06)] min-h-[80vh]">
            <div className="lg:col-span-5 relative h-[320px] lg:h-auto lg:sticky lg:top-24">
              <img
                src={featured.image?.portrait?.src}
                alt={featured.image?.portrait?.alt || featured.name}
                width={featured.image?.portrait?.width || 800}
                height={featured.image?.portrait?.height || 1000}
                loading="lazy"
                className="w-full h-full object-cover"
                style={{ backgroundColor: '#BFD8FD', clipPath: reduced ? 'none' : 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' }}
              />
              {isDev && featured.status === 'placeholder' && (
                <span className="absolute top-3 left-3 text-[10px] font-mono px-2 py-0.5 border border-dashed border-black-900/40 rounded-full bg-white/80">PLACEHOLDER</span>
              )}
            </div>
            <div className="lg:col-span-7 p-6 sm:p-10 lg:p-14 flex flex-col gap-6">
              <div>
                <h3 className="font-sans font-black text-black-900 text-2xl sm:text-4xl">{featured.name}</h3>
                <p className="font-mono text-sm text-black-900/70">{featured.role} · {featured.cohort}</p>
              </div>
              {featured.quote && (
                <blockquote className="font-sans font-black text-black-900 text-xl sm:text-3xl leading-tight">
                  “{featured.quote}”
                </blockquote>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="rounded-[14px] border border-black-900/10 p-4">
                  <p className="font-mono text-xs text-black-900/60">Before</p>
                  <p className="font-sans text-sm text-black-900 mt-1">{featured.journey?.before}</p>
                </div>
                <div className="rounded-[14px] border border-black-900/10 p-4">
                  <p className="font-mono text-xs text-black-900/60">At Zone01</p>
                  <p className="font-sans text-sm text-black-900 mt-1">{featured.journey?.during}</p>
                </div>
                <div className="rounded-[14px] border border-black-900/10 p-4">
                  <p className="font-mono text-xs text-black-900/60">Now</p>
                  <p className="font-sans text-sm text-black-900 mt-1">{featured.journey?.now}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {featured.outcomeChips?.filter((c) => c.verified).map((c, i) => (
                  <span key={i} className="font-mono text-xs px-3 py-1 rounded-full bg-primary/10 text-primary">{c.label}: {c.value}</span>
                ))}
              </div>
              <button
                onClick={() => openModal(featured)}
                className="self-start px-6 py-2 rounded-full border border-black-900/20 font-mono text-sm hover:bg-black-900/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
              >
                Read the full story
              </button>
            </div>
          </article>
        </Reveal>

        <div className="mt-10 sm:mt-14 flex flex-col gap-6">
          {others.map((s, idx) => (
            <Reveal key={s.id} delay={idx * 60}>
              <article className={`grid grid-cols-1 lg:grid-cols-12 gap-0 rounded-[24px] overflow-hidden border border-black-900/10 shadow-[0_6px_30px_rgba(0,0,0,0.05)] ${idx % 2 === 0 ? '' : 'lg:flex-row-reverse'}`}>
                <div className={`lg:col-span-5 relative h-[240px] lg:h-auto ${idx % 2 === 0 ? '' : 'lg:order-2'}`}>
                  <img
                    src={s.image?.wide?.src || s.image?.portrait?.src}
                    alt={s.image?.wide?.alt || s.image?.portrait?.alt || s.name}
                    loading="lazy"
                    className="w-full h-full object-cover"
                    style={{ backgroundColor: '#BFD8FD' }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent" />
                  {isDev && s.status === 'placeholder' && (
                    <span className="absolute top-3 left-3 text-[10px] font-mono px-2 py-0.5 border border-dashed border-black-900/40 rounded-full bg-white/80">PLACEHOLDER</span>
                  )}
                </div>
                <div className={`lg:col-span-7 p-6 sm:p-8 flex flex-col gap-4 ${idx % 2 === 0 ? '' : 'lg:order-1'}`}>
                  <div>
                    <h3 className="font-sans font-black text-black-900 text-xl sm:text-2xl">{s.name}</h3>
                    <p className="font-mono text-sm text-black-900/70">{s.role} · {s.cohort}</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <div className="rounded-[12px] border border-black-900/10 p-3">
                      <p className="font-mono text-[10px] text-black-900/60">Before</p>
                      <p className="font-sans text-xs text-black-900 mt-1">{s.journey?.before}</p>
                    </div>
                    <div className="rounded-[12px] border border-black-900/10 p-3">
                      <p className="font-mono text-[10px] text-black-900/60">At Zone01</p>
                      <p className="font-sans text-xs text-black-900 mt-1">{s.journey?.during}</p>
                    </div>
                    <div className="rounded-[12px] border border-black-900/10 p-3">
                      <p className="font-mono text-[10px] text-black-900/60">Now</p>
                      <p className="font-sans text-xs text-black-900 mt-1">{s.journey?.now}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => openModal(s)}
                    className="self-start px-5 py-1.5 rounded-full border border-black-900/20 font-mono text-xs hover:bg-black-900/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
                  >
                    Read more
                  </button>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </Container>
      {active && <ImpactStoryModal story={active} onClose={() => setActive(null)} />}
    </section>
  );
}
