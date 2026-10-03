'use client';

import { motion } from 'framer-motion';
import OrbitField from './OrbitField';
import { scrollToId } from '@/lib/smoothScroll';

/**
 * The landing hero: the shared orbit field behind a centred headline. The ring
 * layout itself lives in @/lib/orbit so the closing section can reuse it.
 */
export default function OrbitHero() {
  return (
    <section data-snap="" className="relative flex min-h-screen items-center justify-center overflow-hidden px-6">
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

        {/* The page's one call to action, in the middle of the first screen.
            It goes where the menu's own "Try it now" goes: the offer. */}
        <motion.button
          type="button"
          onClick={() => scrollToId('closing-cta')}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeOut', delay: 0.4 }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="mt-10 cursor-pointer rounded-full bg-[var(--ink)] px-9 py-4 text-xs font-medium tracking-wide text-white transition-colors hover:bg-black"
        >
          Try it now
        </motion.button>

        <motion.button
          type="button"
          onClick={() => scrollToId('manifesto-start')}
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
