// components/navbar.jsx
import { useState } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from './button.jsx';
import { Container } from './layout.jsx';
import logo from '../assets/mainlogo.png';

const navLinks = [
  { label: 'Home', href: '/', decorated: false },
  { label: 'About Us', href: '/about', decorated: true },
  { label: 'Community', href: '/community', decorated: true },
  { label: 'Our Impact', href: '/impact', decorated: true },
  { label: 'Hire Talent', href: '/hire', decorated: false },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showDonateModal, setShowDonateModal] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-40 bg-black-900/20 backdrop-blur-sm">
        <Container>
         <div className="flex justify-between items-center py-4">
  <Link to="/" className="flex items-center">
   <img src={logo} alt="Zone01 Kisumu" className="h-8 md:h-10" />
  </Link>

  {/* Links + Apply button grouped together, pushed to the right */}
  <div className="hidden md:flex items-center gap-8">
    <ul className="flex items-center space-x-6 lg:space-x-8 font-sans font-medium text-body-s text-white">
      {navLinks.map((link) => (
        <li key={link.href}>
          <Link to={link.href} className="flex items-center gap-1 hover:text-primary transition-colors whitespace-nowrap">
            {link.label}
            {link.decorated && <ChevronDown className="w-3 h-3" />}
          </Link>
        </li>
      ))}
      <li>
        <button onClick={() => setShowDonateModal(true)} className="hover:text-primary transition-colors whitespace-nowrap">
          Donate
        </button>
      </li>
    </ul>

    <Button variant="primary" className="!px-6 !py-2 rounded-full text-body-s whitespace-nowrap">
      Apply
    </Button>
  </div>

  <div className="md:hidden z-50" onClick={toggleMenu}>
    {menuOpen ? (
      <X className="text-white h-7 w-7 cursor-pointer" />
    ) : (
      <Menu className="text-white h-7 w-7 cursor-pointer" />
    )}
  </div>
</div>

          {menuOpen && (
            <div className="md:hidden mx-2 mb-2 rounded-2xl bg-black-900/60 backdrop-blur-md px-6 py-5 space-y-4">
              <ul className="flex flex-col space-y-4 font-sans font-medium text-body-s text-white">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <Link to={link.href} className="flex items-center gap-1 hover:text-primary" onClick={() => setMenuOpen(false)}>
                      {link.label}
                      {link.decorated && <ChevronDown className="w-3 h-3" />}
                    </Link>
                  </li>
                ))}
                <li>
                  <button onClick={() => { setShowDonateModal(true); setMenuOpen(false); }} className="hover:text-primary">
                    Donate
                  </button>
                </li>
                <li>
                  <Button variant="primary" className="w-full rounded-full text-body-s">
                    Apply
                  </Button>
                </li>
              </ul>
            </div>
          )}
        </Container>
      </nav>

      {showDonateModal && (
        <div className="fixed inset-0 z-50 bg-black-900/50 flex items-center justify-center" onClick={() => setShowDonateModal(false)}>
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-h3 font-bold mb-4">Support Zone01 Kisumu</h2>
            <p className="text-body-m text-black-900/70 mb-6">Donation page coming soon.</p>
            <Button variant="outline" onClick={() => setShowDonateModal(false)}>Close</Button>
          </div>
        </div>
      )}
    </>
  );
}