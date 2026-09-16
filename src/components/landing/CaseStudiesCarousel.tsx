'use client';

import { useCallback, useRef, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion, useScroll, useMotionValueEvent } from 'framer-motion';
import { caseStudies, type CaseStudy } from '@/lib/caseStudies';

const AVATAR_GRADIENTS = [
  'radial-gradient(circle at 30% 30%, #b7a5ff, #4b3f7a 75%)',
  'radial-gradient(circle at 30% 30%, #ff9ecf, #7a3f63 75%)',
  'radial-gradient(circle at 30% 30%, #8fd9ff, #3f6b7a 75%)',
];

const N = caseStudies.length;
const SWIPE_THRESHOLD = 40;

// Swap in whichever YouTube video should sit behind the case studies.
const BACKGROUND_VIDEO_ID = 'LczM2U71iHw';

/**
 * The person's portrait, falling back to their initials on the gradient disc.
 * The fallback covers both the file not being there yet and a load failure, so
 * the carousel never shows a broken image.
 */
function Avatar({ study, index }: { study: CaseStudy; index: number }) {
  // The card this sits in is keyed by study id, so a new card remounts this
  // and each portrait gets its own attempt rather than inheriting the last
  // one's failure.
  const [failed, setFailed] = useState(false);

  const gradient = AVATAR_GRADIENTS[index % AVATAR_GRADIENTS.length];

  if (!study.avatar || failed) {
    return (
      // The em box has to sit on an element at the card's own font size: `width`
      // in em resolves against the element's own font-size, so scaling the
      // initials on this div would scale the disc with them.
      <div
        className="flex h-[10em] w-[10em] shrink-0 items-center justify-center rounded-full font-medium text-white"
        style={{ background: gradient }}
      >
        <span className="text-[1.5em]">{study.initials}</span>
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={study.avatar}
      alt={study.name}
      width={160}
      height={160}
      loading="lazy"
      onError={() => setFailed(true)}
      className="h-[10em] w-[10em] shrink-0 rounded-full object-cover"
      style={{ background: gradient }}
    />
  );
}

function ArrowIcon({ direction }: { direction: 'left' | 'right' }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d={direction === 'left' ? 'M15 6l-6 6 6 6' : 'M9 6l6 6-6 6'}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * The section is N viewport-heights tall with a sticky child pinned inside it,
 * and the visible card is read straight off how far the page has scrolled
 * through it. Nothing is intercepted: no wheel capture, no preventDefault, no
 * cooldowns and no timing heuristics deciding whether input counts as a new
 * gesture. Scrolling stays entirely native, so it behaves the same on a mouse
 * wheel, a trackpad, a touchscreen, the keyboard or a scrollbar drag, and the
 * page simply carries on into the next section once the last card is past.
 */
export default function CaseStudiesCarousel() {
  const wrapperRef = useRef<HTMLElement>(null);
  const [state, setState] = useState({ index: 0, direction: 0 });
  const reduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({ target: wrapperRef, offset: ['start start', 'end end'] });

  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    const next = Math.max(0, Math.min(N - 1, Math.round(p * (N - 1))));
    setState((prev) => (prev.index === next ? prev : { index: next, direction: next > prev.index ? 1 : -1 }));
  });

  // Each card owns one viewport-height of the section's scroll range.
  const scrollToCard = useCallback((i: number) => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    const top = wrapper.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: top + i * window.innerHeight, behavior: 'smooth' });
  }, []);

  const scrollToSection = useCallback((id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  // The arrows stay available on the first and last cards: instead of dead-ending,
  // they carry on out of the carousel into the adjacent manifesto section.
  const handlePrev = () => {
    if (state.index === 0) scrollToSection('manifesto-before-cases');
    else scrollToCard(state.index - 1);
  };

  const handleNext = () => {
    if (state.index === N - 1) scrollToSection('manifesto-continue');
    else scrollToCard(state.index + 1);
  };

  // Horizontal swipes step a card; vertical ones are left to the browser.
  const touchStart = useRef({ x: 0, y: 0 });

  const onTouchStart = (e: React.TouchEvent) => {
    touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    const dx = e.changedTouches[0].clientX - touchStart.current.x;
    const dy = e.changedTouches[0].clientY - touchStart.current.y;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > SWIPE_THRESHOLD) {
      const next = state.index + (dx < 0 ? 1 : -1);
      if (next >= 0 && next < N) scrollToCard(next);
    }
  };

  const study = caseStudies[state.index];
  const offset = reduceMotion ? 0 : 36;

  return (
    <section ref={wrapperRef} className="relative" style={{ height: `${N * 100}vh` }}>
      {/* One snap marker per card, so the page eases onto a card rather than
          resting between two of them. */}
      {caseStudies.map((s, i) => (
        <div key={s.id} data-snap="" className="absolute h-px w-px" style={{ top: `${i * 100}vh` }} aria-hidden />
      ))}

      <div
        className="cs-pin sticky top-0 flex h-screen flex-col items-center justify-center overflow-hidden px-6 pt-16 pb-32"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {/* Full-bleed video backdrop. The gradient underneath is what shows if the
            embed is blocked or slow, so it stands in for dark footage rather
            than for paper: the white scrim above lifts it to near-white anyway,
            and a light fallback would leave the white dots invisible and the
            section looking empty. */}
        <div className="absolute inset-0 -z-10 overflow-hidden" aria-hidden>
          <div
            className="absolute inset-0"
            style={{ background: 'radial-gradient(circle at 50% 35%, #3c3c44, #16161a 70%)' }}
          />
          {!reduceMotion && (
            <iframe
              title=""
              tabIndex={-1}
              aria-hidden
              allow="autoplay; encrypted-media"
              referrerPolicy="strict-origin-when-cross-origin"
              src={`https://www.youtube-nocookie.com/embed/${BACKGROUND_VIDEO_ID}?autoplay=1&mute=1&loop=1&playlist=${BACKGROUND_VIDEO_ID}&controls=0&modestbranding=1&playsinline=1&rel=0&disablekb=1&fs=0&iv_load_policy=3`}
              className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 border-0"
              style={{ width: 'max(100vw, 177.78vh)', height: 'max(100vh, 56.25vw)' }}
            />
          )}
          {/* White scrim over the footage, then a grid of white dots on top of
              it. Held just short of fully opaque on purpose: at a true 1.0 the
              video would be covered completely and the white dots would have
              nothing to read against. --cs-scrim in globals.css is the knob. */}
          <div className="absolute inset-0 backdrop-blur-[2px]" />
          <div className="cs-scrim absolute inset-0" />
          <div className="dot-grid absolute inset-0" />
        </div>

        <p className="eyebrow mb-8 flex items-center justify-center gap-3">
          <span>Case studies</span>
          <span aria-hidden className="text-[var(--line-strong)]">/</span>
          {/* Announced politely rather than on every scroll tick, so a screen
              reader hears the card it landed on, not each one passed. */}
          <span aria-live="polite">
            {state.index + 1} of {N}
          </span>
        </p>

        <div className="relative w-full max-w-xl">
          <button
            type="button"
            onClick={handlePrev}
            aria-label={state.index === 0 ? 'Back to the previous section' : 'Previous case study'}
            className="carousel-arrow absolute left-1 top-1/2 z-10 -translate-y-1/2 md:-left-5"
          >
            <ArrowIcon direction="left" />
          </button>

          {/* The quote and description are deliberately unclamped: a clamp
              here doesn't make the text fit, it only hides the part that
              doesn't. .cs-window sizes the box to the viewport instead. */}
          <div className="cs-window relative overflow-hidden">
            <AnimatePresence initial={false}>
              <motion.div
                key={study.id}
                initial={{ opacity: 0, x: offset * state.direction, filter: 'blur(8px)' }}
                animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, x: -offset * state.direction, filter: 'blur(8px)' }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                className="paper-card cs-card-scale absolute inset-0 flex flex-col items-center justify-center rounded-2xl p-[2.5em] text-center"
              >
                <Avatar study={study} index={state.index} />

                <p className="mt-[1.5em] shrink-0 text-[1.25em] leading-relaxed tracking-tight text-balance text-[var(--ink)]">
                  {study.isQuote ? `“${study.headline}”` : study.headline}
                </p>

                <p className="mt-[1.5em] shrink-0 text-[0.875em] font-medium text-[var(--ink)]">{study.name}</p>
                <p className="mt-[0.25em] shrink-0 text-[0.7em] tracking-wide text-[var(--ink-faint)]">{study.title}</p>

                <p className="mt-[1.5em] shrink-0 text-[0.75em] leading-relaxed text-[var(--ink-soft)]">
                  {study.description}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          <button
            type="button"
            onClick={handleNext}
            aria-label={state.index === N - 1 ? 'Continue to the next section' : 'Next case study'}
            className="carousel-arrow absolute right-1 top-1/2 z-10 -translate-y-1/2 md:-right-5"
          >
            <ArrowIcon direction="right" />
          </button>
        </div>

        <div className="mt-6 flex items-center gap-2">
          {caseStudies.map((s, i) => (
            <button
              key={s.id}
              type="button"
              onClick={() => scrollToCard(i)}
              aria-label={`Go to ${s.name}`}
              className="h-1.5 rounded-full transition-all"
              style={{
                width: i === state.index ? '20px' : '6px',
                background: i === state.index ? 'var(--ink)' : 'rgba(17, 17, 17, 0.2)',
              }}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={() => scrollToSection('manifesto-continue')}
          className="cs-skip-link mt-6 text-[10px] uppercase tracking-[0.25em] text-[var(--ink-faint)] transition-colors hover:text-[var(--ink)]"
        >
          Skip the case studies
        </button>

        {/* The same arrow the chapters carry, so leaving this section works the
            way it does everywhere else on the page. */}
        <button
          type="button"
          onClick={() => scrollToSection('manifesto-continue')}
          aria-label="Go to the next section"
          className="cursor-pointer p-3 text-[var(--ink)] transition-opacity hover:opacity-60"
        >
          <span aria-hidden className="animate-bounce-gentle block text-sm">
            ↓
          </span>
        </button>
      </div>
    </section>
  );
}
