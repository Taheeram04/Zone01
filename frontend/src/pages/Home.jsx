import Hero from '../components/hero.jsx';
import Stats from '../components/stats.jsx';
import WhoCanApply from '../components/whocanapply.jsx';
import WhoIsItFor from '../components/whoisitfor.jsx';
import WhyOurCampus from '../components/whyourcampus.jsx';

export default function Home() {
  return (
    <main className="home-page">
      <Hero />
      <Stats />
      <WhoCanApply />
      <WhoIsItFor />
      <WhyOurCampus />
    </main>
  );
}
