import Layout from './components/layout.jsx';
import Hero from './components/hero.jsx';
import Stats from './components/stats.jsx';
import WhoCanApply from './components/whocanapply.jsx';
import WhoIsItFor from './components/whoisitfor.jsx';
import WhyOurCampus from './components/whyourcampus.jsx';

function App() {
  return (
    <Layout>
      <Hero />
      <Stats />
      <WhoCanApply />
      <WhoIsItFor />
      <WhyOurCampus />
    </Layout>
  );
}

export default App;