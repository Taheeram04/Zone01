// components/hire.data.js
// Employer-facing content for the Hire Talent page. Kept in one place so the
// hero, differentiators, profiles, options, process and FAQ stay in sync.

export const HERO_STATS = [
  { value: '28,000+', label: 'Applicants screened for potential' },
  { value: 'Top 1%', label: 'Selected for intensive engineering training' },
  { value: '40', label: 'Countries on the 01 standard' },
  { value: '72 hours', label: 'Typical shortlist turnaround' },
];

export const DIFFERENTIATORS = [
  {
    index: '01',
    title: 'Peer-reviewed work, not certificates',
    body: 'Every project is reviewed and defended in front of peers. Progress is recorded against the global 01 standard used to train 100,000+ developers in 40 countries.',
  },
  {
    index: '02',
    title: 'Self-learning as a trained skill',
    body: 'There are no teachers in the Zone01 model. Apprentices learn to find answers, read documentation and unblock themselves, the core skill of a working engineer.',
  },
  {
    index: '03',
    title: 'Collaboration under real pressure',
    body: 'Team projects, code reviews and a 24/7 campus culture build the communication habits employers say junior hires usually lack.',
  },
];

export const SKILL_AREAS = [
  {
    title: 'Artificial intelligence',
    body: 'Applied machine learning, model integration and AI assisted engineering workflows.',
  },
  {
    title: 'Web and mobile development',
    body: 'Production web platforms and mobile applications, built and peer-reviewed end to end.',
  },
  {
    title: 'Go, JavaScript and Rust',
    body: 'Systems and application programming across the core languages of the Zone01 curriculum.',
  },
  {
    title: 'Data engineering',
    body: 'Pipelines, warehousing and analytics engineering for production data.',
  },
  {
    title: 'Cybersecurity and DevOps',
    body: 'Secure infrastructure, CI/CD, containerisation and operational reliability.',
  },
  {
    title: 'Blockchain',
    body: 'Distributed ledger fundamentals, smart contracts and decentralised applications.',
  },
  {
    title: 'Robotics and emerging tech',
    body: 'Embedded systems, hardware interfacing and applied emerging technology projects.',
  },
];

export const TYPICAL_ROLES = [
  'Junior to mid-level software engineer',
  'Backend engineer (Go, Rust)',
  'Frontend / full-stack engineer (TypeScript)',
  'Mobile developer',
  'Data engineer',
  'DevOps / platform engineer',
  'Security analyst',
  'AI application engineer',
];

// Mirrors the Career Paths carousel so employers see the same nine pathways
// learners choose from.
export const TALENT_PROFILES = [
  {
    label: 'Career path 01',
    availability: 'Available now',
    role: 'Artificial Intelligence',
    tags: ['Machine learning', 'Model integration', 'Python'],
    body: 'Applied machine learning, model integration and AI assisted engineering workflows, from preparing data to shipping intelligent product features.',
  },
  {
    label: 'Career path 02',
    availability: 'Available now',
    role: 'Cloud & DevOps',
    tags: ['CI/CD', 'Infrastructure as code', 'Observability'],
    body: 'CI/CD, infrastructure as code, containerisation and observability for secure, reliable delivery on modern cloud platforms.',
  },
  {
    label: 'Career path 03',
    availability: 'Available now',
    role: 'Java FullStack',
    tags: ['Java', 'Spring Boot', 'REST APIs'],
    body: 'Enterprise-grade backends with Java and Spring Boot, paired with production frontends and typed REST APIs.',
  },
  {
    label: 'Career path 04',
    availability: 'Available now',
    role: 'Video Games Development',
    tags: ['Game design', 'Gameplay programming', 'Real-time engines'],
    body: 'Gameplay programming, game design and interactive graphics, shipping playable projects with real time engines.',
  },
  {
    label: 'Career path 05',
    availability: 'Available now',
    role: 'Web App Development',
    tags: ['React', 'APIs', 'Accessibility'],
    body: 'End-to-end web platforms: accessible React interfaces, robust APIs and databases, tested and peer-reviewed.',
  },
  {
    label: 'Career path 06',
    availability: 'Available now',
    role: 'Mobile App Development',
    tags: ['Cross-platform', 'Native', 'Release'],
    body: 'Native and cross-platform mobile products built with modern tooling, from interface design through to release.',
  },
  {
    label: 'Career path 07',
    availability: 'Available now',
    role: 'Data Engineering',
    tags: ['SQL', 'Pipelines', 'Analytics'],
    body: 'Data pipelines, warehousing and analytics engineering that turn raw data into dependable production systems.',
  },
  {
    label: 'Career path 08',
    availability: 'Available now',
    role: 'Cyber Security',
    tags: ['Threat modelling', 'Security testing', 'Incident response'],
    body: 'Secure architecture, threat modelling, security testing and incident response for real applications and infrastructure.',
  },
  {
    label: 'Career path 09',
    availability: 'Available now',
    role: 'Blockchain',
    tags: ['Smart contracts', 'Distributed ledgers', 'dApps'],
    body: 'Distributed ledger fundamentals, smart contracts and decentralised applications built and reviewed on chain.',
  },
];

