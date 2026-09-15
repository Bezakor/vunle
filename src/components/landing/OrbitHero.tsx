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

/**
 * A tile is a media container. Give it a `src` (and `kind: 'video'` for footage)
 * and it fills the frame; until then the gradient stands in as a placeholder.
 * Frames are square or portrait only — never landscape.
 *
 * `w` is the width in px at desktop (the stage scales it down on smaller
 * screens), and `r` nudges the tile off the exact circle so the rings read as a
 * scatter rather than a perfect ring.
 */
type Tile = {
  w: number;
  ratio: '1 / 1' | '3 / 4' | '4 / 5';
  tilt: number;
  r: number;
  g: string;
  src?: string;
  kind?: 'image' | 'video';
};

const OUTER: Tile[] = [
  { g: 'linear-gradient(150deg, #e8ecf5, #8d9bb5)', w: 112, ratio: '3 / 4', tilt: -7, r: 1.0 },
  { g: 'linear-gradient(160deg, #f4e3d7, #c08a63)', w: 124, ratio: '1 / 1', tilt: 5, r: 0.87 },
  { g: 'linear-gradient(200deg, #dfeae2, #7d9a88)', w: 100, ratio: '4 / 5', tilt: -3, r: 1.09 },
  { g: 'linear-gradient(140deg, #f2e2ea, #b98aa4)', w: 118, ratio: '1 / 1', tilt: 8, r: 0.92 },
  { g: 'linear-gradient(170deg, #e2e8f4, #5b6b88)', w: 106, ratio: '3 / 4', tilt: -5, r: 1.05 },
  { g: 'linear-gradient(190deg, #f6ead2, #c8a465)', w: 128, ratio: '1 / 1', tilt: 4, r: 0.89 },
  { g: 'linear-gradient(155deg, #e9e5f2, #8579a8)', w: 110, ratio: '3 / 4', tilt: -9, r: 1.07 },
  { g: 'linear-gradient(165deg, #dfeaef, #6d8f9e)', w: 120, ratio: '4 / 5', tilt: 6, r: 0.9 },
  { g: 'linear-gradient(145deg, #f3e4e4, #b07b7b)', w: 104, ratio: '3 / 4', tilt: -4, r: 1.02 },
  { g: 'linear-gradient(185deg, #e6eddc, #8a9b6a)', w: 126, ratio: '1 / 1', tilt: 7, r: 0.88 },
  { g: 'linear-gradient(175deg, #e7e6f3, #6f6c99)', w: 108, ratio: '3 / 4', tilt: -6, r: 1.08 },
  { g: 'linear-gradient(135deg, #f5e6da, #bb8560)', w: 116, ratio: '4 / 5', tilt: 3, r: 0.93 },
  { g: 'linear-gradient(195deg, #e0ece4, #6f9079)', w: 102, ratio: '3 / 4', tilt: -8, r: 1.01 },
];

const INNER: Tile[] = [
  { g: 'linear-gradient(160deg, #f0f2f6, #a8b2c2)', w: 86, ratio: '3 / 4', tilt: 6, r: 1.0 },
  { g: 'linear-gradient(140deg, #f5e6e8, #c08e95)', w: 94, ratio: '1 / 1', tilt: -5, r: 1.11 },
  { g: 'linear-gradient(180deg, #e6eef5, #7d97ae)', w: 82, ratio: '4 / 5', tilt: 4, r: 0.93 },
  { g: 'linear-gradient(150deg, #efe9f4, #9287ac)', w: 90, ratio: '1 / 1', tilt: -7, r: 1.09 },
  { g: 'linear-gradient(170deg, #f6efdd, #c4a878)', w: 84, ratio: '3 / 4', tilt: 5, r: 0.95 },
  { g: 'linear-gradient(190deg, #e7f0e9, #85a292)', w: 96, ratio: '1 / 1', tilt: -3, r: 1.07 },
  { g: 'linear-gradient(155deg, #e7eaf4, #7b85a6)', w: 82, ratio: '3 / 4', tilt: 8, r: 0.96 },
  { g: 'linear-gradient(165deg, #f7ece2, #c49a76)', w: 92, ratio: '4 / 5', tilt: -6, r: 1.1 },
];

function Ring({ tiles, layer }: { tiles: Tile[]; layer: 'outer' | 'inner' }) {
  // Radii come from --r-outer / --r-inner on the stage, so the breakpoints
  // there retune both rings without touching this markup.
  return (
    <div className={`orbit-ring orbit-ring--${layer}`}>
      {tiles.map((tile, i) => (
        <div
          key={i}
          className="orbit-slot"
          style={
            {
              '--angle': `${(360 / tiles.length) * i}deg`,
              '--r': tile.r,
            } as React.CSSProperties
          }
        >
          <div className={`orbit-upright--${layer}`}>
            <div
              className="orbit-tile"
              style={{
                width: tile.w,
                aspectRatio: tile.ratio,
                background: tile.src ? undefined : tile.g,
                transform: `translate(-50%, -50%) rotate(${tile.tilt}deg)`,
              }}
            >
              {tile.src &&
                (tile.kind === 'video' ? (
                  <video className="orbit-media" src={tile.src} autoPlay muted loop playsInline />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img className="orbit-media" src={tile.src} alt="" />
                ))}
            </div>
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
