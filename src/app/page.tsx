'use client';

import { useCallback, useRef, useState } from 'react';
import { manifesto } from '@/lib/manifesto';
import ManifestoSection from '@/components/landing/ManifestoSection';
import CaseStudiesCarousel from '@/components/landing/CaseStudiesCarousel';
import ClosingSection from '@/components/landing/ClosingSection';
import HowItWorks from '@/components/landing/HowItWorks';
import OrbitHero from '@/components/landing/OrbitHero';
import ScrollProgressBar from '@/components/landing/ScrollProgressBar';
import ScrollSnapController from '@/components/landing/ScrollSnapController';
import SiteLogo from '@/components/landing/SiteLogo';
import TopNav from '@/components/landing/TopNav';
import WaitlistBar from '@/components/landing/WaitlistBar';
import { WaitlistProvider } from '@/components/landing/waitlistState';

const splitIndex = manifesto.findIndex((beat) => beat.id === 'athletes') + 1;
const manifestoBeforeCaseStudies = manifesto.slice(0, splitIndex);
const manifestoAfterCaseStudies = manifesto.slice(splitIndex);

export default function Home() {
  const manifestoJourneyRef = useRef<HTMLDivElement>(null);

  // The email form has three places to stand. It opens inside the hero; once
  // the reader leaves the hero — by the hint button or by scrolling past — it
  // docks to the bar at the foot of the window; and when the closing section
  // fills the screen it steps into the middle of that, under "Join the waitlist
  // below." Leaving the hero is one way only: having the form hop back up there
  // would move the page's one call to action around under the reader.
  const [heroLeft, setHeroLeft] = useState(false);
  const [atClosing, setAtClosing] = useState(false);
  const leaveHero = useCallback(() => setHeroLeft(true), []);

  return (
    <WaitlistProvider>
      <div className="relative min-h-screen bg-[var(--paper)] text-[var(--ink)]">
        <ScrollSnapController />
        <ScrollProgressBar targetRef={manifestoJourneyRef} />

        <SiteLogo />
        <TopNav />

        <OrbitHero onLeaveHero={leaveHero} waitlist={heroLeft ? null : <WaitlistBar place="hero" />} />

        {/* Manifesto — scroll story, with the case studies woven in after the athletes beat */}
        <div ref={manifestoJourneyRef} className="relative">
          <section className="relative">
            {manifestoBeforeCaseStudies.map((beat, i) => (
              <ManifestoSection
                key={beat.id}
                beat={beat}
                index={i}
                id={
                  i === 0
                    ? 'manifesto-start'
                    : i === manifestoBeforeCaseStudies.length - 1
                      ? 'manifesto-before-cases'
                      : undefined
                }
              />
            ))}
          </section>

          <CaseStudiesCarousel />

          <section className="relative">
            {manifestoAfterCaseStudies.map((beat, i) => (
              <ManifestoSection
                key={beat.id}
                beat={beat}
                index={splitIndex + i}
                id={i === 0 ? 'manifesto-continue' : undefined}
              />
            ))}
          </section>
        </div>

        <HowItWorks />

        <ClosingSection
          onActiveChange={setAtClosing}
          waitlist={<WaitlistBar place="closing" visible={atClosing} />}
        />

        {heroLeft && !atClosing && <WaitlistBar place="bar" />}
      </div>
    </WaitlistProvider>
  );
}
