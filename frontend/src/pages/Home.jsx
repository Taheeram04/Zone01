import Hero from '../components/hero.jsx';
import Stats from '../components/stats.jsx';
import WhoCanApply from '../components/whocanapply.jsx';
import CompletedProjects from '../components/CompletedProjects.jsx';
import WhyOurCampus from '../components/whyourcampus.jsx';

export default function Home() {
  return (
    <main className="home-page">
      <Hero />
      <Stats />
      <WhoCanApply />
      <CompletedProjects />
      <WhyOurCampus />
    </main>
  );
}
