// components/TestimonialsBand.jsx
import { Container } from './layout.jsx';
import { TESTIMONIALS } from '../data/testimonials.data.js';
import { Reveal } from './impact-shared.jsx';

export default function TestimonialsBand() {
  const isDev = import.meta.env.DEV;
  const items = TESTIMONIALS.filter((t) => {
    if (t.status === 'published') return true;
    if (isDev && t.status === 'placeholder') return true;
    return false;
  });
  if (items.length === 0) return null;
  return (
    <section className="relative w-full bg-white py-10 sm:py-12">
      <Container>
        <Reveal className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {items.map((t) => (
            <div key={t.id} className="rounded-[16px] border border-black-900/10 p-5 flex flex-col gap-3">
              <p className="font-sans text-body-m text-black-900 leading-relaxed">“{t.quote}”</p>
              <div className="flex items-center gap-3 mt-auto">
                <div className="w-10 h-10 rounded-xl bg-tint-blue flex items-center justify-center text-primary font-mono font-bold">
                  {t.logoOrInitials || 'ZK'}
                </div>
                <div>
                  <p className="font-sans font-semibold text-black-900 text-sm">{t.name}</p>
                  <p className="font-mono text-xs text-black-900/70">{t.organisation}</p>
                </div>
                {isDev && t.status === 'placeholder' && (
                  <span className="ml-auto text-[10px] font-mono px-2 py-0.5 border border-dashed border-black-900/40 rounded-full">PLACEHOLDER</span>
                )}
              </div>
            </div>
          ))}
        </Reveal>
      </Container>
    </section>
  );
}
