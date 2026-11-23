import { Fragment, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Container } from '../layout.jsx';
import CommunitySectionHeader from './CommunitySectionHeader.jsx';
import CommunityImagePlaceholder from './CommunityImagePlaceholder.jsx';
import { INITIAL_NEWS_DATA } from '../../data/community-news.data.js';
import '../../styles/community.css';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

/**
 * Community News Section
 *
 * Replaces the existing News section on the Community page.
 * Two columns that wrap on narrow screens:
 * - Left: Featured story (5:4 image with 32px radius, primary blue tone 'c',
 *   faint dot grid, two floating hollow circles, monospace line, Montserrat headline,
 *   short excerpt, underlined "Read the story" link).
 * - Right: Four numbered rows (02 to 05) with 92px rounded thumbnail, category/date,
 *   17px Montserrat title, 48px circular arrow button with hover interaction.
 * - Followed directly by the thin decorative marquee (NEWS, EVENTS, BLOGS, STORIES).
 */
export default function CommunityNewsSection() {
  const [items, setItems] = useState(INITIAL_NEWS_DATA);

  useEffect(() => {
    const controller = new AbortController();

    const fetchNews = async () => {
      try {
        const [communityRes, newsRes] = await Promise.all([
          fetch(`${API_BASE}/api/community/`, {
            signal: controller.signal,
            cache: 'no-store',
          }).catch(() => null),
          fetch(`${API_BASE}/api/news/`, {
            signal: controller.signal,
            cache: 'no-store',
          }).catch(() => null),
        ]);

        const communityPayload = communityRes?.ok ? await communityRes.json() : null;
        const newsPayload = newsRes?.ok ? await newsRes.json() : null;

        const communityPosts = Array.isArray(communityPayload?.news)
          ? communityPayload.news
          : Array.isArray(communityPayload?.results?.news)
            ? communityPayload.results.news
            : [];

        const newsUpdates = Array.isArray(newsPayload?.results)
          ? newsPayload.results
          : Array.isArray(newsPayload)
            ? newsPayload
            : [];

        const combined = [...communityPosts, ...newsUpdates];

        if (combined.length > 0 && !controller.signal.aborted) {
          // Map fetched items onto our expected shape
          const mapped = combined.map((p, idx) => ({
            id: p.id || `fetched-${idx}`,
            slug: p.slug || `news-${idx}`,
            title: p.title || INITIAL_NEWS_DATA[0].title,
            excerpt: p.summary || p.information || p.body || INITIAL_NEWS_DATA[0].excerpt,
            category: p.category || (p.kind ? p.kind.toUpperCase() : 'News'),
            date: p.published_at ? new Date(p.published_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '[DD Mon YYYY]',
            image: p.image || null,
            pinned: Boolean(p.is_featured),
            tone: idx === 0 ? 'c' : idx % 3 === 0 ? 'b' : idx % 2 === 0 ? 'd' : 'a',
          }));

          // Ensure our primary LakeHub story remains featured if no pinned CMS post exists
          const hasPinned = mapped.some((m) => m.pinned);
          if (!hasPinned) {
            setItems([INITIAL_NEWS_DATA[0], ...mapped.slice(0, 4)]);
          } else {
            setItems(mapped);
          }
        }
      } catch {
        // Keep INITIAL_NEWS_DATA if API fails
      }
    };

    fetchNews();

    return () => controller.abort();
  }, []);

  const featured = items.find((item) => item.pinned) || items[0] || INITIAL_NEWS_DATA[0];
  const listRows = items.filter((item) => item.id !== featured.id).slice(0, 4);

  // If there are less than 4 rows, fill with fallback placeholders
  while (listRows.length < 4) {
    const nextIdx = listRows.length + 1;
    listRows.push(INITIAL_NEWS_DATA[nextIdx] || INITIAL_NEWS_DATA[1]);
  }

  const marqueeWords = ['NEWS', 'EVENTS', 'BLOGS', 'STORIES'];

  return (
    <>
      <section
        id="community-news"
        aria-labelledby="community-news-header"
        className="w-full bg-white py-16 md:py-20"
      >
        <Container>
          <div className="w-full">
            <CommunitySectionHeader
              step="01 — News"
              titleLead="Latest from"
              titleAccent="the Zone"
              description="Stories about our apprentices, partners and the impact we are building across Kisumu."
            />

            <div className="flex flex-wrap items-start gap-8 lg:gap-12">
              {/* Featured Story (Left Column) */}
              <Link
                to="/community/news"
                className="community-lift community-rise flex min-w-0 flex-1 flex-col gap-5 lg:max-w-[480px]"
                style={{ animationDelay: '0.15s' }}
              >
                <div className="community-thumb relative aspect-[5/4] max-h-[360px] w-full overflow-hidden rounded-2xl sm:rounded-[28px]">
                  <CommunityImagePlaceholder
                    src={featured.image}
                    alt={featured.title}
                    tone={featured.tone || 'c'}
                    label="Featured image 5:4"
                    className="community-zoom"
                  />
                  {/* Floating hollow orbs (shown on fallback placeholders) */}
                  {!featured.image && (
                    <>
                      <i
                        className="community-orb"
                        aria-hidden="true"
                        style={{ width: '120px', height: '120px', top: '8%', right: '8%' }}
                      />
                      <i
                        className="community-orb"
                        aria-hidden="true"
                        style={{
                          width: '56px',
                          height: '56px',
                          bottom: '12%',
                          left: '9%',
                          animationDelay: '-4s',
                        }}
                      />
                    </>
                  )}
                </div>

                <div className="flex flex-col gap-3 pr-2">
                  <span className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--community-blue)]">
                    {featured.category} &nbsp;/&nbsp; {featured.date}
                  </span>

                  <h3 className="community-ttl font-sans text-[clamp(18px,2vw,24px)] font-extrabold uppercase leading-snug tracking-tight text-black">
                    {featured.title}
                  </h3>

                  <p className="line-clamp-3 font-mono text-sm leading-relaxed text-[var(--community-muted)]">
                    {featured.excerpt}
                  </p>

                  <span className="community-ulink self-start text-xs font-semibold uppercase tracking-wider text-[var(--community-blue)]">
                    Read the story
                  </span>
                </div>
              </Link>

              {/* List Rows 02 to 05 (Right Column) */}
              <div className="flex min-w-0 flex-[1_1_340px] flex-col border-t border-[var(--community-line)]">
                {listRows.map((row, index) => {
                  const rowNum = String(index + 2).padStart(2, '0');
                  const delay = `${0.3 + index * 0.1}s`;

                  return (
                    <Link
                      key={`${row.id}-${index}`}
                      to="/community/news"
                      className="community-row community-rise gap-4 border-b border-[var(--community-line)] py-4 sm:gap-5 sm:py-5"
                      style={{ animationDelay: delay }}
                    >
                      <span className="w-6 shrink-0 font-mono text-[11px] font-semibold tracking-wider text-[var(--community-muted)]">
                        {rowNum}
                      </span>

                      <div className="community-thumb h-16 w-16 shrink-0 rounded-xl sm:h-[72px] sm:w-[72px] sm:rounded-2xl">
                        <CommunityImagePlaceholder
                          src={row.image}
                          alt={row.title}
                          tone={row.tone || (index === 0 ? 'a' : index === 1 ? 'b' : index === 2 ? 'd' : 'c')}
                          label=""
                          className="community-zoom"
                        />
                      </div>

                      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                        <span className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--community-blue)] sm:text-[11px]">
                          {row.category} / {row.date}
                        </span>
                        <h4 className="community-ttl line-clamp-2 font-sans text-sm font-extrabold uppercase leading-snug tracking-tight text-black sm:text-[15px]">
                          {row.title}
                        </h4>
                      </div>

                      <span className="community-round">
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
                      </span>
                    </Link>
                  );
                })}

                {/* View All News - Bottom Right */}
                <div className="mt-6 flex justify-end pt-2 sm:mt-8">
                  <Link to="/community/news" className="community-pill">
                    <span>View all news</span>
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
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Decorative Marquee Directly After News */}
      <div
        aria-hidden="true"
        className="w-full overflow-hidden border-y border-[var(--community-line)] bg-white py-6 select-none sm:py-8"
      >
        <div className="community-mq">
          {[0, 1].map((copyIndex) => (
            <div key={copyIndex} className="community-mq-half">
              {marqueeWords.map((word, wordIndex) => (
                <Fragment key={`${word}-${wordIndex}`}>
                  <span className="community-outline">{word}</span>
                  <span className="h-3.5 w-3.5 shrink-0 rounded-full bg-[var(--community-blue)]" />
                </Fragment>
              ))}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
