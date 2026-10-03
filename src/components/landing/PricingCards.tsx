'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { plans } from '@/lib/plans';

function Tick() {
  return (
    <svg viewBox="0 0 16 16" width="13" height="13" fill="none" aria-hidden className="mt-[0.4em] shrink-0">
      <path d="M3 8.5l3.2 3.2L13 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const BADGE_ICON = {
  star: (
    <svg viewBox="0 0 16 16" width="11" height="11" fill="currentColor" aria-hidden>
      <path d="M8 1.6l1.76 3.9 4.24.45-3.17 2.86.9 4.19L8 10.86 4.27 13l.9-4.19L2 5.95l4.24-.45L8 1.6z" />
    </svg>
  ),
  trend: (
    <svg viewBox="0 0 16 16" width="11" height="11" fill="none" aria-hidden>
      <path d="M1.8 11.4l4-4.2 2.7 2.5 5.7-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10.6 3.7h3.6v3.6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
};

/**
 * The two packages, side by side on a wide screen and stacked on a phone, with
 * the recommended one inverted — ink where the other is paper — so it is the
 * one the eye lands on, and first in the stack on a phone rather than the one
 * you have to scroll for.
 *
 * Selecting a card is only emphasis: each carries its own button, so nobody has
 * to select before they can buy, and the keyboard reaches both without going
 * through a radio group. The buttons lead to /start, where the brief is taken;
 * the plan rides along in the URL so that page knows which one was chosen.
 */
export default function PricingCards() {
  const [selected, setSelected] = useState(() => (plans.find((p) => p.featured) ?? plans[0]).id);

  return (
    <div className="relative z-10 mt-12 grid w-full max-w-4xl gap-6 md:grid-cols-2 md:items-stretch">
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
            <div className="text-left">
              {plan.badges && (
                <div className="mb-5 flex flex-wrap gap-2">
                  {plan.badges.map((badge) => (
                    <span key={badge.label} className="price-card__badge">
                      {BADGE_ICON[badge.icon]}
                      {badge.label}
                    </span>
                  ))}
                </div>
              )}

              <h3 className="price-card__name">{plan.name}</h3>
              <p className="price-card__summary">{plan.summary}</p>

              <div className="price-card__rule" />

              <p className="price-card__price">{plan.price}</p>
              <p className="price-card__delivery">{plan.delivery}</p>

              <ul className="price-card__list">
                {plan.includes.map((item) => (
                  <li key={item}>
                    <Tick />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Link
              href={`/start?plan=${plan.id}`}
              onClick={(e) => e.stopPropagation()}
              className="price-card__cta"
            >
              {plan.cta}
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
}
