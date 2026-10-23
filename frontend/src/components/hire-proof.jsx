// components/hire-proof.jsx
import { Container } from './layout.jsx';
import { HERO_STATS } from './hire.data.js';

/**
 * Proof band under the hero, using the same treatment as the homepage
 * "Our Impact" metrics: primary blue field, extrabold white numerals and
 * IBM Plex Mono labels.
 */
const HireProof = () => (
  <section
    data-nav-theme="dark"
    aria-label="Zone01 hiring proof points"
    className="bg-primary"
  >
    <Container>
      <dl className="grid grid-cols-2 gap-x-6 gap-y-8 py-8 sm:py-10 md:grid-cols-4 md:gap-x-0">
        {HERO_STATS.map((stat, index) => (
          <div
            key={stat.label}
            className={`md:px-8 ${
              index === 0 ? 'md:pl-0' : 'md:border-l md:border-white/25'
            }`}
          >
            <dt className="sr-only">{stat.label}</dt>
            <dd>
              <span className="block font-mono text-[2.5rem] font-medium leading-none text-white sm:text-stat-number">
                {stat.value}
              </span>
              <span className="mt-2 block font-mono text-body-s font-medium text-white">
                {stat.label}
              </span>
            </dd>
          </div>
        ))}
      </dl>
    </Container>
  </section>
);

export default HireProof;
