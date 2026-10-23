// components/hire-partners.jsx
import partner01 from '../assets/partners/partner-01.webp';
import partner02 from '../assets/partners/partner-02.webp';
import partner03 from '../assets/partners/partner-03.webp';
import partner04 from '../assets/partners/partner-04.webp';
import partner05 from '../assets/partners/partner-05.webp';
import partner06 from '../assets/partners/partner-06.webp';
import partner07 from '../assets/partners/partner-07.webp';
import partner08 from '../assets/partners/partner-08.webp';
import partner09 from '../assets/partners/partner-09.webp';
import partner10 from '../assets/partners/partner-10.webp';
import partner11 from '../assets/partners/partner-11.webp';
import partner12 from '../assets/partners/partner-12.webp';
import partner13 from '../assets/partners/partner-13.webp';
import partner14 from '../assets/partners/partner-14.webp';
import partner15 from '../assets/partners/partner-15.webp';
import partner16 from '../assets/partners/partner-16.webp';
import partner17 from '../assets/partners/partner-17.webp';
import partner18 from '../assets/partners/partner-18.webp';

const PARTNERS = [
  { src: partner01, alt: 'BBR' },
  { src: partner02, alt: 'Berrijam' },
  { src: partner03, alt: 'HJ' },
  { src: partner04, alt: 'CTEX Digital & Connectivity Solutions' },
  { src: partner05, alt: 'BaruchSoft Technologies' },
  { src: partner06, alt: 'Partner logo' },
  { src: partner07, alt: 'Technoprise Global' },
  { src: partner08, alt: 'Demulla' },
  { src: partner09, alt: 'GNOME' },
  { src: partner10, alt: 'Bongo Hub' },
  { src: partner11, alt: 'Celcom Instant Messaging Solutions' },
  { src: partner12, alt: 'Republic of Kenya Public Service Commission' },
  { src: partner13, alt: 'Partner logo' },
  { src: partner14, alt: 'Partner logo' },
  { src: partner15, alt: 'WSPGate' },
  { src: partner16, alt: 'UN Women' },
  { src: partner17, alt: 'Professional Digital Systems Limited' },
  { src: partner18, alt: 'UNDP' },
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
 * Partner-logo ribbon pinned to the bottom of the /hire hero. It uses the
 * same blue as the proof band below so the hero flows straight into the
 * numbers. The logo list is rendered twice for a seamless loop; the second
 * copy is hidden from assistive tech so logos are not announced twice.
 */
const HirePartners = () => (
  <section aria-label="Hiring partners" className="bg-primary py-3 sm:py-4">
    <div className="flex items-center gap-3 px-3 sm:gap-6 sm:px-6 lg:px-8">
      <p className="shrink-0 font-mono text-[10px] font-bold uppercase leading-[1.3] tracking-[0.14em] text-white sm:text-body-m sm:tracking-[0.18em]">
        <span className="block">Hiring</span>
        <span className="block">partners</span>
      </p>

      <div className="relative min-w-0 flex-1 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_2%,black_95%,transparent)] motion-reduce:overflow-x-auto">
        <div className="flex w-max items-center animate-partner-marquee hover:[animation-play-state:paused] motion-reduce:w-auto motion-reduce:animate-none">
          <LogoGroup />
          <LogoGroup hidden />
        </div>
      </div>
    </div>
  </section>
);

export default HirePartners;
