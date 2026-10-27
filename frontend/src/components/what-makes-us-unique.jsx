// components/what-makes-us-unique.jsx
import { ArrowRight } from 'lucide-react';
import Button from './button.jsx';
import { Container } from './layout.jsx';
import { hireContactUrl } from '../constants.js';
import panelBackground from '../assets/unique-hero.webp';

/**
 * Closing employer panel for /hire: the "What Makes Us Unique" copy over the
 * GopherCon Africa photograph, plus a direct line to the hiring team.
 */
const WhatMakesUsUnique = () => (
  <section id="why-us" data-nav-theme="light" className="bg-white pb-6 pt-6">
    <Container>
      <div className="relative flex min-h-[320px] items-center overflow-hidden rounded-3xl md:min-h-[520px]">
        <img
          src={panelBackground}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover object-[50%_18%]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(180deg, rgba(2,13,32,0.1) 0%, rgba(2,13,32,0) 50%, rgba(2,13,32,0.28) 100%), linear-gradient(100deg, rgba(4,32,72,0.36) 0%, rgba(6,50,110,0.62) 42%, rgba(2,13,33,0.9) 100%)',
          }}
        />
        <div aria-hidden="true" className="absolute inset-0 bg-[#041d42]/40 md:hidden" />

        <div className="relative z-10 w-full p-7 sm:p-10 md:ml-auto md:w-[58%] md:p-12">
          <h2 className="font-sans text-[1.875rem] font-black tracking-tight text-white sm:text-section-headline">
            What Makes Us Unique
          </h2>
          <p className="mt-4 font-sans text-body-m leading-relaxed text-white/85">
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
            className="group mt-6 inline-flex items-center gap-2 font-sans text-body-m font-semibold text-white transition-colors hover:text-accent"
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
          className="rounded-full px-8 !font-sans"
        >
          Talk to an expert
        </Button>
      </div>
    </Container>
  </section>
);

export default WhatMakesUsUnique;
