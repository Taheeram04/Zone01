// src/components/impact/ImpactCTA.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { HIRE_WHATSAPP_URL } from '../../constants';

export default function ImpactCTA() {
  const partnerUrl = `${HIRE_WHATSAPP_URL}?text=${encodeURIComponent(
    "Hi Zone01 Kisumu, I'd like to explore partnering with your organization."
  )}`;

  return (
    <section
      data-nav-theme="light"
      className="relative w-full bg-campus-bg py-20 md:py-28 overflow-hidden border-t border-[#DCE9FF]/60"
      aria-labelledby="impact-cta-heading"
    >
      <div className="impact-wrap relative z-10 w-full">
        <div className="max-w-4xl">
          {/* Eyebrow token: font-mono uppercase tracking-[0.08em] in primary blue */}
          <div className="font-mono text-primary text-[12px] md:text-[13px] tracking-[0.08em] uppercase font-semibold">
            // Get Involved
          </div>

          {/* Heading token: font-sans font-black in black-900 with primary blue highlight */}
          <h2
            id="impact-cta-heading"
            className="font-sans font-black text-black-900 text-[clamp(34px,4.5vw,58px)] tracking-[-0.03em] leading-[1.08] mt-4"
          >
            Want to be part of our{' '}
            <span className="text-primary">impact?</span>
          </h2>

          {/* Body text token: font-sans in secondary/slate tone */}
          <p className="font-sans text-[#35507F] text-[clamp(17px,1.25vw,19px)] leading-[1.65] mt-5 max-w-2xl">
            Whether you are looking to hire world-class, work-ready software engineers
            or collaborate with us to expand digital skills across Africa—we are ready
            to build the future with you.
          </p>

          {/* Buttons following design tokens: variant="primary" & variant="outline" */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-5 mt-8 md:mt-10">
            {/* Primary Action Button Token */}
            <Link
              to="/hire"
              className="inline-flex items-center justify-center font-mono font-medium text-[15px] px-8 py-3.5 rounded-md bg-primary text-white hover:bg-primary/90 active:bg-primary/80 transition-all duration-200 shadow-md shadow-primary/20 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              Hire Talent &rarr;
            </Link>

            {/* Outline Action Button Token */}
            <a
              href={partnerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center font-mono font-medium text-[15px] px-8 py-3.5 rounded-md bg-white border-2 border-primary text-primary hover:bg-primary hover:text-white active:bg-primary/90 transition-all duration-200 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              Partner with us
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
