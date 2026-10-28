// components/footer.jsx
import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { MapPin, Phone } from 'lucide-react';
import {
  FaFacebookF,
  FaLinkedinIn,
  FaInstagram,
  FaXTwitter,
  FaYoutube,
  FaTiktok,
} from 'react-icons/fa6';
import logo from '../assets/whitelogo.webp';

// Bottom navigation links matching the requested design and existing routes
const NAV_LINKS = [
  { label: 'HOME', href: '/' },
  { label: 'OUR IMPACT', href: '/impact' },
  { label: 'ABOUT US', href: '/about' },
  { label: 'PRIVACY', href: '/privacy' },
  { label: 'FAQ', href: '/faq' },
  { label: 'CAREERS', href: '/careers' },
];

// Six social accounts in requested order with existing project URLs
const SOCIAL_ACCOUNTS = [
  {
    key: 'facebook',
    Icon: FaFacebookF,
    href: 'https://www.facebook.com/share/1DLp6tDVmK/?mibextid=wwXIfr',
    label: 'Facebook',
    iconSize: 'w-[18px] h-[18px]',
  },
  {
    key: 'linkedin',
    Icon: FaLinkedinIn,
    href: 'https://www.linkedin.com/company/zone01kisumu/',
    label: 'LinkedIn',
    iconSize: 'w-[18px] h-[18px]',
  },
  {
    key: 'instagram',
    Icon: FaInstagram,
    href: 'https://www.instagram.com/zone01_kisumu/',
    label: 'Instagram',
    iconSize: 'w-[20px] h-[20px]',
  },
  {
    key: 'x',
    Icon: FaXTwitter,
    href: 'https://x.com/Zone01Kisumu',
    label: 'X (formerly Twitter)',
    iconSize: 'w-[17px] h-[17px]',
  },
  {
    key: 'youtube',
    Icon: FaYoutube,
    href: 'https://www.youtube.com/@Zone01Kisumu',
    label: 'YouTube',
    iconSize: 'w-[19px] h-[19px]',
  },
  {
    key: 'tiktok',
    Icon: FaTiktok,
    href: 'https://www.tiktok.com/@zone01kisumu?_r=1&_t=ZS-9ANaGVKhcEH',
    label: 'TikTok',
    iconSize: 'w-[18px] h-[18px]',
  },
];

const EASE = [0.2, 0.7, 0.2, 1];

