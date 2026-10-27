// components/hire-faq.jsx
import { useRef, useState } from 'react';
import { Container } from './layout.jsx';
import { HIRE_EMAIL } from '../constants.js';
import { EMPLOYER_FAQS } from './hire.data.js';

/**
 * Employer FAQ. Hovering previews an answer (mouse only); clicking or pressing
 * Enter pins it open. The answer slides out from under the question with the
 * same 0fr → 1fr grid transition, plus/minus icon swap and fade used by the
 * general FAQs.
 */
const HireFaq = () => {
  const [openIndex, setOpenIndex] = useState(0);
  // Tracks answers opened by hovering so lifting the pointer only closes the
  // ones the pointer itself revealed — clicked answers stay pinned.
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
    <section id="faq" data-nav-theme="light" className="bg-white pb-10 pt-6 md:pb-14 md:pt-8">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <h2 className="font-sans text-[1.875rem] font-black leading-tight tracking-tight text-secondary sm:text-section-headline">
              Employer questions, answered.
            </h2>
            <p className="mt-4 max-w-sm font-sans text-base leading-relaxed text-black-900/70 sm:text-body-l">
              Something more specific? The talent team replies to employer
              enquiries within five working days.
            </p>
            <a
              href={`mailto:${HIRE_EMAIL}`}
              className="mt-5 inline-flex items-center gap-2 font-mono text-body-m font-medium text-primary underline-offset-4 hover:underline"
            >
              {HIRE_EMAIL}
            </a>
          </div>

          <ul className="divide-y divide-secondary/10 border-y border-secondary/10">
            {EMPLOYER_FAQS.map((faq, index) => {
              const isOpen = openIndex === index;
              const panelId = `employer-faq-panel-${index}`;
              const buttonId = `employer-faq-button-${index}`;

              return (
                <li
                  key={faq.q}
                  onPointerEnter={handlePointerEnter(index)}
                  onPointerLeave={handlePointerLeave}
                >
                  <h3>
                    <button
                      type="button"
                      id={buttonId}
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={handleToggle(index)}
                      className="group flex w-full items-start justify-between gap-5 py-5 text-left transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                    >
                      <span
                        className={`font-sans text-base font-bold transition-colors duration-200 sm:text-lg ${
                          isOpen
                            ? 'text-primary'
                            : 'text-secondary group-hover:text-primary'
                        }`}
                      >
                        {faq.q}
                      </span>

                      <span
                        aria-hidden="true"
                        className={`mt-0.5 flex h-7 w-7 flex-none items-center justify-center rounded-full border transition-all duration-300 ${
                          isOpen
                            ? 'rotate-180 border-primary bg-primary'
                            : 'border-primary/20 bg-tint-blue'
                        }`}
                      >
                        <span className="relative h-4 w-4">
                          <span
                            className={`absolute left-1/2 top-1/2 h-0.5 w-3 -translate-x-1/2 -translate-y-1/2 rounded-sm transition-colors duration-300 ${
                              isOpen ? 'bg-white' : 'bg-primary'
                            }`}
                          />
                          <span
                            className={`absolute left-1/2 top-1/2 h-3 w-0.5 -translate-x-1/2 -translate-y-1/2 rounded-sm transition-all duration-300 ${
                              isOpen ? 'scale-y-0 bg-white' : 'bg-primary'
                            }`}
                          />
                        </span>
                      </span>
                    </button>
                  </h3>

                  <div
                    id={panelId}
                    role="region"
                    aria-labelledby={buttonId}
                    className={`grid transition-[grid-template-rows] duration-[420ms] ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none ${
                      isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                    }`}
                  >
                    <div
                      className={`min-h-0 overflow-hidden transition-[visibility] motion-reduce:transition-none ${
                        isOpen
                          ? 'visible delay-0'
                          : 'invisible delay-[420ms]'
                      }`}
                    >
                      <div
                        className={`pb-6 pr-10 transition-[opacity,transform] duration-[350ms] ease-out motion-reduce:transition-none ${
                          isOpen
                            ? 'translate-y-0 opacity-100'
                            : '-translate-y-1 opacity-0'
                        }`}
                      >
                        <p className="font-sans text-body-m leading-relaxed text-black-900/65">
                          {faq.a}
                        </p>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </Container>
    </section>
  );
};

export default HireFaq;
