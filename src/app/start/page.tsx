import { Suspense } from 'react';
import type { Metadata } from 'next';
import SiteLogo from '@/components/landing/SiteLogo';
import StartForm from '@/components/landing/StartForm';

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
    <main className="relative flex min-h-screen flex-col items-center justify-center bg-[var(--paper)] px-6 py-28 text-[var(--ink)]">
      <SiteLogo />
      {/* useSearchParams reads the chosen plan, which needs a boundary here or
          the whole page opts out of being prerendered. */}
      <Suspense fallback={null}>
        <StartForm />
      </Suspense>
    </main>
  );
}
