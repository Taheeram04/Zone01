// components/layout.jsx
import { motion } from 'framer-motion';
import { FaWhatsapp } from 'react-icons/fa6';
import Navbar from './navbar.jsx';
import Footer from './footer.jsx';
import ScrollToTop from './scroll-to-top.jsx';

export const Container = ({ children, className = "" }) => {
  return (
    <div className={`mx-[clamp(1.25rem,5vw,8rem)] ${className}`}>
      {children}
    </div>
  );
};

const Layout = ({ children }) => {
  return (
    <main className="w-full min-h-screen overflow-x-clip">
      <Navbar />
      {children}
      <Footer />

      <ScrollToTop />

      {/* Global fixed WhatsApp button hovering across all sections */}
      <motion.a
        href="https://wa.me/"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        whileHover={{ scale: 1.1, rotate: 4 }}
        whileTap={{ scale: 0.92 }}
        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
        className="fixed bottom-[calc(1.5rem_+_env(safe-area-inset-bottom))] right-[calc(1.5rem_+_env(safe-area-inset-right))] md:bottom-[calc(2rem_+_env(safe-area-inset-bottom))] md:right-[calc(2rem_+_env(safe-area-inset-right))] z-50 w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_4px_20px_rgba(37,211,102,0.4)] hover:bg-[#20ba5a] hover:shadow-[0_6px_25px_rgba(37,211,102,0.6)] transition-all duration-200"
      >
        <FaWhatsapp className="w-6 h-6 sm:w-7 sm:h-7" />
      </motion.a>
    </main>
  );
};

export default Layout;