export interface ManifestoBeat {
  id: string;
  lines: string[];
  size?: 'md' | 'lg' | 'xl';
  serif?: boolean;
}

export const manifesto: ManifestoBeat[] = [
  {
    id: 'brain',
    lines: [
      "Your brain can't tell the difference",
      'between a real memory…',
      'and an imagined one.',
      "Some of the world's most successful athletes, entrepreneurs, artists, and creatives know this…",
    ],
    size: 'xl',
    serif: true,
  },
  {
    id: 'athletes',
    lines: [
      'They use guided visualizations every single day.',
      'They rehearse the future in their mind until it feels familiar —',
      'and the body follows.',
      "Here's 5 case studies…",
    ],
    size: 'md',
  },
  {
    id: 'rehearsal',
    lines: [
      "Visualization isn't magic.",
      'It’s mental rehearsal.',
      'It’s training your nervous system for the life you want.',
      'But here’s the big problem…',
    ],
    size: 'lg',
    serif: true,
  },
  {
    id: 'problem',
    lines: [
      'Most people try to visualize using random videos made for “everyone.”',
      'Generic voices. Generic goals. Generic scripts.',
      'But your dreams aren’t generic.',
      'So your inner voice shouldn’t be either.',
    ],
    size: 'md',
  },
  {
    id: 'exists',
    lines: [
      'That’s why Vunle exists.',
      'Vunle creates a guided visualization made only for you.',
      'Because the most important conversation',
      'is the one you have with yourself.',
      'Here’s how it works…',
    ],
    size: 'md',
    serif: true,
  },
  {
    id: 'audio-journey',
    lines: [
      'You simply tell it what you want…',
      'and it builds a personalized audio journey',
      'that speaks directly to your subconscious.',
      'There are 3 quick steps…',
    ],
    size: 'md',
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
