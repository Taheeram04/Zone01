// components/ImpactPhotoBand.jsx
import bandPhoto from '../assets/placeholders/band-photo.svg';
import { Container } from './layout.jsx';

export default function ImpactPhotoBand() {
  return (
    <section className="relative w-full h-[320px] sm:h-[380px] lg:h-[460px] overflow-hidden">
      <img
        src={bandPhoto}
        alt="Impact photo band"
        className="absolute inset-0 w-full h-full object-cover"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/70" />
      <Container className="relative h-full flex items-center">
        <h2 className="font-sans font-black text-white tracking-tight leading-tight text-[clamp(2rem,6vw,4.5rem)] max-w-4xl">
          Talent is everywhere. <span className="text-white/90">Opportunity is not.</span>
        </h2>
      </Container>
    </section>
  );
}
