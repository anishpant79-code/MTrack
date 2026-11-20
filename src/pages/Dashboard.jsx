// src/pages/Dashboard.jsx - Main Financial Intelligence Dashboard

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AppLayout } from '../components/navigation'
import { StatCard } from '../components/common'
import { ClaimCard, StockCard, ClaimDetailModal } from '../components/cards'
import { SourceAccuracyChart, ClaimDistributionChart } from '../components/charts'
import {
  INITIAL_STOCKS,
  INITIAL_CLAIMS,
  SOURCE_CREDIBILITY_LEADERBOARD,
  MARKET_METRICS,
  getWatchlist,
  toggleWatchlistTicker,
  getSavedClaims,
  toggleSavedClaim,
} from '../data'
import {
  Sparkles,
  ShieldAlert,
  ShieldCheck,
  ArrowRight,
  Flame,
  AlertTriangle,
  Layers,
} from 'lucide-react'

export default function Dashboard() {
  const navigate = useNavigate()
  const [quickInput, setQuickInput] = useState('')
  const [watchlist, setWatchlist] = useState(getWatchlist)
  const [savedClaims, setSavedClaims] = useState(getSavedClaims)
  const [selectedClaim, setSelectedClaim] = useState(null)

  const handleToggleWatchlist = (ticker) => {
    const updated = toggleWatchlistTicker(ticker)
    setWatchlist(updated)
  }

  const handleToggleSaveClaim = (claimId) => {
    const updated = toggleSavedClaim(claimId)
    setSavedClaims(updated)
  }

  const handleQuickVerify = (e) => {
    e.preventDefault()
    if (!quickInput.trim()) return
    navigate('/verification', { state: { prefilledClaim: quickInput } })
  }

  return (
    <AppLayout>
      <div className="space-y-8 sm:space-y-10">
        {/* Top welcome & quick verify banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 p-6 sm:p-8 lg:p-10 text-white shadow-xl">
          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/10 px-3.5 py-1 text-xs font-semibold text-blue-300">
              <Sparkles className="h-3.5 w-3.5 text-blue-400" />
              Real-time Market Intelligence Engine Active
            </div>

            <h1 className="mt-4 text-2xl font-extrabold tracking-tight sm:text-3xl lg:text-4xl leading-tight">
              Financial claims, verified before you trade.
            </h1>

            <p className="mt-3 text-sm text-slate-300 sm:text-base leading-relaxed">
              Analyze market rumors, substantiate analyst leaks, and verify earnings claims with evidence cross-referencing.
            </p>

            {/* Quick verification input form */}
            <form onSubmit={handleQuickVerify} className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={quickInput}
                  onChange={(e) => setQuickInput(e.target.value)}
                  placeholder="Paste a market rumor, news headline, or ticker symbol..."
                  className="w-full rounded-2xl border border-slate-700 bg-white/10 px-4 py-3.5 text-xs sm:text-sm text-white placeholder-slate-400 backdrop-blur-md focus:border-blue-400 focus:bg-white/15 focus:outline-none focus:ring-2 focus:ring-blue-400/20"
                />
              </div>
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-7 py-3.5 text-xs sm:text-sm font-bold text-white shadow-lg shadow-blue-600/30 hover:bg-blue-500 transition active:scale-98 shrink-0"
              >
                <Sparkles className="h-4 w-4" />
                Analyze Claim
              </button>
            </form>
          </div>

          {/* Background glowing orbs */}
          <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-blue-600/20 blur-3xl" />
          <div className="pointer-events-none absolute right-40 -bottom-20 h-64 w-64 rounded-full bg-indigo-600/20 blur-3xl" />
        </div>

        {/* KPI Stat Cards */}
        <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          <StatCard
            title="Claims Analyzed"
            value={MARKET_METRICS.totalClaimsAnalyzed}
            change="+14% this week"
            positive={true}
            icon={Layers}
            subtitle="Across SEC, wires & social"
          />
          <StatCard
            title="Verification Accuracy"
            value={MARKET_METRICS.aiConfidenceAvg}
            change="+1.8%"
            positive={true}
            icon={ShieldCheck}
            subtitle="Cross-filing confirmation"
          />
          <StatCard
            title="Debunked Rumors"
            value={MARKET_METRICS.rumorsDebunked}
            change="+18 today"
            positive={false}
            icon={AlertTriangle}
            subtitle="Prevented market distortions"
          />
          <StatCard
            title="High-Risk Alerts"
            value={MARKET_METRICS.highRiskAlertsToday}
            change="Active monitor"
            positive={true}
            icon={ShieldAlert}
            subtitle="Elevated volatility rumors"
          />
        </div>

        {/* Main Content Grid: 2/3 and 1/3 */}
        <div className="grid gap-8 lg:gap-10 lg:grid-cols-3">
          {/* Left Column: Trending Claims & Breakdown (2 Cols) */}
          <div className="lg:col-span-2 space-y-8 sm:space-y-10">
            {/* Trending Claims Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Flame className="h-5 w-5 text-amber-500" />
                <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                  Trending Claims & Market Rumors
                </h2>
              </div>
              <Link
                to="/feed"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline transition"
              >
                View Live Feed ({INITIAL_CLAIMS.length})
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {/* Claims List */}
            <div className="grid gap-5 sm:grid-cols-2">
              {INITIAL_CLAIMS.slice(0, 4).map((claim) => (
                <ClaimCard
                  key={claim.id}
                  claim={claim}
                  onInspect={(c) => setSelectedClaim(c)}
                  isSaved={savedClaims.includes(claim.id)}
                  onToggleSave={handleToggleSaveClaim}
                />
              ))}
            </div>

            {/* Intelligence Visualizations row */}
            <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xs">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-5 mb-6">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Source Credibility Distribution
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Historical verification rating across major information origin channels
                  </p>
                </div>
                <span className="rounded-full bg-blue-50 px-3.5 py-1 text-xs font-bold text-blue-700 border border-blue-100">
                  Updated Live
                </span>
              </div>
              <div>
                <SourceAccuracyChart data={SOURCE_CREDIBILITY_LEADERBOARD} />
              </div>
            </div>
          </div>

          {/* Right Column: Tickers & Claim Distribution (1 Col) */}
          <div className="space-y-8 sm:space-y-10">
            {/* Claim Outcome Distribution */}
            <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-7 shadow-xs">
              <div className="border-b border-slate-100 pb-4 mb-5">
                <h3 className="text-base font-bold text-slate-900">
                  Claim Outcomes Breakdown
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Ratio of verified vs false market claims
                </p>
              </div>
              <div>
                <ClaimDistributionChart claims={INITIAL_CLAIMS} />
              </div>
            </div>

            {/* Watched Tickers Quick View */}
            <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-7 shadow-xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Tracked Stocks
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Veracity scores & rumor risk
                  </p>
                </div>
                <Link
                  to="/stocks"
                  className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline"
                >
                  All Stocks →
                </Link>
              </div>

              <div className="space-y-3.5">
                {INITIAL_STOCKS.slice(0, 4).map((stock) => (
                  <StockCard
                    key={stock.ticker}
                    stock={stock}
                    isWatchlisted={watchlist.includes(stock.ticker)}
                    onToggleWatchlist={handleToggleWatchlist}
                    onSelect={() => navigate('/stocks', { state: { selectedTicker: stock.ticker } })}
                  />
                ))}
              </div>
            </div>

            {/* Quick Tips Box */}
            <div className="rounded-3xl border border-blue-100 bg-blue-50/70 p-5 sm:p-6">
              <div className="flex items-center gap-2 text-xs font-bold text-blue-900">
                <ShieldCheck className="h-4 w-4 text-blue-600" />
                Investor Caution Principle
              </div>
              <p className="mt-2 text-xs leading-relaxed text-slate-600">
                Over 78% of anonymous social leaks on M&A rumors fail to materialize into formal SEC filings. Always cross-check primary EDGAR disclosures before executing.
              </p>
            </div>
          </div>
        </div>

        {/* Modal for inspect */}
        <ClaimDetailModal
          claim={selectedClaim}
          isOpen={!!selectedClaim}
          onClose={() => setSelectedClaim(null)}
        />
      </div>
    </AppLayout>
  )
}
