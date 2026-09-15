'use client';

import { motion, useTransform, useReducedMotion, type MotionValue } from 'framer-motion';
import { ASSETS } from '@/lib/assets';
import AssetTile from './AssetTile';

/**
 * A few of the hero's floating assets drifting past each chapter, driven by
 * that chapter's own scroll progress. Each one moves at its own rate, so they
 * part around the text rather than travelling with it.
 *
 * Which assets appear is derived from the chapter index rather than randomised
 * at runtime: it stays varied between chapters but identical between server and
 * client, which a real `Math.random()` would not be.
 */

type Slot = {
  /** Horizontal placement, from whichever edge the asset hangs off. */
  edge: 'left' | 'right';
  inset: string;
  top: string;
  w: number;
  /** How far it travels across the chapter, in px. Sign sets the direction. */
  drift: number;
  tilt: number;
  /** The mid-height slots need margin beside the text, which only exists on wide screens. */
  wideOnly?: boolean;
};

const SLOTS: Slot[] = [
  { edge: 'left', inset: '5%', top: '30%', w: 98, drift: -80, tilt: -6, wideOnly: true },
  { edge: 'right', inset: '6%', top: '44%', w: 86, drift: 64, tilt: 5, wideOnly: true },
  { edge: 'left', inset: '10%', top: '6%', w: 74, drift: -46, tilt: 7 },
  { edge: 'right', inset: '12%', top: '78%', w: 80, drift: 54, tilt: -8 },
];

function ParallaxAsset({
  slot,
  assetIndex,
  progress,
  still,
}: {
  slot: Slot;
  assetIndex: number;
  progress: MotionValue<number>;
  still: boolean;
}) {
  const drift = still ? 0 : slot.drift;
  const y = useTransform(progress, [0, 1], [drift, -drift]);
  // Held a little below full strength, and present over a wider band than the
  // text, so the assets stay a backdrop rather than competing with the words.
  const opacity = useTransform(progress, [0, 0.35, 0.65, 1], [0, 0.9, 0.9, 0]);

  return (
    <motion.div
      style={{
        y,
        opacity,
        position: 'absolute',
        top: slot.top,
        [slot.edge]: slot.inset,
      }}
      className={slot.wideOnly ? 'hidden lg:block' : undefined}
    >
      <AssetTile asset={ASSETS[assetIndex]} width={slot.w} tilt={slot.tilt} />
    </motion.div>
  );
}

export default function ChapterAssets({
  progress,
  index,
}: {
  progress: MotionValue<number>;
  index: number;
}) {
  const still = useReducedMotion() ?? false;

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {SLOTS.map((slot, i) => (
        <ParallaxAsset
          key={i}
          slot={slot}
          // Walk the shared pool so no two chapters open with the same asset.
          assetIndex={(index * SLOTS.length + i * 5) % ASSETS.length}
          progress={progress}
          still={still}
        />
      ))}
      <div className="chapter-vignette" />
    </div>
  );
}
