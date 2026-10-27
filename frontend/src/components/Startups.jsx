// components/Startups.jsx
import { useRef } from 'react';
import { Container } from './layout.jsx';
import { STARTUPS } from '../data/startups.data.js';
import { Reveal, usePrefersReducedMotion } from './impact-shared.jsx';

export default function Startups() {
  const reduced = usePrefersReducedMotion();
  const isDev = import.meta.env.DEV;
  const items = STARTUPS.filter((s) => {
    if (s.status === 'published') return true;
    if (isDev && s.status === 'placeholder') return true;
    return false;
  }).slice(0, 3);

  const handleMove = (e) => {
    if (reduced) return;
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const dx = (x - cx) / cx;
    const dy = (y - cy) / cy;
    const rx = Math.max(-4, Math.min(4, dy * -4));
    const ry = Math.max(-4, Math.min(4, dx * 4));
    el.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(0)`;
  };
  const handleLeave = (e) => {
    e.currentTarget.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) translateZ(0)';
  };

  const sectors = new Set(items.map((i) => i.sector).filter(Boolean));
  const foundersCount = items.reduce((acc, i) => acc + (i.founders?.length || 0), 0);

  return (
    <section className="relative w-full bg-[#BFD8FD] py-24 sm:py-28 lg:py-32">
      <Container>
        <div className="mb-10 sm:mb-14">
          <h2 className="font-sans font-black text-black-900 tracking-tight leading-tight text-[clamp(2rem,5vw,4rem)]">
            <span className="text-primary">Startups</span> from Zone01 Kisumu
          </h2>
          <p className="font-mono text-sm text-black-900/70 mt-2">{items.length} startups · {foundersCount} founders · {sectors.size} sectors</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 lg:gap-6">
          {items[0] && (
            <Reveal className="lg:col-span-7" delay={0}>
              <article
                onMouseMove={handleMove}
                onMouseLeave={handleLeave}
                className="bg-white rounded-[28px] border border-black-900/10 shadow-[0_10px_40px_rgba(0,0,0,0.06)] overflow-hidden h-full flex flex-col transition-transform duration-200 will-change-transform"
                style={{ transform: 'perspective(800px) rotateX(0deg) rotateY(0deg)' }}
              >
                <div className="relative w-full h-[240px] sm:h-[320px] bg-tint-blue">
                  <img
                    src={items[0].image?.screenshot?.src}
                    alt={items[0].image?.screenshot?.alt || items[0].name}
                    className="w-full h-full object-cover"
                    style={{ backgroundColor: '#EAF2FF' }}
                    loading="lazy"
                  />
                  {isDev && items[0].status === 'placeholder' && (
                    <span className="absolute top-2 right-2 text-[10px] font-mono px-2 py-0.5 border border-dashed border-black-900/40 rounded-full bg-white/80">PLACEHOLDER</span>
                  )}
                </div>
                <div className="p-6 sm:p-8 flex flex-col gap-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-sans font-black text-black-900 text-2xl sm:text-3xl">{items[0].name}</h3>
                    <span className="font-mono text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">{items[0].sector}</span>
                    <span className="font-mono text-xs px-2 py-0.5 rounded-full bg-black-900/5 text-black-900">{items[0].stage}</span>
                  </div>
                  <p className="font-sans text-lg text-black-900">{items[0].tagline}</p>
                  <p className="font-sans text-body-m text-black-900/80">{items[0].description}</p>
                  <div className="flex flex-wrap items-center gap-3">
                    {items[0].founders?.map((f, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <div className="w-9 h-9 rounded-full bg-tint-blue flex items-center justify-center text-primary font-mono text-xs">{f.initials || f.name?.slice(0,2).toUpperCase()}</div>
                        <div>
                          <p className="font-sans text-sm text-black-900">{f.name}</p>
                          <p className="font-mono text-xs text-black-900/60">{f.role}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="font-mono text-xs text-black-900/70">Started {items[0].yearStarted} · {items[0].tractionNote}</p>
                    <a href={items[0].website} target="_blank" rel="noopener noreferrer" className="px-5 py-2 rounded-full bg-primary text-white font-mono text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary">Visit</a>
                  </div>
                </div>
              </article>
            </Reveal>
          )}
          <div className="lg:col-span-5 flex flex-col gap-4 sm:gap-5">
            {items.slice(1).map((s, idx) => (
              <Reveal key={s.id} delay={(idx + 1) * 60}>
                <article
                  onMouseMove={handleMove}
                  onMouseLeave={handleLeave}
                  className="bg-white rounded-[24px] border border-black-900/10 shadow-[0_6px_30px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col transition-transform duration-200 will-change-transform"
                  style={{ transform: 'perspective(800px) rotateX(0deg) rotateY(0deg)' }}
                >
                  <div className="relative w-full h-[160px] bg-tint-blue">
                    <img
                      src={s.image?.logo?.src || s.image?.screenshot?.src}
                      alt={s.image?.logo?.alt || s.name}
                      className="w-full h-full object-cover"
                      style={{ backgroundColor: '#EAF2FF' }}
                      loading="lazy"
                    />
                    {isDev && s.status === 'placeholder' && (
                      <span className="absolute top-2 right-2 text-[10px] font-mono px-2 py-0.5 border border-dashed border-black-900/40 rounded-full bg-white/80">PLACEHOLDER</span>
                    )}
                  </div>
                  <div className="p-5 flex flex-col gap-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-sans font-black text-black-900 text-lg">{s.name}</h3>
                      <span className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary">{s.sector}</span>
                      <span className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-black-900/5 text-black-900">{s.stage}</span>
                    </div>
                    <p className="font-sans text-sm text-black-900">{s.tagline}</p>
                    <div className="flex items-center justify-between">
                      <p className="font-mono text-xs text-black-900/70">{s.founders?.map((f) => f.name).join(', ')} · {s.yearStarted}</p>
                      <a href={s.website} target="_blank" rel="noopener noreferrer" className="font-mono text-xs text-primary underline underline-offset-4">Visit</a>
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
