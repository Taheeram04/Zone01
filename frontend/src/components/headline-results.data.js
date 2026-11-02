// components/headline-results.data.js

/**
 * Headline Results Data
 * Configurable data object powering the Headline Results section.
 * All figures, copy, and layout metadata editable in one place.
 */
export const HEADLINE_DATA = {
  header: {
    title: 'Headline results',
    dateBadge: 'As of August 2026',
  },
  cards: [
    {
      id: 'cohort',
      numericValue: 97,
      formattedDisplay: '97',
      label: 'Inaugural cohort apprentices',
      theme: 'white',
    },
    {
      id: 'paid-work',
      numericValue: 86,
      formattedDisplay: '86',
      label: 'Apprentices and graduates in paid work',
      theme: 'blue',
    },
    {
      id: 'applications',
      numericValue: 28000,
      hasComma: true,
      suffix: '+',
      formattedDisplay: '28,000+',
      label: 'Applications received',
      theme: 'white',
    },
    {
      id: 'avg-monthly',
      numericValue: 600,
      prefix: 'USD ',
      formattedDisplay: 'USD 600',
      label: 'Average monthly income',
      theme: 'white',
    },
    {
      id: 'top-monthly',
      numericValue: 2500,
      prefix: 'USD ',
      formattedDisplay: 'USD 2,500',
      label: 'Top monthly earnings',
      theme: 'white',
    },
    {
      id: 'women-high-earners',
      numericValue: 2,
      suffix: '',
      formattedDisplay: '2',
      label: 'women Earning more than USD 2,300 per month',
      theme: 'white',
    },
  ],
};

// Data retained but not rendered in the calm Headline results grid (kept for reuse)
export const HEADLINE_HERO_RETAINED = {
  keyOutcome: {
    id: 'employment-rate',
    numericValue: 89,
    formattedDisplay: '89%',
    label: 'Employment rate',
    sublabel: 'In paid work',
  },
  speed: {
    id: 'time-to-employment',
    numericValue: 6,
    prefix: '~',
    suffix: ' weeks',
    formattedDisplay: '~6 weeks',
    label: 'Median time to employment after graduation',
  },
  incomeAnnual: {
    id: 'income-annual',
    numericValue: 7200,
    prefix: 'USD ',
    formattedDisplay: 'USD 7,200',
    label: 'Average annual income',
  },
};
