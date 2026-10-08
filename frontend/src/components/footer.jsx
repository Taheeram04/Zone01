// components/footer.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FaPhone,
  FaFacebookF,
  FaXTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
  FaTiktok,
} from 'react-icons/fa6';
import logo from '../assets/whitelogo.png';

// 3 columns of navigation links matching the design in footer1.png
const navColumns = [
  {
    key: 'col-1',
    links: [
      { label: 'HOME', href: '/' },
      { label: 'OUR IMPACT', href: '/impact' },
    ],
  },
  {
    key: 'col-2',
    links: [
      { label: 'ABOUT US', href: '/about' },
      { label: 'COMMUNITY', href: '/community' },
      { label: 'FAQ', href: '/faq' },
    ],
  },
  {
    key: 'col-3',
    links: [
      { label: 'PRIVACY', href: '/privacy' },
      { label: 'CAREERS', href: '/careers' },
    ],
  },
];

// Social media links including TikTok placed last with matching size and design
const socialLinks = [
  {
    type: 'solid',
    Icon: FaFacebookF,
    href: 'https://facebook.com',
    label: 'Facebook',
    iconClass: 'w-[16px] h-[16px] sm:w-[18px] sm:h-[18px]',
  },
  {
    type: 'outlined',
    Icon: FaXTwitter,
    href: 'https://twitter.com',
    label: 'X (formerly Twitter)',
    iconClass: 'w-[15px] h-[15px] sm:w-[17px] sm:h-[17px]',
  },
  {
    type: 'solid',
    Icon: FaInstagram,
    href: 'https://instagram.com',
    label: 'Instagram',
    iconClass: 'w-[17px] h-[17px] sm:w-[19px] sm:h-[19px]',
  },
  {
    type: 'solid',
    Icon: FaLinkedinIn,
    href: 'https://linkedin.com',
    label: 'LinkedIn',
    iconClass: 'w-[15px] h-[15px] sm:w-[17px] sm:h-[17px]',
  },
  {
    type: 'solid',
    Icon: FaYoutube,
    href: 'https://youtube.com',
    label: 'YouTube',
    iconClass: 'w-[16px] h-[16px] sm:w-[18px] sm:h-[18px]',
  },
  {
    type: 'solid',
    Icon: FaTiktok,
    href: 'https://tiktok.com',
    label: 'TikTok',
    iconClass: 'w-[16px] h-[16px] sm:w-[17px] sm:h-[17px]',
  },
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
    <footer className="w-full bg-[#0063F9] text-white">
      <div className="w-full max-w-[1920px] mx-auto px-5 sm:px-8 md:px-10 xl:px-[53px] pt-8 sm:pt-10 xl:pt-[60px]">
        {/* Top Horizontal Divider */}
        <div className="w-full border-t border-white" />

        {/* Main Content Section */}
        <div className="pt-8 sm:pt-10 xl:pt-[68px] pb-8 sm:pb-10 xl:pb-[36px] flex flex-col lg:flex-row lg:items-start lg:justify-between gap-10 lg:gap-8 xl:gap-12">
          {/* Left Column: Logo, Tagline, Address & Phone */}
          <div className="flex flex-col items-start w-full lg:w-auto lg:max-w-[360px] xl:max-w-[420px] shrink-0">
            <Link to="/" onClick={scrollToTop} aria-label="Zone01 Kisumu Home">
              <img
                src={logo}
                alt="Zone01 Kisumu"
                className="w-[220px] sm:w-[260px] xl:w-[320px] h-auto object-contain"
              />
            </Link>

            <p className="mt-3 sm:mt-4 xl:mt-[18px] text-[16px] sm:text-[18px] xl:text-[20px] font-sans font-normal text-white tracking-[0.01em]">
              Recode Africa with African Talent
            </p>

            {/* Address */}
            <div className="mt-6 sm:mt-8 xl:mt-[36px] flex items-start gap-3 sm:gap-4">
              <svg
                className="w-5 h-7 sm:w-[22px] sm:h-[35px] text-white shrink-0 mt-0.5"
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
              <div className="text-[14px] sm:text-[16px] xl:text-[20px] font-sans font-normal text-white leading-snug sm:leading-[1.35]">
                <p>Zone01 Kisumu, Lake Basin Mall</p>
                <p>Kisumu-Vihiga Road. Kisumu, Kenya</p>
              </div>
            </div>

            {/* Phone */}
            <div className="mt-5 sm:mt-6 xl:mt-[24px] flex items-center gap-3 sm:gap-4">
              <FaPhone className="w-4 h-4 sm:w-[18px] sm:h-[18px] text-white shrink-0" aria-hidden="true" />
              <a
                href="tel:+254748902779"
                className="text-[15px] sm:text-[17px] xl:text-[20px] font-sans font-normal text-white hover:underline transition-all"
              >
                +254 748902779
              </a>
            </div>
          </div>

          {/* Center Column: 3 Columns of Navigation Links */}
          <div className="w-full lg:w-auto flex-1 flex justify-start lg:justify-center pt-2 sm:pt-4 lg:pt-[54px] xl:pt-[62px]">
            <nav
              aria-label="Footer Navigation"
              className="grid grid-cols-3 gap-6 sm:gap-10 md:gap-14 lg:gap-8 xl:gap-[70px] w-full max-w-[580px]"
            >
              {navColumns.map((col) => (
                <div
                  key={col.key}
                  className="flex flex-col space-y-6 sm:space-y-8 xl:space-y-[44px]"
                >
                  {col.links.map((link) => (
                    <Link
                      key={link.label}
                      to={link.href}
                      onClick={scrollToTop}
                      className="text-[14px] sm:text-[16px] xl:text-[20px] font-sans font-bold text-white tracking-[0.02em] whitespace-nowrap hover:opacity-80 transition-opacity"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              ))}
            </nav>
          </div>

          {/* Right Column: Social Media Links & Newsletter */}
          <div className="flex flex-col items-start w-full lg:w-auto lg:max-w-[466px] shrink-0 pt-2 sm:pt-4 lg:pt-[54px] xl:pt-[62px]">
            {/* Socials Heading */}
            <h3 className="text-[16px] sm:text-[18px] xl:text-[22px] font-sans font-bold text-white uppercase tracking-wider mb-3 sm:mb-4 xl:mb-[20px]">
              OUR SOCIALS
            </h3>

            {/* Social Icons (6 icons including TikTok placed last) */}
            <div className="flex items-center flex-wrap gap-2.5 sm:gap-3 xl:gap-[18px]">
              {socialLinks.map(({ type, Icon, href, label, iconClass }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className={
                    type === 'outlined'
                      ? 'w-[34px] h-[34px] sm:w-[36px] sm:h-[36px] xl:w-[38px] xl:h-[38px] rounded-full border-2 border-white bg-transparent text-white flex items-center justify-center hover:bg-white/10 hover:scale-105 active:scale-95 transition-all'
                      : 'w-[34px] h-[34px] sm:w-[36px] sm:h-[36px] xl:w-[38px] xl:h-[38px] rounded-full bg-white text-[#0063F9] flex items-center justify-center hover:bg-white/90 hover:scale-105 active:scale-95 transition-all shadow-sm'
                  }
                >
                  <Icon className={iconClass} />
                </a>
              ))}
            </div>

            {/* Newsletter Heading */}
            <h3 className="mt-6 sm:mt-8 xl:mt-[38px] text-[17px] sm:text-[20px] xl:text-[24px] font-sans font-bold text-white mb-3 sm:mb-4 xl:mb-[20px]">
              Subscribe to our newsletter
            </h3>

            {/* Newsletter Form */}
            <form
              onSubmit={handleSubscribe}
              className="relative flex items-center w-full max-w-[466px] h-[54px] sm:h-[62px] xl:h-[68px] rounded-full bg-white p-1 sm:p-1.5 border-[2px] xl:border-[2.5px] border-white shadow-sm"
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                aria-label="Your email address"
                className="w-full min-w-0 bg-transparent pl-4 sm:pl-6 xl:pl-7 pr-2 text-[14px] sm:text-[16px] xl:text-[17px] text-[#0063F9] placeholder:text-[#0063F9]/80 font-sans font-medium focus:outline-none"
              />
              <button
                type="submit"
                className="shrink-0 h-[44px] sm:h-[50px] xl:h-[56px] px-4 sm:px-6 xl:px-8 rounded-full bg-[#0063F9] text-white font-sans font-medium text-[13px] sm:text-[15px] xl:text-[17px] border-[2px] xl:border-[2.5px] border-white whitespace-nowrap hover:bg-[#0052d4] transition-colors cursor-pointer flex items-center justify-center"
              >
                {isSubscribed ? 'Subscribed!' : 'Get Started'}
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Horizontal Divider */}
        <div className="w-full border-t border-white mt-4 sm:mt-6 xl:mt-[18px]" />

        {/* Bottom Row: Centered Copyright */}
        <div className="py-6 sm:py-7 xl:py-[28px] text-center">
          <p className="text-[13px] sm:text-[15px] xl:text-[19px] font-sans font-normal text-white tracking-[0.01em]">
            Copyright@2026 Zone01 Kisumu, Lake Basin Mall
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;