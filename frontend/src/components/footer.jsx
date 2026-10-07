// components/footer.jsx
import { useState } from 'react';
import {
  FaPhone,
  FaFacebookF,
  FaXTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
} from 'react-icons/fa6';
import logo from '../assets/whitelogo.png';

const navLinks = [
  { label: 'HOME', href: '/' },
  { label: 'ABOUT US', href: '/about' },
  { label: 'COMMUNITY', href: '/community' },
  { label: 'CAREERS', href: '/careers' },
  { label: 'OUR IMPACT', href: '/impact' },
  { label: 'FAQ', href: '/faq' },
];

const socialLinks = [
  {
    type: 'solid',
    Icon: FaFacebookF,
    href: '#',
    label: 'Facebook',
    iconClass: 'w-[18px] h-[18px]',
  },
  {
    type: 'outlined',
    Icon: FaXTwitter,
    href: '#',
    label: 'X',
    iconClass: 'w-[17px] h-[17px]',
  },
  {
    type: 'solid',
    Icon: FaInstagram,
    href: '#',
    label: 'Instagram',
    iconClass: 'w-[19px] h-[19px]',
  },
  {
    type: 'solid',
    Icon: FaLinkedinIn,
    href: '#',
    label: 'LinkedIn',
    iconClass: 'w-[17px] h-[17px]',
  },
  {
    type: 'solid',
    Icon: FaYoutube,
    href: '#',
    label: 'YouTube',
    iconClass: 'w-[18px] h-[18px]',
  },
];

const Footer = () => {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    console.log('Subscribe:', email);
  };

  return (
    <footer className="w-full bg-[#0063F9] text-white">
      <div className="w-full max-w-[1920px] mx-auto px-6 sm:px-10 xl:px-[53px] pt-[60px]">
        {/* Top Horizontal Divider */}
        <div className="w-full border-t border-white" />

        {/* Middle Main Section */}
        <div className="min-h-[378px] py-10 lg:py-0 flex flex-col lg:flex-row items-start lg:items-center">
          {/* Left Column: Logo & Tagline */}
          <div className="flex flex-col items-start lg:pl-[108px] lg:w-[925px] shrink-0 lg:pt-[13px]">
            <img
              src={logo}
              alt="Zone01 Kisumu"
              className="w-[280px] sm:w-[310px] xl:w-[324px] h-auto object-contain"
            />
            <p className="mt-[18px] text-[20px] font-sans font-normal text-white whitespace-nowrap tracking-[0.01em]">
              Record Africa with African Talent
            </p>
          </div>

          {/* Center Column: Address, Phone & Social Icons */}
          <div className="flex flex-col space-y-[48px] shrink-0 lg:w-[425px]">
            {/* Address */}
            <div className="flex items-start gap-4">
              <svg
                className="w-[22px] h-[35px] text-white shrink-0 mt-0.5"
                viewBox="0 0 24 36"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
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
              <div className="text-[20px] font-sans font-normal text-white leading-[1.35] whitespace-nowrap">
                <p>Zone01 Kisumu, Lake Basin Mall</p>
                <p>Kisumu-Vihiga Road. Kisumu, Kenya</p>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-center gap-4">
              <FaPhone className="w-[18px] h-[18px] text-white shrink-0" />
              <span className="text-[20px] font-sans font-normal text-white">
                +254 748902779
              </span>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-[26px]">
              {socialLinks.map(({ type, Icon, href, label, iconClass }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className={
                    type === 'outlined'
                      ? 'w-[36px] h-[36px] rounded-full border-2 border-white bg-transparent text-white flex items-center justify-center hover:bg-white/10 transition-colors'
                      : 'w-[36px] h-[36px] rounded-full bg-white text-[#0063F9] flex items-center justify-center hover:opacity-90 transition-opacity'
                  }
                >
                  <Icon className={iconClass} />
                </a>
              ))}
            </div>
          </div>

          {/* Right Column: Newsletter Subscription */}
          <div className="flex flex-col items-start w-full lg:w-auto lg:self-end lg:mb-[26px] ml-auto xl:pr-[17px]">
            <h3 className="text-[25px] font-sans font-bold text-white mb-[22px]">
              Subscribe to our newsletter
            </h3>
            <form
              onSubmit={handleSubscribe}
              className="relative flex items-center w-full sm:w-[466px] h-[69px] rounded-full bg-white p-1 border-[2.5px] border-white shadow-sm"
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                aria-label="Your email address"
                className="w-full min-w-0 bg-transparent pl-7 pr-3 text-[17px] text-[#0063F9] placeholder:text-[#0063F9] font-sans font-normal focus:outline-none"
              />
              <button
                type="submit"
                className="shrink-0 w-[184px] h-[57px] rounded-full bg-[#0063F9] text-white font-sans font-medium text-[17px] border-[2.5px] border-white whitespace-nowrap hover:bg-[#0052d4] transition-colors cursor-pointer flex items-center justify-center"
              >
                Get Started
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Horizontal Divider */}
        <div className="w-full border-t border-white" />

        {/* Bottom Row: Links & Copyright */}
        <div className="h-[96px] flex flex-col lg:flex-row items-start justify-between">
          <nav className="flex items-center gap-[87px] lg:pl-[210px] whitespace-nowrap pt-[24px]">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-[20px] font-sans font-bold text-white tracking-[0.02em] hover:opacity-80 transition-opacity"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <p className="text-[20px] font-sans font-normal text-white text-center lg:text-right whitespace-nowrap xl:pr-[17px] pt-[36px]">
            Copyright@2026 Zone01 Kisumu, Lake Basin Mall
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;