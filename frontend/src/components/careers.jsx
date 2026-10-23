// components/careers.jsx
import { useCallback, useEffect, useRef, useState } from 'react';
import { Search, Sparkles, ArrowRight, Infinity as InfinityIcon } from 'lucide-react';
import { FaInstagram, FaLinkedinIn, FaXTwitter } from 'react-icons/fa6';
import { APPLICATION_URL } from '../constants.js';
import aiPortrait from '../assets/AI.png';
import aiRobot from '../assets/ai-robot.png';
import aiDuo from '../assets/ai-duo.png';
import aiCyborg from '../assets/ai-cyborg.png';
import devopsCentral from '../assets/devops03.png';
import devopsTl from '../assets/devops01.png';
import devopsMl from '../assets/devops02.png';
import devopsTr from '../assets/devops04.png';
import javaCentral from '../assets/java-central.png';
import javaTl from '../assets/java.jpg';
import javaTr from '../assets/java01.png';
import javaBl from '../assets/java002.jpg';
import './careers.css';

/*
 * "Careers" — an interactive 3D carousel of tech-branch mobile screens.
 *
 * Three branches share one viewport / electric-blue screen. Moving between them
 * runs a 180° Y-axis flip while the screen's layers pull forward on the Z-axis
 * and collapse back. Each branch has its own satellite UI (AI, DevOps and JAVA
 * have bespoke layouts).
 */

const BRANCHES = [
  { name: 'Artificial Intelligence', image: aiPortrait, cutout: true, theme: 'ai' },
  { name: 'Dev Ops', image: devopsCentral, theme: 'devops' },
  { name: 'JAVA FullStack', image: javaCentral, theme: 'java' },
];

const FLIP_MS = 440;
const AUTO_MS = 4600;

