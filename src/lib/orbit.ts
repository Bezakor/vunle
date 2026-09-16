/**
 * The hero's orbit layout, kept here rather than in the hero component because
 * the closing section reuses it verbatim: when the assets burst out of the
 * centre there, they have to land in exactly the arrangement the landing page
 * opens with, not merely a similar one.
 *
 * A placement only says where an asset sits: `a` indexes the shared pool, `w`
 * is its width at desktop (the stage scales it down on smaller screens), and
 * `r` nudges it off the exact circle so the rings read as a scatter.
 */
export type Placement = { a: number; w: number; tilt: number; r: number };

export const OUTER: Placement[] = [
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

export const INNER: Placement[] = [
  { a: 13, w: 86, tilt: 6, r: 1.0 },
  { a: 14, w: 94, tilt: -5, r: 1.11 },
  { a: 15, w: 82, tilt: 4, r: 0.93 },
  { a: 16, w: 90, tilt: -7, r: 1.09 },
  { a: 17, w: 84, tilt: 5, r: 0.95 },
  { a: 18, w: 96, tilt: -3, r: 1.07 },
  { a: 19, w: 82, tilt: 8, r: 0.96 },
  { a: 20, w: 92, tilt: -6, r: 1.1 },
];
