export interface ManifestoBeat {
  id: string;
  lines: string[];
  size?: 'md' | 'lg' | 'xl';
  serif?: boolean;
}

export const manifesto: ManifestoBeat[] = [
  {
    id: 'surprise',
    lines: ["Here's something surprising:"],
    size: 'md',
  },
  {
    id: 'brain',
    lines: ["Your brain can't tell the difference", 'between a real memory…', 'and an imagined one.'],
    size: 'xl',
    serif: true,
  },
  {
    id: 'athletes',
    lines: [
      "This is why the world's top athletes and successful people",
      'use guided visualizations every single day.',
      'They rehearse the future in their mind until it feels familiar —',
      'and the body follows.',
    ],
    size: 'md',
  },
  {
    id: 'rehearsal',
    lines: ["Visualization isn't magic.", 'It’s mental rehearsal.', 'It’s training your nervous system for the life you want.'],
    size: 'lg',
    serif: true,
  },
  {
    id: 'problem',
    lines: [
      'But here’s the problem:',
      'Most people try to visualize using random videos made for “everyone.”',
      'Generic voices. Generic goals. Generic scripts.',
    ],
    size: 'md',
  },
  {
    id: 'notgeneric',
    lines: ["Your mind isn't generic.", "Your dreams aren't generic.", "Your inner voice shouldn't be either."],
    size: 'xl',
    serif: true,
  },
  {
    id: 'exists',
    lines: ['That’s why Vunle exists.'],
    size: 'lg',
    serif: true,
  },
  {
    id: 'made-for-you',
    lines: [
      'Vunle creates a guided visualization made only for you —',
      'your goal, your tone, your timeline, your emotion.',
      'Designed to help you step into the future you’re trying to create.',
    ],
    size: 'md',
  },
  {
    id: 'subconscious',
    lines: ['You simply tell it what you want…', 'and it builds a personalized audio journey', 'that speaks directly to your subconscious.'],
    size: 'md',
  },
  {
    id: 'conversation',
    lines: ['Because the most important conversation', 'is the one you have with yourself.'],
    size: 'xl',
    serif: true,
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
