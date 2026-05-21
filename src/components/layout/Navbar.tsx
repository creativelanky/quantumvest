'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { Menu, X, TrendingUp } from 'lucide-react'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { Button } from '@/components/ui/Button'
import { navLinks } from '@/data'
import { cn } from '@/lib/utils'

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="fixed top-0 left-0 right-0 z-50 pt-3 px-4 sm:px-6 lg:px-8"
      >
        <div className={cn(
          'max-w-7xl mx-auto rounded-2xl border transition-all duration-300 px-4 sm:px-5',
          scrolled
            ? 'bg-white/95 dark:bg-dark-card/95 border-light-border dark:border-dark-border backdrop-blur-md shadow-lg shadow-black/5 dark:shadow-black/25 py-3'
            : 'bg-white/80 dark:bg-dark-card/80 border-light-border/60 dark:border-dark-border/60 backdrop-blur-sm py-4'
        )}>
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 bg-red-primary flex items-center justify-center">
                <TrendingUp size={16} className="text-dark-base" strokeWidth={2.5} />
              </div>
              <span className="font-bold text-lg text-dark-base dark:text-light-base tracking-tight">
                Quantum<span className="gradient-text">Vest</span>
              </span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-4 py-2 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-dark-base dark:hover:text-light-base hover:bg-light-surface dark:hover:bg-dark-card transition-all duration-200"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Desktop actions */}
            <div className="hidden md:flex items-center gap-3">
              <ThemeToggle />
              <Link
                href="/auth/login"
                className="text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-dark-base dark:hover:text-light-base transition-colors duration-200"
              >
                Sign In
              </Link>
              <Link href="/auth/register">
                <Button size="sm">Get Started</Button>
              </Link>
            </div>

            {/* Mobile actions */}
            <div className="flex md:hidden items-center gap-2">
              <ThemeToggle />
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setMobileOpen(!mobileOpen)}
                className="w-9 h-9 flex items-center justify-center bg-light-surface dark:bg-dark-card border border-light-border dark:border-dark-border text-dark-base dark:text-light-base cursor-pointer"
                aria-label="Menu"
              >
                {mobileOpen ? <X size={16} /> : <Menu size={16} />}
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="fixed top-[72px] left-4 right-4 sm:left-6 sm:right-6 lg:left-8 lg:right-8 z-40 max-w-7xl mx-auto rounded-2xl border border-light-border dark:border-dark-border bg-white/95 dark:bg-dark-card/95 backdrop-blur-md shadow-xl shadow-black/10 dark:shadow-black/30 overflow-hidden"
          >
            <nav className="px-4 py-4 flex flex-col gap-1">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="block px-4 py-3 text-sm font-medium text-dark-base dark:text-light-base hover:bg-light-surface dark:hover:bg-dark-card transition-colors"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <div className="pt-3 flex flex-col gap-2 border-t border-light-border dark:border-dark-border mt-2">
                <Link href="/auth/login" onClick={() => setMobileOpen(false)}>
                  <Button variant="outline" size="sm" className="w-full">Sign In</Button>
                </Link>
                <Link href="/auth/register" onClick={() => setMobileOpen(false)}>
                  <Button size="sm" className="w-full">Get Started Free</Button>
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
