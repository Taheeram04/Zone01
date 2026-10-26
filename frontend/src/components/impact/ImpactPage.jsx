// components/impact/ImpactPage.jsx
import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import '../../styles/impact.css';
import {
  IMPACT_HERO,
  HEADLINE_STATS,
  FUNNEL,
  EMPLOYMENT_CARD,
  EARNINGS,
  STARTUPS,
  STORIES,
  GEOGRAPHIC,
} from '../../data/impact';
import PhotoSlot from './PhotoSlot';
import CountUp from './CountUp';
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

function DotGrid() {
  return (
    <div className="impact-dotbg" aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.5 }} />
  );
}

function GlobeSection() {
  const landPath = "M12 38 L26 30 L44 28 L58 26 L74 24 L92 22 L110 20 L128 18 L148 16 L168 14 L188 14 L208 16 L228 18 L248 20 L268 22 L288 24 L308 26 L328 28 L348 30 L368 32 L388 34 L408 36 L426 38 L444 40 L460 44 L474 50 L486 58 L494 68 L498 80 L498 92 L494 104 L486 114 L474 122 L460 128 L444 132 L426 134 L408 136 L388 138 L368 140 L348 142 L328 144 L308 146 L288 148 L268 150 L248 152 L228 154 L208 156 L188 158 L168 158 L148 156 L128 154 L110 152 L92 150 L74 148 L58 146 L44 144 L26 142 L12 140 L0 136 L-10 130 L-18 122 L-24 112 L-28 100 L-30 88 L-30 76 L-28 64 L-24 54 L-18 46 L-10 40 Z";

  return (
    <section style={{ padding: '112px 0', background: '#ffffff' }}>
      <div className="impact-wrap">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div style={{ flex: '1 1 520px', minWidth: 0 }}>
            <div className="impact-mono" style={{ color: '#0063F9' }}>{GEOGRAPHIC.label}</div>
            <h2 style={{ margin: '20px 0 0', fontWeight: 900, fontSize: 'clamp(40px, 5vw, 72px)', lineHeight: 1, letterSpacing: '-.03em', maxWidth: 900 }}>{GEOGRAPHIC.title}</h2>
            <p style={{ margin: '24px 0 0', fontSize: '19px', lineHeight: 1.6, maxWidth: 640, color: '#35507F' }}>{GEOGRAPHIC.body}</p>
          </div>
        </div>

        <div style={{ marginTop: '72px', display: 'flex', flexWrap: 'wrap', gap: '56px', alignItems: 'center' }}>
          <div style={{ flex: '1 1 520px', minWidth: 0, position: 'relative', minHeight: '520px' }} className="impact-gbox">
            <div className="impact-globe" style={{ width: '320px', height: '320px', borderRadius: '50%', background: 'radial-gradient(circle at 30% 30%, #ffffff, #D6E6FF 60%, #BBD6FF)', overflow: 'hidden', position: 'relative' }}>
              <svg viewBox="-40 -20 440 200" width="400" height="200" style={{ position: 'absolute', left: '-40px', top: '60px', opacity: 0.9 }}>
                <defs>
                  <path id="land" d={landPath} />
                </defs>
                <g className="impact-spin">
                  <use href="#land" fill="#0057E0" />
                  <use href="#land" x="640" fill="#0057E0" />
                </g>
              </svg>
              <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 35% 25%, rgba(255,255,255,.6), transparent 55%)' }} />
            </div>
            <div className="impact-orbit" />
            <div className="impact-gl impact-gl1">
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#0063F9' }} />
              <span className="impact-mono" style={{ color: '#0A3A9C' }}>{GEOGRAPHIC.stats[0].value} {GEOGRAPHIC.stats[0].label}</span>
            </div>
            <div className="impact-gl impact-gl2">
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#0063F9' }} />
              <span className="impact-mono" style={{ color: '#0A3A9C' }}>{GEOGRAPHIC.stats[1].value} {GEOGRAPHIC.stats[1].label}</span>
            </div>
            <div className="impact-gl impact-gl3">
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#0063F9' }} />
              <span className="impact-mono" style={{ color: '#0A3A9C' }}>{GEOGRAPHIC.stats[2].value} {GEOGRAPHIC.stats[2].label}</span>
            </div>
            <div className="impact-gl impact-gl4">
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#0063F9' }} />
              <span className="impact-mono" style={{ color: '#0A3A9C' }}>{GEOGRAPHIC.stats[3].value} {GEOGRAPHIC.stats[3].label}</span>
            </div>
            <div className="impact-gl impact-gl5">
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#0063F9' }} />
              <span className="impact-mono" style={{ color: '#0A3A9C' }}>{GEOGRAPHIC.stats[4].value} {GEOGRAPHIC.stats[4].label}</span>
            </div>
          </div>
          <div style={{ flex: '1 1 320px', minWidth: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {GEOGRAPHIC.stats.map((stat) => (
              <div key={stat.label} className="impact-stat">
                <div className="impact-statn">{stat.value}</div>
                <div className="impact-statl">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default function ImpactPage() {
  const [activeStartup, setActiveStartup] = useState(null);
  const [activeStory, setActiveStory] = useState(null);

  // Scroll trigger refs for motion graphics
  const statsRef = useRef(null);
  const statsInView = useInView(statsRef, { once: true, amount: 0.15 });

  const funnelRef = useRef(null);
  const funnelInView = useInView(funnelRef, { once: true, amount: 0.15 });

  const earningsRef = useRef(null);
  const earningsInView = useInView(earningsRef, { once: true, amount: 0.15 });

  const startupsRef = useRef(null);
  const startupsInView = useInView(startupsRef, { once: true, amount: 0.12 });

  const storiesRef = useRef(null);
  const storiesInView = useInView(storiesRef, { once: true, amount: 0.15 });

  return (
    <div style={{ width: '100%', background: '#ffffff', overflow: 'hidden', fontFamily: 'var(--font-sans)' }}>
      {/* HERO */}
      <section
        data-nav-theme="dark"
        className="impact-hero-section impact-dotbg"
      >
        <DotGrid />
        <div className="impact-wrap" style={{ position: 'relative', zIndex: 1, width: '100%' }}>
          <div className="impact-hero-grid">
            <div className="impact-hero-content">
              <div className="impact-hero-badge">{IMPACT_HERO.badge}</div>
              <h1 className="impact-hero-title">
                {IMPACT_HERO.headlinePart1} <span style={{ color: '#000000' }}>{IMPACT_HERO.headlinePart2}</span>
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
        </div>
      </section>

      {/* HEADLINE RESULTS + SELECTION */}
      <section style={{ background: '#BBD6FF', padding: '112px 0', position: 'relative', overflow: 'hidden' }}>
        <img src={new URL('../../assets/gdg.jpg', import.meta.url).href} alt="" aria-hidden="true" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: 'blur(12px)', opacity: 0.25, transform: 'scale(1.05)' }} />
        <div className="impact-wrap" style={{ position: 'relative', zIndex: 1 }}>
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            style={{ margin: 0, textAlign: 'center', fontWeight: 800, fontSize: 'clamp(32px, 4.4vw, 64px)', letterSpacing: '-.03em', lineHeight: 1.1, color: '#000000' }}
          >
            Headline results. As of August <span style={{ color: '#0063F9' }}>2026</span>
          </motion.h2>

          <div ref={statsRef} style={{ maxWidth: '1160px', margin: '72px auto 0', display: 'flex', flexWrap: 'wrap', gap: '64px 48px' }}>
            {HEADLINE_STATS.map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 32 }}
                animate={statsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 32 }}
                transition={{ duration: 0.65, delay: idx * 0.07, ease: [0.16, 1, 0.3, 1] }}
                className="impact-stat"
                style={{ flex: '1 1 280px' }}
              >
                <div className="impact-statn">
                  <CountUp value={stat.value} inView={statsInView} delay={idx * 0.07} duration={1.6} />
                </div>
                <div className="impact-statl">{stat.label}</div>
              </motion.div>
            ))}
          </div>

          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            style={{ margin: '160px 0 0', textAlign: 'center', fontWeight: 800, fontSize: 'clamp(32px, 4.4vw, 64px)', letterSpacing: '-.03em', lineHeight: 1.1, color: '#000000' }}
          >
            Selection, <span style={{ color: '#0063F9' }}>employment</span> and Income
          </motion.h2>

          <div ref={funnelRef} style={{ maxWidth: '1160px', margin: '72px auto 0', display: 'flex', flexWrap: 'wrap', gap: '56px', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ flex: '1.3 1 400px', minWidth: 0 }}>
              <div className="impact-mono" style={{ textAlign: 'center', color: '#0A3A9C', marginBottom: '24px', fontSize: '13px' }}>
                Selection funnel
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'center' }}>
                {FUNNEL.map((step, idx) => (
                  <motion.div
                    key={idx}
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
                    <span style={{ fontWeight: 800, fontSize: 'clamp(26px, 3vw, 40px)', letterSpacing: '-.02em' }}>
                      <CountUp value={step.value} inView={funnelInView} delay={idx * 0.16 + 0.1} />
                    </span>
                    <span className="impact-monoc" style={{ fontSize: '14px', whiteSpace: 'pre-line' }}>{step.label}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, x: 40, scale: 0.95 }}
              animate={funnelInView ? { opacity: 1, x: 0, scale: 1 } : { opacity: 0, x: 40, scale: 0.95 }}
              transition={{ duration: 0.8, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
              style={{ flex: '1 1 340px', minWidth: 0, maxWidth: '440px', position: 'relative', overflow: 'hidden', background: '#0A4DC4', color: '#ffffff', borderRadius: '28px', padding: '44px 40px', boxSizing: 'border-box', minHeight: '420px', display: 'flex', flexDirection: 'column' }}
            >
              <div style={{ position: 'absolute', right: '-90px', bottom: '-90px', width: '300px', height: '300px', borderRadius: '50%', background: 'radial-gradient(circle,#2F83FF,#0063F9 70%)' }} />
              <div className="impact-monoc" style={{ fontSize: '16px', fontWeight: 600, position: 'relative' }}>{EMPLOYMENT_CARD.title}</div>
              <div style={{ borderTop: '1px solid rgba(255,255,255,.45)', marginTop: '20px', position: 'relative' }} />
              <div style={{ fontWeight: 800, fontSize: '96px', lineHeight: 1, letterSpacing: '-.04em', marginTop: '40px', position: 'relative' }}>
                <CountUp value={EMPLOYMENT_CARD.percentage} inView={funnelInView} delay={0.45} duration={1.6} />
              </div>
              <div className="impact-monoc" style={{ fontSize: '16px', marginTop: '8px', position: 'relative' }}>{EMPLOYMENT_CARD.subtext}</div>
              <div className="impact-monoc" style={{ fontSize: '15px', marginTop: 'auto', paddingTop: '48px', position: 'relative', lineHeight: 1.5 }}>{EMPLOYMENT_CARD.note}</div>
            </motion.div>
          </div>
        </div>
      </section>


      {/* EARNINGS JOURNEY */}
      <section style={{ padding: '112px 0', background: '#E8F1FF' }}>
        <div className="impact-wrap" ref={earningsRef}>
          <div className="impact-mono" style={{ color: '#0A3A9C' }}>{EARNINGS.label}</div>
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            animate={earningsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            style={{ margin: '20px 0 0', fontWeight: 900, fontSize: 'clamp(40px, 5vw, 72px)', lineHeight: 1, letterSpacing: '-.03em', maxWidth: '900px' }}
          >
            From <span style={{ color: '#0063F9' }}>$60</span> at intake to <span style={{ color: '#0063F9' }}>$2,500</span> a month.
          </motion.h2>
          <p style={{ margin: '24px 0 0', fontSize: '19px', lineHeight: 1.6, maxWidth: '640px', color: '#35507F' }}>{EARNINGS.body}</p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '32px', marginTop: '56px', alignItems: 'stretch' }}>
            {/* Graph Bars tallying up on scroll */}
            <motion.div
              initial={{ opacity: 0, y: 35 }}
              animate={earningsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 35 }}
              transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
              style={{ flex: '2 1 560px', minWidth: 0, background: '#ffffff', borderRadius: '6px', padding: '40px 40px 32px', boxSizing: 'border-box' }}
            >
              <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-end', height: '420px', borderBottom: '2px solid #0A3A9C' }}>
                {EARNINGS.bars.map((bar, idx) => (
                  <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', gap: '10px', height: '100%' }}>
                    <motion.span
                      initial={{ opacity: 0, y: 15 }}
                      animate={earningsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
                      transition={{ duration: 0.5, delay: 0.25 + idx * 0.15 }}
                      style={{ fontWeight: 900, fontSize: '28px', color: bar.highlight ? '#0063F9' : '#000000' }}
                    >
                      <CountUp value={bar.value} inView={earningsInView} delay={0.25 + idx * 0.15} duration={1.5} />
                    </motion.span>
                    <motion.div
                      initial={{ height: 0 }}
                      animate={earningsInView ? { height: `${bar.height}px` } : { height: 0 }}
                      transition={{ duration: 1.1, delay: 0.15 + idx * 0.15, ease: [0.16, 1, 0.3, 1] }}
                      style={{
                        width: '100%',
                        background: bar.highlight ? '#0063F9' : idx === 0 ? '#9CC2FF' : idx === 1 ? '#6AA3FF' : '#3B84FA',
                        borderRadius: '3px 3px 0 0',
                      }}
                    />
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: '24px', marginTop: '14px' }}>
                {EARNINGS.barLabels.map((label, idx) => (
                  <div key={idx} className="impact-mono" style={{ flex: 1, textAlign: 'center', color: '#0A3A9C', fontSize: '11px' }}>{label}</div>
                ))}
              </div>
            </motion.div>

            {/* Side stats cards */}
            <div style={{ flex: '1 1 300px', minWidth: 0, display: 'flex', flexDirection: 'column', gap: '32px' }}>
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={earningsInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
                transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                style={{ background: '#0A3A9C', color: '#ffffff', borderRadius: '6px', padding: '36px', flex: 1, boxSizing: 'border-box' }}
              >
                <div className="impact-mono" style={{ color: '#BBD6FF' }}>{EARNINGS.genderCard.label}</div>
                <div style={{ fontWeight: 900, fontSize: '72px', lineHeight: 1, marginTop: '20px', letterSpacing: '-.03em' }}>
                  <CountUp value={EARNINGS.genderCard.value} inView={earningsInView} delay={0.3} duration={1.6} />
                </div>
                <p style={{ margin: '12px 0 0', fontSize: '18px', lineHeight: 1.5 }}>{EARNINGS.genderCard.text}</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={earningsInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
                transition={{ duration: 0.7, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
                style={{ background: '#0063F9', color: '#ffffff', borderRadius: '6px', padding: '36px', flex: 1, boxSizing: 'border-box' }}
              >
                <div className="impact-mono">{EARNINGS.annualCard.label}</div>
                <div style={{ fontWeight: 900, fontSize: '56px', lineHeight: 1, marginTop: '20px', letterSpacing: '-.03em' }}>
                  <CountUp value={EARNINGS.annualCard.value} inView={earningsInView} delay={0.45} duration={1.8} />
                </div>
                <p style={{ margin: '12px 0 0', fontSize: '18px', lineHeight: 1.5 }}>{EARNINGS.annualCard.text}</p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* STARTUPS (3 DISTINCT INTERACTIVE CARDS) */}
      <section className="impact-startups-section" id="startups">
        <div className="impact-wrap">
          <div className="impact-startups-header">
            <div>
              <div className="impact-mono" style={{ color: '#0063F9' }}>Venture Creation</div>
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

              const isFeatured = startup.theme === 'featured';

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
                      style={startup.imageKey === 'startup-1' ? { objectPosition: 'center 15%' } : undefined}
                    />
                    <div className="startup-card-overlay">
                      <div className="startup-card-tags">
                        <span className="startup-sector-pill">{startup.sector}</span>
                        {isFeatured ? (
                          <span className="startup-featured-badge">★ Featured Venture</span>
                        ) : (
                          <span
                            className="impact-mono"
                            style={{
                              fontSize: '11px',
                              fontWeight: 700,
                              color: startup.stageColor,
                              background: startup.stageBg,
                              padding: '4px 10px',
                              borderRadius: '999px',
                            }}
                          >
                            {startup.stage}
                          </span>
                        )}
                      </div>
                      <div style={{ color: '#ffffff', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                        <span className="impact-mono" style={{ fontSize: '11px', opacity: 0.9 }}>Founded {startup.founded}</span>
                        <span className="impact-mono" style={{ fontSize: '11px', opacity: 0.9 }}>{startup.cohort}</span>
                      </div>
                    </div>
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
                    objectPosition: activeStartup.imageKey === 'startup-1' ? 'center 15%' : 'center center',
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
                      borderRadius: '14px',
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
                            borderRadius: '12px',
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
                    <div style={{ fontWeight: 800, fontSize: '18px', color: '#0F172A', marginTop: '8px' }}>
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
      <section className="ri-stories-section" id="stories">
        <div className="impact-wrap" ref={storiesRef}>
          <motion.div
            className="ri-stories-header"
            initial={{ opacity: 0, y: 24 }}
            animate={storiesInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="ri-stories-eyebrow">Stories of Impact</div>
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
                whileHover={{ y: -6, transition: { duration: 0.25 } }}
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
                  <div className="ri-story-author">{story.author}</div>
                  <button
                    type="button"
                    className="ri-story-readmore"
                    onClick={() => setActiveStory(story)}
                    aria-label={`Read full story: ${story.headline}`}
                  >
                    <span className="ri-story-readmore-plus">+</span>
                    <span>READ MORE</span>
                  </button>
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
                      borderRadius: '12px',
                      border: '1px solid #E2E8F0',
                      marginTop: '8px',
                    }}
                  >
                    <div>
                      <div className="impact-mono" style={{ fontSize: '11px', color: '#94A3B8', textTransform: 'uppercase' }}>
                        Before Zone01
                      </div>
                      <div style={{ fontSize: '13px', fontWeight: 600, color: '#334155', marginTop: '4px' }}>
                        {activeStory.journey.before}
                      </div>
                    </div>
                    <div>
                      <div className="impact-mono" style={{ fontSize: '11px', color: '#0063F9', textTransform: 'uppercase' }}>
                        During Zone01
                      </div>
                      <div style={{ fontSize: '13px', fontWeight: 600, color: '#0063F9', marginTop: '4px' }}>
                        {activeStory.journey.during}
                      </div>
                    </div>
                    <div>
                      <div className="impact-mono" style={{ fontSize: '11px', color: '#16A34A', textTransform: 'uppercase' }}>
                        Current Outcome
                      </div>
                      <div style={{ fontSize: '13px', fontWeight: 600, color: '#16A34A', marginTop: '4px' }}>
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

    </div>
  );
}
