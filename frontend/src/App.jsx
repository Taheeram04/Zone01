import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout.jsx';
import Hero from './components/hero.jsx';
import Stats from './components/stats.jsx';
import WhoCanApply from './components/whocanapply.jsx';
import WhoIsItFor from './components/whoisitfor.jsx';
import WhyOurCampus from './components/whyourcampus.jsx';
import Apply from './components/apply.jsx';

const Home = () => (
  <>
    <Hero />
    <Stats />
    <WhoCanApply />
    <WhoIsItFor />
    <WhyOurCampus />
  </>
);

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <Layout>
            <Home />
          </Layout>
        }
      />
      <Route
        path="/apply"
        element={
          <Layout>
            <Apply />
          </Layout>
        }
      />
    </Routes>
  );
}

export default App;
