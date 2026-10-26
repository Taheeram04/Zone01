// components/ImpactStoryModal.jsx
import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';

export default function ImpactStoryModal({ story, onClose }) {
  const modalRef = useRef(null);
  const closeBtnRef = useRef(null);
  const triggerRef = useRef(null);

  useEffect(() => {
    triggerRef.current = document.activeElement;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeBtnRef.current?.focus();
    const handleKey = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key === 'Tab') {
        const focusable = modalRef.current?.querySelectorAll('button, [href], [tabindex]:not([tabindex="-1"])');
        if (!focusable || focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };
    document.addEventListener('keydown', handleKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener('keydown', handleKey);
      triggerRef.current?.focus();
    };
  }, [onClose]);

  const firstName = story.firstName || story.name?.split(' ')[0] || 'talent';

  return createPortal(
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={`story-modal-title-${story.id}`}
    >
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div
        ref={modalRef}
        className="relative bg-white rounded-[24px] max-w-5xl w-full max-h-[92vh] overflow-y-auto shadow-2xl"
      >
        <button
          ref={closeBtnRef}
          onClick={onClose}
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 flex items-center justify-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary z-10"
          aria-label="Close story"
        >
          ×
        </button>
        <div className="relative w-full h-[260px] sm:h-[340px]">
          <img
            src={story.image?.wide?.src || story.image?.portrait?.src}
            alt={story.image?.wide?.alt || story.image?.portrait?.alt || story.name}
            className="w-full h-full object-cover"
            style={{ backgroundColor: '#BFD8FD' }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>
        <div className="p-6 sm:p-10 flex flex-col gap-6">
          <div>
            <h3 id={`story-modal-title-${story.id}`} className="font-sans font-black text-black-900 text-2xl sm:text-4xl">
              {story.name}
            </h3>
            <p className="font-mono text-sm text-black-900/70">{story.role} · {story.cohort}</p>
          </div>
          {story.quote && (
            <blockquote className="font-sans font-black text-black-900 text-xl sm:text-2xl leading-snug">
              “{story.quote}”
            </blockquote>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-[16px] border border-black-900/10 p-4">
              <p className="font-mono text-xs text-black-900/60">Before</p>
              <p className="font-sans text-sm text-black-900 mt-1">{story.journey?.before}</p>
            </div>
            <div className="rounded-[16px] border border-black-900/10 p-4">
              <p className="font-mono text-xs text-black-900/60">At Zone01</p>
              <p className="font-sans text-sm text-black-900 mt-1">{story.journey?.during}</p>
            </div>
            <div className="rounded-[16px] border border-black-900/10 p-4">
              <p className="font-mono text-xs text-black-900/60">Now</p>
              <p className="font-sans text-sm text-black-900 mt-1">{story.journey?.now}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {story.outcomeChips?.filter((c) => c.verified).map((c, i) => (
              <span key={i} className="font-mono text-xs px-3 py-1 rounded-full bg-primary/10 text-primary">{c.label}: {c.value}</span>
            ))}
          </div>
          <div className="flex flex-col gap-4 font-sans text-body-m text-black-900/90 leading-relaxed">
            {story.longParagraphs?.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
          <Link
            to="/hire"
            className="self-start px-6 py-2 rounded-full bg-primary text-white font-mono text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
            onClick={onClose}
          >
            Hire talent like {firstName}
          </Link>
        </div>
      </div>
    </div>,
    document.body
  );
}
