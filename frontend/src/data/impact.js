// data/impact.js
export const IMPACT_HERO = {
  badge: 'Impact report · As of August 2026',
  headlinePart1: 'Our',
  headlinePart2: 'Impact',
  body: '97 people entered our first cohort. Today 86 of them are in paid work, 11 are in advanced training, and the median graduate was hired in about six weeks.',
  cta1: { label: 'Read the stories', href: '#stories' },
  cta2: { label: 'Hire our talent', href: '/hire' },
  photoAlt: 'cohort working at Lake Basin Mall',
  tagline: 'Results, not rhetoric',
};

export const HEADLINE_STATS = [
  { value: 'USD 2,500', label: 'Top monthly income' },
  { value: 'USD 600', label: 'Average monthly income' },
  { value: 'USD 7,200', label: 'Average annual income' },
  { value: '97', label: 'Inaugural cohort apprentices' },
  { value: '86', label: 'Apprentices and graduates in paid work' },
  { value: '89%', label: 'Employment rate' },
  { value: '28,000+', label: 'Applications received' },
  { value: '~6 weeks', label: 'Median time to employment after graduation' },
  { value: '2 women', label: 'Earning more than USD 2,300 per month' },
];

export const FUNNEL = [
  { value: '28,000', label: 'Applications received', width: '100%', bg: '#0A3A9C' },
  { value: '4,200', label: 'Completed online\ncognitive games', width: '78%', bg: '#0A4DC4' },
  { value: '420', label: 'Invited to the\nfour-week Piscine', width: '60%', bg: '#0057E0' },
  { value: '97', label: 'Admitted to\nthe cohort', width: '44%', bg: '#0063F9' },
];

export const EMPLOYMENT_CARD = {
  title: 'Training completion and employment',
  percentage: '89%',
  subtext: 'In paid work',
  note: '11% are in advanced training and are not yet in paid work.',
};

export const COHORT = {
  title: '97 people.\n86 in paid work.',
  body: 'Every dot is one apprentice. Eighty-six are employed in tech today. The other 11 are progressing through advanced training. The stories below put names to the dots.',
  legend1: '86 in paid work',
  legend2: '11 in advanced training',
};

export const EARNINGS = {
  label: 'Earnings trajectory',
  title: 'From $60 at intake to $2,500 a month.',
  body: 'Monthly earnings from enrolment to full-time career placement. Bar heights are drawn to scale, so the climb for top earners is real.',
  bars: [
    { value: '$60', height: 8 },
    { value: '$320', height: 44 },
    { value: '$600', height: 82 },
    { value: '$2,500', height: 290, highlight: true },
  ],
  barLabels: ['At intake', 'First paid engagement', 'Current average', 'Top earners'],
  genderCard: {
    label: 'Gender equity',
    value: '2',
    text: 'women earning more than $2,300 per month.',
  },
  annualCard: {
    label: 'Annual average',
    value: '$7,200',
    text: 'a year, the average annual income across the cohort.',
  },
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
    description: 'Dr Farshad and fellow apprentices explain how peer learning transformed their trajectory from having zero coding background to engineering enterprise-grade cloud systems.',
    author: '[Apprentice Name] · Cohort 1 Graduate',
    imageKey: 'story-1',
    fullParagraphs: [
      'Short placeholder story paragraph one. Replace with the participant’s background before joining Zone01 Kisumu, their motivation to apply, and their experience during the rigorous four-week selection Piscine.',
      'Short placeholder story paragraph two. Detail their journey through the 2-year peer-to-peer curriculum, building real-world projects without teachers, and learning how to collaborate in team environments.',
      'Short placeholder story paragraph three. Outline their current role, employer or venture, how their earnings have transformed their family and community, and their aspirations for the future.',
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
    author: '[Apprentice Name] · Cohort 1 Graduate',
    imageKey: 'story-2',
    fullParagraphs: [
      'Short placeholder story paragraph one. Replace with how this apprentice discovered Zone01, overcoming early skepticism and taking a leap of faith into high-intensity software engineering.',
      'Short placeholder story paragraph two. Highlight their breakthrough moments in programming, collaborating on peer evaluations, and creating practical applications that solve local problems.',
      'Short placeholder story paragraph three. Describe the impact of financial independence, being placed in paid tech employment, and mentoring the next generation of women in tech.',
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
    author: '[Apprentice Name] · Cohort 1 Graduate',
    imageKey: 'story-3',
    fullParagraphs: [
      'Short placeholder story paragraph one. Replace with how this apprentice experienced the high-intensity 4-week Piscine in Kisumu, learning to collaborate and solve problems without lectures.',
      'Short placeholder story paragraph two. Detail their progress through systems programming, peer-to-peer code reviews, and building deployable applications.',
      'Short placeholder story paragraph three. Describe their career trajectory following graduation, securing software engineering employment, and driving technical initiatives.',
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
