// components/community-feed.jsx
import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useInView, useReducedMotion } from 'framer-motion';
import {
  FaArrowUpRightFromSquare,
  FaBullhorn,
  FaCalendarDays,
  FaChevronDown,
  FaMicrophone,
  FaPenNib,
  FaPlay,
} from 'react-icons/fa6';
import { Container } from './layout.jsx';
import { KineticHeading } from './whocanapply.jsx';
import StoryDialog from './story-dialog.jsx';
import { plainText } from '../lib/plain-text.js';
import { SOCIAL_LINKS, socialByKey } from '../social.js';
import communityHeroImg from '../assets/community-hero.webp';

/*
 * "Community Hub" — the four content streams that live under Our Staff.
 *
 * News, Events, Blog and Podcast are each a single collapsed row that shows
 * only the latest item. Clicking (or keyboard-activating) a row expands it to
 * reveal every published post in that group. Content is served by the Django
 * CMS at /api/community/ so editors add, edit or delete posts in the admin and
 * the change appears here on the next load.
 */

const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

// How long a fetched payload is reused before we ask the API again (ms).
const REFRESH_MS = 60_000;

const GROUPS = [
  {
    kind: 'news',
    label: 'News',
    blurb: 'Announcements and milestones',
    Icon: FaBullhorn,
    accent: '#35D6B4',
  },
  {
    kind: 'event',
    label: 'Events',
    blurb: 'Open days, bootcamps and meetups',
    Icon: FaCalendarDays,
    accent: '#99C2FF',
  },
  {
    kind: 'blog',
    label: 'Blog',
    blurb: 'Stories and lessons from campus',
    Icon: FaPenNib,
    accent: '#8B5CF6',
  },
  {
    kind: 'podcast',
    label: 'Podcast',
    blurb: 'Conversations with our community',
    Icon: FaMicrophone,
    accent: '#F59E0B',
  },
];

// Shown in development when the API cannot be reached, so the section is never
// blank while editors are still filling the CMS.
const FALLBACK = {
  news: [
    {
      id: 1,
      title: 'US Embassy delegation visits Zone01 Kisumu',
      summary: 'Partners toured the campus and met our learners building real products.',
      image: communityHeroImg,
      platform: 'linkedin',
      external_url: 'https://www.linkedin.com/company/zone01kisumu/',
      published_at: '2026-09-28T09:00:00+03:00',
    },
  ],
  event: [
    {
      id: 2,
      title: 'Piscine #7 kick-off',
      summary: 'Four weeks of peer-to-peer immersion start on campus.',
      platform: 'instagram',
      external_url: 'https://www.instagram.com/zone01_kisumu/',
      event_date: '2026-11-02T09:00:00+03:00',
      published_at: '2026-09-20T09:00:00+03:00',
    },
  ],
  blog: [
    {
      id: 3,
      title: 'Why peer learning beats lectures',
      summary: 'How collaboration turns raw potential into job-ready engineers.',
      platform: 'website',
      published_at: '2026-09-10T09:00:00+03:00',
    },
  ],
  podcast: [
    {
      id: 4,
      title: 'Voices of Zone01 — Episode 1',
      summary: 'Learners and coaches on the mindset it takes to finish the Piscine.',
      video_url: 'https://www.youtube.com/@Zone01Kisumu',
      platform: 'youtube',
      published_at: '2026-09-01T09:00:00+03:00',
    },
  ],
};

const dateFormatter = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
});

const formatDate = (value) => {
  if (!value) return '';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '' : dateFormatter.format(date);
};

const actionFor = (kind) => {
  if (kind === 'podcast') return 'Listen';
  if (kind === 'event') return 'Event details';
  return 'Read more';
};

// A small coloured pill showing which social account a post came from.
const PlatformBadge = ({ platform }) => {
  const social = socialByKey(platform);
  if (!social) return null;
  const { Icon, label, color } = social;
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full border border-secondary/15 bg-secondary/5 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-secondary/70"
      title={`From ${label}`}
    >
      <Icon className="h-3 w-3" style={{ color }} aria-hidden="true" />
      {label.split(' ')[0]}
    </span>
  );
};

