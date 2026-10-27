// src/components/impact/CountUp.jsx
import React, { useRef, useEffect } from 'react';
import { useMotionValue, animate } from 'framer-motion';

/**
 * Parses numeric strings including formatted numbers (30,057), percentages (90%),
 * currency ($7,250), ratios (50/50), and multipliers (3.5x).
 */
export function parseValue(valStr) {
  if (typeof valStr !== 'string') {
    return { prefix: '', number: Number(valStr) || 0, suffix: '', hasCommas: false, isDecimal: false };
  }
  if (valStr.includes('/')) {
    const parts = valStr.split('/');
    return {
      isRatio: true,
      left: parseInt(parts[0], 10) || 0,
      right: parseInt(parts[1], 10) || 0,
    };
  }
  const match = valStr.match(/^([^0-9.]*)([0-9.,]+)([^0-9.]*)$/);
  if (!match) {
    return { prefix: '', number: 0, suffix: valStr, hasCommas: false, isDecimal: false };
  }
  const prefix = match[1] || '';
  const numStr = match[2] || '0';
  const suffix = match[3] || '';
  const hasCommas = numStr.includes(',');
  const isDecimal = numStr.includes('.');
  const cleanNum = numStr.replace(/,/g, '');
  const number = isDecimal ? parseFloat(cleanNum) : parseInt(cleanNum, 10);
  return { prefix, number, suffix, hasCommas, isDecimal };
}

/**
 * High-performance RAF count-up animation component driven by Framer Motion.
 * Updates DOM node directly to eliminate React re-render overhead during tick.
 */
export default function CountUp({
  value,
  duration = 1.8,
  delay = 0,
  inView = false,
  className = '',
}) {
  const spanRef = useRef(null);
  const parsed = parseValue(value);

  // Ratio animation (e.g., 50/50)
  if (parsed.isRatio) {
    const leftVal = useMotionValue(0);
    const rightVal = useMotionValue(0);

    useEffect(() => {
      if (!inView) return;
      const c1 = animate(leftVal, parsed.left, { duration, delay, ease: [0.16, 1, 0.3, 1] });
      const c2 = animate(rightVal, parsed.right, { duration, delay, ease: [0.16, 1, 0.3, 1] });
      return () => {
        c1.stop();
        c2.stop();
      };
    }, [inView, parsed.left, parsed.right, duration, delay, leftVal, rightVal]);

    useEffect(() => {
      const unsub1 = leftVal.on('change', (l) => {
        if (spanRef.current) {
          const lRound = Math.round(l);
          const rRound = Math.round(rightVal.get());
          spanRef.current.textContent = `${lRound}/${rRound}`;
        }
      });
      const unsub2 = rightVal.on('change', (r) => {
        if (spanRef.current) {
          const lRound = Math.round(leftVal.get());
          const rRound = Math.round(r);
          spanRef.current.textContent = `${lRound}/${rRound}`;
        }
      });
      return () => {
        unsub1();
        unsub2();
      };
    }, [leftVal, rightVal]);

    return (
      <span ref={spanRef} className={className}>
        0/0
      </span>
    );
  }

  // Standard numbers, currency, percentages, and multipliers
  const count = useMotionValue(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(count, parsed.number, {
      duration,
      delay,
      ease: [0.16, 1, 0.3, 1],
    });
    return () => controls.stop();
  }, [inView, parsed.number, duration, delay, count]);

  useEffect(() => {
    const unsubscribe = count.on('change', (latest) => {
      if (spanRef.current) {
        let formatted = '';
        if (parsed.isDecimal) {
          formatted = latest.toFixed(1);
        } else {
          const rounded = Math.round(latest);
          formatted = parsed.hasCommas ? rounded.toLocaleString() : String(rounded);
        }
        spanRef.current.textContent = `${parsed.prefix}${formatted}${parsed.suffix}`;
      }
    });
    return () => unsubscribe();
  }, [count, parsed]);

  return (
    <span ref={spanRef} className={className}>
      {parsed.prefix}0{parsed.suffix}
    </span>
  );
}
