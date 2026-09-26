'use client';

import { useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useWaitlist } from './waitlistState';

/**
 * Where the form is standing. It opens under the hero headline, rides the foot
 * of the window through the middle of the page, and comes to rest in the
 * closing section under "Join the waitlist below." The state behind it lives in
 * WaitlistProvider, so moving between the three costs the reader nothing.
 */
export type WaitlistPlace = 'hero' | 'bar' | 'closing';

const PLACE_CLASS: Record<WaitlistPlace, string> = {
  hero: 'mt-10 w-full max-w-xl',
  bar: 'fixed inset-x-0 bottom-0 z-50 px-4 pb-10 md:pb-14',
  closing: 'relative z-10 mt-8 w-full max-w-xl',
};

export default function WaitlistBar({
  place = 'bar',
  visible = true,
}: {
  place?: WaitlistPlace;
  /** The closing section keeps the form's space reserved before the reader
   *  arrives, so stepping into it doesn't shove the lines above it up the
   *  screen. Hidden rather than absent: `visibility` takes it out of the tab
   *  order and off screen readers while it still holds its ground. */
  visible?: boolean;
}) {
  const { email, setEmail, status, errorMessage, submit } = useWaitlist();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void submit();
  };

  return (
    <motion.div
      // The bar arrives from below the fold. The other two are part of the
      // composition they sit in, so they fade up with the card below rather
      // than sliding in on their own.
      initial={place === 'bar' ? { opacity: 0, y: 20 } : false}
      animate={{ opacity: visible ? 1 : 0, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      style={{ visibility: visible ? 'visible' : 'hidden' }}
      data-waitlist={place}
      className={PLACE_CLASS[place]}
    >
      <div className="mx-auto max-w-xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeOut', delay: place === 'hero' ? 0.4 : 0 }}
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
                  aria-label="Email address"
                  className="min-w-0 flex-1 rounded-full bg-transparent px-4 py-3 text-sm text-[var(--ink)] placeholder:text-[var(--ink-faint)] focus:outline-none sm:px-5"
                />
                <motion.button
                  type="submit"
                  disabled={status === 'loading'}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="shrink-0 rounded-full bg-[var(--ink)] px-4 py-3 text-[10px] font-medium tracking-wide text-white transition-colors hover:bg-black disabled:opacity-60 sm:px-6 sm:text-xs"
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
    </motion.div>
  );
}
