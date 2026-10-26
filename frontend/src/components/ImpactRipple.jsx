// components/ImpactRipple.jsx
import { Container } from './layout.jsx';
import { RIPPLE_FACTS } from '../data/ripple.data.js';
import { Reveal } from './impact-shared.jsx';

export default function ImpactRipple() {
  const isDev = import.meta.env.DEV;
  const items = RIPPLE_FACTS.filter((f) => {
    if (f.status === 'published') return true;
    if (isDev && f.status === 'placeholder') return true;
    return false;
  });
  if (items.length === 0) return null;
  return (
    <section className="relative w-full bg-white py-24 sm:py-28 lg:py-32">
      <Container>
        <div className="mb-10 sm:mb-14">
          <h2 className="font-sans font-black text-black-900 tracking-tight leading-tight text-[clamp(2rem,5vw,4rem)]">
            Beyond the <span className="text-primary">cohort</span>
          </h2>
        </div>
        <div className="relative">
          <div className="hidden lg:block absolute left-0 right-0 top-1/2 h-px bg-black-900/10" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {items.map((f, idx) => (
              <Reveal key={f.id} delay={idx * 60}>
                <article className="relative bg-white">
                  <div className="flex items-baseline gap-3">
                    <span className="font-sans font-black text-primary text-[clamp(3rem,8vw,6rem)] leading-none" style={{ fontVariantNumeric: 'tabular-nums' }}>
                      {f.value}
                    </span>
                    {isDev && f.status === 'placeholder' && (
                      <span className="text-[10px] font-mono px-2 py-0.5 border border-dashed border-black-900/40 rounded-full">PLACEHOLDER</span>
                    )}
                  </div>
                  <p className="font-sans font-semibold text-black-900 text-lg mt-2">{f.label}</p>
                  <p className="font-mono text-sm text-black-900/70 mt-1">{f.sentence}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
