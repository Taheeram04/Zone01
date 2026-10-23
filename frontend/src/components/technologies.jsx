// components/technologies.jsx
import { useState } from 'react';
import { Code2 } from 'lucide-react';
import Button from './button.jsx';
import { Container } from './layout.jsx';

const buildCategories = (groups = {}) =>
  [
    {
      key: 'languages',
      title: 'Programming Languages',
      items: groups.languages || [],
    },
    {
      key: 'frameworks',
      title: 'Frameworks and Libraries',
      items: groups.frameworks || [],
    },
    {
      key: 'specializations',
      title: 'Specializations',
      items: groups.specializations || [],
    },
  ].filter((category) => category.items.length > 0);

const PAGE_SIZE = 12;

/**
 * Technologies grid driven by the API's grouped services. Each technology
 * links to its service detail page, matching the original ServiceTemplate flow.
 */
const Technologies = ({ groups }) => {
  const [visible, setVisible] = useState({});
  const categories = buildCategories(groups);

  if (!categories.length) return null;

  return (
    <section
      id="technologies"
      data-nav-theme="light"
      className="bg-white pb-12 pt-10 md:pb-16 md:pt-14"
    >
      <Container>
        <div className="mx-auto max-w-4xl text-center">
          <p className="font-mono text-body-s uppercase tracking-[0.25em] text-primary">
            The toolbox
          </p>
          <h2 className="mt-3 text-balance font-sans text-[1.875rem] font-black tracking-tight text-secondary sm:text-section-headline">
            Technologies our talent ships with
          </h2>
          <p className="mt-4 font-sans text-base text-black-900/70">
            Live from the Zone01 service catalogue — the languages, frameworks
            and specialisations behind the work.
          </p>
        </div>

        {categories.map((category) => {
          const shown = visible[category.key] || PAGE_SIZE;
          const hasMore = category.items.length > shown;

          return (
            <div key={category.key} className="mt-14">
              <h3 className="text-center font-sans text-lg font-bold text-secondary">
                {category.title}
              </h3>

              <ul className="mx-auto mt-7 flex max-w-4xl flex-wrap justify-center gap-3">
                {category.items.slice(0, shown).map((technology) => (
                  <li key={technology.id || technology.name}>
                    <div className="flex items-center gap-2.5 rounded-full border border-secondary/10 bg-white px-5 py-2.5 font-sans text-body-m font-medium text-black-900/80 shadow-sm transition-colors hover:border-primary/40">
                      {technology.image ? (
                        <img
                          src={technology.image}
                          alt=""
                          aria-hidden="true"
                          className="h-5 w-5"
                        />
                      ) : (
                        <Code2 className="h-4 w-4 text-primary" aria-hidden="true" />
                      )}
                      {technology.name}
                    </div>
                  </li>
                ))}
              </ul>

              {hasMore && (
                <div className="mt-8 flex justify-center">
                  <Button
                    variant="outline"
                    onClick={() =>
                      setVisible((current) => ({
                        ...current,
                        [category.key]: shown + PAGE_SIZE,
                      }))
                    }
                    className="rounded-full px-10 !font-sans"
                  >
                    Show more
                  </Button>
                </div>
              )}
            </div>
          );
        })}
      </Container>
    </section>
  );
};

export default Technologies;
