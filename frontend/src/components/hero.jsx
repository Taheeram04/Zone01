import { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Button from './button.jsx';
import { Container } from './layout.jsx';
import MagneticCursor from './magnetic-cursor.jsx';
import { KineticHeading } from './whocanapply.jsx';
import heroImg1 from '../assets/001.jpeg';
import heroImg2 from '../assets/002.jpeg';
import heroImg3 from '../assets/003.jpeg';

const heroImages = [heroImg1, heroImg2, heroImg3];
const GRID_COLS = 14;
const GRID_ROWS = 9;

const generateNodes = () => {
  const list = [];
  for (let row = 0; row <= GRID_ROWS; row++) {
    for (let col = 0; col <= GRID_COLS; col++) {
      const pseudo = Math.sin(row * 14 + col * 9 + 1) * 10000;
      const rand = pseudo - Math.floor(pseudo);
      if (rand > 0.85) {
        list.push({
          left: (col / GRID_COLS) * 100,
          top: (row / GRID_ROWS) * 100,
          delay: Number(((rand * 4) % 4).toFixed(2)),
          duration: Number((2 + ((rand * 7) % 2)).toFixed(2)),
        });
      }
    }
  }
  return list;
};

const STATIC_NODES = generateNodes();

const API_BASE = import.meta.env.VITE_API_BASE_URL || '';
// Refresh cadence so CMS edits (and the D-day switch-off) reach an open tab.
const PISCINE_REFRESH_MS = 60_000;
// Used only when the API can't be reached, so the homepage never breaks.
const FALLBACK_PISCINE_AT = '2026-10-12T09:00:00+03:00';

// Normalise the piscine payload. Handles the content API's
// { is_active, next_piscine_date, message } plus an optional explicit
// { starts_at, label } so a future CMS time field needs no frontend change.
const parsePiscineConfig = (data) => {
  let startsAt = null;
  if (data.starts_at) {
    startsAt = new Date(data.starts_at);
  } else if (data.next_piscine_date) {
    startsAt = new Date(`${data.next_piscine_date}T09:00:00+03:00`);
  }

  const valid = startsAt !== null && !Number.isNaN(startsAt.getTime());
  return {
    active: Boolean(data.is_active && valid),
    label: data.label || data.message || 'Next Piscine',
    startsAt: valid ? startsAt : null,
  };
};

const fallbackPiscineConfig = () => ({
  active: true,
  label: 'Next Piscine',
  startsAt: new Date(FALLBACK_PISCINE_AT),
});

const formatTimeLeft = (ms) => {
  const diff = Math.max(0, ms);
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  return {
    days: String(days).padStart(2, '0'),
    hours: String(hours).padStart(2, '0'),
    minutes: String(minutes).padStart(2, '0'),
    seconds: String(seconds).padStart(2, '0'),
  };
};

/**
 * PiscineCountdown Component
 * Minimalist, frameless live ticking countdown timer positioned inside the Hero
 * canvas. The target date comes from the Django CMS (/api/piscine/) and the
 * countdown removes itself automatically once D-day arrives.
 */
const PiscineCountdown = () => {
  const [config, setConfig] = useState(null);
  const [now, setNow] = useState(() => Date.now());

  // Load the target from the Django CMS and refresh it periodically.
  useEffect(() => {
    const controller = new AbortController();
    let timer;

    const load = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/piscine/`, { signal: controller.signal });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        setConfig(parsePiscineConfig(await res.json()));
      } catch (error) {
        if (error?.name === 'AbortError') return;
        // Keep the last good value. In development, fall back to a demo date
        // so the component is visible without the backend; in production we
        // respect the CMS and stay hidden when the API can't be reached.
        setConfig((prev) => prev ?? (import.meta.env.DEV ? fallbackPiscineConfig() : null));
      }
    };

    load();
    timer = setInterval(load, PISCINE_REFRESH_MS);

    // Re-check when the tab regains focus (e.g. overnight on D-day).
    const onVisible = () => {
      if (document.visibilityState === 'visible') load();
    };
    document.addEventListener('visibilitychange', onVisible);

    return () => {
      clearInterval(timer);
      document.removeEventListener('visibilitychange', onVisible);
      controller.abort();
    };
  }, []);

  // Keep the clock ticking every second.
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Hidden while loading, when disabled, or the moment D-day arrives.
  if (!config || !config.active || !config.startsAt) return null;

  const remaining = config.startsAt.getTime() - now;
  if (remaining <= 0) return null;

  const timeLeft = formatTimeLeft(remaining);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.85, ease: [0.16, 1, 0.3, 1] }}
      className="hidden sm:block absolute bottom-12 sm:bottom-16 md:bottom-20 right-6 md:right-8 z-20 text-white select-none pointer-events-auto"
    >
      {/* Header with live indicator */}
      <div className="flex items-center gap-2 mb-2">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-60" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
        </span>
        <span className="font-mono text-body-s uppercase tracking-widest text-red-500 font-medium">
          {config.label}
        </span>
      </div>

      {/* Live Digits Counter - Frameless, Red Alert Label with White Digits */}
      <div className="flex items-center gap-2.5 sm:gap-3.5 font-mono">
        <div className="flex flex-col items-center">
          <span className="text-2xl sm:text-3xl font-bold tracking-tight text-white tabular-nums">
            {timeLeft.days}
          </span>
          <span className="text-[10px] text-white uppercase tracking-widest mt-0.5">Days</span>
        </div>

        <span className="text-white/40 font-light text-xl mb-3.5">:</span>

        <div className="flex flex-col items-center">
          <span className="text-2xl sm:text-3xl font-bold tracking-tight text-white tabular-nums">
            {timeLeft.hours}
          </span>
          <span className="text-[10px] text-white uppercase tracking-widest mt-0.5">Hours</span>
        </div>

        <span className="text-white/40 font-light text-xl mb-3.5">:</span>

        <div className="flex flex-col items-center">
          <span className="text-2xl sm:text-3xl font-bold tracking-tight text-white tabular-nums">
            {timeLeft.minutes}
          </span>
          <span className="text-[10px] text-white uppercase tracking-widest mt-0.5">Mins</span>
        </div>

        <span className="text-white/40 font-light text-xl mb-3.5">:</span>

        <div className="flex flex-col items-center">
          <span className="text-2xl sm:text-3xl font-bold tracking-tight text-white tabular-nums">
            {timeLeft.seconds}
          </span>
          <span className="text-[10px] text-white uppercase tracking-widest mt-0.5">Secs</span>
        </div>
      </div>
    </motion.div>
  );
};

const Hero = () => {
  const [currentImage, setCurrentImage] = useState(0);
  const [parallax, setParallax] = useState({ x: 0, y: 0 });
  const sectionRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleMouseMove = (e) => {
    if (!sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setParallax({ x, y });
  };

  const nodes = STATIC_NODES;

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      data-nav-theme="dark"
      className="relative w-full min-h-screen flex items-end overflow-hidden"
      style={{ filter: 'saturate(0.75)', minHeight: '100svh' }}
    >
      <MagneticCursor containerRef={sectionRef} />

      {/* Spring-crossfading, Ken Burns background */}
      <AnimatePresence>
        <motion.div
          key={currentImage}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ type: 'spring', stiffness: 60, damping: 20, mass: 1 }}
          className="absolute inset-0 overflow-hidden"
        >
          <div
            className="absolute inset-0 bg-cover bg-center animate-kenburns"
            style={{ backgroundImage: `url(${heroImages[currentImage]})` }}
          />
        </motion.div>
      </AnimatePresence>

      <div
        className="absolute inset-0 z-[5] pointer-events-none"
        style={{
          mixBlendMode: 'screen',
          opacity: 0.5,
          transform: `translate(${parallax.x * 24}px, ${parallax.y * 24}px)`,
          transition: 'transform 0.2s ease-out',
        }}
      >
        <div
          className="absolute inset-[-5%]"
          style={{
            backgroundImage:
              'linear-gradient(to right, rgba(0,157,255,0.35) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,157,255,0.35) 1px, transparent 1px)',
            backgroundSize: `${100 / GRID_COLS}% ${100 / GRID_ROWS}%`,
          }}
        />
        {nodes.map((node, i) => (
          <div
            key={i}
            className="absolute w-1.5 h-1.5 rounded-full bg-accent"
            style={{
              left: `${node.left}%`,
              top: `${node.top}%`,
              transform: 'translate(-50%, -50%)',
              animation: `pulse-glow ${node.duration}s ease-in-out ${node.delay}s infinite`,
              boxShadow: '0 0 8px 2px rgba(53,214,180,0.6)',
            }}
          />
        ))}
      </div>

      <div className="absolute inset-0 bg-black/30" />

      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to top, #003A93 0%, #003A93 34%, rgba(0,99,249,0.28) 59%, rgba(0,99,249,0) 100%)',
          opacity: 0.9,
          mixBlendMode: 'multiply',
        }}
      />

      <Container className="relative z-10 pb-20 sm:pb-12 md:pb-14 lg:pb-16 pt-20 sm:pt-24 md:pt-28">
        <div className="max-w-4xl">
          <KineticHeading
            as="h1"
            text={"Talent is everywhere.\nOpportunity is not."}
            className="font-sans font-black text-white leading-[1.06] tracking-tight text-[30px] sm:text-[44px] md:text-[54px] lg:text-[66px] xl:text-[76px] 2xl:text-hero-h1 mb-3 sm:mb-4 md:mb-5"
            delay={0.15}
            stagger={0.025}
          />

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="font-mono text-white/90 text-sm sm:text-base lg:text-[17px] mb-6 sm:mb-6 md:mb-7 max-w-2xl lg:max-w-3xl leading-relaxed"
          >
            We identify <span className="font-semibold text-white">top-potential</span> talent — overlooked
            by traditional systems — and transform them into{' '}
            <span className="font-semibold text-white">high-income, AI-ready software engineers</span> at scale
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.75, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-3 sm:gap-4"
          >
            <Button data-magnetic variant="primary" onClick={() => navigate('/apply')} className="w-full sm:w-auto">
              Apply now
            </Button>
            <Button
              data-magnetic
              variant="outline"
              onClick={() => navigate('/hire')}
              className="w-full sm:w-auto !bg-transparent !border-white !text-white hover:!bg-white hover:!text-black-900"
            >
              Hire Talent
            </Button>
          </motion.div>
        </div>
      </Container>

      {/* Live Frameless White Piscine Countdown floating above WhatsApp chatbot */}
      <PiscineCountdown />
    </section>
  );
};

export default Hero;
