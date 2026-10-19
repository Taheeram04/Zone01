import AboutHero from '../components/about-hero.jsx';
import KnowUs from '../components/know-us.jsx';
import OurModelSection from '../components/our-model-section.jsx';
import HowToApply from '../components/how-to-apply.jsx';
import Careers from '../components/careers.jsx';

export default function About() {
  return (
    <main className="about-page">
      <AboutHero />
      <KnowUs />
      <OurModelSection />
      <HowToApply />
      <Careers />
    </main>
  );
}
