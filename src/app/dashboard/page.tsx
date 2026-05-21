'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { ArrowDownToLine, ArrowUpFromLine, TrendingUp, ArrowUpRight, ShieldAlert, X, History, Loader2 } from 'lucide-react'
import { TopBar } from '@/components/dashboard/TopBar'
import { BTCChart } from '@/components/dashboard/BTCChart'
import { createClient } from '@/lib/supabase/client'

interface Profile {
  full_name: string
  balance: number
  profit: number
  plan: string
  kyc_status: string
}

interface Tx {
  id: string
  type: string
  amount: number
  method: string
  status: string
  created_at: string
}

const timeRanges = ['1D', '1W', '1M', '3M', '1Y', 'ALL']

function statusClasses(status: string) {
  if (status === 'Completed') return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400'
  if (status === 'Pending')   return 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400'
  if (status === 'Rejected')  return 'bg-red-primary/10 text-red-primary'
  return 'bg-slate-100 text-slate-600 dark:bg-dark-border dark:text-slate-400'
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export default function DashboardPage() {
  const [profile,      setProfile]      = useState<Profile | null>(null)
  const [transactions, setTransactions] = useState<Tx[]>([])
  const [loading,      setLoading]      = useState(true)
  const [activeRange,  setActiveRange]  = useState('1M')
  const [kycDismissed, setKycDismissed] = useState(false)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const [{ data: prof }, { data: txs }] = await Promise.all([
        supabase.from('profiles').select('full_name, balance, profit, plan, kyc_status').eq('id', user.id).single(),
        supabase.from('transactions').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(6),
      ])

      setProfile(prof)
      setTransactions(txs ?? [])
      setLoading(false)
    }
    load()
  }, [])

  // Simple illustrative chart based on current balance
  const balance = profile?.balance ?? 0
  const chartData = Array.from({ length: 40 }, (_, i) =>
    Math.round(balance * (0.2 + (0.8 * i) / 39) + Math.sin(i * 0.5) * balance * 0.02)
  )

  function buildPaths(data: number[]) {
    const w = 600, h = 160, pad = 8
    const min = Math.min(...data), max = Math.max(...data)
    const range = max - min || 1
    const pts = data.map((v, i) => ({
      x: (i / (data.length - 1)) * w,
      y: pad + ((max - v) / range) * (h - pad * 2),
    }))
    const line = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')
    const area = `${line} L${pts.at(-1)!.x.toFixed(1)},${h} L0,${h} Z`
    return { line, area }
  }

  const { line, area } = buildPaths(chartData)
  const totalDeposited = transactions.filter(t => t.type === 'Deposit' && t.status === 'Completed').reduce((s, t) => s + t.amount, 0)

  if (loading) {
    return (
      <div>
        <TopBar title="Dashboard" subtitle="Loading…" />
        <div className="flex items-center justify-center h-64">
          <Loader2 size={24} className="animate-spin text-red-primary" />
        </div>
      </div>
    )
  }

  const firstName = profile?.full_name?.split(' ')[0] ?? 'there'

  return (
    <div>
      <TopBar title="Dashboard" subtitle={`Welcome back, ${firstName}`} />

      <div className="p-4 sm:p-6 max-w-6xl mx-auto space-y-4 sm:space-y-6">

        {/* KYC banner */}
        {!kycDismissed && profile?.kyc_status === 'None' && (
          <div className="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-900/15 border border-amber-200 dark:border-amber-700/40">
            <ShieldAlert size={18} className="text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">Identity verification required</p>
              <p className="text-xs text-amber-700 dark:text-amber-400 mt-0.5">Complete KYC to unlock full withdrawal access and higher deposit limits.</p>
              <Link href="/dashboard/kyc" className="inline-flex items-center gap-1.5 mt-2 text-xs font-bold text-amber-800 dark:text-amber-300 underline underline-offset-2">
                Verify now <ArrowUpRight size={12} />
              </Link>
            </div>
            <button onClick={() => setKycDismissed(true)} className="text-amber-500 hover:text-amber-700 flex-shrink-0"><X size={16} /></button>
          </div>
        )}

        {/* Greeting */}
        <p className="text-2xl sm:text-3xl font-black text-dark-base dark:text-white">
          Hi, {profile?.full_name?.split(' ')[0] ?? 'there'} 👋
        </p>

        {/* Metrics grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="col-span-2 bg-light-base dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl p-5 sm:p-6">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Total Balance</p>
            <p className="text-3xl sm:text-4xl font-bold text-dark-base dark:text-white tracking-tight">
              ${balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            {balance > 0 && (
              <div className="flex items-center gap-1.5 mt-2">
                <ArrowUpRight size={13} className="text-emerald-500" />
                <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">Portfolio growing</span>
              </div>
            )}
          </div>

          <div className="bg-light-base dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl p-5 sm:p-6">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Deposited</p>
            <p className="text-xl sm:text-2xl font-bold text-dark-base dark:text-white">${totalDeposited.toLocaleString()}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Principal</p>
          </div>

          <div className="bg-light-base dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl p-5 sm:p-6">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Total Profit</p>
            <p className="text-xl sm:text-2xl font-bold text-red-primary">+${(profile?.profit ?? 0).toLocaleString()}</p>
          </div>

          <div className="col-span-2 lg:col-span-4 bg-light-base dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl p-5 sm:p-6 flex items-center gap-4">
            <div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Active Plan</p>
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-xl font-bold text-dark-base dark:text-white">{profile?.plan ?? 'None'}</span>
                {profile?.plan && profile.plan !== 'None' && (
                  <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-amber-400/15 text-amber-600 dark:text-amber-400 border border-amber-400/30">Current Plan</span>
                )}
              </div>
            </div>
            <Link href="/dashboard/plans" className="ml-auto flex items-center gap-1.5 text-xs font-semibold text-red-primary hover:text-red-dim transition-colors whitespace-nowrap">
              {profile?.plan === 'None' ? 'Choose a plan' : 'Manage plan'} <ArrowUpRight size={12} />
            </Link>
          </div>
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-3">
          <Link
            href="/dashboard/deposit"
            className="flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-1.5 sm:gap-2 rounded-lg px-4 py-3 sm:py-2.5 text-xs sm:text-sm font-semibold bg-emerald-500 hover:bg-emerald-600 text-white border border-emerald-500 hover:border-emerald-600 transition-colors"
          >
            <ArrowDownToLine size={15} /><span>Deposit</span>
          </Link>
          <Link
            href="/dashboard/withdraw"
            className="flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-1.5 sm:gap-2 rounded-lg px-4 py-3 sm:py-2.5 text-xs sm:text-sm font-semibold bg-red-primary hover:bg-red-dim text-white border border-red-primary hover:border-red-dim transition-colors"
          >
            <ArrowUpFromLine size={15} /><span>Withdraw</span>
          </Link>
          <Link
            href="/dashboard/plans"
            className="flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-1.5 sm:gap-2 rounded-lg px-4 py-3 sm:py-2.5 border border-light-border dark:border-dark-border text-xs sm:text-sm font-semibold text-dark-base dark:text-white hover:border-red-primary hover:text-red-primary transition-colors"
          >
            <TrendingUp size={15} /><span>Plans</span>
          </Link>
          <Link
            href="/dashboard/transactions"
            className="flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-1.5 sm:gap-2 rounded-lg px-4 py-3 sm:py-2.5 border border-light-border dark:border-dark-border text-xs sm:text-sm font-semibold text-dark-base dark:text-white hover:border-red-primary hover:text-red-primary transition-colors"
          >
            <History size={15} /><span>History</span>
          </Link>
        </div>

        {/* BTC live chart */}
        <BTCChart />

        {/* Chart */}
        {balance > 0 && (
          <div className="bg-light-base dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl p-5 sm:p-6">
            <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
              <div>
                <h2 className="text-sm font-bold text-dark-base dark:text-white">Portfolio Performance</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Balance growth</p>
              </div>
              <div className="flex gap-1">
                {timeRanges.map(r => (
                  <button key={r} onClick={() => setActiveRange(r)} className={`px-2 py-1 text-[11px] font-semibold transition-colors ${activeRange === r ? 'bg-red-primary text-white' : 'text-slate-500 dark:text-slate-400 hover:text-dark-base dark:hover:text-white'}`}>{r}</button>
                ))}
              </div>
            </div>
            <svg viewBox="0 0 600 160" className="w-full" style={{ height: 160 }} preserveAspectRatio="none">
              <defs>
                <linearGradient id="dashGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#DC2626" stopOpacity="0.18" />
                  <stop offset="100%" stopColor="#DC2626" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d={area} fill="url(#dashGrad)" />
              <path d={line} fill="none" stroke="#DC2626" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
            </svg>
          </div>
        )}

        {/* Recent transactions */}
        <div className="bg-light-base dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl">
          <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-light-border dark:border-dark-border">
            <h2 className="text-sm font-bold text-dark-base dark:text-white">Recent Transactions</h2>
            <Link href="/dashboard/transactions" className="text-xs font-semibold text-red-primary hover:text-red-dim transition-colors">View all</Link>
          </div>

          {transactions.length === 0 ? (
            <div className="py-10 text-center">
              <p className="text-sm text-slate-500 dark:text-slate-400">No transactions yet.</p>
              <Link href="/dashboard/deposit" className="inline-flex items-center gap-1.5 mt-3 text-sm font-semibold text-red-primary hover:text-red-dim transition-colors">
                Make your first deposit <ArrowUpRight size={14} />
              </Link>
            </div>
          ) : (
            <>
              {/* Desktop */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-light-border dark:border-dark-border">
                      {['Type', 'Amount', 'Method', 'Date', 'Status'].map(h => (
                        <th key={h} className="px-6 py-3 text-left text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-light-border dark:divide-dark-border">
                    {transactions.map(tx => (
                      <tr key={tx.id} className="hover:bg-light-surface dark:hover:bg-dark-surface transition-colors">
                        <td className="px-6 py-4 text-sm font-medium text-dark-base dark:text-white">{tx.type}</td>
                        <td className={`px-6 py-4 text-sm font-semibold ${tx.type === 'Withdrawal' ? 'text-red-primary' : 'text-dark-base dark:text-white'}`}>
                          {tx.type === 'Withdrawal' ? '-' : '+'}${tx.amount.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">{tx.method}</td>
                        <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">{formatDate(tx.created_at)}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${statusClasses(tx.status)}`}>{tx.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* Mobile */}
              <div className="sm:hidden divide-y divide-light-border dark:divide-dark-border">
                {transactions.map(tx => (
                  <div key={tx.id} className="px-5 py-4 flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-dark-base dark:text-white">{tx.type}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{tx.method} · {formatDate(tx.created_at)}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className={`text-sm font-semibold ${tx.type === 'Withdrawal' ? 'text-red-primary' : 'text-dark-base dark:text-white'}`}>
                        {tx.type === 'Withdrawal' ? '-' : '+'}${tx.amount.toLocaleString()}
                      </p>
                      <span className={`inline-flex mt-1 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${statusClasses(tx.status)}`}>{tx.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

      </div>
    </div>
  )
}
