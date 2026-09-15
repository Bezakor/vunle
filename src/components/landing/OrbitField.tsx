'use client';

import { motion, type MotionValue } from 'framer-motion';
import { ASSETS } from '@/lib/assets';
import { OUTER, INNER, type Placement } from '@/lib/orbit';
import AssetTile from './AssetTile';

/**
 * The two counter-rotating rings of assets — outer clockwise, inner
 * counter-clockwise — that the landing page opens with. Each asset
 * counter-rotates against its ring so it orbits without ever tipping over.
 *
 * `spread` scales every orbit radius: at 0 the whole field is collapsed into a
 * single point at the centre, at 1 it is the hero's arrangement. The hero
 * leaves it alone; the closing section animates it to burst the assets out of
 * the centre and draw them back in again.
 */
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

export default function OrbitField({
  spread,
  opacity,
}: {
  spread?: MotionValue<number>;
  opacity?: MotionValue<number>;
}) {
  return (
    <motion.div
      className="orbit-stage"
      aria-hidden
      style={{ ...(spread ? { '--spread': spread } : {}), ...(opacity ? { opacity } : {}) } as React.CSSProperties}
    >
      <Ring placements={OUTER} layer="outer" />
      <Ring placements={INNER} layer="inner" />
      <div className="orbit-vignette" />
    </motion.div>
  );
}
