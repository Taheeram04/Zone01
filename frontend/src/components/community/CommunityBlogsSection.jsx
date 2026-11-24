import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Container } from '../layout.jsx';
import CommunitySectionHeader from './CommunitySectionHeader.jsx';
import CommunityImagePlaceholder from './CommunityImagePlaceholder.jsx';
import { INITIAL_BLOGS_DATA } from '../../data/community-blogs.data.js';
import '../../styles/community.css';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

/**
 * Community Blogs Section
 *
 * Three-column auto-fit grid (min 320px, 40px col gap, 56px row gap).
 * Each card has an arch-shaped 3:4 cover (top corners fully rounded, bottom corners 32px),
 * category and read time monospace line, 21px Montserrat title, two-line excerpt,
 * and author row with 32px avatar circle and name.
 * On screens 1000px and wider the middle card is offset downward by 56px (.community-off).
 * Hover lifts card 6px and zooms the cover image.
 */
export default function CommunityBlogsSection() {
  const [blogs, setBlogs] = useState(
    INITIAL_BLOGS_DATA.filter((b) => !b.featured).slice(0, 3),
  );

  useEffect(() => {
    const controller = new AbortController();

    const fetchBlogs = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/community/`, {
          signal: controller.signal,
          cache: 'no-store',
        });
        if (!res.ok) return;
        const payload = await res.json();
        const blogPosts = Array.isArray(payload?.blog)
          ? payload.blog
          : Array.isArray(payload?.results?.blog)
            ? payload.results.blog
            : [];

        if (blogPosts.length > 0 && !controller.signal.aborted) {
          const mapped = blogPosts.slice(0, 3).map((post, idx) => ({
            id: post.id || `fetched-blog-${idx}`,
            slug: post.slug || `blog-${idx}`,
            title: post.title || INITIAL_BLOGS_DATA[idx + 1]?.title || 'Blog title placeholder that can run to three lines',
            excerpt: post.summary || post.body || INITIAL_BLOGS_DATA[idx + 1]?.excerpt || 'A short excerpt placeholder that gives readers a reason to open the article.',
            category: post.category || (idx === 0 ? 'Tutorial' : idx === 1 ? 'Career' : 'Community'),
            author: {
              name: post.author_name || '[Author name]',
              avatar: post.author_avatar || null,
            },
            readMinutes: post.read_minutes || '[0]',
            date: post.published_at ? new Date(post.published_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '[DD Mon YYYY]',
            cover: post.image || INITIAL_BLOGS_DATA[idx + 1]?.cover || null,
            tone: idx === 0 ? 'a' : idx === 1 ? 'c' : 'b',
          }));

          setBlogs(mapped);
        }
      } catch {
        // Fall back to initial blogs
      }
    };

    fetchBlogs();

    return () => controller.abort();
  }, []);

  const displayCards = blogs.slice(0, 3);
  while (displayCards.length < 3) {
    const nextItem = INITIAL_BLOGS_DATA[displayCards.length + 1] || INITIAL_BLOGS_DATA[1];
    displayCards.push(nextItem);
  }

  return (
    <section
      id="community-blogs"
      aria-labelledby="community-blogs-header"
      className="w-full bg-white py-16 md:py-20"
    >
      <Container>
        <div className="mx-auto w-full max-w-7xl">
          <CommunitySectionHeader
            step="03 — Blogs"
            titleLead="Stories from"
            titleAccent="the builders"
            description="Ideas, tutorials and reflections from apprentices, mentors and partners."
            viewAllText="View all blogs"
            viewAllLink="/community/blogs"
          />

          <div className="grid grid-cols-1 items-start gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {displayCards.map((blog, idx) => {
              const isMiddle = idx === 1;
              const offClass = isMiddle ? 'community-off' : '';
              const tone = blog.tone || (idx === 0 ? 'a' : idx === 1 ? 'c' : 'b');

              return (
                <Link
                  key={`${blog.id}-${idx}`}
                  to="/community/blogs"
                  className={`community-lift flex flex-col gap-4 sm:gap-5 ${offClass}`}
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

                    <h3 className="community-ttl line-clamp-2 font-sans text-base font-extrabold uppercase leading-snug tracking-tight text-black sm:text-[18px]">
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
        </div>
      </Container>
    </section>
  );
}
