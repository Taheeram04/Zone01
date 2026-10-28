// pages/Hire.jsx
import { useEffect, useState } from 'react';
import HireHero from '../components/hire-hero.jsx';
import HireProof from '../components/hire-proof.jsx';
import HireDifference from '../components/hire-difference.jsx';
import ServicesSection from '../components/services-section.jsx';
import HireSkills from '../components/hire-skills.jsx';
import HireProfiles from '../components/hire-profiles.jsx';
import HireOptions from '../components/hire-options.jsx';
// "What Makes Us Unique" is intentionally disabled for now. The component is
// kept in the codebase so the section can be restored later.
// import WhatMakesUsUnique from '../components/what-makes-us-unique.jsx';
import HireFaq from '../components/hire-faq.jsx';
import HireRequest from '../components/hire-request.jsx';
import { fetchServices } from '../lib/services-api.js';
import { FALLBACK_SERVICES } from '../lib/services-fallbacks.js';

/**
 * Hire Talent page (``/hire``). The page reads as one employer story:
 * promise → proof → what the talent can do → who is available → how to engage
 * → questions → brief. Service cards are served by ``/api/services/``; the
 * bundled cards keep the page complete while the request is in flight or when
 * the API is unreachable.
 */
const Hire = () => {
  const [services, setServices] = useState(FALLBACK_SERVICES);

  useEffect(() => {
    const controller = new AbortController();

    fetchServices({ signal: controller.signal })
      .then((payload) => {
        setServices(
          (payload.services || []).filter(
            (service) => service.category === 'what_we_offer',
          ),
        );
      })
      .catch((error) => {
        if (error.name === 'AbortError') return;
        // Keep the bundled cards when the API cannot be reached.
        console.warn('Using bundled Hire Talent content:', error);
      });

    return () => controller.abort();
  }, []);

  return (
    <>
      <HireHero />
      <HireProof />
      <HireDifference />
      <ServicesSection services={services} />
      <HireSkills />
      <HireProfiles />
      <HireOptions />
      {/* What Makes Us Unique — disabled, component kept for later. */}
      {/* <WhatMakesUsUnique /> */}
      <HireFaq />
      <HireRequest />
    </>
  );
};

export default Hire;
