'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, X, ArrowRight } from 'lucide-react'

const VIDEO_SRC =
  'https://home.quantumtraderslink.com/wp-content/uploads/2022/01/WhatsApp-Video-2022-01-14-at-21.30.24.mp4'
const THUMB =
  'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=500&fit=crop'

export function MarketAnalysis() {
  const [open, setOpen] = useState(false)

  return (
    <section className="bg-light-surface dark:bg-dark-surface py-20 sm:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* ── Video (left) ── */}
          <motion.button
            initial={{ opacity: 0, x: -32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            onClick={() => setOpen(true)}
            className="relative rounded-2xl overflow-hidden group cursor-pointer w-full text-left"
            aria-label="Play video"
          >
            {/* Thumbnail */}
            <img
              src={THUMB}
              alt="Market analysis video"
              className="w-full aspect-video object-cover group-hover:scale-105 transition-transform duration-700"
            />

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-black/50 via-black/30 to-black/50 group-hover:from-black/40 group-hover:to-black/40 transition-colors duration-300" />

            {/* Red accent border glow */}
            <div className="absolute inset-0 rounded-2xl ring-1 ring-red-primary/20 group-hover:ring-red-primary/50 transition-all duration-300" />

            {/* Play button */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                <span className="absolute inset-0 rounded-full bg-red-primary/30 animate-ping" />
                <div className="relative w-16 h-16 rounded-full bg-white/95 flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-200">
                  <Play size={26} fill="#DC2626" className="text-red-primary ml-1" />
                </div>
              </div>
            </div>

            {/* Bottom label */}
            <div className="absolute bottom-0 left-0 right-0 px-5 py-4 bg-gradient-to-t from-black/70 to-transparent">
              <p className="text-sm font-semibold text-white/90">Watch: Client Testimonial</p>
            </div>
          </motion.button>

          {/* ── Text (right) ── */}
          <motion.div
            initial={{ opacity: 0, x: 32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.1 }}
          >
            {/* Eyebrow */}
            <p className="text-xs font-semibold uppercase tracking-widest text-red-primary mb-4">
              Expert Network
            </p>

            <h2 className="text-3xl sm:text-4xl font-bold text-dark-base dark:text-white leading-tight mb-6">
              Market analysis and{' '}
              <span className="gradient-text">trade inspiration</span>
            </h2>

            <p className="text-base text-slate-500 dark:text-slate-400 leading-relaxed mb-8">
              With a thriving network of experts, being a client of BIT-TESLA opens doors to
              many opportunities. Powerful market insight and the top trade setups in the
              industry. You will have extensive connections to professional traders.
            </p>

            {/* Feature list */}
            <ul className="space-y-3 mb-8">
              {[
                'Real-time signals from global analysts',
                'Daily market briefings & outlooks',
                'Direct access to professional trade setups',
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
              Get started today <ArrowRight size={15} />
            </a>
          </motion.div>
        </div>
      </div>

      {/* ── Video lightbox ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-3xl rounded-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <video
                src={VIDEO_SRC}
                controls
                autoPlay
                className="w-full rounded-2xl"
                style={{ maxHeight: '70vh' }}
              />
              <button
                onClick={() => setOpen(false)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 hover:bg-black flex items-center justify-center text-white transition-colors"
              >
                <X size={16} />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
