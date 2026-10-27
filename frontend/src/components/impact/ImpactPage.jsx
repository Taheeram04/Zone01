// components/impact/ImpactPage.jsx
import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import '../../styles/impact.css';
import '../../styles/impact-brand.css';
import {
  IMPACT_HERO,
  REPORTING,
  FUNNEL,
  EMPLOYMENT_CARD,
  STARTUPS,
  STORIES,
} from '../../data/impact';
import CountUp from './CountUp';
import HeadlineBento from './HeadlineBento';
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
  { value: '86', label: 'In paid work' },
  { value: '97', label: 'Inaugural apprentices' },
  { value: '89%', label: 'Employment rate' },
  { value: '~6 weeks', label: 'Median to first job' },
  { value: '28,000+', label: 'Applications received' },
];

function DotGrid() {
  return (
    <div className="impact-dotbg" aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.5 }} />
  );
}

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

  const funnelRef = useRef(null);
  const funnelInView = useInView(funnelRef, { once: true, amount: 0.15 });

  const startupsRef = useRef(null);
  const startupsInView = useInView(startupsRef, { once: true, amount: 0.12 });

  const storiesRef = useRef(null);
  const storiesInView = useInView(storiesRef, { once: true, amount: 0.15 });

  return (
    <div className="impact-page" style={{ width: '100%', background: '#ffffff', overflowX: 'clip', fontFamily: 'var(--font-sans)' }}>
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
                {IMPACT_HERO.headlinePart1} <span style={{ color: '#BBD6FF' }}>{IMPACT_HERO.headlinePart2}</span>
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
        <img className="impact-results-bg" src={new URL('../../assets/impact-results-bg.webp', import.meta.url).href} alt="" aria-hidden="true" />
        <div className="impact-results-veil" aria-hidden="true" />
        <div className="impact-wrap" style={{ position: 'relative', zIndex: 1 }}>
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            style={{ margin: '16px 0 0', textAlign: 'center', fontWeight: 900, fontSize: 'var(--brand-section-size)', letterSpacing: '-.02em', lineHeight: 1.1, color: 'var(--brand-black)' }}
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

          <motion.h2
            id="selection"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            style={{ margin: '64px 0 0', textAlign: 'center', fontWeight: 900, fontSize: 'var(--brand-section-size)', letterSpacing: '-.02em', lineHeight: 1.1, color: 'var(--brand-black)' }}
          >
            Selection, <span style={{ color: '#0063F9' }}>employment</span> and income
          </motion.h2>

          <div ref={funnelRef} style={{ maxWidth: '1160px', margin: '72px auto 0', display: 'flex', flexWrap: 'wrap', gap: '56px', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ flex: '1.3 1 400px', minWidth: 0 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'center' }}>
                {FUNNEL.map((step, idx) => (
                  <motion.div
                    key={idx}
                    className="impact-funnel-step"
                    initial={{ opacity: 0, scale: 0.9, y: -20 }}
                    animate={funnelInView ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.9, y: -20 }}
                    transition={{ duration: 0.7, delay: idx * 0.16, ease: [0.16, 1, 0.3, 1] }}
                    whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                    style={{
                      width: step.width,
                      background: step.bg,
                      color: '#ffffff',
                      clipPath: idx === 0 ? 'polygon(0 0,100% 0,89% 100%,11% 100%)' : idx === 1 ? 'polygon(0 0,100% 0,88.5% 100%,11.5% 100%)' : idx === 2 ? 'polygon(0 0,100% 0,86.7% 100%,13.3% 100%)' : 'polygon(0 0,100% 0,86.4% 100%,13.6% 100%)',
                      padding: idx === 3 ? '30px 0 34px' : '30px 0',
                      boxSizing: 'border-box',
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '4px 14px',
                      alignItems: 'center',
                      justifyContent: 'center',
                      textAlign: 'center',
                      boxShadow: '0 8px 24px -6px rgba(0,0,0,0.18)',
                    }}
                  >
                    <span style={{ fontFamily: 'var(--brand-font-mono)', fontWeight: 500, fontSize: 'clamp(28px, 4.2vw, 48px)', letterSpacing: '-.02em' }}>
                      <CountUp value={step.value} inView={funnelInView} delay={idx * 0.16 + 0.1} />
                    </span>
                    <span className="impact-monoc" style={{ fontSize: '12px', whiteSpace: 'pre-line' }}>{step.label}</span>
                    <span className="impact-funnel-note">{step.note}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, x: 40, scale: 0.95 }}
              animate={funnelInView ? { opacity: 1, x: 0, scale: 1 } : { opacity: 0, x: 40, scale: 0.95 }}
              transition={{ duration: 0.8, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
              style={{ flex: '1 1 340px', minWidth: 0, maxWidth: '440px', position: 'relative', overflow: 'hidden', background: 'linear-gradient(160deg, var(--brand-navy) 0%, var(--brand-primary) 100%)', color: '#ffffff', borderRadius: 'var(--brand-radius-lg)', padding: '44px 40px', boxSizing: 'border-box', minHeight: '420px', display: 'flex', flexDirection: 'column' }}
            >
              <div style={{ position: 'absolute', right: '-90px', bottom: '-90px', width: '300px', height: '300px', borderRadius: '50%', background: 'radial-gradient(circle,#2F83FF,#0063F9 70%)' }} />
              <div className="impact-mono" style={{ fontSize: '12px', position: 'relative' }}>{EMPLOYMENT_CARD.title}</div>
              <div style={{ borderTop: '1px solid rgba(255,255,255,.45)', marginTop: '20px', position: 'relative' }} />
              <div className="impact-employment-main">
                <ProgressRing value={parseInt(EMPLOYMENT_CARD.percentage, 10)} inView={funnelInView} />
                <div style={{ flex: '1 1 150px', minWidth: 0 }}>
                  <div className="impact-mono" style={{ fontSize: '12px', color: '#BBD6FF' }}>{EMPLOYMENT_CARD.subtext}</div>
                  <div style={{ display: 'flex', gap: '26px', marginTop: '14px' }}>
                    {EMPLOYMENT_CARD.breakdown.map((item) => (
                      <div key={item.label}>
                        <div style={{ fontFamily: 'var(--brand-font-mono)', fontWeight: 500, fontSize: '40px', lineHeight: 1, letterSpacing: '-.02em' }}>{item.value}</div>
                        <div className="impact-mono" style={{ fontSize: '12px', marginTop: '6px', color: '#BBD6FF' }}>{item.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="impact-mono" style={{ fontSize: '12px', marginTop: 'auto', paddingTop: '32px', position: 'relative', lineHeight: 1.5 }}>{EMPLOYMENT_CARD.note}</div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* STARTUPS (3 DISTINCT INTERACTIVE CARDS) */}
      <section className="impact-startups-section" id="startups" data-nav-theme="light">
        <div className="impact-wrap">
          <div className="impact-startups-header">
            <div>
              <h2 className="impact-startups-title">
                Companies built by <span style={{ color: '#0063F9' }}>Zone01 Kisumu</span> talent.
              </h2>
            </div>
            <div className="impact-mono" style={{ color: '#0A3A9C', fontSize: '13px' }}>
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
                <div className="ri-story-category" style={{ margin: 0 }}>
                  {activeStartup.sector} &bull; {activeStartup.location || 'Nairobi, Kenya'} &bull; Founded {activeStartup.founded} &bull; {activeStartup.cohort}
                </div>
                <h3 id="startup-modal-title" className="ri-story-headline" style={{ fontSize: '26px', margin: 0, color: '#0A1A24' }}>
                  {activeStartup.name}
                </h3>
                <p style={{ fontSize: '16px', lineHeight: 1.55, color: '#334155', margin: 0 }}>
                  {activeStartup.tagline}
                </p>

                {activeStartup.mission && (
                  <div
                    style={{
                      background: '#F8FAFC',
                      borderRadius: 'var(--brand-radius-lg)',
                      padding: '20px 24px',
                      border: '1px solid #E2E8F0',
                      borderLeft: '4px solid #0063F9',
                    }}
                  >
                    <div className="impact-mono" style={{ color: '#0063F9', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase' }}>
                      The Gap in Kenya &amp; Why We Started
                    </div>
                    <p style={{ margin: '8px 0 0', fontSize: '15px', lineHeight: 1.65, color: '#0F172A', fontStyle: 'italic' }}>
                      &ldquo;{activeStartup.mission}&rdquo;
                    </p>
                    {activeStartup.clientModel && (
                      <div
                        style={{
                          marginTop: '12px',
                          paddingTop: '12px',
                          borderTop: '1px solid #E2E8F0',
                          fontSize: '13.5px',
                          color: '#334155',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                        }}
                      >
                        <span style={{ color: '#0063F9', fontWeight: 900 }}>✓</span>
                        <span><strong>Direct Model:</strong> {activeStartup.clientModel}</span>
                      </div>
                    )}
                  </div>
                )}

                {activeStartup.publicWork && (
                  <div>
                    <div className="impact-mono" style={{ color: '#0063F9', fontSize: '11.5px', fontWeight: 700, textTransform: 'uppercase', marginBottom: '10px' }}>
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
                            border: '1px solid #E2E8F0',
                          }}
                        >
                          <div style={{ fontWeight: 800, fontSize: '15px', color: '#0F172A' }}>{work.title}</div>
                          <p style={{ margin: '6px 0 0', fontSize: '13.5px', color: '#475569', lineHeight: 1.55 }}>{work.desc}</p>
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
                    borderTop: '1px solid #E2E8F0',
                  }}
                >
                  <div>
                    <div className="impact-mono" style={{ color: '#64748B', fontSize: '11px', textTransform: 'uppercase', fontWeight: 700 }}>
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
                              background: '#0063F9',
                              color: '#fff',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '11px',
                              fontWeight: 700,
                              flexShrink: 0,
                            }}
                          >
                            {f.initials}
                          </span>
                          <div>
                            <div style={{ fontWeight: 700, fontSize: '13.5px', color: '#0F172A' }}>{f.name}</div>
                            <div className="impact-mono" style={{ fontSize: '11px', color: '#64748B' }}>{f.role}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="impact-mono" style={{ color: '#64748B', fontSize: '11px', textTransform: 'uppercase', fontWeight: 700 }}>
                      Traction &amp; Metric
                    </div>
                    <div className="modal-stat">
                      {activeStartup.metric}
                    </div>
                    <p style={{ margin: '6px 0 0', fontSize: '13px', color: '#475569', lineHeight: 1.5 }}>
                      {activeStartup.tractionNote}
                    </p>
                  </div>

                  <div>
                    <div className="impact-mono" style={{ color: '#64748B', fontSize: '11px', textTransform: 'uppercase', fontWeight: 700 }}>
                      Tech Stack
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '10px' }}>
                      {activeStartup.techStack.map((tech, i) => (
                        <span
                          key={i}
                          className="impact-mono"
                          style={{
                            fontSize: '11px',
                            background: '#EEF2FF',
                            color: '#0057E0',
                            border: '1px solid #C7D2FE',
                            padding: '4px 9px',
                            borderRadius: '6px',
                            fontWeight: 600,
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
                    className="impact-btn impact-btn-primary"
                    onClick={() => setActiveStartup(null)}
                    style={{ padding: '10px 24px', fontSize: '13px', cursor: 'pointer' }}
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
              Real journeys. <span style={{ color: '#0063F9' }}>Transformational</span> impact.
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
                <div className="ri-story-category" style={{ margin: 0 }}>
                  {activeStory.category}
                </div>
                <h3 id="story-modal-title" className="ri-story-headline" style={{ fontSize: '24px', margin: 0 }}>
                  {activeStory.headline}
                </h3>
                <div className="impact-mono" style={{ fontSize: '12px', color: '#64748B' }}>
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
                      border: '1px solid #E2E8F0',
                      marginTop: '8px',
                    }}
                  >
                    <div>
                      <div className="impact-mono" style={{ fontSize: '11px', color: '#94A3B8', textTransform: 'uppercase' }}>
                        Before Zone01
                      </div>
                      <div className="journey-value journey-value--before">
                        {activeStory.journey.before}
                      </div>
                    </div>
                    <div>
                      <div className="impact-mono" style={{ fontSize: '11px', color: '#0063F9', textTransform: 'uppercase' }}>
                        During Zone01
                      </div>
                      <div className="journey-value journey-value--during">
                        {activeStory.journey.during}
                      </div>
                    </div>
                    <div>
                      <div className="impact-mono" style={{ fontSize: '11px', color: '#16A34A', textTransform: 'uppercase' }}>
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
                    <p key={idx} style={{ fontSize: '15px', lineHeight: 1.7, color: '#334155', margin: 0 }}>
                      {para}
                    </p>
                  ))}
                </div>

                <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end' }}>
                  <button
                    type="button"
                    className="impact-btn impact-btn-primary"
                    onClick={() => setActiveStory(null)}
                    style={{ padding: '10px 24px', fontSize: '13px', cursor: 'pointer' }}
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
