'use client';

import type { RefObject } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';

export default function ScrollProgressBar({ targetRef }: { targetRef: RefObject<HTMLElement | null> }) {
  const { scrollYProgress } = useScroll({ target: targetRef, offset: ['start start', 'end end'] });
  const smooth = useSpring(scrollYProgress, { stiffness: 60, damping: 25, mass: 0.6 });

  const barOpacity = useTransform(smooth, [0, 0.03, 0.97, 1], [0, 1, 1, 0]);
  const scaleX = useTransform(smooth, (v) => Math.max(0, Math.min(1, v)));
  const orbLeft = useTransform(smooth, (v) => `${Math.max(0, Math.min(1, v)) * 100}%`);

  return (
    <motion.div
      style={{ opacity: barOpacity }}
      className="pointer-events-none fixed inset-x-0 top-0 z-40 h-px"
      aria-hidden
    >
      <div className="absolute inset-0" style={{ background: 'rgba(168, 156, 196, 0.15)' }} />
      <motion.div
        style={{
          scaleX,
          transformOrigin: 'left',
          background: 'linear-gradient(to right, transparent, rgba(183,165,255,0.6), #b7a5ff)',
        }}
        className="absolute inset-0"
      />
      <motion.div
        style={{
          left: orbLeft,
          background: '#b7a5ff',
          boxShadow: '0 0 14px 4px rgba(183,165,255,0.65)',
        }}
        className="absolute top-1/2 h-[6px] w-[6px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[1px]"
      />
    </motion.div>
  );
}
