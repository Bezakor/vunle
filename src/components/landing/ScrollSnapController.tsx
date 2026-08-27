'use client';

import { useEffect } from 'react';

// Native scrolling is never intercepted here — no preventDefault, no CSS
// scroll-snap. The page scrolls exactly as the browser intends, and only once
// the user has stopped do we ease to the nearest section. Any fresh input
// cancels that ease immediately, so the controller can never fight the user.

const IDLE_MS = 150;
const DURATION_MS = 480;
// Below this we're already close enough that moving would just look like drift.
const MIN_DISTANCE_PX = 6;
// Don't yank across a long distance — that's a deliberate jump, not a near-miss.
const MAX_DISTANCE_RATIO = 0.6;

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

export default function ScrollSnapController() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let idleTimer: number | undefined;
    let rafId: number | undefined;
    let animating = false;

    function cancelAnimation() {
      if (rafId !== undefined) cancelAnimationFrame(rafId);
      rafId = undefined;
      animating = false;
    }

    function animateTo(target: number) {
      const start = window.scrollY;
      const distance = target - start;
      const startTime = performance.now();
      animating = true;

      function step(now: number) {
        const t = Math.min(1, (now - startTime) / DURATION_MS);
        window.scrollTo({ top: start + distance * easeOutCubic(t), left: 0, behavior: 'auto' });
        if (t < 1) {
          rafId = requestAnimationFrame(step);
        } else {
          cancelAnimation();
        }
      }
      rafId = requestAnimationFrame(step);
    }

    function snapToNearest() {
      if (animating) return;

      const y = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      // Leave the extremes alone so the page can rest at the very top/bottom.
      if (y <= 2 || y >= maxScroll - 2) return;

      let nearest = Infinity;
      let best = Infinity;
      for (const el of document.querySelectorAll<HTMLElement>('[data-snap]')) {
        const top = el.getBoundingClientRect().top + y;
        const d = Math.abs(top - y);
        if (d < best) {
          best = d;
          nearest = top;
        }
      }

      if (!Number.isFinite(nearest)) return;
      if (best < MIN_DISTANCE_PX) return;
      if (best > window.innerHeight * MAX_DISTANCE_RATIO) return;

      animateTo(Math.max(0, Math.min(maxScroll, nearest)));
    }

    function onScroll() {
      if (animating) return;
      if (idleTimer) window.clearTimeout(idleTimer);
      idleTimer = window.setTimeout(snapToNearest, IDLE_MS);
    }

    // Fresh input always wins: drop whatever we were doing and hand back control.
    function onUserInput() {
      cancelAnimation();
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('wheel', onUserInput, { passive: true });
    window.addEventListener('touchstart', onUserInput, { passive: true });
    window.addEventListener('keydown', onUserInput, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('wheel', onUserInput);
      window.removeEventListener('touchstart', onUserInput);
      window.removeEventListener('keydown', onUserInput);
      if (idleTimer) window.clearTimeout(idleTimer);
      cancelAnimation();
    };
  }, []);

  return null;
}
