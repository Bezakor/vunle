'use client';

import { useRef } from 'react';
import { motion } from 'framer-motion';
import { manifesto, howItWorks } from '@/lib/manifesto';
import ManifestoSection from '@/components/landing/ManifestoSection';
import CaseStudiesCarousel from '@/components/landing/CaseStudiesCarousel';
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
              id={i === manifestoBeforeCaseStudies.length - 1 ? 'manifesto-before-cases' : undefined}
            />
          ))}
        </section>

        <CaseStudiesCarousel />

        <section className="relative">
          {manifestoAfterCaseStudies.map((beat, i) => (
            <ManifestoSection key={beat.id} beat={beat} id={i === 0 ? 'manifesto-continue' : undefined} />
          ))}
        </section>
      </div>

      {/* How it works */}
      <section data-snap="" className="relative flex min-h-[85vh] flex-col items-center justify-center px-6 py-24">
        <div className="grid w-full max-w-4xl gap-px overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--line)] md:grid-cols-3">
          {howItWorks.map((item, i) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.7, ease: 'easeOut', delay: i * 0.12 }}
              className="bg-[var(--paper)] p-8 text-center"
            >
              <span className="text-xs tracking-[0.2em] text-[var(--ink-faint)]">{item.step}</span>
              <h3 className="mt-4 text-base font-medium">{item.title}</h3>
              <p className="mt-3 text-xs leading-relaxed text-[var(--ink-soft)]">{item.detail}</p>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-12 max-w-md text-center text-xs text-[var(--ink-faint)]"
        >
          Download &amp; listen to your personal visualisation guide.
        </motion.p>
      </section>

      {/* Closing CTA */}
      <section
        id="closing-cta"
        data-snap=""
        className="relative flex min-h-[70vh] flex-col items-center justify-center px-6 pb-44 text-center"
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
