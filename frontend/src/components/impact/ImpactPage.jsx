// components/impact/ImpactPage.jsx
import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import '../../styles/impact.css';
import '../../styles/impact-brand.css';
import {
  IMPACT_HERO,
  REPORTING,
  // EMPLOYMENT_CARD,
  STARTUPS,
  STORIES,
} from '../../data/impact';
import CountUp from './CountUp';
import HeadlineBento from './HeadlineBento';
import gdgBgImg from '../../assets/gdg.jpg';
import impactHeroImg from '../../assets/impacthero.webp';
import startup1Img from '../../assets/zelani.webp';
import startup2Img from '../../assets/startup-2.webp';
import startup3Img from '../../assets/startup-3.webp';
import storyPlaceholder1 from '../../assets/story-placeholder-1.webp';
import storyPlaceholder2 from '../../assets/story-placeholder-2.webp';
import storyPlaceholder3 from '../../assets/impact6.webp';

const STARTUP_IMAGES = {
  'startup-1': startup1Img,
  'startup-2': startup2Img,
  'startup-3': startup3Img,
};

const STORY_IMAGES = {
  'story-1': storyPlaceholder1,
  'story-2': storyPlaceholder2,
  'story-3': storyPlaceholder3,
  'impact6': storyPlaceholder3,
};

const HERO_METRICS = [
  { value: '154', label: 'In paid work' },
  { value: '97', label: 'cohort 1 apprentices' },
  { value: '107', label: 'cohort 2 apprentices' },
  { value: '90%', label: 'Employment rate' },
  { value: '~2 weeks', label: 'to first job placement' },
  { value: '35,891+', label: 'Applications received' },
];

function DotGrid() {
  return (
    <div className="impact-dotbg" aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.5 }} />
  );
}

/*
function ProgressRing({ value, inView, size = 142, stroke = 12 }) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const targetOffset = circumference * (1 - value / 100);

  return (
    <div className="impact-progress-ring" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.18)"
          strokeWidth={stroke}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#FFFFFF"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={inView ? { strokeDashoffset: targetOffset } : { strokeDashoffset: circumference }}
          transition={{ duration: 1.4, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <div className="impact-progress-ring-label">
        <span className="impact-progress-ring-value">
          <CountUp value={`${value}%`} inView={inView} delay={0.4} duration={1.6} />
        </span>
        <span className="impact-mono">In paid work</span>
      </div>
    </div>
  );
}
*/

