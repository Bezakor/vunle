'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionTemplate, MotionValue } from 'framer-motion';
import { caseStudies } from '@/lib/caseStudies';

const AVATAR_GRADIENTS = [
  'radial-gradient(circle at 30% 30%, #b7a5ff, #4b3f7a 75%)',
  'radial-gradient(circle at 30% 30%, #ff9ecf, #7a3f63 75%)',
  'radial-gradient(circle at 30% 30%, #8fd9ff, #3f6b7a 75%)',
];

function Slide({ study, index, virtualIndex }: { study: (typeof caseStudies)[number]; index: number; virtualIndex: MotionValue<number> }) {
  const distance = useTransform(virtualIndex, (v) => Math.abs(v - index));
  const opacity = useTransform(distance, [0, 0.5, 1], [1, 1, 0]);
  const blur = useTransform(distance, [0, 0.5, 1], [0, 2, 14]);
  const scale = useTransform(distance, [0, 0.5, 1], [1, 0.98, 0.92]);
  const filter = useMotionTemplate`blur(${blur}px)`;

  return (
    <div
      className="flex h-full shrink-0 items-center justify-center px-6"
      style={{ width: `${100 / caseStudies.length}%` }}
    >
      <motion.div
        style={{ opacity, scale, filter }}
        className="waitlist-glass w-full max-w-xl rounded-3xl p-10 text-center"
      >
        <div
          className="mx-auto flex h-16 w-16 items-center justify-center rounded-full text-lg font-medium text-white"
          style={{ background: AVATAR_GRADIENTS[index % AVATAR_GRADIENTS.length] }}
        >
          {study.initials}
        </div>

        <p className="mt-6 text-xs uppercase tracking-[0.25em] text-[var(--dream-primary)]">{study.method}</p>

        <p className="mt-4 line-clamp-5 font-serif text-2xl italic leading-snug text-balance">
          {study.isQuote ? `“${study.headline}”` : study.headline}
        </p>

        <p className="mt-6 line-clamp-3 text-sm leading-relaxed text-[var(--dream-muted)]">{study.description}</p>

        <p className="mt-6 text-sm font-medium">{study.name}</p>
      </motion.div>
    </div>
  );
}

export default function CaseStudiesCarousel() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const smooth = useSpring(scrollYProgress, { stiffness: 60, damping: 25, mass: 0.6 });
  const virtualIndex = useTransform(smooth, [0, 1], [0, caseStudies.length - 1]);
  // The row is explicitly n*100% wide (one slide = 100% of the clipper each),
  // so translateX percentages resolve against that full track width, not the
  // clipper's own box — that mismatch was the earlier bug.
  const rowX = useTransform(virtualIndex, (v) => `-${(v * 100) / caseStudies.length}%`);

  const eyebrowOpacity = useTransform(smooth, [0, 0.06], [0, 1]);

  const handleSkip = () => {
    document.getElementById('manifesto-continue')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section ref={ref} data-snap-exclude="" className="relative" style={{ height: `${caseStudies.length * 100}vh` }}>
      <div className="sticky top-0 flex h-screen flex-col items-center justify-center overflow-hidden px-6 pb-24">
        <motion.p
          style={{ opacity: eyebrowOpacity }}
          className="mb-6 text-xs uppercase tracking-[0.3em] text-[var(--dream-muted)]"
        >
          Case studies
        </motion.p>

        <div className="relative h-[34rem] w-full max-w-[560px] overflow-hidden">
          <motion.div
            className="flex h-full"
            style={{ x: rowX, width: `${caseStudies.length * 100}%` }}
          >
            {caseStudies.map((study, i) => (
              <Slide key={study.id} study={study} index={i} virtualIndex={virtualIndex} />
            ))}
          </motion.div>
        </div>

        <button
          type="button"
          onClick={handleSkip}
          className="mt-6 text-xs uppercase tracking-[0.2em] text-[var(--dream-muted)] opacity-40 transition-opacity hover:opacity-80"
        >
          Skip the case studies
        </button>
      </div>
    </section>
  );
}
