// src/pages/Feed.jsx - Live Financial Claims and News Feed

import { useState, useMemo } from 'react'
import { AppLayout } from '../components/navigation'
import { SearchInput, Tabs, Button } from '../components/common'
import { ClaimCard, ClaimDetailModal } from '../components/cards'
import {
  INITIAL_CLAIMS,
  getSavedClaims,
  toggleSavedClaim,
} from '../data'
import {
  SlidersHorizontal,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  HelpCircle,
} from 'lucide-react'

export default function Feed() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeStatus, setActiveStatus] = useState('ALL')
  const [selectedCategory, setSelectedCategory] = useState('ALL')
  const [sortBy, setSortBy] = useState('RECENT')
  const [savedClaims, setSavedClaims] = useState(getSavedClaims)
  const [selectedClaim, setSelectedClaim] = useState(null)

  const handleToggleSaveClaim = (claimId) => {
    const updated = toggleSavedClaim(claimId)
    setSavedClaims(updated)
  }

  const statusTabs = [
    { id: 'ALL', label: 'All Claims', count: INITIAL_CLAIMS.length },
    { id: 'VERIFIED', label: 'Verified', count: INITIAL_CLAIMS.filter(c => c.status === 'VERIFIED').length, icon: CheckCircle2 },
    { id: 'MISLEADING', label: 'Misleading', count: INITIAL_CLAIMS.filter(c => c.status === 'MISLEADING').length, icon: AlertTriangle },
    { id: 'DEBUNKED', label: 'Debunked', count: INITIAL_CLAIMS.filter(c => c.status === 'DEBUNKED').length, icon: XCircle },
    { id: 'UNVERIFIED', label: 'Under Review', count: INITIAL_CLAIMS.filter(c => c.status === 'UNVERIFIED').length, icon: HelpCircle },
  ]

  const filteredClaims = useMemo(() => {
    return INITIAL_CLAIMS.filter((claim) => {
      // Status filter
      if (activeStatus !== 'ALL' && claim.status !== activeStatus) return false

      // Category filter
      if (selectedCategory !== 'ALL' && !claim.category.toLowerCase().includes(selectedCategory.toLowerCase().slice(0, 5))) {
        return false
      }

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase()
        const matchTitle = claim.title.toLowerCase().includes(query)
        const matchSummary = claim.claimSummary.toLowerCase().includes(query)
        const matchTicker = claim.ticker.toLowerCase().includes(query)
        const matchSource = claim.sourceName.toLowerCase().includes(query)
        return matchTitle || matchSummary || matchTicker || matchSource
      }

      return true
    }).sort((a, b) => {
      if (sortBy === 'CONFIDENCE') return b.confidenceScore - a.confidenceScore
      if (sortBy === 'UPVOTES') return b.upvotes - a.upvotes
      if (sortBy === 'IMPACT') {
        const score = { High: 3, Medium: 2, Low: 1 }
        return (score[b.marketImpact] || 0) - (score[a.marketImpact] || 0)
      }
      return 0 // Default RECENT
    })
  }, [searchQuery, activeStatus, selectedCategory, sortBy])

  return (
    <AppLayout>
      <div className="space-y-6 sm:space-y-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              Live Claims & News Feed
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-500">
              Continuously stream and verify market claims, unconfirmed rumors, and analyst leaks.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="flex items-center gap-2 rounded-full bg-emerald-50 px-3.5 py-1.5 text-xs font-bold text-emerald-700 border border-emerald-200 shadow-2xs">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              Live Ingestion Active
            </span>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="rounded-3xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-xs space-y-4 sm:space-y-5">
          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 sm:gap-4">
            <SearchInput
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search claims, tickers ($NVDA, $AAPL), or sources..."
              onClear={() => setSearchQuery('')}
              className="flex-1"
            />

            <div className="flex items-center gap-2.5 shrink-0">
              {/* Category Filter */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-bold text-slate-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="ALL">All Categories</option>
                <option value="Hardware">Hardware & AI</option>
                <option value="Mergers">Mergers & Acquisitions</option>
                <option value="Cloud">Government & Cloud</option>
                <option value="Autonomous">Autonomous Tech</option>
                <option value="Antitrust">Antitrust & Legal</option>
              </select>

              {/* Sort By */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-bold text-slate-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="RECENT">Sort: Most Recent</option>
                <option value="CONFIDENCE">Sort: Highest Confidence</option>
                <option value="IMPACT">Sort: Market Impact</option>
                <option value="UPVOTES">Sort: Most Discussed</option>
              </select>
            </div>
          </div>

          {/* Status Tabs */}
          <div className="border-t border-slate-100 pt-4">
            <Tabs
              tabs={statusTabs}
              activeTab={activeStatus}
              onChange={setActiveStatus}
            />
          </div>
        </div>

        {/* Claim Cards Grid */}
        {filteredClaims.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2">
            {filteredClaims.map((claim) => (
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
          <div className="rounded-3xl border border-slate-200 bg-white p-12 sm:p-16 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
              <SlidersHorizontal className="h-7 w-7" />
            </div>
            <h3 className="mt-4 text-base font-bold text-slate-900">
              No matching financial claims found
            </h3>
            <p className="mt-1.5 text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
              We couldn't find any claims matching "{searchQuery}" with the current filters. Try resetting your search terms.
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-5"
              onClick={() => {
                setSearchQuery('')
                setActiveStatus('ALL')
                setSelectedCategory('ALL')
              }}
            >
              Reset Filters
            </Button>
          </div>
        )}

        {/* Claim Inspector Modal */}
        <ClaimDetailModal
          claim={selectedClaim}
          isOpen={!!selectedClaim}
          onClose={() => setSelectedClaim(null)}
        />
      </div>
    </AppLayout>
  )
}
