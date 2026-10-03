'use client';

import { motion } from 'framer-motion';
import { useEffect, useRef, type ReactNode } from 'react';
import OrbitField from './OrbitField';
import { scrollToId } from '@/lib/smoothScroll';

/**
 * The landing hero: the shared orbit field behind a centred headline. The ring
 * layout itself lives in @/lib/orbit so the closing section can reuse it.
 *
 * `waitlist` is the email form, which starts here under the subtitle and moves
 * to the bar at the foot of the page once the reader heads into the manifesto —
 * it is passed in rather than rendered here so the same instance makes that
 * move, keeping whatever has been typed into it.
 */
export default function OrbitHero({
  waitlist,
  onLeaveHero,
}: {
  waitlist?: ReactNode;
  onLeaveHero?: () => void;
}) {
  const sectionRef = useRef<HTMLElement>(null);

  // Scrolling past the hero counts as leaving it too. Without this the form
  // would ride away with the hero and the page would spend the rest of its
  // length with nowhere to sign up.
  useEffect(() => {
    const section = sectionRef.current;
    if (!section || !onLeaveHero) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) onLeaveHero();
      },
      // Not on mount: the hero is on screen then, and `isIntersecting` is only
      // false once it has actually gone.
      { threshold: 0 },
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, [onLeaveHero]);

  return (
    <section ref={sectionRef} data-snap="" className="relative flex min-h-screen items-center justify-center overflow-hidden px-6">
      <OrbitField />

      <div className="relative z-10 flex w-full max-w-3xl flex-col items-center text-center">
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeOut', delay: 0.12 }}
          // One sentence, left to break where it balances rather than by hand.
          className="max-w-3xl text-2xl leading-[1.15] font-normal tracking-tight text-balance text-[var(--ink)] sm:text-3xl xl:text-4xl"
        >
          Feel calm, focused and ready for your next big moment
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeOut', delay: 0.28 }}
          // Wide enough, and held on one line from sm up, so the sentence isn't
          // broken across two with a single word stranded on the second.
          className="mt-7 max-w-xl text-sm leading-relaxed text-[var(--ink-soft)] sm:max-w-none sm:whitespace-nowrap md:text-base"
        >
          A guided audio to visualise and prepare you for your specific goal
        </motion.p>

        {waitlist}

        <motion.button
          type="button"
          onClick={() => {
            onLeaveHero?.();
            scrollToId('manifesto-start');
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.1 }}
          className="mt-12 flex cursor-pointer flex-col items-center gap-2 text-[var(--ink)] transition-opacity hover:opacity-60"
        >
          <span className="max-w-[16rem] text-[10px] uppercase tracking-[0.22em] text-balance sm:max-w-none sm:tracking-[0.28em]">
            Here&rsquo;s how&hellip;
          </span>
          <span aria-hidden className="arrow-button">
            <span className="animate-bounce-gentle block text-xs">↓</span>
          </span>
        </motion.button>
      </div>
    </section>
  );
}
