// components/story-dialog.jsx
import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

/**
 * Full-story dialog shared by the featured news banner and the Community Hub
 * cards. The HTML comes from the CMS (djangocms-text sanitises it on save).
 */
const StoryDialog = ({ open, onClose, title, image, html }) => {
  const closeRef = useRef(null);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!open) return undefined;

    const onKeyDown = (event) => {
      if (event.key === 'Escape') onCloseRef.current?.();
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', onKeyDown);
    closeRef.current?.focus();

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      role="presentation"
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
      onClick={() => onCloseRef.current?.()}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-secondary/60 backdrop-blur-sm"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="story-dialog-title"
        className="relative z-10 flex max-h-[85vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-[#E5E7EB] px-5 py-4 sm:px-6 sm:py-5">
          <h2
            id="story-dialog-title"
            className="font-sans text-lg font-black uppercase leading-tight tracking-tight text-primary sm:text-2xl"
          >
            {title}
          </h2>
          <button
            ref={closeRef}
            type="button"
            onClick={() => onCloseRef.current?.()}
            aria-label="Close article"
            className="flex h-9 w-9 flex-none items-center justify-center rounded-full border border-[#E5E7EB] text-secondary transition-colors hover:border-primary hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <div className="overflow-y-auto px-5 py-5 sm:px-6">
          {image && (
            <img
              src={image}
              alt={title}
              className="mb-5 max-h-72 w-full rounded-lg object-cover"
            />
          )}
          <div
            className="font-sans text-base leading-relaxed text-[#111827] [&>*:first-child]:mt-0 [&_a]:text-primary [&_a]:underline [&_blockquote]:border-l-2 [&_blockquote]:border-primary/40 [&_blockquote]:pl-4 [&_em]:italic [&_h2]:mt-6 [&_h2]:font-sans [&_h2]:text-xl [&_h2]:font-black [&_h2]:text-secondary [&_h3]:mt-5 [&_h3]:font-sans [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-secondary [&_img]:my-4 [&_img]:h-auto [&_img]:max-w-full [&_li]:my-1 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:mt-4 [&_strong]:font-bold [&_table]:my-4 [&_table]:w-full [&_table]:border-collapse [&_td]:border [&_td]:border-[#E5E7EB] [&_td]:p-2 [&_th]:border [&_th]:border-[#E5E7EB] [&_th]:bg-[#F8FAFC] [&_th]:p-2 [&_u]:underline [&_ul]:list-disc [&_ul]:pl-6"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>
      </div>
    </div>
  );
};

export default StoryDialog;
