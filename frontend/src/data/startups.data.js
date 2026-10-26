// components/data/startups.data.js
// REPLACE THESE FIELDS BEFORE PUBLISHING
// Required: id, status('published'|'placeholder'), name, tagline, description, sector, stage('Idea'|'Prototype'|'Launched'|'Revenue'), founders([{name,role,initials}]), yearStarted, website(https), tractionNote(verified), image{screenshot:{src,alt,width,height}, logo:{src,alt,width,height}}, emphasised(optional)
export const STARTUPS = [
  {
    id: 'startup-1',
    status: 'placeholder',
    name: 'Startup name',
    tagline: 'Placeholder tagline.',
    description: 'Short one-line description goes here.',
    sector: 'AgriTech',
    stage: 'Prototype',
    founders: [
      { name: 'Founder name', role: 'CEO', initials: 'FN' },
    ],
    yearStarted: '2025',
    website: 'https://example.com',
    tractionNote: 'Placeholder traction note',
    emphasised: false,
    image: {
      screenshot: { src: '/src/assets/placeholders/startup-1-screenshot.svg', alt: 'Startup name screenshot', width: 1200, height: 800 },
      logo: { src: '/src/assets/placeholders/startup-1-logo.svg', alt: 'Startup name logo', width: 400, height: 400 },
    },
  },
  {
    id: 'startup-2',
    status: 'placeholder',
    name: 'Startup name 2',
    tagline: 'Placeholder tagline.',
    description: 'Short one-line description goes here.',
    sector: 'FinTech',
    stage: 'Launched',
    founders: [
      { name: 'Founder name', role: 'CTO', initials: 'FN' },
    ],
    yearStarted: '2025',
    website: 'https://example.com',
    tractionNote: 'Placeholder traction note',
    emphasised: false,
    image: {
      screenshot: { src: '/src/assets/placeholders/startup-2-logo.svg', alt: 'Startup name 2 screenshot', width: 1200, height: 800 },
      logo: { src: '/src/assets/placeholders/startup-2-logo.svg', alt: 'Startup name 2 logo', width: 400, height: 400 },
    },
  },
  {
    id: 'startup-3',
    status: 'placeholder',
    name: 'Startup name 3',
    tagline: 'Placeholder tagline.',
    description: 'Short one-line description goes here.',
    sector: 'EdTech',
    stage: 'Idea',
    founders: [
      { name: 'Founder name', role: 'CEO', initials: 'FN' },
    ],
    yearStarted: '2026',
    website: 'https://example.com',
    tractionNote: 'Placeholder traction note',
    emphasised: false,
    image: {
      screenshot: { src: '/src/assets/placeholders/startup-3-logo.svg', alt: 'Startup name 3 screenshot', width: 1200, height: 800 },
      logo: { src: '/src/assets/placeholders/startup-3-logo.svg', alt: 'Startup name 3 logo', width: 400, height: 400 },
    },
  },
];
