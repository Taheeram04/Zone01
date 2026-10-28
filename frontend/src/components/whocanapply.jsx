import { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import defaultImage from '../assets/whocanapply.webp';
import defaultImageSmall from '../assets/whocanapply-700.webp';

/**
 * TypewriterText Component
 * Types out characters sequentially when scrolled into view.
 * Includes a subtle blinking terminal cursor.
 */
export const TypewriterText = ({
  text,
  className = '',
  speed = 28,
  delay = 200,
  as: Tag = 'p',
  cursorColor = 'text-primary',
}) => {
  // Phones (and reduced-motion users) get the finished sentence immediately;
  // the typewriter uses dozens of timers and reflows, which is wasted work on
  // a small screen.
  const staticMode =
    typeof window !== 'undefined' &&
    window.matchMedia('(max-width: 767px), (prefers-reduced-motion: reduce)')
      .matches;
  const [displayedText, setDisplayedText] = useState(staticMode ? text : '');
  const [isTypingComplete, setIsTypingComplete] = useState(staticMode);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.4 });

  useEffect(() => {
    if (staticMode || !isInView) return;

    let timeout;
    let index = 0;

    const startTyping = () => {
      timeout = setInterval(() => {
        index++;
        if (index <= text.length) {
          setDisplayedText(text.slice(0, index));
        } else {
          clearInterval(timeout);
          setIsTypingComplete(true);
        }
      }, speed);
    };

    const delayTimeout = setTimeout(startTyping, delay);

    return () => {
      clearTimeout(delayTimeout);
      clearInterval(timeout);
    };
  }, [staticMode, isInView, text, speed, delay]);

  if (staticMode) {
    return (
      <Tag ref={ref} className={className}>
        <span>{text}</span>
      </Tag>
    );
  }

  return (
    <Tag ref={ref} className={className}>
      <span>{displayedText}</span>
      <span
        className={`inline-block font-mono font-normal ml-0.5 animate-pulse ${cursorColor} ${
          isTypingComplete ? 'opacity-0' : 'opacity-100'
        }`}
      >
        _
      </span>
    </Tag>
  );
};

/**
 * KineticHeading component
 * Provides a kinetic typography effect with slide-up reveal
 * using an overflow mask / clip-path and staggered character animation.
 * GPU-accelerated: utilizes transform (y) and opacity with clipPath.
 */
export const KineticHeading = ({
  text,
  children,
  as: Tag = 'h2',
  className = '',
  id,
  delay = 0,
  stagger = 0.035,
  style,
  ...props
}) => {
  const content = typeof children === 'string' ? children : text || '';
  const lines = content.split('\n');

  // On phones (and for reduced-motion users) render plain, immediately
  // readable text instead of one animated span per character. This removes
  // hundreds of animation nodes from the mobile main thread.
  const staticMode =
    typeof window !== 'undefined' &&
    window.matchMedia('(max-width: 767px), (prefers-reduced-motion: reduce)')
      .matches;

  if (staticMode) {
    return (
      <Tag id={id} className={className} style={style} {...props}>
        {lines.map((line, lineIdx) => (
          <span key={lineIdx} className="block">
            {line}
          </span>
        ))}
      </Tag>
    );
  }

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: stagger,
        delayChildren: delay,
      },
    },
  };

  const charVariants = {
    hidden: {
      y: '105%',
      opacity: 0,
      clipPath: 'polygon(0 100%, 100% 100%, 100% 100%, 0% 100%)',
    },
    visible: {
      y: '0%',
      opacity: 1,
      clipPath: 'polygon(0 0%, 100% 0%, 100% 100%, 0% 100%)',
      transition: {
        duration: 0.55,
        ease: [0.16, 1, 0.3, 1], // easeOutExpo
      },
    },
  };

  return (
    <Tag id={id} className={className} style={style} aria-label={content} {...props}>
      <motion.span
        className="inline-block w-full"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.35 }}
        variants={containerVariants}
        aria-hidden="true"
      >
        {lines.map((line, lineIdx) => (
          <span key={lineIdx} className="block">
            {line.split(' ').map((word, wordIdx) => (
              <span
                key={wordIdx}
                className="inline-block whitespace-nowrap overflow-hidden mr-[0.25em] last:mr-0 pb-1 -mb-1"
              >
                {word.split('').map((char, charIdx) => (
                  <motion.span
                    key={charIdx}
                    variants={charVariants}
                    className="inline-block will-change-transform"
                  >
                    {char}
                  </motion.span>
                ))}
              </span>
            ))}
          </span>
        ))}
      </motion.span>
    </Tag>
  );
};



const textContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const paragraphVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const imageWrapperVariants = {
  hidden: { opacity: 0, x: 40, scale: 0.96 },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      duration: 0.85,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const WhoCanApply = ({ image = defaultImage, className = '' }) => {
  return (
    <section
      data-nav-theme="light"
      className={`relative w-full bg-tint-blue overflow-hidden ${className}`}
      aria-labelledby="who-can-apply?-title"
    >
      {/* Top-left decorative organic circle blob matching design */}
      <motion.div
        initial={{ opacity: 0, scale: 0.75, y: -20 }}
        whileInView={{ opacity: 0.8, scale: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
        className="absolute -top-24 -left-24 w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 rounded-full bg-blob-blue/80 pointer-events-none z-0"
        aria-hidden="true"
      />

      {/* Bottom decorative circle blob intersecting photo curve */}
      <motion.div
        initial={{ opacity: 0, scale: 0.75, y: 20 }}
        whileInView={{ opacity: 0.9, scale: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 1.1, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        className="absolute -bottom-24 left-1/2 -translate-x-1/4 sm:-translate-x-12 md:translate-x-[-20%] w-60 h-60 sm:w-72 sm:h-72 md:w-80 md:h-80 rounded-full bg-blob-blue/90 pointer-events-none z-0"
        aria-hidden="true"
      />

      <div className="relative z-10 w-full flex flex-col md:flex-row items-center justify-between">
        {/* Left text container adhering to homepage standard horizontal container constraints */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={textContainerVariants}
          className="w-full md:w-[58%] lg:w-[62%] pt-12 pb-8 md:py-20 lg:py-24 pl-[clamp(1.25rem,5vw,8rem)] pr-[clamp(1.25rem,3vw,2rem)]"
        >
          <div className="max-w-none">
            <KineticHeading
              as="h2"
              id="who-can-apply-title"
              className="font-sans font-black text-black-900 whitespace-nowrap leading-tight tracking-tight"
              style={{
                fontFamily: 'var(--brand-font-sans)',
                fontSize: 'clamp(var(--brand-body-sm, 14px), 2.5vw, var(--brand-display-sm, 48px))',
                fontWeight: 'var(--brand-weight-black, 900)',
                color: 'var(--brand-black, #000000)',
                letterSpacing: '-0.02em',
                lineHeight: 1.1,
                marginBottom: 'clamp(12px, 1.5vw, 18px)',
              }}
              text="From overlooked potential to paid employment"
            />

            <div className="space-y-6 font-mono font-normal text-black-900 text-base sm:text-lg md:text-[18px] lg:text-[19px] leading-[1.8] tracking-normal max-w-2xl">
              <motion.p variants={paragraphVariants}>
                The Zone01 Kisumu digital training is open to anyone over 18 years
                old.{' '}
                <span className="font-bold text-primary">No prior programming experience</span> or{' '}
                <span className="font-bold text-primary">academic qualifications</span> are required to apply.
              </motion.p>

              <motion.p variants={paragraphVariants}>
                Diversity and inclusion are key elements of Zone01 Kisumu&apos;s mission.
                We therefore particularly encourage{' '}
                women, refugees, ethnic minorities and people from disadvantaged
                backgrounds to apply.
              </motion.p>
            </div>
          </div>
        </motion.div>

        {/* Right photo container with prominent semicircle curved left boundary */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={imageWrapperVariants}
          className="w-full md:w-[42%] lg:w-[38%] self-stretch flex items-center justify-end px-[clamp(1.25rem,5vw,8rem)] pb-10 md:px-0 md:pb-0"
        >
          <motion.div
            whileHover={{ scale: 1.015 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="w-full h-full min-h-[260px] sm:min-h-[380px] md:min-h-[460px] lg:min-h-[520px] rounded-3xl md:rounded-r-none md:rounded-l-full overflow-hidden bg-slate-200 shadow-xl"
          >
            <motion.img
              src={image}
              srcSet={
                image === defaultImage
                  ? `${defaultImageSmall} 700w, ${defaultImage} 1280w`
                  : undefined
              }
              sizes="(min-width: 768px) 45vw, 100vw"
              alt="Students collaborating at Zone01 Kisumu"
              className="w-full h-full object-cover object-center"
              loading="lazy"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default WhoCanApply;
