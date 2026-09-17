// components/layout.jsx
import React from 'react';
import Navbar from './navbar.jsx';
import Footer from './footer.jsx';

export const Container = ({ children, className = "" }) => {
  return (
    <div className={`mx-[clamp(0.5rem,5vw,8rem)] ${className}`}>
      {children}
    </div>
  );
};

const Layout = ({ children }) => {
  return (
    <main className="w-full min-h-screen">
      <Navbar />
      {children}
      <Footer />
    </main>
  );
};

export default Layout;