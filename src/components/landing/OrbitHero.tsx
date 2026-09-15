'use client';

import { motion } from 'framer-motion';
import { ASSETS } from '@/lib/assets';
import AssetTile from './AssetTile';

/**
 * Two concentric rings of assets orbiting the centred headline — the outer ring
 * clockwise, the inner ring counter-clockwise. Each asset counter-rotates
 * against its ring so it orbits without ever tipping over.
 *
 * A placement only says where an asset sits: `a` indexes the shared pool, `w`
 * is its width at desktop (the stage scales it down on smaller screens), and
 * `r` nudges it off the exact circle so the rings read as a scatter.
 */
type Placement = { a: number; w: number; tilt: number; r: number };

const OUTER: Placement[] = [
  { a: 0, w: 112, tilt: -7, r: 1.0 },
  { a: 1, w: 124, tilt: 5, r: 0.87 },
  { a: 2, w: 100, tilt: -3, r: 1.09 },
  { a: 3, w: 118, tilt: 8, r: 0.92 },
  { a: 4, w: 106, tilt: -5, r: 1.05 },
  { a: 5, w: 128, tilt: 4, r: 0.89 },
  { a: 6, w: 110, tilt: -9, r: 1.07 },
  { a: 7, w: 120, tilt: 6, r: 0.9 },
  { a: 8, w: 104, tilt: -4, r: 1.02 },
  { a: 9, w: 126, tilt: 7, r: 0.88 },
  { a: 10, w: 108, tilt: -6, r: 1.08 },
  { a: 11, w: 116, tilt: 3, r: 0.93 },
  { a: 12, w: 102, tilt: -8, r: 1.01 },
];

const INNER: Placement[] = [
  { a: 13, w: 86, tilt: 6, r: 1.0 },
  { a: 14, w: 94, tilt: -5, r: 1.11 },
  { a: 15, w: 82, tilt: 4, r: 0.93 },
  { a: 16, w: 90, tilt: -7, r: 1.09 },
  { a: 17, w: 84, tilt: 5, r: 0.95 },
  { a: 18, w: 96, tilt: -3, r: 1.07 },
  { a: 19, w: 82, tilt: 8, r: 0.96 },
  { a: 20, w: 92, tilt: -6, r: 1.1 },
];

function Ring({ placements, layer }: { placements: Placement[]; layer: 'outer' | 'inner' }) {
  // Radii come from --r-outer / --r-inner on the stage, so the breakpoints
  // there retune both rings without touching this markup.
  return (
    <div className={`orbit-ring orbit-ring--${layer}`}>
      {placements.map((p, i) => (
        <div
          key={i}
          className="orbit-slot"
          style={
            {
              '--angle': `${(360 / placements.length) * i}deg`,
              '--r': p.r,
            } as React.CSSProperties
          }
        >
          <div className={`orbit-upright--${layer}`}>
            <AssetTile asset={ASSETS[p.a]} width={p.w} tilt={p.tilt} className="orbit-tile--centred" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function OrbitHero() {
  return (
    <section data-snap="" className="relative flex min-h-screen items-center justify-center overflow-hidden px-6">
      <div className="orbit-stage" aria-hidden>
        <Ring placements={OUTER} layer="outer" />
        <Ring placements={INNER} layer="inner" />
        <div className="orbit-vignette" />
      </div>

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
          An audio journey built for your goal alone.
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
