'use client';

import { useEffect } from 'react';

const IDLE_DELAY = 150;
const EASE_DURATION = 650;
const SNAP_THRESHOLD = 6;

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

export default function ScrollSnapController() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let targets: number[] = [];
    let excludeStart = Infinity;
    let excludeEnd = -Infinity;
    let idleTimer: number | undefined;
    let programmatic = false;
    let rafId: number | undefined;

    function measure() {
      targets = Array.from(document.querySelectorAll<HTMLElement>('[data-snap-target]'))
        .map((el) => el.getBoundingClientRect().top + window.scrollY)
        .sort((a, b) => a - b);

      const exclude = document.querySelector<HTMLElement>('[data-snap-exclude]');
      if (exclude) {
        const rect = exclude.getBoundingClientRect();
        excludeStart = rect.top + window.scrollY;
        excludeEnd = excludeStart + rect.height;
      }
    }

    function animateScrollTo(target: number) {
      const start = window.scrollY;
      const distance = target - start;
      if (Math.abs(distance) < SNAP_THRESHOLD) return;

      programmatic = true;
      const startTime = performance.now();

      function step(now: number) {
        const elapsed = now - startTime;
        const t = Math.min(1, elapsed / EASE_DURATION);
        // behavior: 'auto' is required here — html has scroll-behavior: smooth,
        // and the two-argument scrollTo(x, y) form inherits that, which would
        // stack the browser's own smoothing on top of this rAF loop's easing
        // every frame and produce exactly the jitter this controller exists to avoid.
        window.scrollTo({ top: start + distance * easeOutCubic(t), left: 0, behavior: 'auto' });
        if (t < 1) {
          rafId = requestAnimationFrame(step);
        } else {
          programmatic = false;
        }
      }
      rafId = requestAnimationFrame(step);
    }

    function onIdle() {
      if (programmatic) return;
      const y = window.scrollY;

      // Inside the case-studies carousel: let it scroll completely free.
      if (y >= excludeStart - 4 && y <= excludeEnd + 4) return;

      let nearest = targets[0];
      let best = Infinity;
      for (const t of targets) {
        const d = Math.abs(t - y);
        if (d < best) {
          best = d;
          nearest = t;
        }
      }
      animateScrollTo(nearest);
    }

    function onScroll() {
      if (programmatic) return;
      if (idleTimer) window.clearTimeout(idleTimer);
      idleTimer = window.setTimeout(onIdle, IDLE_DELAY);
    }

    measure();
    window.addEventListener('resize', measure);
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      window.removeEventListener('resize', measure);
      window.removeEventListener('scroll', onScroll);
      if (idleTimer) window.clearTimeout(idleTimer);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return null;
}
