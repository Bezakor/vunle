'use client';

import { scrollToId } from '@/lib/smoothScroll';

/** The three places worth jumping straight to, in the order the page tells them. */
const LINKS = [
  { id: 'how-it-works', label: 'How it works' },
  { id: 'case-studies', label: 'Famous case studies' },
  { id: 'closing-cta', label: 'Try it now' },
];

/**
 * The fixed menu in the top corner, opposite the wordmark. It rides over every
 * section, including the case studies' video, which is why each link carries
 * the same pale chip the controls down there do: ink on footage is unreadable
 * on a dark frame and white text disappears on a bright one.
 *
 * On a phone the three labels are wider than what is left beside the logo, so
 * they drop to their own centred row underneath it.
 */
export default function TopNav() {
  return (
    <nav className="top-nav" aria-label="Sections">
      {LINKS.map((link) => (
        <button key={link.id} type="button" className="top-nav__link" onClick={() => scrollToId(link.id)}>
          {link.label}
        </button>
      ))}
    </nav>
  );
}
