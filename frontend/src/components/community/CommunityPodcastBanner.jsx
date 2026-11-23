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
    <section className="w-full bg-white pb-32 pt-0">
      <div className="mx-auto max-w-[1240px] px-8">
        <div className="group relative grid overflow-hidden rounded-[36px] border border-white/10 bg-[#06182E] shadow-[0_30px_70px_-24px_rgba(9,44,62,0.65)] lg:grid-cols-[340px_minmax(0,1fr)]">
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
          <div className="relative z-10 flex min-h-[300px] items-center justify-center bg-[#041224]/80 p-6 sm:p-8 lg:min-h-[380px]">
            <img
              src={podcastCover}
              alt="In The Zone Podcast, Episode 2 — Accelerating Action"
              className="mx-auto block w-full max-w-[260px] rounded-2xl object-contain shadow-[0_20px_45px_-18px_rgba(0,0,0,0.85)] transition-transform duration-700 ease-out group-hover:scale-[1.03]"
            />
            <span className="absolute left-6 top-6 rounded-full bg-[var(--community-blue)] px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-white">
              Latest episode
            </span>
          </div>

          {/* Right Column: Episode copy & CTA pill */}
          <div className="relative z-10 flex flex-col justify-center gap-5 p-8 sm:p-10 lg:p-14">
            <span className="font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-[#9DBFFF]">
              In The Zone Podcast
            </span>

            <div>
              <h3 className="font-sans text-[clamp(26px,3.2vw,44px)] font-extrabold uppercase leading-[1.1] tracking-tight text-white">
                Accelerating <span className="text-[#9DBFFF]">Action</span>
              </h3>
              <p className="mt-2 font-mono text-[13px] font-semibold uppercase tracking-[0.12em] text-white/55">
                Episode 2 &middot; Hosted by Cynthia Oyango
              </p>
            </div>

            <p className="max-w-xl font-mono text-sm leading-[1.75] text-[#C9D6F5]">
              Real conversations with the builders, mentors and partners behind
              Zone01 Kisumu — from first commit to first job and everything in
              between.
            </p>

            <div className="pt-2">
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
    </section>
  );
}
