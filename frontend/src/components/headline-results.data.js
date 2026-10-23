// components/headline-results.data.js

/**
 * Headline Results Data
 * Configurable data object powering the Headline Results bento grid.
 * All figures, copy, and layout metadata editable in one place.
 */
export const HEADLINE_DATA = {
  header: {
    title: 'Headline results.',
    dateBadge: 'As of August 2026',
  },
  keyOutcome: {
    id: 'employment-rate',
    eyebrow: 'Key outcome',
    numericValue: 89,
    formattedDisplay: '89%',
    label: 'Employment rate',
    sublabel: 'In paid work',
    remainderLabel: 'Are not yet in paid work',
    remainderRaw: 11,
    theme: 'blue',
  },
  placement: {
    id: 'paid-work',
    eyebrow: 'Placement',
    numericValue: 86,
    formattedDisplay: '86',
    label: 'Apprentices and graduates in paid work',
    totalDots: 97,
    employedDots: 86,
    theme: 'white',
  },
  speed: {
    id: 'time-to-employment',
    eyebrow: 'Speed',
    numericValue: 6,
    prefix: '~',
    suffix: 'weeks',
    formattedDisplay: '~6 weeks',
    label: 'Median time to employment after graduation',
    theme: 'white',
  },
  cohort: {
    id: 'inaugural-cohort',
    eyebrow: 'Cohort',
    numericValue: 97,
    formattedDisplay: '97',
    label: 'Inaugural cohort apprentices',
    theme: 'white',
  },
  demand: {
    id: 'applications-received',
    eyebrow: 'Demand',
    numericValue: 28000,
    hasComma: true,
    suffix: '+',
    formattedDisplay: '28,000+',
    label: 'Applications received',
    theme: 'blue',
  },
  incomeTrajectory: {
    id: 'income-trajectory',
    eyebrow: 'Earnings trajectory',
    badge: '$7,200 average annual income',
    bars: [
      { id: 'intake', value: '$60', raw: 60, heightPct: 24, label: 'At intake' },
      { id: 'first-paid', value: '$320', raw: 320, heightPct: 46, label: 'First paid engagement' },
      { id: 'current-avg', value: '$600', raw: 600, heightPct: 68, label: 'Current average' },
      { id: 'top-earners', value: '$2,500', raw: 2500, heightPct: 100, label: 'Top earners' },
    ],
    theme: 'white',
  },
  genderEquity: {
    id: 'gender-equity',
    eyebrow: 'Gender equity',
    numericValue: 2,
    suffix: ' women',
    formattedDisplay: '2 women',
    label: 'Earning more than $2,300 per month',
    theme: 'blue',
  },
};
