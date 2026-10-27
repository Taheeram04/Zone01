// data/impact.js
export const IMPACT_HERO = {
  headlinePart1: 'Impact you can',
  headlinePart2: 'hire.',
  body: "Eighty-six of our first 97 apprentices are now in paid tech work, and the median graduate found a first paid role in about six weeks. That's an 89% employment rate from 28,000+ applicants — measured, dated and defined.",
  cta1: { label: 'Read the stories', href: '#stories' },
  cta2: { label: 'Hire our talent', href: '/hire' },
  photoAlt: 'cohort working at Lake Basin Mall',
  tagline: 'Results, not rhetoric',
};

export const REPORTING = {
  note: 'Achieved results only. Targets are never presented as outcomes.',
};

export const HEADLINE_STATS = [
  { value: '97', label: 'Inaugural cohort apprentices', note: 'Admitted to Cohort 1' },
  { value: '86', label: 'Apprentices and graduates in paid work', note: 'Employment, contracts and freelance' },
  { value: '89%', label: 'Employment rate', note: 'Of 97 admitted apprentices' },
  { value: '~6 weeks', label: 'Median time to employment after graduation', note: 'To first paid engagement' },
  { value: '28,000+', label: 'Applications received', note: 'Open to anyone — no credentials required' },
  { value: 'USD 600', label: 'Average monthly income', note: 'Approximately USD 7,200 per year' },
  { value: 'USD 7,200', label: 'Average annual income', note: 'Annual, not monthly' },
  { value: 'USD 2,500', label: 'Top monthly income', note: 'Among top earners' },
  { value: '2 women', label: 'Earning more than USD 2,300 per month', note: 'Reported gross monthly income' },
];

export const FUNNEL = [
  {
    value: '28,000',
    label: 'Applications received',
    note: 'Open to anyone, no credentials required',
    width: '100%',
    bg: 'var(--brand-navy)',
  },
  {
    value: '4,200',
    label: 'Completed online\ncognitive games',
    note: 'Initial cognitive screen',
    width: '78%',
    bg: 'var(--brand-blue-700)',
  },
  {
    value: '420',
    label: 'Invited to the\nfour-week Piscine',
    note: 'Four-week selection sprint',
    width: '60%',
    bg: 'var(--brand-blue-600)',
  },
  {
    value: '97',
    label: 'Admitted to\nthe cohort',
    note: 'Inaugural cohort',
    width: '44%',
    bg: 'var(--brand-primary)',
  },
];

export const EMPLOYMENT_CARD = {
  title: 'Training completion and employment',
  percentage: '89%',
  subtext: 'In paid work',
  breakdown: [
    { value: '86', label: 'In paid work' },
    { value: '11', label: 'In advanced training' },
  ],
  note: 'Employment rate: 86 of 97 admitted apprentices.',
};

export const COHORT = {
  title: '97 people.\n86 in paid work.',
  body: 'Every dot is one apprentice. Eighty-six are employed in tech today. The other 11 are progressing through advanced training. The stories below put names to the dots.',
  legend1: '86 in paid work',
  legend2: '11 in advanced training',
};

export const STARTUPS = [
  {
    id: 1,
    name: 'Zelani Labs',
    sector: 'Software & Design Studio',
    stage: 'Active Studio · Nairobi',
    stageColor: '#0063F9',
    stageBg: '#EBF3FF',
    location: 'Nairobi, Kenya',
    shortDesc: 'Software and design studio building premium web apps, mobile apps, SaaS platforms, and internal tools for businesses that care about quality.',
    tagline: 'Designing and building premium web apps, mobile apps, SaaS platforms, and internal tools for businesses that care about quality.',
    blurb: 'Founded to solve the gap in Kenya where software works but rarely feels premium. Clients work directly with engineers and designers with zero middleman account managers.',
    founded: '2026',
    cohort: 'Cohort 1',
    metric: 'Baobab POS & Web',
    metricLabel: 'Mobile POS with M-Pesa + client sites (e.g. sosrealestates.com)',
    founders: [
      { name: 'Bravian Nyatoro', role: 'Systems Architect', initials: 'BN' },
      { name: 'Hezron Okwach', role: 'Lead Developer', initials: 'HO' },
      { name: 'Joel Adero', role: 'Operations Lead', initials: 'JA' },
    ],
    techStack: ['Go', 'TypeScript', 'React', 'Mobile Apps', 'M-Pesa API', 'Docker'],
    mission: 'We started Zelani Labs because we saw a gap in Kenya. Most local software works, but very little of it feels premium. Businesses here deserve products that look good, run fast, and are easy to use — and that’s the gap we’re here to fill.',
    clientModel: 'Clients work directly with the engineers and designers building their product, with no account managers in between.',
    publicWork: [
      {
        title: 'Baobab POS',
        desc: 'A mobile-first point-of-sale system with M-Pesa integration and offline support, custom built for Kenyan retailers.',
      },
      {
        title: 'Commercial Business Platforms',
        desc: 'Custom high-speed websites and SaaS platforms for Kenyan enterprises, including sosrealestates.com.',
      },
    ],
    tractionNote: 'Shipped Baobab POS with offline & M-Pesa capabilities, and actively delivering high-tier web and SaaS systems for commercial clients.',
    theme: 'blue',
    imageKey: 'startup-1',
  },
  {
    id: 2,
    name: 'ZidiFlow Payments',
    sector: 'FinTech · Commerce',
    stage: 'Launched · In Revenue',
    stageColor: '#0063F9',
    stageBg: 'rgba(0, 99, 249, 0.15)',
    shortDesc: 'Frictionless digital escrow and automated supplier payouts for informal market merchants and retailers.',
    tagline: 'Frictionless digital escrow and automated supplier payouts for informal market merchants.',
    blurb: 'Developed by Zone01 alumni to eliminate payment defaults between open-air market vendors and bulk distributors. Delivers instant multi-currency settlement via Mobile Money rails.',
    founded: '2024',
    cohort: 'Cohort 1',
    metric: 'KES 4.2M+',
    metricLabel: 'Monthly volume settled across 6,200 transactions',
    founders: [
      { name: 'Joseph Ndungu', role: 'Backend Architect', initials: 'JN' },
      { name: 'Dorcas Akinyi', role: 'Product & Frontend', initials: 'DA' },
      { name: 'Evans Kiptoo', role: 'Security & DevOps', initials: 'EK' },
    ],
    techStack: ['Go', 'TypeScript', 'Tailwind', 'Redis', 'Kafka'],
    tractionNote: 'Over 6,200 successful vendor settlements with zero fraudulent chargebacks.',
    theme: 'featured',
    featured: true,
    imageKey: 'startup-2',
  },
  {
    id: 3,
    name: 'Somazone DevLabs',
    sector: 'EdTech · AI Skills',
    stage: 'Active Beta',
    stageColor: '#4F46E5',
    stageBg: '#EEF2FF',
    shortDesc: 'Gamified peer-to-peer coding labs and automated code grading tools for secondary schools.',
    tagline: 'Gamified peer-to-peer coding labs and automated code grading for secondary schools.',
    blurb: 'Bringing the Zone01 peer-learning methodology directly into high school computer labs. Works offline with periodic sync, making tech literacy accessible in low-bandwidth regions.',
    founded: '2025',
    cohort: 'Cohort 1',
    metric: '18 Campuses',
    metricLabel: 'Deployed high schools with 850+ active students',
    founders: [
      { name: 'Rodgers Omondi', role: 'Systems Engineer', initials: 'RO' },
      { name: 'Philemon Kiprotich', role: 'Core Engine Lead', initials: 'PK' },
    ],
    techStack: ['Rust', 'WebAssembly', 'React', 'SQLite'],
    tractionNote: 'Over 850 active high school students completing weekly interactive coding challenges.',
    theme: 'indigo',
    imageKey: 'startup-3',
  },
];

