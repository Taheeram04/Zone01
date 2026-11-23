import { Container } from '../layout.jsx';
import podcastCover from '../../assets/Podcast.webp';
import '../../styles/community.css';

const PODCAST_PLAYLIST_URL =
  'https://youtube.com/playlist?list=PLrqp13m-1b2HjFPL9IaASYv2MhbPgbC25&si=4keocD_7bRFOcisP';

/**
 * Community Podcast Card
 *
 * Replaces the plain box with the real In The Zone Podcast cover artwork
 * from the previous design:
 * - Prominent display of the podcast cover art (Podcast.webp)
 * - Atmospheric blurred artwork backdrop
 * - Episode details: "Accelerating Action — Episode 2 · Hosted by Cynthia Oyango"
 * - "Watch the playlist" pill button linking to YouTube
 */
export default function CommunityPodcastBanner() {
  return (
    <section className="w-full bg-[var(--community-soft)] py-16 sm:py-20 md:py-24">
      <Container>
        <div className="mx-auto w-full max-w-6xl">
          <div className="group relative grid overflow-hidden rounded-[28px] border border-white/10 bg-[#06182E] shadow-[0_25px_60px_-24px_rgba(9,44,62,0.6)] sm:rounded-[32px] lg:grid-cols-[280px_minmax(0,1fr)]">
            {/* Subtle blurred ambient backdrop using the podcast cover */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 -z-0 opacity-20 blur-3xl scale-125"
              style={{
                backgroundImage: `url(${podcastCover})`,
                backgroundPosition: 'center',
                backgroundSize: 'cover',
              }}
            />

            {/* Left Column: Podcast artwork with badge */}
            <div className="relative z-10 flex min-h-[220px] items-center justify-center bg-[#041224]/80 p-5 sm:p-6 lg:min-h-[280px]">
              <img
                src={podcastCover}
                alt="In The Zone Podcast, Episode 2 — Accelerating Action"
                className="mx-auto block w-full max-w-[190px] rounded-xl object-contain shadow-[0_16px_36px_-16px_rgba(0,0,0,0.85)] transition-transform duration-700 ease-out group-hover:scale-[1.03] sm:max-w-[210px] sm:rounded-2xl"
              />
              <span className="absolute left-5 top-5 rounded-full bg-[var(--community-blue)] px-2.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-[0.16em] text-white sm:text-[10px]">
                Latest episode
              </span>
            </div>

            {/* Right Column: Episode copy & CTA pill */}
            <div className="relative z-10 flex flex-col justify-center gap-3.5 p-6 sm:p-8 lg:p-10">
              <span className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-[#9DBFFF] sm:text-[11px]">
                In The Zone Podcast
              </span>

              <div>
                <h3 className="font-sans text-[clamp(20px,2.4vw,32px)] font-extrabold uppercase leading-[1.12] tracking-tight text-white">
                  Accelerating <span className="text-[#9DBFFF]">Action</span>
                </h3>
                <p className="mt-1.5 font-mono text-xs font-semibold uppercase tracking-[0.12em] text-white/55">
                  Episode 2 &middot; Hosted by Cynthia Oyango
                </p>
              </div>

              <p className="max-w-lg font-mono text-xs leading-relaxed text-[#C9D6F5] sm:text-sm">
                Real conversations with the builders, mentors and partners behind
                Zone01 Kisumu — from first commit to first job and everything in
                between.
              </p>

              <div className="pt-1">
                <a
                  href={PODCAST_PLAYLIST_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="community-pill community-pill-light self-start"
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
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
