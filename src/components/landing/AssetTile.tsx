import type { Asset } from '@/lib/assets';

/**
 * One floating asset frame. Renders whatever media the asset carries, falling
 * back to its placeholder gradient until real media is dropped in.
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
  return (
    <div
      className={`orbit-tile ${className}`}
      style={{
        width,
        aspectRatio: asset.ratio,
        background: asset.src ? undefined : asset.g,
        rotate: `${tilt}deg`,
      }}
    >
      {asset.src &&
        (asset.kind === 'video' ? (
          <video className="orbit-media" src={asset.src} autoPlay muted loop playsInline />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img className="orbit-media" src={asset.src} alt="" />
        ))}
    </div>
  );
}