const PostCard = ({ post, group, index, onReadMore }) => {
  const { Icon, accent } = group;
  const link = post.external_url || post.video_url || '';
  const hasVideo = Boolean(post.video_url);
  const date = post.kind === 'event' && post.event_date ? post.event_date : post.published_at;
  const bodyText = plainText(post.body);
  const hasStory = Boolean(post.body) && bodyText.length > (post.summary?.length || 0);

  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.4), ease: [0.16, 1, 0.3, 1] }}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-secondary/15 bg-white transition-colors hover:border-secondary/30 hover:bg-campus-bg/40"
    >
      {/* Media */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#F1F5F9]">
        {post.image ? (
          <img
            src={post.image}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div
            className="flex h-full w-full items-center justify-center"
            style={{ background: `radial-gradient(circle at 30% 20%, ${accent}33, transparent 70%)` }}
          >
            <Icon className="h-10 w-10 text-secondary/25" aria-hidden="true" />
          </div>
        )}

        {hasVideo && (
          <span className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/25">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-secondary shadow-lg transition-transform duration-300 group-hover:scale-110">
              <FaPlay className="ml-0.5 h-4 w-4" aria-hidden="true" />
            </span>
          </span>
        )}

        <span
          className="absolute left-3 top-3 rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-secondary"
          style={{ backgroundColor: accent }}
        >
          {group.label}
        </span>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-3 flex flex-wrap items-center gap-2 text-[11px] font-medium text-black-900/50">
          {formatDate(date) && <time dateTime={date}>{formatDate(date)}</time>}
          {formatDate(date) && <span aria-hidden="true">•</span>}
          <PlatformBadge platform={post.platform} />
        </div>

        <h4 className="font-sans text-lg font-bold leading-snug text-secondary">{post.title}</h4>

        {(post.summary || post.body) && (
          <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-black-900/65">
            {post.summary || bodyText}
          </p>
        )}

        <div className="mt-auto flex flex-wrap items-center gap-x-5 gap-y-2 pt-5">
          {hasStory && (
            <button
              type="button"
              onClick={onReadMore}
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-secondary"
            >
              Read more
              <FaArrowUpRightFromSquare className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          )}
          {link && (
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-secondary"
            >
              {actionFor(post.kind)}
              <FaArrowUpRightFromSquare className="h-3.5 w-3.5" aria-hidden="true" />
            </a>
          )}
        </div>
      </div>
    </motion.article>
  );
};

