import { Question } from '@/types';

export const questions: Question[] = [
  {
    id: 'name',
    question: "What's your first name?",
    subtext: "We'll use this to personalize your meditation",
    type: 'text',
    placeholder: 'Enter your name...',
  },
  {
    id: 'intention',
    question: 'What brings you here today?',
    subtext: 'Choose your primary intention for this meditation',
    type: 'select',
    options: [
      { value: 'relaxation', label: 'Deep Relaxation', emoji: '🌊' },
      { value: 'sleep', label: 'Better Sleep', emoji: '🌙' },
      { value: 'focus', label: 'Improved Focus', emoji: '🎯' },
      { value: 'anxiety', label: 'Anxiety Relief', emoji: '🍃' },
      { value: 'confidence', label: 'Build Confidence', emoji: '✨' },
      { value: 'healing', label: 'Emotional Healing', emoji: '💚' },
    ],
  },
  {
    id: 'stressLevel',
    question: 'How would you describe your current stress level?',
    subtext: "Be honest - there's no wrong answer",
    type: 'select',
    options: [
      { value: 'low', label: 'Pretty calm', emoji: '😌' },
      { value: 'moderate', label: 'Somewhat stressed', emoji: '😐' },
      { value: 'high', label: 'Very stressed', emoji: '😰' },
      { value: 'overwhelmed', label: 'Completely overwhelmed', emoji: '😫' },
    ],
  },
  {
    id: 'preferredScene',
    question: 'Where would you like to go in your mind?',
    subtext: 'Choose a visualization setting that appeals to you',
    type: 'select',
    options: [
      { value: 'beach', label: 'Peaceful Beach', emoji: '🏖️' },
      { value: 'forest', label: 'Serene Forest', emoji: '🌲' },
      { value: 'mountain', label: 'Mountain Summit', emoji: '🏔️' },
      { value: 'garden', label: 'Tranquil Garden', emoji: '🌸' },
      { value: 'space', label: 'Floating in Space', emoji: '🌌' },
      { value: 'cozy', label: 'Cozy Cabin', emoji: '🏡' },
    ],
  },
  {
    id: 'duration',
    question: 'How long would you like your meditation to be?',
    subtext: 'Choose a duration that fits your schedule',
    type: 'select',
    options: [
      { value: '5', label: '5 minutes', emoji: '⚡' },
      { value: '10', label: '10 minutes', emoji: '⏱️' },
      { value: '15', label: '15 minutes', emoji: '🕐' },
      { value: '20', label: '20 minutes', emoji: '🕑' },
    ],
  },
  {
    id: 'voiceGender',
    question: 'What type of voice would you prefer?',
    subtext: 'Choose the voice that feels most comfortable to you',
    type: 'select',
    options: [
      { value: 'female', label: 'Soft Female Voice', emoji: '👩' },
      { value: 'male', label: 'Calm Male Voice', emoji: '👨' },
    ],
  },
  {
    id: 'specificFocus',
    question: 'Is there anything specific you want to focus on?',
    subtext: 'Optional: Share any personal details to make this meditation truly yours',
    type: 'textarea',
    placeholder: 'e.g., "I have a big presentation tomorrow" or "I want to let go of a recent argument"...',
  },
];
