import { useEffect, useRef, useState } from 'react';

const MagneticCursor = ({ containerRef }) => {
  const dotRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const pos = useRef({ x: 0, y: 0 });
  const target = useRef({ x: 0, y: 0, scale: 1 });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let raf;
    const animate = () => {
      pos.current.x += (target.current.x - pos.current.x) * 0.2;
      pos.current.y += (target.current.y - pos.current.y) * 0.2;

      if (dotRef.current) {
        dotRef.current.style.transform =
          `translate(${pos.current.x}px, ${pos.current.y}px) translate(-50%, -50%) scale(${target.current.scale})`;
      }
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);

    const handleMove = (e) => {
      const x = e.clientX;
      const y = e.clientY;

      const magnets = el.querySelectorAll('[data-magnetic]');
      let snapped = false;
      magnets.forEach((m) => {
        const r = m.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        const dist = Math.hypot(x - cx, y - cy);
        const radius = Math.max(r.width, r.height) * 0.9;
        if (dist < radius) {
          target.current = { x: cx, y: cy, scale: 2.2 };
          snapped = true;
        }
      });
      if (!snapped) target.current = { x, y, scale: 1 };
    };

    const handleEnter = () => setVisible(true);
    const handleLeave = () => setVisible(false);

    el.style.cursor = 'none';
    el.addEventListener('mousemove', handleMove);
    el.addEventListener('mouseenter', handleEnter);
    el.addEventListener('mouseleave', handleLeave);

    return () => {
      cancelAnimationFrame(raf);
      el.style.cursor = '';
      el.removeEventListener('mousemove', handleMove);
      el.removeEventListener('mouseenter', handleEnter);
      el.removeEventListener('mouseleave', handleLeave);
    };
  }, [containerRef]);

  if (!visible) return null;

  return (
    <div
      ref={dotRef}
      className="pointer-events-none fixed top-0 left-0 z-[100] w-3 h-3 rounded-full bg-white"
      style={{ willChange: 'transform' }}
    />
  );
};

export default MagneticCursor;