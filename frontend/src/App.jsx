import { lazy, Suspense, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Layout from './components/layout.jsx';
import Home from './pages/Home.jsx';

// Route-level code splitting: the heavy Impact/Community bundles (GSAP, 3D
// globe, feeds), the Hire catalogue and the FAQ tables only download on the
// page that needs them. Home stays eager so the landing page paints instantly.
const About = lazy(() => import('./pages/About.jsx'));
const Register = lazy(() => import('./pages/Register.jsx'));
const Hire = lazy(() => import('./pages/Hire.jsx'));
const Impact = lazy(() => import('./pages/Impact.jsx'));
const Community = lazy(() => import('./pages/Community.jsx'));
const Faqs = lazy(() => import('./components/faqs.jsx'));
const ComingSoon = lazy(() => import('./components/coming-soon.jsx'));

const RouteFallback = () => (
  <div
    role="status"
    aria-label="Loading page"
    className="grid min-h-screen place-items-center bg-white"
  >
    <span className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
  </div>
);

function ScrollToTopOnNavigate() {
  const { pathname } = useLocation();

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [pathname]);

  return null;
}

function App() {
  return (
    <>
      <ScrollToTopOnNavigate />
      <Suspense fallback={<RouteFallback />}>
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

        {/* Community — hero, partner directory, 3D staff carousel + community feed */}
        <Route
          path="/community"
          element={
            <Layout>
              <Community />
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

        {/* Hire Talent — service catalogue, technologies and employer CTA */}
        <Route
          path="/hire"
          element={
            <Layout>
              <Hire />
            </Layout>
          }
        />

        {/* Our Impact — cross-zoom hero, headline results and geographic reach */}
        <Route
          path="/impact"
          element={
            <Layout>
              <Impact />
            </Layout>
          }
        />

        {['/donate', '*'].map((path) => (
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
    </Suspense>
    </>
  );
}

export default App;
