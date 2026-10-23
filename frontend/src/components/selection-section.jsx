// src/components/selection-section.jsx
import React from 'react';

/**
 * @typedef {Object} FunnelStep
 * @property {number} id - Unique identifier for the funnel stage
 * @property {string} number - Display formatted number
 * @property {number} rawNumber - Numeric integer value
 * @property {string} label - Complete text label
 * @property {string[]} labelLines - Array of lines for responsive multi-line layout
 * @property {string} color - Hex background color for the trapezoid
 * @property {string} polygon - SVG polygon coordinates in the 400x328 viewport
 * @property {{ top: string, height: string, numWidth: string, numPaddingRight: string, numFontSize: string, captionFontSize: string }} layout - Geometry & font sizing
 */

/**
 * @typedef {Object} EmploymentCardData
 * @property {string} title - Monospace card header
 * @property {string} metricValue - Headline percentage display
 * @property {number} metricRaw - Numeric percentage value
 * @property {string} metricLabel - Monospace label under percentage
 * @property {string} remainderLabel - Monospace label for the remaining percentage
 * @property {number} remainderRaw - Remainder percentage value
 * @property {string} bgColor - Card background color hex
 * @property {string} darkCircleColor - Base color for the large textured circle
 * @property {string} greyCircleColor - Base color for the small textured circle
 */

/**
 * @typedef {Object} SelectionData
 * @property {{ prefix: string, highlight: string, suffix: string }} heading
 * @property {string} funnelLabel
 * @property {FunnelStep[]} funnelSteps
 * @property {EmploymentCardData} employmentCard
 * @property {{ funnel: string, chart: string }} accessibility
 */

/**
 * Configurable data object powering the Selection, employment and Income section.
 * Edit figures or copy here without modifying the presentation markup.
 * @type {SelectionData}
 */
const SELECTION_DATA = {
  heading: {
    prefix: 'Selection, ',
    highlight: 'employment',
    suffix: ' and Income',
  },
  funnelLabel: 'Selection funnel',
  funnelSteps: [
    {
      id: 1,
      number: '28,000',
      rawNumber: 28000,
      label: 'Applications received',
      labelLines: ['Applications received'],
      color: '#1C74FA',
      polygon: '0,0 400,0 368,74 30,74',
      layout: {
        top: '0%',
        height: '22.56%',
        numWidth: '38.5%',
        numPaddingRight: '4.25%',
        numFontSize: 'clamp(15px, 5.375cqw, 21.5px)',
        captionFontSize: 'clamp(9.5px, 3.25cqw, 13px)',
      },
    },
    {
      id: 2,
      number: '4,200',
      rawNumber: 4200,
      label: 'Completed online cognitive games',
      labelLines: ['Completed online', 'cognitive games'],
      color: '#3080FA',
      polygon: '40,87 355,87 330,159 64,159',
      layout: {
        top: '26.52%',
        height: '21.95%',
        numWidth: '38.5%',
        numPaddingRight: '4.25%',
        numFontSize: 'clamp(15px, 5.375cqw, 21.5px)',
        captionFontSize: 'clamp(9px, 3.125cqw, 12.5px)',
      },
    },
    {
      id: 3,
      number: '420',
      rawNumber: 420,
      label: 'Invited to the four-week Piscine',
      labelLines: ['Invited to the', 'four-week Piscine'],
      color: '#5295FB',
      polygon: '75,171 322,171 302,248 93,248',
      layout: {
        top: '52.13%',
        height: '23.48%',
        numWidth: '40.5%',
        numPaddingRight: '3.8%',
        numFontSize: 'clamp(14px, 5.125cqw, 20.5px)',
        captionFontSize: 'clamp(9px, 3.125cqw, 12.5px)',
      },
    },
    {
      id: 4,
      number: '97',
      rawNumber: 97,
      label: 'Admitted to the cohort',
      labelLines: ['Admitted to', 'the cohort'],
      color: '#69A3FB',
      polygon: '104,260 295,260 280,328 117,328',
      layout: {
        top: '79.27%',
        height: '20.73%',
        numWidth: '42.5%',
        numPaddingRight: '3.5%',
        numFontSize: 'clamp(14px, 5.125cqw, 20.5px)',
        captionFontSize: 'clamp(9px, 3.125cqw, 12.5px)',
      },
    },
  ],
  employmentCard: {
    title: 'Training completion and employment',
    metricValue: '89%',
    metricRaw: 89,
    metricLabel: 'In paid work',
    remainderLabel: 'Are not yet in paid work',
    remainderRaw: 11,
    bgColor: '#3A86FA',
    darkCircleColor: '#004ABB',
    greyCircleColor: '#DFDFDF',
  },
  accessibility: {
    funnel:
      'Zone01 selection funnel: 28,000 applications received, 4,200 completed online cognitive games, 420 invited to the four-week Piscine, and 97 admitted to the cohort.',
    chart:
      'Training completion and employment outcomes: 89% in paid work, while 11% are not yet in paid work.',
  },
};

