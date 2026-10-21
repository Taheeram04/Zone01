// components/services-section.jsx
import { ArrowRight } from 'lucide-react';
import { Container } from './layout.jsx';
import { hireContactUrl } from '../constants.js';
import stepOne from '../assets/service-step-1.svg';
import stepTwo from '../assets/service-step-2.svg';
import stepThree from '../assets/service-step-3.svg';
import stepFour from '../assets/service-step-4.svg';
import iconOne from '../assets/service-icon-1.svg';
import iconTwo from '../assets/service-icon-2.svg';
import iconThree from '../assets/service-icon-3.svg';
import iconFour from '../assets/service-icon-4.svg';

const STEP_ICONS = [stepOne, stepTwo, stepThree, stepFour];
const CARD_ICONS = [iconOne, iconTwo, iconThree, iconFour];

/**
 * "Our Services" card grid. Cards come from the ``what_we_offer`` services in
 * the API, falling back to the original four service offerings.
 */
const ServicesSection = ({ services }) => (
  <section id="services" data-nav-theme="light" className="bg-white py-20">
    <Container>
      <div className="mx-auto max-w-3xl text-center">
        <p className="font-mono text-body-s uppercase tracking-[0.25em] text-primary">
          What we do
        </p>
        <h2 className="mt-3 font-sans text-[clamp(1.9rem,4vw,3rem)] font-black tracking-tight text-secondary">
          Our Services
        </h2>
        <p className="mt-4 font-sans text-body-l leading-relaxed text-black-900/70">
          No matter the service you need, we make hiring easy, fast and reliable.
          From technical roles to creative projects, we&apos;ve got your talent
          needs covered.
        </p>
      </div>

      {services.length ? (
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
          {services.map((service, index) => (
            <article
              key={service.id || service.slug}
              className="group flex h-full flex-col rounded-2xl border border-secondary/10 bg-tint-blue p-7 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-[0_18px_40px_rgba(9,44,62,0.12)] sm:p-9"
            >
              <div className="flex items-start justify-between gap-4">
                <img
                  src={STEP_ICONS[index % STEP_ICONS.length]}
                  alt=""
                  aria-hidden="true"
                  className="h-8 w-8"
                />
                <img
                  src={service.image || CARD_ICONS[index % CARD_ICONS.length]}
                  alt=""
                  aria-hidden="true"
                  className="h-9 w-9"
                />
              </div>

              <h3 className="mt-8 font-sans text-cta-headline font-bold leading-snug text-secondary">
                {service.title || service.name}
              </h3>
              <p className="mt-4 font-sans text-body-m leading-relaxed text-black-900/70">
                {service.description}
              </p>

              <div className="mt-auto pt-8">
                <a
                  href={hireContactUrl(service.title || service.name)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 font-mono text-body-m font-medium text-primary transition-colors hover:text-secondary"
                >
                  Talk to us
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </a>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <p className="mt-12 text-center font-mono text-body-m text-black-900/60">
          Our service catalogue is being updated. Check back soon.
        </p>
      )}
    </Container>
  </section>
);

export default ServicesSection;
