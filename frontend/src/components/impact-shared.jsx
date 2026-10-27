// components/impact-shared.jsx
import { useEffect, useRef, useState } from 'react';

export const IMPACT_EASE = 'cubic-bezier(0.25,1,0.5,1)';
export const IMPACT_DUR_FAST = 200;
export const IMPACT_DUR_MED = 300;
export const IMPACT_DUR_SLOW = 500;

export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handler = (e) => setReduced(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);
  return reduced;
}

export function Reveal({ children, className = '', delay = 0, once = true }) {
  const ref = useRef(null);
  const reduced = usePrefersReducedMotion();
  const [shown, setShown] = useState(reduced);
  useEffect(() => {
    if (reduced) {
      setShown(true);
      return;
    }
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          if (once) obs.disconnect();
        } else if (!once) {
          setShown(false);
        }
      },
      { threshold: 0.12 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [reduced, once]);
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? 'translateY(0)' : 'translateY(14px)',
        transition: reduced ? 'none' : `opacity ${IMPACT_DUR_MED}ms ${IMPACT_EASE} ${delay}ms, transform ${IMPACT_DUR_MED}ms ${IMPACT_EASE} ${delay}ms`,
        willChange: 'transform, opacity',
      }}
    >
      {children}
    </div>
  );
}

export function CountUp({ value, format = (n) => n.toLocaleString('en-US'), prefix = '', suffix = '' }) {
  const reduced = usePrefersReducedMotion();
  const [display, setDisplay] = useState(() => (reduced ? value : 0));
  const ref = useRef(null);
  const started = useRef(false);
  useEffect(() => {
    if (reduced) {
      setDisplay(value);
      return;
    }
    const el = ref.current;
    if (!el || started.current) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          let start = null;
          const duration = 900;
          const from = 0;
          const to = value;
          const step = (ts) => {
            if (start === null) start = ts;
            const t = Math.min((ts - start) / duration, 1);
            const ease = 1 - Math.pow(1 - t, 3);
            const cur = Math.round(from + (to - from) * ease);
            setDisplay(cur);
            if (t < 1) requestAnimationFrame(step);
            else setDisplay(to);
          };
          requestAnimationFrame(step);
          obs.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [value, reduced]);
  return (
    <span ref={ref} style={{ fontVariantNumeric: 'tabular-nums' }}>
      {prefix}
      {format(display)}
      {suffix}
    </span>
  );
}
