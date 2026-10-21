// components/what-makes-us-unique.jsx
import { ArrowRight } from 'lucide-react';
import Button from './button.jsx';
import { Container } from './layout.jsx';
import { hireContactUrl } from '../constants.js';
import panelBackground from '../assets/service-hero.jpg';

/**
 * Closing employer panel for /hire: the "What Makes Us Unique" copy over the
 * campus photograph, plus a direct line to the hiring team.
 */
const WhatMakesUsUnique = () => (
  <section id="why-us" data-nav-theme="light" className="bg-white py-20">
    <Container>
      <div className="relative flex min-h-[320px] items-center overflow-hidden rounded-3xl md:min-h-[380px]">
        <img
          src={panelBackground}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(90deg, rgba(6,43,92,0.96) 0%, rgba(8,59,122,0.86) 55%, rgba(0,99,249,0.45) 100%)',
          }}
        />

        <div className="relative z-10 w-full p-7 sm:p-10 md:ml-auto md:w-[58%] md:p-12">
          <h2 className="font-sans text-[clamp(1.6rem,3vw,2.25rem)] font-black tracking-tight text-white">
            What Makes Us Unique
          </h2>
          <p className="mt-4 font-sans text-body-m leading-relaxed text-white/85 sm:text-base">
            We are unlike any tech talent agency in the market. Our talents are
            multi-faceted, rooted in African contexts while providing homegrown
            solutions to the global tech market. They work at the cutting edge of
            modern technologies, ready to apply AI and blockchain to solve your
            company&apos;s problems. Talk to us and let us embrace the future
            together.
          </p>

          <a
            href={hireContactUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="group mt-6 inline-flex items-center gap-2 font-sans text-body-m font-semibold text-accent transition-colors hover:text-white"
          >
            Improve your workflow
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </a>
        </div>
      </div>

      <div className="mt-10 flex justify-center">
        <Button
          variant="primary"
          href={hireContactUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full px-8"
        >
          Talk to an expert
        </Button>
      </div>
    </Container>
  </section>
);

export default WhatMakesUsUnique;
