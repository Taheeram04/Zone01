// components/impact/HeadlineBento.jsx
import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import CountUp from './CountUp';
import '../../styles/headline-bento.css';
import { HEADLINE_STATS } from '../../data/impact';

const findStat = (label) => HEADLINE_STATS.find((stat) => stat.label === label) || { value: '', label: '', note: '' };

const EARNINGS =
  HEADLINE_STATS.find((stat) => stat.label.toLowerCase().includes('earnings')) ||
  { value: '417%', label: 'in apprentice earnings', note: '' };
// const PAID = findStat('Apprentices and graduates in paid work');
// const SPEED = findStat('Median time to employment after graduation');
// const COHORT = findStat('Inaugural cohort apprentices');
// const DEMAND = findStat('Applications received');
const MONTHLY = findStat('Average monthly income');
const ANNUAL = findStat('Average annual income');
const TOP = findStat('Top monthly income');
const WOMEN = findStat('Earning more than USD 2,300 per month');

function BentoRing({ value, inView }) {
  const safeValue = Number.isFinite(value) ? value : 0;
  const progress = Math.min(100, Math.max(0, safeValue));

  return (
    <div className="hb-ring" aria-hidden="true">
      <svg viewBox="0 0 160 160">
        <circle cx="80" cy="80" r="66" className="hb-ring-track" />
        <motion.circle
          cx="80"
          cy="80"
          r="66"
          className="hb-ring-value"
          initial={{ strokeDashoffset: 2 * Math.PI * 66 }}
          whileInView={{ strokeDashoffset: 2 * Math.PI * 66 * (1 - progress / 100) }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 1.4, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        />
      </svg>
      <span className="hb-ring-label">
        <CountUp value={`${safeValue}%`} inView={inView} delay={0.3} duration={1.4} />
      </span>
    </div>
  );
}

/*
function Dots() {
  return (
    <div className="hb-dots" aria-hidden="true">
      {Array.from({ length: 97 }).map((_, index) => (
        <span key={index} className={index < 86 ? 'hb-dot is-filled' : 'hb-dot'} />
      ))}
    </div>
  );
}
*/

export default function HeadlineBento() {
  const gridRef = useRef(null);
  const inView = useInView(gridRef, { once: true, amount: 0.12 });

  const card = (index) => ({
    initial: { opacity: 0, y: 28 },
    animate: inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 },
    whileHover: { y: -4, transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] } },
    transition: { duration: 0.6, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] },
  });

  return (
    <div className="hb-grid" ref={gridRef}>
      {/* Key outcome — electric blue feature card */}
      <motion.article className="hb-card hb-card--blue hb-key" {...card(0)}>
        <div className="hb-card-top">
          <span className="hb-eyebrow">Key outcome</span>
          <span className="hb-badge"><i className="hb-dot-mint" />Primary metric</span>
        </div>
        <div className="hb-key-body">
          <BentoRing value={parseInt(EARNINGS.value, 10)} inView={inView} />
          <h3 className="hb-card-title">Increase in apprentice earnings</h3>
        </div>
        <ul className="hb-key-list">
          <li><i className="hb-dot-mint" /><strong>90%</strong> in paid work (326 apprentices)</li>
          <li><i className="hb-dot-mint" /><strong>34%</strong> currently in training or selected for Cohort 3 (112 apprentices)</li>
        </ul>
      </motion.article>

      {/* Placement — dot matrix (commented out)
      <motion.article className="hb-card hb-placement" {...card(1)}>
        <div className="hb-card-top">
          <span className="hb-eyebrow hb-eyebrow--primary">Placement</span>
          <span className="hb-meta">86 / 97</span>
        </div>
        <Dots />
        <div className="hb-card-foot">
          <div className="hb-stat">{PAID.value}</div>
          <p className="hb-caption">{PAID.label}</p>
        </div>
      </motion.article>
      */}

      {/* Speed — weeks to hire slider (commented out)
      <motion.article className="hb-card hb-speed" {...card(2)}>
        <div className="hb-card-top">
          <span className="hb-eyebrow hb-eyebrow--primary">Speed</span>
          <span className="hb-meta">Weeks to hire</span>
        </div>
        <div className="hb-slider" aria-hidden="true">
          <span className="hb-slider-track" />
          <span className="hb-slider-fill" />
          <span className="hb-slider-knob" />
        </div>
        <div className="hb-slider-scale" aria-hidden="true">
          <span>Day 0</span>
          <span>~6 wks</span>
          <span>12 wks</span>
        </div>
        <div className="hb-card-foot">
          <div className="hb-stat">{SPEED.value}</div>
          <p className="hb-caption">{SPEED.label}</p>
        </div>
      </motion.article>
      */}

      {/* Cohort — dashed ring (commented out)
      <motion.article className="hb-card hb-cohort" {...card(3)}>
        <div className="hb-card-top">
          <span className="hb-eyebrow hb-eyebrow--primary">Cohort</span>
          <span className="hb-meta">Cohort 1</span>
        </div>
        <div className="hb-cohort-ring">
          <span>{COHORT.value}</span>
        </div>
        <div className="hb-card-foot">
          <p className="hb-caption">{COHORT.label}</p>
        </div>
      </motion.article>
      */}

      {/* Demand — applications arc (commented out)
      <motion.article className="hb-card hb-card--blue hb-demand" {...card(4)}>
        <div className="hb-card-top">
          <span className="hb-eyebrow">Demand</span>
          <span className="hb-meta hb-meta--light">Open to anyone</span>
        </div>
        <svg className="hb-arc" viewBox="0 0 260 96" aria-hidden="true">
          <path d="M10 22 C 70 22, 104 78, 130 78 C 156 78, 190 22, 250 22" />
          <path className="hb-arc-dash" d="M10 40 C 76 40, 108 82, 130 82 C 152 82, 184 40, 250 40" />
          <circle cx="130" cy="78" r="5" className="hb-arc-dot" />
          <text x="10" y="14">28k</text>
          <text x="234" y="14">Apps</text>
        </svg>
        <div className="hb-card-foot">
          <div className="hb-stat hb-stat--light">{DEMAND.value}</div>
          <p className="hb-caption hb-caption--light">{DEMAND.label}</p>
        </div>
      </motion.article>
      */}

      {/* Income — three income outcomes */}
      <motion.article className="hb-card hb-income" {...card(5)}>
        <div className="hb-card-top">
          <span className="hb-eyebrow hb-eyebrow--primary">Income</span>
          <span className="hb-badge hb-badge--tint"><i className="hb-dot-mint" />Reported gross</span>
        </div>
        <div className="hb-income-grid">
          <div>
            <div className="hb-income-label">Average monthly</div>
            <div className="hb-income-value">{MONTHLY.value}</div>
            <p className="hb-caption">{MONTHLY.note}</p>
          </div>
          <div>
            <div className="hb-income-label">Average annual</div>
            <div className="hb-income-value">{ANNUAL.value}</div>
            <p className="hb-caption">{ANNUAL.note}</p>
          </div>
          <div>
            <div className="hb-income-label">Top monthly</div>
            <div className="hb-income-value hb-income-value--accent">{TOP.value}</div>
            <p className="hb-caption">{TOP.note}</p>
          </div>
        </div>
      </motion.article>

      {/* Gender equity */}
      <motion.article className="hb-card hb-card--blue hb-gender" {...card(6)}>
        <div className="hb-card-top">
          <span className="hb-eyebrow">Gender equity</span>
          <span className="hb-badge"><i className="hb-dot-mint" />Top 2%</span>
        </div>
        <div className="hb-people" aria-hidden="true">
          <span className="hb-person">
            <svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4" /><path d="M4 22c0-4.4 3.6-8 8-8s8 3.6 8 8" /></svg>
            <i className="hb-dot-mint" />
          </span>
          <span className="hb-person">
            <svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4" /><path d="M4 22c0-4.4 3.6-8 8-8s8 3.6 8 8" /></svg>
            <i className="hb-dot-mint" />
          </span>
        </div>
        <div className="hb-card-foot">
          <div className="hb-stat hb-stat--light">{WOMEN.value}</div>
          <p className="hb-caption hb-caption--light">{WOMEN.label}</p>
        </div>
      </motion.article>
    </div>
  );
}
