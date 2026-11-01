// data/impact.js
export const IMPACT_HERO = {
  headlinePart1: 'Our',
  headlinePart2: 'impact',
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
  { value: '97', label: 'Cohort  apprentices', note: 'Admitted to Cohort 1' },
  { value: '107', label: 'Cohort  apprentices', note: 'Admitted to Cohort 2' },
  { value: '154', label: 'Apprentices and graduates in paid work', note: 'Employment, contracts and freelance' },
  { value: '417%', label: 'in apprentice earnings', },
  { value: '~2 weeks', label: 'Median time to employment after graduation', note: 'To first paid engagement' },
  { value: '35,891', label: 'Applications received', note: 'Open to anyone — no credentials required' },
  { value: 'USD 630', label: 'Average monthly income', note: 'Approximately USD 7,560 per year' },
  { value: 'USD 7,560', label: 'Average annual income', note: 'Annual, not monthly' },
  { value: 'USD 2,533', label: 'Top monthly income', note: 'Among top earners' },
  { value: '2 women', label: 'Earning more than USD 2,300 per month', note: 'Reported gross monthly income' },
];

export const FUNNEL = [
  {
    value: '35,891',
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
    label: 'Admitted to\nthe cohort 1',
    note: 'Cohort',
    width: '44%',
    bg: 'var(--brand-primary)',
  },
  {
    value: '97',
    label: 'Admitted to\nthe cohort 2',
    note: 'Cohort',
    width: '31%',
    bg: 'var(--brand-primary)',
  },
];

