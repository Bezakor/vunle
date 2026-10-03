'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { planById } from '@/lib/plans';

type Status = 'idle' | 'loading' | 'success' | 'error';

/** Formspree takes the brief; the endpoint is public by design. */
const FORMSPREE_ENDPOINT = 'https://formspree.io/f/mdekqvnq';

/**
 * The brief. The package chosen on the landing page rides in the URL and is
 * sent along with the answers, so each submission says what it is for — and is
 * named on screen, so nobody has to remember which button they pressed.
 */
export default function StartForm() {
  const plan = planById(useSearchParams().get('plan'));

  const [name, setName] = useState('');
  const [goal, setGoal] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === 'loading' || status === 'success') return;

    setStatus('loading');
    setErrorMessage('');

    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Without this Formspree replies with its own HTML thank-you page
          // instead of JSON, and a redirect we don't want.
          Accept: 'application/json',
        },
        body: JSON.stringify({
          name,
          goal,
          email,
          plan: plan ? `${plan.name} (${plan.price})` : 'Not specified',
        }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        // Formspree reports problems as an `errors` array; fall back to a
        // generic message if it sends something we don't recognise.
        const detail = Array.isArray(data?.errors)
          ? data.errors.map((err: { message?: string }) => err.message).filter(Boolean).join(' ')
          : '';
        throw new Error(detail || 'Something went wrong. Please try again.');
      }

      setStatus('success');
    } catch (err) {
      setStatus('error');
      setErrorMessage(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    }
  };

  return (
    <div className="w-full max-w-xl">
      <AnimatePresence mode="wait" initial={false}>
        {status === 'success' ? (
          <motion.div
            key="done"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="paper-card rounded-2xl px-8 py-12 text-center"
          >
            <h1 className="text-xl font-normal tracking-tight text-[var(--ink)] md:text-2xl">
              Thank you — we have your brief.
            </h1>
            <p className="mt-4 text-sm leading-relaxed text-[var(--ink-soft)]">
              We&rsquo;ll be in touch at {email} with what happens next.
            </p>
            <Link href="/" className="mt-8 inline-block text-[10px] uppercase tracking-[0.25em] text-[var(--ink-faint)] transition-colors hover:text-[var(--ink)]">
              Back to the start
            </Link>
          </motion.div>
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          >
            <h1 className="text-center text-2xl leading-[1.2] font-normal tracking-tight text-balance text-[var(--ink)] md:text-3xl">
              Let&rsquo;s get started.
            </h1>
            <p className="mt-4 text-center text-sm leading-relaxed text-balance text-[var(--ink-soft)] md:text-base">
              Very briefly describe your goals and obstacles.
            </p>

            {plan && (
              <p className="mt-6 text-center">
                <span className="start-plan-chip">
                  {plan.name} · {plan.price}
                </span>
              </p>
            )}

            <form onSubmit={handleSubmit} className="paper-card mt-8 space-y-6 rounded-2xl p-7 md:p-9">
              <div>
                <label htmlFor="name" className="start-label">
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="start-field"
                />
              </div>

              <div>
                <label htmlFor="goal" className="start-label">
                  Briefly describe your goal, dream, obstacle or challenge
                </label>
                <textarea
                  id="goal"
                  name="goal"
                  required
                  rows={5}
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  className="start-field resize-y"
                />
              </div>

              <div>
                <label htmlFor="email" className="start-label">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="start-field"
                />
              </div>

              <motion.button
                type="submit"
                disabled={status === 'loading'}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full cursor-pointer rounded-full bg-[var(--ink)] px-6 py-4 text-xs font-medium tracking-wide text-white transition-colors hover:bg-black disabled:opacity-60"
              >
                {status === 'loading' ? 'Sending…' : 'Submit'}
              </motion.button>

              {status === 'error' && (
                <p className="text-center text-xs text-rose-600">{errorMessage}</p>
              )}
            </form>

            <p className="mt-8 text-center">
              <Link href="/" className="text-[10px] uppercase tracking-[0.25em] text-[var(--ink-faint)] transition-colors hover:text-[var(--ink)]">
                Back to the start
              </Link>
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
