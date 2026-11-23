import { Link } from 'react-router-dom';

/**
 * Shared Hero Component for View All Pages:
 * - Faint blue dot field in top right masked with radial fade and drifting slowly
 * - Two thin floating rings
 * - "← Community" breadcrumb link
 * - Monospace section label (e.g. "01 — Archive", "02 — Calendar", "03 — Journal")
 * - Very large Montserrat 800 title (clamp 52px to 128px) with second word in primary blue
 * - Short intro paragraph on the right
 */
export default function CommunityViewAllHero({
  label,
  titleWord1,
  titleWord2,
  description,
}) {
  return (
    <section className="relative overflow-hidden bg-[var(--community-ground)] pb-[88px] pt-[72px]">
      {/* Background dot field & floating rings */}
      <div className="community-field" aria-hidden="true" />
      <i
        className="community-ring"
        aria-hidden="true"
        style={{ width: '140px', height: '140px', top: '70px', right: '14%' }}
      />
      <i
        className="community-ring"
        aria-hidden="true"
        style={{
          width: '56px',
          height: '56px',
          bottom: '80px',
          right: '30%',
          animationDelay: '-4s',
        }}
      />

      <div className="relative mx-auto max-w-[1240px] px-8">
        {/* Breadcrumb */}
        <Link
          to="/community"
          className="community-rise inline-flex items-center gap-2.5 font-mono text-[13px] font-medium text-[var(--community-muted)] transition-colors hover:text-black"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M19 12H5M11 6l-6 6 6 6" />
          </svg>
          Community
        </Link>

        {/* Title & Intro Row */}
        <div className="mt-[72px] flex flex-wrap items-end justify-between gap-8">
          <div>
            <span
              className="community-rise font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--community-blue)]"
              style={{ animationDelay: '0.1s' }}
            >
              {label}
            </span>
            <h1
              className="community-rise mt-5 font-sans text-[clamp(52px,9vw,128px)] font-extrabold uppercase leading-[0.98] tracking-tight text-black"
              style={{ animationDelay: '0.2s' }}
            >
              {titleWord1}{' '}
              <span className="text-[var(--community-blue)]">{titleWord2}</span>
            </h1>
          </div>

          <p
            className="community-rise max-w-[340px] font-mono text-[15px] leading-[1.75] text-[var(--community-muted)]"
            style={{ animationDelay: '0.35s' }}
          >
            {description}
          </p>
        </div>
      </div>
    </section>
  );
}
