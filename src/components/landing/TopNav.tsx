'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { scrollToId } from '@/lib/smoothScroll';

/** The three places worth jumping straight to, in the order the page tells them. */
const LINKS = [
  { id: 'how-it-works', label: 'How it works' },
  { id: 'case-studies', label: 'Famous case studies' },
  { id: 'closing-cta', label: 'Try it now' },
];

/**
 * The menu in the top corner, opposite the wordmark: one button that opens the
 * three places worth jumping to. Folded away like this it takes the same room
 * on a phone as on a desktop, which is what lets the sections underneath start
 * where they like rather than leaving a band clear for a row of links.
 */
export default function TopNav() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Escape, and a click anywhere else, close it.
  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    const onPointer = (e: PointerEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };

    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onPointer);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onPointer);
    };
  }, [open]);

  return (
    <div ref={ref} className="top-nav">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="top-nav-menu"
        aria-label={open ? 'Close the menu' : 'Open the menu'}
        className={`top-nav__toggle ${open ? 'is-open' : ''}`}
      >
        <span aria-hidden className="top-nav__bars">
          <span />
          <span />
          <span />
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.nav
            id="top-nav-menu"
            aria-label="Sections"
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="top-nav__panel"
          >
            {LINKS.map((link) => (
              <button
                key={link.id}
                type="button"
                className="top-nav__link"
                onClick={() => {
                  setOpen(false);
                  scrollToId(link.id);
                }}
              >
                {link.label}
              </button>
            ))}
          </motion.nav>
        )}
      </AnimatePresence>
    </div>
  );
}
