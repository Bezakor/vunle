'use client';

import { motion } from 'framer-motion';
import { Question } from '@/types';

interface QuestionCardProps {
  question: Question;
  value: string;
  onChange: (value: string) => void;
  onNext: () => void;
  canProceed: boolean;
}

export default function QuestionCard({
  question,
  value,
  onChange,
  onNext,
  canProceed,
}: QuestionCardProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && canProceed && question.type !== 'textarea') {
      onNext();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="w-full"
    >
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-3xl md:text-4xl font-bold text-white mb-3"
      >
        {question.question}
      </motion.h2>

      {question.subtext && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-gray-400 mb-8 text-lg"
        >
          {question.subtext}
        </motion.p>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        {question.type === 'text' && (
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={question.placeholder}
            autoFocus
            className="w-full bg-transparent border-b-2 border-gray-600 focus:border-indigo-500 text-2xl text-white py-4 outline-none transition-colors placeholder-gray-500"
          />
        )}

        {question.type === 'textarea' && (
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={question.placeholder}
            autoFocus
            rows={4}
            className="w-full bg-gray-800/50 border border-gray-600 focus:border-indigo-500 rounded-xl text-lg text-white p-4 outline-none transition-colors placeholder-gray-500 resize-none"
          />
        )}

        {question.type === 'select' && question.options && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {question.options.map((option, index) => (
              <motion.button
                key={option.value}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.05 }}
                onClick={() => {
                  onChange(option.value);
                  setTimeout(onNext, 300);
                }}
                className={`p-4 rounded-xl text-left transition-all duration-200 ${
                  value === option.value
                    ? 'bg-indigo-600 border-2 border-indigo-400 scale-[1.02]'
                    : 'bg-gray-800/50 border-2 border-gray-700 hover:border-gray-500 hover:bg-gray-800'
                }`}
              >
                <span className="text-2xl mr-3">{option.emoji}</span>
                <span className="text-lg text-white">{option.label}</span>
              </motion.button>
            ))}
          </div>
        )}
      </motion.div>

      {question.type === 'text' && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-4 text-gray-500 text-sm"
        >
          Press Enter to continue
        </motion.p>
      )}
    </motion.div>
  );
}
