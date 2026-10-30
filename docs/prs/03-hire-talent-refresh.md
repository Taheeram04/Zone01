# feat(hire): complete employer story on the Hire Talent page

## Summary

Builds `/hire` into a full employer journey — promise, proof, capabilities,
pipeline, engagement models, employer panel, FAQs and a brief form — and adds
the interactive service console, partner marquee, hover photography, accordions
and the shared typography scale.

**Base:** `develop` (after #1) · **Head:** `feat/hire-employer-story` ·
**Depends on:** PR 1 (`perf/frontend-assets`) for WebP/font assets

## Highlights

### Page composition (`pages/Hire.jsx`)
- Section order: hero → proof band → why engineers are different → services →
  skills & roles → technologies → pipeline → engagement models → what makes us
  unique → employer FAQ → talent request.
- Copy and comments describe the employer story end to end.

### Hero + partners (`hire-hero.jsx`, `hire-partners.jsx`)
- New partner ribbon pinned to the bottom of the hero, using the same blue as
  the proof band (`bg-primary`) so hero and metrics read as one block.
- 18 partner logos on white tiles, continuous right-to-left marquee, edge fade,
  hover-to-pause, reduced-motion fallback, two-line "Hiring partners" label.
- Hero content padded to sit clear of the ribbon; H1 uses the shared type scale.

### Proof band (`hire-proof.jsx`)
- Stat numbers switched to IBM Plex Mono 40/48 px medium; labels use the mono
  metadata style.

### Why Zone01 engineers are different (`hire-difference.jsx`)
- Each of the three pillars reveals a photograph on hover/touch (blurred-in by
  opacity/scale), with an overlay dark enough for white copy but light enough to
  keep the photo visible.
- Copy and card type sizes aligned to the shared scale.

### Services console (`services-section.jsx`)
- Tabs respond to hover, click, focus and arrow keys; a spring `layoutId`
  indicator slides between tabs.
- Right-hand photo panel crossfades between four service photos with a blur/scale
  entrance, light sweep and a glass caption ("Built and peer-reviewed by Zone01
  talent").
- Leaving and re-entering the section always resets to **Software Development as
  a Service** via an `IntersectionObserver`.
- Photo/tab order keeps Software Development on the first tab.

### Skills and typical roles (`hire-skills.jsx`)
- Converted to an FAQ-style accordion: hover previews a discipline, click/Enter
  pins it; smooth `0fr → 1fr` expansion.
- "Where our talent lands" panel refreshed with type scale and CTA.

### Engagement models (`hire-options.jsx`)
- "From brief to first day" panel replays its entrance whenever it scrolls back
  into view (`once: false`), with reduced travel and quicker stagger. The moving
  progress dot/line replay too.

### Employer panel + FAQ + request
- `what-makes-us-unique.jsx`: new event photo, lighter left-to-right gradient,
  vertical vignette, mobile readability layer, reframed crop, copy and spacing.
- `hire-faq.jsx`: hover/click accordion with the general-FAQ plus/minus icon,
  animated height, fade/slide answer, pinned-on-keyboard behaviour.
- `hire-request.jsx`: request section now uses the same primary blue as the
  metrics band, with the eyebrow removed and the form/typography refreshed.
- `constants.js`: hiring inbox updated to `talent@zone01kisumu.ke`
  (FAQ + request panel).

### Content and spacing
- Replaced the flagged em dashes in the difference intro, self-learning copy and
  Developers on Demand fallback description.
- Applied the shared type scale: hero 48/72/96 black 900, section 30/36 black
  900, CTA 24 black 900, body 16/18 · 14 · 12, mono reserved for labels,
  captions and metadata.
- Tightened inconsistent section gaps (why/services/skills/options, panel →
  unique, email → FAQ, request → footer) to one rhythm.

## Accessibility

- Tabs keep `role="tab"`, `aria-selected`, `aria-controls`; keyboard arrows,
  Home/End supported.
- Accordions use `aria-expanded`/`aria-controls` with keyboard support.
- Decorative images are `aria-hidden`; partner marquee's duplicate list is hidden
  from assistive tech.
- `useReducedMotion`/`motion-reduce` respected for the heavier image and
  accordion transitions.

## Testing

- `npm run lint` and `npm run build` pass (also with `VITE_BASE=/static/`).
- `/hire` checked at 1440×900, 1024×768, 390×844:
  - service tabs switch on hover and reset to the first service after scrolling
    away and back;
  - images crossfade without console errors;
  - difference cards show photos on hover;
  - skills/FAQ accordions open on hover, pin on click/keyboard;
  - partner marquee loops seamlessly and pauses on hover;
  - form selects/validation unchanged; email shows the new inbox.

## Notes

- PR 3 is based on PR 1, so the WebP imports, self-hosted fonts and partner-logo
  files are already present; this PR adds the components, content and the marquee
  keyframes.
- The marquee keyframes are the only `index.css` addition in this PR.
