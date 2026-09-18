import React, { useState, useEffect } from 'react';
import { FaWhatsapp } from 'react-icons/fa6';
import Button from './button.jsx';
import { Container } from './layout.jsx';
import heroImg1 from '../assets/hero.JPG';
import heroImg2 from '../assets/hero2.JPG';

const heroImages = [heroImg1, heroImg2];

const Hero = () => {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      className="relative w-full min-h-screen flex items-end overflow-hidden"
      style={{ filter: 'saturate(0.75)' }}
    >
      {heroImages.map((img, index) => (
        <div
          key={img}
          className="absolute inset-0 overflow-hidden transition-opacity duration-1000"
          style={{ opacity: index === currentImage ? 1 : 0 }}
        >
          <div
            className={`absolute inset-0 bg-cover bg-center ${
              index === currentImage ? 'animate-kenburns' : ''
            }`}
            style={{ backgroundImage: `url(${img})` }}
          />
        </div>
      ))}

      <div className="absolute inset-0 bg-black/30" />

      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to top, #003A93 0%, #003A93 34%, rgba(0,99,249,0.28) 59%, rgba(0,99,249,0) 100%)',
          opacity: 0.9,
          mixBlendMode: 'multiply',
        }}
      />

      <Container className="relative z-10 pb-20 md:pb-28 pt-40">
        <div className="max-w-3xl">
          <h1 className="font-sans font-extrabold text-white leading-tight text-hero-h1 mb-6">
            Talent is everywhere.<br />
            Opportunity is not.
          </h1>

          <p className="font-mono text-white/90 text-body-l mb-8 max-w-xl">
            We identify <span className="font-semibold">top-potential</span> talent — overlooked
            by traditional systems — and transform them into{' '}
            <span className="font-semibold">high-income, AI-ready software engineers</span> at scale
          </p>

          <div className="flex flex-wrap gap-4">
            <Button variant="primary">Apply now</Button>
            <Button variant="outline" className="!bg-transparent !border-white !text-white hover:!bg-white hover:!text-black-900">
              Hire Talent
            </Button>
          </div>
        </div>
      </Container>

      <a
        href="#"
        aria-label="Chat on WhatsApp"
        className="absolute bottom-8 right-8 z-10 w-12 h-12 flex items-center justify-center rounded-full bg-accent text-black-900 hover:opacity-90 transition-opacity"
      >
        <FaWhatsapp className="w-6 h-6" />
      </a>
    </section>
  );
};

export default Hero;