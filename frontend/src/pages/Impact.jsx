// pages/Impact.jsx
import ImpactHero from '../components/impact-hero.jsx';
import HeadlineResults from '../components/headline-results.jsx';
import SelectionSection from '../components/selection-section.jsx';
import GeographicReachSection from '../components/geographic-reach-section.jsx';

/**
 * Impact Page
 * Showcases Zone01 Kisumu's outcomes, metrics, transformative community impact,
 * student selection funnel, training & employment outcomes, and global reach.
 */
const Impact = () => {
  return (
    <>
      <ImpactHero />
      <HeadlineResults />
      <SelectionSection />
      <GeographicReachSection />
      {/* Future sections (metrics, alumni stories, partners, etc.) can be plugged in here */}
    </>
  );
};

export default Impact;
