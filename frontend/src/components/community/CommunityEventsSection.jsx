import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Container } from '../layout.jsx';
import CommunitySectionHeader from './CommunitySectionHeader.jsx';
import CommunityImagePlaceholder from './CommunityImagePlaceholder.jsx';
import { INITIAL_EVENTS_DATA } from '../../data/community-events.data.js';
import '../../styles/community.css';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

/**
 * Community Events Section
 *
 * Placed on very light blue background (#EEF3FF).
 * Auto-fit grid (min 340px, 32px gap) of three ticket cards:
 * - Card 1: "Next up" event (primary blue fill, white text, pulsing live dot, countdown with blinking colons)
 * - Cards 2 & 3: White cards with thin image strip
 * - Notches on both edges and dashed divider
 * - Hover lifts card 6px
 */
export default function CommunityEventsSection() {
  const [events, setEvents] = useState(INITIAL_EVENTS_DATA.filter((e) => !e.isPast));

  useEffect(() => {
    const controller = new AbortController();

    const fetchEvents = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/community/`, {
          signal: controller.signal,
          cache: 'no-store',
        });
        if (!res.ok) return;
        const payload = await res.json();
        const eventPosts = Array.isArray(payload?.event)
          ? payload.event
          : Array.isArray(payload?.results?.event)
            ? payload.results.event
            : [];

        if (eventPosts.length > 0 && !controller.signal.aborted) {
          const mapped = eventPosts.map((ev, idx) => {
            const dateObj = ev.event_date ? new Date(ev.event_date) : null;
            return {
              id: ev.id || `fetched-event-${idx}`,
              title: ev.title || INITIAL_EVENTS_DATA[idx]?.title || 'Event title placeholder, two lines at most',
              type: ev.category || (idx === 0 ? 'Open day' : idx === 1 ? 'Workshop' : 'Demo day'),
              dateNumeral: dateObj ? String(dateObj.getDate()).padStart(2, '0') : 'DD',
              month: dateObj ? dateObj.toLocaleDateString('en-GB', { month: 'short' }) : 'Mon',
              year: dateObj ? String(dateObj.getFullYear()) : 'YYYY',
              startDate: ev.event_date || '2026-12-05',
              time: '[00:00 – 00:00 EAT]',
              venue: '[Venue placeholder], Kisumu',
              image: ev.image || null,
              registerUrl: ev.external_url || '/community/events',
              isPast: false,
              next: idx === 0,
              tone: idx === 0 ? 'c' : idx % 2 === 0 ? 'b' : 'a',
            };
          });

          setEvents(mapped);
        }
      } catch {
        // Fall back to INITIAL_EVENTS_DATA
      }
    };

    fetchEvents();

    return () => controller.abort();
  }, []);

  const displayCards = events.slice(0, 3);
  while (displayCards.length < 3) {
    displayCards.push(INITIAL_EVENTS_DATA[displayCards.length] || INITIAL_EVENTS_DATA[0]);
  }

  const nextUp = displayCards[0];
  const regularCards = displayCards.slice(1, 3);

  return (
    <section
      id="community-events"
      aria-labelledby="community-events-header"
      className="w-full bg-[var(--community-soft)] py-16 md:py-20"
    >
      <Container>
        <div className="w-full">
          <CommunitySectionHeader
            step="02 — Events"
            titleLead="Join us"
            titleAccent="in the Zone"
          />

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:gap-8">
            {/* Card 1: Next Up (Primary Blue) */}
            <Link
              to="/community/events"
              className="community-lift relative flex flex-col rounded-[28px] bg-[var(--community-blue)] text-white shadow-[0_30px_50px_-30px_rgba(0,99,249,0.7)]"
            >
              <div className="flex flex-col gap-5 p-6 pb-5 sm:p-7 sm:pb-5">
                <div className="flex items-start justify-between">
                  <div className="flex items-end gap-2.5">
                    <span className="font-sans text-[54px] font-extrabold leading-none sm:text-[60px]">
                      {nextUp.dateNumeral}
                    </span>
                    <span className="pb-1 font-mono text-[11px] font-bold uppercase tracking-[0.14em]">
                      {nextUp.month}
                    </span>
                  </div>
                  <span className="flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-[0.14em] sm:text-[11px]">
                    <i className="community-live" />
                    Next up
                  </span>
                </div>

                <div
                  className="flex items-center gap-1.5 font-mono text-xs sm:text-[13px]"
                  aria-label="Countdown placeholder"
                >
                  <span>00 d</span>
                  <b className="community-colon">:</b>
                  <span>00 h</span>
                  <b className="community-colon">:</b>
                  <span>00 m</span>
                </div>
              </div>

              {/* Punched out semicircular notches */}
              <i
                aria-hidden="true"
                className="absolute -left-3.5 top-[calc(50%-12px)] h-6 w-6 rounded-full bg-[var(--community-soft)] sm:h-7 sm:w-7"
              />
              <i
                aria-hidden="true"
                className="absolute -right-3.5 top-[calc(50%-12px)] h-6 w-6 rounded-full bg-[var(--community-soft)] sm:h-7 sm:w-7"
              />

              {/* Dashed divider */}
              <div className="mx-5 border-t-[1.5px] border-dashed border-white/45 sm:mx-6" />

              <div className="flex flex-1 flex-col gap-4 p-6 pt-5 sm:p-7 sm:pt-5">
                <span className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] opacity-85 sm:text-[11px]">
                  {nextUp.type}
                </span>

                <h3 className="font-sans text-base font-extrabold uppercase leading-snug tracking-tight sm:text-[18px]">
                  {nextUp.title}
                </h3>

                <div className="flex flex-col gap-1.5 font-mono text-xs opacity-90 sm:text-[13px]">
                  <span>{nextUp.time}</span>
                  <span>{nextUp.venue}</span>
                </div>

                <span className="community-pill community-pill-light mt-auto self-start">
                  <span>Register</span>
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
                </span>
              </div>
            </Link>

            {/* Cards 2 and 3: White Tickets */}
            {regularCards.map((card, idx) => (
              <Link
                key={`${card.id}-${idx}`}
                to="/community/events"
                className="community-lift relative flex flex-col rounded-[28px] bg-white shadow-[0_30px_50px_-36px_rgba(9,44,62,0.35)]"
              >
                <div className="flex flex-col gap-5 p-6 pb-5 sm:p-7 sm:pb-5">
                  <div className="flex items-start justify-between">
                    <div className="flex items-end gap-2.5">
                      <span className="font-sans text-[54px] font-extrabold leading-none text-black sm:text-[60px]">
                        {card.dateNumeral}
                      </span>
                      <span className="pb-1 font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--community-blue)]">
                        {card.month}
                      </span>
                    </div>
                    <span className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--community-muted)] sm:text-[11px]">
                      {card.type}
                    </span>
                  </div>

                  {/* Thin image strip */}
                  <div className="community-thumb h-[52px] w-full overflow-hidden rounded-xl sm:h-[60px]">
                    <CommunityImagePlaceholder
                      src={card.image}
                      alt={card.title}
                      tone={card.tone || (idx === 0 ? 'a' : 'b')}
                      label=""
                      className="community-zoom"
                    />
                  </div>
                </div>

                {/* Punched out semicircular notches */}
                <i
                  aria-hidden="true"
                  className="absolute -left-3.5 top-[calc(50%-12px)] h-6 w-6 rounded-full bg-[var(--community-soft)] sm:h-7 sm:w-7"
                />
                <i
                  aria-hidden="true"
                  className="absolute -right-3.5 top-[calc(50%-12px)] h-6 w-6 rounded-full bg-[var(--community-soft)] sm:h-7 sm:w-7"
                />

                {/* Dashed divider */}
                <div className="mx-5 border-t-[1.5px] border-dashed border-[var(--community-line)] sm:mx-6" />

                <div className="flex flex-1 flex-col gap-4 p-6 pt-5 sm:p-7 sm:pt-5">
                  <h3 className="community-ttl font-sans text-base font-extrabold uppercase leading-snug tracking-tight text-black sm:text-[18px]">
                    {card.title}
                  </h3>

                  <div className="flex flex-col gap-1.5 font-mono text-xs text-[var(--community-muted)] sm:text-[13px]">
                    <span>{card.time}</span>
                    <span>{card.venue}</span>
                  </div>

                  <span className="community-pill mt-auto self-start">
                    <span>Details</span>
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
                  </span>
                </div>
              </Link>
            ))}
          </div>

          {/* View All Events - Bottom Right */}
          <div className="mt-8 flex justify-end sm:mt-10">
            <Link to="/community/events" className="community-pill">
              <span>View all events</span>
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
      </Container>
    </section>
  );
}
