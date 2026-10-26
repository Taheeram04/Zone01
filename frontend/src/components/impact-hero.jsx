// components/impact-hero.jsx
import { useEffect, useRef, useState } from 'react';
import impactHero from '../assets/impacthero.jpg';

// Feature flags - keep decorative code but hide it
const SHOW_DECORATIONS = false;
const SHOW_TAGLINE_AND_STATS = false;

export default function ImpactHero() {
  const sectionRef = useRef(null);

  // Check prefers-reduced-motion
  const [reducedMotion, setReducedMotion] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
    return false;
  });

  useEffect(() => {
    const rmQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleRmChange = (e) => setReducedMotion(e.matches);
    rmQuery.addEventListener('change', handleRmChange);
    return () => rmQuery.removeEventListener('change', handleRmChange);
  }, []);

  // Entrance animations
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsRevealed(true), 50);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section
      ref={sectionRef}
      data-nav-theme="dark"
      className="relative w-full bg-[#0063F9] overflow-x-hidden overflow-y-visible"
      style={{
        aspectRatio: '1920 / 1185',
        minHeight: 'calc(100svh - 4.5rem)',
        height: 'auto',
      }}
    >
      <style>{`
        @keyframes fade-slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fade-slide-right {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>

      {/* Heading "Our Impact" */}
      <h1
        className="absolute font-sans font-black tracking-tight select-none z-20"
        style={{
          left: '13.3%',
          top: '14.7%',
          transform: 'translateY(-50%)',
          fontSize: 'clamp(2.5rem, 5.4vw, 6rem)',
          lineHeight: 1.05,
          animation: reducedMotion ? 'none' : (isRevealed ? 'fade-slide-up 0.8s cubic-bezier(0.16,1,0.3,1) both' : 'none'),
        }}
      >
        <span className="text-white">Our </span>
        <span className="text-black">Impact</span>
      </h1>

      {/* Photo */}
      <div
        className="absolute overflow-hidden z-10"
        style={{
          left: '63.5%',
          width: '31.6%',
          top: '17.6%',
          height: '72.4%',
          right: 'auto',
          maxWidth: 'none',
          borderRadius: 'clamp(12px, 3.1vw, 60px)',
          animation: reducedMotion ? 'none' : (isRevealed ? 'fade-in 0.9s cubic-bezier(0.16,1,0.3,1) 0.1s both' : 'none'),
        }}
      >
        <img
          src={impactHero}
          alt="Zone01 Kisumu impact hero"
          className="w-full h-full"
          style={{
            objectFit: 'cover',
            objectPosition: '60% 55%',
          }}
        />
      </div>

      {/* "RESULTS, NOT RHETORIC" Card/Notch */}
      <div
        className="absolute bg-[#0063F9] flex items-center z-30"
        style={{
          left: 'calc(63.5% - 31.6% * 0.14)',
          top: 'calc(17.6% + 21% * 0.724)',
          height: 'calc(72.4% * 0.53)',
          width: 'calc(31.6% * 0.14)',
          borderTopRightRadius: 'clamp(6px, 2vw, 38px)',
          borderBottomRightRadius: 'clamp(6px, 2vw, 38px)',
          marginLeft: '0',
          animation: reducedMotion ? 'none' : (isRevealed ? 'fade-slide-right 0.8s cubic-bezier(0.16,1,0.3,1) 0.2s both' : 'none'),
        }}
      >
        <div
          className="font-sans font-black text-white uppercase w-full flex flex-col justify-center"
          style={{
            position: 'absolute',
            left: '-100%',
            width: '100%',
            transform: 'translateX(calc(55.7% - 63.5% + 31.6% * 0.14))',
            fontSize: 'clamp(0.7rem, 2.1vw, 2.5rem)',
            lineHeight: '2.2vw',
            letterSpacing: '-0.02em',
            textAlign: 'left',
          }}
        >
          <div>RESULTS,</div>
          <div>NOT</div>
          <div>RHETORIC</div>
        </div>
      </div>

      {/* Mobile responsive styles */}
      <style>{`
        @media (max-width: 899px) {
          section[data-nav-theme="dark"] {
            aspect-ratio: auto !important;
            min-height: calc(100svh - 4.5rem) !important;
            padding: 6rem 1.5rem 3rem 1.5rem;
            display: flex;
            flex-direction: column;
            gap: 2rem;
          }
          section[data-nav-theme="dark"] h1 {
            position: relative !important;
            left: auto !important;
            top: auto !important;
            transform: none !important;
            margin-top: 0 !important;
            font-size: clamp(2.5rem, 12vw, 4rem) !important;
            order: 1;
          }
          section[data-nav-theme="dark"] h1 + div {
            position: relative !important;
            left: auto !important;
            width: 100% !important;
            top: auto !important;
            height: auto !important;
            aspect-ratio: 7 / 10 !important;
            border-radius: clamp(16px, 4vw, 32px) !important;
            order: 2;
            margin: 0 auto;
            max-width: 100%;
          }
          section[data-nav-theme="dark"] h1 + div + div {
            position: absolute !important;
            left: 1.5rem !important;
            top: auto !important;
            bottom: 3rem !important;
            height: auto !important;
            width: auto !important;
            min-width: 35% !important;
            padding: 0.8rem 1.2rem 0.8rem 0.8rem !important;
            border-radius: 0 clamp(12px, 3vw, 20px) clamp(12px, 3vw, 20px) 0 !important;
            order: 3;
          }
          section[data-nav-theme="dark"] h1 + div + div > div {
            font-size: clamp(0.65rem, 2.8vw, 1.1rem) !important;
            line-height: 1.15 !important;
          }
        }
        @media (max-width: 389px) {
          section[data-nav-theme="dark"] {
            padding-left: 1rem;
            padding-right: 1rem;
          }
          section[data-nav-theme="dark"] h1 + div + div {
            left: 1rem !important;
          }
        }
        @media (min-width: 900px) and (max-width: 1280px) {
          section[data-nav-theme="dark"] h1 {
            font-size: clamp(2.5rem, 4.5vw, 4.5rem) !important;
            left: 10% !important;
          }
        }
      `}</style>
    </section>
  );
}
