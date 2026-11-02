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
    body: 'Applied machine learning, model integration and AI-assisted engineering workflows.',
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

export const TALENT_PROFILES = [
  {
    label: 'Apprentice profile A',
    availability: 'Available now',
    role: 'Backend engineering (Go)',
    tags: ['Concurrency', 'API design', 'Postgres'],
    body: 'Completed the peer-reviewed backend project path. Strong on service design and testing under load.',
  },
  {
    label: 'Apprentice profile B',
    availability: 'Available now',
    role: 'Full-stack (TypeScript / React)',
    tags: ['Product UI', 'Testing', 'Accessibility'],
    body: 'Built and defended multiple full-stack applications under peer review, with a focus on accessible interfaces.',
  },
  {
    label: 'Apprentice profile C',
    availability: 'Available now',
    role: 'Data engineering',
    tags: ['SQL', 'Pipelines', 'Python'],
    body: 'Data pipeline and analytics projects, peer-reviewed and defended against real datasets.',
  },
  {
    label: 'Apprentice profile D',
    availability: 'Available now',
    role: 'Cybersecurity and DevOps',
    tags: ['Linux', 'Containers', 'CI/CD'],
    body: 'Infrastructure and security project path with operational exercises and incident-style reviews.',
  },
];

export const HIRING_OPTIONS = [
  {
    index: '01',
    title: 'Request a talent shortlist',
    body: 'Tell us the role, seniority and stack. We return matched, screened profiles with project evidence.',
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
    body: 'Ongoing pipeline access, early visibility of graduating cohorts and a recurring presence on campus.',
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
    body: 'Role, skills, seniority and start date. It takes about five minutes.',
  },
  {
    index: '02',
    title: 'Host an internship or project',
    body: 'Matched, screened profiles with project evidence, typically within five working days.',
  },
  {
    index: '03',
    title: 'Become a hiring partner',
    body: 'Technical interviews with your team. We coordinate logistics, references and feedback.',
  },
  {
    index: '04',
    title: 'Build a delivery team in Kisumu',
    body: 'Offer, onboarding and a check-in with our talent team at 30 and 90 days.',
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