const Footer = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const footerRef = useRef(null);
  const prefersReduced = useReducedMotion();

  // Trigger reveal animation once when footer enters viewport
  const isInView = useInView(footerRef, { once: true, amount: 0.15 });

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

  // Staggered sequential fade-up variant for the 4 elements in top row
  const getFadeUpVariant = (index) => ({
    hidden: prefersReduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 },
    visible: {
      opacity: 1,
      y: 0,
      transition: prefersReduced
        ? { duration: 0 }
        : {
            duration: 0.8,
            ease: EASE,
            delay: index * 0.12,
          },
    },
  });

  return (
    <footer
      ref={footerRef}
      className="w-full bg-[#0063F9] text-white rounded-[6px] overflow-hidden pt-[64px] lg:pt-[96px] pb-[48px] px-[24px] sm:px-[40px] lg:px-[80px]"
    >
      <div className="w-full max-w-[1400px] mx-auto flex flex-col gap-[64px]">
        {/* Top Part: Logo on Left, Contact/Form/Social Column on Right */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-[56px] w-full">
          {/* 1. White Logo (Left) */}
          <motion.div
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            variants={getFadeUpVariant(0)}
            className="shrink-0"
          >
            <Link
              to="/"
              onClick={scrollToTop}
              aria-label="Zone01 Kisumu Home"
              className="inline-block transition-transform duration-300 ease-out hover:scale-[1.03] focus-visible:outline focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-4 rounded-[4px] motion-reduce:transform-none motion-reduce:transition-none"
            >
              <img
                src={logo}
                alt="Zone01 Kisumu"
                width="311"
                height="118"
                className="w-[180px] sm:w-[220px] lg:w-[260px] h-auto object-contain"
              />
            </Link>
          </motion.div>

          {/* Right Column: Contact Block, Form, Social Row */}
          <div className="w-full lg:w-[480px] max-w-full flex flex-col gap-[28px]">
            {/* 2. Contact Block */}
            <motion.div
              initial="hidden"
              animate={isInView ? 'visible' : 'hidden'}
              variants={getFadeUpVariant(1)}
              className="flex flex-col gap-4 text-white"
            >
              {/* Address */}
              <div className="flex items-start gap-4">
                <MapPin className="w-6 h-6 text-white shrink-0 mt-0.5" strokeWidth={2} aria-hidden="true" />
                <p className="font-sans text-[18px] sm:text-[20px] leading-[1.4] text-white font-normal">
                  Lake Basin Mall, Kisumu-Vihiga Road. Kisumu, Kenya
                </p>
              </div>

              {/* Phone */}
              <div className="flex items-center gap-4">
                <Phone className="w-6 h-6 text-white shrink-0" strokeWidth={2} aria-hidden="true" />
                <a
                  href="tel:+254748902779"
                  className="font-sans text-[18px] sm:text-[20px] text-white hover:underline transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2 rounded-[2px]"
                >
                  +254 748 902 779
                </a>
              </div>
            </motion.div>

            {/* 3. Join Our Community Heading & Email Form */}
            <motion.div
              initial="hidden"
              animate={isInView ? 'visible' : 'hidden'}
              variants={getFadeUpVariant(2)}
              className="w-full"
            >
              <h3 className="font-sans text-[22px] font-semibold text-white mb-3">
                Join our community
              </h3>
              <form
                onSubmit={handleSubscribe}
                className="w-full relative flex items-center bg-white p-[4px] rounded-full transition-shadow duration-200 focus-within:ring-2 focus-within:ring-white/80 focus-within:ring-offset-2 focus-within:ring-offset-[#0063F9] shadow-sm"
              >
                <label htmlFor="footer-email-input" className="sr-only">
                  Your email address
                </label>
                <input
                  id="footer-email-input"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  className="w-full min-w-0 h-[48px] bg-transparent border-0 px-4 sm:px-6 font-sans text-[15px] sm:text-[16px] text-[#092C3E] placeholder:text-[#0A4FBF] focus:outline-none focus:ring-0"
                />
                <button
                  type="submit"
                  className="h-[48px] px-6 sm:px-8 shrink-0 rounded-full bg-[#0063F9] text-white font-sans font-semibold text-[15px] sm:text-[16px] whitespace-nowrap hover:bg-[#092C3E] active:scale-[0.97] transition-all duration-200 cursor-pointer flex items-center justify-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2 motion-reduce:transform-none motion-reduce:transition-none"
                >
                  {isSubscribed ? 'Subscribed!' : 'Get Started'}
                </button>
              </form>
            </motion.div>

            {/* 4. Row of Six Social Icons */}
            <motion.div
              initial="hidden"
              animate={isInView ? 'visible' : 'hidden'}
              variants={getFadeUpVariant(3)}
              className="flex items-center gap-[16px] flex-wrap"
            >
              {SOCIAL_ACCOUNTS.map(({ key, Icon, href, label, iconSize }) => (
                <a
                  key={key}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-[44px] h-[44px] rounded-full bg-white text-[#0063F9] flex items-center justify-center shrink-0 transition-all duration-300 ease-out hover:-translate-y-[6px] hover:scale-[1.08] hover:bg-[#092C3E] hover:text-white focus-visible:-translate-y-[6px] focus-visible:scale-[1.08] focus-visible:bg-[#092C3E] focus-visible:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2 motion-reduce:transform-none motion-reduce:transition-none"
                >
                  <Icon className={iconSize} aria-hidden="true" />
                </a>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Bottom Part: 1px Animated Divider & Space-Between Row */}
        <div className="flex flex-col gap-6 w-full">
          {/* 1.1s Drawing 1px Divider */}
          <motion.div
            initial={prefersReduced ? false : { scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
            transition={
              prefersReduced
                ? { duration: 0 }
                : { duration: 1.1, ease: EASE }
            }
            style={{ transformOrigin: 'left' }}
            className="w-full h-[1px] bg-white/70"
            aria-hidden="true"
          />

          {/* Nav Links on Left, Copyright on Right */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 w-full pt-2">
            {/* Nav Links */}
            <nav
              aria-label="Footer Navigation"
              className="flex flex-wrap items-center gap-x-[32px] lg:gap-x-[40px] gap-y-3"
            >
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.label}
                  to={link.href}
                  onClick={scrollToTop}
                  className="group relative py-1 font-sans font-semibold text-[16px] sm:text-[18px] uppercase tracking-wider text-white transition-opacity hover:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-4 rounded-[2px]"
                >
                  <span>{link.label}</span>
                  <span
                    aria-hidden="true"
                    className="absolute bottom-0 left-0 w-full h-[2px] bg-white origin-left scale-x-0 transition-transform duration-300 ease-out group-hover:scale-x-100 group-focus-visible:scale-x-100 motion-reduce:transform-none motion-reduce:transition-none"
                  />
                </Link>
              ))}
            </nav>

            {/* Copyright */}
            <p className="font-sans text-[16px] sm:text-[18px] font-normal text-white shrink-0">
              Copyright © 2026 Zone01 Kisumu
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
