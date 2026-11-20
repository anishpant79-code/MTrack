// src/components/cards.jsx - Reusable Domain Cards for Claims, Stocks & Evidence

import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  TrendingUp,
  TrendingDown,
  Star,
  ThumbsUp,
  MessageSquare,
  Bookmark,
  ChevronRight,
  AlertOctagon,
  Sparkles,
  FileCheck2,
} from 'lucide-react'
import { StatusBadge, RiskBadge, CredibilityGauge, Modal } from './common'

export function ClaimCard({
  claim,
  onInspect,
  isSaved = false,
  onToggleSave,
}) {
  const [upvotes, setUpvotes] = useState(claim.upvotes || 0)
  const [hasUpvoted, setHasUpvoted] = useState(false)

  const handleUpvote = (e) => {
    e.stopPropagation()
    if (hasUpvoted) {
      setUpvotes(upvotes - 1)
      setHasUpvoted(false)
    } else {
      setUpvotes(upvotes + 1)
      setHasUpvoted(true)
    }
  }

  const handleToggleSave = (e) => {
    e.stopPropagation()
    if (onToggleSave) onToggleSave(claim.id)
  }

  return (
    <article
      onClick={() => onInspect && onInspect(claim)}
      className="group relative flex flex-col justify-between rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-7 shadow-xs transition-all duration-200 hover:-translate-y-1 hover:border-blue-200 hover:shadow-md cursor-pointer"
    >
      <div>
        {/* Header row: Ticker, Category, and Status */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3.5">
          <div className="flex items-center gap-2">
            <span className="rounded-xl bg-blue-50 px-3 py-1 text-xs font-extrabold text-blue-700">
              ${claim.ticker}
            </span>
            <span className="text-xs font-semibold text-slate-500">
              {claim.category}
            </span>
          </div>
          <StatusBadge status={claim.status} size="sm" />
        </div>

        {/* Claim Title */}
        <h3 className="mt-4 text-base font-bold leading-snug text-slate-900 group-hover:text-blue-600 transition-colors">
          {claim.title}
        </h3>

        {/* Claim Summary */}
        <p className="mt-2.5 line-clamp-2 text-xs leading-relaxed text-slate-600">
          {claim.claimSummary}
        </p>

        {/* AI Verdict summary preview */}
        <div className="mt-4 rounded-2xl border border-blue-50 bg-blue-50/60 p-3.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-blue-900">
            <Sparkles className="h-3.5 w-3.5 text-blue-600" />
            <span>AI Verification Verdict</span>
            <span className="ml-auto text-[11px] font-bold text-blue-600">
              {claim.confidenceScore}% Confidence
            </span>
          </div>
          <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-slate-700 font-medium">
            {claim.aiVerdictSummary}
          </p>
        </div>
      </div>

      {/* Footer details */}
      <div className="mt-5 border-t border-slate-100 pt-3.5">
        <div className="flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700">{claim.sourceName}</span>
            <span>•</span>
            <span className="text-slate-400">{claim.date}</span>
          </div>
          <CredibilityGauge score={claim.sourceCredibility} size="compact" />
        </div>

        <div className="mt-3.5 flex items-center justify-between pt-1">
          <div className="flex items-center gap-3 text-xs">
            <button
              type="button"
              onClick={handleUpvote}
              className={`flex items-center gap-1 rounded-xl px-2.5 py-1 font-bold transition ${
                hasUpvoted ? 'bg-blue-50 text-blue-600' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'
              }`}
            >
              <ThumbsUp className="h-3.5 w-3.5" />
              <span>{upvotes}</span>
            </button>

            <span className="flex items-center gap-1 text-slate-500 font-medium">
              <MessageSquare className="h-3.5 w-3.5" />
              <span>{claim.commentsCount}</span>
            </span>

            <button
              type="button"
              onClick={handleToggleSave}
              className={`flex items-center gap-1 rounded-xl p-1.5 transition ${
                isSaved ? 'text-amber-600 bg-amber-50' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Bookmark className={`h-3.5 w-3.5 ${isSaved ? 'fill-amber-500 text-amber-500' : ''}`} />
            </button>
          </div>

          <span className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 group-hover:underline">
            Inspect Evidence
            <ChevronRight className="h-3.5 w-3.5" />
          </span>
        </div>
      </div>
    </article>
  )
}

export function StockCard({
  stock,
  isSelected = false,
  isWatchlisted = false,
  onToggleWatchlist,
  onSelect,
}) {
  const isPositive = stock.change >= 0

  return (
    <div
      onClick={() => onSelect && onSelect(stock)}
      className={`group relative flex flex-col justify-between rounded-3xl border p-5 sm:p-6 transition-all cursor-pointer ${
        isSelected
          ? 'border-blue-600 bg-blue-50/40 ring-1 ring-blue-500 shadow-sm'
          : 'border-slate-200/80 bg-white hover:border-slate-300 hover:shadow-xs'
      }`}
    >
      <div>
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-base font-extrabold text-slate-900">${stock.ticker}</h4>
              <RiskBadge level={stock.riskLevel} />
            </div>
            <p className="mt-0.5 line-clamp-1 text-xs text-slate-500 font-medium">{stock.name}</p>
          </div>

          {onToggleWatchlist && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                onToggleWatchlist(stock.ticker)
              }}
              className="rounded-xl p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-amber-500"
              title={isWatchlisted ? 'Remove from Watchlist' : 'Add to Watchlist'}
            >
              <Star
                className={`h-4 w-4 ${
                  isWatchlisted ? 'fill-amber-400 text-amber-500' : ''
                }`}
              />
            </button>
          )}
        </div>

        <div className="mt-4 flex items-baseline justify-between">
          <div>
            <span className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900">
              ${stock.price.toFixed(2)}
            </span>
            <div
              className={`flex items-center gap-0.5 text-xs font-bold ${
                isPositive ? 'text-emerald-600' : 'text-rose-600'
              }`}
            >
              {isPositive ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
              <span>
                {isPositive ? '+' : ''}
                {stock.change.toFixed(2)} ({isPositive ? '+' : ''}
                {stock.changePercent}%)
              </span>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Veracity</span>
            <div className="text-sm font-extrabold text-blue-700">
              {stock.veracityScore}/100
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3.5 text-xs text-slate-500">
        <span className="font-medium">{stock.sector}</span>
        <span className="font-bold text-slate-700">
          {stock.activeClaimsCount} active claims
        </span>
      </div>
    </div>
  )
}

export function ClaimDetailModal({ claim, isOpen, onClose }) {
  if (!claim) return null

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Claim Intelligence Breakdown" maxWidth="max-w-3xl">
      <div className="space-y-6">
        {/* Header metadata */}
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="rounded-lg bg-blue-600 px-3 py-1 text-xs font-bold text-white">
                ${claim.ticker}
              </span>
              <span className="text-xs font-semibold text-slate-600">{claim.category}</span>
              <span className="text-xs text-slate-400">• ID: {claim.id}</span>
            </div>
            <StatusBadge status={claim.status} />
          </div>

          <h2 className="mt-3 text-lg font-bold text-slate-900 sm:text-xl">
            {claim.title}
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-700">
            {claim.claimSummary}
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-6 border-t border-slate-200 pt-3 text-xs text-slate-600">
            <div>
              <span className="text-slate-400">Source:</span>{' '}
              <strong className="text-slate-800">{claim.sourceName}</strong> ({claim.sourceType})
            </div>
            <div>
              <span className="text-slate-400">Credibility:</span>{' '}
              <strong className="text-slate-800">{claim.sourceCredibility}/100</strong>
            </div>
            <div>
              <span className="text-slate-400">Date:</span>{' '}
              <strong className="text-slate-800">{claim.date}</strong>
            </div>
          </div>
        </div>

        {/* AI Synthesis Box */}
        <div className="rounded-xl border border-blue-200 bg-blue-50/70 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-blue-600" />
              <h4 className="text-sm font-bold text-blue-900">AI Verification Analysis</h4>
            </div>
            <span className="rounded-full bg-blue-600 px-3 py-0.5 text-xs font-semibold text-white">
              {claim.confidenceScore}% Confidence
            </span>
          </div>
          <p className="mt-2 text-sm leading-6 text-blue-950">
            {claim.aiVerdictSummary}
          </p>
        </div>

        {/* Evidence Grid */}
        <div className="grid gap-4 sm:grid-cols-2">
          {/* Evidence For */}
          <div className="rounded-xl border border-emerald-200 bg-emerald-50/40 p-4">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 uppercase tracking-wider">
              <FileCheck2 className="h-4 w-4 text-emerald-600" />
              Evidence Supporting Claim ({claim.evidenceFor?.length || 0})
            </div>
            <div className="mt-3 space-y-3">
              {claim.evidenceFor && claim.evidenceFor.length > 0 ? (
                claim.evidenceFor.map((item, i) => (
                  <div key={i} className="rounded-lg border border-emerald-100 bg-white p-3 text-xs shadow-2xs">
                    <p className="font-medium text-slate-800">{item.text}</p>
                    <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
                      <span>Source: {item.source}</span>
                      <span className="font-semibold text-emerald-600">{item.credibility}% Trust</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-500 italic">No credible supporting evidence found.</p>
              )}
            </div>
          </div>

          {/* Evidence Against */}
          <div className="rounded-xl border border-rose-200 bg-rose-50/40 p-4">
            <div className="flex items-center gap-2 text-xs font-bold text-rose-800 uppercase tracking-wider">
              <AlertOctagon className="h-4 w-4 text-rose-600" />
              Contradictory / Refuting Evidence ({claim.evidenceAgainst?.length || 0})
            </div>
            <div className="mt-3 space-y-3">
              {claim.evidenceAgainst && claim.evidenceAgainst.length > 0 ? (
                claim.evidenceAgainst.map((item, i) => (
                  <div key={i} className="rounded-lg border border-rose-100 bg-white p-3 text-xs shadow-2xs">
                    <p className="font-medium text-slate-800">{item.text}</p>
                    <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
                      <span>Source: {item.source}</span>
                      <span className="font-semibold text-rose-600">{item.credibility}% Trust</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-500 italic">No contradictory evidence recorded.</p>
              )}
            </div>
          </div>
        </div>

        {/* Footer recommendation */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-200 pt-4 text-xs text-slate-500">
          <span>Market Impact Rating: <strong className="text-slate-800">{claim.marketImpact}</strong></span>
          <div className="flex items-center gap-3">
            <Link
              to="/verification"
              onClick={onClose}
              className="font-semibold text-blue-600 hover:underline"
            >
              Run Custom Verification Check →
            </Link>
          </div>
        </div>
      </div>
    </Modal>
  )
}