const Careers = () => {
  const [active, setActive] = useState(0);
  const [rotation, setRotation] = useState(0);
  const [peak, setPeak] = useState(false);
  const [instant, setInstant] = useState(false);

  const busy = useRef(false);
  const activeRef = useRef(0);
  const timers = useRef([]);
  const reduced = useRef(
    typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );

  const clearAsync = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }, []);

  const goTo = useCallback((target) => {
    if (busy.current || target === activeRef.current) return;

    if (reduced.current) {
      activeRef.current = target;
      setActive(target);
      return;
    }

    busy.current = true;
    setPeak(true);
    setRotation(90);

    timers.current.push(
      setTimeout(() => {
        activeRef.current = target;
        setActive(target);
        setInstant(true);
        setRotation(-90);
        setPeak(false);

        timers.current.push(
          setTimeout(() => {
            setInstant(false);
            setRotation(0);
            timers.current.push(
              setTimeout(() => {
                busy.current = false;
              }, FLIP_MS + 60),
            );
          }, 40),
        );
      }, FLIP_MS),
    );
  }, []);

  useEffect(() => {
    if (reduced.current) return undefined;
    const t = setTimeout(() => goTo((activeRef.current + 1) % BRANCHES.length), AUTO_MS);
    return () => clearTimeout(t);
  }, [active, goTo]);

  useEffect(() => clearAsync, [clearAsync]);

  const branch = BRANCHES[active];

  return (
    <section id="careers" data-nav-theme="light" aria-labelledby="careers-title" className="careers">
      <div className="careers__head">
        <h2 id="careers-title" className="careers__title">
          Career Paths
        </h2>
        <p className="careers__subtitle">
          What is your true passion? Pursue a career path of your choice and become an expert through real world experience.

        </p>
      </div>

      <div className="careers__stage">
        <div
          className={`careers__device careers__device--${branch.theme}${peak ? ' is-peak' : ''}${instant ? ' is-instant' : ''}`}
          style={{ transform: `rotateY(${rotation}deg)` }}
        >
          <div className="careers__card">
            <span className="careers__corner careers__corner--tl" aria-hidden="true" />
            <span className="careers__corner careers__corner--tr" aria-hidden="true" />
            <span className="careers__corner careers__corner--bl" aria-hidden="true" />
            <span className="careers__corner careers__corner--br" aria-hidden="true" />

            <div className="careers__top">
              <p className="careers__eyebrow">Zone01 Kisumu</p>
              <h3 className="careers__branch">{branch.name}</h3>
            </div>

            <span className="careers__glow" aria-hidden="true" />
            <span className="careers__halo" aria-hidden="true" />

            <div className={`careers__portrait${branch.cutout ? ' is-cutout' : ''}`}>
              <img src={branch.image} alt={branch.name} />
            </div>

            {branch.theme === 'ai' && (
              <>
                <span className="careers__dash" aria-hidden="true" />
                <img className="careers__sat careers__sat--robot" src={aiRobot} alt="" aria-hidden="true" />
                <div className="careers__sat careers__duo">
                  <img src={aiDuo} alt="" aria-hidden="true" />
                  <p className="careers__duo-text">Start your AI knowledge here</p>
                  <span className="careers__duo-pill">AI STARTER</span>
                </div>
                <img className="careers__sat careers__sat--cyborg" src={aiCyborg} alt="" aria-hidden="true" />
                <span className="careers__sat careers__toggle">
                  <i aria-hidden="true" />
                  <b>Specialize</b>
                </span>
              </>
            )}

            {branch.theme === 'devops' && (
              <>
                <img className="careers__sat careers__dev careers__dev--tl" src={devopsTl} alt="" aria-hidden="true" />
                <img className="careers__sat careers__dev careers__dev--ml" src={devopsMl} alt="" aria-hidden="true" />
                <img className="careers__sat careers__dev careers__dev--tr" src={devopsTr} alt="" aria-hidden="true" />

                <span className="careers__sat careers__toggle">
                  <i aria-hidden="true" />
                  <b>Specialize</b>
                </span>

                <span className="careers__sat careers__bubble">No teachers, only mentors!</span>

                <div className="careers__sat careers__widget">
                  <span className="careers__widget-search">
                    <Search size={11} strokeWidth={2.5} />
                    <span>How to be a DevOps Engineer</span>
                  </span>
                  <span className="careers__widget-join">Join zone01 Kisumu</span>
                  <span className="careers__widget-foot">
                    <span className="careers__widget-ig" aria-hidden="true">
                      <FaInstagram size={14} />
                    </span>
                    <span className="careers__widget-badge">
                      <i aria-hidden="true">
                        <InfinityIcon size={15} strokeWidth={2.4} />
                      </i>
                      <b>Devops</b>
                    </span>
                  </span>
                </div>
              </>
            )}

            {branch.theme === 'java' && (
              <>
                <img className="careers__sat careers__jv careers__jv--tl" src={javaTl} alt="" aria-hidden="true" />
                <img className="careers__sat careers__jv careers__jv--tr" src={javaTr} alt="" aria-hidden="true" />
                <img className="careers__sat careers__jv careers__jv--bl" src={javaBl} alt="" aria-hidden="true" />

                <span className="careers__sat careers__jv-bubble careers__jv-bubble--left">
                  Welcome to Zone01
                </span>
                <span className="careers__sat careers__jv-bubble careers__jv-bubble--right">
                  Guaranteed path to employment
                </span>
              </>
            )}

            {branch.theme === 'generic' && (
              <>
                <span className="careers__sat careers__pill">Welcome to Zone01</span>
                <span className="careers__sat careers__search">
                  <Search size={13} strokeWidth={2.5} />
                  <span>Find your path</span>
                </span>
                <span className="careers__sat careers__badge" aria-hidden="true">
                  <Sparkles size={15} strokeWidth={2.5} />
                </span>
                <span className="careers__sat careers__social" aria-hidden="true">
                  <i>
                    <FaInstagram size={13} />
                  </i>
                  <i>
                    <FaXTwitter size={12} />
                  </i>
                  <i>
                    <FaLinkedinIn size={12} />
                  </i>
                </span>
              </>
            )}

            <a
              href={APPLICATION_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="careers__cta"
            >
              Start Today
              <ArrowRight size={16} strokeWidth={2.5} />
            </a>
          </div>
        </div>
      </div>

      <div className="careers__dots" role="tablist" aria-label="Tech branches">
        {BRANCHES.map((b, i) => (
          <button
            key={b.name}
            type="button"
            role="tab"
            aria-selected={i === active}
            aria-label={b.name}
            className={`careers__dot${i === active ? ' is-active' : ''}`}
            onClick={() => goTo(i)}
          />
        ))}
      </div>
    </section>
  );
};

export default Careers;
