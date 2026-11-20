// src/components/navigation.jsx - App Layout, Sidebar, Topbar & Market Ticker Strip

import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  ChartNoAxesCombined,
  LayoutDashboard,
  Newspaper,
  TrendingUp,
  Star,
  ShieldCheck,
  Settings,
  Menu,
  X,
  Search,
  Bell,
  LogOut,
  Sparkles,
  ExternalLink,
} from 'lucide-react'
import { MARKET_METRICS } from '../data'

const NAV_ITEMS = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/feed', label: 'Claims Feed', icon: Newspaper, badge: 'Live' },
  { path: '/stocks', label: 'Stocks Intel', icon: TrendingUp },
  { path: '/watchlist', label: 'Watchlist', icon: Star },
  { path: '/verification', label: 'AI Verifier', icon: ShieldCheck, highlight: true },
  { path: '/settings', label: 'Settings', icon: Settings },
]

const PAGE_METADATA = {
  '/dashboard': { title: 'Dashboard Overview', subtitle: 'Live market signals, evidence breakdown & portfolio health' },
  '/feed': { title: 'Claims & Rumors Feed', subtitle: 'Real-time multi-source financial claims & corroboration stream' },
  '/stocks': { title: 'Stocks Intelligence', subtitle: 'Equity fundamentals, veracity scoring & rumor exposure' },
  '/watchlist': { title: 'Intelligence Watchlist', subtitle: 'Custom portfolio tracking, veracity ratings & saved audits' },
  '/verification': { title: 'AI Claim Verifier', subtitle: 'Multi-factor evidentiary synthesis & regulatory cross-referencing' },
  '/settings': { title: 'Settings & Preferences', subtitle: 'AI confidence thresholds, notification channels & profile' },
}

