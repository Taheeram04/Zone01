# Lint Errors by Role

## Frontend (React/ESLint)

File: `frontend/src/components/Startups.jsx`
- 2:10 `useRef` defined but never used (no-unused-vars) — remove import.

File: `frontend/src/components/impact-hero.jsx`
- 13:14, 46:14 fast-refresh: move shared constants/functions out of component file.
- 130:10/22 `isRevealed`/`setIsRevealed` unused — remove state.
- 199:7 setState synchronously in effect — initialize lazily or guard with condition.

File: `frontend/src/components/impact-shared.jsx`
- 9:17 fast-refresh: move shared constants/functions out.
- 29:7, 71:7 setState synchronously in effect — lazy init / derive.

File: `frontend/src/components/impact/Carousel.jsx`
- 8:3 `gap` assigned but never used — remove.

File: `frontend/src/components/impact/CountUp.jsx`
- 2:8 `React` unused — remove import.
- 9:17 fast-refresh: move `parseValue` to separate util file.
- 51-105 conditional hooks — call hooks unconditionally or split components.
- 108:13 `formatted` assigned but unused — remove.

## Backend
None reported by current lint.
"