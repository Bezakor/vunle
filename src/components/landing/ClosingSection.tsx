'use client';

import { useEffect, useRef, useState } from 'react';
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion';
import OrbitField from './OrbitField';

/**
 * The closing call to action. Hovering it bursts the landing page's assets out
 * of the centre of the screen, where they settle into exactly the arrangement
 * the hero opens with — it's the same OrbitField and the same placements, not a
 * lookalike. Scrolling back up draws them in again and the section is left
 * bare, so the burst replays on the next visit.
 *
 * A full viewport tall so its top can actually reach the top of the screen: at
 * 70vh the page bottomed out 270px short, leaving the section unable to settle
 * and the arrow above it unable to land.
 */
export default function ClosingSection() {
  const ref = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion() ?? false;
  const [burst, setBurst] = useState(false);

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'start start'] });

  // Once the section is most of the way back off the bottom of the screen the
  // user has scrolled up past it, so pull the assets back into the centre.
  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    if (p < 0.45) setBurst(false);
  });

  const target = useMotionValue(0);
  // Underdamped on purpose: the assets overshoot their ring slightly and settle
  // back, which is what makes it read as a burst rather than a zoom.
  const spread = useSpring(target, { stiffness: 42, damping: 13, mass: 0.9 });
  const opacity = useTransform(spread, [0, 0.22, 0.9], [0, 0.55, 1]);

  useEffect(() => {
    target.set(burst ? 1 : 0);
  }, [burst, target]);

  // Touch devices never fire a hover, so arm the burst once the section is
  // properly on screen instead — otherwise it would simply never play there.
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof window === 'undefined') return;
    if (window.matchMedia('(hover: hover)').matches) return;

    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setBurst(true)),
      { threshold: 0.5 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      id="closing-cta"
      data-snap=""
      onPointerEnter={() => setBurst(true)}
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 pb-44 text-center"
    >
      <OrbitField spread={reduceMotion ? undefined : spread} opacity={reduceMotion ? undefined : opacity} />

      <motion.h2
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.9, ease: 'easeOut' }}
        className="relative z-10 max-w-2xl text-2xl leading-snug tracking-tight text-balance md:text-4xl"
      >
        Be the first to visualise your future
      </motion.h2>
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, delay: 0.25 }}
        className="relative z-10 mt-5 text-sm text-[var(--ink-soft)]"
      >
        Join the waitlist below.
      </motion.p>
    </section>
  );
}
