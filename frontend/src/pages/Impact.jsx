// pages/Impact.jsx
import ImpactPage from '../components/impact/ImpactPage.jsx';
import GeographicReachSection from '../components/geographic-reach-section.jsx';
// import ImpactCTA from '../components/impact/ImpactCTA.jsx';

const Impact = () => {
  return (
    <ImpactPage>
      <GeographicReachSection />
      {/* "Want to be part of our impact?" CTA is intentionally disabled for now. */}
      {/* <ImpactCTA /> */}
    </ImpactPage>
  );
};

export default Impact;
