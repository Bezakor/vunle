'use client';

import { motion, useTransform, useReducedMotion, type MotionValue } from 'framer-motion';
import { ASSETS } from '@/lib/assets';
import AssetTile from './AssetTile';

/**
 * A handful of the hero's floating assets orbiting the centre of each chapter,
 * the same way they circle the landing page. Successive chapters turn opposite
 * ways — the first clockwise, the next counter-clockwise — so the page doesn't
 * read as one continuous rotation all the way down.
 *
 * The ring is an ellipse rather than a circle. A circle wide enough to clear
 * the text, which runs to 48rem, would stand taller than the chapter itself and
 * be cut off top and bottom; the stage squashes the ring vertically and each
 * tile is stretched back by the inverse, so the assets travel an oval while
 * staying perfectly round. See .chapter-stage in globals.css.
 *
 * Which assets appear is derived from the chapter index rather than randomised
 * at runtime: it stays varied between chapters but identical between server and
 * client, which a real `Math.random()` would not be.
 */

type Placement = {
  /** Width at desktop; the stage scales it down on smaller screens. */
  w: number;
  tilt: number;
  /** Nudges the asset off the exact ellipse so the ring reads as a scatter. */
  r: number;
};

const PLACEMENTS: Placement[] = [
  { w: 96, tilt: -6, r: 1.0 },
  { w: 82, tilt: 5, r: 1.1 },
  { w: 88, tilt: -4, r: 0.93 },
];

/** Slow enough to read as drift rather than as a carousel. */
const DURATION_S = 150;

/**
 * One, two or three assets, cycling by chapter. Kept sparse on purpose: these
 * are meant to be glimpsed past the words, not to fill the margins.
 */
function countFor(index: number) {
  return 1 + (index % 3);
}

export default function ChapterAssets({
  progress,
  index,
}: {
  progress: MotionValue<number>;
  index: number;
}) {
  const still = useReducedMotion() ?? false;

  // Held a little below full strength, and present over a wider band than the
  // text, so the assets stay a backdrop rather than competing with the words.
  const opacity = useTransform(progress, [0, 0.35, 0.65, 1], [0, 0.9, 0.9, 0]);

  // Odd chapters turn the other way.
  const counter = index % 2 === 1;
  const placements = PLACEMENTS.slice(0, countFor(index));

  return (
    <motion.div className="chapter-stage" style={{ opacity }} aria-hidden>
      <div className="chapter-ring">
        <div
          className="chapter-spin"
          style={
            {
              '--orbit-dur': still ? '0s' : `${DURATION_S}s`,
              '--orbit-dir': counter ? 'reverse' : 'normal',
              '--orbit-dir-rev': counter ? 'normal' : 'reverse',
            } as React.CSSProperties
          }
        >
          {placements.map((p, i) => (
            <div
              key={i}
              className="chapter-slot"
              style={
                {
                  // Offset per chapter so a run of chapters doesn't keep
                  // putting its assets in the same corner of the screen.
                  '--angle': `${(360 / placements.length) * i + index * 47}deg`,
                  '--r': p.r,
                } as React.CSSProperties
              }
            >
              <div className="chapter-upright">
                <div className="chapter-unsquash">
                  <AssetTile
                    asset={
                      // Walk the shared pool so no two chapters open on the same asset.
                      ASSETS[(index * PLACEMENTS.length + i * 5) % ASSETS.length]
                    }
                    width={p.w}
                    tilt={p.tilt}
                    className="orbit-tile--centred"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="chapter-vignette" />
    </motion.div>
  );
}
