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
import Community from './components/community.jsx';
import OurStaff from './components/our-staff.jsx';
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

      {/* About Us — team-photo hero with the blue gradient wash */}
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

      {/* Community — partners hero + 3D glowing staff carousel */}
      <Route
        path="/community"
        element={
          <Layout>
            <Community />
            <OurStaff />
          </Layout>
        }
      />

      {['/impact', '/hire', '*'].map((path) => (
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
