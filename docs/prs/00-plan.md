# PR plan — Hire Talent refresh, performance and mobile work

Current state: all work sits uncommitted in the working tree on
`feat/hire-employer-story` (164 status entries, 80 tracked files changed).
`gh` is not installed in this environment, so the PRs below are ready to be
committed, pushed and opened from the GitHub UI (or with `gh pr create` once
installed/authenticated).

The changes are split into four PRs. They are **stacked**, because the WebP and
font work touches import lines inside files that the feature PRs also modify.

```
develop
  ├── perf/frontend-assets        (PR 1, merge first)
  │     ├── feat/hire-employer-story        (PR 3)
  │     └── feat/mobile-interactive         (PR 4)
  └── feat/brand-search             (PR 2, independent)
```

## Merge order

1. **PR 1 — `perf/frontend-assets`** — WebP images + self-hosted fonts.
2. **PR 2 — `feat/brand-search`** — favicons, manifest, Open Graph, JSON-LD.
3. **PR 3 — `feat/hire-employer-story`** — base `perf/frontend-assets`.
4. **PR 4 — `feat/mobile-interactive`** — base `perf/frontend-assets`.

PR 3 and PR 4 touch different component trees and can merge in either order
after PR 1. Rebase each on `develop` before merging.

## Suggested commits

### PR 1
- `perf(assets): replace source images with compressed WebP`
- `perf(fonts): self-host Montserrat and IBM Plex Mono`
- `perf(frontend): normalise cross-platform image and text rendering`
- `refactor(assets): point imports at WebP files`

### PR 2
- `feat(brand): add favicon set, web manifest and touch icon`
- `feat(seo): add canonical, Open Graph, Twitter and Organization schema`

### PR 3
- `feat(hire): build the employer story on the Hire Talent page`
- `feat(hire): add partner logo marquee to the hero`
- `feat(hire): interactive services console with photography`
- `feat(hire): hover-photo difference cards and FAQ accordion`
- `feat(hire): refresh brief form, contact email and section spacing`
- `style(hire): apply the shared type scale`

### PR 4
- `feat(mobile): swipeable impact and audience carousels`
- `feat(mobile): tappable Why Zone01 accordion`
- `feat(nav): highlight the active page and add press feedback`
- `chore(home): remove the custom magnetic cursor`

## Splitting the working tree

Because everything is uncommitted, stage selectively:

```bash
# PR 1
git checkout -b perf/frontend-assets develop
git add frontend/src/assets frontend/src/assets/fonts
git add -p frontend/src/index.css        # font-face + image normalisation hunks
git add -p frontend/src/**/*.jsx frontend/src/**/*.js  # import-only hunks
git commit -m "perf(assets): serve WebP images and self-hosted fonts"

# PR 2 (from develop, independent)
git checkout develop && git checkout -b feat/brand-search
git add frontend/public frontend/index.html
git commit -m "feat(brand): add icons, manifest and search metadata"
```

For PR 3/4, branch from `perf/frontend-assets` after PR 1 is committed and stage
the remaining feature hunks (`git add -p`). Files touched by both an import swap
and a feature go to the feature PR except the import lines, which belong to
PR 1.

## Verification used for every PR

```bash
cd frontend
npm run lint
npm run build
VITE_BASE=/static/ npm run build   # production/Django path
```

Browser checks: `/`, `/about`, `/community`, `/faq`, `/hire` at 1440×900,
1024×768, 390×844 and 320×568, with no broken images or horizontal overflow.

## Opening the PRs

`gh` is not installed/authenticated in this environment. Once it is:

```bash
git push -u origin perf/frontend-assets
git push -u origin feat/brand-search
git push -u origin feat/hire-employer-story
git push -u origin feat/mobile-interactive

gh pr create --base develop --head perf/frontend-assets \
  --title "perf(frontend): WebP images and self-hosted fonts" \
  --body-file docs/prs/01-performance-assets-fonts.md

gh pr create --base develop --head feat/brand-search \
  --title "feat(brand): favicons, web manifest and search metadata" \
  --body-file docs/prs/02-brand-search.md

gh pr create --base develop --head feat/hire-employer-story \
  --title "feat(hire): complete employer story on the Hire Talent page" \
  --body-file docs/prs/03-hire-talent-refresh.md

gh pr create --base develop --head feat/mobile-interactive \
  --title "feat(mobile): swipeable home sections and tappable accordion" \
  --body-file docs/prs/04-mobile-interactive.md
```

