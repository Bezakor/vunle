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
// How far you must travel from the section you were resting on before the scroll
// counts as wanting the next one. Without this, always easing back to whichever
// point is nearest means a series of small scrolls is returned to the same
// section every time and can never advance — the page feels stuck.
const COMMIT_RATIO = 0.12;
// Wheel events within one gesture can be spaced further apart than IDLE_MS, so
// a scroll going quiet for a moment doesn't mean the gesture is over. Wait for
// input itself to stop as well, or the ease fires mid-gesture and drags the page
// back under the user's fingers.
const INPUT_QUIET_MS = 220;

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

export default function ScrollSnapController() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let idleTimer: number | undefined;
    let rafId: number | undefined;
    let animating = false;
    // The section we last came to rest on, so we can tell "nudged a little away
    // from here" apart from "travelled far enough to want the next one".
    let restY = window.scrollY;
    let lastInputAt = 0;

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
          restY = target;
          cancelAnimation();
        }
      }
      rafId = requestAnimationFrame(step);
    }

    function snapToNearest() {
      if (animating) return;

      // The gesture itself is still going — wait for it to finish rather than
      // easing away from where the user is currently scrolling to.
      const quietFor = performance.now() - lastInputAt;
      if (quietFor < INPUT_QUIET_MS) {
        if (idleTimer) window.clearTimeout(idleTimer);
        idleTimer = window.setTimeout(snapToNearest, INPUT_QUIET_MS - quietFor);
        return;
      }

      const y = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      // Leave the extremes alone so the page can rest at the very top/bottom.
      // restY still has to be updated on every settle, including the ones we
      // decline to act on: it means "where the page is currently at rest", and
      // letting it go stale makes the next scroll measure travel from the wrong
      // origin and ease the wrong way.
      if (y <= 2 || y >= maxScroll - 2) {
        restY = y;
        return;
      }

      const targets = Array.from(document.querySelectorAll<HTMLElement>('[data-snap]'))
        .map((el) => el.getBoundingClientRect().top + y)
        .sort((a, b) => a - b);
      if (targets.length === 0) return;

      let nearest = targets[0];
      let best = Infinity;
      for (const top of targets) {
        const d = Math.abs(top - y);
        if (d < best) {
          best = d;
          nearest = top;
        }
      }

      // Nearest is the one we started from, yet we've travelled a meaningful
      // distance: take that as wanting the next section along, not a near-miss
      // to be undone. Otherwise repeated small scrolls never get anywhere.
      const travelled = y - restY;
      if (
        Math.abs(nearest - restY) < MIN_DISTANCE_PX &&
        Math.abs(travelled) > window.innerHeight * COMMIT_RATIO
      ) {
        const forward = travelled > 0;
        const next = forward
          ? targets.find((t) => t > restY + MIN_DISTANCE_PX)
          : [...targets].reverse().find((t) => t < restY - MIN_DISTANCE_PX);
        if (next !== undefined) {
          animateTo(Math.max(0, Math.min(maxScroll, next)));
          return;
        }
      }

      if (best < MIN_DISTANCE_PX) {
        restY = nearest;
        return;
      }
      if (best > window.innerHeight * MAX_DISTANCE_RATIO) {
        restY = y;
        return;
      }

      animateTo(Math.max(0, Math.min(maxScroll, nearest)));
    }

    function onScroll() {
      if (animating) return;
      if (idleTimer) window.clearTimeout(idleTimer);
      idleTimer = window.setTimeout(snapToNearest, IDLE_MS);
    }

    // Fresh input always wins: drop whatever we were doing and hand back control.
    function onUserInput() {
      lastInputAt = performance.now();
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
