'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { GeneratedMeditation } from '@/types';

interface ResultScreenProps {
  meditation: GeneratedMeditation;
  userName: string;
  onCreateNew: () => void;
}

export default function ResultScreen({
  meditation,
  userName,
  onCreateNew,
}: ResultScreenProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen animated-gradient-bg flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl"
      >
        {/* Success header */}
        <div className="text-center mb-8">
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.2 }}
            className="text-6xl block mb-4"
          >
            🎉
          </motion.span>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Your meditation is ready, {userName}!
          </h1>
          <p className="text-gray-400">
            Duration: {formatDuration(meditation.duration)}
          </p>
        </div>

        {/* Audio preview card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass rounded-2xl p-6 mb-6"
        >
          <h3 className="text-lg font-semibold text-white mb-4">
            🎧 Preview (10 second sample)
          </h3>

          <audio
            ref={audioRef}
            src={meditation.sampleUrl}
            onEnded={() => setIsPlaying(false)}
          />

          <div className="flex items-center gap-4">
            <button
              onClick={togglePlay}
              className="w-14 h-14 bg-indigo-600 hover:bg-indigo-700 rounded-full flex items-center justify-center transition-colors"
            >
              {isPlaying ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 9v6m4-6v6"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-white ml-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                  />
                </svg>
              )}
            </button>

            <div className="flex-1">
              <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full w-0 bg-gradient-to-r from-indigo-500 to-purple-500 transition-all" />
              </div>
              <p className="text-gray-400 text-sm mt-2">
                Click play to preview your meditation
              </p>
            </div>
          </div>
        </motion.div>

        {/* Download section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass rounded-2xl p-6 mb-6"
        >
          <h3 className="text-lg font-semibold text-white mb-4">
            📥 Download Your Files
          </h3>

          <div className="space-y-3">
            <a
              href={meditation.mergedUrl}
              download={`meditation-${meditation.id}-full.mp3`}
              className="flex items-center justify-between p-4 bg-gray-800/50 hover:bg-gray-800 rounded-xl transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">🎵</span>
                <div>
                  <p className="text-white font-medium">Full Meditation</p>
                  <p className="text-gray-400 text-sm">Voice + Ambient Audio</p>
                </div>
              </div>
              <span className="text-indigo-400">Download</span>
            </a>

            <a
              href={meditation.voiceoverUrl}
              download={`meditation-${meditation.id}-voice.mp3`}
              className="flex items-center justify-between p-4 bg-gray-800/50 hover:bg-gray-800 rounded-xl transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">🎙️</span>
                <div>
                  <p className="text-white font-medium">Voice Only</p>
                  <p className="text-gray-400 text-sm">Without background music</p>
                </div>
              </div>
              <span className="text-indigo-400">Download</span>
            </a>

            <button
              onClick={() => setShowTranscript(!showTranscript)}
              className="w-full flex items-center justify-between p-4 bg-gray-800/50 hover:bg-gray-800 rounded-xl transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">📝</span>
                <div className="text-left">
                  <p className="text-white font-medium">Transcript</p>
                  <p className="text-gray-400 text-sm">Read the meditation script</p>
                </div>
              </div>
              <span className="text-indigo-400">
                {showTranscript ? 'Hide' : 'View'}
              </span>
            </button>

            {showTranscript && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="p-4 bg-gray-900/50 rounded-xl"
              >
                <pre className="text-gray-300 text-sm whitespace-pre-wrap font-sans leading-relaxed max-h-64 overflow-y-auto">
                  {meditation.script}
                </pre>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(meditation.script);
                  }}
                  className="mt-3 text-sm text-indigo-400 hover:text-indigo-300"
                >
                  Copy to clipboard
                </button>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Create new button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center"
        >
          <button
            onClick={onCreateNew}
            className="px-6 py-3 text-gray-400 hover:text-white transition-colors"
          >
            ← Create Another Meditation
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}
