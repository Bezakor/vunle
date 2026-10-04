export interface CaseStudy {
  id: string;
  name: string;
  title: string;
  initials: string;
  /**
   * Portrait in /public/case-studies. The initials above stand in until the
   * file is there — and if one ever fails to load, so the carousel never shows
   * a broken image.
   */
  avatar: string;
  headline: string;
  isQuote: boolean;
  description: string;
}

export const caseStudies: CaseStudy[] = [
  {
    id: 'gaga',
    avatar: '/case-studies/profile_02-LG-lady-gaga.jpg',
    name: 'Lady Gaga',
    title: 'Musician, Artist',
    initials: 'LG',
    isQuote: true,
    headline: 'Acting as if it’s already real.',
    description:
      'Early in her career, she visualized her fame and rehearsed performances as though she were already a global icon — anchoring that mental image until it became her reality.',
  },
  {
    id: 'jordan',
    avatar: '/case-studies/profile_01-MJ-michael-jordan.jpg',
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
    id: 'carrey',
    avatar: '/case-studies/profile_02-jc-JIM-CAREY.jpg',
    name: 'Jim Carrey',
    title: 'Film Star, Comedian',
    initials: 'JC',
    isQuote: true,
    headline:
      'I would visualize having directors that I respected saying, “I like your work.” I would visualize things I wanted…',
    description:
      'Before he was one of Hollywood’s biggest stars he pictured the career he wanted — directors valuing his work — and wrote himself a $10 million cheque for “acting services rendered”. Years later his fee for Dumb & Dumber: When Nature Calls reportedly reached that figure.',
  },
  {
    id: 'blakely',
    avatar: '/case-studies/profile_06-sb-SARA-BLAKEY.jpg',
    name: 'Sara Blakely',
    title: 'Entrepreneur, Inventor',
    initials: 'SB',
    isQuote: true,
    headline:
      'I visualized this for myself. When I was selling copiers door to door, I had a very clear vision of what my life was going to be like.',
    description:
      'Years before Spanx existed she got specific about the life she wanted: an idea of her own, sold to millions of people, that made them feel good. When the idea finally appeared she was ready to recognise it — she had rehearsed the future before she knew what it looked like.',
  },
  {
    id: 'robbins-tony',
    avatar: '/case-studies/profile_03-TR-tony-robbins.jpg',
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
    avatar: '/case-studies/profile_04-MR-mel-robbins.jpg',
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
    avatar: '/case-studies/profile_05-JD-joe-dispenza.jpg',
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
