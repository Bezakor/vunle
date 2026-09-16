import { FLOATING_MEDIA, type FloatingMedia } from './floatingManifest';

/**
 * The shared pool of floating assets. The orbiting hero and the manifesto
 * chapters both draw from this one list, so the page reads as a single set of
 * images rather than two unrelated ones.
 *
 * Each entry is a media container: give it a `src` (and `kind: 'video'` for
 * footage) and it fills its frame; until then the gradient stands in as a
 * placeholder. Frames are square or portrait only — never landscape.
 */
export type Asset = {
  g: string;
  ratio: '1 / 1' | '3 / 4' | '4 / 5';
  src?: string;
  kind?: 'image' | 'video';
};

/**
 * The frames themselves: the shape of each tile and the gradient that stands in
 * until there is media for it. The shapes are a design decision, not a property
 * of the files — a tile crops whatever it is given to its own frame.
 */
const FRAMES: Omit<Asset, 'src' | 'kind'>[] = [
  { g: 'linear-gradient(150deg, #e8ecf5, #8d9bb5)', ratio: '3 / 4' },
  { g: 'linear-gradient(160deg, #f4e3d7, #c08a63)', ratio: '1 / 1' },
  { g: 'linear-gradient(200deg, #dfeae2, #7d9a88)', ratio: '4 / 5' },
  { g: 'linear-gradient(140deg, #f2e2ea, #b98aa4)', ratio: '1 / 1' },
  { g: 'linear-gradient(170deg, #e2e8f4, #5b6b88)', ratio: '3 / 4' },
  { g: 'linear-gradient(190deg, #f6ead2, #c8a465)', ratio: '1 / 1' },
  { g: 'linear-gradient(155deg, #e9e5f2, #8579a8)', ratio: '3 / 4' },
  { g: 'linear-gradient(165deg, #dfeaef, #6d8f9e)', ratio: '4 / 5' },
  { g: 'linear-gradient(145deg, #f3e4e4, #b07b7b)', ratio: '3 / 4' },
  { g: 'linear-gradient(185deg, #e6eddc, #8a9b6a)', ratio: '1 / 1' },
  { g: 'linear-gradient(175deg, #e7e6f3, #6f6c99)', ratio: '3 / 4' },
  { g: 'linear-gradient(135deg, #f5e6da, #bb8560)', ratio: '4 / 5' },
  { g: 'linear-gradient(195deg, #e0ece4, #6f9079)', ratio: '3 / 4' },
  { g: 'linear-gradient(160deg, #f0f2f6, #a8b2c2)', ratio: '3 / 4' },
  { g: 'linear-gradient(140deg, #f5e6e8, #c08e95)', ratio: '1 / 1' },
  { g: 'linear-gradient(180deg, #e6eef5, #7d97ae)', ratio: '4 / 5' },
  { g: 'linear-gradient(150deg, #efe9f4, #9287ac)', ratio: '1 / 1' },
  { g: 'linear-gradient(170deg, #f6efdd, #c4a878)', ratio: '3 / 4' },
  { g: 'linear-gradient(190deg, #e7f0e9, #85a292)', ratio: '1 / 1' },
  { g: 'linear-gradient(155deg, #e7eaf4, #7b85a6)', ratio: '3 / 4' },
  { g: 'linear-gradient(165deg, #f7ece2, #c49a76)', ratio: '4 / 5' },
];

/**
 * Spaces the video out evenly across the frames, then fills the gaps with the
 * images in filename order.
 *
 * Taking the folder in plain filename order bunched every clip together: the
 * clips happened to be named with a space where the stills used a hyphen, so
 * they all sorted first and landed on one half of the ring — every moving tile
 * on one side, every still one on the other. Where a file sits in the list
 * shouldn't decide that, so the motion is dealt out around the rings instead.
 */
function distribute(media: FloatingMedia[], frameCount: number) {
  const slots: (FloatingMedia | undefined)[] = new Array(frameCount).fill(undefined);
  const videos = media.filter((m) => m.kind === 'video');
  const images = media.filter((m) => m.kind === 'image');

  const step = frameCount / Math.max(videos.length, 1);
  videos.slice(0, frameCount).forEach((video, i) => {
    let at = Math.round(i * step) % frameCount;
    while (slots[at]) at = (at + 1) % frameCount;
    slots[at] = video;
  });

  let next = 0;
  for (const image of images) {
    while (next < frameCount && slots[next]) next += 1;
    if (next >= frameCount) break;
    slots[next] = image;
    next += 1;
  }

  return slots;
}

/**
 * The frames, each carrying whatever media has been given to it. A frame with
 * nothing to show keeps its gradient, so the folder can be filled a few files
 * at a time. Files past the last frame go unused — there are 21 frames.
 */
const PLACED = distribute(FLOATING_MEDIA, FRAMES.length);

export const ASSETS: Asset[] = FRAMES.map((frame, i) => {
  const media = PLACED[i];
  return media ? { ...frame, src: media.src, kind: media.kind } : frame;
});
