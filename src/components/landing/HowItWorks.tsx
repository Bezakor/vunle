'use client';

import { motion } from 'framer-motion';
import { howItWorks } from '@/lib/manifesto';

/**
 * Three simple line marks, drawn to match the mono/hairline feel of the rest of
 * the page: a nib for describing the goal, a waveform for the voice, and
 * ripples for the sound world it sits in.
 */
const ICONS = [
  // Nib — writing the goal in your own words.
  <svg key="goal" viewBox="0 0 24 24" fill="none" width="22" height="22" aria-hidden>
    <path d="M4 20l1-4L16 5l3 3L8 19l-4 1z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
    <path d="M14 7l3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
  </svg>,
  // Waveform — the voice speaking it.
  <svg key="voice" viewBox="0 0 24 24" fill="none" width="22" height="22" aria-hidden>
    <g stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
      <path d="M4 11v2" />
      <path d="M8 8v8" />
      <path d="M12 4v16" />
      <path d="M16 7v10" />
      <path d="M20 10v4" />
    </g>
  </svg>,
  // Ripples — the ambiance around it.
  <svg key="ambiance" viewBox="0 0 24 24" fill="none" width="22" height="22" aria-hidden>
    <circle cx="12" cy="12" r="2" stroke="currentColor" strokeWidth="1.4" />
    <path d="M7.5 7.5a6.4 6.4 0 000 9M16.5 16.5a6.4 6.4 0 000-9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    <path d="M4.5 4.5a10.6 10.6 0 000 15M19.5 19.5a10.6 10.6 0 000-15" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
  </svg>,
];

export default function HowItWorks() {
  // Walks to the next snap point in document order, the same way the chapter
  // arrows do, so this section finds the closing call to action without needing
  // to name it.
  const goNext = (e: React.MouseEvent<HTMLButtonElement>) => {
    const section = e.currentTarget.closest('[data-snap]');
    if (!section) return;
    const points = Array.from(document.querySelectorAll('[data-snap]'));
    points[points.indexOf(section) + 1]?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      data-snap=""
      className="relative flex min-h-[85vh] flex-col items-center justify-center px-6 py-24"
    >
      <div className="grid w-full max-w-4xl gap-5 md:grid-cols-3">
        {howItWorks.map((item, i) => (
          <motion.div
            key={item.step}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, ease: 'easeOut', delay: i * 0.12 }}
            className="paper-card rounded-2xl p-8 text-center"
          >
            <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl border border-[var(--line)] text-[var(--ink)]">
              {ICONS[i]}
            </span>
            <span className="mt-5 block text-xs tracking-[0.2em] text-[var(--ink-faint)]">{item.step}</span>
            <h3 className="mt-3 text-base font-medium">{item.title}</h3>
            <p className="mt-3 text-xs leading-relaxed text-[var(--ink-soft)]">{item.detail}</p>
          </motion.div>
        ))}
      </div>

      <motion.p
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.45 }}
        className="mt-14 max-w-2xl text-center text-xl leading-relaxed tracking-tight text-balance text-[var(--ink)] md:text-3xl"
      >
        Download &amp; listen to your personal visualisation guide.
      </motion.p>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.7 }}
        className="absolute bottom-32 md:bottom-36 left-1/2 -translate-x-1/2"
      >
        <button
          type="button"
          onClick={goNext}
          aria-label="Go to the next section"
          className="cursor-pointer p-3 text-[var(--ink)] transition-opacity hover:opacity-60"
        >
          <span aria-hidden className="animate-bounce-gentle block text-sm">
            ↓
          </span>
        </button>
      </motion.div>
    </section>
  );
}
