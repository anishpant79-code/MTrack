// src/pages/Watchlist.jsx - Watchlist & Saved Claims Tracker

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AppLayout } from '../components/navigation'
import { Button, StatCard, RiskBadge, SentimentBadge } from '../components/common'
import { ClaimCard, ClaimDetailModal } from '../components/cards'
import {
  INITIAL_STOCKS,
  INITIAL_CLAIMS,
  getWatchlist,
  saveWatchlist,
  getSavedClaims,
  toggleSavedClaim,
} from '../data'
import {
  Star,
  Trash2,
  Plus,
  TrendingUp,
  TrendingDown,
  ShieldAlert,
  ShieldCheck,
  Bookmark,
} from 'lucide-react'

export default function Watchlist() {
  const navigate = useNavigate()
  const [watchlistTickers, setWatchlistTickers] = useState(getWatchlist)
  const [savedClaimIds, setSavedClaimIds] = useState(getSavedClaims)
  const [selectedClaim, setSelectedClaim] = useState(null)
  const [showAddModal, setShowAddModal] = useState(false)

  const watchedStocks = INITIAL_STOCKS.filter((s) => watchlistTickers.includes(s.ticker))
  const savedClaims = INITIAL_CLAIMS.filter((c) => savedClaimIds.includes(c.id))

  const handleRemoveStock = (ticker) => {
    const updated = watchlistTickers.filter((t) => t !== ticker)
    setWatchlistTickers(updated)
    saveWatchlist(updated)
  }

  const handleAddStock = (ticker) => {
    if (!watchlistTickers.includes(ticker)) {
      const updated = [...watchlistTickers, ticker]
      setWatchlistTickers(updated)
      saveWatchlist(updated)
    }
    setShowAddModal(false)
  }

  const handleToggleSaveClaim = (claimId) => {
    const updated = toggleSavedClaim(claimId)
    setSavedClaimIds(updated)
  }

  // Calculate watchlist metrics
  const avgVeracity = watchedStocks.length
    ? Math.round(watchedStocks.reduce((sum, s) => sum + s.veracityScore, 0) / watchedStocks.length)
    : 0

  const highRiskCount = watchedStocks.filter((s) => s.riskLevel === 'High').length

  return (
    <AppLayout>
      <div className="space-y-8 sm:space-y-10">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              My Intelligence Watchlist
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-500">
              Monitor key equity holdings, rumor exposure, and saved verification audits.
            </p>
          </div>

          <Button size="sm" onClick={() => setShowAddModal(true)}>
            <Plus className="h-4 w-4" />
            Add Ticker to Watchlist
          </Button>
        </div>

        {/* Watchlist Metric Stats */}
        <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          <StatCard
            title="Watched Tickers"
            value={watchedStocks.length}
            icon={Star}
            subtitle="Custom tracking portfolio"
          />
          <StatCard
            title="Avg Veracity Score"
            value={`${avgVeracity}/100`}
            positive={avgVeracity >= 80}
            change={avgVeracity >= 80 ? 'High Integrity' : 'Caution'}
            icon={ShieldCheck}
            subtitle="Portfolio information rating"
          />
          <StatCard
            title="Elevated Noise Flags"
            value={highRiskCount}
            positive={highRiskCount === 0}
            change={highRiskCount > 0 ? 'Active Rumors' : 'Quiet'}
            icon={ShieldAlert}
            subtitle="Require verification caution"
          />
          <StatCard
            title="Saved Audits"
            value={savedClaims.length}
            icon={Bookmark}
            subtitle="Bookmarked for review"
          />
        </div>

        {/* 1. Tracked Stocks Table / Grid */}
        <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-5 mb-5">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                Watched Equities ({watchedStocks.length})
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Real-time price action combined with informational veracity ratings
              </p>
            </div>
          </div>

          {watchedStocks.length > 0 ? (
            <div className="overflow-x-auto -mx-2 sm:mx-0">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                    <th className="py-3.5 px-4">Ticker</th>
                    <th className="py-3.5 px-4">Price</th>
                    <th className="py-3.5 px-4">24h Change</th>
                    <th className="py-3.5 px-4">Veracity Score</th>
                    <th className="py-3.5 px-4">Rumor Risk</th>
                    <th className="py-3.5 px-4">Sentiment</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {watchedStocks.map((stock) => {
                    const isPos = stock.change >= 0
                    return (
                      <tr
                        key={stock.ticker}
                        className="hover:bg-slate-50/80 transition cursor-pointer"
                        onClick={() => navigate('/stocks', { state: { selectedTicker: stock.ticker } })}
                      >
                        <td className="py-4.5 px-4">
                          <div className="flex items-center gap-2.5">
                            <span className="font-extrabold text-sm text-slate-900">${stock.ticker}</span>
                            <span className="text-slate-500 font-medium truncate max-w-[150px]">{stock.name}</span>
                          </div>
                        </td>
                        <td className="py-4.5 px-4 font-extrabold text-slate-900">
                          ${stock.price.toFixed(2)}
                        </td>
                        <td className="py-4.5 px-4">
                          <span
                            className={`flex items-center gap-1 font-bold ${
                              isPos ? 'text-emerald-600' : 'text-rose-600'
                            }`}
                          >
                            {isPos ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
                            {isPos ? '+' : ''}{stock.changePercent}%
                          </span>
                        </td>
                        <td className="py-4.5 px-4">
                          <div className="flex items-center gap-2.5">
                            <span className="font-extrabold text-blue-700">{stock.veracityScore}/100</span>
                            <div className="h-1.5 w-16 bg-slate-100 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-blue-600 rounded-full"
                                style={{ width: `${stock.veracityScore}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="py-4.5 px-4">
                          <RiskBadge level={stock.riskLevel} />
                        </td>
                        <td className="py-4.5 px-4">
                          <SentimentBadge sentiment={stock.sentiment} />
                        </td>
                        <td className="py-4.5 px-4 text-right">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleRemoveStock(stock.ticker)
                            }}
                            className="rounded-xl p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition"
                            title="Remove from Watchlist"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-14 sm:py-16 text-center text-xs text-slate-500">
              <Star className="mx-auto h-10 w-10 text-amber-300 mb-3" />
              <p className="text-sm font-bold text-slate-800">Your Watchlist is Empty</p>
              <p className="mt-1 max-w-sm mx-auto leading-relaxed">Add stocks from the directory to monitor prices and rumor exposure.</p>
              <Button size="sm" className="mt-5" onClick={() => setShowAddModal(true)}>
                Add Tickers Now
              </Button>
            </div>
          )}
        </div>

        {/* 2. Bookmarked / Saved Claims Section */}
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                Bookmarked Claim Audits ({savedClaims.length})
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Claims you've flagged for further review or evidentiary monitoring
              </p>
            </div>
            <Link
              to="/feed"
              className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline"
            >
              Browse More Claims →
            </Link>
          </div>

          {savedClaims.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2">
              {savedClaims.map((claim) => (
                <ClaimCard
                  key={claim.id}
                  claim={claim}
                  onInspect={(c) => setSelectedClaim(c)}
                  isSaved={true}
                  onToggleSave={handleToggleSaveClaim}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center text-xs text-slate-500 shadow-xs">
              <Bookmark className="mx-auto h-9 w-9 text-slate-300 mb-2.5" />
              <p className="text-sm font-bold text-slate-800">No Saved Claim Audits</p>
              <p className="mt-1 max-w-sm mx-auto">Click the bookmark icon on any claim card in the feed to save it here.</p>
            </div>
          )}
        </div>

        {/* Modal: Add Stock to Watchlist */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 sm:p-6 backdrop-blur-xs">
            <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-2xl">
              <h3 className="text-lg font-bold text-slate-900">Add Ticker to Watchlist</h3>
              <p className="mt-1 text-xs text-slate-500">Select any equity to add to your tracking radar.</p>

              <div className="mt-5 max-h-64 overflow-y-auto space-y-2 pr-1">
                {INITIAL_STOCKS.map((stock) => {
                  const alreadyAdded = watchlistTickers.includes(stock.ticker)
                  return (
                    <div
                      key={stock.ticker}
                      className="flex items-center justify-between p-3 rounded-2xl border border-slate-100 hover:bg-slate-50 text-xs transition"
                    >
                      <div>
                        <span className="font-extrabold text-slate-900">${stock.ticker}</span>
                        <span className="text-slate-500 font-medium ml-2">{stock.name}</span>
                      </div>
                      <Button
                        size="sm"
                        variant={alreadyAdded ? 'outline' : 'primary'}
                        disabled={alreadyAdded}
                        onClick={() => handleAddStock(stock.ticker)}
                      >
                        {alreadyAdded ? 'Added' : 'Add'}
                      </Button>
                    </div>
                  )
                })}
              </div>

              <div className="mt-6 flex justify-end">
                <Button variant="ghost" size="sm" onClick={() => setShowAddModal(false)}>
                  Close
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Claim Detail Modal */}
        <ClaimDetailModal
          claim={selectedClaim}
          isOpen={!!selectedClaim}
          onClose={() => setSelectedClaim(null)}
        />
      </div>
    </AppLayout>
  )
}