const GroupRow = ({ group, posts, open, onToggle, reduced, onReadMore }) => {
  const { Icon, accent, label, blurb, kind } = group;
  const latest = posts[0];
  const panelId = `community-panel-${kind}`;
  const buttonId = `community-tab-${kind}`;

  return (
    <div
      className={`overflow-hidden rounded-2xl border transition-colors ${
        open
          ? 'border-primary/30 bg-campus-bg'
          : 'border-secondary/15 bg-white hover:border-secondary/30'
      }`}
    >
      <button
        type="button"
        id={buttonId}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={onToggle}
        className="flex w-full items-center gap-4 px-4 py-5 text-left sm:px-6"
      >
        {/* Group icon — echoes the accent colour when open */}
        <span
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-colors"
          style={{ backgroundColor: open ? accent : 'rgba(15,23,42,0.05)' }}
        >
          <Icon
            className={`h-5 w-5 ${open ? 'text-secondary' : 'text-secondary/65'}`}
            aria-hidden="true"
          />
        </span>

        {/* Label + latest preview */}
        <span className="min-w-0 flex-1">
          <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span className="font-sans text-base font-black uppercase tracking-wide text-secondary sm:text-lg">
              {label}
            </span>
            <span className="rounded-full border border-secondary/15 px-2 py-0.5 font-mono text-[10px] text-secondary/55">
              {posts.length}
            </span>
          </span>
          <span className="mt-1 block truncate text-sm text-black-900/60">
            {latest ? `${latest.title}` : `${blurb} — nothing here yet`}
          </span>
        </span>

        {/* Count on wide screens, chevron always */}
        <span className="hidden shrink-0 text-right text-xs text-black-900/40 md:block">{blurb}</span>

        <FaChevronDown
          className={`h-4 w-4 shrink-0 text-secondary/60 transition-transform duration-300 ${
            open ? 'rotate-180' : ''
          }`}
          aria-hidden="true"
        />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="panel"
            id={panelId}
            role="region"
            aria-labelledby={buttonId}
            initial={reduced ? false : { height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={reduced ? { opacity: 0 } : { height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="border-t border-secondary/10 px-4 pb-6 pt-6 sm:px-6">
              {posts.length === 0 ? (
                <p className="py-6 text-center text-sm text-black-900/50">
                  No {label.toLowerCase()} yet — check back soon.
                </p>
              ) : (
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {posts.map((post, i) => (
                    <PostCard
                      key={post.id}
                      post={post}
                      group={group}
                      index={i}
                      onReadMore={() => onReadMore(post)}
                    />
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const CommunityFeed = () => {
  const [groups, setGroups] = useState(null);
  const [streams, setStreams] = useState(null);
  const [storyPost, setStoryPost] = useState(null);
  const [openKind, setOpenKind] = useState('news');
  const [paused, setPaused] = useState(false);
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { amount: 0.15 });
  const reduced = useReducedMotion();

  // Read inside the polling interval without recreating it (and refetching)
  // every time the pointer enters or leaves the section.
  const visibilityRef = useRef({ inView: false, paused: false });
  useEffect(() => {
    visibilityRef.current = { inView, paused };
  }, [inView, paused]);

  // Pull the grouped payload from the CMS and refresh it while in view.
  useEffect(() => {
    const controller = new AbortController();

    const load = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/community/`, {
          signal: controller.signal,
          cache: 'no-store',
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const payload = await res.json();
        setGroups(payload.results || payload);
        setStreams(Array.isArray(payload.streams) ? payload.streams : null);
      } catch (error) {
        if (error?.name === 'AbortError') return;
        // Keep the last good payload; in development fall back to samples so
        // the design is visible without the backend running.
        setGroups((prev) => prev ?? (import.meta.env.DEV ? FALLBACK : null));
      }
    };

    load();
    const timer = window.setInterval(() => {
      const { inView: visible, paused: held } = visibilityRef.current;
      if (visible && !held) load();
    }, REFRESH_MS);

    return () => {
      window.clearInterval(timer);
      controller.abort();
    };
  }, []);

  // Only render rows that the CMS has activated and that contain a post.
  const resolved = useMemo(() => {
    const streamList = streams && streams.length ? streams : null;
    const activeKinds = streamList
      ? new Set(streamList.filter((stream) => stream.is_active).map((stream) => stream.kind))
      : new Set(GROUPS.map((group) => group.kind));
    const streamByKind = new Map((streamList || []).map((stream) => [stream.kind, stream]));

    return GROUPS.filter((group) => activeKinds.has(group.kind))
      .map((group) => ({
        group: {
          ...group,
          label: streamByKind.get(group.kind)?.label || group.label,
        },
        posts: Array.isArray(groups?.[group.kind]) ? groups[group.kind] : [],
      }))
      .filter(({ posts }) => posts.length > 0);
  }, [groups, streams]);

  const toggle = (kind) => setOpenKind((current) => (current === kind ? null : kind));

  return (
    <section
      ref={sectionRef}
      id="community-hub"
      data-nav-theme="light"
      aria-labelledby="community-hub-title"
      className="relative w-full overflow-hidden bg-white py-16 md:py-24"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <Container className="relative">
        <div className="mx-auto mb-10 max-w-3xl text-center md:mb-14">
          <KineticHeading
            as="h2"
            id="community-hub-title"
            text="Community Hub"
            className="font-sans font-black leading-tight tracking-tight text-secondary text-[30px] md:text-section-headline"
          />
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-black-900/65 sm:text-base"
          >
            The latest news, events, blog posts and podcast episodes from the
            Zone01 Kisumu community.
          </motion.p>
        </div>

        {/* Group accordion — only active streams with posts are shown */}
        {resolved.length > 0 && (
          <div className="mx-auto flex max-w-5xl flex-col gap-3">
            {resolved.map(({ group, posts }) => (
              <GroupRow
                key={group.kind}
                group={group}
                posts={posts}
                open={openKind === group.kind}
                onToggle={() => toggle(group.kind)}
                reduced={reduced}
                onReadMore={setStoryPost}
              />
            ))}
          </div>
        )}

        {/* Social strip — same accounts as the footer */}
        <div className="mx-auto mt-12 max-w-5xl rounded-2xl border border-secondary/15 bg-campus-bg px-5 py-6 sm:px-8">
          <div className="flex flex-col items-center gap-5 text-center sm:flex-row sm:justify-between sm:text-left">
            <div>
              <h3 className="font-sans text-lg font-bold text-secondary">Follow the journey</h3>
              <p className="mt-1 text-sm text-black-900/60">
                New posts land on our socials first — join the conversation.
              </p>
            </div>
            <ul className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
              {SOCIAL_LINKS.map(({ key, Icon, href, label, color }) => (
                <li key={key}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-secondary/15 bg-white text-secondary/70 transition-all hover:scale-105 hover:text-white"
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
      </Container>

      <StoryDialog
        open={Boolean(storyPost)}
        onClose={() => setStoryPost(null)}
        title={storyPost?.title}
        image={storyPost?.image}
        html={storyPost?.body}
      />
    </section>
  );
};

export default CommunityFeed;
