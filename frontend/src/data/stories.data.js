// components/data/stories.data.js
// REPLACE THESE FIELDS BEFORE PUBLISHING
// Required: id, status('published'|'placeholder'), consent(boolean true to publish), featured(boolean), name, firstName, role, cohort, quote, longParagraphs(string[] 3-4), journey{before, during, now}, outcomeChips([{label,value,verified}]), image{portrait:{src,alt,width,height}, wide:{src,alt,width,height}}
export const STORIES = [
  {
    id: 'story-1',
    status: 'published',
    consent: true,
    featured: true,
    name: 'Michelle Wanjiru',
    firstName: 'Michelle',
    role: 'Software Developer',
    cohort: 'Cohort 1',
    quote: 'When I joined Zone01 Kisumu, my goal was simple: learn how to code. I’m leaving with so much more than just code.',
    longParagraphs: [
      'When Michelle Wanjiru joined Zone01 Kisumu, her goal was simple: learn how to code. Fresh from university but without a job, she discovered our transformative learning experience that extends far beyond software development.',
      'Through Zone01 Kisumu’s project-based, peer-to-peer learning model, Michelle developed technical expertise alongside leadership, collaboration, resilience, and problem-solving skills. Navigating demanding deadlines, complex projects, intensive audits, and long hours debugging code strengthened her confidence and ability to tackle difficult problems.',
      'From the onset, Michelle’s leadership qualities stood out. She served as an Events Coordinator, helping organize mini-conferences, workshops, and community events that connected apprentices with mentors and industry leaders, while producing the "What’s New In Tech" video series.',
      'Today, halfway through her 12-month tech training at Zone01 Kisumu, Michelle has landed employment as a Software Developer at Professional Digital Systems Ltd with a starting salary of KSh 50,000 per month, proving the life-changing power of accessible technology education.',
    ],
    journey: {
      before: 'Fresh university graduate seeking employment',
      during: 'Events Coordinator, tech video creator & software apprentice at Zone01 Kisumu',
      now: 'Software Developer at Professional Digital Systems Ltd (KSh 50,000/mo)',
    },
    outcomeChips: [
      { label: 'Current role', value: 'Software Developer', verified: true },
      { label: 'Employer', value: 'Professional Digital Systems Ltd', verified: true },
      { label: 'Starting salary', value: 'KSh 50,000 / mo', verified: true },
    ],
    image: {
      portrait: { src: '/src/assets/impactstory1.png', alt: 'Portrait of Michelle Wanjiru', width: 800, height: 1000 },
      wide: { src: '/src/assets/impactstory1.png', alt: 'Michelle Wanjiru at Zone01 Kisumu', width: 1200, height: 800 },
    },
  },
  {
    id: 'story-2',
    status: 'published',
    consent: true,
    featured: false,
    name: 'Andrew Osindo',
    firstName: 'Andrew',
    role: 'Software Developer & Mentor',
    cohort: 'Cohort 1',
    quote: 'I stopped seeing challenges as roadblocks and started embracing them as learning opportunities. I came to realize I’ll always figure it out no matter how hard it is.',
    longParagraphs: [
      'A year ago, programming was a mystery to Andrew Osindo — just lines of cryptic symbols that somehow made computers do incredible things. Everything changed when he was accepted into Zone01 Kisumu, marking the start of an unforgettable journey.',
      'The Piscine, an intense coding bootcamp, was his first real taste of programming, and it was brutal. With no lectures and just problems to solve, many nights were spent debugging errors he didn’t understand. He pushed through, and the first time his code worked felt like magic, fueling his passion.',
      'Being part of Zone01 Kisumu reshaped his mindset, turning self-doubt into resilience. One of his biggest milestones was winning a hackathon alongside his team, building a therapy application to support survivors of gender-based violence — proof of the power of technology to create real change.',
      'That victory inspired his community. Today, Andrew actively mentors beginners, showing them that coding is for anyone willing to learn, while engineering with Go, JavaScript, and databases.',
    ],
    journey: {
      before: 'Zero programming knowledge; coding felt like cryptic symbols',
      during: 'Piscine bootcamp, mastered Go & JS, won hackathon (GBV support app)',
      now: 'Engineering with Go, JavaScript & databases, mentoring community beginners',
    },
    outcomeChips: [
      { label: 'Specialization', value: 'Go, JavaScript & Databases', verified: true },
      { label: 'Milestone', value: 'Hackathon Winner (GBV Support App)', verified: true },
      { label: 'Community', value: 'Active Coding Mentor', verified: true },
    ],
    image: {
      portrait: { src: '/src/assets/impactstory2.png', alt: 'Portrait of Andrew Osindo', width: 800, height: 1000 },
      wide: { src: '/src/assets/impactstory2.png', alt: 'Andrew Osindo speaking at Zone01 Kisumu', width: 1200, height: 800 },
    },
  },
  {
    id: 'story-3',
    status: 'published',
    consent: true,
    featured: false,
    name: 'Ferdynand Odhiambo',
    firstName: 'Ferdynand',
    role: 'Fullstack Developer',
    cohort: 'Cohort 1',
    quote: 'Zone01 Kisumu gave me the opportunity to pursue my passion without limitations. The model and the curriculum gave me clarity—I can visualize my future in tech clearly.',
    longParagraphs: [
      'Ferdynand Odhiambo first entered university in 2022 to pursue Biomedical Studies, yet felt deeply trapped in a program he had no passion for. After transferring to Computer Science at TUM, static curricula and debilitating social anxiety made traditional lectures stifling, leading him to drop out again.',
      'Refusing to give up, he taught himself code online until discovering Zone01 Kisumu — a tuition-free digital hub using self-paced, peer-to-peer learning to impart cutting-edge engineering skills. Though based 800km away in Mombasa, he applied, waited patiently for months, and was accepted.',
      'Zone01 provided the exact environment he needed: hands-on, practical, and free of traditional classroom limitations. The project-driven model gave him focus, confidence, and deep technical mastery.',
      'Today, Ferdynand is one of the cohort’s most promising Fullstack Developers, advancing toward high-impact industry roles with aspirations of deploying AI and Blockchain solutions to healthcare challenges.',
    ],
    journey: {
      before: 'Dropped out of biomedical and CS programs over static curricula & social anxiety',
      during: 'Traveled 800km from Mombasa to Zone01; mastered self-paced fullstack engineering',
      now: 'Promising Fullstack Developer deploying AI & Blockchain to solve healthcare challenges',
    },
    outcomeChips: [
      { label: 'Specialization', value: 'Fullstack Engineering', verified: true },
      { label: 'Vision', value: 'AI & Blockchain in Health', verified: true },
      { label: 'Path', value: 'Mombasa to Kisumu (800km)', verified: true },
    ],
    image: {
      portrait: { src: '/src/assets/impactstory3.png', alt: 'Portrait of Ferdynand Odhiambo', width: 736, height: 1277 },
      wide: { src: '/src/assets/impactstory3.png', alt: 'Ferdynand Odhiambo at Zone01 Kisumu', width: 1200, height: 800 },
    },
  },
];
