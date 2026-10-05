// components/footer.jsx
import { useState } from 'react';
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
    <footer className="relative bg-primary text-white overflow-hidden">
      <Container className="relative z-10 py-10 md:py-10">
        <div className="flex flex-col md:flex-row md:items-start gap-8 md:gap-24">
          <div className="flex flex-col space-y-3 md:max-w-xs">
            <img src={logo} alt="Zone01 Kisumu" className="h-12 w-auto object-contain" />
            <p className="text-sm md:text-body-s font-sans text-white/90 leading-relaxed">
              Zone01 Kisumu, Lake Basin Mall<br />
              Kisumu-Vihiga Road, Kisumu, Kenya
            </p>
          </div>

          <div>
            <h3 className="text-body-m font-sans font-semibold mb-2">Sections</h3>
            <ul className="space-y-1 text-sm md:space-y-1.5 md:text-body-s font-sans text-white/90">
              {sectionLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="inline-flex min-h-[36px] items-center hover:text-accent transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="w-full md:ml-auto md:w-auto md:pr-16 lg:pr-20">
            <h3 className="text-body-m font-sans font-semibold mb-2">Subscribe to our newsletter</h3>
            <form
              onSubmit={handleSubscribe}
              className="mb-4 flex w-full items-center gap-1.5 rounded-full bg-white p-1.5 sm:gap-2 sm:p-2"
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                aria-label="Your email address"
                className="min-w-0 flex-1 bg-transparent px-3 font-sans text-sm text-black-900 placeholder:text-[#5B9BFF] focus:outline-none md:text-body-s sm:px-4"
              />
              <Button
                type="submit"
                variant="primary"
                className="!shrink-0 !rounded-full !px-4 !py-2.5 !font-sans !font-semibold text-sm md:text-body-s whitespace-nowrap sm:!px-6"
              >
                Get Started
              </Button>
            </form>

            <div className="flex space-x-3">
              {socialLinks.map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 active:bg-white/30 transition-colors"
                >
                  <Icon className="w-[18px] h-[18px]" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </Container>

      <Container className="relative z-10 border-t border-white/20 pt-3 pb-[calc(1rem_+_env(safe-area-inset-bottom))] mt-auto">
        <p className="text-center text-sm md:text-body-s font-sans text-white/80">
          Copyright@2026 Zone01 Kisumu, Lake Basin Mall
        </p>
      </Container>
    </footer>
  );
};

export default Footer;