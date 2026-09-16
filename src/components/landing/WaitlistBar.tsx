'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

type Status = 'idle' | 'loading' | 'success' | 'error';

const STORAGE_KEY = 'vunle-waitlist-joined';

export default function WaitlistBar() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.localStorage.getItem(STORAGE_KEY)) {
      setStatus('success');
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === 'loading' || status === 'success') return;

    setStatus('loading');
    setErrorMessage('');

    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong. Please try again.');
      }

      window.localStorage.setItem(STORAGE_KEY, 'true');
      setStatus('success');
    } catch (err) {
      setStatus('error');
      setErrorMessage(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    }
  };

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 px-4 pb-10 md:pb-14">
      <div className="mx-auto max-w-xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeOut', delay: 0.4 }}
          className="paper-card rounded-full p-2"
        >
          <AnimatePresence mode="wait" initial={false}>
            {status === 'success' ? (
              <motion.div
                key="success"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6 }}
                className="flex items-center justify-center gap-2 px-4 py-3 text-center"
              >
                <span className="text-sm text-[var(--ink)]">
                  You&rsquo;re on the list — we&rsquo;ll be in touch
                </span>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                onSubmit={handleSubmit}
                className="flex items-center gap-2"
              >
                <input
                  ref={inputRef}
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="min-w-0 flex-1 rounded-full bg-transparent px-5 py-3 text-sm text-[var(--ink)] placeholder:text-[var(--ink-faint)] focus:outline-none"
                />
                <motion.button
                  type="submit"
                  disabled={status === 'loading'}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="shrink-0 rounded-full bg-[var(--ink)] px-6 py-3 text-xs font-medium tracking-wide text-white transition-colors hover:bg-black disabled:opacity-60"
                >
                  {status === 'loading' ? 'Joining…' : 'Join the waitlist'}
                </motion.button>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
        <AnimatePresence>
          {status === 'error' && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-2 text-center text-xs text-rose-600"
            >
              {errorMessage}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
