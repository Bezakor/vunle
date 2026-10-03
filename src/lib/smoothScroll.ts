/**
 * Programmatic scrolling that the section snapping keeps its hands off.
 *
 * SectionSnap eases to the nearest `[data-snap]` marker once scroll events stop
 * for a moment. Handing a long jump to the browser's own smooth scrolling left
 * a gap wide enough for that to fire while the page was still moving: the snap
 * took over, eased to whichever marker was nearest at the time — often the one
 * it had only just left — and the visitor never arrived. Short jumps finished
 * too quickly to be caught, which is why it only went wrong sometimes, and a
 * slow device made it much more likely.
 *
 * So the journey is animated here rather than by the browser. The duration is
 * known, the hold is renewed on every frame of it, and fresh input from the
 * visitor abandons it immediately — they are never scrolled somewhere they are
 * actively scrolling away from.
 */

/** Grace after the animation ends, so the snap doesn't pounce on the landing. */
const SETTLE_MS = 260;

let heldUntil = 0;
let frame = 0;
let listening = false;

/** Milliseconds left on the hold, or 0 when the snap is free to act. */
export function snapHoldRemaining() {
  return Math.max(0, heldUntil - performance.now());
}

export function holdSnap(ms: number) {
  heldUntil = Math.max(heldUntil, performance.now() + ms);
}

function cancel() {
  if (frame) cancelAnimationFrame(frame);
  frame = 0;
  heldUntil = 0;
}

/** The visitor taking over always wins. */
function listen() {
  if (listening || typeof window === 'undefined') return;
  listening = true;
  for (const type of ['wheel', 'touchstart', 'keydown'] as const) {
    window.addEventListener(type, cancel, { passive: true });
  }
}

export function scrollToY(top: number) {
  if (typeof window === 'undefined') return;
  listen();
  if (frame) cancelAnimationFrame(frame);

  const start = window.scrollY;
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const end = Math.max(0, Math.min(maxScroll, top));
  const distance = end - start;

  if (Math.abs(distance) < 1) {
    holdSnap(SETTLE_MS);
    return;
  }

  // Scaled with distance, so crossing the whole carousel isn't frantic and a
  // step to the next card isn't sluggish.
  const duration = Math.min(1100, Math.max(420, Math.abs(distance) * 0.35));
  const startedAt = performance.now();

  const step = (now: number) => {
    const p = Math.min(1, (now - startedAt) / duration);
    const eased = 1 - Math.pow(1 - p, 3);
    window.scrollTo(0, start + distance * eased);
    // Renewed every frame: on a slow device the animation outlasts any fixed
    // hold, and the moment the hold lapses the snap would seize the page.
    holdSnap(duration - (now - startedAt) + SETTLE_MS);
    frame = p < 1 ? requestAnimationFrame(step) : 0;
  };

  holdSnap(duration + SETTLE_MS);
  frame = requestAnimationFrame(step);
}

export function scrollToElement(el: Element | null | undefined) {
  if (!el) return;
  scrollToY(el.getBoundingClientRect().top + window.scrollY);
}

export function scrollToId(id: string) {
  scrollToElement(document.getElementById(id));
}
