import { useRef, useState } from 'react';

/**
 * Small helper for the mobile snap carousels. Tracks the active card from the
 * horizontal scroll position and exposes a `goTo` used by the pagination dots.
 */
export function useSnapCarousel(count) {
  const trackRef = useRef(null);
  const [index, setIndex] = useState(0);

  const measure = () => {
    const el = trackRef.current;
    if (!el || !el.children.length) return null;
    const styles = getComputedStyle(el);
    const gap = parseFloat(styles.columnGap || styles.gap || '0') || 0;
    const step = el.children[0].getBoundingClientRect().width + gap;
    return { el, step };
  };

  const handleScroll = () => {
    const data = measure();
    if (!data || !data.step) return;
    const next = Math.round(data.el.scrollLeft / data.step);
    setIndex(Math.max(0, Math.min(next, count - 1)));
  };

  const goTo = (i) => {
    const data = measure();
    if (!data) return;
    data.el.scrollTo({ left: i * data.step, behavior: 'smooth' });
  };

  return { trackRef, index, handleScroll, goTo };
}