export const STORIES = [
  {
    id: 1,
    category: 'Kenya · Software Engineering',
    headline: '“Our facility in Kisumu gave me the confidence to build software for the world. This journey changed my life!”',
    description: 'Apprentices explain how peer learning transformed their trajectory from having zero coding background to engineering enterprise-grade cloud systems.',
    author: 'Cohort 1 graduate · Software engineering',
    imageKey: 'story-1',
    fullParagraphs: [
      'Before Zone01, a career in technology felt out of reach: no degree, no coding experience and no industry connections. The only thing the programme asked for was a willingness to learn.',
      'Selection was not based on a CV. After the online cognitive games and the four-week Piscine, the real work began — peer-reviewed projects, no lectures, and a campus open around the clock.',
      'Today, that work has translated into a paid engineering role, a professional network and a clear pathway into the global digital economy.',
    ],
    journey: {
      before: 'Unemployed / seeking digital skills',
      during: 'Two years of peer-to-peer problem solving at Zone01 Kisumu',
      now: 'Employed Software Engineer earning a competitive salary',
    },
  },
  {
    id: 2,
    category: 'Western Kenya · Women In Tech',
    headline: '“Wherever life takes me, I will use my technology education and resilience to get there.”',
    description: 'Betty describes her transition through the inaugural Zone01 cohort, mastering full-stack software development and breaking into Kenya’s growing digital economy.',
    author: 'Betty · Cohort 1 graduate',
    imageKey: 'story-2',
    fullParagraphs: [
      'Betty joined Zone01 looking for a way into technology that did not depend on prior credentials or a personal network.',
      'Inside the cohort, she built and defended real software projects, learned to give and receive code review, and specialised in the parts of engineering she wanted to take further.',
      'She is now in paid tech work, earning above USD 2,300 a month, and mentoring the apprentices coming up behind her.',
    ],
    journey: {
      before: 'Limited access to digital career opportunities',
      during: 'Hands-on project work in Go, Rust, JavaScript, and Docker',
      now: 'Leading product development and mentoring incoming apprentices',
    },
  },
  {
    id: 3,
    category: 'Kisumu Campus · Peer Learning',
    headline: '“At Zone01, there are no teachers—only peers pushing you to solve hard problems and write production-grade code.”',
    description: 'How hands-on peer learning and project-based sprints in Kisumu turned self-doubt into world-class software engineering skills.',
    author: 'Cohort 1 graduate · Peer learning',
    imageKey: 'story-3',
    fullParagraphs: [
      'The four-week Piscine is where many apprentices discover what they are capable of. There are no lectures: you read, build, break things and try again alongside your peers.',
      'That rhythm continues through the programme. Projects are reviewed and defended in front of other apprentices, so learning is active, social and accountable.',
      'Graduates leave with a portfolio of deployed work and the habits of engineers who can learn anything — the foundation for the roles they hold today.',
    ],
    journey: {
      before: 'Seeking practical, hands-on software development training',
      during: 'Two years of self-directed, peer-evaluated engineering curriculum',
      now: 'Software Engineer building enterprise software products',
    },
  },
];

export const GEOGRAPHIC = {
  label: 'Geographic reach',
  title: 'Where our talent comes from and goes.',
  body: 'Our first cohort represents counties across Kenya, with strong representation from Western Kenya and growing reach in urban and peri-urban areas.',
  stats: [
    { value: '58%', label: 'Kisumu County' },
    { value: '16%', label: 'Siaya County' },
    { value: '14%', label: 'Homa Bay County' },
    { value: '9%', label: 'Vihiga County' },
    { value: '3%', label: 'Other counties' },
  ],
};
