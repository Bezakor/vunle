'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

type Status = 'idle' | 'loading' | 'success' | 'error';

const STORAGE_KEY = 'vunle-waitlist-joined';

/** Formspree collects the waitlist; the endpoint is public by design. */
const FORMSPREE_ENDPOINT = 'https://formspree.io/f/mnpnaono';

interface Waitlist {
  email: string;
  setEmail: (value: string) => void;
  status: Status;
  errorMessage: string;
  submit: () => Promise<void>;
}

const WaitlistContext = createContext<Waitlist | null>(null);

/**
 * The state behind the email form, held above the places it appears.
 *
 * The form shows up in three places as the page goes by — under the hero
 * headline, in the bar across the foot of the window, and in the closing
 * section — and only one of them is mounted at a time. Keeping what has been
 * typed, and whether it has been sent, up here means moving between them costs
 * the reader nothing.
 */
export function WaitlistProvider({ children }: { children: React.ReactNode }) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined' && window.localStorage.getItem(STORAGE_KEY)) {
      setStatus('success');
    }
  }, []);

  const submit = useCallback(async () => {
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
        body: JSON.stringify({ email }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        // Formspree reports problems as an `errors` array; fall back to a
        // generic message if it sends something we don't recognise.
        const detail = Array.isArray(data?.errors)
          ? data.errors.map((e: { message?: string }) => e.message).filter(Boolean).join(' ')
          : '';
        throw new Error(detail || 'Something went wrong. Please try again.');
      }

      window.localStorage.setItem(STORAGE_KEY, 'true');
      setStatus('success');
    } catch (err) {
      setStatus('error');
      setErrorMessage(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    }
  }, [email, status]);

  const value = useMemo(
    () => ({ email, setEmail, status, errorMessage, submit }),
    [email, status, errorMessage, submit],
  );

  return <WaitlistContext.Provider value={value}>{children}</WaitlistContext.Provider>;
}

export function useWaitlist() {
  const value = useContext(WaitlistContext);
  if (!value) throw new Error('useWaitlist must be used inside a WaitlistProvider');
  return value;
}
