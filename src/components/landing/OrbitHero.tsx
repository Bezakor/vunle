'use client';

import { motion } from 'framer-motion';
import OrbitField from './OrbitField';

/**
 * The landing hero: the shared orbit field behind a centred headline. The ring
 * layout itself lives in @/lib/orbit so the closing section can reuse it.
 */
export default function OrbitHero() {
  return (
    <section data-snap="" className="relative flex min-h-screen items-center justify-center overflow-hidden px-6">
      <OrbitField />

      <div className="relative z-10 flex flex-col items-center text-center">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
          className="eyebrow"
        >
          Personal visualization
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeOut', delay: 0.12 }}
          className="mt-6 max-w-2xl text-2xl leading-[1.15] font-normal tracking-tight text-balance text-[var(--ink)] sm:text-3xl xl:text-5xl"
        >
          Personal goals need
          <br />
          personal visualizations
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeOut', delay: 0.28 }}
          className="mt-7 max-w-md text-sm leading-relaxed text-[var(--ink-soft)] md:text-base"
        >
          A guided audio journey built for your specific goal.
        </motion.p>

        <motion.button
          type="button"
          onClick={() => document.getElementById('manifesto-start')?.scrollIntoView({ behavior: 'smooth' })}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.1 }}
          className="mt-14 flex cursor-pointer flex-col items-center gap-2 text-[var(--ink)] transition-opacity hover:opacity-60"
        >
          <span className="text-[10px] uppercase tracking-[0.28em]">Here&apos;s something surprising:</span>
          <span aria-hidden className="animate-bounce-gentle text-xs">
            ↓
          </span>
        </motion.button>
      </div>
    </section>
  );
}
