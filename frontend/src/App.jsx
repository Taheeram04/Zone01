import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout.jsx';
import ComingSoon from './components/coming-soon.jsx';
import Community from './components/community.jsx';
import OurStaff from './components/our-staff.jsx';
import Faqs from './components/faqs.jsx';
import Home from './pages/Home.jsx';
import About from './pages/About.jsx';
import Register from './pages/Register.jsx';

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
            <About />
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

      {/* FAQs — hover-to-reveal Q&A tables */}
      <Route
        path="/faq"
        element={
          <Layout>
            <Faqs />
          </Layout>
        }
      />

      {['/impact', '/hire', '/donate', '*'].map((path) => (
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
