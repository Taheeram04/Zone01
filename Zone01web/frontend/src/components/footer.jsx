// components/footer.jsx
import React, { useState } from 'react';
import { FaFacebook, FaXTwitter, FaInstagram, FaLinkedin, FaYoutube } from 'react-icons/fa6';
import { Container } from './layout.jsx';
import Button from './button.jsx';
import logo from '../assets/whitelogo.png';

const sectionLinks = [
  { label: 'Home', href: '/' },
  { label: 'About us', href: '/about' },
  { label: 'Community', href: '/community' },
  { label: 'Our Impact', href: '/impact' },
];

const socialLinks = [
  { Icon: FaFacebook, href: '#', label: 'Facebook' },
  { Icon: FaXTwitter, href: '#', label: 'X' },
  { Icon: FaInstagram, href: '#', label: 'Instagram' },
  { Icon: FaLinkedin, href: '#', label: 'LinkedIn' },
  { Icon: FaYoutube, href: '#', label: 'YouTube' },
];

const Footer = () => {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    // TODO: wire to real newsletter endpoint once backend is decided
    console.log('Subscribe:', email);
  };

  return (
    <footer className="relative bg-primary text-white overflow-hidden" style={{ aspectRatio: '1920 / 427' }}>
      {/* Background pixel-text watermark, sits behind everything else */}
      <p
        aria-hidden="true"
        className="absolute z-0 select-none pointer-events-none font-pixel text-white/[0.09] text-center whitespace-nowrap"
        style={{
          left: '7.34%',
          top: '86.18%',
          width: '73.85%',
          fontSize: '11.98vw',
          lineHeight: '5.21vw',
        }}
      >
        ZONE01
      </p>

      <Container className="relative z-10 py-8 md:py-10">
        <div className="flex flex-col md:flex-row md:items-start gap-10 md:gap-24">
          <div className="flex flex-col space-y-2 md:max-w-xs">
            <img src={logo} alt="Zone01 Kisumu" className="h-12 w-auto object-contain" />
            <p className="text-body-s font-sans text-white/90">
              Zone01 Kisumu, Lake Basin Mall<br />
              Kisumu-Vihiga Road, Kisumu, Kenya
            </p>
          </div>

          <div>
            <h3 className="text-body-m font-sans font-semibold mb-2">Sections</h3>
            <ul className="space-y-1.5 text-body-s font-sans text-white/90">
              {sectionLinks.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="hover:text-accent transition-colors">{link.label}</a>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:ml-auto">
            <h3 className="text-body-m font-sans font-semibold mb-2">Subscribe to our newsletter</h3>
            <form onSubmit={handleSubscribe} className="flex rounded-full overflow-hidden bg-white mb-3">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                className="flex-1 px-4 py-2 text-black-900 text-body-s font-sans focus:outline-none"
              />
              <Button type="submit" variant="secondary" className="!rounded-full !px-5 !py-2 text-body-s">
                Get Started
              </Button>
            </form>

           <div className="flex space-x-3">
  {socialLinks.map(({ Icon, href, label }) => (
    <a
      key={label}
      href={href}
      aria-label={label}
      className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
    >
      <Icon className="w-4 h-4" />
    </a>
  ))}
</div>

          </div>
        </div>
      </Container>

      <Container className="relative z-10 border-t border-white/20 pt-3 pb-4 mt-auto">
        <p className="text-center text-body-s font-sans text-white/80">
          Zone01 Kisumu, Lake Basin Mall
        </p>
      </Container>
    </footer>
  );
};

export default Footer;