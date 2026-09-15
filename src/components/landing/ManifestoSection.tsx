'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionTemplate } from 'framer-motion';
import type { ManifestoBeat } from '@/lib/manifesto';
import ChapterAssets from './ChapterAssets';

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

          return (
            <p
              key={i}
              className={`text-xl leading-relaxed tracking-tight text-balance md:text-3xl ${
                spaced ? 'mt-6 md:mt-10' : ''
              } ${accent ? 'text-[var(--ink)]' : 'text-[var(--ink-soft)]'}`}
            >
              {line}
            </p>
          );
        })}
      </motion.div>
    </div>
  );
}
