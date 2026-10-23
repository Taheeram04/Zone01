# feat(brand): favicons, web manifest and search metadata

## Summary

Gives Zone01 Kisumu a proper brand presence in browser tabs, bookmarks,
home-screen installs, Google results and social previews, using the existing
Zone01 Kisumu logo.

**Base:** `develop` · **Head:** `feat/brand-search` · **Depends on:** none

## What changed

### Icons (`frontend/public/`)
- `favicon.ico` (16/32/48) plus 16/32/48/192/512 px PNG favicons.
- `apple-touch-icon.png` (180 px).
- `site.webmanifest` with app name, colours and 192/512 icons.
- `zone01-kisumu-logo.png` — full wordmark for search/social previews.
- The "01" dot mark is used for the small icons so it stays legible at 16 px;
  the full wordmark is used where space allows (schema/OG).

### `frontend/index.html`
- Favicon, touch-icon and manifest links using `%BASE_URL%`, which resolves to
  `/` in dev and `/static/` in the Django build.
- Canonical URL, `robots`, Open Graph and Twitter card metadata.
- Valid JSON-LD `Organization` + `WebSite` graph:
  - name `Zone01 Kisumu`, production URL, full logo, description
  - Kisumu address and phone number
  - `WebSite` publisher linked to the organization.

## Why

- The previous `<link rel="icon" href="/favicon.svg">` pointed at a file that did
  not exist; the SPA catch-all returned HTML instead of an icon.
- Google uses the declared favicon and Organization logo for search results and
  knowledge panels.
- Absolute production URLs are required for structured data and social cards.

## Testing

- `curl` against the dev server: `favicon.ico` → 200 `image/x-icon`; PNG icons and
  manifest → 200 with correct MIME types.
- `VITE_BASE=/static/ npm run build`: `dist/index.html` references
  `/static/favicon.ico`, `/static/icon-48.png`, `/static/site.webmanifest`, etc.
- JSON-LD block parses as valid JSON.
- Page head verified in the browser: five icon links, manifest, canonical, OG
  image and JSON-LD present.

## Rollout notes

- Run `make frontend` (or the deploy build) after merge so `collectstatic` copies
  the new `public/` files into `STATIC_ROOT`.
- Google refreshes favicons/logos on its own crawl cadence (days–weeks). Submit
  the URL in Google Search Console to request re-indexing.
