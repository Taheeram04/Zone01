// pages/Impact.jsx
import ImpactHero from '../components/impact-hero.jsx';
import HeadlineResults from '../components/headline-results.jsx';
import SelectionSection from '../components/selection-section.jsx';

/**
 * Impact Page
 * Showcases Zone01 Kisumu's outcomes, metrics, and transformative community impact.
 */
const Impact = () => {
  return (
    <>
      <ImpactHero />
      <HeadlineResults />
      <SelectionSection />
      {/* Future sections (metrics, alumni stories, partners, etc.) can be plugged in here */}
    </>
  );
};

export default Impact;
