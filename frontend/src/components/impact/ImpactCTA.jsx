// src/components/impact/ImpactCTA.jsx
import { Link } from 'react-router-dom';
import { HIRE_WHATSAPP_URL } from '../../constants';

export default function ImpactCTA() {
  const partnerUrl = `${HIRE_WHATSAPP_URL}?text=${encodeURIComponent(
    "Hi Zone01 Kisumu, I'd like to explore partnering with your organization."
  )}`;

  return (
    <section
      data-nav-theme="light"
      className="relative w-full bg-campus-bg pt-10 pb-20 md:pt-14 md:pb-28 overflow-hidden border-t border-[#DCE9FF]/60"
      aria-labelledby="impact-cta-heading"
    >
      <div className="impact-wrap relative z-10 w-full">
        <div className="max-w-4xl">
          {/* Heading token: font-sans font-black in black-900 with primary blue highlight */}
          <h2
            id="impact-cta-heading"
            className="brand-section-title mt-4"
          >
            Want to be part of our{' '}
            <span className="text-primary">impact?</span>
          </h2>

          {/* Body text token: font-sans in secondary/slate tone */}
          <p className="brand-body mt-5 max-w-2xl" style={{ color: 'var(--brand-slate)' }}>
            Whether you are looking to hire world-class, work-ready software engineers
            or collaborate with us to expand digital skills across Africa—we are ready
            to build the future with you.
          </p>

          {/* Buttons following design tokens: variant="primary" & variant="secondary" */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-5 mt-8 md:mt-10">
            {/* Primary Action Button Token */}
            <Link
              to="/hire"
              className="brand-btn brand-btn--primary"
            >
              Hire Talent &rarr;
            </Link>

            {/* Secondary Action Button Token */}
            <a
              href={partnerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="brand-btn brand-btn--secondary"
            >
              Partner with us
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
