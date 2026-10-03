export interface Plan {
  /** Used in the URL of the form the buy button opens, so keep it stable. */
  id: string;
  name: string;
  price: string;
  /** One line on who it is for, under the name. */
  summary: string;
  delivery: string;
  includes: string[];
  /** The one we point people at. Selected when the section opens. */
  featured?: boolean;
  badge?: string;
  cta: string;
}

export const plans: Plan[] = [
  {
    id: 'full-life-reframe',
    name: 'The Full Life Reframe',
    price: '$1,497',
    summary: 'Every part of your life, rehearsed together.',
    delivery: 'Delivered in 5–7 days',
    cta: 'Start the full reframe',
    includes: [
      'Everything in One Goal Clarity, across five goals',
      'Five custom audio guides: your professional life, your relationships and social standing, a morning meditation, mental focus and confidence, an evening meditation',
      'An extended personalised assessment covering all five',
      'Two tracks of each — one scored with ambient, meditative sound, one clean voice only',
      'Every script written out as a PDF',
      'Five repeatable affirmations, each with a phone screensaver',
      'The full research-backed methodology, with the rationale behind every choice, as a PDF',
    ],
  },
  {
    id: 'one-goal-clarity',
    name: 'One Goal Clarity',
    price: '$97',
    summary: 'One moment — the presentation, the race, the room — rehearsed until it feels familiar.',
    delivery: 'Same-day download',
    featured: true,
    badge: 'Recommended',
    cta: 'Start with one goal',
    includes: [
      'A personalised assessment',
      'Custom goal setting',
      'A sub-four-minute audio guide',
      'Built on proven methods: PETTLEP imagery, Mental Contrasting and professional WHOOP methodology',
      'Two audio tracks — one scored with ambient, meditative sound, one clean voice only',
      'Your script written out as a PDF',
      'One repeatable affirmation, and a phone screensaver carrying it',
    ],
  },
];

export function planById(id: string | null | undefined) {
  return plans.find((p) => p.id === id);
}