export default function ImpactPage({ children }) {
  const [activeStartup, setActiveStartup] = useState(null);
  const [activeStory, setActiveStory] = useState(null);


  // Give the impact route its own title and description for search and sharing.
  useEffect(() => {
    const previousTitle = document.title;
    const meta = document.querySelector('meta[name="description"]');
    const previousDescription = meta ? meta.getAttribute('content') : null;

    document.title = 'Impact & evidence — Zone01 Kisumu';
    if (meta) {
      meta.setAttribute(
        'content',
        'Date-stamped results from Zone01 Kisumu: 86 of 97 inaugural apprentices in paid work, an 89% employment rate, income outcomes, skills, transparency and methodology. As of August 2026.'
      );
    }

    return () => {
      document.title = previousTitle;
      if (meta && previousDescription !== null) meta.setAttribute('content', previousDescription);
    };
  }, []);

  // Scroll trigger refs for motion graphics
  const heroRef = useRef(null);
  const heroInView = useInView(heroRef, { once: true, amount: 0.2 });


  const startupsRef = useRef(null);
  const startupsInView = useInView(startupsRef, { once: true, amount: 0.12 });

  const storiesRef = useRef(null);
  const storiesInView = useInView(storiesRef, { once: true, amount: 0.15 });

  return (
    <div className="impact-page" style={{ width: '100%', background: 'var(--brand-white)', overflowX: 'clip', fontFamily: 'var(--brand-font-sans)' }}>
      {/* HERO */}
      <section
        data-nav-theme="dark"
        className="impact-hero-section impact-dotbg"
      >
        <DotGrid />
        <div ref={heroRef} className="impact-wrap" style={{ position: 'relative', zIndex: 1, width: '100%' }}>
          <div className="impact-hero-grid">
            <div className="impact-hero-content">
              <h1 className="impact-hero-title">
                <span className="impact-hero-title-our" style={{ color: 'var(--brand-white)' }}>{IMPACT_HERO.headlinePart1}</span>{' '}
                <span className="impact-hero-title-impact" style={{ color: 'var(--brand-black)' }}>{IMPACT_HERO.headlinePart2}</span>
              </h1>
              <p className="impact-hero-body">{IMPACT_HERO.body}</p>
              <div className="impact-hero-actions">
                <a href={IMPACT_HERO.cta1.href} className="impact-hero-btn-primary">
                  {IMPACT_HERO.cta1.label}
                </a>
                <Link to={IMPACT_HERO.cta2.href} className="impact-hero-btn-secondary">
                  {IMPACT_HERO.cta2.label}
                </Link>
              </div>
            </div>
            <div className="impact-hero-image-wrap">
              <div className="impact-hero-card">
                <img
                  src={impactHeroImg}
                  alt={IMPACT_HERO.photoAlt}
                  width={2750}
                  height={3437}
                  fetchPriority="high"
                  decoding="async"
                  loading="eager"
                  className="impact-hero-img"
                />
              </div>
              <div className="impact-hero-tagline">{IMPACT_HERO.tagline}</div>
            </div>
          </div>

          <div className="impact-hero-metrics" aria-label="Headline impact figures">
            {HERO_METRICS.map((metric, idx) => (
              <div key={metric.label} className="impact-hero-metric">
                <div className="impact-hero-metric-value">
                  <CountUp value={metric.value} inView={heroInView} delay={idx * 0.08} duration={1.5} />
                </div>
                <div className="impact-hero-metric-label">{metric.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HEADLINE RESULTS + SELECTION */}
      <section id="headline" className="impact-results-section" data-nav-theme="light">
        <img className="impact-results-bg" src={gdgBgImg} alt="" aria-hidden="true" />
        <div className="impact-results-veil" aria-hidden="true" />
        <div className="impact-wrap" style={{ position: 'relative', zIndex: 1 }}>
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            style={{ margin: '16px 0 0', textAlign: 'center', fontWeight: 'var(--brand-weight-black)', fontSize: 'var(--brand-section-size)', letterSpacing: '-.02em', lineHeight: 1.1, color: 'var(--brand-black)', fontFamily: 'var(--brand-font-sans)' }}
          >
            Headline results.
          </motion.h2>

          <motion.p
            className="impact-results-sub"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.55, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          >
            {REPORTING.note}
          </motion.p>

          <HeadlineBento />

        </div>
      </section>

      {/* STARTUPS (3 DISTINCT INTERACTIVE CARDS) */}
      <section className="impact-startups-section" id="startups" data-nav-theme="light">
        <div className="impact-wrap">
          <div className="impact-startups-header">
            <div>
              <h2 className="impact-startups-title">
                Companies built by <span style={{ color: 'var(--brand-primary)' }}>Zone01 Kisumu</span> talent.
              </h2>
            </div>
            <div className="impact-mono" style={{ color: 'var(--brand-navy)', fontSize: 'var(--brand-caption)' }}>
              3 Active Cohort 1 Ventures
            </div>
          </div>

          <div ref={startupsRef} className="impact-startups-grid">
            {STARTUPS.map((startup, idx) => {
              const cardClass = startup.theme === 'featured'
                ? 'startup-card startup-card-featured'
                : (startup.theme === 'emerald' || startup.theme === 'blue')
                ? 'startup-card startup-card-blue'
                : 'startup-card startup-card-indigo';

              return (
                <motion.article
                  key={startup.id}
                  className={cardClass}
                  initial={{ opacity: 0, y: 35 }}
                  animate={startupsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 35 }}
                  transition={{ duration: 0.7, delay: idx * 0.15, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div className="startup-card-banner">
                    <img
                      src={STARTUP_IMAGES[startup.imageKey]}
                      alt={startup.name}
                      width={800}
                      height={500}
                      loading="lazy"
                      className="startup-card-img"
                      style={startup.imageKey === 'startup-1' ? { objectPosition: 'center 0%' } : undefined}
                    />
                    <div className="startup-card-overlay" aria-hidden="true" />
                  </div>

                  <div className="startup-card-body">
                    <h3 className="startup-card-name">{startup.name}</h3>
                    <p className="startup-card-desc">{startup.shortDesc || startup.tagline}</p>

                    <div className="startup-card-footer">
                      <span className="startup-card-co-badge">
                        {startup.founders.length} Co-Founders &bull; {startup.cohort}
                      </span>
                      <button
                        type="button"
                        onClick={() => setActiveStartup(startup)}
                        className="startup-card-btn"
                        aria-label={`Read more about ${startup.name}`}
                      >
                        + Read More
                      </button>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </div>

        {/* Startup Modal (identical modal experience to Impact Stories) */}
        {activeStartup && (
          <div
            className="ri-story-modal-overlay"
            onClick={() => setActiveStartup(null)}
            role="dialog"
            aria-modal="true"
            aria-labelledby="startup-modal-title"
          >
            <div
              className="ri-story-modal-box"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="ri-story-modal-header">
                <img
                  src={STARTUP_IMAGES[activeStartup.imageKey]}
                  alt={activeStartup.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: activeStartup.imageKey === 'startup-1' ? 'center 0%' : 'center center',
                  }}
                />
                <button
                  type="button"
                  className="ri-story-modal-close"
                  onClick={() => setActiveStartup(null)}
                  aria-label="Close dialog"
                >
                  &times;
                </button>
              </div>

              <div className="ri-story-modal-body">
                <div className="ri-story-category" style={{ margin: 0, fontFamily: 'var(--brand-font-mono)', fontSize: 'var(--brand-caption)' }}>
                  {activeStartup.sector} &bull; {activeStartup.location || 'Nairobi, Kenya'} &bull; Founded {activeStartup.founded} &bull; {activeStartup.cohort}
                </div>
                <h3 id="startup-modal-title" className="ri-story-headline" style={{ fontSize: 'var(--brand-cta-size)', margin: 0, color: 'var(--brand-black)', fontFamily: 'var(--brand-font-sans)', fontWeight: 'var(--brand-weight-black)' }}>
                  {activeStartup.name}
                </h3>
                <p style={{ fontSize: 'var(--brand-body)', lineHeight: 1.6, color: 'var(--brand-slate)', margin: 0, fontFamily: 'var(--brand-font-sans)' }}>
                  {activeStartup.tagline}
                </p>

                {activeStartup.mission && (
                  <div
                    style={{
                      background: 'var(--brand-tint)',
                      borderRadius: 'var(--brand-radius-lg)',
                      padding: 'var(--brand-space-5) var(--brand-space-6)',
                      border: '1px solid var(--brand-line)',
                      borderLeft: '4px solid var(--brand-primary)',
                    }}
                  >
                    <div className="impact-mono" style={{ color: 'var(--brand-primary)', fontSize: 'var(--brand-caption)', fontWeight: 'var(--brand-weight-bold)', textTransform: 'uppercase' }}>
                      The Gap in Kenya &amp; Why We Started
                    </div>
                    <p style={{ margin: '8px 0 0', fontSize: 'var(--brand-body-sm)', lineHeight: 1.6, color: 'var(--brand-black)', fontStyle: 'italic', fontFamily: 'var(--brand-font-sans)' }}>
                      &ldquo;{activeStartup.mission}&rdquo;
                    </p>
                    {activeStartup.clientModel && (
                      <div
                        style={{
                          marginTop: '12px',
                          paddingTop: '12px',
                          borderTop: '1px solid var(--brand-line)',
                          fontSize: 'var(--brand-body-sm)',
                          color: 'var(--brand-slate)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          fontFamily: 'var(--brand-font-sans)',
                        }}
                      >
                        <span style={{ color: 'var(--brand-primary)', fontWeight: 'var(--brand-weight-black)' }}>✓</span>
                        <span><strong>Direct Model:</strong> {activeStartup.clientModel}</span>
                      </div>
                    )}
                  </div>
                )}

                {activeStartup.publicWork && (
                  <div>
                    <div className="impact-mono" style={{ color: 'var(--brand-primary)', fontSize: 'var(--brand-caption)', fontWeight: 'var(--brand-weight-bold)', textTransform: 'uppercase', marginBottom: '10px' }}>
                      Public Work &amp; Flagship Deployments
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '12px' }}>
                      {activeStartup.publicWork.map((work, wIdx) => (
                        <div
                          key={wIdx}
                          style={{
                            background: '#F8FAFC',
                            borderRadius: 'var(--brand-radius-lg)',
                            padding: '16px 18px',
                            border: '1px solid var(--brand-line)',
                          }}
                        >
                          <div style={{ fontFamily: 'var(--brand-font-sans)', fontWeight: 'var(--brand-weight-bold)', fontSize: 'var(--brand-body-sm)', color: 'var(--brand-black)' }}>{work.title}</div>
                          <p style={{ margin: '6px 0 0', fontFamily: 'var(--brand-font-sans)', fontSize: 'var(--brand-caption)', color: 'var(--brand-slate)', lineHeight: 1.55 }}>{work.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '20px',
                    paddingTop: '16px',
                    borderTop: '1px solid var(--brand-line)',
                  }}
                >
                  <div>
                    <div className="impact-mono" style={{ color: 'var(--brand-slate-soft)', fontSize: 'var(--brand-caption)', textTransform: 'uppercase', fontWeight: 'var(--brand-weight-bold)' }}>
                      Co-Founders (Zone01 Alumni)
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
                      {activeStartup.founders.map((f, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span
                            style={{
                              width: '28px',
                              height: '28px',
                              borderRadius: '50%',
                              background: 'var(--brand-primary)',
                              color: 'var(--brand-white)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontFamily: 'var(--brand-font-mono)',
                              fontSize: 'var(--brand-caption)',
                              fontWeight: 'var(--brand-weight-bold)',
                              flexShrink: 0,
                            }}
                          >
                            {f.initials}
                          </span>
                          <div>
                            <div style={{ fontFamily: 'var(--brand-font-sans)', fontWeight: 'var(--brand-weight-bold)', fontSize: 'var(--brand-body-sm)', color: 'var(--brand-black)' }}>{f.name}</div>
                            <div className="impact-mono" style={{ fontSize: 'var(--brand-caption)', color: 'var(--brand-slate-soft)' }}>{f.role}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="impact-mono" style={{ color: 'var(--brand-slate-soft)', fontSize: 'var(--brand-caption)', textTransform: 'uppercase', fontWeight: 'var(--brand-weight-bold)' }}>
                      Traction &amp; Metric
                    </div>
                    <div className="modal-stat" style={{ fontFamily: 'var(--brand-font-mono)', fontSize: 'var(--brand-stat-sm)', fontWeight: 'var(--brand-weight-medium)', color: 'var(--brand-black)' }}>
                      {activeStartup.metric}
                    </div>
                    <p style={{ margin: '6px 0 0', fontFamily: 'var(--brand-font-sans)', fontSize: 'var(--brand-body-sm)', color: 'var(--brand-slate)', lineHeight: 1.5 }}>
                      {activeStartup.tractionNote}
                    </p>
                  </div>

                  <div>
                    <div className="impact-mono" style={{ color: 'var(--brand-slate-soft)', fontSize: 'var(--brand-caption)', textTransform: 'uppercase', fontWeight: 'var(--brand-weight-bold)' }}>
                      Tech Stack
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '10px' }}>
                      {activeStartup.techStack.map((tech, i) => (
                        <span
                          key={i}
                          className="impact-mono"
                          style={{
                            fontFamily: 'var(--brand-font-mono)',
                            fontSize: 'var(--brand-caption)',
                            background: 'var(--brand-tint)',
                            color: 'var(--brand-primary)',
                            border: '1px solid var(--brand-line)',
                            padding: '4px 8px',
                            borderRadius: 'var(--brand-radius-sm)',
                            fontWeight: 'var(--brand-weight-medium)',
                          }}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end' }}>
                  <button
                    type="button"
                    className="brand-btn brand-btn--primary"
                    onClick={() => setActiveStartup(null)}
                    style={{ fontSize: 'var(--brand-body-sm)' }}
                  >
                    Close Details
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* STORIES OF IMPACT (RELIEF INTERNATIONAL FORMAT) */}
      <section className="ri-stories-section" id="stories" data-nav-theme="light">
        <div className="impact-wrap" ref={storiesRef}>
          <motion.div
            className="ri-stories-header"
            initial={{ opacity: 0, y: 24 }}
            animate={storiesInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2 className="ri-stories-title">
              Real journeys. <span style={{ color: 'var(--brand-primary)' }}>Transformational</span> impact.
            </h2>
            <p className="ri-stories-description">
              Direct firsthand accounts of how peer-to-peer software education is opening global digital economy opportunities for youth across Western Kenya.
            </p>
          </motion.div>

          <div className="ri-stories-grid">
            {STORIES.map((story, idx) => (
              <motion.article
                key={story.id}
                className="ri-story-card"
                initial={{ opacity: 0, x: 70, scale: 0.94 }}
                animate={storiesInView ? { opacity: 1, x: 0, scale: 1 } : { opacity: 0, x: 70, scale: 0.94 }}
                transition={{ duration: 0.8, delay: idx * 0.18, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -4, transition: { duration: 0.25 } }}
              >
                <div className="ri-story-thumbnail-wrap">
                  <img
                    src={STORY_IMAGES[story.imageKey]}
                    alt={story.headline}
                    className="ri-story-img"
                    loading="lazy"
                  />
                </div>

                <div className="ri-story-card-body">
                  <div className="ri-story-category">{story.category}</div>
                  <h3 className="ri-story-headline">{story.headline}</h3>
                  <p className="ri-story-text">{story.description}</p>
                  <div className="ri-story-footer">
                    <div className="ri-story-author">{story.author}</div>
                    <button
                      type="button"
                      className="ri-story-readmore"
                      onClick={() => setActiveStory(story)}
                      aria-label={`Read full story: ${story.headline}`}
                    >
                      <span className="ri-story-readmore-plus">+</span>
                      <span>Read More</span>
                    </button>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>

        {/* Story Modal */}
        {activeStory && (
          <div
            className="ri-story-modal-overlay"
            onClick={() => setActiveStory(null)}
            role="dialog"
            aria-modal="true"
            aria-labelledby="story-modal-title"
          >
            <div
              className="ri-story-modal-box"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="ri-story-modal-header">
                <img
                  src={STORY_IMAGES[activeStory.imageKey]}
                  alt={activeStory.headline}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <button
                  type="button"
                  className="ri-story-modal-close"
                  onClick={() => setActiveStory(null)}
                  aria-label="Close dialog"
                >
                  &times;
                </button>
              </div>

              <div className="ri-story-modal-body">
                <div className="ri-story-category" style={{ margin: 0, fontFamily: 'var(--brand-font-mono)', fontSize: 'var(--brand-caption)' }}>
                  {activeStory.category}
                </div>
                <h3 id="story-modal-title" className="ri-story-headline" style={{ fontSize: 'var(--brand-cta-size)', margin: 0, fontFamily: 'var(--brand-font-sans)', fontWeight: 'var(--brand-weight-black)', color: 'var(--brand-black)' }}>
                  {activeStory.headline}
                </h3>
                <div className="impact-mono" style={{ fontSize: 'var(--brand-caption)', color: 'var(--brand-slate-soft)', fontFamily: 'var(--brand-font-mono)' }}>
                  {activeStory.author}
                </div>

                {activeStory.journey && (
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
                      gap: '12px',
                      padding: '16px',
                      background: '#F8FAFC',
                      borderRadius: 'var(--brand-radius-lg)',
                      border: '1px solid var(--brand-line)',
                      marginTop: '8px',
                    }}
                  >
                    <div>
                      <div className="impact-mono" style={{ fontSize: 'var(--brand-caption)', color: 'var(--brand-slate-soft)', textTransform: 'uppercase', fontFamily: 'var(--brand-font-mono)' }}>
                        Before Zone01
                      </div>
                      <div className="journey-value journey-value--before">
                        {activeStory.journey.before}
                      </div>
                    </div>
                    <div>
                      <div className="impact-mono" style={{ fontSize: 'var(--brand-caption)', color: 'var(--brand-primary)', textTransform: 'uppercase', fontFamily: 'var(--brand-font-mono)' }}>
                        During Zone01
                      </div>
                      <div className="journey-value journey-value--during">
                        {activeStory.journey.during}
                      </div>
                    </div>
                    <div>
                      <div className="impact-mono" style={{ fontSize: 'var(--brand-caption)', color: 'var(--brand-mint-ink)', textTransform: 'uppercase', fontFamily: 'var(--brand-font-mono)' }}>
                        Current Outcome
                      </div>
                      <div className="journey-value journey-value--now">
                        {activeStory.journey.now}
                      </div>
                    </div>
                  </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '8px' }}>
                  {activeStory.fullParagraphs.map((para, idx) => (
                    <p key={idx} style={{ fontFamily: 'var(--brand-font-sans)', fontSize: 'var(--brand-body-sm)', lineHeight: 1.6, color: 'var(--brand-slate)', margin: 0 }}>
                      {para}
                    </p>
                  ))}
                </div>

                <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end' }}>
                  <button
                    type="button"
                    className="brand-btn brand-btn--primary"
                    onClick={() => setActiveStory(null)}
                    style={{ fontSize: 'var(--brand-body-sm)' }}
                  >
                    Close Story
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      {children}
    </div>
  );
}
