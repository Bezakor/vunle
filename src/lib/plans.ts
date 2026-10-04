export interface Plan {
  /** Used in the URL of the form the buy button opens, so keep it stable. */
  id: string;
  name: string;
  price: string;
  /** Struck through beside the price, where one package is discounted. */
  was?: string;
  /** The line under the price, for what the discount carries with it. */
  priceNote?: string;
  /** Picked out beside the price. */
  saving?: string;
  /** One line on who it is for, under the name. */
  summary: string;
  delivery: string;
  includes: string[];
  /** The one we point people at. Selected when the section opens. */
  featured?: boolean;
  /** The marks above the name on the featured card. */
  badges?: { icon: 'star' | 'trend'; label: string }[];
  /** Picked out at the foot of the list. */
  callout?: { label: string; body: string };
  /** Minutes on the clock above the cards, where an offer is time-limited. */
  offerMinutes?: number;
  cta: string;
  /**
   * The Google Form this package's button opens, embedded on /start. Keep the
   * `embedded=true` parameter: without it the form draws its own page chrome
   * inside the frame.
   */
  formUrl: string;
}

export const plans: Plan[] = [
  {
    id: 'complete-life-reframing',
    name: 'Complete Life Reframing',
    price: '$1,497',
    summary: 'Five goals, rehearsed together.',
    delivery: 'Delivered in 5–7 days',
    cta: 'Start the full reframe',
    formUrl:
      'https://docs.google.com/forms/d/e/1FAIpQLSeiLWF2AfLlKXR8jNhLuN-inQ0QZ6z-lYbABhHlzFlnEuPH1g/viewform?embedded=true',
    includes: [
      'Five custom audio guides: your professional life, your relationships and social standing, a morning meditation, mental focus and confidence, an evening meditation',
      'An extended personalised assessment covering all five',
      'Two tracks of each — one scored with ambient, meditative sound, one clean voice only',
      'Every script written out as a PDF',
      'The full research-backed methodology, with the rationale behind every choice, as a PDF',
    ],
  },
  {
    id: 'single-goal-focus',
    name: 'Single Goal Focus',
    price: '$97',
    was: '$397',
    saving: 'Save 87.78% off',
    priceNote: 'Plus a second Single Goal Focus guide free — a total saving of $697',
    summary: 'One moment, rehearsed daily.',
    delivery: 'Same-day download',
    featured: true,
    badges: [
      { icon: 'star', label: 'Recommended' },
      { icon: 'trend', label: 'Most purchased' },
    ],
    offerMinutes: 20,
    callout: {
      label: 'Limited time bonus',
      body: 'An additional Single Goal Focus audio guide, completely free — worth $397 (a total saving of $697).',
    },
    cta: 'Start with one goal',
    formUrl:
      'https://docs.google.com/forms/d/e/1FAIpQLSe_eurb9sNHFnkYK1SHOrm0Xk9ve_aKTsjeS9NVJIXm8rUy1g/viewform?embedded=true',
    includes: [
      'A personalised assessment',
      'Custom goal setting',
      'A sub-four-minute audio guide',
      'Built on proven methods: PETTLEP imagery, Mental Contrasting and the WOOP protocol',
      'Two audio tracks — one scored with ambient, meditative sound, one clean voice only',
      'Your script written out as a PDF',
      'Review and approve your audio guide before completion',
      'One repeatable affirmation, and a phone screensaver carrying it',
    ],
  },
];

export function planById(id: string | null | undefined) {
  return plans.find((p) => p.id === id);
}
