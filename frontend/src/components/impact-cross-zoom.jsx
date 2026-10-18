// components/impact-cross-zoom.jsx
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * ImpactCrossZoom
 *
 * Cinematic, uninterrupted cross-zoom transition for the Impact Hero section.
 * Renders all images as persistent stacked layers and runs a continuous master GSAP timeline.
 * Each image sits still for 5 seconds, then smoothly dissolves:
 * the outgoing image zooms OUT (1.08 -> 1.00) while the incoming image zooms IN (1.00 -> 1.08),
 * strictly cycling: impact.png -> impact2.jpeg -> impact3.jpeg -> loop.
 *
 * Props:
 * - images: Array of { src, alt } or image source strings.
 * - holdTime: Seconds each image sits at rest (default: 5s).
 * - duration: Duration of each transition in seconds (default: 2.0s).
 * - fadeEase: GSAP easing for opacity cross-fade (default: 'power2.inOut').
 * - zoomEase: GSAP easing for zoom scales (default: 'power2.inOut').
 * - className: Container CSS classes.
 */
export default function ImpactCrossZoom({
  images = [],
  holdTime = 5,
  duration = 2.0,
  fadeEase = 'power2.inOut',
  zoomEase = 'power2.inOut',
  className = '',
}) {
  const containerRef = useRef(null);
  const layersRef = useRef([]);

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

  // Preload and decode images in background
  useEffect(() => {
    images.forEach((item) => {
      const src = typeof item === 'string' ? item : item?.src;
      if (src) {
        const img = new Image();
        img.src = src;
        if (img.decode) {
          img.decode().catch(() => {});
        }
      }
    });
  }, [images]);

  // Master GSAP loop
  useEffect(() => {
    if (images.length <= 1 || reducedMotion) return;

    const layers = layersRef.current.filter(Boolean);
    if (layers.length < images.length) return;

    let ctx = gsap.context(() => {
      // Establish initial styles:
      // Layer 0 is active at scale 1.08 and opacity 1
      // All other layers start hidden at scale 1.00 and opacity 0
      layers.forEach((layer, i) => {
        gsap.set(layer, {
          opacity: i === 0 ? 1 : 0,
          scale: i === 0 ? 1.08 : 1.00,
          zIndex: i === 0 ? 2 : 1,
          willChange: 'transform, opacity',
        });
      });

      // Master continuous looping timeline (repeat: -1)
      const masterTl = gsap.timeline({
        repeat: -1,
        defaults: { ease: zoomEase },
      });

      // Strictly ordered cycle: 0 -> 1 -> 2 -> ... -> 0
      for (let i = 0; i < images.length; i++) {
        const nextIdx = (i + 1) % images.length;
        const currentLayer = layers[i];
        const nextLayer = layers[nextIdx];

        // 1. Hold current image for full 5 seconds
        masterTl.to({}, { duration: holdTime });

        // 2. Position nextLayer directly on top before transition begins
        masterTl.set(nextLayer, { zIndex: 3, opacity: 0, scale: 1.00 });
        masterTl.set(currentLayer, { zIndex: 2 });
        layers.forEach((l, idx) => {
          if (idx !== i && idx !== nextIdx) {
            masterTl.set(l, { zIndex: 1, opacity: 0 });
          }
        });

        // 3. Incoming image: zooms IN from 1.00 to 1.08 while fading in
        masterTl.to(
          nextLayer,
          {
            scale: 1.08,
            duration: duration,
            ease: zoomEase,
          },
          '<'
        );
        masterTl.to(
          nextLayer,
          {
            opacity: 1,
            duration: duration,
            ease: fadeEase,
          },
          '<'
        );

        // 4. Outgoing image: zooms OUT from 1.08 to 1.00 while fading out
        masterTl.to(
          currentLayer,
          {
            scale: 1.00,
            duration: duration,
            ease: zoomEase,
          },
          '<'
        );
        masterTl.to(
          currentLayer,
          {
            opacity: 0,
            duration: duration * 0.8,
            ease: fadeEase,
          },
          `<${duration * 0.2}`
        );

        // 5. Clean resting state after transition finishes
        masterTl.set(nextLayer, { zIndex: 2 });
        masterTl.set(currentLayer, { zIndex: 1, opacity: 0 });
      }

      // ScrollTrigger: automatically play when in viewport, pause when scrolled away
      const st = ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top bottom',
        end: 'bottom top',
        onEnter: () => masterTl.play(),
        onLeave: () => masterTl.pause(),
        onEnterBack: () => masterTl.play(),
        onLeaveBack: () => masterTl.pause(),
      });

      if (!st.isActive) {
        masterTl.pause();
      }

      // Browser tab visibility: pause when tab is inactive, resume when active
      const handleVisibilityChange = () => {
        if (document.hidden) {
          masterTl.pause();
        } else if (st.isActive) {
          masterTl.play();
        }
      };

      document.addEventListener('visibilitychange', handleVisibilityChange);

      return () => {
        document.removeEventListener('visibilitychange', handleVisibilityChange);
      };
    }, containerRef);

    return () => {
      ctx.revert();
    };
  }, [images, holdTime, duration, fadeEase, zoomEase, reducedMotion]);

  // Reduced motion fallback: show static first image
  if (reducedMotion || images.length === 0) {
    const firstImg = images[0];
    const src = typeof firstImg === 'string' ? firstImg : firstImg?.src;
    const alt =
      typeof firstImg === 'string'
        ? 'Zone01 Impact Image'
        : firstImg?.alt || 'Zone01 Impact Image';

    return (
      <div
        ref={containerRef}
        className={`relative w-full h-full overflow-hidden ${className}`}
      >
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover block"
          loading="eager"
        />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full overflow-hidden select-none ${className}`}
      role="region"
      aria-label="Zone01 Impact Gallery"
    >
      {images.map((img, idx) => {
        const src = typeof img === 'string' ? img : img.src;
        const alt =
          typeof img === 'string'
            ? 'Zone01 Impact Image'
            : img.alt || 'Zone01 Impact Image';

        return (
          <div
            key={src || idx}
            ref={(el) => {
              layersRef.current[idx] = el;
            }}
            className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none"
            style={{
              zIndex: idx === 0 ? 10 : 1,
              opacity: idx === 0 ? 1 : 0,
              transform: idx === 0 ? 'scale(1.08)' : 'scale(1.00)',
            }}
            aria-hidden={idx !== 0}
          >
            <img
              src={src}
              alt={alt}
              className="w-full h-full object-cover block"
              loading="eager"
            />
          </div>
        );
      })}
    </div>
  );
}
