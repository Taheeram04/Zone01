// components/navbar.jsx
import { useState, useEffect, useRef } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from './button.jsx';
import { Container } from './layout.jsx';
import { APPLICATION_URL } from '../constants.js';
import mainLogo from '../assets/mainlogo.png';
import whiteLogo from '../assets/whitelogo.png';

const navLinks = [
  { label: 'Home', href: '/', decorated: false },
  { label: 'About Us', href: '/about', decorated: true },
  { label: 'Community', href: '/community', decorated: true },
  { label: 'Our Impact', href: '/impact', decorated: true },
  { label: 'Hire Talent', href: '/hire', decorated: false },
];

const aboutDropdownItems = [
  { label: 'Know Us', href: '/about#know-us' },
  { label: 'Our Model', href: '/about#our-model' },
  { label: 'How to Apply', href: '/about#how-to-apply' },
  { label: 'Careers', href: '/about#careers' },
];

// Hosted Every.org donation flow.
export const DONATE_URL =
  'https://www.every.org/lakehub-foundation?donateTo=lakehub-foundation#/donate/card';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [aboutDropdownOpen, setAboutDropdownOpen] = useState(false);
  const [mobileAboutOpen, setMobileAboutOpen] = useState(false);
  const aboutDropdownRef = useRef(null);
  const hoverTimeoutRef = useRef(null);

  // Navbar flips between dark and light as sections scroll behind it.
  const [navTheme, setNavTheme] = useState('dark');

  // Ref to the nav element so we can sample which section sits behind it.
  const navRef = useRef(null);

  const toggleMenu = () => {
    setMenuOpen((prev) => {
      if (prev) setMobileAboutOpen(false);
      return !prev;
    });
  };

  const handleMouseEnter = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    setAboutDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    hoverTimeoutRef.current = setTimeout(() => {
      setAboutDropdownOpen(false);
    }, 200);
  };

  const handleSectionClick = (href) => {
    setAboutDropdownOpen(false);
    setMobileAboutOpen(false);
    setMenuOpen(false);

    const hashIndex = href.indexOf('#');
    if (hashIndex !== -1) {
      const hash = href.substring(hashIndex + 1);
      const target = document.getElementById(hash) || document.getElementById(hash.replace(/-/g, ''));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  // Clear any pending hover-close timer on unmount.
  useEffect(() => () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
  }, []);

  // Close the About dropdown on click outside or Escape.
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (aboutDropdownRef.current && !aboutDropdownRef.current.contains(event.target)) {
        setAboutDropdownOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setAboutDropdownOpen(false);
      }
    };

    if (aboutDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [aboutDropdownOpen]);

  // Whenever the user scrolls, work out which themed section is behind the
  // navbar. Sections opt in with `data-nav-theme="dark|light"`.
  useEffect(() => {
    let raf = null;

    const update = () => {
      raf = null;
      const nav = navRef.current;
      const sampleY = nav ? nav.getBoundingClientRect().height * 0.5 : 36;
      const sections = document.querySelectorAll('[data-nav-theme]');

      let found = null;
      sections.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top <= sampleY && rect.bottom > sampleY) {
          found = el.getAttribute('data-nav-theme') === 'light' ? 'light' : 'dark';
        }
      });

      if (found) setNavTheme((prev) => (prev === found ? prev : found));
    };

    const onScroll = () => {
      if (raf == null) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    return () => {
      if (raf != null) cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  // Dark backgrounds (and the open mobile menu) need the white logo/labels.
  const useWhiteLogo = menuOpen || navTheme === 'dark';

  // Lock page scroll while the mobile menu is open, and let Escape close it.
  useEffect(() => {
    if (!menuOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };

    // If the viewport grows back to desktop, drop the mobile menu so the
    // page scroll is never left locked.
    const handleResize = () => {
      if (window.innerWidth >= 768) setMenuOpen(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('resize', handleResize);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', handleResize);
    };
  }, [menuOpen]);

  return (
    <>
      <nav
        ref={navRef}
        className={`fixed top-0 left-0 w-full z-40 transition-colors duration-300 ${
          useWhiteLogo
            ? 'bg-black-900/25 backdrop-blur-sm'
            : 'bg-white/75 backdrop-blur-md shadow-[0_1px_2px_rgba(9,44,62,0.08)]'
        }`}
        style={{ paddingTop: 'env(safe-area-inset-top)' }}
      >
        <Container>
          <div className="relative z-50 flex justify-between items-center py-4">
            <Link to="/" className="flex items-center" aria-label="Zone01 Kisumu home">
              <img
                src={useWhiteLogo ? whiteLogo : mainLogo}
                alt="Zone01 Kisumu"
                className="h-8 md:h-10 transition-opacity duration-300"
              />
            </Link>

            {/* Links + Apply button grouped together, pushed to the right */}
            <div className="hidden md:flex items-center gap-8">
              <ul
                className={`flex items-center space-x-6 lg:space-x-8 font-sans font-medium text-body-s transition-colors duration-300 ${
                  useWhiteLogo ? 'text-white' : 'text-black-900'
                }`}
              >
                {navLinks.map((link) => {
                  if (link.label === 'About Us') {
                    return (
                      <li
                        key={link.href}
                        className="relative"
                        ref={aboutDropdownRef}
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                      >
                        <div className="flex items-center gap-0.5">
                          <Link
                            to={link.href}
                            onClick={() => setAboutDropdownOpen(false)}
                            className="hover:text-primary transition-colors whitespace-nowrap"
                          >
                            {link.label}
                          </Link>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setAboutDropdownOpen((prev) => !prev);
                            }}
                            aria-expanded={aboutDropdownOpen}
                            aria-haspopup="true"
                            aria-label="Toggle About Us menu"
                            className="p-1 -mr-1 rounded hover:text-primary transition-colors cursor-pointer flex items-center justify-center focus:outline-none"
                          >
                            <ChevronDown
                              className={`w-3.5 h-3.5 transition-transform duration-200 ${
                                aboutDropdownOpen ? 'rotate-180 text-primary' : ''
                              }`}
                            />
                          </button>
                        </div>

                        {/* Desktop Dropdown Menu - Seamless, clear, blurred, non-card */}
                        {aboutDropdownOpen && (
                          <div className="absolute top-full left-0 pt-2 z-50">
                            <div className="min-w-[175px] py-2.5 px-1 bg-black-900/25 backdrop-blur-md rounded-xl">
                              <ul className="flex flex-col space-y-1">
                                {aboutDropdownItems.map((item) => (
                                  <li key={item.href}>
                                    <Link
                                      to={item.href}
                                      onClick={() => handleSectionClick(item.href)}
                                      className="block py-1.5 px-3 text-body-s font-medium text-white/85 hover:text-primary transition-colors whitespace-nowrap"
                                    >
                                      {item.label}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        )}
                      </li>
                    );
                  }

                  return (
                    <li key={link.href}>
                      <Link to={link.href} className="flex items-center gap-1 hover:text-primary transition-colors whitespace-nowrap">
                        {link.label}
                        {link.decorated && <ChevronDown className="w-3 h-3" />}
                      </Link>
                    </li>
                  );
                })}
                <li>
                  <a href={DONATE_URL} className="hover:text-primary transition-colors whitespace-nowrap">
                    Donate
                  </a>
                </li>
              </ul>

              <Button
                variant="primary"
                href={APPLICATION_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="!px-6 !py-2 rounded-full text-body-s whitespace-nowrap"
              >
                Apply
              </Button>
            </div>

            <button
              type="button"
              className={`md:hidden z-50 -mr-2 p-2 rounded-lg transition-colors ${
                useWhiteLogo ? 'text-white active:bg-white/10' : 'text-black-900 active:bg-black-900/10'
              }`}
              onClick={toggleMenu}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
            >
              {menuOpen ? (
                <X className="h-7 w-7" />
              ) : (
                <Menu className="h-7 w-7" />
              )}
            </button>
          </div>

          {menuOpen && (
            <>
              {/* Tappable backdrop to dismiss the menu */}
              <div
                className="md:hidden fixed inset-0 z-30 bg-black-900/50 animate-fade-in"
                onClick={() => setMenuOpen(false)}
                aria-hidden="true"
              />
              <div
                id="mobile-menu"
                role="dialog"
                aria-modal="true"
                aria-label="Site navigation"
                className="md:hidden relative z-50 mx-2 mb-3 max-h-[calc(100svh_-_7rem)] overflow-y-auto overscroll-contain rounded-2xl border border-white/10 bg-black-900/95 backdrop-blur-md px-4 py-4 shadow-2xl animate-menu-in"
              >
                <ul className="flex flex-col font-sans font-medium text-base text-white divide-y divide-white/10">
                  {navLinks.map((link) => {
                    if (link.label === 'About Us') {
                      return (
                        <li key={link.href} className="flex flex-col">
                          <div className="flex items-center justify-between">
                            <Link
                              to={link.href}
                              className="flex min-h-[48px] flex-1 items-center gap-2 rounded-lg px-3 -mx-1 text-white active:bg-white/10 transition-colors"
                              onClick={() => {
                                setAboutDropdownOpen(false);
                                setMenuOpen(false);
                              }}
                            >
                              {link.label}
                            </Link>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setMobileAboutOpen((prev) => !prev);
                              }}
                              aria-expanded={mobileAboutOpen}
                              aria-label="Toggle About Us submenu"
                              className="p-2 -mr-1 rounded text-white hover:text-primary transition-colors cursor-pointer"
                            >
                              <ChevronDown
                                className={`w-4 h-4 transition-transform duration-200 ${
                                  mobileAboutOpen ? 'rotate-180 text-primary' : ''
                                }`}
                              />
                            </button>
                          </div>

                          {mobileAboutOpen && (
                            <ul className="pl-3 mt-1 mb-2 space-y-1 border-l border-white/20 ml-2">
                              {aboutDropdownItems.map((item) => (
                                <li key={item.href}>
                                  <Link
                                    to={item.href}
                                    className="block py-1.5 text-white/80 hover:text-primary transition-colors text-body-s"
                                    onClick={() => handleSectionClick(item.href)}
                                  >
                                    {item.label}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          )}
                        </li>
                      );
                    }

                    return (
                      <li key={link.href}>
                        <Link
                          to={link.href}
                          className="flex min-h-[48px] items-center gap-2 rounded-lg px-3 -mx-1 text-white active:bg-white/10 transition-colors"
                          onClick={() => setMenuOpen(false)}
                        >
                          {link.label}
                          {link.decorated && <ChevronDown className="w-4 h-4 opacity-60" />}
                        </Link>
                      </li>
                    );
                  })}
                  <li>
                    <a href={DONATE_URL} onClick={() => setMenuOpen(false)} className="block min-h-[48px] leading-[48px] px-3 -mx-1 text-white hover:text-primary">
                      Donate
                    </a>
                  </li>
                  <li className="pt-3">
                    <Button
                      variant="primary"
                      href={APPLICATION_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setMenuOpen(false)}
                      className="w-full rounded-full text-body-s"
                    >
                      Apply
                    </Button>
                  </li>
                </ul>
              </div>
            </>
          )}
        </Container>
      </nav>
    </>
  );
}
