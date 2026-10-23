# perf(frontend): WebP images and self-hosted fonts

## Summary

Replaces the frontend image library with compressed WebP files and self-hosts
the two brand fonts. This removes the Google Fonts dependency, cuts the shipped
image payload from tens of megabytes to ~6 MB, and makes type and image
rendering identical on macOS, Windows and Linux.

**Base:** `develop` · **Head:** `perf/frontend-assets` · **Depends on:** none

## What changed

### Images
- Converted every raster asset in `frontend/src/assets` to WebP
  (`jpg`/`jpeg`/`png`/`avif` → `webp`), 110 WebP files in total.
- Deleted the 100 original files (101.5 MB freed). Source photos are preserved
  in git history.
- All images are ≤ 500 KB; largest is 461 KB (`knoeus02.webp`).
- Photo dimensions capped at 1920 px on the long edge; partner logos at 500 px.
- EXIF orientation baked in; the single embedded ICC profile was stripped so
  colours match across operating systems.
- Updated every import/reference from the old extensions to `.webp` across
  components, data files and pages.

### Fonts
- Self-hosted **Montserrat** (variable, weights 400–900) and **IBM Plex Mono**
  (400/500/600/700) as WOFF2 in `src/assets/fonts`.
- Removed the Google Fonts `@import`; fonts now ship with the bundle and resolve
  identically offline and on every OS.
- Added `font-display: swap`.

### Rendering normalisation (`index.css`)
- `-webkit-font-smoothing: antialiased`, `-moz-osx-font-smoothing: grayscale`,
  `font-synthesis: none` and `text-size-adjust: 100%` so macOS does not render
  text heavier/larger than Windows or Linux.
- Base-layer `img { height: auto; image-orientation: from-image; image-rendering: auto; }`
  to preserve aspect ratios while loading. It sits in `@layer base` so Tailwind
  size utilities (`h-full`, `h-10`, …) still win.

## Why

- Search and social previews were loading multi-megabyte JPEG/PNG photos.
- Google Fonts can be blocked or slow; fallback fonts changed the design between
  platforms (SF Pro on macOS, Segoe UI on Windows, DejaVu on Linux).
- Production builds under Django need every asset to resolve under
  `VITE_BASE=/static/`.

## Testing

- `npm run build` and `VITE_BASE=/static/ npm run build` pass.
- Built `dist/assets`: 60 WebP images, none over 500 KB, ~6 MB total.
- `/`, `/about`, `/community`, `/faq`, `/hire`: every image served as WebP, no
  broken images, no horizontal overflow.
- `document.fonts.check('900 16px Montserrat')` and
  `document.fonts.check('400 14px "IBM Plex Mono"')` return true; no requests to
  `fonts.googleapis.com` / `fonts.gstatic.com`.
- Hero/image height utilities still resolve correctly (hero 900 px at a
  1440×900 viewport; icon sizes unchanged).

## Notes

- `Cartoon2.avif` (144 KB) was decoded through Chromium and re-saved losslessly
  as `Cartoon2.webp` (252 KB).
- Original JPG/PNG files are intentionally removed; they remain in git history
  and can be restored if a future export is needed.
- Fonts add ~100 KB to the bundle.
