// components/community-partners.jsx
import { useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { HIRE_EMAIL } from '../constants.js';
import mastercardFoundation from '../assets/community-partners/mastercard-foundation.webp';
import talent01 from '../assets/community-partners/01-talent.webp';
import livelihoodImpactFund from '../assets/community-partners/livelihood-impact-fund.webp';
import lakehub from '../assets/community-partners/lakehub.webp';
import segalFamilyFoundation from '../assets/community-partners/segal-family-foundation.webp';
import uclgAfrica from '../assets/community-partners/uclg-africa.webp';
import partnersForEquity from '../assets/community-partners/partners-for-equity.webp';
import kisumuCounty from '../assets/community-partners/county-government-kisumu.webp';

/*
 * "Our partners" — a directory of the organisations behind Zone01 Kisumu.
 * Hovering or focusing a logo card opens its profile beneath the grid and a
 * click pins it (tapping toggles on touch screens). The card itself is the
 * trigger, so there are no extra "read more" / "hide details" controls.
 */

const PARTNERS = [
  {
    name: 'Mastercard Foundation',
    subtitle: 'Global Philanthropic Institution',
    badge: 'Philanthropy',
    tone: 'blue',
    since: 'Since 2019',
    description:
      'Pioneering the Young Africa Works strategy, deploying multi-tier educational bursaries, infrastructure funding, and long-term economic inclusion.',
    tags: ['Fellowships', 'Digital Livelihood', 'Scale Partner'],
    src: mastercardFoundation,
    href: 'https://mastercardfdn.org/',
  },
  {
    name: '01Talent',
    subtitle: 'Peer-to-peer Tech Education',
    badge: 'Tech & EdTech',
    tone: 'blue',
    since: 'Since 2022',
    description:
      'Developers of the acclaimed peer-to-peer cognitive learning platform designed to train developers without formal teachers or initial degree prerequisites.',
    tags: ['Pedagogy', 'Peer-Learning', 'Gamified LMS'],
    src: talent01,
    href: 'https://01talent.com/',
  },
  {
    name: 'Livelihood Impact Fund',
    subtitle: 'Economic Empowerment',
    badge: 'Philanthropy',
    tone: 'gold',
    since: 'Since 2020',
    description:
      'Dedicated micro-grants that ensure students have sustained living allowances, nutritious meals, and high-spec laptops during intensive 2-year residencies.',
    tags: ['Stipends', 'Hardware Grants', 'Equity'],
    src: livelihoodImpactFund,
    href: 'https://www.livelihoodimpactfund.org/',
  },
  {
    name: 'LakeHub',
    subtitle: 'Tech & Innovation Hub',
    badge: 'Grassroots Hub',
    tone: 'green',
    since: 'Founding',
    description:
      'Pioneering social enterprise and tech innovation hub rooted in Kisumu, bridging remote rural talent directly into modern digital production work.',
    tags: ['Community Hub', 'Incubation', 'Talent Scout'],
    src: lakehub,
    href: 'https://lakehub.co.ke/',
  },
  {
    name: 'Segal Family Foundation',
    subtitle: 'Local-led Development',
    badge: 'Philanthropy',
    tone: 'blue',
    since: 'Since 2018',
    description:
      'Championing locally-led solutions across East Africa, investing in systemic capacity building, leadership development, and strategic operational flexibility.',
    tags: ['Unrestricted Grants', 'Capacity Building'],
    src: segalFamilyFoundation,
    href: 'https://segalfamilyfoundation.org/',
  },
  {
    name: 'UCLG Africa',
    subtitle: 'United Cities of Africa',
    badge: 'Civic & Policy',
    tone: 'purple',
    since: 'Since 2022',
    description:
      'Connecting academy curriculums with regional public digitisation master plans, e-governance infrastructure, and smart municipal initiatives.',
    tags: ['Metropolitan Policy', 'Civic Innovation'],
    src: uclgAfrica,
    href: 'https://uclgafrica.org/',
  },
  {
    name: 'Partners For Equity',
    subtitle: 'Equitable Opportunity',
    badge: 'Philanthropy',
    tone: 'gold',
    since: 'Since 2021',
    description:
      'Committed to equitable opportunities through targeted capital deployment for women in STEM, accessibility toolkits, and rural connectivity.',
    tags: ['Gender Parity', 'Rural Access'],
    src: partnersForEquity,
    href: 'https://partnersforequity.org/',
  },
  {
    name: 'County Government of Kisumu',
    subtitle: 'Department of ICT, Education & Human Capacity',
    badge: 'Civic & Local Gov',
    tone: 'purple',
    since: 'Since 2022',
    description:
      'Municipal host partner facilitating regional land allocation, local youth bursary access, and public infrastructure integration for tech development centers.',
    tags: ['Public Host', 'Municipal Concessions', 'Youth Policy'],
    src: kisumuCounty,
    href: 'https://www.kisumu.go.ke/',
  },
];

const partnerMailto = `mailto:${HIRE_EMAIL}?subject=${encodeURIComponent(
  'Partnership with Zone01 Kisumu',
)}`;

const CommunityPartners = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const reduced = useReducedMotion();
  const panelRef = useRef(null);
  const activePartner = activeIndex === null ? null : PARTNERS[activeIndex];

  const selectPartner = (index, event) => {
    const isTouch =
      event?.nativeEvent?.pointerType === 'touch' ||
      (typeof window !== 'undefined' &&
        window.matchMedia('(hover: none)').matches);
    const willOpen = isTouch ? activeIndex !== index : true;
    setActiveIndex(willOpen ? index : null);

    if (!isTouch || !willOpen) return;
    setTimeout(() => {
      panelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 80);
  };

  return (
    <section
      data-nav-theme="light"
      aria-labelledby="community-partners-title"
      className="relative w-full overflow-hidden bg-tint-blue py-12 md:py-16"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 -top-24 z-0 h-64 w-64 rounded-full bg-blob-blue/50 sm:h-80 sm:w-80 md:h-96 md:w-96"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 -right-24 z-0 h-60 w-60 rounded-full bg-blob-blue/50 sm:h-72 sm:w-72 md:h-80 md:w-80"
      />

      <div className="relative z-10 mx-auto w-full max-w-[90rem] px-5 sm:px-8 lg:px-10">
        <div className="mx-auto mb-10 max-w-2xl text-center md:mb-12">
          <h2
            id="community-partners-title"
            className="font-sans text-[30px] font-black leading-tight tracking-tight text-[#1E293B] md:text-section-headline"
          >
            Our partners
          </h2>
          <p className="mx-auto mt-3 max-w-xl font-sans text-body-m leading-relaxed text-[#64748B] sm:text-base">
            The organisations investing in Zone01 Kisumu&apos;s apprentices and the
            future of tech in Kisumu.
          </p>
        </div>

        <ul className="grid grid-cols-1 items-start gap-y-5 gap-x-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-y-6 lg:gap-x-10">
          {PARTNERS.map((partner, index) => {
            const isActive = index === activeIndex;

            return (
              <li key={partner.name}>
                <button
                  type="button"
                  onMouseEnter={() => setActiveIndex(index)}
                  onFocus={() => setActiveIndex(index)}
                  onClick={(event) => selectPartner(index, event)}
                  aria-expanded={isActive}
                  aria-controls={isActive ? 'partner-profile-panel' : undefined}
                  aria-label={`${isActive ? 'Hide' : 'Show'} profile for ${partner.name}`}
                  className={`group relative flex w-full flex-col overflow-hidden rounded-[6px] rounded-tr-[28px] border bg-[linear-gradient(180deg,#FFFFFF_0%,#FBFDFF_100%)] p-5 text-left outline-none transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-primary/40 ${
                    isActive
                      ? 'border-primary/40 shadow-[0_16px_36px_rgba(9,44,62,0.1)]'
                      : 'border-[#D8E3F0] hover:border-[#B9CBE3] hover:shadow-[0_14px_32px_rgba(9,44,62,0.08)]'
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute bottom-2.5 right-2.5 h-2.5 w-2.5 border-b border-r border-[#CBD5E1]/80"
                  />

                  <span className="flex items-start gap-4">
                    <span className="flex h-16 w-20 shrink-0 items-center justify-center rounded-[10px] bg-[#F8FAFC] p-2 ring-1 ring-inset ring-[#0F172A]/5 sm:h-20 sm:w-24">
                      <img
                        src={partner.src}
                        alt={partner.name}
                        loading="lazy"
                        className="max-h-12 w-auto max-w-full object-contain sm:max-h-14"
                      />
                    </span>
                    <span className="min-w-0">
                      <span className="block font-sans text-lg font-bold leading-tight text-[#1E293B]">
                        {partner.name}
                      </span>
                      <span className="mt-1 block font-sans text-xs leading-relaxed text-[#64748B]">
                        {partner.subtitle}
                      </span>
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>

        {activePartner && (
          <motion.article
            ref={panelRef}
            id="partner-profile-panel"
            className="mt-6 rounded-[6px] rounded-tr-[28px] border border-[#D8E3F0] bg-[linear-gradient(180deg,#FFFFFF_0%,#FBFDFF_100%)] p-6 shadow-[0_16px_36px_rgba(9,44,62,0.08)] sm:p-8"
          >
            <motion.div
              key={activePartner.name}
              initial={reduced ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.3fr)] lg:gap-10"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-16 w-20 shrink-0 items-center justify-center rounded-[10px] bg-[#F8FAFC] p-2 ring-1 ring-inset ring-[#0F172A]/5 sm:h-20 sm:w-24">
                  <img
                    src={activePartner.src}
                    alt={activePartner.name}
                    loading="lazy"
                    className="max-h-12 w-auto max-w-full object-contain sm:max-h-14"
                  />
                </div>
                <div className="min-w-0">
                  <h3 className="font-sans text-xl font-bold leading-tight text-[#1E293B]">
                    {activePartner.name}
                  </h3>
                  <p className="mt-1 font-sans text-xs leading-relaxed text-[#64748B]">
                    {activePartner.subtitle}
                  </p>
                </div>
              </div>

              <div className="border-t border-[#EEF2F7] pt-5 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
                <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#94A3B8]">
                  Partner profile
                </p>
                <p className="mt-2 max-w-2xl font-sans text-sm leading-relaxed text-[#64748B]">
                  {activePartner.description}
                </p>
                <ul className="mt-4 flex flex-wrap gap-1.5">
                  {activePartner.tags.map((tag) => (
                    <li
                      key={tag}
                      className="rounded-full bg-[#F1F5F9] px-2 py-0.5 font-sans text-[10px] font-medium text-[#475569]"
                    >
                      {tag}
                    </li>
                  ))}
                </ul>
                <a
                  href={activePartner.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-1.5 font-sans text-xs font-semibold text-primary transition-colors hover:text-[#0052D4]"
                >
                  Visit website
                  <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                </a>
              </div>
            </motion.div>
          </motion.article>
        )}

        <div className="mt-10 flex justify-center md:mt-12">
          <a
            href={partnerMailto}
            className="inline-flex items-center justify-center rounded-md bg-primary px-8 py-3 font-sans text-body-m font-semibold text-white transition-colors hover:bg-primary/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-tint-blue"
          >
            Partner with us
          </a>
        </div>
      </div>
    </section>
  );
};

export default CommunityPartners;
