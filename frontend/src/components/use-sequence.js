// components/use-sequence.js
import { useCallback, useEffect, useRef, useState } from 'react';
import { AUTOPLAY_MS, FLIP_MS } from './orbit-showcase.config.js';

/*
 * useSequence — a state-driven control loop for an N-step sequence.
 *
 * Returns the active index plus a guarded `goTo` setter, and drives an autoplay
 * timer that advances one step at a time. When the sequence would advance past
 * the final step it calls `onComplete` instead of wrapping, letting the host
 * decide what happens next (e.g. replay an intro before the cycle restarts).
 * `goTo` ignores calls while a swap is mid-flight so transitions never stack.
 */
export const useSequence = (length, onComplete, paused = false) => {
  const [active, setActive] = useState(0);
  const busy = useRef(false);
  const activeRef = useRef(0);
  const timerRef = useRef();
  const completeRef = useRef(onComplete);

  useEffect(() => {
    completeRef.current = onComplete;
  }, [onComplete]);

  const goTo = useCallback(
    (target) => {
      if (length < 1 || busy.current) return;

      const next = ((target % length) + length) % length;
      if (next === activeRef.current) return;

      busy.current = true;
      activeRef.current = next;
      setActive(next);

      timerRef.current = window.setTimeout(() => {
        busy.current = false;
      }, FLIP_MS + 80);
    },
    [length],
  );

  const advance = useCallback(() => {
    const next = activeRef.current + 1;
    if (next >= length) {
      // Hand off to the host if it wants to intercept the wrap…
      if (completeRef.current) {
        completeRef.current();
        return;
      }
      // …otherwise loop straight back to the start.
      goTo(0);
      return;
    }
    goTo(next);
  }, [goTo, length]);

  useEffect(() => {
    if (paused || length < 2 || !AUTOPLAY_MS) return undefined;
    const autoplay = window.setTimeout(advance, AUTOPLAY_MS);
    return () => window.clearTimeout(autoplay);
  }, [active, advance, length, paused]);

  useEffect(() => () => window.clearTimeout(timerRef.current), []);

  return { active, goTo };
};