/**
 * SelectionSection
 * Exact recreation of the "Selection, employment and Income" section from selection.png:
 * - Pale periwinkle blue background (#BFD8FD)
 * - Heavy display heading with "employment" highlighted in primary blue
 * - Four-step selection funnel of lightening trapezoids with bold white numbers and monospace captions
 * - Training completion and employment rounded card with 89% stat, grain-textured cropped dark blue circle, and small light grey circle
 * - Responsive desktop layout with exact pixel precision (matching 962x619) and fluid mobile stack
 */
export default function SelectionSection() {
  const { heading, funnelLabel, funnelSteps, employmentCard, accessibility } = SELECTION_DATA;

  return (
    <section
      id="selection-income"
      aria-labelledby="selection-income-title"
      className="relative w-full bg-[#BFD8FD] overflow-hidden"
    >
      <style>{`
        /* Scoped styles ensuring 1:1 pixel match on desktop (>=900px) and fluid mobile stack (<900px) */
        @media (min-width: 900px) {
          .selection-wrapper {
            width: 962px !important;
            height: 619px !important;
            position: relative !important;
            margin: 0 auto !important;
            padding: 0 !important;
          }
          .selection-title-pos {
            position: absolute !important;
            left: 93px !important;
            top: 57px !important;
            font-size: 35.5px !important;
            line-height: 1 !important;
            text-align: left !important;
            margin-bottom: 0 !important;
            white-space: nowrap !important;
          }
          .selection-content-flow {
            display: block !important;
          }
          .selection-funnel-col {
            position: absolute !important;
            left: 38px !important;
            top: 153px !important;
            width: 400px !important;
            margin-bottom: 0 !important;
          }
          .selection-funnel-label-pos {
            position: absolute !important;
            left: 106px !important;
            top: 0 !important;
            margin-bottom: 0 !important;
          }
          .selection-funnel-svg-pos {
            position: absolute !important;
            top: 62px !important;
            left: 0 !important;
            width: 400px !important;
            height: 328px !important;
            aspect-ratio: auto !important;
          }
          .selection-card-col {
            position: absolute !important;
            left: 536px !important;
            top: 140px !important;
            width: 368px !important;
            height: 404px !important;
            aspect-ratio: auto !important;
          }
        }

        @media (max-width: 899px) {
          .selection-wrapper {
            width: 100%;
            padding: 48px 20px 64px;
            display: flex;
            flex-direction: column;
            align-items: center;
          }
          .selection-title-pos {
            font-size: clamp(24px, 6.5vw, 32px);
            line-height: 1.15;
            text-align: center;
            margin-bottom: 32px;
          }
          .selection-content-flow {
            display: flex;
            flex-direction: column;
            align-items: center;
            width: 100%;
          }
          .selection-funnel-col {
            width: 100%;
            max-width: 400px;
            display: flex;
            flex-direction: column;
            align-items: center;
            margin-bottom: 48px;
          }
          .selection-funnel-label-pos {
            margin-bottom: 24px;
            text-align: center;
          }
          .selection-funnel-svg-pos {
            position: relative;
            width: 100%;
            aspect-ratio: 400 / 328;
          }
          .selection-card-col {
            width: 100%;
            max-width: 368px;
            aspect-ratio: 368 / 404;
            position: relative;
          }
        }
      `}</style>

      {/* Lightweight SVG Filters for Grain Noise Textures */}
      <svg
        aria-hidden="true"
        className="sr-only absolute pointer-events-none"
        style={{ width: 0, height: 0, position: 'absolute' }}
      >
        <defs>
          {/* Dark circle stipple noise */}
          <filter id="selection-dark-grain" x="0%" y="0%" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.95" numOctaves="4" result="turb" />
            <feColorMatrix
              type="matrix"
              in="turb"
              values="
                0 0 0 0 0
                0 0 0 0 0.35
                0 0 0 0 0.90
                0 0 0 1 0"
              result="colored"
            />
          </filter>

          {/* Light grey circle monochrome grain */}
          <filter id="selection-grey-grain" x="0%" y="0%" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.95" numOctaves="4" result="turb" />
            <feColorMatrix
              type="matrix"
              in="turb"
              values="
                0.33 0.33 0.33 0 0.1
                0.33 0.33 0.33 0 0.1
                0.33 0.33 0.33 0 0.1
                0    0    0    1 0"
              result="mono"
            />
            <feComponentTransfer>
              <feFuncR type="linear" slope="1.8" intercept="-0.25" />
              <feFuncG type="linear" slope="1.8" intercept="-0.25" />
              <feFuncB type="linear" slope="1.8" intercept="-0.25" />
            </feComponentTransfer>
          </filter>
        </defs>
      </svg>

      {/* Main Container: Exact 962x619 desktop frame; Clean stacked mobile view */}
      <div className="selection-wrapper">
        {/* Heavy Black Display Heading */}
        <h2
          id="selection-income-title"
          className="selection-title-pos font-sans font-black text-black-900 tracking-[-0.015em]"
        >
          {heading.prefix}
          <span className="text-[#0063F9] font-black">{heading.highlight}</span>
          {heading.suffix}
        </h2>

        {/* Funnel and Card Wrapper */}
        <div className="selection-content-flow">
          {/* Left Column: Selection Funnel */}
          <div
            role="region"
            aria-label={accessibility.funnel}
            className="selection-funnel-col"
          >
            {/* Small Monospace Label */}
            <div className="selection-funnel-label-pos font-mono font-bold text-[#000000] text-[15.5px] tracking-[-0.01em] select-none">
              {funnelLabel}
            </div>

            {/* Trapezoid Funnel Wrapper */}
            <div
              className="selection-funnel-svg-pos"
              style={{ containerType: 'inline-size' }}
            >
              {/* SVG Funnel Geometry */}
              <svg
                viewBox="0 0 400 328"
                fill="none"
                preserveAspectRatio="none"
                aria-hidden="true"
                className="absolute inset-0 w-full h-full pointer-events-none"
              >
                {funnelSteps.map((step) => (
                  <polygon
                    key={step.id}
                    points={step.polygon}
                    fill={step.color}
                  />
                ))}
              </svg>

              {/* Accessible description for screen readers */}
              <ol className="sr-only">
                {funnelSteps.map((step) => (
                  <li key={step.id}>
                    {step.number} {step.label}
                  </li>
                ))}
              </ol>

              {/* Real Text Rows Positioned Over the Trapezoids */}
              {funnelSteps.map((step) => (
                <div
                  key={step.id}
                  aria-hidden="true"
                  className="absolute left-0 w-full flex items-center text-white select-none"
                  style={{
                    top: step.layout.top,
                    height: step.layout.height,
                  }}
                >
                  {/* Bold White Number Column: Right-Aligned */}
                  <div
                    className="font-sans font-extrabold text-white leading-none text-right"
                    style={{
                      width: step.layout.numWidth,
                      paddingRight: step.layout.numPaddingRight,
                      fontSize: step.layout.numFontSize,
                    }}
                  >
                    {step.number}
                  </div>

                  {/* Monospace Caption Column: Left-Aligned */}
                  <div
                    className="flex-1 font-mono font-medium text-white leading-[1.25]"
                    style={{
                      fontSize: step.layout.captionFontSize,
                    }}
                  >
                    {step.labelLines.map((line, lIdx) => (
                      <React.Fragment key={lIdx}>
                        {line}
                        {lIdx < step.labelLines.length - 1 && <br />}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Training Completion and Employment Card */}
          <div
            role="region"
            aria-label={accessibility.chart}
            className="selection-card-col bg-[#3A86FA] rounded-[41px] overflow-hidden"
            style={{ containerType: 'inline-size' }}
          >
            {/* Large Dark Blue Circle with Stipple Grain Noise: Cropped off Card's Right Edge */}
            <div
              aria-hidden="true"
              className="absolute rounded-full overflow-hidden pointer-events-none"
              style={{
                width: '72.28%', // 266px / 368px
                aspectRatio: '1 / 1',
                left: '55.7%', // 205px / 368px
                top: '21%', // 85px / 404px
                backgroundColor: employmentCard.darkCircleColor,
              }}
            >
              <div className="w-full h-full rounded-full relative bg-[#003E9E]">
                <div
                  className="absolute inset-0 rounded-full"
                  style={{ filter: 'url(#selection-dark-grain)' }}
                />
              </div>
            </div>

            {/* Small Light Grey Circle with Subtle Monochrome Grain: Lower Left Edge of Dark Circle */}
            <div
              aria-hidden="true"
              className="absolute rounded-full overflow-hidden pointer-events-none"
              style={{
                width: '17.39%', // 64px / 368px
                aspectRatio: '1 / 1',
                left: '78.4%', // 288.5px / 368px
                top: '69.3%', // 280px / 404px
                backgroundColor: employmentCard.greyCircleColor,
              }}
            >
              <div
                className="absolute inset-0 rounded-full opacity-85"
                style={{
                  filter: 'url(#selection-grey-grain)',
                  mixBlendMode: 'multiply',
                }}
              />
            </div>

            {/* White Monospace Title */}
            <div
              className="absolute left-0 right-0 text-center font-mono font-semibold text-white tracking-[0.01em] select-none"
              style={{
                top: '11.6%', // 47px / 404px
                fontSize: 'clamp(11px, 3.66cqw, 13.5px)',
              }}
            >
              {employmentCard.title}
            </div>

            {/* Thin Horizontal Rule */}
            <div
              aria-hidden="true"
              className="absolute bg-white/40 pointer-events-none"
              style={{
                top: '29%', // 117px / 404px
                left: '10.3%', // 38px / 368px
                width: '58.4%', // 215px / 368px
                height: '1px',
              }}
            />

            {/* 89% Metric & Monospace Caption */}
            <div
              className="absolute flex flex-col items-center text-center select-none"
              style={{
                top: '33.2%', // 134px / 404px
                left: '6%',
                width: '58.4%',
              }}
            >
              <span
                className="font-sans font-extrabold text-white leading-none tracking-[-0.01em]"
                style={{
                  fontSize: 'clamp(34px, 12.7cqw, 47px)',
                }}
              >
                {employmentCard.metricValue}
              </span>
              <span
                className="font-mono font-semibold text-white"
                style={{
                  fontSize: 'clamp(11px, 3.66cqw, 13.5px)',
                  marginTop: 'clamp(8px, 3.4cqw, 14px)',
                }}
              >
                {employmentCard.metricLabel}
              </span>
            </div>

            {/* Monospace Remainder Label near Bottom Left */}
            <div
              className="absolute font-mono font-medium text-white leading-[1.3] select-none"
              style={{
                left: '7.06%', // 26px / 368px
                top: '76%', // 307px / 404px
                fontSize: 'clamp(10px, 3.53cqw, 13px)',
              }}
            >
              {employmentCard.remainderLabel}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Named alias export for flexibility
export { SelectionSection as SelectionFunnel };
