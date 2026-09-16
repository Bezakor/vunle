'use client';

import { useState } from 'react';
import { LOGO_SRC } from '@/lib/brandManifest';
import { scrollToY } from '@/lib/smoothScroll';

/**
 * The mark in the top corner, present on every part of the page and always a
 * way back to the top.
 *
 * It draws the wordmark as text until there is a file in public/brand, and
 * falls back to the same text if that file ever fails to load, so the corner is
 * never empty and never a broken image.
 */
export default function SiteLogo() {
  const [failed, setFailed] = useState(false);
  const showImage = Boolean(LOGO_SRC) && !failed;

  return (
    <button
      type="button"
      onClick={() => scrollToY(0)}
      aria-label="Vunle — back to the top"
      className="site-logo"
    >
      {showImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={LOGO_SRC!} alt="Vunle" className="site-logo__img" onError={() => setFailed(true)} />
      ) : (
        <span className="site-logo__text">Vunle</span>
      )}
    </button>
  );
}
