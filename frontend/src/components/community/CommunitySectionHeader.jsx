import { Link } from 'react-router-dom';

/**
 * Shared section header for the Community page sections:
 * Max width 1240px, 32px side padding, ~100px vertical padding.
 * Left: monospace step label ("01 — News") + Montserrat clamp heading (38px-72px) with primary blue final word.
 * Right: monospace paragraph (max 360px) + "View all" pill linking to the view-all page.
 */
export default function CommunitySectionHeader({
  step,
  titleLead,
  titleAccent,
  description,
  viewAllText,
  viewAllLink,
}) {
  return (
    <div className="community-rise mb-10 flex flex-wrap items-end justify-between gap-6 md:mb-12">
      <div>
        <span className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--community-blue)]">
          {step}
        </span>
        <h2 className="mt-3 font-sans text-[clamp(28px,3.2vw,44px)] font-extrabold uppercase leading-[1.08] tracking-tight text-black sm:mt-4">
          {titleLead}
          <br />
          <span className="text-[var(--community-blue)]">{titleAccent}</span>
        </h2>
      </div>

      {(description || viewAllLink) && (
        <div className="flex max-w-[340px] flex-col items-start gap-4 sm:gap-5">
          {description && (
            <p className="font-mono text-sm leading-relaxed text-[var(--community-muted)]">
              {description}
            </p>
          )}
          {viewAllLink && (
            <Link to={viewAllLink} className="community-pill">
              <span>{viewAllText}</span>
              <i>
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </i>
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