export const HIRING_OPTIONS = [
  {
    index: '01',
    title: 'Request a talent shortlist',
    body: 'Share the role, seniority and stack. We return matched, screened profiles backed by project evidence.',
    cta: 'Start a brief',
  },
  {
    index: '02',
    title: 'Host an internship or project',
    body: 'Bring a team of apprentices onto a real problem for a defined period, with campus support throughout.',
    cta: 'Design a project',
  },
  {
    index: '03',
    title: 'Become a hiring partner',
    body: 'Get ongoing pipeline access, early visibility of graduating cohorts and a recurring presence on campus.',
    cta: 'Talk partnership',
  },
  {
    index: '04',
    title: 'Build a delivery team in Kisumu',
    body: 'Stand up a full engineering team with local onboarding, workspace and operational support.',
    cta: 'Explore a team',
  },
];

export const PROCESS_STEPS = [
  {
    index: '01',
    title: 'Request a talent shortlist',
    body: 'Share the role, seniority and stack. We return matched, screened profiles backed by project evidence.',
  },
  {
    index: '02',
    title: 'Host an internship or project',
    body: 'Bring a team of apprentices onto a real problem for a defined period, with campus support throughout.',
  },
  {
    index: '03',
    title: 'Become a hiring partner',
    body: 'Get ongoing pipeline access, early visibility of graduating cohorts and a recurring presence on campus.',
  },
  {
    index: '04',
    title: 'Build a delivery team in Kisumu',
    body: 'Stand up a full engineering team with local onboarding, workspace and operational support.',
  },
];

export const EMPLOYER_FAQS = [
  {
    q: 'How are Zone01 engineers assessed?',
    a: 'Selection starts with cognitive games — no prior coding required. Apprentices then complete months of project-based, peer-reviewed work against the 01 standard, defending each project in front of peers. Employers can request a walkthrough of the projects behind any shortlisted profile.',
  },
  {
    q: 'What seniority should we expect?',
    a: 'Most graduates are ready for junior to mid-level engineering roles, with unusually strong self-learning and collaboration habits from the peer-to-peer model. Depth of specialisation varies by pathway, so we match profiles to the role rather than to a job title alone.',
  },
  {
    q: 'Can we hire remotely?',
    a: 'Yes. Talent is based at the Kisumu campus and can work remotely, hybrid or onsite. We help set expectations on time zones, equipment, connectivity and check-ins before the placement starts.',
  },
  {
    q: 'Is there a placement fee?',
    a: 'Hiring is free for candidates. Employer terms depend on the engagement — direct hire, internship, hiring partnership or a delivery team. We share a clear scope and quote before you commit, and confirm any fees in writing up front.',
  },
  {
    q: 'How quickly can we see candidates?',
    a: 'Shortlist requests are typically answered within five working days. If you are hiring against a hard deadline, tell us in the brief and we will do our best to accelerate the match.',
  },
];

export const EMPLOYMENT_TYPES = [
  'Full-time employment',
  'Fixed-term contract',
  'Paid internship',
  'Freelance / project work',
];

export const WORK_ARRANGEMENTS = [
  'Remote',
  'Hybrid',
  'Onsite in Kisumu',
  'Onsite elsewhere',
];
