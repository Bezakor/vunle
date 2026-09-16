'use client';

import { useState } from 'react';
import type { Asset } from '@/lib/assets';

/**
 * One floating asset frame. Renders whatever media the asset carries, falling
 * back to its placeholder gradient — both when no media is set and when the
 * file fails to load, so an asset that hasn't been dropped in yet simply looks
 * like the placeholder rather than a broken image.
 */
export default function AssetTile({
  asset,
  width,
  tilt = 0,
  className = '',
}: {
  asset: Asset;
  width: number;
  tilt?: number;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  const showMedia = Boolean(asset.src) && !failed;

  return (
    <div
      className={`orbit-tile ${className}`}
      style={{
        width,
        aspectRatio: asset.ratio,
        background: showMedia ? undefined : asset.g,
        rotate: `${tilt}deg`,
      }}
    >
      {showMedia &&
        (asset.kind === 'video' ? (
          <video
            className="orbit-media"
            src={asset.src}
            autoPlay
            muted
            loop
            playsInline
            onError={() => setFailed(true)}
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            className="orbit-media"
            src={asset.src}
            alt=""
            loading="lazy"
            onError={() => setFailed(true)}
          />
        ))}
    </div>
  );
}
