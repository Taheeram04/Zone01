// components/community-featured-article.jsx
import { useEffect, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Container } from './layout.jsx';
import StoryDialog from './story-dialog.jsx';
import { plainText } from '../lib/plain-text.js';
import mainLogo from '../assets/mainlogo.webp';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '';
const REFRESH_MS = 60_000;
const EXCERPT_LENGTH = 220;

const KIND_LABELS = {
  news: 'News',
  event: 'Events',
  blog: 'Blog',
  podcast: 'Podcast',
};

const FALLBACK_ARTICLE = {
  title: 'Exploring Gemini AI at Build with AI Kisumu',
  excerpt:
    'On May 4th 2024, we gathered at the University of Nairobi, Kisumu Campus for the GDG-hosted Build with AI, an event focused on integrating Gemini AI into applications via an Application Programming Interface (API) key.',
  story: '',
  storyText: '',
  kind: 'News',
  image: null,
};

const fallbackExcerpt = (value) => {
  const text = value?.trim();
  if (!text) return '';
  return text.length > EXCERPT_LENGTH
    ? `${text.slice(0, EXCERPT_LENGTH).trimEnd()}…`
    : text;
};

const toArticle = ({
  title,
  excerpt,
  story,
  image,
  publishedAt,
  kind = 'News',
  featured = false,
  order = 0,
}) => ({
  title: title?.trim() || FALLBACK_ARTICLE.title,
  excerpt: fallbackExcerpt(excerpt) || FALLBACK_ARTICLE.excerpt,
  story: story || '',
  storyText: plainText(story || ''),
  kind,
  image: image || null,
  publishedAt: new Date(publishedAt || 0).getTime(),
  featured,
  order,
});

/**
 * Featured article banner shown above the Community Hub. It follows the newest
 * published item from every active stream — News, Events, Blog and Podcast —
 * plus the dedicated News admin. CMS edits appear here without a code change,
 * and long stories open in a full-story dialog.
 */
