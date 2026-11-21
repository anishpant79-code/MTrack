
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { getAuthHeaders } from '../utils/auth'
import useDocumentTitle from '../utils/useDocumentTitle'
import BackButton from '../components/BackButton'
import EmptyStateVisual from '../components/EmptyStateVisual'
import { PlusIcon } from '../components/Icons'

const API_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'

const filters = ['All', 'Verified', 'Unverified', 'Contradicted', 'Pending']

const formatDate = (date) => {
  if (!date) return 'Date unavailable'

  const parsedDate = new Date(date)

  if (Number.isNaN(parsedDate.getTime())) return 'Date unavailable'

  return parsedDate.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

const getStatusStyle = (status) => {
  switch (status) {
    case 'Verified':
      return 'bg-green-100 text-green-800'
    case 'Contradicted':
      return 'bg-red-100 text-red-700'
    case 'Unverified':
      return 'bg-amber-100 text-amber-800'
    default:
      return 'bg-gray-100 text-gray-700'
  }
}

function SavedClaims() {
  useDocumentTitle('Saved Claims')
  const [claims, setClaims] = useState([])
  const [search, setSearch] = useState('')
  const [activeFilter, setActiveFilter] = useState('All')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [removingId, setRemovingId] = useState(null)

  const fetchSavedClaims = useCallback(async () => {
    setLoading(true)
    setError('')

    try {
      const response = await fetch(`${API_URL}/claims?saved=true`, {
        headers: getAuthHeaders(),
      })
      const result = await response.json()

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Could not load saved claims.')
      }

      setClaims(Array.isArray(result.data) ? result.data : [])
    } catch (err) {
      setError(
        err.message ||
          'Unable to connect to the backend. Please check that your server is running.'
      )
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchSavedClaims()
  }, [fetchSavedClaims])

  const filteredClaims = useMemo(() => {
    return claims.filter((claim) => {
      const title = claim.title || ''
      const category = claim.category || ''
      const searchText = search.toLowerCase()

      const matchesSearch =
        title.toLowerCase().includes(searchText) ||
        category.toLowerCase().includes(searchText)

      const matchesStatus =
        activeFilter === 'All' || claim.status === activeFilter

      return matchesSearch && matchesStatus
    })
  }, [claims, search, activeFilter])

  const counts = useMemo(() => {
    return {
      total: claims.length,
      verified: claims.filter((claim) => claim.status === 'Verified').length,
      unverified: claims.filter((claim) => claim.status === 'Unverified').length,
      contradicted: claims.filter((claim) => claim.status === 'Contradicted').length,
    }
  }, [claims])

  const removeSavedClaim = async (claimId) => {
    const confirmed = window.confirm(
      'Remove this claim from Saved Claims? It will remain in your Claim History.'
    )

    if (!confirmed) return

    setRemovingId(claimId)
    setError('')

    try {
      const response = await fetch(`${API_URL}/claims/${claimId}`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          isSaved: false,
        }),
      })

      const result = await response.json()

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Could not remove this saved claim.')
      }

      setClaims((previousClaims) =>
        previousClaims.filter((claim) => claim._id !== claimId)
      )
    } catch (err) {
      setError(err.message || 'Something went wrong while removing the claim.')
    } finally {
      setRemovingId(null)
    }
  }

  return (
    <div className="min-h-screen bg-[#F4F7F5] px-4 py-6 text-[#172B24] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Page heading */}
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <BackButton label="Back to Dashboard" fallbackUrl="/dashboard" className="mb-3" />

            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Saved Claims
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-gray-500 max-w-2xl">
              Organize and review important financial claim audits saved from your verification workflows.
            </p>
          </div>

          <Link
            to="/verify"
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#00A878] px-5 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-xs transition hover:bg-[#008F65] cursor-pointer active:scale-[0.99]"
          >
            <PlusIcon className="w-3.5 h-3.5" />
            <span>Verify a Claim</span>
          </Link>
        </div>

        {/* Summary cards */}
        <div className="mb-7 grid grid-cols-2 gap-3 lg:grid-cols-4">
          <SummaryCard label="Total saved" value={counts.total} />
          <SummaryCard
            label="Verified"
            value={counts.verified}
            valueColor="text-green-700"
          />
          <SummaryCard
            label="Unverified"
            value={counts.unverified}
            valueColor="text-amber-700"
          />
          <SummaryCard
            label="Contradicted"
            value={counts.contradicted}
            valueColor="text-red-700"
          />
        </div>

        {/* Main content */}
        <div className="rounded-2xl border border-[#E1E9E3] bg-white p-4 shadow-sm sm:p-6">
          <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-lg font-bold">Your saved records</h2>
              <p className="mt-1 text-sm text-gray-500">
                Search and review your saved financial claims.
              </p>
            </div>

            <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto">
              <div className="relative w-full sm:min-w-64 lg:w-72">
                <svg
                  className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="11" cy="11" r="7" />
                  <path d="m20 20-4-4" />
                </svg>

                <input
                  type="text"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search saved claims..."
                  className="w-full rounded-xl border border-[#DCE6DF] bg-[#FAFCFA] py-3 pl-10 pr-4 text-sm outline-none transition focus:border-[#00A878] focus:ring-2 focus:ring-[#00A878]/10"
                />
              </div>

              <button
                onClick={fetchSavedClaims}
                disabled={loading}
                className="rounded-xl border border-[#DCE6DF] px-4 py-3 text-sm font-medium text-[#263B31] transition hover:bg-[#F4F7F5] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? 'Refreshing...' : 'Refresh'}
              </button>
            </div>
          </div>

          {/* Status filters */}
          <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition ${
                  activeFilter === filter
                    ? 'bg-[#E2F0E8] text-[#007B59]'
                    : 'bg-[#F4F7F5] text-gray-600 hover:bg-[#EAF0EC]'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-5 flex flex-col gap-3 rounded-xl border border-red-200 bg-red-50 p-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-red-700">{error}</p>
              <button
                onClick={fetchSavedClaims}
                className="shrink-0 text-sm font-semibold text-red-700 underline"
              >
                Try again
              </button>
            </div>
          )}

          {/* Loading */}
          {loading ? (
            <div className="py-16 text-center">
              <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-[#DCE6DF] border-t-[#00A878]" />
              <p className="text-sm text-gray-500">
                Loading your saved claims...
              </p>
            </div>
          ) : filteredClaims.length === 0 ? (
            /* Empty state */
            <div className="rounded-2xl border border-dashed border-[#DCE6DF] px-5 py-14 text-center bg-[#F9FBF9]">
              <EmptyStateVisual type="saved" size={80} />

              <h3 className="mt-4 text-base font-bold text-[#172B24]">
                {claims.length === 0
                  ? 'No saved claims yet'
                  : 'No matching saved claims found'}
              </h3>

              <p className="mx-auto mt-1 max-w-sm text-xs leading-relaxed text-gray-500">
                {claims.length === 0
                  ? 'When you bookmark a verified claim from your results or Claim History, it will be stored here.'
                  : 'Try typing a different search query or select another status filter.'}
              </p>

              {claims.length === 0 && (
                <Link
                  to="/verify"
                  className="mt-5 inline-flex items-center gap-1.5 rounded-xl bg-[#00A878] px-5 py-2.5 text-xs font-semibold text-white hover:bg-[#008F65] transition cursor-pointer shadow-xs"
                >
                  <PlusIcon className="w-3.5 h-3.5" />
                  <span>Verify your first claim</span>
                </Link>
              )}
            </div>
          ) : (
            /* Saved claims list */
            <div className="space-y-3">
              {filteredClaims.map((claim) => (
                <div
                  key={claim._id}
                  className="flex flex-col gap-4 rounded-xl border border-[#E7EDE8] p-4 transition hover:border-[#BFD8C8] sm:p-5 lg:flex-row lg:items-center lg:justify-between"
                >
                  <div className="min-w-0 flex-1">
                    <div className="mb-3 flex flex-wrap items-center gap-2">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(
                          claim.status
                        )}`}
                      >
                        {claim.status || 'Pending'}
                      </span>

                      {claim.category && (
                        <span className="rounded-full bg-[#F1F5F2] px-3 py-1 text-xs font-medium text-gray-600">
                          {claim.category}
                        </span>
                      )}
                    </div>

                    <h3 className="break-words text-base font-semibold leading-6 text-[#172B24]">
                      {claim.title}
                    </h3>

                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
                      <span>Saved claim</span>
                      <span>Added {formatDate(claim.createdAt)}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                    <Link
                      to={`/claim/${claim._id}`}
                      className="rounded-lg bg-[#E2F0E8] px-4 py-2.5 text-sm font-semibold text-[#007B59] transition hover:bg-[#D5E9DC]"
                    >
                      View details
                    </Link>

                    <button
                      onClick={() => removeSavedClaim(claim._id)}
                      disabled={removingId === claim._id}
                      className="rounded-lg border border-[#DCE6DF] px-4 py-2.5 text-sm font-medium text-gray-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {removingId === claim._id ? 'Removing...' : 'Remove'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && filteredClaims.length > 0 && (
            <p className="mt-5 text-xs text-gray-400">
              Showing {filteredClaims.length} of {claims.length} saved claims
            </p>
          )}
        </div>

        {/* Footer note */}
        <div className="mt-5 flex flex-col gap-2 text-xs leading-5 text-gray-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            Your saved claims are retrieved from your MTrack AI MongoDB
            database.
          </p>
          <Link
            to="/history"
            className="font-semibold text-[#008F65] hover:underline"
          >
            View all claim history →
          </Link>
        </div>
      </div>
    </div>
  )
}

function SummaryCard({ label, value, valueColor = 'text-[#172B24]' }) {
  return (
    <div className="rounded-2xl border border-[#E1E9E3] bg-white p-4 shadow-sm sm:p-5">
      <p className="text-xs font-medium text-gray-500 sm:text-sm">{label}</p>
      <p className={`mt-2 text-2xl font-bold ${valueColor}`}>{value}</p>
    </div>
  )
}

export default SavedClaims
