'use client';

import { useCallback, useRef, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion, useScroll, useMotionValueEvent } from 'framer-motion';
import { caseStudies } from '@/lib/caseStudies';

const AVATAR_GRADIENTS = [
  'radial-gradient(circle at 30% 30%, #b7a5ff, #4b3f7a 75%)',
  'radial-gradient(circle at 30% 30%, #ff9ecf, #7a3f63 75%)',
  'radial-gradient(circle at 30% 30%, #8fd9ff, #3f6b7a 75%)',
];

const N = caseStudies.length;
const SWIPE_THRESHOLD = 40;

// Swap in whichever YouTube video should sit behind the case studies.
const BACKGROUND_VIDEO_ID = 'ZToicYcHIOU';

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
        className="sticky top-0 flex h-screen flex-col items-center justify-center overflow-hidden px-6 pt-16 pb-32"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {/* Full-bleed video backdrop. The gradient underneath is what shows if the
            embed is blocked or slow, so the section still reads as designed. */}
        <div className="absolute inset-0 -z-10 overflow-hidden" aria-hidden>
          <div
            className="absolute inset-0"
            style={{ background: 'radial-gradient(circle at 50% 40%, #2a2145, #120f1e 70%)' }}
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
          {/* Overlay: darkens and cools the footage so the cards stay readable. */}
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(to bottom, rgba(18,15,30,0.92), rgba(18,15,30,0.72) 35%, rgba(18,15,30,0.72) 65%, rgba(18,15,30,0.95))',
            }}
          />
          <div className="absolute inset-0 backdrop-blur-[2px]" />
        </div>

        <p className="mb-8 text-xs uppercase tracking-[0.3em] text-[var(--dream-muted)]">Case studies</p>

        <div className="relative w-full max-w-xl">
          <button
            type="button"
            onClick={handlePrev}
            aria-label={state.index === 0 ? 'Back to the previous section' : 'Previous case study'}
            className="carousel-arrow absolute left-1 top-1/2 z-10 -translate-y-1/2 md:-left-5"
          >
            <ArrowIcon direction="left" />
          </button>

          <div className="relative h-[32rem] overflow-hidden">
            <AnimatePresence initial={false}>
              <motion.div
                key={study.id}
                initial={{ opacity: 0, x: offset * state.direction, filter: 'blur(8px)' }}
                animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, x: -offset * state.direction, filter: 'blur(8px)' }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                className="waitlist-glass absolute inset-0 flex flex-col items-center justify-center rounded-3xl p-8 text-center md:p-10"
              >
                <div
                  className="flex h-16 w-16 items-center justify-center rounded-full text-lg font-medium text-white"
                  style={{ background: AVATAR_GRADIENTS[state.index % AVATAR_GRADIENTS.length] }}
                >
                  {study.initials}
                </div>

                <p className="mt-6 line-clamp-5 font-serif text-2xl italic leading-snug text-balance">
                  {study.isQuote ? `“${study.headline}”` : study.headline}
                </p>

                <p className="mt-6 text-sm font-medium">{study.name}</p>
                <p className="text-xs text-[var(--dream-muted)]">{study.title}</p>

                <p className="mt-6 line-clamp-3 text-sm leading-relaxed text-[var(--dream-muted)]">
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
                background: i === state.index ? 'var(--dream-primary)' : 'rgba(168, 156, 196, 0.35)',
              }}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={() => scrollToSection('manifesto-continue')}
          className="mt-6 text-xs uppercase tracking-[0.2em] text-[var(--dream-muted)] opacity-40 transition-opacity hover:opacity-80"
        >
          Skip the case studies
        </button>
      </div>
    </section>
  );
}
