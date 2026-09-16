/**
 * `[logo]` anywhere in a line is replaced by the wordmark, set to the height of
 * the surrounding type. It falls back to the word "Vunle" when there is no logo
 * file, so the sentence always reads.
 */
export const LOGO_TOKEN = '[logo]';

export interface ManifestoBeat {
  id: string;
  lines: string[];
  /** Extra line indices to render in the accent colour. The closing line always is. */
  accentLines?: number[];
  /** Line indices after which to open an extra paragraph space. */
  gapAfter?: number[];
  /**
   * Render every line as plain body text. Use it where the lines are one
   * continuous sentence, so the closing line isn't singled out mid-thought.
   */
  flat?: boolean;
}

export const manifesto: ManifestoBeat[] = [
  {
    id: 'brain',
    lines: [
      "Your brain can't tell the difference",
      'between a real memory…',
      'and an imagined one.',
      "Some of the world's most successful athletes, entrepreneurs, and creatives know this…",
    ],
  },
  {
    id: 'athletes',
    lines: [
      'They use guided visualizations every single day.',
      'They rehearse the future in their mind until it feels familiar —',
      'and the body follows.',
      "Here's 5 case studies…",
    ],
  },
  {
    id: 'rehearsal',
    lines: [
      "Visualization isn't magic.",
      'It’s mental rehearsal.',
      'It’s training your nervous system for the life you want.',
      'But here’s the big problem…',
    ],
  },
  {
    id: 'problem',
    lines: [
      'Most people try to visualize using random videos made for “everyone.”',
      'Generic voices. Generic goals. Generic scripts.',
      'But your dreams aren’t generic.',
      'So your inner voice shouldn’t be either.',
    ],
  },
  {
    id: 'exists',
    lines: [
      'That’s why [logo] exists.',
      'Vunle creates a guided visualization made only for you.',
      'Here’s how it works…',
    ],
    accentLines: [0, 1],
    gapAfter: [1],
  },
  {
    id: 'wants',
    lines: [
      'Maybe you want to improve your self belief, become more confident,',
      'more grateful, more successful, more content, achieve a life long goal,',
      'get something you want,',
      'or become someone you know you can be.',
    ],
  },
  {
    id: 'audio-journey',
    lines: [
      'You simply tell it what you want…',
      'and it builds a personalized audio journey',
      'that speaks directly to your subconscious.',
      'There are 3 quick steps…',
    ],
  },
];

export const howItWorks = [
  {
    step: '01',
    title: 'Describe your goal',
    detail: 'In your own words — no prompts, no forms, just what you actually want.',
  },
  {
    step: '02',
    title: 'Choose your voice',
    detail: 'Pick the tone that should speak it into being.',
  },
  {
    step: '03',
    title: 'Set the ambiance',
    detail: 'Choose the sound world your future lives in.',
  },
];