export function AppLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const location = useLocation()

  return (
    <div className="h-screen w-screen overflow-hidden bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* 1. Market Ticker Strip */}
      <div className="bg-slate-900 text-slate-200 text-xs py-2 px-4 sm:px-6 border-b border-slate-800 overflow-x-auto scrollbar-none flex items-center justify-between gap-6 shrink-0 z-40 select-none">
        <div className="flex items-center gap-6 shrink-0">
          <span className="flex items-center gap-1.5 font-bold text-[11px] text-blue-400 uppercase tracking-wider">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            Market Pulse
          </span>
          {MARKET_METRICS.indices.map((idx) => (
            <div key={idx.symbol} className="flex items-center gap-2">
              <span className="text-slate-400 font-medium">{idx.symbol}</span>
              <span className="font-bold text-white tracking-tight">{idx.value}</span>
              <span
                className={`font-semibold text-[11px] px-1.5 py-0.5 rounded ${
                  idx.positive
                    ? 'text-emerald-400 bg-emerald-500/10'
                    : 'text-rose-400 bg-rose-500/10'
                }`}
              >
                {idx.percent}
              </span>
            </div>
          ))}
        </div>

        <div className="hidden lg:flex items-center gap-4 text-slate-400 shrink-0 text-[11px]">
          <span>AI Verifications Today: <strong className="text-white font-semibold">1,420</strong></span>
          <span className="text-slate-600">•</span>
          <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Engine Status: Operational
          </span>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden relative">
        {/* Mobile backdrop */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-xs transition-opacity md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* 2. Sidebar Navigation */}
        <aside
          className={`fixed inset-y-0 left-0 z-50 w-64 border-r border-slate-200 bg-white transition-transform duration-200 ease-in-out md:static md:translate-x-0 ${
            sidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
          } flex flex-col justify-between shrink-0 h-full overflow-y-auto`}
        >
          <div className="flex flex-col">
            {/* Logo */}
            <div className="flex h-16 items-center justify-between border-b border-slate-100 px-6">
              <Link to="/dashboard" className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 shadow-md shadow-blue-600/20 text-white">
                  <ChartNoAxesCombined className="h-5 w-5" />
                </div>
                <span className="text-lg font-bold tracking-tight text-slate-900">
                  MTrack <span className="text-blue-600">AI</span>
                </span>
              </Link>

              <button
                type="button"
                onClick={() => setSidebarOpen(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 md:hidden"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Quick Action Button */}
            <div className="p-4">
              <Link
                to="/verification"
                onClick={() => setSidebarOpen(false)}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 py-3 px-4 text-xs font-bold text-white shadow-md shadow-blue-600/20 transition-all hover:from-blue-700 hover:to-indigo-700 hover:shadow-lg active:scale-98"
              >
                <Sparkles className="h-4 w-4" />
                Verify New Claim
              </Link>
            </div>

            {/* Nav links */}
            <nav className="space-y-1.5 px-3 py-1">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon
                const isActive = location.pathname === item.path

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center justify-between rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${
                      isActive
                        ? 'bg-blue-50/80 text-blue-700 font-bold shadow-xs'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon
                        className={`h-4 w-4 transition-colors ${
                          isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'
                        }`}
                      />
                      <span>{item.label}</span>
                    </div>

                    {item.badge && (
                      <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                )
              })}
            </nav>
          </div>

          {/* User profile & exit in sidebar footer */}
          <div className="border-t border-slate-100 p-4 space-y-2">
            <div className="rounded-2xl bg-slate-50 p-3 flex items-center justify-between border border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white font-bold text-xs shadow-xs">
                  AV
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold text-slate-800 leading-tight">Alex Vance</p>
                  <p className="text-[10px] text-slate-500 font-medium">Pro Analyst</p>
                </div>
              </div>
              <Link
                to="/"
                title="Back to Landing"
                className="rounded-lg p-1.5 text-slate-400 hover:bg-white hover:text-blue-600 transition shadow-2xs"
              >
                <ExternalLink className="h-4 w-4" />
              </Link>
            </div>

            <Link
              to="/login"
              className="flex items-center justify-center gap-2 rounded-xl py-2 text-xs font-medium text-slate-500 hover:bg-rose-50 hover:text-rose-600 transition"
            >
              <LogOut className="h-3.5 w-3.5" />
              Sign Out
            </Link>
          </div>
        </aside>

        {/* 3. Main Content Area */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Header */}
          <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-5 sm:px-8 shrink-0 z-30">
            <div className="flex items-center gap-3.5">
              <button
                type="button"
                onClick={() => setSidebarOpen(true)}
                className="rounded-xl border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 md:hidden transition"
              >
                <Menu className="h-5 w-5" />
              </button>

              <div className="hidden sm:block">
                <h1 className="text-base font-bold text-slate-900 tracking-tight">
                  {(PAGE_METADATA[location.pathname] || { title: 'Dashboard Overview' }).title}
                </h1>
                <p className="text-[11px] text-slate-400 font-medium">
                  {(PAGE_METADATA[location.pathname] || { subtitle: 'Evidence-first financial claim intelligence' }).subtitle}
                </p>
              </div>
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-3">
              <Link
                to="/feed"
                className="hidden lg:flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50/80 px-3.5 py-2 text-xs text-slate-500 hover:border-slate-300 hover:bg-slate-100 transition"
              >
                <Search className="h-3.5 w-3.5 text-slate-400" />
                <span>Search claims, tickers, sources...</span>
                <kbd className="rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-semibold text-slate-400">
                  /
                </kbd>
              </Link>

              {/* Notification toggle */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative rounded-xl border border-slate-200 p-2.5 text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition"
                  title="Notifications"
                >
                  <Bell className="h-4 w-4" />
                  <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white" />
                </button>

                {showNotifications && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setShowNotifications(false)}
                    />
                    <div className="absolute right-0 mt-2.5 w-84 rounded-3xl border border-slate-200 bg-white p-5 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                        <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">Intelligence Alerts</span>
                        <span className="rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-bold text-rose-700">
                          2 New
                        </span>
                      </div>
                      <div className="mt-3.5 space-y-2.5 text-xs">
                        <div className="rounded-xl bg-rose-50/80 p-3 border border-rose-100">
                          <p className="font-semibold text-rose-800">High Risk Rumor Flagged</p>
                          <p className="text-slate-600 mt-1 text-[11px] leading-relaxed">NVIDIA 40% margin compression claim debunked by TSMC filings.</p>
                        </div>
                        <div className="rounded-xl bg-emerald-50/80 p-3 border border-emerald-100">
                          <p className="font-semibold text-emerald-800">Contract Confirmed</p>
                          <p className="text-slate-600 mt-1 text-[11px] leading-relaxed">Microsoft $10B EU Sovereign cloud contract verified in TED registry.</p>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Back to Landing link */}
              <Link
                to="/"
                className="hidden sm:inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition"
              >
                Homepage
              </Link>
            </div>
          </header>

          {/* Page View Body */}
          <main className="flex-1 overflow-y-auto p-5 sm:p-8 lg:p-10 pb-20">
            <div className="mx-auto max-w-7xl">{children}</div>
          </main>
        </div>
      </div>
    </div>
  )
}
