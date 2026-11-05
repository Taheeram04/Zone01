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
import StoryDialog from './story-dialog.jsx';
import podcastCover from '../assets/Podcast.webp';
import { plainText } from '../lib/plain-text.js';
import { SOCIAL_LINKS, socialByKey } from '../social.js';

const PODCAST_PLAYLIST_URL =
  'https://youtube.com/playlist?list=PLrqp13m-1b2HjFPL9IaASYv2MhbPgbC25&si=4keocD_7bRFOcisP';

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

const PodcastFeature = () => (
  <motion.a
    href={PODCAST_PLAYLIST_URL}
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Watch the In The Zone Podcast playlist on YouTube"
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.25 }}
    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
    className="group relative mb-8 grid overflow-hidden rounded-3xl border border-white/20 bg-primary text-white shadow-[0_24px_70px_-24px_rgba(9,44,62,0.55)] md:mb-10 lg:grid-cols-[360px_minmax(0,1fr)]"
  >
    <div className="relative flex min-h-[260px] items-center justify-center overflow-hidden bg-[#06182E] p-4 sm:p-6 lg:min-h-[420px]">
      <img
        src={podcastCover}
        alt="In The Zone Podcast, Episode 2 — Accelerating Action"
        className="mx-auto block w-full max-w-[320px] rounded-2xl object-contain shadow-[0_20px_45px_-18px_rgba(0,0,0,0.8)] transition-transform duration-700 ease-out group-hover:scale-[1.03]"
      />
      <span className="absolute left-5 top-5 rounded-full bg-[#F59E0B] px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-secondary">
        Latest episode
      </span>
    </div>

    <div className="relative flex flex-col justify-center gap-4 p-6 sm:p-8 lg:p-10">
      <span className="inline-flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-[#F59E0B]">
        <FaMicrophone className="h-3.5 w-3.5" aria-hidden="true" />
        In The Zone Podcast
      </span>

      <h3 className="max-w-xl font-sans text-[26px] font-black leading-tight tracking-tight text-white sm:text-[32px]">
        Accelerating Action
        <span className="block pt-1 font-mono text-sm font-medium uppercase tracking-[0.14em] text-white/55">
          Episode 2 · Hosted by Cynthia Oyango
        </span>
      </h3>

      <p className="body-copy max-w-xl font-sans text-sm leading-relaxed text-white/70 sm:text-base">
        Real conversations with the builders, mentors and partners behind Zone01
        Kisumu — from first commit to first job and everything in between.
      </p>

      <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-3">
        <span className="inline-flex items-center gap-2.5 rounded-full bg-[#F59E0B] px-5 py-3 font-sans text-sm font-bold text-secondary shadow-[0_10px_30px_-10px_rgba(245,158,11,0.8)] transition-transform duration-300 group-hover:translate-x-1">
          <FaPlay className="ml-0.5 h-3.5 w-3.5" aria-hidden="true" />
          Watch the playlist
        </span>
        <span className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-white/50">
          <FaArrowUpRightFromSquare className="h-3 w-3" aria-hidden="true" />
          Opens on YouTube
        </span>
      </div>
    </div>
  </motion.a>
);

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
        // Keep the last good payload; otherwise leave the section empty until
        // the CMS loads instead of showing sample posts.
        setGroups((prev) => prev ?? null);
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
      aria-label="Community Hub"
      className="relative w-full overflow-hidden bg-white py-16 md:py-24"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <Container className="relative">
        <PodcastFeature />

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
          <div className="flex flex-col items-center gap-5 text-center lg:flex-row lg:items-center lg:justify-between lg:gap-6 lg:text-left">
            <div className="min-w-0 lg:flex-1">
              <h3 className="font-sans text-lg font-bold text-secondary">Follow the journey</h3>
              <p className="mt-1 text-sm text-black-900/60">
                New posts land on our socials first — join the conversation.
              </p>
            </div>
            <ul className="flex shrink-0 flex-nowrap items-center justify-center gap-2.5 sm:gap-3">
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
