// src/pages/Stocks.jsx - Comprehensive Stock Intelligence & Veracity Analysis

import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { AppLayout } from '../components/navigation'
import { SearchInput, Button, RiskBadge, SentimentBadge } from '../components/common'
import { ClaimCard, ClaimDetailModal } from '../components/cards'
import { StockPriceChart } from '../components/charts'
import {
  INITIAL_STOCKS,
  INITIAL_CLAIMS,
  getWatchlist,
  toggleWatchlistTicker,
  getSavedClaims,
  toggleSavedClaim,
} from '../data'
import {
  Star,
  Sparkles,
  ShieldCheck,
} from 'lucide-react'

export default function Stocks() {
  const location = useLocation()
  const navigate = useNavigate()
  const [stocks] = useState(INITIAL_STOCKS)
  const [watchlist, setWatchlist] = useState(getWatchlist)
  const [savedClaims, setSavedClaims] = useState(getSavedClaims)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTicker, setSelectedTicker] = useState(() => location.state?.selectedTicker || 'NVDA')
  const [selectedClaim, setSelectedClaim] = useState(null)

  const handleToggleWatchlist = (ticker) => {
    const updated = toggleWatchlistTicker(ticker)
    setWatchlist(updated)
  }

  const handleToggleSaveClaim = (claimId) => {
    const updated = toggleSavedClaim(claimId)
    setSavedClaims(updated)
  }

  const filteredStocks = stocks.filter((stock) => {
    const q = searchQuery.toLowerCase()
    return stock.ticker.toLowerCase().includes(q) || stock.name.toLowerCase().includes(q)
  })

  const currentStock = stocks.find((s) => s.ticker === selectedTicker) || stocks[0]
  const stockClaims = INITIAL_CLAIMS.filter((c) => c.ticker === currentStock.ticker)
  const isWatchlisted = watchlist.includes(currentStock.ticker)
  const isPositive = currentStock.change >= 0

  return (
    <AppLayout>
      <div className="space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              Stocks Intelligence & Rumor Risk
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-500">
              Evaluate real-time pricing paired with AI claims credibility and noise risk.
            </p>
          </div>

          <Button
            size="sm"
            onClick={() => navigate('/verification', { state: { prefilledTicker: currentStock.ticker } })}
          >
            <Sparkles className="h-4 w-4" />
            Verify Rumor on ${currentStock.ticker}
          </Button>
        </div>

        {/* Two-Column Grid: Stock Directory (Left) and Detailed Stock View (Right) */}
        <div className="grid gap-6 lg:gap-8 lg:grid-cols-12">
          {/* Left: Stock Picker List */}
          <div className="lg:col-span-4 space-y-4">
            <div className="rounded-3xl border border-slate-200/90 bg-white p-3.5 sm:p-4 shadow-xs">
              <SearchInput
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Filter stocks..."
                onClear={() => setSearchQuery('')}
              />
            </div>

            <div className="max-h-[720px] overflow-y-auto space-y-2.5 pr-1">
              {filteredStocks.map((stock) => {
                const isSelected = stock.ticker === currentStock.ticker
                const isPos = stock.change >= 0

                return (
                  <div
                    key={stock.ticker}
                    onClick={() => setSelectedTicker(stock.ticker)}
                    className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/60 shadow-sm ring-1 ring-blue-500'
                        : 'border-slate-200/80 bg-white hover:border-slate-300 hover:bg-slate-50/60'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-slate-900 text-sm">${stock.ticker}</span>
                        <span className="text-[11px] font-semibold text-slate-400 truncate max-w-[130px]">
                          {stock.name}
                        </span>
                      </div>
                      <div className="mt-1.5 flex items-center gap-2 text-xs">
                        <span className="font-bold text-slate-800">${stock.price.toFixed(2)}</span>
                        <span className={`font-bold text-[11px] ${isPos ? 'text-emerald-600' : 'text-rose-600'}`}>
                          {isPos ? '+' : ''}{stock.changePercent}%
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Veracity</div>
                      <div className="text-sm font-extrabold text-blue-700">{stock.veracityScore}/100</div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Right: Selected Stock Detail View */}
          <div className="lg:col-span-8 space-y-6 sm:space-y-8">
            {/* Stock Master Card */}
            <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xs">
              {/* Header row */}
              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 pb-6 mb-6">
                <div>
                  <div className="flex items-center gap-3">
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                      ${currentStock.ticker}
                    </h2>
                    <span className="text-sm font-semibold text-slate-500">{currentStock.name}</span>
                    <RiskBadge level={currentStock.riskLevel} />
                  </div>
                  <p className="mt-1 text-xs text-slate-400 font-medium">{currentStock.sector}</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleToggleWatchlist(currentStock.ticker)}
                    className={`inline-flex items-center gap-1.5 rounded-xl border px-3.5 py-2 text-xs font-bold transition ${
                      isWatchlisted
                        ? 'border-amber-200 bg-amber-50 text-amber-700 shadow-2xs'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300'
                    }`}
                  >
                    <Star className={`h-4 w-4 ${isWatchlisted ? 'fill-amber-400 text-amber-500' : ''}`} />
                    {isWatchlisted ? 'In Watchlist' : 'Add to Watchlist'}
                  </button>
                </div>
              </div>

              {/* Price and Key Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 border-b border-slate-100 pb-6 mb-6">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Current Price</span>
                  <div className="mt-1.5 flex items-baseline gap-2">
                    <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">${currentStock.price.toFixed(2)}</span>
                    <span className={`text-xs font-bold ${isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {isPositive ? '+' : ''}{currentStock.change.toFixed(2)} ({isPositive ? '+' : ''}{currentStock.changePercent}%)
                    </span>
                  </div>
                </div>

                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Market Cap</span>
                  <div className="mt-1.5 text-base sm:text-lg font-bold text-slate-800">{currentStock.marketCap}</div>
                </div>

                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">P/E Ratio</span>
                  <div className="mt-1.5 text-base sm:text-lg font-bold text-slate-800">{currentStock.peRatio}</div>
                </div>

                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">52W Range</span>
                  <div className="mt-1.5 text-xs sm:text-sm font-bold text-slate-800">
                    ${currentStock.low52} - ${currentStock.high52}
                  </div>
                </div>
              </div>

              {/* Interactive Price Chart */}
              <div className="mt-2">
                <StockPriceChart
                  data={currentStock.history}
                  ticker={currentStock.ticker}
                  currentPrice={currentStock.price}
                />
              </div>

              {/* Description */}
              <p className="mt-6 text-xs leading-relaxed text-slate-600 border-t border-slate-100 pt-5">
                {currentStock.description}
              </p>
            </div>

            {/* AI Veracity & Noise Profile */}
            <div className="rounded-3xl border border-blue-100 bg-blue-50/60 p-6 sm:p-8">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-blue-100 pb-4 mb-5">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-blue-600" />
                  <h3 className="text-base font-bold text-blue-950">
                    AI Veracity & Noise Assessment for ${currentStock.ticker}
                  </h3>
                </div>
                <span className="text-xs font-bold text-blue-700 bg-white px-3.5 py-1 rounded-full border border-blue-200 shadow-2xs">
                  Veracity Score: {currentStock.veracityScore}/100
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="rounded-2xl bg-white p-4 sm:p-5 border border-blue-100 text-xs shadow-2xs">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Information Noise Risk</span>
                  <p className="mt-1.5 text-sm font-bold text-slate-800">{currentStock.riskLevel} Volatility</p>
                  <p className="mt-1 text-[11px] text-slate-500 leading-relaxed">Frequency of unconfirmed rumors impacting trading volume.</p>
                </div>

                <div className="rounded-2xl bg-white p-4 sm:p-5 border border-blue-100 text-xs shadow-2xs">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Market Sentiment</span>
                  <div className="mt-1.5">
                    <SentimentBadge sentiment={currentStock.sentiment} />
                  </div>
                  <p className="mt-1 text-[11px] text-slate-500 leading-relaxed">Derived from verified news & institutional disclosures.</p>
                </div>

                <div className="rounded-2xl bg-white p-4 sm:p-5 border border-blue-100 text-xs shadow-2xs">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Active Claims Flagged</span>
                  <p className="mt-1.5 text-sm font-bold text-slate-800">{stockClaims.length} Claim Records</p>
                  <p className="mt-1 text-[11px] text-slate-500 leading-relaxed">Cross-referenced against SEC EDGAR database records.</p>
                </div>
              </div>
            </div>

            {/* Claims Attached to this stock */}
            <div className="space-y-4 sm:space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                  Active Claims Regarding ${currentStock.ticker} ({stockClaims.length})
                </h3>
              </div>

              {stockClaims.length > 0 ? (
                <div className="grid gap-6 sm:grid-cols-2">
                  {stockClaims.map((claim) => (
                    <ClaimCard
                      key={claim.id}
                      claim={claim}
                      onInspect={(c) => setSelectedClaim(c)}
                      isSaved={savedClaims.includes(claim.id)}
                      onToggleSave={handleToggleSaveClaim}
                    />
                  ))}
                </div>
              ) : (
                <div className="rounded-3xl border border-slate-200 bg-white p-10 sm:p-12 text-center text-xs text-slate-500 shadow-xs">
                  <ShieldCheck className="mx-auto h-9 w-9 text-emerald-500 mb-2.5" />
                  <p className="text-sm font-bold text-slate-800">Clean Information Slate</p>
                  <p className="mt-1 text-slate-500 max-w-sm mx-auto">No unverified rumors or contradictory claims currently flagged for ${currentStock.ticker}.</p>
                </div>
              )}
            </div>
          </div>
        </div>

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
