'use client';

import { motion } from 'framer-motion';
import { GenerationStatus } from '@/types';

interface GeneratingScreenProps {
  status: GenerationStatus;
  onRetry: () => void;
}

const stepIcons: Record<string, string> = {
  'generating-script': '✍️',
  'generating-voice': '🎙️',
  'generating-ambient': '🎵',
  'merging': '🎧',
  'error': '❌',
};

const steps = [
  { key: 'generating-script', label: 'Generating Script' },
  { key: 'generating-voice', label: 'Creating Voiceover' },
  { key: 'generating-ambient', label: 'Composing Ambient' },
  { key: 'merging', label: 'Merging Audio' },
];

export default function GeneratingScreen({ status, onRetry }: GeneratingScreenProps) {
  const currentStepIndex = steps.findIndex((s) => s.key === status.step);

  if (status.step === 'error') {
    return (
      <div className="min-h-screen animated-gradient-bg flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <span className="text-6xl mb-6 block">😔</span>
          <h2 className="text-2xl font-bold text-white mb-4">
            Something went wrong
          </h2>
          <p className="text-gray-400 mb-8">{status.message}</p>
          <button
            onClick={onRetry}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
          >
            Try Again
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen animated-gradient-bg flex items-center justify-center p-4">
      <div className="text-center max-w-lg w-full">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <motion.span
            key={status.step}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-7xl block"
          >
            {stepIcons[status.step] || '✨'}
          </motion.span>
        </motion.div>

        <motion.h2
          key={status.message}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-bold text-white mb-4"
        >
          {status.message}
        </motion.h2>

        {/* Progress bar */}
        <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden mb-8">
          <motion.div
            className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
            initial={{ width: 0 }}
            animate={{ width: `${status.progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>

        {/* Step indicators */}
        <div className="flex justify-center gap-8 mb-8">
          {steps.map((step, index) => {
            const isComplete = index < currentStepIndex;
            const isCurrent = index === currentStepIndex;

            return (
              <div key={step.key} className="flex flex-col items-center">
                <motion.div
                  className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                    isComplete
                      ? 'bg-green-500'
                      : isCurrent
                      ? 'bg-indigo-500'
                      : 'bg-gray-700'
                  }`}
                  animate={isCurrent ? { scale: [1, 1.1, 1] } : {}}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  {isComplete ? (
                    <span className="text-white">✓</span>
                  ) : (
                    <span className="text-white text-sm">{index + 1}</span>
                  )}
                </motion.div>
                <span
                  className={`text-xs ${
                    isCurrent ? 'text-white' : 'text-gray-500'
                  }`}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Animated dots */}
        <div className="flex justify-center gap-1">
          <span className="loading-dot w-2 h-2 bg-indigo-500 rounded-full" />
          <span className="loading-dot w-2 h-2 bg-indigo-500 rounded-full" />
          <span className="loading-dot w-2 h-2 bg-indigo-500 rounded-full" />
        </div>

        <p className="text-gray-500 mt-8 text-sm">
          This may take a minute or two. Please don&apos;t close this page.
        </p>
      </div>
    </div>
  );
}
