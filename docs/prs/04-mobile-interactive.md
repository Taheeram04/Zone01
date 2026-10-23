# feat(mobile): swipeable home sections, tappable accordion and normal cursor

## Summary

Turns the home page's vertical mobile stack into touch-first, swipeable
components while leaving every desktop layout untouched. Also removes the custom
magnetic cursor and adds active-page/nav tap feedback.

**Base:** `develop` (after #1) · **Head:** `feat/mobile-interactive` ·
**Depends on:** PR 1 (`perf/frontend-assets`) for WebP logos/photos

## What changed

### Impact stats (`stats.jsx`)
- Mobile-only carousel of six stat cards with count-up animation.
- Swipe with scroll-snap and pagination dots that follow the active card; dots
  are tappable and jump to a card.
- Desktop keeps the existing white feature cards + metric columns.
- Removed the empty spacer paragraph from mobile.

### Who is it for? (`whoisitfor.jsx`)
- Mobile-only horizontal snap carousel (85 % card width, next card peeking) with
  dots and the Apply Now CTA below.
- Desktop keeps the original three-column 4:4.3 image grid.
- Uses the shared `useSnapCarousel` hook.

### Why Zone01 Kisumu? (`whyourcampus.jsx`)
- Mobile-only accordion for the six campus features: tap to open/close, rotating
  chevron, animated `0fr → 1fr` heights, first item open by default.
- Desktop keeps the 2/3-column feature grid.

### New hook (`hooks/useSnapCarousel.js`)
- Measures card width + gap to compute the active index and powers smooth
  `goTo()` from pagination dots.

### Navigation + touch feedback (`navbar.jsx`, `button.jsx`)
- Active route highlighted in desktop and mobile menus (`aria-current="page"`).
- Buttons gain a subtle `active:scale-[0.98]` press state for touch devices.

### Custom cursor removed (`hero.jsx`, `magnetic-cursor.jsx`)
- Deleted the magnetic cursor component and its `data-magnetic` hooks.
- Hero now uses the standard system pointer again; the background parallax is
  unchanged.

## Why

- On phones the home page was 7.7 viewports tall, with three full-width portrait
  cards and six stacked feature blocks.
- Touch users had no way to page through impact cards or audience types, and the
  custom dot cursor only made sense with a mouse.

## Results

- Mobile home height: **6507 px → 4165 px** (~36 % shorter).
- Impact section **923 → 363 px**, audience section **1756 → 825 px**,
  Why Zone01 section **1618 → 767 px**.
- No horizontal overflow at 390×844 or 320×568.
- Desktop sanity check: audience section still 3 columns, stats desktop layout
  visible, mobile accordion hidden.

## Testing

- Playwright at 390×844 and 320×568: swipe/scroll the carousels, confirm dots
  update; tap accordion rows and confirm `aria-expanded` toggles; check page
  `scrollWidth === innerWidth`.
- Desktop 1440×900: original grids/layouts preserved; emulated mouse cursor is
  `auto` and no fixed custom dot is rendered.
- `npm run lint`, `npm run build`, `VITE_BASE=/static/ npm run build` pass.

## Notes

- Mobile-only markup is guarded with `md:hidden` / `hidden md:*`; no desktop
  behaviour changes.
- Pre-existing console warning about a nested `<p>` in `WhoCanApply` is
  unrelated to this PR.
