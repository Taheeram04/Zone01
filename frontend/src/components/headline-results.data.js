// components/headline-results.data.js

/**
 * ============================================================================
 * Items Requiring User Confirmation (Defined as Constants per Specification)
 * ============================================================================
 */

// TODO: Confirm wording with user. In the reference mock, this label duplicated
// "Inaugural cohort apprentices", which is likely a placeholder for total applicants/reach.
export const LABEL_28K_PLUS = 'Inaugural cohort apprentices';

// Gender equity metric confirmed per specification:
export const LABEL_TWO_WOMEN = 'Earning more than $2,300 per month';

/**
 * ============================================================================
 * Statistics Data Array (All statistics editable in one place)
 * Strictly two themes: 'blue' (1/3 of cards) and 'white' (2/3 of cards).
 * Currency is represented using '$' as unit symbol with zero occurrences of the old currency code.
 * ============================================================================
 */
export const HEADLINE_STATISTICS = [
  {
    id: 'employment-rate',
    numericValue: 90,
    hasComma: false,
    prefix: '',
    suffix: '%',
    formattedDisplay: '90%',
    label: 'Employment rate',
    eyebrow: 'Key Outcome',
    theme: 'blue', // Hero solid brand-blue card
    gridClass: 'lg:col-span-5 lg:row-span-2 md:col-span-2',
    isHero: true,
  },
  {
    id: 'paid-work',
    numericValue: 86,
    hasComma: false,
    prefix: '',
    suffix: '',
    formattedDisplay: '86',
    label: 'Apprentices and graduates in paid work',
    eyebrow: 'Placement',
    theme: 'white',
    gridClass: 'lg:col-span-4 md:col-span-1',
  },
  {
    id: 'time-to-employment',
    numericValue: 6,
    hasComma: false,
    prefix: '',
    suffix: ' weeks',
    formattedDisplay: '6 weeks',
    label: 'Median time to employment after graduation',
    eyebrow: 'Speed',
    theme: 'white',
    gridClass: 'lg:col-span-3 md:col-span-1',
  },
  {
    id: 'inaugural-cohort',
    numericValue: 97,
    hasComma: false,
    prefix: '',
    suffix: '',
    formattedDisplay: '97',
    label: 'Inaugural cohort apprentices',
    eyebrow: 'Cohort',
    theme: 'white',
    gridClass: 'lg:col-span-3 md:col-span-1',
  },
  {
    id: 'applicants-reach',
    numericValue: 28000,
    hasComma: true,
    prefix: '',
    suffix: '+',
    formattedDisplay: '28,000+',
    label: LABEL_28K_PLUS,
    eyebrow: 'Reach',
    theme: 'blue', // Alternating blue card
    gridClass: 'lg:col-span-4 md:col-span-1',
  },
  {
    id: 'top-income',
    numericValue: 2500,
    hasComma: true,
    prefix: '$',
    suffix: '',
    formattedDisplay: '$2,500',
    label: 'Top monthly income',
    eyebrow: 'Income',
    theme: 'white',
    gridClass: 'lg:col-span-3 md:col-span-1',
  },
  {
    id: 'average-income',
    numericValue: 600,
    hasComma: false,
    prefix: '$',
    suffix: '',
    formattedDisplay: '$600',
    label: 'Average monthly income',
    eyebrow: 'Income',
    theme: 'white',
    gridClass: 'lg:col-span-3 md:col-span-1',
  },
  {
    id: 'annual-income',
    numericValue: 7200,
    hasComma: true,
    prefix: '$',
    suffix: '',
    formattedDisplay: '$7,200',
    label: 'Average annual income',
    eyebrow: 'Income',
    theme: 'white',
    gridClass: 'lg:col-span-3 md:col-span-1',
  },
  {
    id: 'women-earners',
    numericValue: 2,
    hasComma: false,
    prefix: '',
    suffix: ' women',
    formattedDisplay: '2 women',
    label: LABEL_TWO_WOMEN,
    eyebrow: 'Gender Equity',
    theme: 'blue', // Alternating blue card
    gridClass: 'lg:col-span-3 md:col-span-1',
  },
];
