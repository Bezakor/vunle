'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { caseStudies } from '@/lib/caseStudies';

const AVATAR_GRADIENTS = [
  'radial-gradient(circle at 30% 30%, #b7a5ff, #4b3f7a 75%)',
  'radial-gradient(circle at 30% 30%, #ff9ecf, #7a3f63 75%)',
  'radial-gradient(circle at 30% 30%, #8fd9ff, #3f6b7a 75%)',
];

const N = caseStudies.length;
const ACTIVE_THRESHOLD = 0.6;
const SWIPE_THRESHOLD = 40;
// A single trackpad flick fires a long tail of wheel events as it decelerates.
// Treat any run of events less than this far apart as one gesture — only its
// first event may trigger a step — so one flick never advances multiple cards.
const GESTURE_GAP_MS = 140;
// Floor between two actual steps (new gestures included), long enough for the
// card's own crossfade to finish before another one can start.
const MIN_STEP_INTERVAL_MS = 420;

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

export default function CaseStudiesCarousel() {
  const [state, setState] = useState({ index: 0, direction: 0 });
  const sectionRef = useRef<HTMLElement>(null);
  const isActiveRef = useRef(false);
  const indexRef = useRef(0);
  const lastStepAtRef = useRef(0);
  const lastWheelAtRef = useRef(0);
  const gestureConsumedRef = useRef(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    indexRef.current = state.index;
  }, [state.index]);

  const goTo = useCallback((next: number) => {
    const clamped = Math.max(0, Math.min(N - 1, next));
    setState((prev) => (clamped === prev.index ? prev : { index: clamped, direction: clamped > prev.index ? 1 : -1 }));
  }, []);

  // Shared throttle so wheel, swipe, arrow clicks, and dot clicks can never
  // overlap the card's own crossfade with a second, half-finished one.
  const attemptStep = useCallback(
    (delta: number) => {
      const now = performance.now();
      if (now - lastStepAtRef.current < MIN_STEP_INTERVAL_MS) return;
      lastStepAtRef.current = now;
      goTo(indexRef.current + delta);
    },
    [goTo]
  );

  const goToDot = useCallback(
    (i: number) => {
      const now = performance.now();
      if (now - lastStepAtRef.current < MIN_STEP_INTERVAL_MS) return;
      lastStepAtRef.current = now;
      goTo(i);
    },
    [goTo]
  );

  // Only capture wheel/swipe input while this section fills most of the viewport.
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const io = new IntersectionObserver(([entry]) => {
      isActiveRef.current = entry.intersectionRatio > ACTIVE_THRESHOLD;
    }, { threshold: [0, ACTIVE_THRESHOLD, 1] });
    io.observe(section);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    function onWheel(e: WheelEvent) {
      if (!isActiveRef.current) return;
      const i = indexRef.current;
      const forward = e.deltaY > 0;
      // Only capture the scroll while there's a card left to move to in that
      // direction — otherwise let it fall through to normal page scroll.
      if (!((forward && i < N - 1) || (!forward && i > 0))) return;
      e.preventDefault();

      const now = performance.now();
      // A gap longer than GESTURE_GAP_MS means this event starts a new
      // physical gesture, so it's allowed to trigger a step again.
      if (now - lastWheelAtRef.current > GESTURE_GAP_MS) {
        gestureConsumedRef.current = false;
      }
      lastWheelAtRef.current = now;

      if (gestureConsumedRef.current) return;
      gestureConsumedRef.current = true;
      attemptStep(forward ? 1 : -1);
    }

    let touchStartX = 0;
    let touchStartY = 0;

    function onTouchStart(e: TouchEvent) {
      if (!isActiveRef.current) return;
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    }

    function onTouchEnd(e: TouchEvent) {
      if (!isActiveRef.current) return;
      const dx = e.changedTouches[0].clientX - touchStartX;
      const dy = e.changedTouches[0].clientY - touchStartY;
      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > SWIPE_THRESHOLD) {
        attemptStep(dx < 0 ? 1 : -1);
      }
    }

    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchend', onTouchEnd, { passive: true });
    return () => {
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, [attemptStep]);

  const scrollToSection = useCallback((id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const handleSkip = () => scrollToSection('manifesto-continue');

  // The arrows stay available on the first and last cards: instead of dead-ending,
  // they carry on out of the carousel into the adjacent manifesto section.
  const handlePrev = () => {
    if (state.index === 0) scrollToSection('manifesto-before-cases');
    else attemptStep(-1);
  };

  const handleNext = () => {
    if (state.index === N - 1) scrollToSection('manifesto-continue');
    else attemptStep(1);
  };

  const study = caseStudies[state.index];
  const offset = reduceMotion ? 0 : 36;

  return (
    <section
      ref={sectionRef}
      data-snap=""
      className="relative flex h-screen flex-col items-center justify-center overflow-hidden px-6 py-16"
    >
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="mb-8 text-xs uppercase tracking-[0.3em] text-[var(--dream-muted)]"
      >
        Case studies
      </motion.p>

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
              transition={{ duration: 0.45, ease: 'easeOut' }}
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

              <p className="mt-6 line-clamp-3 text-sm leading-relaxed text-[var(--dream-muted)]">{study.description}</p>
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
            onClick={() => goToDot(i)}
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
        onClick={handleSkip}
        className="mt-6 text-xs uppercase tracking-[0.2em] text-[var(--dream-muted)] opacity-40 transition-opacity hover:opacity-80"
      >
        Skip the case studies
      </button>
    </section>
  );
}
