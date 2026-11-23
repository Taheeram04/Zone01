import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Container } from '../components/layout.jsx';
import CommunityViewAllHero from '../components/community/CommunityViewAllHero.jsx';
import CommunityImagePlaceholder from '../components/community/CommunityImagePlaceholder.jsx';
import { INITIAL_EVENTS_DATA } from '../data/community-events.data.js';
import '../styles/community.css';

/**
 * Community All Events Page (/community/events)
 *
 * Structure:
 * - Shared View All Hero
 * - Segmented toggle (Upcoming / Past events) in soft blue pill container + event count
 * - List of event rows separated by hairlines:
 *   - 72px date numeral, month and year in monospace
 *   - Event type (with pulsing "Next up" dot on first upcoming item)
 *   - 30px title, time and venue
 *   - 200x128px rounded thumbnail
 *   - Circular arrow button (or "View recap" action for past events)
 *   - Hover: light blue background, shifts inward, arrow fills blue
 * - "Load more events" pill
 */
export default function CommunityAllEvents() {
  const [tab, setTab] = useState('upcoming');
  const [visibleCount, setVisibleCount] = useState(6);

  const isUpcoming = tab === 'upcoming';
  const filteredEvents = INITIAL_EVENTS_DATA.filter((e) =>
    isUpcoming ? !e.isPast : e.isPast,
  );

  const visibleEvents = filteredEvents.slice(0, visibleCount);
  const hasMore = visibleCount < filteredEvents.length;

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 6);
  };

  return (
    <div className="w-full bg-[var(--community-ground)]">
      {/* Hero */}
      <CommunityViewAllHero
        label="02 — Calendar"
        titleWord1="ALL"
        titleWord2="EVENTS"
        description="Open days, workshops and demo days. Find what is coming up and catch up on what you missed."
      />

      {/* Toolbar: Segmented Toggle + Event Count */}
      <section className="w-full">
        <Container>
          <div className="mx-auto w-full max-w-7xl">
            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[var(--community-line)] pt-6 sm:pt-8">
              <div
                className="inline-flex rounded-full bg-[var(--community-soft2)] p-1"
                role="group"
                aria-label="Event timing"
              >
                <button
                  type="button"
                  onClick={() => {
                    setTab('upcoming');
                    setVisibleCount(6);
                  }}
                  className={`rounded-full px-5 py-2 font-mono text-xs font-semibold transition-all sm:text-sm ${
                    isUpcoming
                      ? 'bg-white text-black shadow-sm'
                      : 'text-[var(--community-muted)] hover:text-black'
                  }`}
                >
                  Upcoming
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTab('past');
                    setVisibleCount(6);
                  }}
                  className={`rounded-full px-5 py-2 font-mono text-xs font-semibold transition-all sm:text-sm ${
                    !isUpcoming
                      ? 'bg-white text-black shadow-sm'
                      : 'text-[var(--community-muted)] hover:text-black'
                  }`}
                >
                  Past events
                </button>
              </div>

              <span className="font-mono text-xs font-bold uppercase tracking-wider text-[var(--community-muted)]">
                {filteredEvents.length} events
              </span>
            </div>
          </div>
        </Container>
      </section>

      {/* Events List */}
      <section className="pb-20 pt-4 sm:pb-24 sm:pt-6">
        <Container>
          <div className="mx-auto w-full max-w-7xl">
            <div className="flex flex-col">
              {visibleEvents.map((event, idx) => {
                const isFirstUpcoming = isUpcoming && idx === 0;

                return (
                  <Link
                    key={`${event.id}-${idx}`}
                    to="/community/events"
                    className="community-erow flex-wrap items-center gap-4 border-b border-[var(--community-line)] py-5 sm:py-6 md:gap-8"
                  >
                    {/* Date Column */}
                    <div className="flex w-[130px] shrink-0 items-end gap-2.5 sm:w-[150px]">
                      <span
                        className={`font-sans text-[44px] font-extrabold leading-[0.85] sm:text-[52px] ${
                          event.isPast
                            ? 'text-[#8E9BB3]'
                            : 'text-black'
                        }`}
                      >
                        {event.dateNumeral}
                      </span>
                      <span
                        className={`pb-1 font-mono text-[10px] font-bold uppercase tracking-[0.14em] sm:text-[11px] ${
                          event.isPast
                            ? 'text-[var(--community-muted)]'
                            : 'text-[var(--community-blue)]'
                        }`}
                      >
                        {event.month}
                        <br />
                        {event.year}
                      </span>
                    </div>

                    {/* Main Content Column */}
                    <div className="flex min-w-[260px] flex-1 flex-col gap-1.5">
                      <span
                        className={`flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-[0.14em] sm:text-[11px] ${
                          event.isPast
                            ? 'text-[var(--community-muted)]'
                            : 'text-[var(--community-blue)]'
                        }`}
                      >
                        {event.type}
                        {isFirstUpcoming && (
                          <span className="flex items-center gap-1.5 text-black">
                            <i className="community-live" />
                            Next up
                          </span>
                        )}
                      </span>

                      <h3 className="community-ttl font-sans text-base font-extrabold uppercase leading-snug tracking-tight text-black sm:text-lg">
                        {event.title}
                      </h3>

                      <div className="flex flex-wrap gap-x-5 gap-y-1 font-mono text-xs text-[var(--community-muted)]">
                        <span>{event.time}</span>
                        <span>{event.venue}</span>
                      </div>
                    </div>

                    {/* Thumbnail */}
                    <div className="community-thumb h-[85px] w-[135px] shrink-0 overflow-hidden rounded-xl sm:h-[95px] sm:w-[150px] sm:rounded-2xl">
                      <CommunityImagePlaceholder
                        src={event.image}
                        alt={event.title}
                        tone={event.tone || (idx % 2 === 0 ? 'a' : 'b')}
                        label="Image"
                        className="community-zoom"
                      />
                    </div>

                    {/* Action */}
                    {event.isPast ? (
                      <div className="flex items-center gap-2.5">
                        <span className="community-ulink font-mono text-xs font-semibold text-[var(--community-muted)] sm:text-sm">
                          View recap
                        </span>
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
                      </div>
                    ) : (
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
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Pagination Footer */}
            {hasMore && (
              <div className="mt-14 flex justify-center sm:mt-16">
                <button
                  type="button"
                  onClick={handleLoadMore}
                  className="community-pill"
                >
                  <span>Load more events</span>
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
                      <path d="M12 5v14M6 13l6 6 6-6" />
                    </svg>
                  </i>
                </button>
              </div>
            )}
          </div>
        </Container>
      </section>
    </div>
  );
}
