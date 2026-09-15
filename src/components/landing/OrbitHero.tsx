'use client';

import { motion } from 'framer-motion';

/**
 * Two concentric rings of tiles orbiting the centred headline — the outer ring
 * clockwise, the inner ring counter-clockwise. Each tile counter-rotates against
 * its ring so it orbits without ever tipping over.
 *
 * The tiles are abstract gradients rather than photographs: Vunle is about the
 * image you build in your own head, so nothing here should look like a specific
 * stock scene.
 */

/** `r` nudges a tile off the exact circle so the rings read as a scatter. */
type Tile = { g: string; w: number; h: number; tilt: number; r: number };

const OUTER: Tile[] = [
  { g: 'linear-gradient(150deg, #e8ecf5, #8d9bb5)', w: 108, h: 140, tilt: -7, r: 1.0 },
  { g: 'linear-gradient(160deg, #f4e3d7, #c08a63)', w: 132, h: 96, tilt: 5, r: 0.88 },
  { g: 'linear-gradient(200deg, #dfeae2, #7d9a88)', w: 96, h: 126, tilt: -3, r: 1.08 },
  { g: 'linear-gradient(140deg, #f2e2ea, #b98aa4)', w: 136, h: 100, tilt: 8, r: 0.93 },
  { g: 'linear-gradient(170deg, #e2e8f4, #5b6b88)', w: 104, h: 136, tilt: -5, r: 1.04 },
  { g: 'linear-gradient(190deg, #f6ead2, #c8a465)', w: 124, h: 92, tilt: 4, r: 0.9 },
  { g: 'linear-gradient(155deg, #e9e5f2, #8579a8)', w: 110, h: 142, tilt: -9, r: 1.06 },
  { g: 'linear-gradient(165deg, #dfeaef, #6d8f9e)', w: 130, h: 98, tilt: 6, r: 0.91 },
  { g: 'linear-gradient(145deg, #f3e4e4, #b07b7b)', w: 100, h: 130, tilt: -4, r: 1.02 },
  { g: 'linear-gradient(185deg, #e6eddc, #8a9b6a)', w: 126, h: 94, tilt: 7, r: 0.89 },
  { g: 'linear-gradient(175deg, #e7e6f3, #6f6c99)', w: 106, h: 138, tilt: -6, r: 1.07 },
  { g: 'linear-gradient(135deg, #f5e6da, #bb8560)', w: 120, h: 100, tilt: 3, r: 0.94 },
  { g: 'linear-gradient(195deg, #e0ece4, #6f9079)', w: 102, h: 132, tilt: -8, r: 1.01 },
];

const INNER: Tile[] = [
  { g: 'linear-gradient(160deg, #f0f2f6, #a8b2c2)', w: 84, h: 108, tilt: 6, r: 1.0 },
  { g: 'linear-gradient(140deg, #f5e6e8, #c08e95)', w: 98, h: 76, tilt: -5, r: 1.1 },
  { g: 'linear-gradient(180deg, #e6eef5, #7d97ae)', w: 80, h: 104, tilt: 4, r: 0.94 },
  { g: 'linear-gradient(150deg, #efe9f4, #9287ac)', w: 94, h: 78, tilt: -7, r: 1.08 },
  { g: 'linear-gradient(170deg, #f6efdd, #c4a878)', w: 84, h: 110, tilt: 5, r: 0.96 },
  { g: 'linear-gradient(190deg, #e7f0e9, #85a292)', w: 100, h: 76, tilt: -3, r: 1.06 },
  { g: 'linear-gradient(155deg, #e7eaf4, #7b85a6)', w: 80, h: 106, tilt: 8, r: 0.97 },
  { g: 'linear-gradient(165deg, #f7ece2, #c49a76)', w: 96, h: 78, tilt: -6, r: 1.09 },
];

function Ring({ tiles, layer }: { tiles: Tile[]; layer: 'outer' | 'inner' }) {
  // The inner ring has to clear the headline block, so it starts well out from
  // the centre rather than hugging it.
  const base = layer === 'outer' ? 'clamp(300px, 40vw, 680px)' : 'clamp(200px, 29vw, 450px)';

  return (
    <div className={`orbit-ring orbit-ring--${layer}`}>
      {tiles.map((tile, i) => (
        <div
          key={i}
          className="orbit-slot"
          style={
            {
              '--angle': `${(360 / tiles.length) * i}deg`,
              '--radius': `calc(${base} * ${tile.r})`,
            } as React.CSSProperties
          }
        >
          <div className={`orbit-upright--${layer}`}>
            <div
              className="orbit-tile"
              style={{
                width: tile.w,
                height: tile.h,
                background: tile.g,
                transform: `translate(-50%, -50%) rotate(${tile.tilt}deg)`,
              }}
            />
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
        <Ring tiles={OUTER} layer="outer" />
        <Ring tiles={INNER} layer="inner" />
        <div className="orbit-veil" />
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
          className="mt-6 max-w-3xl text-4xl leading-[1.15] font-normal tracking-tight text-balance text-[var(--ink)] md:text-6xl"
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

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.1 }}
          className="mt-14 flex flex-col items-center gap-2 text-[var(--ink-faint)]"
        >
          <span className="text-[10px] uppercase tracking-[0.28em]">Here&apos;s something surprising:</span>
          <span aria-hidden className="animate-bounce-gentle text-xs">
            ↓
          </span>
        </motion.div>
      </div>
    </section>
  );
}
