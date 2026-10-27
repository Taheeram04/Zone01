import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Small helper for the mobile snap carousels. Tracks the active card from the
 * horizontal scroll position and exposes a `goTo` used by the pagination dots.
 *
 * The track is wider than its cards: it has horizontal padding plus negative
 * outer margins (`-mx-5 px-5`), and `snap-center` centres cards in the
 * scrollport. That means a card's scroll offset is not `index * cardWidth`:
 * there is a padding offset and, at the ends, the browser clamps the scroll.
 * Both the active index and `goTo` therefore use each card's measured position
 * instead of assuming a perfectly aligned step width.
 */
export function useSnapCarousel(count) {
  const trackRef = useRef(null);
  const [index, setIndex] = useState(0);

  /** Offset of a card inside the scrollable content, padding included. */
  const cardOffset = (el, card) => {
    const trackRect = el.getBoundingClientRect();
    const cardRect = card.getBoundingClientRect();
    return cardRect.left - trackRect.left + el.scrollLeft - el.clientLeft;
  };

  const syncIndex = useCallback(() => {
    const el = trackRef.current;
    if (!el || !el.children.length) return;

    const scrollCenter = el.scrollLeft + el.clientWidth / 2;
    let closest = 0;
    let closestDistance = Infinity;

    Array.from(el.children).forEach((card, i) => {
      const center = cardOffset(el, card) + card.offsetWidth / 2;
      const distance = Math.abs(center - scrollCenter);
      if (distance < closestDistance) {
        closestDistance = distance;
        closest = i;
      }
    });

    setIndex(Math.max(0, Math.min(closest, count - 1)));
  }, [count]);

  const handleScroll = useCallback(() => {
    syncIndex();
  }, [syncIndex]);

  const goTo = useCallback(
    (i) => {
      const el = trackRef.current;
      if (!el || !el.children.length) return;

      const cards = Array.from(el.children);
      const target = Math.max(0, Math.min(i, cards.length - 1));
      const card = cards[target];

      // Centre the card in the scrollport, then clamp to what the browser can
      // actually scroll to (the first/last cards sit inside the padding).
      const maxScroll = Math.max(0, el.scrollWidth - el.clientWidth);
      const centered = cardOffset(el, card) - (el.clientWidth - card.offsetWidth) / 2;
      const left = Math.max(0, Math.min(centered, maxScroll));

      el.scrollTo({ left, behavior: 'smooth' });
      setIndex(Math.max(0, Math.min(target, count - 1)));
    },
    [count]
  );

  // Keep the dots honest after an orientation change or a late font/layout
  // shift, without waiting for the user to scroll again.
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return undefined;

    const onResize = () => syncIndex();
    window.addEventListener('resize', onResize);

    let observer;
    if (typeof ResizeObserver !== 'undefined') {
      observer = new ResizeObserver(onResize);
      observer.observe(el);
    }

    return () => {
      window.removeEventListener('resize', onResize);
      observer?.disconnect();
    };
  }, [syncIndex]);

  return { trackRef, index, handleScroll, goTo };
}
