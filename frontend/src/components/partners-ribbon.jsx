// components/partners-ribbon.jsx
import mastercardFoundation from '../assets/community-partners/mastercard-foundation.webp';
import talent01 from '../assets/community-partners/01-talent.webp';
import livelihoodImpactFund from '../assets/community-partners/livelihood-impact-fund.webp';
import lakehub from '../assets/community-partners/lakehub.webp';
import segalFamilyFoundation from '../assets/community-partners/segal-family-foundation.webp';
import uclgAfrica from '../assets/community-partners/uclg-africa.webp';
import partnersForEquity from '../assets/community-partners/partners-for-equity.webp';
import kisumuCounty from '../assets/community-partners/county-government-kisumu.webp';

const PARTNERS = [
  { src: mastercardFoundation, alt: 'Mastercard Foundation' },
  { src: talent01, alt: '01Talent' },
  { src: livelihoodImpactFund, alt: 'Livelihood Impact Fund' },
  { src: lakehub, alt: 'LakeHub' },
  { src: segalFamilyFoundation, alt: 'Segal Family Foundation' },
  { src: uclgAfrica, alt: 'UCLG Africa' },
  { src: partnersForEquity, alt: 'Partners For Equity' },
  { src: kisumuCounty, alt: 'County Government of Kisumu' },
];

const LogoGroup = ({ hidden = false }) => (
  <ul aria-hidden={hidden || undefined} className="flex shrink-0 items-center">
    {PARTNERS.map((partner, index) => (
      <li
        key={`${partner.alt}-${index}`}
        className="mr-3 flex h-14 w-28 flex-none items-center justify-center rounded-lg bg-white px-3 sm:mr-4 sm:h-20 sm:w-36 sm:rounded-xl sm:px-5"
      >
        <img
          src={partner.src}
          alt={hidden ? '' : partner.alt}
          loading="lazy"
          className="max-h-9 w-auto max-w-full object-contain sm:max-h-12"
        />
      </li>
    ))}
  </ul>
);

/**
 * Partner-logo ribbon on the homepage, shown after the "Who can apply?"
 * section. The list is repeated six times and animated by exactly one copy so
 * the marquee never runs out of logos (which would leave a gap after the last
 * one) and loops seamlessly. Duplicate copies are hidden from assistive tech.
 */
const LOGO_GROUPS = 6;

const PartnersRibbon = () => (
  <section aria-label="Our partners" className="bg-primary py-3 sm:py-4">
    <div className="flex items-center gap-3 px-3 sm:gap-6 sm:px-6 lg:px-8">
      <p className="shrink-0 font-mono text-[10px] font-bold uppercase leading-[1.3] tracking-[0.14em] text-white sm:text-body-m sm:tracking-[0.18em]">
        <span className="block">Our</span>
        <span className="block">partners</span>
      </p>

      <div className="relative min-w-0 flex-1 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_2%,black_95%,transparent)] motion-reduce:overflow-x-auto">
        <div className="flex w-max items-center animate-partner-marquee-loop hover:[animation-play-state:paused] motion-reduce:w-auto motion-reduce:animate-none">
          {Array.from({ length: LOGO_GROUPS }, (_, index) => (
            <LogoGroup key={index} hidden={index > 0} />
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default PartnersRibbon;
