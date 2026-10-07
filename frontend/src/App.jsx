import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout.jsx';
import Hero from './components/hero.jsx';
import Stats from './components/stats.jsx';
import WhoCanApply from './components/whocanapply.jsx';
import WhoIsItFor from './components/whoisitfor.jsx';
import WhyOurCampus from './components/whyourcampus.jsx';
import ComingSoon from './components/coming-soon.jsx';
import AboutHero from './components/about-hero.jsx';
import KnowUs from './components/know-us.jsx';
import OurModelSection from './components/our-model-section.jsx';
import HowToApply from './components/how-to-apply.jsx';
import Careers from './components/careers.jsx';
import Register from './pages/Register.jsx';

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
      {/* Standalone dark registration page */}
      <Route path="/register" element={<Register />} />

      {/* About Us — hero, Know Us, Our Model Works, How to Apply, Careers */}
      <Route
        path="/about"
        element={
          <Layout>
            <AboutHero />
            <KnowUs />
            <OurModelSection />
            <HowToApply />
            <Careers />
          </Layout>
        }
      />

      {['/community', '/impact', '/hire', '/donate', '*'].map((path) => (
        <Route
          key={path}
          path={path}
          element={
            <Layout>
              <ComingSoon />
            </Layout>
          }
        />
      ))}
    </Routes>
  );
}

export default App;
