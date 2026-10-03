'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { plans } from '@/lib/plans';

function Tick() {
  return (
    <svg viewBox="0 0 16 16" width="13" height="13" fill="none" aria-hidden className="mt-[0.35em] shrink-0">
      <path d="M3 8.5l3.2 3.2L13 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * The two packages, side by side on a wide screen and stacked on a phone, with
 * the recommended one picked out and selected from the start. Selecting a card
 * is only emphasis — each card carries its own button, so nobody has to select
 * before they can buy, and the keyboard reaches both without going through a
 * radio group.
 *
 * The buttons lead to /start, which is where the brief is taken; the plan rides
 * along in the URL so that form knows, and says, which one was chosen.
 */
export default function PricingCards() {
  const [selected, setSelected] = useState(() => (plans.find((p) => p.featured) ?? plans[0]).id);

  return (
    <div className="relative z-10 mt-12 grid w-full max-w-4xl gap-5 md:grid-cols-2 md:items-start">
      {plans.map((plan, i) => {
        const isSelected = plan.id === selected;

        return (
          <motion.div
            key={plan.id}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7, ease: 'easeOut', delay: 0.15 + i * 0.12 }}
            onClick={() => setSelected(plan.id)}
            className={`price-card ${isSelected ? 'is-selected' : ''} ${plan.featured ? 'is-featured' : ''}`}
          >
            {plan.badge && <span className="price-card__badge">{plan.badge}</span>}

            <div className="text-left">
              <h3 className="text-base font-medium tracking-tight text-[var(--ink)] md:text-lg">{plan.name}</h3>
              <p className="mt-2 text-xs leading-relaxed text-[var(--ink-soft)]">{plan.summary}</p>

              <p className="mt-5 text-3xl font-normal tracking-tight text-[var(--ink)]">{plan.price}</p>
              <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-[var(--ink-faint)]">{plan.delivery}</p>

              <ul className="mt-6 space-y-3">
                {plan.includes.map((item) => (
                  <li key={item} className="flex gap-2.5 text-xs leading-relaxed text-[var(--ink-soft)]">
                    <Tick />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Link
              href={`/start?plan=${plan.id}`}
              onClick={(e) => e.stopPropagation()}
              className={`price-card__cta ${plan.featured ? 'is-primary' : ''}`}
            >
              {plan.cta}
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
}
