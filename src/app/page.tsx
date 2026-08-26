'use client';

import { motion } from 'framer-motion';
import { manifesto, howItWorks } from '@/lib/manifesto';
import ManifestoSection from '@/components/landing/ManifestoSection';
import CaseStudiesCarousel from '@/components/landing/CaseStudiesCarousel';
import WaitlistBar from '@/components/landing/WaitlistBar';
import DreamField from '@/components/landing/DreamField';

export default function Home() {
  return (
    <div className="dream-page relative min-h-screen">
      <DreamField />

      {/* Hero */}
      <section className="relative flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="mb-6 text-sm uppercase tracking-[0.3em] text-[var(--dream-muted)]"
        >
          Vunle
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeOut', delay: 0.15 }}
          className="max-w-3xl text-4xl leading-tight font-serif italic text-balance md:text-6xl"
        >
          Personal goals need personal visualizations.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeOut', delay: 0.35 }}
          className="mt-8 max-w-xl text-lg text-[var(--dream-muted)] md:text-xl"
        >
          Create a personalized visualization audio guide for your specific goal.
        </motion.p>

        <motion.blockquote
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeOut', delay: 0.5 }}
          className="mt-6 max-w-xl"
        >
          <p className="font-serif text-xl italic text-[var(--dream-fg)] md:text-2xl">
            &ldquo;When you visualize, then you materialize.&rdquo;
          </p>
          <footer className="mt-2 text-sm text-[var(--dream-muted)]">— Denis Waitley</footer>
        </motion.blockquote>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="animate-bounce-gentle mt-16 flex flex-col items-center gap-2 text-[var(--dream-muted)]"
        >
          <span className="text-xs uppercase tracking-[0.25em]">Read our manifesto</span>
          <span aria-hidden>↓</span>
        </motion.div>
      </section>

      {/* Manifesto — scroll story */}
      <section className="relative">
        {manifesto.map((beat) => (
          <ManifestoSection key={beat.id} beat={beat} />
        ))}
      </section>

      {/* How it works */}
      <section className="relative flex min-h-[85vh] flex-col items-center justify-center px-6 py-24">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
          className="mb-16 text-center text-2xl font-serif italic text-balance md:text-4xl"
        >
          How it works — in 3 quick steps
        </motion.h2>

        <div className="grid w-full max-w-4xl gap-8 md:grid-cols-3">
          {howItWorks.map((item, i) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.8, ease: 'easeOut', delay: i * 0.15 }}
              className="waitlist-glass rounded-3xl p-8 text-center"
            >
              <span className="font-serif text-3xl italic text-[var(--dream-primary)]">{item.step}</span>
              <h3 className="mt-4 text-lg font-medium">{item.title}</h3>
              <p className="mt-2 text-sm text-[var(--dream-muted)]">{item.detail}</p>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.6 }}
          className="mt-14 max-w-md text-center text-sm text-[var(--dream-muted)]"
        >
          Download &amp; listen to your personal visualisation guide.
        </motion.p>
      </section>

      <CaseStudiesCarousel />

      {/* Closing CTA */}
      <section id="closing-cta" className="relative flex min-h-[70vh] flex-col items-center justify-center px-6 pb-40 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="max-w-xl text-3xl font-serif italic text-balance md:text-5xl"
        >
          Be the first to visualise your future — join the waitlist now
        </motion.h2>
      </section>

      <WaitlistBar />
    </div>
  );
}
