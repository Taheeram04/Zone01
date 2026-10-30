# QA & Security Sprint Blueprint

## Daily Execution Schedule (5-day)
- Day 1: Scope freeze, regression matrix kickoff, baseline perf capture.
- Day 2: Full regression pass on MVP pages; log defects; start a11y scan.
- Day 3: A11y fixes + WCAG checklist; security dependency scan.
- Day 4: Security fixes + perf optimization; re-run regression.
- Day 5: Final verification, blocker triage, UAT handoff prep.

## Acceptance Criteria for Exit Gates

### Blocker-severity bug definition
- Production data loss/corruption, auth bypass, app crash/hang, critical flow broken (register/apply/donate), security vuln high/critical.

### Accessibility audit quick-check (WCAG 2.1 AA)
- No critical axe violations; keyboard-only navigation; visible focus; contrast ≥4.5:1; alt text; reduced motion; screen reader labels.

### Performance targets
- LCP <2.5s, CLS <0.1, INP <200ms; API p95 <500ms; bundle size within budget; no horizontal overflow at 320px.

## Risk & Triage Framework (24-48h before UAT)
- Immediate triage within 1h; assign owner; attempt fix in ≤4h; if not fixable, rollback/feature-flag; re-run affected matrix; document residual risk; escalate to PM.