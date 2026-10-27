// components/impact/PhotoSlot.jsx
export default function PhotoSlot({ src, alt = '', className = '', style = {} }) {
  if (src) {
    return (
      <img
        src={src}
        alt={alt}
        className={className}
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', ...style }}
      />
    );
  }
  return (
    <div className={`impact-ph ${className}`} style={style}>
      <span className="impact-mono">Photo: {alt || ''}</span>
    </div>
  );
}
