'use client';

import { useRef } from 'react';
import { manifesto } from '@/lib/manifesto';
import ManifestoSection from '@/components/landing/ManifestoSection';
import CaseStudiesCarousel from '@/components/landing/CaseStudiesCarousel';
import ClosingSection from '@/components/landing/ClosingSection';
import HowItWorks from '@/components/landing/HowItWorks';
import OrbitHero from '@/components/landing/OrbitHero';
import ScrollProgressBar from '@/components/landing/ScrollProgressBar';
import ScrollSnapController from '@/components/landing/ScrollSnapController';
import WaitlistBar from '@/components/landing/WaitlistBar';

const splitIndex = manifesto.findIndex((beat) => beat.id === 'athletes') + 1;
const manifestoBeforeCaseStudies = manifesto.slice(0, splitIndex);
const manifestoAfterCaseStudies = manifesto.slice(splitIndex);

export default function Home() {
  const manifestoJourneyRef = useRef<HTMLDivElement>(null);

  return (
    <div className="relative min-h-screen bg-[var(--paper)] text-[var(--ink)]">
      <ScrollSnapController />
      <ScrollProgressBar targetRef={manifestoJourneyRef} />

      <OrbitHero />

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

      <ClosingSection />

      <WaitlistBar />
    </div>
  );
}
