import { useState } from 'react';
import { Link } from 'react-router-dom';
import CommunityViewAllHero from '../components/community/CommunityViewAllHero.jsx';
import CommunityImagePlaceholder from '../components/community/CommunityImagePlaceholder.jsx';
import { INITIAL_NEWS_DATA } from '../data/community-news.data.js';
import '../styles/community.css';

const TABS = ['All', 'Announcements', 'Partnerships', 'Apprentices', 'Impact'];

/**
 * Community All News Page (/community/news)
 *
 * Structure:
 * - Shared View All Hero
 * - Pinned featured story (5:4 image left, large text right)
 * - Toolbar between two hairlines with category filter tabs and search field
 * - 3-column grid of 4:3 cards
 * - "Showing N of [total]" line and "Load more" pill with client-side paging (9 initial)
 */
export default function CommunityAllNews() {
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(9);

  const pinnedStory =
    INITIAL_NEWS_DATA.find((item) => item.pinned) || INITIAL_NEWS_DATA[0];

  // Exclude pinned story from the main grid
  const gridPool = INITIAL_NEWS_DATA.filter((item) => item.id !== pinnedStory.id);

  // Client-side filtering
  const filteredItems = gridPool.filter((item) => {
    const matchesTab =
      activeTab === 'All' ||
      item.category.toLowerCase() === activeTab.toLowerCase();
    const query = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !query ||
      item.title.toLowerCase().includes(query) ||
      item.excerpt.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query);
    return matchesTab && matchesSearch;
  });

  const visibleItems = filteredItems.slice(0, visibleCount);
  const hasMore = visibleCount < filteredItems.length;

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 9);
  };

  return (
    <div className="w-full bg-[var(--community-ground)]">
      {/* Hero */}
      <CommunityViewAllHero
        label="01 — Archive"
        titleWord1="ALL"
        titleWord2="NEWS"
        description="Every announcement, partnership and milestone from Zone01 Kisumu, newest first."
      />

      {/* Pinned Featured Story */}
      <section className="pb-24 pt-0">
        <div className="mx-auto max-w-[1240px] px-8">
          <Link
            to="/community/news"
            className="community-lift flex flex-wrap items-center gap-12 lg:gap-[72px]"
          >
            <div className="community-thumb relative aspect-[5/4] min-w-[min(300px,100%)] flex-[1.1_1_480px] overflow-hidden rounded-[36px]">
              <CommunityImagePlaceholder
                src={pinnedStory.image}
                alt={pinnedStory.title}
                tone={pinnedStory.tone || 'c'}
                label="Featured image 5:4"
                className="community-zoom"
              />
              <i
                className="community-orb"
                aria-hidden="true"
                style={{ width: '130px', height: '130px', top: '8%', right: '8%' }}
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
            </div>

            <div className="flex flex-[1_1_380px] flex-col gap-5">
              <span className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--community-blue)]">
                Pinned &nbsp;/&nbsp; {pinnedStory.category} &nbsp;/&nbsp; {pinnedStory.date}
              </span>

              <h2 className="community-ttl font-sans text-[clamp(24px,2.6vw,36px)] font-extrabold uppercase leading-[1.15] tracking-tight text-black">
                {pinnedStory.title}
              </h2>

              <p className="font-mono text-[15px] leading-[1.75] text-[var(--community-muted)]">
                {pinnedStory.excerpt}
              </p>

              <span className="community-ulink self-start text-sm font-semibold text-[var(--community-blue)]">
                Read the story
              </span>
            </div>
          </Link>
        </div>
      </section>

      {/* Toolbar */}
      <section className="w-full">
        <div className="mx-auto max-w-[1240px] px-8">
          <div className="flex flex-wrap items-center justify-between gap-4 border-y border-[var(--community-line)] py-1.5 md:gap-8">
            {/* Category Tabs */}
            <div
              role="tablist"
              aria-label="Filter news"
              className="flex flex-wrap items-center gap-1 sm:gap-4"
            >
              {TABS.map((tab) => {
                const isActive = activeTab === tab;
                return (
                  <button
                    key={tab}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => {
                      setActiveTab(tab);
                      setVisibleCount(9);
                    }}
                    className={`min-h-[48px] border-b-2 px-3 py-3 font-mono text-sm font-medium transition-colors ${
                      isActive
                        ? 'border-[var(--community-blue)] text-[var(--community-blue)]'
                        : 'border-transparent text-[var(--community-muted)] hover:text-black'
                    }`}
                  >
                    {tab}
                  </button>
                );
              })}
            </div>

            {/* Rounded Search Field */}
            <div className="flex min-h-[48px] min-w-[260px] flex-[0_1_320px] items-center gap-3 rounded-full border border-[var(--community-line)] bg-white px-5">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--community-muted)"
                strokeWidth="2"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
              <label htmlFor="news-search-input" className="sr-only">
                Search news
              </label>
              <input
                id="news-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setVisibleCount(9);
                }}
                placeholder="Search news..."
                className="w-full bg-transparent font-mono text-sm text-black placeholder:text-[var(--community-muted)] focus:outline-none"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Grid of Cards */}
      <section className="pb-32 pt-16">
        <div className="mx-auto max-w-[1240px] px-8">
          {visibleItems.length === 0 ? (
            <div className="py-20 text-center font-mono text-sm text-[var(--community-muted)]">
              No news articles found matching your criteria.
            </div>
          ) : (
            <div className="grid grid-cols-[repeat(auto-fit,minmax(min(320px,100%),1fr))] gap-x-8 gap-y-14">
              {visibleItems.map((item, idx) => (
                <Link
                  key={`${item.id}-${idx}`}
                  to="/community/news"
                  className="community-lift flex flex-col gap-6"
                >
                  <div className="community-thumb relative aspect-[4/3] w-full overflow-hidden rounded-[28px]">
                    <CommunityImagePlaceholder
                      src={item.image}
                      alt={item.title}
                      tone={item.tone || (idx % 4 === 0 ? 'a' : idx % 3 === 0 ? 'b' : idx % 2 === 0 ? 'd' : 'c')}
                      label="Image 4:3"
                      className="community-zoom"
                    />
                  </div>

                  <div className="flex flex-col gap-3">
                    <span className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--community-blue)]">
                      {item.category} &nbsp;/&nbsp; {item.date}
                    </span>

                    <h3 className="community-ttl line-clamp-3 font-sans text-[20px] font-extrabold uppercase leading-[1.25] tracking-tight text-black">
                      {item.title}
                    </h3>

                    <p className="line-clamp-3 font-mono text-[14px] leading-[1.7] text-[var(--community-muted)]">
                      {item.excerpt}
                    </p>

                    <span className="community-ulink mt-1 self-start font-mono text-sm font-semibold text-[var(--community-blue)]">
                      Read more
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Pagination Footer */}
          <div className="mt-20 flex flex-col items-center gap-6 text-center">
            <span className="font-mono text-xs tracking-wider text-[var(--community-muted)]">
              Showing {Math.min(visibleItems.length, filteredItems.length)} of{' '}
              {filteredItems.length} news items
            </span>

            {hasMore && (
              <button
                type="button"
                onClick={handleLoadMore}
                className="community-pill"
              >
                <span>Load more news</span>
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
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
