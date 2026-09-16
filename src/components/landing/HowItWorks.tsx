'use client';

import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { howItWorks } from '@/lib/manifesto';
import { STEP_MEDIA } from '@/lib/stepsManifest';
import { scrollToElement } from '@/lib/smoothScroll';

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

/**
 * The mark at the top of a step: its clip from public/steps if there is one,
 * otherwise the line-drawn icon. The icon is also the fallback if a clip fails
 * to load, so a step is never left with a blank space above it.
 *
 * The clip replaces the icon rather than sitting above it — showing an
 * animation of a step and a drawing of the same step together reads as a
 * duplicate rather than a pair.
 */
function StepMark({ index, still }: { index: number; still: boolean }) {
  const [failed, setFailed] = useState(false);
  const media = STEP_MEDIA[index];

  if (!media || failed) {
    return (
      <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl border border-[var(--line)] text-[var(--ink)]">
        {ICONS[index]}
      </span>
    );
  }

  if (media.kind === 'image') {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={media.src} alt="" aria-hidden className="step-mark" onError={() => setFailed(true)} />
    );
  }

  return (
    <video
      className="step-mark"
      src={media.src}
      // Decorative, so it stays silent and out of the tab order. Paused under
      // reduced motion, where it shows its first frame instead of looping.
      autoPlay={!still}
      muted
      loop
      playsInline
      preload="metadata"
      aria-hidden
      tabIndex={-1}
      onError={() => setFailed(true)}
    />
  );
}

export default function HowItWorks() {
  const still = useReducedMotion() ?? false;

  // Walks to the next snap point in document order, the same way the chapter
  // arrows do, so this section finds the closing call to action without needing
  // to name it.
  const goNext = (e: React.MouseEvent<HTMLButtonElement>) => {
    const section = e.currentTarget.closest('[data-snap]');
    if (!section) return;
    const points = Array.from(document.querySelectorAll('[data-snap]'));
    scrollToElement(points[points.indexOf(section) + 1]);
  };

  return (
    <section
      data-snap=""
      // The arrow sits at a fixed offset from the bottom, so its band is reserved
      // here rather than left for the content to grow into — which is what the
      // step clips did, putting the caption straight through it.
      className="relative flex min-h-[85vh] flex-col items-center justify-center px-6 pt-24 pb-56"
    >
      {/* Wider than the type around it: the clips are interface demos with
          readable labels in them, not abstract marks, so they need the room. */}
      <div className="grid w-full max-w-5xl gap-5 md:grid-cols-3">
        {howItWorks.map((item, i) => (
          <motion.div
            key={item.step}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, ease: 'easeOut', delay: i * 0.12 }}
            className="paper-card rounded-2xl p-8 text-center"
          >
            <StepMark index={i} still={still} />
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
          className="arrow-button"
        >
          <span aria-hidden className="animate-bounce-gentle block text-sm">
            ↓
          </span>
        </button>
      </motion.div>
    </section>
  );
}
