// Shared dark-mode visuals for the standalone 01Edu platform pages
// (login at /apply, registration at /register).

// Deterministic abstract topographic contour lines flowing across the canvas.
const CONTOUR_PATHS = Array.from({ length: 16 }, (_, i) => {
  const baseY = (i / 15) * 100;
  const amp = 5 + (i % 4) * 2.5;
  const phase = i * 0.6;
  const points = [];
  for (let x = 0; x <= 100; x += 4) {
    const y =
      baseY +
      Math.sin((x / 100) * Math.PI * 2 + phase) * amp +
      Math.sin((x / 100) * Math.PI * 6 + phase * 1.7) * (amp * 0.35);
    points.push(`${x} ${y.toFixed(2)}`);
  }
  return `M ${points.join(' L ')}`;
});

export const Contours = () => (
  <svg
    className="pointer-events-none absolute inset-0 h-full w-full text-neutral-400/[0.13]"
    viewBox="0 0 100 100"
    preserveAspectRatio="none"
    aria-hidden="true"
  >
    {CONTOUR_PATHS.map((d, i) => (
      <path
        key={i}
        d={d}
        fill="none"
        stroke="currentColor"
        strokeWidth={1}
        vectorEffect="non-scaling-stroke"
      />
    ))}
  </svg>
);

// 5x7 dot-matrix glyphs for a blocky, LED scoreboard-style "01" logo.
const LOGO_GLYPHS = {
  0: [
    '01110',
    '10001',
    '10001',
    '10001',
    '10001',
    '10001',
    '01110',
  ],
  1: [
    '00100',
    '01100',
    '00100',
    '00100',
    '00100',
    '00100',
    '01110',
  ],
};

const GLYPH_COLS = 5;
const GLYPH_GAP = 1;

export const DotMatrixLogo = ({ className = '' }) => {
  const glyphs = ['0', '1'];

  return (
    <svg
      viewBox={`0 0 ${glyphs.length * GLYPH_COLS + GLYPH_GAP} 7`}
      className={className}
      role="img"
      aria-label="01"
    >
      {glyphs.flatMap((glyph, glyphIndex) =>
        LOGO_GLYPHS[glyph].flatMap((row, y) =>
          row.split('').map((cell, x) =>
            cell === '1' ? (
              <circle
                key={`${glyphIndex}-${x}-${y}`}
                cx={glyphIndex * (GLYPH_COLS + GLYPH_GAP) + x + 0.5}
                cy={y + 0.5}
                r={0.42}
                fill="currentColor"
              />
            ) : null
          )
        )
      )}
    </svg>
  );
};

// Shared copy for the onboarding instructions shown beside the forms.
export const OnboardingSteps = () => (
  <ol className="mt-6 space-y-5">
    <li className="flex gap-3">
      <span className="text-neutral-500">1)</span>
      <span>Create an account, and log into the platform.</span>
    </li>
    <li className="flex gap-3">
      <span className="text-neutral-500">2)</span>
      <span>Complete the online cognitive test.</span>
    </li>
    <li className="flex gap-3">
      <span className="text-neutral-500">3)</span>
      <span>Wait to find out whether you&apos;ve made it to the next stage.</span>
    </li>
  </ol>
);
