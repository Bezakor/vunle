import { Suspense } from 'react';
import type { Metadata } from 'next';
import SiteLogo from '@/components/landing/SiteLogo';
import StartEmbed from '@/components/landing/StartEmbed';

/** Where the mark in the corner goes from the pages away from the landing page. */
const SITE_HOME = 'https://www.vunle.com';

export const metadata: Metadata = {
  title: 'Let’s get started — Vunle',
  description: 'Tell us your goal and what stands in its way, and we’ll build the guide around it.',
};

/**
 * Where a buy button lands: the brief. A page of its own rather than a panel on
 * the landing page, so it can be linked to, returned to and shared.
 */
export default function StartPage() {
  return (
    <main // Narrower gutters than the landing page keeps: the form inside the frame
      // is Google's, and on a small phone every pixel of width it gets back is
      // one its own fields do not have to wrap into.
      className="relative flex min-h-screen flex-col items-center justify-center bg-[var(--paper)] px-3 py-28 text-[var(--ink)] sm:px-6">
      {/* Away from the landing page the mark is a way back to the site, not a
          scroll to the top of this one. */}
      <SiteLogo href={SITE_HOME} />
      {/* useSearchParams reads the chosen plan, which needs a boundary here or
          the whole page opts out of being prerendered. */}
      <Suspense fallback={null}>
        <StartEmbed />
      </Suspense>
    </main>
  );
}
