import { Link } from 'react-router-dom';
import { Container } from '../layout.jsx';

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
    <section className="relative overflow-hidden bg-[var(--community-ground)] pb-12 pt-12 sm:pb-16 sm:pt-16">
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

      <Container className="relative">
        <div className="mx-auto w-full max-w-7xl">
          {/* Breadcrumb */}
          <Link
            to="/community"
            className="community-rise inline-flex items-center gap-2 font-mono text-xs font-medium text-[var(--community-muted)] transition-colors hover:text-black sm:text-[13px]"
          >
            <svg
              width="15"
              height="15"
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
          <div className="mt-7 flex flex-wrap items-end justify-between gap-6 sm:mt-9">
            <div>
              <span
                className="community-rise font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--community-blue)] sm:text-[11px]"
                style={{ animationDelay: '0.1s' }}
              >
                {label}
              </span>
              <h1
                className="community-rise mt-3 font-sans text-[clamp(34px,5vw,68px)] font-extrabold uppercase leading-[1.02] tracking-tight text-black sm:mt-4"
                style={{ animationDelay: '0.2s' }}
              >
                {titleWord1}{' '}
                <span className="text-[var(--community-blue)]">{titleWord2}</span>
              </h1>
            </div>

            <p
              className="community-rise max-w-[320px] font-mono text-xs leading-relaxed text-[var(--community-muted)] sm:text-sm"
              style={{ animationDelay: '0.35s' }}
            >
              {description}
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
