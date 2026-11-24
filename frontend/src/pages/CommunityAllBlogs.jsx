import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Container } from '../components/layout.jsx';
import CommunityViewAllHero from '../components/community/CommunityViewAllHero.jsx';
import CommunityImagePlaceholder from '../components/community/CommunityImagePlaceholder.jsx';
import { INITIAL_BLOGS_DATA } from '../data/community-blogs.data.js';
import '../styles/community.css';

const TABS = ['All', 'Tutorials', 'Career', 'Community', 'Stories'];

/**
 * Community All Blogs Page (/community/blogs)
 *
 * Structure:
 * - Shared View All Hero
 * - Featured blog post (large arch cover on left max 440px, large text on right, "Read article" pill)
 * - Tab and search toolbar (All, Tutorials, Career, Community, Stories) with client-side filtering
 * - 3-column CSS multi-column masonry mixing arch 3:4, 4:3 and 1:1 covers
 * - "Load more" pill
 */
export default function CommunityAllBlogs() {
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(9);

  const featuredBlog =
    INITIAL_BLOGS_DATA.find((b) => b.featured) || INITIAL_BLOGS_DATA[0];

  const gridPool = INITIAL_BLOGS_DATA.filter((b) => b.id !== featuredBlog.id);

  // Client-side filtering
  const filteredBlogs = gridPool.filter((item) => {
    const tabNorm = activeTab.toLowerCase();
    const catNorm = item.category.toLowerCase();
    const matchesTab =
      activeTab === 'All' ||
      catNorm === tabNorm ||
      (tabNorm === 'tutorials' && catNorm === 'tutorial');

    const query = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !query ||
      item.title.toLowerCase().includes(query) ||
      item.excerpt.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query) ||
      item.author.name.toLowerCase().includes(query);

    return matchesTab && matchesSearch;
  });

  const visibleBlogs = filteredBlogs.slice(0, visibleCount);
  const hasMore = visibleCount < filteredBlogs.length;

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 6);
  };

  return (
    <div className="w-full bg-[var(--community-ground)]">
      {/* Hero */}
      <CommunityViewAllHero
        label="03 — Journal"
        titleWord1="ALL"
        titleWord2="BLOGS"
        description="Ideas, tutorials and reflections from apprentices, mentors and partners across Zone01 Kisumu."
      />

      {/* Featured Blog Post */}
      <section className="pb-12 pt-0 sm:pb-16">
        <Container>
          <div className="mx-auto w-full max-w-7xl">
            <Link
              to="/community/blogs"
              className="community-lift flex flex-wrap items-center gap-8 lg:gap-14"
            >
              {/* Arch Cover: 3:4, max 340px */}
              <div className="community-thumb relative aspect-[3/4] max-h-[360px] min-w-[min(260px,100%)] flex-[0_1_340px] overflow-hidden rounded-[999px_999px_28px_28px]">
                <CommunityImagePlaceholder
                  src={featuredBlog.cover}
                  alt={featuredBlog.title}
                  tone={featuredBlog.tone || 'c'}
                  label="Featured cover 3:4"
                  className="community-zoom"
                />
              </div>

              {/* Content Right */}
              <div className="flex flex-[1_1_340px] flex-col gap-4">
                <span className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--community-blue)] sm:text-[11px]">
                  Featured &nbsp;/&nbsp; {featuredBlog.category} &nbsp;/&nbsp; {featuredBlog.readMinutes} min read
                </span>

                <h2 className="community-ttl font-sans text-[clamp(20px,2.2vw,28px)] font-extrabold uppercase leading-[1.15] tracking-tight text-black">
                  {featuredBlog.title}
                </h2>

                <p className="max-w-[480px] font-mono text-xs leading-relaxed text-[var(--community-muted)] sm:text-sm">
                  {featuredBlog.excerpt}
                </p>

                <div className="flex items-center gap-2.5 font-mono text-xs text-black sm:text-[13px]">
                  <span className="h-8 w-8 shrink-0 rounded-full bg-[var(--community-soft2)]" />
                  <span>
                    {featuredBlog.author?.name || '[Author name]'} &middot; {featuredBlog.date}
                  </span>
                </div>

                <span className="community-pill self-start">
                  <span>Read article</span>
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
          </div>
        </Container>
      </section>

      {/* Toolbar */}
      <section className="w-full">
        <Container>
          <div className="mx-auto w-full max-w-7xl">
            <div className="flex flex-wrap items-center justify-between gap-3 border-y border-[var(--community-line)] py-1.5 md:gap-6">
            {/* Category Tabs */}
            <div
              role="tablist"
              aria-label="Filter blogs"
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
              <label htmlFor="blogs-search-input" className="sr-only">
                Search blogs
              </label>
              <input
                id="blogs-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setVisibleCount(9);
                }}
                placeholder="Search blogs..."
                className="w-full bg-transparent font-mono text-sm text-black placeholder:text-[var(--community-muted)] focus:outline-none"
              />
            </div>
          </div>
        </div>
      </Container>
    </section>

    {/* Masonry Grid */}
    <section className="pb-20 pt-10 sm:pb-24 sm:pt-12">
      <Container>
        <div className="mx-auto w-full max-w-7xl">
          {visibleBlogs.length === 0 ? (
            <div className="py-20 text-center font-mono text-sm text-[var(--community-muted)]">
              No blog posts found matching your criteria.
            </div>
          ) : (
            <div className="grid grid-cols-1 items-start gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
              {visibleBlogs.map((blog, idx) => {
                const tone = blog.tone || (idx % 4 === 0 ? 'a' : idx % 3 === 0 ? 'b' : idx % 2 === 0 ? 'd' : 'c');

                return (
                  <Link
                    key={`${blog.id}-${idx}`}
                    to="/community/blogs"
                    className="community-lift group flex flex-col gap-4 sm:gap-5"
                  >
                    {/* Arch-shaped cover: top corners fully rounded (999px), bottom corners 24px, capped max-height */}
                    <div className="community-thumb relative aspect-[4/3] max-h-[280px] w-full overflow-hidden rounded-[999px_999px_24px_24px] sm:aspect-[3/4] sm:max-h-[320px]">
                      <CommunityImagePlaceholder
                        src={blog.cover}
                        alt={blog.title}
                        tone={tone}
                        label="Cover 3:4"
                        className="community-zoom"
                      />
                    </div>

                    <div className="flex flex-col gap-2.5 px-1">
                      <span className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--community-blue)] sm:text-[11px]">
                        {blog.category} &nbsp;/&nbsp; {blog.readMinutes} min read
                      </span>

                      <h3 className="community-ttl line-clamp-2 font-sans text-base font-extrabold uppercase leading-snug tracking-tight text-black transition-colors duration-200 group-hover:text-[var(--community-blue)] sm:text-[18px]">
                        {blog.title}
                      </h3>

                      <p className="line-clamp-2 font-mono text-xs leading-relaxed text-[var(--community-muted)] sm:text-sm">
                        {blog.excerpt}
                      </p>

                      <div className="mt-1 flex items-center gap-2.5 font-mono text-xs text-black sm:text-[13px]">
                        <span className="h-7 w-7 shrink-0 rounded-full bg-[var(--community-soft2)]" />
                        <span>{blog.author?.name || '[Author name]'}</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}

          {/* Pagination Footer */}
          {hasMore && (
            <div className="mt-14 flex justify-center sm:mt-16">
              <button
                type="button"
                onClick={handleLoadMore}
                className="community-pill"
              >
                <span>Load more blogs</span>
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
