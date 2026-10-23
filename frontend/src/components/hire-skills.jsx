// components/hire-skills.jsx
import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { Container } from './layout.jsx';
import { SKILL_AREAS, TYPICAL_ROLES } from './hire.data.js';

/**
 * "Skills and typical roles" — an FAQ-style accordion of disciplines. Each
 * description opens directly beneath its question: hovering previews an
 * answer (mouse only), clicking or pressing Enter pins it open. Mirrors the
 * general FAQs interaction so the page behaves consistently.
 */
const HireSkills = () => {
  const [openIndex, setOpenIndex] = useState(0);
  // Remembers whether the current answer was opened by hovering, so lifting
  // the pointer only closes answers the pointer itself revealed.
  const hoverIndexRef = useRef(null);

  const handlePointerEnter = (index) => (event) => {
    if (event.pointerType && event.pointerType !== 'mouse') return;
    hoverIndexRef.current = index;
    setOpenIndex(index);
  };

  const handlePointerLeave = (event) => {
    if (event.pointerType && event.pointerType !== 'mouse') return;
    const hovered = hoverIndexRef.current;
    hoverIndexRef.current = null;
    setOpenIndex((current) => (current === hovered ? -1 : current));
  };

  const handleToggle = (index) => () => {
    hoverIndexRef.current = null;
    setOpenIndex((current) => (current === index ? -1 : index));
  };

  return (
    <section id="skills" data-nav-theme="light" className="bg-campus-bg pb-10 pt-10 md:pb-14 md:pt-14">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-sans text-[1.875rem] font-black leading-[1.1] tracking-[-0.02em] text-secondary sm:text-section-headline">
            Skills and typical roles.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl font-sans text-base leading-relaxed text-black-900/65">
            Every pathway ends in shipped, reviewed work. This is the depth your
            team can hire against today.
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-4xl border-t-2 border-primary bg-white px-5 sm:px-8">
          {SKILL_AREAS.map((area, index) => {
            const open = openIndex === index;

            return (
              <article
                key={area.title}
                className="border-b border-secondary/15 last:border-b-0"
                onPointerEnter={handlePointerEnter(index)}
                onPointerLeave={handlePointerLeave}
              >
                <h3>
                  <button
                    type="button"
                    id={`skill-question-${index}`}
                    aria-expanded={open}
                    aria-controls={`skill-answer-${index}`}
                    onClick={handleToggle(index)}
                    className="group flex w-full items-center justify-between gap-5 py-5 text-left transition-colors hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                  >
                    <span
                      className={`font-sans text-lg font-bold leading-snug transition-colors ${
                        open ? 'text-primary' : 'text-secondary group-hover:text-primary'
                      }`}
                    >
                      {area.title}
                    </span>
                    <span
                      className={`flex h-8 w-8 flex-none items-center justify-center rounded-full border transition-all duration-300 ${
                        open
                          ? 'rotate-180 border-primary bg-primary text-white'
                          : 'border-secondary/20 text-secondary group-hover:border-primary/50 group-hover:text-primary'
                      }`}
                    >
                      <ChevronDown className="h-4 w-4" aria-hidden="true" />
                    </span>
                  </button>
                </h3>

                <div
                  id={`skill-answer-${index}`}
                  role="region"
                  aria-labelledby={`skill-question-${index}`}
                  className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                    open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                  }`}
                >
                  <div className="overflow-hidden">
                    <p
                      className={`pb-6 pr-12 font-sans text-body-m leading-relaxed text-black-900/65 transition-opacity duration-300 ${
                        open ? 'opacity-100' : 'opacity-0'
                      }`}
                    >
                      {area.body}
                    </p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mt-12 bg-powder-blue p-7 sm:p-9"
        >
          <div className="grid gap-9 lg:grid-cols-[1.15fr_1.25fr] lg:gap-12">
            <div>
              <h3 className="font-sans text-cta-headline font-black leading-tight tracking-tight text-secondary">
                Where our talent lands.
              </h3>
              <p className="mt-4 max-w-lg font-sans text-body-m leading-relaxed text-secondary/65">
                Most graduates are ready for junior to mid-level roles, with
                unusually strong self-learning and collaboration habits from the
                peer-to-peer model.
              </p>
              <a
                href="#request"
                className="group mt-6 inline-flex items-center gap-2 font-sans text-body-m font-semibold text-primary transition-colors hover:text-secondary"
              >
                Tell us the role you are hiring
                <ArrowRight
                  className="h-4 w-4 transition-transform group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </a>
            </div>

            <ul className="grid gap-x-8 gap-y-3 sm:grid-cols-2">
              {TYPICAL_ROLES.map((role) => (
                <li key={role} className="flex items-start gap-3">
                  <span
                    aria-hidden="true"
                    className="mt-2.5 h-px w-3 flex-none bg-primary/50"
                  />
                  <span className="font-sans text-body-m leading-snug text-secondary/80">
                    {role}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </Container>
    </section>
  );
};

export default HireSkills;
