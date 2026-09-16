'use client';

import type { RefObject } from 'react';
import { useCallback } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';

export default function ScrollProgressBar({ targetRef }: { targetRef: RefObject<HTMLElement | null> }) {
  const { scrollYProgress } = useScroll({ target: targetRef, offset: ['start start', 'end end'] });
  const smooth = useSpring(scrollYProgress, { stiffness: 60, damping: 25, mass: 0.6 });

  const barOpacity = useTransform(smooth, [0, 0.03, 0.97, 1], [0, 1, 1, 0]);
  const scaleX = useTransform(smooth, (v) => Math.max(0, Math.min(1, v)));
  const orbLeft = useTransform(smooth, (v) => `${Math.max(0, Math.min(1, v)) * 100}%`);

  // Jump straight into the manifesto journey at the clicked fraction; native
  // scroll-snap then settles the page on whichever section sits nearest.
  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const journey = targetRef.current;
      if (!journey) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const fraction = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      const journeyRect = journey.getBoundingClientRect();
      const top = journeyRect.top + window.scrollY;
      window.scrollTo({ top: top + fraction * journey.scrollHeight, behavior: 'smooth' });
    },
    [targetRef]
  );

  return (
    <div
      onClick={handleClick}
      role="button"
      aria-label="Jump to a section of the manifesto"
      className="fixed inset-x-0 top-0 z-40 h-4 cursor-pointer"
    >
      <motion.div style={{ opacity: barOpacity }} className="pointer-events-none absolute inset-x-0 top-0 h-px" aria-hidden>
        <div className="absolute inset-0" style={{ background: 'rgba(17, 17, 17, 0.08)' }} />
        <motion.div
          style={{
            scaleX,
            transformOrigin: 'left',
            background: 'linear-gradient(to right, transparent, rgba(17,17,17,0.35), #111111)',
          }}
          className="absolute inset-0"
        />
        <motion.div
          style={{
            left: orbLeft,
            background: '#111111',
            boxShadow: '0 0 10px 2px rgba(17,17,17,0.25)',
          }}
          className="absolute top-1/2 h-[5px] w-[5px] -translate-x-1/2 -translate-y-1/2 rounded-full"
        />
      </motion.div>
    </div>
  );
}
