export interface CaseStudy {
  id: string;
  name: string;
  title: string;
  initials: string;
  headline: string;
  isQuote: boolean;
  description: string;
}

export const caseStudies: CaseStudy[] = [
  {
    id: 'jordan',
    name: 'Michael Jordan',
    title: 'NBA Hall-of-Fame Athlete',
    initials: 'MJ',
    isQuote: true,
    headline:
      'I visualized where I wanted to be, what kind of player I wanted to become. I knew exactly where I wanted to go, and I focused on getting there.',
    description:
      'Treated mental rehearsal as equal to physical training — using visualization to build unwavering self-belief and handle the pressure of game-winning moments.',
  },
  {
    id: 'gaga',
    name: 'Lady Gaga',
    title: 'Musician, Artist',
    initials: 'LG',
    isQuote: true,
    headline: 'Acting as if it’s already real.',
    description:
      'Early in her career, she visualized her fame and rehearsed performances as though she were already a global icon — anchoring that mental image until it became her reality.',
  },
  {
    id: 'robbins-tony',
    name: 'Tony Robbins',
    title: 'Speaker, Philanthropist',
    initials: 'TR',
    isQuote: true,
    headline: 'Your imagination is ten times more potent than your willpower.',
    description:
      'The brain doesn’t distinguish between a vividly imagined thought and reality — pre-programming the mind with a successful image unlocks the body’s hidden potential and eliminates hesitation.',
  },
  {
    id: 'robbins-mel',
    name: 'Mel Robbins',
    title: 'Author, Host',
    initials: 'MR',
    isQuote: true,
    headline:
      'Your fears are already manifesting against you — flip it by vividly imagining the best case instead of the worst.',
    description:
      'Rather than picturing the finish line, she has you visualize the hardest moment — the 5am alarm, the cold, tying your shoes anyway — training your brain to execute when real-world resistance hits.',
  },
  {
    id: 'dispenza',
    name: 'Dr. Joe Dispenza',
    title: 'Neuroscientist, Author',
    initials: 'JD',
    isQuote: true,
    headline:
      'The brain and the body do not know the difference between having an actual experience in your physical world and creating an experience by thought alone.',
    description:
      'In a Harvard study, one group physically practiced piano for five days while another only mentally rehearsed it — brain scans showed identical neural growth in the motor cortex for both groups.',
  },
];
