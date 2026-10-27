// components/impact/Carousel.jsx
import { useState } from 'react';

export default function Carousel({
  items = [],
  type = 'startup', // 'startup' | 'story'
  itemWidth = 340,
  gap = 24,
  step = 364,
}) {
  const [index, setIndex] = useState(0);
  const [openIndex, setOpenIndex] = useState(-1);

  const count = items.length;
  const maxOffset = Math.max(0, count - 3);
  const canPrev = index > 0;
  const canNext = index < maxOffset;

  const rangeStart = index + 1;
  const rangeEnd = Math.min(count, index + 3);
  const pad = (n) => String(n).padStart(2, '0');
  const range = `${pad(rangeStart)}-${pad(rangeEnd)} / ${pad(count)}`;

  const shift = -index * step;

  const handlePrev = () => {
    if (canPrev) setIndex((i) => Math.max(0, i - 1));
  };

  const handleNext = () => {
    if (canNext) setIndex((i) => Math.min(maxOffset, i + 1));
  };

  const openItem = openIndex >= 0 ? items[openIndex] : items[0];

  return (
    <>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div style={{ flex: '1 1 520px', minWidth: 0 }}>
          <div className="impact-mono" style={{ color: '#0063F9' }}>{type === 'startup' ? 'Startups' : 'Impact Stories'}</div>
          <h2 style={{ margin: '20px 0 0', fontWeight: 900, fontSize: 'clamp(40px, 5vw, 72px)', lineHeight: 1, letterSpacing: '-.03em', maxWidth: 900 }}>
            {type === 'startup' ? 'Companies built by Zone01 Kisumu talent.' : 'Stories from the first cohort.'}
          </h2>
        </div>
        <div className="impact-cnav" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span className="impact-mono" style={{ color: '#0A3A9C' }}>{range}</span>
          <button className="impact-cbtn" aria-label={type === 'startup' ? 'Previous startups' : 'Previous stories'} onClick={handlePrev} style={{ opacity: canPrev ? 1 : 0.35 }} disabled={!canPrev}>
            &#8592;
          </button>
          <button className="impact-cbtn" aria-label={type === 'startup' ? 'Next startups' : 'Next stories'} onClick={handleNext} style={{ opacity: canNext ? 1 : 0.35 }} disabled={!canNext}>
            &#8594;
          </button>
        </div>
      </div>

      <div className="impact-cwrap" style={{ marginTop: '48px' }}>
        <div className="impact-ctrack" style={{ transform: `translateX(${shift}px)` }}>
          {items.map((item, i) => {
            if (type === 'startup') {
              return (
                <article
                  key={item.id || i}
                  style={{
                    flex: `0 0 ${itemWidth}px`,
                    width: `${itemWidth}px`,
                    height: '440px',
                    boxSizing: 'border-box',
                    background: '#E8F1FF',
                    borderRadius: '6px',
                    border: `2px solid ${openIndex === i ? '#0063F9' : 'transparent'}`,
                    padding: '28px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
                    <div className="impact-ph" style={{ width: '56px', height: '56px', borderRadius: '6px', padding: 0, fontSize: '10px' }}>
                      <span className="impact-mono" style={{ fontSize: '10px' }}>Logo</span>
                    </div>
                    <span className="impact-mono" style={{ color: '#0A3A9C' }}>{item.sector}</span>
                  </div>
                  <div style={{ fontWeight: 900, fontSize: '26px', lineHeight: 1.1, letterSpacing: '-.02em' }}>{item.name}</div>
                  <p style={{ margin: 0, fontSize: '16px', lineHeight: 1.55, color: '#35507F' }}>{item.blurb}</p>
                  <div style={{ display: 'flex', gap: '24px', marginTop: 'auto', borderTop: '1.5px solid #0A3A9C', paddingTop: '14px' }}>
                    <div>
                      <div className="impact-mono" style={{ fontSize: '10px', color: '#35507F' }}>Founded</div>
                      <div style={{ fontWeight: 800, fontSize: '16px', marginTop: '4px' }}>{item.founded}</div>
                    </div>
                    <div>
                      <div className="impact-mono" style={{ fontSize: '10px', color: '#35507F' }}>Cohort</div>
                      <div style={{ fontWeight: 800, fontSize: '16px', marginTop: '4px' }}>{item.cohort}</div>
                    </div>
                  </div>
                  <button onClick={() => setOpenIndex(i)} style={{ alignSelf: 'flex-start', background: '#0063F9', color: '#ffffff', border: 0, borderRadius: '6px', padding: '0 22px', minHeight: '46px', fontWeight: 700, fontSize: '14px', cursor: 'pointer' }}>Read more &rarr;</button>
                </article>
              );
            } else {
              return (
                <article
                  key={item.id || i}
                  style={{
                    flex: `0 0 ${itemWidth}px`,
                    width: `${itemWidth}px`,
                    height: '440px',
                    boxSizing: 'border-box',
                    background: '#E8F1FF',
                    borderRadius: '6px',
                    border: `2px solid ${openIndex === i ? '#0063F9' : 'transparent'}`,
                    padding: '28px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
                    <span className="impact-mono" style={{ color: '#0A3A9C' }}>{item.tag}</span>
                  </div>
                  <div style={{ fontWeight: 900, fontSize: '26px', lineHeight: 1.1, letterSpacing: '-.02em' }}>{item.headline}</div>
                  <p style={{ margin: 0, fontSize: '16px', lineHeight: 1.55, color: '#35507F' }}>{item.blurb}</p>
                  <div style={{ marginTop: 'auto', borderTop: '1.5px solid #0A3A9C', paddingTop: '14px' }}>
                    <div className="impact-mono" style={{ fontSize: '10px', color: '#35507F' }}>Who</div>
                    <div style={{ fontWeight: 800, fontSize: '16px', marginTop: '4px' }}>{item.who}</div>
                  </div>
                  <button onClick={() => setOpenIndex(i)} style={{ alignSelf: 'flex-start', background: '#0063F9', color: '#ffffff', border: 0, borderRadius: '6px', padding: '0 22px', minHeight: '46px', fontWeight: 700, fontSize: '14px', cursor: 'pointer' }}>Read more &rarr;</button>
                </article>
              );
            }
          })}
        </div>
      </div>

      {openIndex >= 0 && (
        <div style={{ marginTop: '40px', background: '#0A3A9C', color: '#ffffff', borderRadius: '6px', overflow: 'hidden', display: 'flex', flexWrap: 'wrap' }} id={type === 'startup' ? 'stories' : undefined}>
          <div className="impact-ph" style={{ flex: '1 1 320px', minHeight: '380px', border: 0, borderRadius: 0 }}>
            <span className="impact-mono">Photo: {type === 'startup' ? openItem.name : openItem.who}</span>
          </div>
          <div style={{ flex: '1 1 420px', minWidth: 0, padding: 'clamp(28px,5vw,64px)', display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px' }}>
              <div>
                <div className="impact-mono" style={{ color: '#BBD6FF' }}>{type === 'startup' ? 'Startup detail' : 'Story detail'}</div>
                <div style={{ fontWeight: 900, fontSize: 'clamp(28px,4vw,48px)', lineHeight: 1.05, letterSpacing: '-.02em', marginTop: '12px' }}>
                  {type === 'startup' ? openItem.name : openItem.headline}
                </div>
              </div>
              <button onClick={() => setOpenIndex(-1)} style={{ background: 'transparent', color: '#ffffff', border: '1.5px solid rgba(255,255,255,.7)', borderRadius: '6px', padding: '10px 18px', fontWeight: 700, cursor: 'pointer' }}>Close</button>
            </div>
            {type === 'startup' ? (
              <>
                <p style={{ margin: 0, fontSize: '18px', lineHeight: 1.6 }}>{openItem.blurb}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '18px 28px' }}>
                  <div><div className="impact-mono" style={{ fontSize: '10px', color: '#BBD6FF' }}>Sector</div><div style={{ fontWeight: 700, marginTop: '4px' }}>{openItem.sector}</div></div>
                  <div><div className="impact-mono" style={{ fontSize: '10px', color: '#BBD6FF' }}>Founded</div><div style={{ fontWeight: 700, marginTop: '4px' }}>{openItem.founded}</div></div>
                  <div><div className="impact-mono" style={{ fontSize: '10px', color: '#BBD6FF' }}>Cohort</div><div style={{ fontWeight: 700, marginTop: '4px' }}>{openItem.cohort}</div></div>
                </div>
              </>
            ) : (
              <>
                <p style={{ margin: 0, fontSize: '18px', lineHeight: 1.6 }}>{openItem.blurb}</p>
                <div><div className="impact-mono" style={{ fontSize: '10px', color: '#BBD6FF' }}>Who</div><div style={{ fontWeight: 700, marginTop: '4px' }}>{openItem.who}</div></div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
