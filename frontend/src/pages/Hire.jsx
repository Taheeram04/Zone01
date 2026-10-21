// pages/Hire.jsx
import { useEffect, useState } from 'react';
import HireHero from '../components/hire-hero.jsx';
import ServicesSection from '../components/services-section.jsx';
import Technologies from '../components/technologies.jsx';
import WhatMakesUsUnique from '../components/what-makes-us-unique.jsx';
import { fetchServices } from '../lib/services-api.js';
import { FALLBACK_SERVICES } from '../lib/services-fallbacks.js';

const EMPTY_GROUPS = {
  what_we_offer: [],
  languages: [],
  frameworks: [],
  specializations: [],
};

/**
 * Hire Talent page (``/hire``), home of the ported Services code. The cards and
 * technologies are served by ``/api/services/``; the bundled cards keep the page
 * complete while the request is in flight or when the API is unreachable.
 */
const Hire = () => {
  const [services, setServices] = useState(FALLBACK_SERVICES);
  const [groups, setGroups] = useState(EMPTY_GROUPS);

  useEffect(() => {
    const controller = new AbortController();

    fetchServices({ signal: controller.signal })
      .then((payload) => {
        setGroups({ ...EMPTY_GROUPS, ...(payload.navbar_services || {}) });
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
      <ServicesSection services={services} />
      <Technologies groups={groups} />
      <WhatMakesUsUnique />
    </>
  );
};

export default Hire;