const CommunityFeaturedArticle = () => {
  const [articles, setArticles] = useState([FALLBACK_ARTICLE]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [storyOpen, setStoryOpen] = useState(false);

  const article = articles[activeIndex] || FALLBACK_ARTICLE;

  useEffect(() => {
    const controller = new AbortController();

    const load = async () => {
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

        const communityGroups = communityPayload?.results || communityPayload || {};
        const streams = Array.isArray(communityPayload?.streams)
          ? communityPayload.streams
          : null;
        const activeKinds = streams
          ? new Set(streams.filter((stream) => stream.is_active).map((stream) => stream.kind))
          : null;
        const streamLabels = new Map((streams || []).map((stream) => [stream.kind, stream.label]));

        const communityArticles = Object.entries(communityGroups).flatMap(
          ([kind, posts]) => {
            if (!Array.isArray(posts)) return [];
            if (activeKinds && !activeKinds.has(kind)) return [];
            return posts.map((post) =>
              toArticle({
                title: post.title,
                excerpt: post.summary || plainText(post.body),
                story: post.body,
                kind: streamLabels.get(kind) || KIND_LABELS[kind] || kind,
                image: post.image,
                publishedAt: post.published_at,
                featured: Boolean(post.is_featured),
                order: post.order || 0,
              }),
            );
          },
        );

        const newsUpdates = Array.isArray(newsPayload?.results)
          ? newsPayload.results
          : Array.isArray(newsPayload)
            ? newsPayload
            : [];
        const newsArticles = newsUpdates.map((post) =>
          toArticle({
            title: post.title,
            excerpt: plainText(post.information),
            story: post.information,
            kind: 'News',
            image: post.image,
            publishedAt: post.published_at,
            featured: Boolean(post.is_featured),
            order: post.order || 0,
          }),
        );

        const allArticles = [...communityArticles, ...newsArticles];
        const featuredArticles = allArticles
          .filter((item) => item.featured)
          .sort(
            (a, b) =>
              a.order - b.order || b.publishedAt - a.publishedAt,
          );
        const nextArticles = featuredArticles.length
          ? featuredArticles
          : [...allArticles].sort((a, b) => b.publishedAt - a.publishedAt).slice(0, 1);

        if (!nextArticles.length || controller.signal.aborted) return;
        setArticles(nextArticles);
        setActiveIndex((current) => (current < nextArticles.length ? current : 0));
      } catch (error) {
        if (error?.name === 'AbortError') return;
        // Keep the bundled fallback when the CMS/API is unreachable.
      }
    };

    load();
    const timer = window.setInterval(load, REFRESH_MS);
    const onVisible = () => {
      if (document.visibilityState === 'visible') load();
    };
    document.addEventListener('visibilitychange', onVisible);

    return () => {
      window.clearInterval(timer);
      document.removeEventListener('visibilitychange', onVisible);
      controller.abort();
    };
  }, []);

  // Rotate through multiple featured posts; pause while a full story is open.
  useEffect(() => {
    if (articles.length < 2 || storyOpen) return undefined;
    const timer = window.setInterval(
      () => setActiveIndex((index) => (index + 1) % articles.length),
      8000,
    );
    return () => window.clearInterval(timer);
  }, [articles.length, storyOpen]);

  const hasMore = Boolean(
    article.storyText && article.storyText.length > article.excerpt.length,
  );

  return (
    <>
      <section
        data-nav-theme="light"
        aria-labelledby="featured-article-title"
        className="w-full bg-white py-8 md:py-12"
      >
        <Container>
          <article className="grid gap-6 md:grid-cols-[minmax(170px,0.8fr)_minmax(190px,0.85fr)_minmax(0,2fr)] md:items-center md:gap-8 lg:gap-10">
            {/* Branding & call to action */}
            <div className="flex flex-col items-start gap-6">
              <Link to="/" aria-label="Zone01 Kisumu home" className="inline-flex">
                <img
                  src={mainLogo}
                  alt="Zone 01 Kisumu"
                  width="311"
                  height="118"
                  className="h-10 w-auto md:h-12"
                />
              </Link>

              <a
                href="#community-hub"
                className="group inline-flex items-center gap-1.5 border-b border-secondary/25 pb-1 font-mono text-sm font-bold uppercase tracking-[0.08em] text-secondary transition-colors hover:border-primary hover:text-primary"
              >
                Read all Articles
                <ArrowUpRight
                  className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </a>
            </div>

            {/* Featured image (or an empty placeholder until a cover is added) */}
            <div
              role={article.image ? undefined : 'img'}
              aria-label={article.image ? undefined : 'Featured article image placeholder'}
              className="aspect-square w-full max-w-[190px] overflow-hidden border border-[#E5E7EB] bg-white"
            >
              {article.image ? (
                <img
                  src={article.image}
                  alt={article.title}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              ) : null}
            </div>

            {/* Article content */}
            <div>
              <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                {article.kind ? (
                  <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-secondary/55">
                    {article.kind}
                  </p>
                ) : (
                  <span />
                )}
                {articles.length > 1 && (
                  <div
                    role="tablist"
                    aria-label="Featured posts"
                    className="flex items-center gap-1.5"
                  >
                    {articles.map((item, index) => (
                      <button
                        key={`${item.title}-${index}`}
                        type="button"
                        role="tab"
                        aria-selected={index === activeIndex}
                        aria-label={`Show featured post ${index + 1}: ${item.title}`}
                        onClick={() => setActiveIndex(index)}
                        className={`h-1.5 rounded-full transition-all ${
                          index === activeIndex
                            ? 'w-5 bg-primary'
                            : 'w-1.5 bg-secondary/25 hover:bg-secondary/40'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
              <h2
                id="featured-article-title"
                className="line-clamp-2 font-sans text-[22px] font-black uppercase leading-[1.1] tracking-tight text-primary sm:text-[26px] md:text-[28px] lg:text-[32px]"
              >
                {article.title}
              </h2>
              <p className="mt-3 line-clamp-3 max-w-2xl font-mono text-sm leading-[1.6] text-[#111827] md:mt-4 md:text-[15px]">
                {article.excerpt}
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-4">
                {hasMore && (
                  <button
                    type="button"
                    onClick={() => setStoryOpen(true)}
                    className="group inline-flex items-center gap-1.5 border-b border-primary/30 pb-0.5 font-mono text-xs font-bold uppercase tracking-[0.08em] text-primary transition-colors hover:border-secondary hover:text-secondary"
                  >
                    Read more
                    <ArrowUpRight
                      className="h-3 w-3 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                      aria-hidden="true"
                    />
                  </button>
                )}
              </div>
            </div>
          </article>
        </Container>
      </section>

      <StoryDialog
        open={storyOpen}
        onClose={() => setStoryOpen(false)}
        title={article.title}
        image={article.image}
        html={article.story}
      />
    </>
  );
};

export default CommunityFeaturedArticle;
