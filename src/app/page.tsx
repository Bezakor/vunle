'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { questions } from '@/lib/questions';
import { OnboardingAnswers, GenerationStatus, GeneratedMeditation } from '@/types';
import QuestionCard from '@/components/QuestionCard';
import ProgressBar from '@/components/ProgressBar';
import GeneratingScreen from '@/components/GeneratingScreen';
import ResultScreen from '@/components/ResultScreen';

const initialAnswers: OnboardingAnswers = {
  name: '',
  intention: '',
  stressLevel: '',
  preferredScene: '',
  duration: '',
  voiceGender: '',
  specificFocus: '',
};

export default function Home() {
  const [started, setStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<OnboardingAnswers>(initialAnswers);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStatus, setGenerationStatus] = useState<GenerationStatus>({
    step: 'idle',
    message: '',
    progress: 0,
  });
  const [meditation, setMeditation] = useState<GeneratedMeditation | null>(null);

  const handleAnswer = (questionId: keyof OnboardingAnswers, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      handleGenerate();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
    }
  };

  const handleGenerate = async () => {
    setIsGenerating(true);

    try {
      // Step 1: Generate script
      setGenerationStatus({
        step: 'generating-script',
        message: 'Crafting your personalized meditation script...',
        progress: 10,
      });

      const scriptResponse = await fetch('/api/generate-script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(answers),
      });

      if (!scriptResponse.ok) {
        throw new Error('Failed to generate script');
      }

      const { script, meditationId } = await scriptResponse.json();

      // Step 2: Generate voiceover
      setGenerationStatus({
        step: 'generating-voice',
        message: 'Creating your soothing voiceover...',
        progress: 30,
      });

      const voiceResponse = await fetch('/api/generate-voice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          script,
          voiceGender: answers.voiceGender,
          meditationId,
        }),
      });

      if (!voiceResponse.ok) {
        throw new Error('Failed to generate voiceover');
      }

      const { voiceoverUrl, duration } = await voiceResponse.json();

      // Step 3: Generate ambient audio
      setGenerationStatus({
        step: 'generating-ambient',
        message: 'Composing ambient soundscape...',
        progress: 60,
      });

      const ambientResponse = await fetch('/api/generate-ambient', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scene: answers.preferredScene,
          duration,
          meditationId,
        }),
      });

      if (!ambientResponse.ok) {
        throw new Error('Failed to generate ambient audio');
      }

      const { ambientUrl } = await ambientResponse.json();

      // Step 4: Merge audio
      setGenerationStatus({
        step: 'merging',
        message: 'Blending your meditation experience...',
        progress: 85,
      });

      const mergeResponse = await fetch('/api/merge-audio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          voiceoverUrl,
          ambientUrl,
          meditationId,
        }),
      });

      if (!mergeResponse.ok) {
        throw new Error('Failed to merge audio');
      }

      const { mergedUrl, sampleUrl } = await mergeResponse.json();

      setGenerationStatus({
        step: 'complete',
        message: 'Your meditation is ready!',
        progress: 100,
      });

      setMeditation({
        id: meditationId,
        script,
        voiceoverUrl,
        ambientUrl,
        mergedUrl,
        sampleUrl,
        duration,
        createdAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Generation error:', error);
      setGenerationStatus({
        step: 'error',
        message: error instanceof Error ? error.message : 'Something went wrong. Please try again.',
        progress: 0,
      });
    }
  };

  const handleReset = () => {
    setStarted(false);
    setCurrentQuestion(0);
    setAnswers(initialAnswers);
    setIsGenerating(false);
    setGenerationStatus({ step: 'idle', message: '', progress: 0 });
    setMeditation(null);
  };

  // Landing screen
  if (!started) {
    return (
      <div className="min-h-screen animated-gradient-bg flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-2xl"
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mb-8"
          >
            <span className="text-6xl">🧘</span>
          </motion.div>

          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            <span className="gradient-text">MindScape</span>
          </h1>

          <p className="text-lg md:text-xl text-gray-400 mb-8">
            Create personalized guided meditations crafted just for you using AI.
            Answer a few questions and receive a unique meditation experience.
          </p>

          <motion.button
            onClick={() => setStarted(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full text-lg font-medium transition-colors animate-pulse-glow"
          >
            Begin Your Journey
          </motion.button>

          <p className="mt-8 text-sm text-gray-500">
            Takes about 2 minutes to complete
          </p>
        </motion.div>
      </div>
    );
  }

  // Generating screen
  if (isGenerating && generationStatus.step !== 'complete') {
    return (
      <GeneratingScreen
        status={generationStatus}
        onRetry={handleGenerate}
      />
    );
  }

  // Result screen
  if (meditation) {
    return (
      <ResultScreen
        meditation={meditation}
        userName={answers.name}
        onCreateNew={handleReset}
      />
    );
  }

  // Onboarding questions
  const question = questions[currentQuestion];
  const canProceed =
    question.type === 'textarea' || answers[question.id]?.trim() !== '';

  return (
    <div className="min-h-screen animated-gradient-bg flex flex-col">
      <ProgressBar
        current={currentQuestion + 1}
        total={questions.length}
      />

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          <AnimatePresence mode="wait">
            <QuestionCard
              key={question.id}
              question={question}
              value={answers[question.id]}
              onChange={(value) => handleAnswer(question.id, value)}
              onNext={handleNext}
              canProceed={canProceed}
            />
          </AnimatePresence>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex justify-between mt-8"
          >
            <button
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className="px-6 py-2 text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              ← Back
            </button>

            <span className="text-gray-500">
              {currentQuestion + 1} of {questions.length}
            </span>

            <button
              onClick={handleNext}
              disabled={!canProceed}
              className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
            >
              {currentQuestion === questions.length - 1 ? 'Create Meditation' : 'Next →'}
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
