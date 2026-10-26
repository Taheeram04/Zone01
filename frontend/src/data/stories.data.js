// components/data/stories.data.js
// REPLACE THESE FIELDS BEFORE PUBLISHING
// Required: id, status('published'|'placeholder'), consent(boolean true to publish), featured(boolean), name, firstName, role, cohort, quote, longParagraphs(string[] 3-4), journey{before, during, now}, outcomeChips([{label,value,verified}]), image{portrait:{src,alt,width,height}, wide:{src,alt,width,height}}
export const STORIES = [
  {
    id: 'story-1',
    status: 'placeholder',
    consent: true,
    featured: true,
    name: 'Apprentice name',
    firstName: 'Apprentice',
    role: 'Software Engineer',
    cohort: 'Cohort 1',
    quote: 'Zone01 gave me the chance to learn by doing and build a career.',
    longParagraphs: [
      'Short placeholder story paragraph one. Replace with a real story.',
      'Short placeholder story paragraph two. Replace with a real story.',
      'Short placeholder story paragraph three. Replace with a real story.',
      'Short placeholder story paragraph four. Replace with a real story.',
    ],
    journey: {
      before: 'Placeholder before line.',
      during: 'Placeholder during line.',
      now: 'Placeholder now line.',
    },
    outcomeChips: [
      { label: 'Current role', value: 'Placeholder role', verified: false },
      { label: 'Employer type', value: 'Placeholder', verified: false },
      { label: 'Monthly income band', value: 'Placeholder', verified: false },
    ],
    image: {
      portrait: { src: '/src/assets/placeholders/story-1-portrait.svg', alt: 'Portrait of Apprentice name', width: 800, height: 1000 },
      wide: { src: '/src/assets/placeholders/story-1-wide.svg', alt: 'Wide photo of Apprentice name', width: 1200, height: 800 },
    },
  },
  {
    id: 'story-2',
    status: 'placeholder',
    consent: true,
    featured: false,
    name: 'Apprentice name 2',
    firstName: 'Apprentice',
    role: 'Backend Developer',
    cohort: 'Cohort 1',
    quote: 'Learning through projects changed how I approach problems.',
    longParagraphs: [
      'Short placeholder story paragraph one. Replace with a real story.',
      'Short placeholder story paragraph two. Replace with a real story.',
      'Short placeholder story paragraph three. Replace with a real story.',
      'Short placeholder story paragraph four. Replace with a real story.',
    ],
    journey: {
      before: 'Placeholder before line.',
      during: 'Placeholder during line.',
      now: 'Placeholder now line.',
    },
    outcomeChips: [
      { label: 'Current role', value: 'Placeholder role', verified: false },
      { label: 'Employer type', value: 'Placeholder', verified: false },
      { label: 'Monthly income band', value: 'Placeholder', verified: false },
    ],
    image: {
      portrait: { src: '/src/assets/placeholders/story-2-portrait.svg', alt: 'Portrait of Apprentice name 2', width: 800, height: 1000 },
      wide: { src: '/src/assets/placeholders/story-2-wide.svg', alt: 'Wide photo of Apprentice name 2', width: 1200, height: 800 },
    },
  },
  {
    id: 'story-3',
    status: 'placeholder',
    consent: true,
    featured: false,
    name: 'Apprentice name 3',
    firstName: 'Apprentice',
    role: 'Frontend Developer',
    cohort: 'Cohort 1',
    quote: 'Peer learning gave me confidence to build real products.',
    longParagraphs: [
      'Short placeholder story paragraph one. Replace with a real story.',
      'Short placeholder story paragraph two. Replace with a real story.',
      'Short placeholder story paragraph three. Replace with a real story.',
      'Short placeholder story paragraph four. Replace with a real story.',
    ],
    journey: {
      before: 'Placeholder before line.',
      during: 'Placeholder during line.',
      now: 'Placeholder now line.',
    },
    outcomeChips: [
      { label: 'Current role', value: 'Placeholder role', verified: false },
      { label: 'Employer type', value: 'Placeholder', verified: false },
      { label: 'Monthly income band', value: 'Placeholder', verified: false },
    ],
    image: {
      portrait: { src: '/src/assets/placeholders/story-3-portrait.svg', alt: 'Portrait of Apprentice name 3', width: 800, height: 1000 },
      wide: { src: '/src/assets/placeholders/story-3-wide.svg', alt: 'Wide photo of Apprentice name 3', width: 1200, height: 800 },
    },
  },
];
