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

const PAGE_SIZE = 6;

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
      className="bg-campus-bg py-20"
    >
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <p className="font-mono text-body-s uppercase tracking-[0.25em] text-primary">
            Skill sets
          </p>
          <h2 className="mt-3 font-sans text-[clamp(1.9rem,4vw,3rem)] font-black tracking-tight text-secondary">
            Technologies
          </h2>
          <p className="mt-4 font-sans text-body-l text-black-900/70">
            Showcasing talent skill sets across:
          </p>
        </div>

        {categories.map((category) => {
          const shown = visible[category.key] || PAGE_SIZE;
          const hasMore = category.items.length > shown;

          return (
            <div key={category.key} className="mt-14">
              <h3 className="text-center font-sans text-xl font-bold text-secondary">
                {category.title}
              </h3>

              <ul className="mt-8 grid grid-cols-1 justify-items-center gap-4 sm:grid-cols-2 md:grid-cols-3">
                {category.items.slice(0, shown).map((technology) => (
                  <li key={technology.id || technology.name} className="w-full">
                    <div className="flex w-full items-center justify-center gap-3 rounded-2xl border border-secondary/10 bg-white px-5 py-6 font-sans text-body-l font-medium text-black-900/80 shadow-sm">
                      {technology.image ? (
                        <img
                          src={technology.image}
                          alt=""
                          aria-hidden="true"
                          className="h-6 w-6"
                        />
                      ) : (
                        <Code2 className="h-5 w-5 text-primary" aria-hidden="true" />
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
                    className="rounded-full px-10"
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
