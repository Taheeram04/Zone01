import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout.jsx';
import Hero from './components/hero.jsx';
import Stats from './components/stats.jsx';
import WhoCanApply from './components/whocanapply.jsx';
import WhoIsItFor from './components/whoisitfor.jsx';
import WhyOurCampus from './components/whyourcampus.jsx';
import ComingSoon from './components/coming-soon.jsx';
import Apply from './pages/Apply.jsx';
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
      {/* Standalone dark login / onboarding page */}
      <Route path="/apply" element={<Apply />} />

      {/* Standalone dark registration page */}
      <Route path="/register" element={<Register />} />

      {['/about', '/community', '/impact', '/hire', '*'].map((path) => (
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
