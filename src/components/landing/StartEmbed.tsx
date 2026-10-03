'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { planById, plans } from '@/lib/plans';

/**
 * The brief, which is a Google Form embedded in its own page. The package
 * chosen on the landing page rides in the URL and decides which form loads,
 * and is named above it so nobody has to remember which button they pressed.
 *
 * The frame is a fixed height because nothing on this side can measure what is
 * inside it: the form is on Google's origin, so its height is not readable from
 * here. The heights below leave room for the form to wrap on a narrow screen;
 * if it outgrows them it scrolls within the frame rather than being cut off.
 */
export default function StartEmbed() {
  const plan = planById(useSearchParams().get('plan')) ?? plans.find((p) => p.featured) ?? plans[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      className="w-full max-w-2xl"
    >
      <h1 className="text-center text-2xl leading-[1.2] font-normal tracking-tight text-balance text-[var(--ink)] md:text-3xl">
        Let&rsquo;s get started.
      </h1>
      <p className="mt-4 text-center text-sm leading-relaxed text-balance text-[var(--ink-soft)] md:text-base">
        Very briefly describe your goals and obstacles.
      </p>

      <p className="mt-6 text-center">
        <span className="start-plan-chip">
          {plan.name} · {plan.price}
        </span>
      </p>

      <div className="start-embed paper-card mt-8">
        <iframe
          src={plan.formUrl}
          title={`${plan.name} — tell us about your goal`}
          className="start-embed__frame"
          loading="lazy"
        >
          Loading…
        </iframe>
      </div>

      <p className="mt-8 text-center">
        <Link
          href="/"
          className="text-[10px] uppercase tracking-[0.25em] text-[var(--ink-faint)] transition-colors hover:text-[var(--ink)]"
        >
          Back to the start
        </Link>
      </p>
    </motion.div>
  );
}
