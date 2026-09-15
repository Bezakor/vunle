'use client';

import { useRef, useState } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionTemplate,
  useMotionValueEvent,
  useReducedMotion,
} from 'framer-motion';
import type { ManifestoBeat } from '@/lib/manifesto';
import ChapterAssets from './ChapterAssets';

/** Seconds between each word lighting up. */
const WORD_STAGGER = 0.07;

/**
 * The chapter's closing line, revealed a word at a time once the chapter
 * arrives. Rendered as inline-block spans so the words still wrap as normal
 * text; `whitespace-pre` keeps the space that sits inside each span, which an
 * inline-block would otherwise collapse.
 */
function RevealingLine({
  line,
  className,
  revealed,
  instant,
}: {
  line: string;
  className: string;
  revealed: boolean;
  instant: boolean;
}) {
  const words = line.split(' ');

  return (
    <p className={className}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          className="inline-block whitespace-pre"
          initial={false}
          animate={{ opacity: revealed || instant ? 1 : 0, y: revealed || instant ? 0 : 6 }}
          transition={
            instant
              ? { duration: 0 }
              : { duration: 0.34, ease: 'easeOut', delay: revealed ? i * WORD_STAGGER : 0 }
          }
        >
          {i < words.length - 1 ? word + ' ' : word}
        </motion.span>
      ))}
    </p>
  );
}

export default function ManifestoSection({
  beat,
  id,
  index = 0,
}: {
  beat: ManifestoBeat;
  id?: string;
  index?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  // The midpoint has to be the position the section actually comes to rest in,
  // which is its top aligned to the top of the viewport — that's where
  // SectionSnap parks it. Measuring to `center center` instead put the sharp,
  // fully-opaque point half a viewport away from where the section settles, so
  // the text stayed slightly blurred once it stopped moving.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'start start', 'end start'],
  });

  const smooth = useSpring(scrollYProgress, { stiffness: 60, damping: 25, mass: 0.6 });

  const opacity = useTransform(smooth, [0, 0.45, 0.55, 1], [0, 1, 1, 0]);
  const y = useTransform(smooth, [0, 0.5, 1], [36, 0, -36]);
  const blur = useTransform(smooth, [0, 0.5, 1], [10, 0, 10]);
  const filter = useMotionTemplate`blur(${blur}px)`;

  // The arrow comes and goes with the chapter, and stops accepting clicks once
  // it has faded — otherwise every chapter's arrow would still be catching
  // clicks through the one on screen.
  const arrowEvents = useTransform(opacity, (v) => (v > 0.6 ? 'auto' : 'none'));

  // The closing line reveals itself once the chapter has actually arrived —
  // progress 0.5 is its resting position — and resets once the chapter is well
  // clear of the screen, so it plays again next time rather than only once per
  // page load. The two thresholds are deliberately far apart: a single one
  // would flip back and forth while the section hovers around it.
  const instant = useReducedMotion() ?? false;
  const [revealed, setRevealed] = useState(false);

  useMotionValueEvent(smooth, 'change', (v) => {
    const distance = Math.abs(v - 0.5);
    setRevealed((prev) => (distance < 0.14 ? true : distance > 0.34 ? false : prev));
  });

  // Walks to the next snap point in document order rather than looking up an
  // id, so each chapter finds its neighbour without every chapter needing a
  // name — and the chapter before the carousel correctly lands on it.
  const goNext = () => {
    const el = ref.current;
    if (!el) return;
    const points = Array.from(document.querySelectorAll('[data-snap]'));
    points[points.indexOf(el) + 1]?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div
      ref={ref}
      id={id}
      data-snap=""
      className="relative flex min-h-[85vh] items-center justify-center px-6 py-24"
    >
      <ChapterAssets progress={scrollYProgress} index={index} />

      <motion.div style={{ opacity, y, filter }} className="relative z-10 max-w-3xl text-center">
        {beat.lines.map((line, i) => {
          const isClosing = !beat.flat && i === beat.lines.length - 1 && beat.lines.length > 1;
          const accent = isClosing || beat.accentLines?.includes(i);
          const spaced = isClosing || beat.gapAfter?.includes(i - 1);

          const classes = `text-xl leading-relaxed tracking-tight text-balance md:text-3xl ${
            spaced ? 'mt-6 md:mt-10' : ''
          } ${accent ? 'text-[var(--ink)]' : 'text-[var(--ink-soft)]'}`;

          if (isClosing) {
            return (
              <RevealingLine
                key={i}
                line={line}
                className={classes}
                revealed={revealed}
                instant={instant}
              />
            );
          }

          return (
            <p key={i} className={classes}>
              {line}
            </p>
          );
        })}
      </motion.div>

      <motion.div
        style={{ opacity, pointerEvents: arrowEvents }}
        className="absolute bottom-32 md:bottom-36 left-1/2 z-10 -translate-x-1/2"
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
    </div>
  );
}
