'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionTemplate } from 'framer-motion';
import type { ManifestoBeat } from '@/lib/manifesto';

const sizeClasses: Record<NonNullable<ManifestoBeat['size']>, string> = {
  md: 'text-2xl md:text-4xl',
  lg: 'text-3xl md:text-5xl',
  xl: 'text-4xl md:text-6xl',
};

export default function ManifestoSection({ beat, id }: { beat: ManifestoBeat; id?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'center center', 'end start'],
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
      data-snap-target=""
      className="flex min-h-[85vh] items-center justify-center px-6 py-24"
    >
      <motion.div
        style={{ opacity, y, filter }}
        className="max-w-3xl text-center"
      >
        {beat.lines.map((line, i) => (
          <p
            key={i}
            className={`${sizeClasses[beat.size ?? 'md']} ${
              beat.serif ? 'font-serif italic' : 'font-sans'
            } text-balance leading-snug text-[var(--foreground)]`}
          >
            {line}
          </p>
        ))}
      </motion.div>
    </div>
  );
}
