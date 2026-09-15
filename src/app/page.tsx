'use client';

import { useRef } from 'react';
import { motion } from 'framer-motion';
import { manifesto } from '@/lib/manifesto';
import ManifestoSection from '@/components/landing/ManifestoSection';
import CaseStudiesCarousel from '@/components/landing/CaseStudiesCarousel';
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

      {/* Closing CTA. A full viewport tall so its top can actually reach the top
          of the screen: at 70vh the page bottomed out 270px short, leaving the
          last section unable to settle and the arrow above it unable to land. */}
      <section
        id="closing-cta"
        data-snap=""
        className="relative flex min-h-screen flex-col items-center justify-center px-6 pb-44 text-center"
      >
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
          className="max-w-2xl text-2xl leading-snug tracking-tight text-balance md:text-4xl"
        >
          Be the first to visualise your future
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.25 }}
          className="mt-5 text-sm text-[var(--ink-soft)]"
        >
          Join the waitlist below.
        </motion.p>
      </section>

      <WaitlistBar />
    </div>
  );
}
