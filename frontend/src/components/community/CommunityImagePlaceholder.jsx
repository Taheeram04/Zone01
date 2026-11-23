/**
 * Reusable image placeholder component with four tones:
 * - 'a': #DCE7FF (light blue 1)
 * - 'b': #C4D6FF (light blue 2)
 * - 'c': #0063F9 (primary blue)
 * - 'd': #092C3E (dark navy)
 *
 * Renders an animated dot grid and small monospace label, or a real <img>
 * whenever a source (src) is supplied.
 */
export default function CommunityImagePlaceholder({
  src,
  alt = '',
  tone = 'a',
  label = 'Image',
  className = '',
  imageClassName = '',
}) {
  if (src) {
    return (
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className={`h-full w-full object-cover ${imageClassName || className}`}
      />
    );
  }

  const toneClass = `community-ph-${tone}`;

  return (
    <div
      role="img"
      aria-label={alt || `${label} placeholder`}
      className={`community-ph ${toneClass} ${className}`}
    >
      {label && <span>{label}</span>}
    </div>
  );
}
