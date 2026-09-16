'use client';

import { useEffect, useState } from 'react';
import { LOGO_SRC, LOGO_WHITE_SRC } from '@/lib/brandManifest';
import { scrollToY } from '@/lib/smoothScroll';

/** Roughly the vertical centre of the mark, so the swap happens as the dark
 *  section passes behind it rather than before or after. */
const LOGO_CENTRE_Y = 34;

/**
 * The mark in the top corner, present on every part of the page and always a
 * way back to the top.
 *
 * It draws the wordmark as text until there is a file in public/brand, and
 * falls back to the same text if that file ever fails to load, so the corner is
 * never empty and never a broken image.
 *
 * The case studies sit on video, so the mark turns white while that section is
 * behind it. Both files are rendered and cross-faded rather than swapping the
 * `src`, which would blink on the first change while the new one loaded.
 */
export default function SiteLogo() {
  const [failed, setFailed] = useState(false);
  const [onDark, setOnDark] = useState(false);

  useEffect(() => {
    const section = document.getElementById('case-studies');
    if (!section) return;

    let frame = 0;
    const check = () => {
      frame = 0;
      const { top, bottom } = section.getBoundingClientRect();
      setOnDark(top <= LOGO_CENTRE_Y && bottom >= LOGO_CENTRE_Y);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(check);
    };

    check();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  const showImage = Boolean(LOGO_SRC) && !failed;
  // Without a white file the dark one simply stays; better that than an empty
  // corner over the video.
  const white = LOGO_WHITE_SRC ?? LOGO_SRC;

  return (
    <button
      type="button"
      onClick={() => scrollToY(0)}
      aria-label="Vunle — back to the top"
      className={`site-logo ${onDark ? 'is-on-dark' : ''}`}
    >
      {showImage ? (
        <span className="site-logo__stack">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={LOGO_SRC!} alt="Vunle" className="site-logo__img" onError={() => setFailed(true)} />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={white!} alt="" aria-hidden className="site-logo__img site-logo__img--white" />
        </span>
      ) : (
        <span className="site-logo__text">Vunle</span>
      )}
    </button>
  );
}