export const EMPLOYMENT_CARD = {
  title: 'Training completion and employment',
  percentage: '417%',
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
    category: 'Kisumu · Software Development',
    headline: '“When I joined Zone01 Kisumu, my goal was simple: learn how to code. I’m leaving with so much more than just code.”',
    description: 'Fresh from university and unemployed, Michelle mastered software engineering and leadership at Zone01 Kisumu, landing a Software Developer role at Professional Digital Systems Ltd with a starting salary of KSh 50,000/month.',
    author: 'Michelle Wanjiru · Software Developer at Professional Digital Systems Ltd',
    imageKey: 'story-1',
    imagePosition: 'center',
    fullParagraphs: [
      'When Michelle Wanjiru joined Zone01 Kisumu, her goal was simple: learn how to code. Fresh from university but without a job, she discovered our transformative learning experience that extends far beyond software development.',
      'Through Zone01 Kisumu’s project-based, peer-to-peer learning model, Michelle developed technical expertise alongside leadership, collaboration, resilience, and problem-solving skills. Like many apprentices, she navigated demanding deadlines, complex projects, intensive audits, and long hours debugging code — challenges that strengthened her confidence, adaptability, and ability to tackle difficult problems in the workplace.',
      'From the onset, Michelle’s leadership qualities stood out. She served as an Events Coordinator, helping organize mini-conferences, workshops, and community events that connected apprentices with professionals, mentors, and industry leaders. She also recorded and produced the "What’s New In Tech" YouTube series, discussing emerging technology trends and innovations to expand her professional network and develop strong communication skills.',
      'Today, halfway through her 12-month tech training at Zone01 Kisumu, Michelle has landed employment as a Software Developer at Professional Digital Systems Ltd, with a starting salary of KSh 50,000 per month. Her transition from unemployment to a professional technology role demonstrates the life-changing potential of accessible, high-quality technology education.',
      'Michelle is determined to complete the learning module as she intended when she joined Zone01 Kisumu, with her journey reflecting the broader impact of Zone01 Kisumu in equipping young people with the skills, confidence, and opportunities needed to participate meaningfully in the digital economy.',
    ],
    journey: {
      before: 'Fresh university graduate seeking employment',
      during: 'Events Coordinator, tech video creator & software apprentice at Zone01 Kisumu',
      now: 'Software Developer at Professional Digital Systems Ltd (KSh 50,000/mo)',
    },
  },
  {
    id: 2,
    category: 'Western Kenya · Software Engineering & Mentorship',
    headline: '“I stopped seeing challenges as roadblocks and started embracing them as learning opportunities. I came to realize I’ll always figure it out no matter how hard it is.”',
    description: 'From struggling with simple loops to mastering Go, JavaScript, and databases, Andrew pushed through the intense Piscine, won a hackathon building a therapy app for GBV survivors, and now mentors aspiring tech talent.',
    author: 'Andrew Osindo · Apprentice & Hackathon Winner',
    imageKey: 'story-2',
    imagePosition: 'center 20%',
    fullParagraphs: [
      'A year ago, programming was a mystery to Andrew Osindo — just lines of cryptic symbols that somehow made computers do incredible things. Everything changed when he was accepted into Zone01 Kisumu, marking the start of an unforgettable journey.',
      'The Piscine, an intense coding bootcamp, was his first real taste of programming, and it was brutal. With no lectures and just problems to solve, many nights were spent staring at the screen debugging errors he didn’t understand. Although he wanted to quit, he pushed through — and the first time his code worked felt like magic, fueling his passion to continue.',
      'Being part of Zone01 Kisumu reshaped his mindset. He stopped seeing challenges as roadblocks and started embracing them as learning opportunities. Despite days of imposter syndrome and doubting whether he would master the craft, each hurdle made him stronger. When asked about his biggest lesson, Andrew answered: "I came to realize I’ll always figure it out no matter how hard it is."',
      'One of his proudest milestones was winning a hackathon alongside his team, building a therapy application to support survivors of gender-based violence. Standing on that stage was proof that perseverance pays off and showed him the true power of technology to create real change.',
      'That victory inspired friends and family to ask about programming. Today, Andrew actively mentors beginners in his community, proving that coding is for anyone willing to learn. From struggling with simple loops to confidently engineering with Go, JavaScript, and databases, programming has become his passion and way of life.',
    ],
    journey: {
      before: 'Zero programming knowledge; coding felt like cryptic symbols',
      during: 'Piscine bootcamp, mastered Go & JS, won hackathon (GBV support app)',
      now: 'Engineering with Go, JavaScript & databases, mentoring community beginners',
    },
  },
  {
    id: 3,
    category: 'Mombasa to Kisumu · Fullstack Development',
    headline: '“Zone01 Kisumu gave me the opportunity to pursue my passion without limitations. The model and curriculum gave me clarity—I can visualize my future in tech clearly.”',
    description: 'Trapped in an uninspiring biomedical program in Chuka and an outdated university curriculum in Mombasa, Ferdynand traveled 800km to Zone01 Kisumu to master self-paced, peer-to-peer fullstack software engineering.',
    author: 'Ferdynand Odhiambo · Fullstack Developer & AI/Blockchain Enthusiast',
    imageKey: 'story-3',
    imagePosition: 'center 20%',
    fullParagraphs: [
      'Ferdynand Odhiambo first walked through the gates of Chuka University in 2022 to pursue Biomedical Studies. Instead of feeling excited, he found himself filled with dread — trapped in a program he had no passion for, despite a lifelong fascination with computers since Form 3.',
      'After one semester, he initiated a transfer to the Technical University of Mombasa to pursue Computer Science. But static university curricula kept pace poorly with real-world technology, and debilitating social anxiety made traditional classrooms suffocating. Yearning to build real software with modern tools, he dropped out once again.',
      'Ferdynand spent countless hours teaching himself code online until he discovered Zone01 Kisumu — a tuition-free digital hub using self-paced, peer-to-peer learning to impart cutting-edge engineering skills. Though stuck 800km away on the other side of the country in Mombasa, he applied, waited patiently for months, and was finally invited to join.',
      'For Ferdynand, Zone01 was more than just a third chance: "Zone01 Kisumu gave me the opportunity to pursue my passion without limitations. I might be awkward sometimes, but the model and curriculum is exactly what I want. It has given me clarity. I can visualize my future in tech clearly."',
      'Today, Ferdynand is one of the cohort’s most promising Fullstack Developers. He is advancing toward high-impact employment with aspirations of applying his engineering expertise to Artificial Intelligence and Blockchain technologies to solve healthcare challenges across his community and beyond.',
    ],
    journey: {
      before: 'Dropped out of biomedical and CS programs over static curricula & social anxiety',
      during: 'Traveled 800km from Mombasa to Zone01; mastered self-paced fullstack engineering',
      now: 'Promising Fullstack Developer deploying AI & Blockchain to solve healthcare challenges',
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
