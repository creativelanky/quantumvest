'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'

export function UpToTheMinute() {
  return (
    <section className="bg-light-surface dark:bg-dark-surface py-20 sm:py-28 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* ── Text (left) ── */}
          <motion.div
            initial={{ opacity: 0, x: -32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            {/* Eyebrow */}
            <p className="text-xs font-semibold uppercase tracking-widest text-red-primary mb-4">
              Live Intelligence
            </p>

            <h2 className="text-3xl sm:text-4xl font-bold text-dark-base dark:text-white leading-tight mb-6">
              Up to the minute{' '}
              <span className="gradient-text">analysis</span>
            </h2>

            <p className="text-base text-slate-500 dark:text-slate-400 leading-relaxed mb-8">
              Inform your decisions with timely dispatches from our large team of global analysts.
            </p>

            {/* Feature list */}
            <ul className="space-y-3 mb-8">
              {[
                'Breaking market news as it happens',
                'In-depth technical & fundamental reports',
                'Personalised alerts for your portfolio',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-300">
                  <span className="mt-1 w-4 h-4 flex-shrink-0 rounded-full bg-red-primary/15 flex items-center justify-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-primary" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>

            <a
              href="/auth/register"
              className="inline-flex items-center gap-2 text-sm font-bold text-red-primary hover:text-red-dim transition-colors"
            >
              Open your account <ArrowRight size={15} />
            </a>
          </motion.div>

          {/* ── Phone mockup (right) ── */}
          <motion.div
            initial={{ opacity: 0, x: 32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.1 }}
            className="flex items-center justify-center lg:justify-end"
          >
            <div className="relative max-w-sm w-full">
              {/* Subtle glow behind phones */}
              <div className="absolute inset-0 -z-10 blur-3xl opacity-20 bg-red-primary rounded-full scale-75" />

              <Image
                src="/images/phones-mockup.png"
                alt="BIT-TESLA mobile trading app"
                width={420}
                height={520}
                className="w-full h-auto drop-shadow-2xl animate-float"
                priority
              />
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
