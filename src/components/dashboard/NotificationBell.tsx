'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Bell, CheckCircle, XCircle, Info, X } from 'lucide-react'

interface Notification {
  id: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  read: boolean
  created_at: string
}

function formatRelative(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function TypeIcon({ type }: { type: Notification['type'] }) {
  const cls = {
    success: 'text-emerald-500',
    error:   'text-red-primary',
    warning: 'text-amber-500',
    info:    'text-slate-400',
  }[type]

  if (type === 'success') return <CheckCircle size={14} className={cls} />
  if (type === 'error')   return <XCircle     size={14} className={cls} />
  return <Info size={14} className={cls} />
}

export function NotificationBell() {
  const [open,          setOpen]          = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const wrapperRef = useRef<HTMLDivElement>(null)

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await fetch('/api/notifications')
      if (res.ok) {
        const { data } = await res.json()
        setNotifications(data ?? [])
      }
    } catch { /* silent */ }
  }, [])

  // Poll every 30 s
  useEffect(() => {
    fetchNotifications()
    const id = setInterval(fetchNotifications, 30_000)
    return () => clearInterval(id)
  }, [fetchNotifications])

  // Close on outside click
  useEffect(() => {
    function onDown(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    if (open) document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [open])

  async function markAllRead() {
    await fetch('/api/notifications', { method: 'PATCH' })
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  function handleBellClick() {
    const next = !open
    setOpen(next)
    if (next) {
      // Re-fetch fresh data when opening; mark read after a brief delay
      fetchNotifications()
      setTimeout(markAllRead, 800)
    }
  }

  const unread = notifications.filter(n => !n.read).length

  return (
    <div className="relative" ref={wrapperRef}>
      {/* Bell button */}
      <button
        onClick={handleBellClick}
        className="w-8 h-8 flex items-center justify-center border border-light-border dark:border-dark-border text-slate-500 dark:text-slate-400 hover:border-red-primary hover:text-red-primary transition-colors relative"
        aria-label="Notifications"
      >
        <Bell size={15} />
        {unread > 0 && (
          <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-0.5 bg-red-primary text-white text-[9px] font-bold flex items-center justify-center rounded-full">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 top-11 w-80 bg-light-base dark:bg-dark-card border border-light-border dark:border-dark-border shadow-xl shadow-black/10 dark:shadow-black/40 z-50">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-light-border dark:border-dark-border">
            <h3 className="text-sm font-bold text-dark-base dark:text-white">Notifications</h3>
            <div className="flex items-center gap-3">
              {unread > 0 && (
                <button
                  onClick={markAllRead}
                  className="text-xs text-slate-500 dark:text-slate-400 hover:text-red-primary transition-colors font-medium"
                >
                  Mark all read
                </button>
              )}
              <button
                onClick={() => setOpen(false)}
                className="text-slate-400 hover:text-dark-base dark:hover:text-white transition-colors"
              >
                <X size={14} />
              </button>
            </div>
          </div>

          {/* List */}
          <div className="max-h-[340px] overflow-y-auto divide-y divide-light-border dark:divide-dark-border">
            {notifications.length === 0 ? (
              <div className="py-10 text-center">
                <Bell size={22} className="mx-auto text-slate-300 dark:text-slate-600 mb-2" />
                <p className="text-xs text-slate-400 dark:text-slate-500">No notifications yet</p>
              </div>
            ) : (
              notifications.map(n => (
                <div
                  key={n.id}
                  className={`px-4 py-3 flex items-start gap-3 transition-colors ${!n.read ? 'bg-red-primary/[0.04] dark:bg-red-primary/[0.06]' : ''}`}
                >
                  <div className="mt-0.5 flex-shrink-0">
                    <TypeIcon type={n.type} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-xs font-semibold text-dark-base dark:text-white leading-snug">{n.title}</p>
                      {!n.read && (
                        <span className="w-1.5 h-1.5 rounded-full bg-red-primary flex-shrink-0 mt-1" />
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">{n.message}</p>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">{formatRelative(n.created_at)}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
