export interface OnboardingAnswers {
  name: string;
  intention: string;
  stressLevel: string;
  preferredScene: string;
  duration: string;
  voiceGender: string;
  specificFocus: string;
}

export interface Question {
  id: keyof OnboardingAnswers;
  question: string;
  subtext?: string;
  type: 'text' | 'select' | 'textarea';
  options?: { value: string; label: string; emoji?: string }[];
  placeholder?: string;
}

export interface GeneratedMeditation {
  id: string;
  script: string;
  voiceoverUrl: string;
  ambientUrl: string;
  mergedUrl: string;
  sampleUrl: string;
  duration: number;
  createdAt: string;
}

export interface GenerationStatus {
  step: 'idle' | 'generating-script' | 'generating-voice' | 'generating-ambient' | 'merging' | 'complete' | 'error';
  message: string;
  progress: number;
}
