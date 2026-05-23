'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, X, Play } from 'lucide-react'

const testimonials = [
  {
    name: 'RUKKY SANDERS',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face',
    quote:
      'QuantumVest runs a quick and reliable system. It feels great to know that I can always trust their support system to come through for me. Their response speed is prompt and the delivery precise to the last detail.',
  },
  {
    name: 'SCOTT SMITH',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    quote:
      'Am an engineer in Washington DC when an account manager brought this opportunity to me. I just said casually to invest with $500 but my story today is on a premium plan.',
  },
  {
    name: 'ALEX GLYSON',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    quote:
      'I have only been a member for a few months and I have already earned a decent amount of money. Finally a real and honest company that does what it says. Thank you so much for this great opportunity!',
  },
]

const videos = [
  {
    src: 'https://home.quantumtraderslink.com/wp-content/uploads/2022/01/WhatsApp-Video-2022-01-14-at-21.30.24.mp4',
    thumb: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&h=400&fit=crop',
    label: 'Client Testimonial',
  },
  {
    src: 'https://home.quantumtraderslink.com/wp-content/uploads/2022/01/WhatsApp-Video-2022-01-14-at-21.27.40.mp4',
    thumb: 'https://images.unsplash.com/photo-1642790551116-18a150d975b7?w=600&h=400&fit=crop',
    label: 'Investor Story',
  },
  {
    src: 'https://home.quantumtraderslink.com/wp-content/uploads/2022/01/WhatsApp-Video-2022-01-14-at-21.27.32.mp4',
    thumb: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=600&h=400&fit=crop',
    label: 'Trading Results',
  },
]

function Stars() {
  return (
    <div className="flex items-center gap-0.5 justify-center mb-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={16} fill="#F59E0B" className="text-amber-400" />
      ))}
    </div>
  )
}

export function Testimonials() {
  const [activeVideo, setActiveVideo] = useState<string | null>(null)

  return (
    <section className="bg-light-base dark:bg-dark-base py-20 sm:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl sm:text-4xl font-bold text-dark-base dark:text-white mb-14 text-center"
        >
          What Our Clients Say:
        </motion.h2>

        {/* 3-column testimonial grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-light-surface dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl p-6 flex flex-col items-center text-center"
            >
              {/* Circular avatar */}
              <img
                src={t.avatar}
                alt={t.name}
                className="w-20 h-20 rounded-full object-cover border-2 border-light-border dark:border-dark-border mb-4"
              />

              {/* Stars */}
              <Stars />

              {/* Name */}
              <p className="text-sm font-extrabold text-dark-base dark:text-white tracking-widest uppercase mb-3">
                {t.name}
              </p>

              {/* Quote */}
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                {t.quote}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Video row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {videos.map((v, i) => (
            <motion.button
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              onClick={() => setActiveVideo(v.src)}
              className="relative rounded-xl overflow-hidden group cursor-pointer w-full text-left"
            >
              {/* Thumbnail */}
              <img
                src={v.thumb}
                alt={v.label}
                className="w-full aspect-video object-cover group-hover:scale-105 transition-transform duration-500"
              />

              {/* Dark overlay */}
              <div className="absolute inset-0 bg-black/45 group-hover:bg-black/30 transition-colors duration-300" />

              {/* Pulsing play button */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative">
                  {/* Pulse rings */}
                  <span className="absolute inset-0 rounded-full bg-white/20 animate-ping" />
                  <div className="relative w-14 h-14 rounded-full bg-white/90 flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-200">
                    <Play size={22} fill="#DC2626" className="text-red-primary ml-1" />
                  </div>
                </div>
              </div>

              {/* Label */}
              <div className="absolute bottom-0 left-0 right-0 px-4 py-3 bg-gradient-to-t from-black/70 to-transparent">
                <p className="text-xs font-semibold text-white/80">{v.label}</p>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Video lightbox modal */}
      <AnimatePresence>
        {activeVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
            onClick={() => setActiveVideo(null)}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-3xl rounded-xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <video
                src={activeVideo}
                controls
                autoPlay
                className="w-full rounded-xl"
                style={{ maxHeight: '70vh' }}
              />
              <button
                onClick={() => setActiveVideo(null)}
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
