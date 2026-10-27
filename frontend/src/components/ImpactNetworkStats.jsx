// components/ImpactNetworkStats.jsx
import { Container } from './layout.jsx';
import { Reveal } from './impact-shared.jsx';

const STATS = [
  { id: 'campuses', value: '50+', label: 'Campuses' },
  { id: 'countries', value: '30+', label: 'Countries' },
  { id: 'trained', value: '100K+', label: 'Trained students' },
  { id: 'active', value: '20K+', label: 'Active students' },
];

export default function ImpactNetworkStats() {
  return (
    <section className="relative w-full bg-white py-12 sm:py-14 lg:py-16">
      <Container>
        <div className="mb-8 sm:mb-10">
          <h2 className="font-sans font-black text-black-900 tracking-tight leading-tight text-[clamp(1.8rem,4vw,3rem)]">
            A connected <span className="text-primary">global network</span>
          </h2>
          <p className="font-mono text-sm text-black-900/70 mt-2">
            Free, peer-driven IT education at scale
          </p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {STATS.map((s, idx) => (
            <Reveal key={s.id} delay={idx * 40}>
              <article className="rounded-[16px] border border-black-900/10 bg-white p-5 sm:p-6 text-center">
                <div
                  className="font-sans font-black text-primary text-[clamp(2rem,6vw,4rem)] leading-none"
                  style={{ fontVariantNumeric: 'tabular-nums' }}
                >
                  {s.value}
                </div>
                <p className="font-mono text-xs sm:text-sm text-black-900/70 mt-2">
                  {s.label}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
