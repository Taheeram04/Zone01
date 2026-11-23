import { SOCIAL_LINKS } from '../../social.js';
import '../../styles/community.css';

const PODCAST_PLAYLIST_URL =
  'https://youtube.com/playlist?list=PLrqp13m-1b2HjFPL9IaASYv2MhbPgbC25&si=4keocD_7bRFOcisP';

/**
 * Community Podcast Banner & Follow the Journey Strip
 *
 * Implements the podcast card from design-reference/Main.dc.html:
 * - Deep navy background with dark placeholder dot grid
 * - "In the Zone podcast" label in monospace
 * - "Accelerating Action" heading in Montserrat 800 uppercase
 * - "Watch the playlist" pill button opening the YouTube playlist
 * - Followed by the "Follow the journey" social links strip
 */
export default function CommunityPodcastBanner() {
  return (
    <section className="w-full bg-white pb-28 pt-0">
      <div className="mx-auto max-w-[1240px] px-8">
        {/* Podcast Card matching design-reference/Main.dc.html */}
        <div className="relative flex flex-wrap items-center justify-between gap-8 overflow-hidden rounded-[36px] bg-[var(--community-deep)] p-8 sm:p-12 md:p-16">
          {/* Subtle dot background */}
          <i
            aria-hidden="true"
            className="community-ph community-ph-d pointer-events-none absolute inset-0 opacity-50"
          />

          {/* Text block */}
          <div className="relative z-10 flex max-w-[620px] flex-col gap-4">
            <span className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-[#BFD0F5]">
              In the Zone podcast
            </span>
            <h3 className="font-sans text-[clamp(28px,3.6vw,48px)] font-extrabold uppercase leading-[1.1] tracking-tight text-white">
              Accelerating <span className="text-[#9DBFFF]">Action</span>
            </h3>
            <p className="font-mono text-[14px] leading-[1.7] text-[#C9D6F5]">
              Real conversations with the builders, mentors and partners behind
              Zone01 Kisumu — from first commit to first job and everything in
              between.
            </p>
          </div>

          {/* Action pill */}
          <a
            href={PODCAST_PLAYLIST_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="community-pill community-pill-light relative z-10 shrink-0"
          >
            <span>Watch the playlist</span>
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
          </a>
        </div>

        {/* Follow the journey social strip */}
        <div className="mx-auto mt-12 rounded-2xl border border-[var(--community-line)] bg-[var(--community-soft)] px-6 py-7 sm:px-8">
          <div className="flex flex-col items-center gap-5 text-center sm:flex-row sm:justify-between sm:text-left">
            <div>
              <h4 className="font-sans text-lg font-bold text-[var(--community-deep)]">
                Follow the journey
              </h4>
              <p className="mt-1 font-mono text-sm text-[var(--community-muted)]">
                New posts land on our socials first — join the conversation.
              </p>
            </div>
            <ul className="flex flex-wrap items-center justify-center gap-3">
              {SOCIAL_LINKS.map(({ key, Icon, href, label, color }) => (
                <li key={key}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--community-line)] bg-white text-[var(--community-deep)] transition-all hover:scale-105 hover:text-white"
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = color;
                      e.currentTarget.style.borderColor = color;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '';
                      e.currentTarget.style.borderColor = '';
                    }}
                  >
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
