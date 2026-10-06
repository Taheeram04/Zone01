// components/our-model.data.js
// Shared "Our Model Works" step data — used by the carousel page and the
// static Know Us gallery so both read from a single source of truth.
import photo1 from '../assets/knoeus02.jpg';
import photo2 from '../assets/knowus01.jpg';
import photo3 from '../assets/knowus03.jpeg';
import photo4 from '../assets/knowus04.jpeg';
import photo5 from '../assets/Know us.JPG';

export const STEPS = [
  {
    src: photo1,
    alt: 'Zone01 Kisumu students watching a presentation at LakeHub',
    title: 'Learn',
    text: 'Hands-on sessions guided by tech mentors.',
  },
  {
    src: photo2,
    alt: 'Three students collaborating at laptops in the Zone01 Kisumu lab',
    title: 'Build',
    text: 'Talents work on real world projects, solving problems individually and in teams.',
  },
  {
    src: photo3,
    alt: 'Zone01 Kisumu partners and team gathered around a table',
    title: 'Connect',
    text: 'We connect our talents with our partners for mentorship work experience and job placement.',
  },
  {
    src: photo4,
    alt: 'Three Zone01 Kisumu team members in front of the Zone01 mural',
    title: 'Grow',
    text: 'Talents become highly-skilled, AI-ready, full-stack engineers.',
    // Landscape group shot — fit the whole trio inside the circle with a
    // blurred fill so all three individuals stay framed.
    wide: true,
  },
  {
    src: photo5,
    alt: 'Four Zone01 Kisumu team members in blue and white shirts',
    title: 'Belong',
    text: 'A community and team that stays with you from day one.',
  },
];
