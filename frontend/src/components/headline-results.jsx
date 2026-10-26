// components/headline-results.jsx
import { Container } from './layout.jsx';
import { HEADLINE_DATA } from './headline-results.data.js';
import { Reveal, CountUp } from './impact-shared.jsx';

export default function HeadlineResults() {
  const { header, cards } = HEADLINE_DATA;

  const cohort = cards.find((c) => c.id === 'cohort');
  const paid = cards.find((c) => c.id === 'paid-work');
  const apps = cards.find((c) => c.id === 'applications');
  const avgM = cards.find((c) => c.id === 'avg-monthly');
  const topM = cards.find((c) => c.id === 'top-monthly');
  const women = cards.find((c) => c.id === 'women-high-earners');

  const dots = Array.from({ length: 97 }).map((_, i) => ({
    filled: i < 86,
  }));

  return (
    <section
      id="headline-results"
      data-nav-theme="light"
      aria-labelledby="headline-results-title"
      className="relative w-full bg-campus-bg py-24 sm:py-28 lg:py-32 overflow-hidden"
    >
      <Container className="relative z-10">
        <div className="w-full max-w-7xl mx-auto">
          <div className="mb-10 sm:mb-14 lg:mb-16">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-3.5">
              <h2 id="headline-results-title" className="font-sans font-black text-black-900 tracking-tight leading-tight text-[clamp(2rem,5vw,4rem)]">
                {header.title}
              </h2>
              <span className="inline-flex items-center px-3.5 py-1 rounded-full font-mono font-medium text-body-s tracking-wide bg-primary/10 text-primary border border-primary/20 whitespace-nowrap">
                {header.dateBadge}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 lg:gap-6">
            <Reveal className="lg:col-span-5 lg:row-span-2" delay={0}>
              <article className="h-full bg-primary text-white rounded-[28px] p-6 sm:p-10 flex flex-col justify-between">
                <div>
                  <div className="font-sans font-black text-white text-[clamp(4rem,12vw,9rem)] leading-none" style={{ fontVariantNumeric: 'tabular-nums' }}>
                    86 <span className="text-white/80">of</span> 97
                  </div>
                  <p className="font-mono text-sm sm:text-base text-white/90 mt-3">Apprentices and graduates in paid work</p>
                </div>
                <div className="mt-8 grid grid-cols-10 sm:grid-cols-11 gap-1.5 sm:gap-2">
                  {dots.map((d, i) => (
                    <span
                      key={i}
                      className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full ${d.filled ? 'bg-white' : 'border border-white/60'}`}
                    />
                  ))}
                </div>
                <p className="font-mono text-xs text-white/60 mt-4">89% of 97</p>
              </article>
            </Reveal>

            <Reveal className="lg:col-span-4" delay={60}>
              <article className="h-full bg-white rounded-[24px] p-6 sm:p-7 border border-black-900/10 flex flex-col justify-between">
                <div className="font-sans font-black text-black-900 text-[clamp(3rem,8vw,6rem)] leading-none" style={{ fontVariantNumeric: 'tabular-nums' }}>
                  <CountUp value={apps?.numericValue || 28000} format={(n) => n.toLocaleString('en-US')} suffix="+" />
                </div>
                <p className="font-mono text-sm text-black-900/80 mt-4">Applications received</p>
              </article>
            </Reveal>
            <Reveal className="lg:col-span-3" delay={90}>
              <article className="h-full bg-[#F4F8FD] rounded-[24px] p-6 sm:p-7 border border-black-900/5 flex flex-col justify-between">
                <div className="font-sans font-black text-black-900 text-[clamp(2.5rem,6vw,4.5rem)] leading-none" style={{ fontVariantNumeric: 'tabular-nums' }}>
                  USD <CountUp value={avgM?.numericValue || 600} />
                </div>
                <p className="font-mono text-sm text-black-900/80 mt-4">Average monthly income</p>
              </article>
            </Reveal>

            <Reveal className="lg:col-span-3" delay={120}>
              <article className="h-full bg-white rounded-[24px] p-6 sm:p-7 border border-black-900/10 flex flex-col justify-between">
                <div className="font-sans font-black text-black-900 text-[clamp(2.5rem,6vw,4.5rem)] leading-none" style={{ fontVariantNumeric: 'tabular-nums' }}>
                  USD <CountUp value={topM?.numericValue || 2500} />
                </div>
                <p className="font-mono text-sm text-black-900/80 mt-4">Top monthly earnings</p>
              </article>
            </Reveal>
            <Reveal className="lg:col-span-4" delay={150}>
              <article className="h-full bg-white rounded-[24px] p-6 sm:p-7 border border-black-900/10 flex flex-col justify-between">
                <div className="font-sans font-black text-black-900 text-[clamp(2.5rem,6vw,4.5rem)] leading-none" style={{ fontVariantNumeric: 'tabular-nums' }}>
                  <CountUp value={women?.numericValue || 2} />
                </div>
                <p className="font-mono text-sm text-black-900/80 mt-4">women earning more than USD 2,300 per month</p>
              </article>
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  );
}
