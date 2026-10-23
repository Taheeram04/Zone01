// components/footer.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaPhone } from 'react-icons/fa6';
import { SOCIAL_LINKS } from '../social.js';
import logo from '../assets/whitelogo.webp';

// Footer navigation links, laid out in a single aligned grid.
const footerLinks = [
  { label: 'HOME', href: '/' },
  { label: 'OUR IMPACT', href: '/impact' },
  { label: 'ABOUT US', href: '/about' },
  { label: 'COMMUNITY', href: '/community' },
  { label: 'FAQ', href: '/faq' },
  { label: 'PRIVACY', href: '/privacy' },
  { label: 'CAREERS', href: '/careers' },
];

const Footer = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    console.log('Subscribe:', email);
    setIsSubscribed(true);
    setEmail('');
    setTimeout(() => setIsSubscribed(false), 4000);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full bg-[#0063F9] text-white pb-[env(safe-area-inset-bottom)]">
      <div className="w-full max-w-[1920px] mx-auto px-[clamp(1.25rem,4.5vw,53px)] pt-4 sm:pt-5 xl:pt-6">
        {/* Top Horizontal Divider */}
        <div className="w-full border-t border-white" />

        {/* Main Content Section */}
        <div className="pt-5 sm:pt-6 xl:pt-6 pb-4 sm:pb-6 xl:pb-5 flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 lg:gap-5 xl:gap-8">
          {/* Left Column: Logo, Tagline, Address & Phone */}
          <div className="flex flex-col items-start w-full min-w-0 pl-4 sm:pl-6 lg:w-auto lg:max-w-[340px] lg:pl-8 xl:max-w-[420px] xl:pl-12">
            <Link to="/" onClick={scrollToTop} aria-label="Zone01 Kisumu Home">
              <img
                src={logo}
                alt="Zone01 Kisumu"
                width="311"
                height="118"
                className="w-[140px] sm:w-[170px] xl:w-[200px] max-w-full h-auto object-contain"
              />
            </Link>

            <p className="mt-2 sm:mt-3 xl:mt-2 text-[13px] sm:text-[14px] xl:text-[16px] font-sans font-normal text-white tracking-[0.01em]">
              Recode Africa with African Talent
            </p>

            {/* Address */}
            <div className="mt-3 sm:mt-4 xl:mt-4 flex items-start gap-3 sm:gap-4">
              <svg
                className="w-4 h-5 sm:w-[17px] sm:h-[26px] text-white shrink-0 mt-0.5"
                viewBox="0 0 24 36"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  d="M12 2C6.477 2 2 6.477 2 12C2 19.5 12 34 12 34C12 34 22 19.5 22 12C22 6.477 17.523 2 12 2Z"
                  stroke="white"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle
                  cx="12"
                  cy="12"
                  r="4"
                  stroke="white"
                  strokeWidth="2.5"
                />
              </svg>
              <div className="text-[12px] sm:text-[13px] xl:text-[16px] font-sans font-normal text-white leading-snug sm:leading-[1.35]">
                <p>Lake Basin Mall, Mamboleo Junction</p>
                <p>Kisumu-Vihiga Road. Kisumu, Kenya</p>
              </div>
            </div>

            {/* Phone */}
            <div className="mt-3 sm:mt-4 xl:mt-4 flex items-center gap-3 sm:gap-4">
              <FaPhone className="w-4 h-4 sm:w-[18px] sm:h-[18px] text-white shrink-0" aria-hidden="true" />
              <a
                href="tel:+254748902779"
                className="text-[12px] sm:text-[13px] xl:text-[16px] font-sans font-normal text-white hover:underline transition-all"
              >
                +254 748 902 779
              </a>
            </div>
          </div>

          {/* Center Column: aligned navigation grid */}
          <div className="w-full min-w-0 lg:w-auto flex-1 flex justify-start lg:justify-center lg:pt-5 xl:pt-6">
            <nav
              aria-label="Footer Navigation"
              className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-3 sm:gap-x-8 sm:gap-y-4 md:gap-x-10 lg:gap-x-8 xl:gap-x-[48px] w-full min-w-0 max-w-[460px]"
            >
              {footerLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.href}
                  onClick={scrollToTop}
                  className="text-[12px] sm:text-[13px] xl:text-[15px] font-sans font-bold text-white tracking-[0.02em] whitespace-nowrap hover:opacity-80 transition-opacity"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Right Column: Social Media Links & Newsletter */}
          <div className="flex flex-col items-start w-full min-w-0 lg:w-auto lg:max-w-[300px] lg:mr-8 lg:pt-5 xl:mr-12 xl:pt-6">
            {/* Socials Heading */}

            {/* Social Icons (6 icons including TikTok placed last) */}
            <div className="flex w-full flex-wrap items-center justify-between gap-2 sm:gap-3">
              {SOCIAL_LINKS.map(({ type, Icon, href, label, iconClass }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className={
                    type === 'outlined'
                      ? 'w-[26px] h-[26px] sm:w-[28px] sm:h-[28px] xl:w-[30px] xl:h-[30px] rounded-full border-2 border-white bg-transparent text-white flex items-center justify-center hover:bg-white/10 hover:scale-105 active:scale-95 transition-all'
                      : 'w-[26px] h-[26px] sm:w-[28px] sm:h-[28px] xl:w-[30px] xl:h-[30px] rounded-full bg-white text-[#0063F9] flex items-center justify-center hover:bg-white/90 hover:scale-105 active:scale-95 transition-all shadow-sm'
                  }
                >
                  <Icon className={iconClass} />
                </a>
              ))}
            </div>

            {/* Newsletter Heading */}
            <h3 className="mt-6 sm:mt-7 xl:mt-8 text-[14px] sm:text-[16px] xl:text-[18px] font-sans font-bold text-white mb-2 sm:mb-3 xl:mb-3">
              Join our community
            </h3>

            {/* Newsletter Form */}
            <form
              onSubmit={handleSubscribe}
              className="relative flex items-center w-full h-[42px] sm:h-[46px] xl:h-[50px] rounded-full bg-white p-1 sm:p-1.5 border-[2px] xl:border-[2.5px] border-white shadow-sm"
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                aria-label="Your email address"
                className="w-full min-w-0 bg-transparent pl-3 sm:pl-4 xl:pl-5 pr-2 text-[12px] sm:text-[13px] xl:text-[14px] text-[#0063F9] placeholder:text-[#0063F9]/80 font-sans font-medium focus:outline-none"
              />
              <button
                type="submit"
                className="shrink-0 h-[34px] sm:h-[37px] xl:h-[41px] px-3 sm:px-5 xl:px-6 rounded-full bg-[#0063F9] text-white font-sans font-medium text-[11px] sm:text-[12px] xl:text-[13px] border-[2px] xl:border-[2.5px] border-white whitespace-nowrap hover:bg-[#0052d4] transition-colors cursor-pointer flex items-center justify-center"
              >
                {isSubscribed ? 'Subscribed!' : 'Get Started'}
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Horizontal Divider */}
        <div className="w-full border-t border-white mt-3 sm:mt-3 xl:mt-3" />

        {/* Bottom Row: Centered Copyright */}
        <div className="py-3 sm:py-3 xl:py-3 text-center">
          <p className="text-[11px] sm:text-[12px] xl:text-[14px] font-sans font-normal text-white tracking-[0.01em]">
            Copyright @2026 Zone01 Kisumu, Lake Basin Mall
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;