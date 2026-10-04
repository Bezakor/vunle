'use client';

import { useEffect, useState } from 'react';
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

const pad = (n: number) => String(n).padStart(2, '0');

/**
 * The time left on the offer, as mm:ss, or null until it has been read.
 *
 * It starts when the visit does and is kept in sessionStorage, so it carries
 * on where it was across a reload or a trip to the brief and back rather than
 * springing back to twenty minutes each time. It runs down to zero and stays
 * there for the rest of the visit.
 *
 * Null until the effect runs, because the time left is not knowable on the
 * server and rendering a guess would mismatch on hydration. Both places the
 * clock appears read this one hook, so they cannot disagree.
 */
function useOfferCountdown(minutes: number) {
  const [msLeft, setMsLeft] = useState<number | null>(null);

  useEffect(() => {
    const KEY = 'vunle-offer-ends';
    let endsAt = 0;

    try {
      endsAt = Number(window.sessionStorage.getItem(KEY)) || 0;
    } catch {
      endsAt = 0;
    }

    if (!endsAt) {
      endsAt = Date.now() + minutes * 60_000;
      try {
        window.sessionStorage.setItem(KEY, String(endsAt));
      } catch {
        // A private window with storage blocked still gets a clock, just not
        // one that survives the next page.
      }
    }

    const tick = () => setMsLeft(Math.max(0, endsAt - Date.now()));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [minutes]);

  if (msLeft === null) return null;
  const total = Math.floor(msLeft / 1000);
  return total > 0 ? `${pad(Math.floor(total / 60))}:${pad(total % 60)}` : null;
}

/** The clock above the cards, in the accent so it is seen before it is read. */
function OfferClock({ minutes }: { minutes: number }) {
  const left = useOfferCountdown(minutes);
  if (!left) return null;

  return (
    <motion.p
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="offer-clock"
    >
      <svg viewBox="0 0 16 16" width="12" height="12" fill="none" aria-hidden className="offer-clock__icon">
        <circle cx="8" cy="8.6" r="5.6" stroke="currentColor" strokeWidth="1.6" />
        <path d="M8 5.6v3.2l2 1.2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M6.2 1.6h3.6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
      <span>Discounted price + a second goal free</span>
      <span className="offer-clock__time">{left}</span>
    </motion.p>
  );
}

/** The same clock again, inside the bonus it is counting down. */
function CalloutClock({ minutes }: { minutes: number }) {
  const left = useOfferCountdown(minutes);
  if (!left) return null;

  return (
    <span className="price-card__callout-clock">
      <svg viewBox="0 0 16 16" width="11" height="11" fill="none" aria-hidden>
        <circle cx="8" cy="8.6" r="5.6" stroke="currentColor" strokeWidth="1.6" />
        <path d="M8 5.6v3.2l2 1.2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M6.2 1.6h3.6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
      Ends in <span className="price-card__callout-time">{left}</span>
    </span>
  );
}

/**
 * The two packages, side by side on a wide screen and stacked on a phone, with
 * the recommended one inverted — ink where the other is paper — so it is the
 * one the eye lands on, and first in the stack on a phone rather than the one
 * you have to scroll for.
 *
 * Its marks sit above the card rather than inside it, which is what lets the
 * two names, the two lines under them and the two prices sit on the same lines
 * across both cards.
 *
 * Selecting a card is only emphasis: each carries its own button, so nobody has
 * to select before they can buy, and the keyboard reaches both without going
 * through a radio group. The buttons lead to /start, where the brief is taken.
 */
export default function PricingCards() {
  const [selected, setSelected] = useState(() => (plans.find((p) => p.featured) ?? plans[0]).id);
  const offer = plans.find((p) => p.offerMinutes);

  return (
    <div className="relative z-10 mt-12 w-full max-w-4xl">
      {offer?.offerMinutes && <OfferClock minutes={offer.offerMinutes} />}

      <div className="price-cards">
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
              {plan.badges && (
                <div className="price-card__badges">
                  {plan.badges.map((badge) => (
                    <span key={badge.label} className="price-card__badge">
                      {BADGE_ICON[badge.icon]}
                      {badge.label}
                    </span>
                  ))}
                </div>
              )}

              <div className="text-left">
                <h3 className="price-card__name">{plan.name}</h3>
                <p className="price-card__summary">{plan.summary}</p>

                <div className="price-card__rule" />

                <p className="price-card__price">
                  {plan.was && <span className="price-card__was">{plan.was}</span>}
                  {plan.price}
                  {plan.saving && <span className="price-card__saving">{plan.saving}</span>}
                </p>
                <p className="price-card__delivery">{plan.delivery}</p>
                {plan.priceNote && <p className="price-card__note">{plan.priceNote}</p>}

                <ul className="price-card__list">
                  {plan.includes.map((item) => (
                    <li key={item}>
                      <Tick />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                {plan.callout && (
                  <div className="price-card__callout">
                    <span className="price-card__callout-label">{plan.callout.label}</span>
                    <p>{plan.callout.body}</p>
                    {plan.offerMinutes && <CalloutClock minutes={plan.offerMinutes} />}
                  </div>
                )}
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
    </div>
  );
}
