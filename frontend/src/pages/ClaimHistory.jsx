
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { getAuthHeaders } from '../utils/auth'
import useDocumentTitle from '../utils/useDocumentTitle'
import BackButton from '../components/BackButton'
import EmptyStateVisual from '../components/EmptyStateVisual'
import { RefreshCwIcon, PlusIcon, BookmarkIcon } from '../components/Icons'

const API_URL =
    import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'

const filters = [
    'All Claims',
    'Verified',
    'Unverified',
    'Contradicted',
    'Pending',
]

const statusStyles = {
    Verified: 'bg-[#E7F5EC] text-[#008F65] border-[#BBD9C7]',
    Unverified: 'bg-[#FFF3DF] text-[#A66A00] border-[#F0D5A8]',
    Contradicted: 'bg-[#FCE9E8] text-[#C43D36] border-[#F7C6C4]',
    Pending: 'bg-[#FFF3DF] text-[#A66A00] border-[#F0D5A8]',
}

function StatusBadge({ status }) {
    const currentStatus = status || 'Pending'

    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-bold ${
                statusStyles[currentStatus] || statusStyles.Pending
            }`}
        >
            <span
                className={`h-1.5 w-1.5 rounded-full ${
                    currentStatus === 'Verified'
                        ? 'bg-[#00A878]'
                        : currentStatus === 'Contradicted'
                        ? 'bg-[#C43D36]'
                        : 'bg-[#A66A00]'
                }`}
            />
            {currentStatus}
        </span>
    )
}

function formatDate(dateValue) {
    if (!dateValue) return 'Recently submitted'

    const date = new Date(dateValue)

    if (Number.isNaN(date.getTime())) {
        return 'Recently submitted'
    }

    return date.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    })
}

function ClaimHistory() {
    useDocumentTitle('Claim History')
    const [claims, setClaims] = useState([])
    const [searchTerm, setSearchTerm] = useState('')
    const [activeFilter, setActiveFilter] = useState('All Claims')

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [message, setMessage] = useState('')
    const [savingId, setSavingId] = useState(null)

    // Fetch real claims from MongoDB
    const fetchClaims = useCallback(async () => {
        setLoading(true)
        setError('')

        try {
            const response = await fetch(`${API_URL}/claims`, {
                headers: getAuthHeaders(),
            })
            const result = await response.json()

            if (!response.ok || !result.success) {
                throw new Error(
                    result.message || 'Unable to retrieve claims.'
                )
            }

            setClaims(Array.isArray(result.data) ? result.data : [])
        } catch (err) {
            console.error('Claim history error:', err)
            setError(
                err.message ||
                'Unable to connect to the MTrack AI backend.'
            )
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchClaims()
    }, [fetchClaims])

    // Update saved status in MongoDB
    const toggleSaved = async (claim) => {
        if (savingId) return

        const newSavedStatus = !claim.isSaved

        setSavingId(claim._id)
        setMessage('')
        setError('')

        try {
            const response = await fetch(
                `${API_URL}/claims/${claim._id}`,
                {
                    method: 'PATCH',
                    headers: getAuthHeaders(),
                    body: JSON.stringify({
                        isSaved: newSavedStatus,
                    }),
                }
            )

            const result = await response.json()

            if (!response.ok || !result.success) {
                throw new Error(
                    result.message || 'Unable to update saved claim.'
                )
            }

            setClaims((previousClaims) =>
                previousClaims.map((item) =>
                    item._id === claim._id
                        ? result.data
                        : item
                )
            )

            setMessage(
                newSavedStatus
                    ? 'Claim added to Saved Claims.'
                    : 'Claim removed from Saved Claims.'
            )
        } catch (err) {
            console.error('Save claim error:', err)
            setMessage(
                err.message || 'Unable to update this claim.'
            )
        } finally {
            setSavingId(null)
        }
    }

    // Calculate statistics from actual MongoDB records
    const summaryCards = [
        {
            label: 'Total Claims',
            value: claims.length,
            color: 'text-[#172B24]',
        },
        {
            label: 'Verified',
            value: claims.filter(
                (claim) => claim.status === 'Verified'
            ).length,
            color: 'text-[#008F65]',
        },
        {
            label: 'Unverified',
            value: claims.filter(
                (claim) => claim.status === 'Unverified'
            ).length,
            color: 'text-[#A66A00]',
        },
        {
            label: 'Contradicted',
            value: claims.filter(
                (claim) => claim.status === 'Contradicted'
            ).length,
            color: 'text-[#C43D36]',
        },
        {
            label: 'Pending',
            value: claims.filter(
                (claim) => !claim.status || claim.status === 'Pending'
            ).length,
            color: 'text-[#A66A00]',
        },
    ]

    // Search and filter
    const filteredClaims = useMemo(() => {
        return claims.filter((claim) => {
            const search = searchTerm.toLowerCase()

            const matchesSearch =
                claim.title?.toLowerCase().includes(search) ||
                claim.category?.toLowerCase().includes(search) ||
                claim.source?.toLowerCase().includes(search)

            const matchesFilter =
                activeFilter === 'All Claims' ||
                (activeFilter === 'Pending'
                    ? !claim.status || claim.status === 'Pending'
                    : claim.status === activeFilter)

            return matchesSearch && matchesFilter
        })
    }, [claims, searchTerm, activeFilter])

    return (
        <div className="min-h-screen bg-[#F4F7F5] px-4 py-6 sm:px-6 lg:px-10 lg:py-9">
            <div className="mx-auto max-w-7xl">

                {/* Page Header */}
                <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <BackButton label="Back to Dashboard" fallbackUrl="/dashboard" className="mb-3" />

                        <h1 className="text-2xl font-bold tracking-tight text-[#172B24] sm:text-3xl">
                            Claim History
                        </h1>

                        <p className="mt-1 text-xs sm:text-sm text-gray-500">
                            Audit trail of submitted corporate claims and their verification outcomes.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5">
                        <button
                            type="button"
                            onClick={fetchClaims}
                            disabled={loading}
                            className="inline-flex items-center gap-1.5 rounded-xl border border-[#DCE6DF] bg-white px-4 py-2.5 text-xs sm:text-sm font-semibold text-gray-600 transition hover:border-[#00A878] hover:text-[#008F65] hover:bg-[#F4F7F5] disabled:opacity-50 cursor-pointer shadow-xs"
                        >
                            <RefreshCwIcon className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-[#00A878]' : ''}`} />
                            <span>Refresh</span>
                        </button>

                        <Link
                            to="/verify"
                            className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#00A878] px-4 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-xs transition hover:bg-[#008F65] cursor-pointer active:scale-[0.99]"
                        >
                            <PlusIcon className="w-3.5 h-3.5" />
                            <span>Verify New Claim</span>
                        </Link>
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5 lg:gap-4">
                    {summaryCards.map((card) => (
                        <div
                            key={card.label}
                            className="rounded-2xl border border-[#E1E9E3] bg-white p-4 shadow-sm sm:p-5"
                        >
                            <p className="text-xs font-medium text-gray-500 sm:text-sm">
                                {card.label}
                            </p>

                            <p className={`mt-3 text-2xl font-bold sm:text-3xl ${card.color}`}>
                                {loading ? '—' : card.value}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Main Content */}
                <div className="overflow-hidden rounded-2xl border border-[#E1E9E3] bg-white shadow-sm">

                    {/* Search and Filters */}
                    <div className="border-b border-[#E1E9E3] p-4 sm:p-6">
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                            <div>
                                <h2 className="text-lg font-bold text-[#172B24]">
                                    All Submissions
                                </h2>

                                <p className="mt-1 text-sm text-gray-500">
                                    Your claims retrieved from MongoDB.
                                </p>
                            </div>

                            <div className="relative w-full lg:max-w-sm">
                                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                    ⌕
                                </span>

                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(event) =>
                                        setSearchTerm(event.target.value)
                                    }
                                    placeholder="Search claims, categories..."
                                    className="w-full rounded-xl border border-[#DCE6DF] bg-[#F8FAF8] py-3 pl-11 pr-4 text-sm text-[#172B24] outline-none transition placeholder:text-gray-400 focus:border-[#00A878] focus:ring-2 focus:ring-[#00A878]/10"
                                />
                            </div>
                        </div>

                        <div className="mt-5 flex gap-2 overflow-x-auto pb-1">
                            {filters.map((filter) => (
                                <button
                                    key={filter}
                                    type="button"
                                    onClick={() => setActiveFilter(filter)}
                                    className={`shrink-0 rounded-full px-4 py-2 text-xs font-semibold transition sm:text-sm ${
                                        activeFilter === filter
                                            ? 'bg-[#172B24] text-white'
                                            : 'border border-[#E1E9E3] bg-white text-gray-600 hover:bg-[#F4F7F5]'
                                    }`}
                                >
                                    {filter}
                                </button>
                            ))}
                        </div>

                        {message && (
                            <p
                                aria-live="polite"
                                className="mt-4 text-sm font-medium text-[#008F65]"
                            >
                                {message}
                            </p>
                        )}
                    </div>

                    {/* Loading */}
                    {loading && (
                        <div className="px-5 py-16 text-center">
                            <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-[#DCE6DF] border-t-[#00A878]" />

                            <p className="mt-4 text-sm text-gray-500">
                                Loading your claims from MongoDB...
                            </p>
                        </div>
                    )}

                    {/* Error */}
                    {!loading && error && (
                        <div className="px-5 py-16 text-center">
                            <p className="font-semibold text-red-600">
                                Unable to load claims
                            </p>

                            <p className="mt-2 text-sm text-gray-500">
                                {error}
                            </p>

                            <button
                                type="button"
                                onClick={fetchClaims}
                                className="mt-5 rounded-xl bg-[#00A878] px-5 py-3 text-sm font-semibold text-white hover:bg-[#008F65]"
                            >
                                Try Again
                            </button>
                        </div>
                    )}

                    {/* Claims Table */}
                    {!loading && !error && (
                        <>
                            <div className="hidden overflow-x-auto md:block">
                                <table className="w-full min-w-[900px] text-left">
                                    <thead className="bg-[#F8FAF8]">
                                        <tr className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                                            <th className="px-6 py-4">Claim</th>
                                            <th className="px-6 py-4">Category</th>
                                            <th className="px-6 py-4">Date</th>
                                            <th className="px-6 py-4">Status</th>
                                            <th className="px-6 py-4">Saved</th>
                                            <th className="px-6 py-4 text-right">Action</th>
                                        </tr>
                                    </thead>

                                    <tbody className="divide-y divide-[#E1E9E3]">
                                        {filteredClaims.map((claim) => (
                                            <tr
                                                key={claim._id}
                                                className="transition hover:bg-[#FAFCFA]"
                                            >
                                                <td className="max-w-md px-6 py-5">
                                                    <p className="font-semibold text-[#172B24]">
                                                        {claim.title}
                                                    </p>

                                                    {claim.source && (
                                                        <p className="mt-1 text-xs text-gray-400">
                                                            Source: {claim.source}
                                                        </p>
                                                    )}
                                                </td>

                                                <td className="px-6 py-5 text-sm text-gray-600">
                                                    {claim.category || 'General'}
                                                </td>

                                                <td className="whitespace-nowrap px-6 py-5 text-sm text-gray-500">
                                                    {formatDate(claim.createdAt)}
                                                </td>

                                                <td className="px-6 py-5">
                                                    <StatusBadge status={claim.status} />
                                                </td>

                                                <td className="px-6 py-5">
                                                    <button
                                                        type="button"
                                                        disabled={savingId === claim._id}
                                                        onClick={() => toggleSaved(claim)}
                                                        aria-label={
                                                            claim.isSaved
                                                                ? 'Remove saved claim'
                                                                : 'Save claim'
                                                        }
                                                        className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition disabled:opacity-50 cursor-pointer ${
                                                            claim.isSaved
                                                                ? 'bg-[#E2F0E8] text-[#008F65] hover:bg-[#FCE9E8] hover:text-[#C43D36]'
                                                                : 'border border-[#DCE6DF] bg-white text-gray-600 hover:border-[#00A878] hover:text-[#008F65]'
                                                        }`}
                                                    >
                                                        <BookmarkIcon filled={claim.isSaved} className="w-3.5 h-3.5" />
                                                        <span>
                                                            {savingId === claim._id
                                                                ? 'Saving...'
                                                                : claim.isSaved
                                                                ? 'Saved'
                                                                : 'Save'}
                                                        </span>
                                                    </button>
                                                </td>

                                                <td className="px-6 py-5 text-right">
                                                    <Link
                                                        to={`/claim/${claim._id}`}
                                                        className="text-sm font-semibold text-[#008F65] transition hover:text-[#006F4F]"
                                                    >
                                                        View Details →
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Mobile Cards */}
                            <div className="divide-y divide-[#E1E9E3] md:hidden">
                                {filteredClaims.map((claim) => (
                                    <div
                                        key={claim._id}
                                        className="p-4 sm:p-5"
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="min-w-0">
                                                <p className="text-sm font-semibold leading-6 text-[#172B24]">
                                                    {claim.title}
                                                </p>

                                                <p className="mt-2 text-xs text-gray-500">
                                                    {claim.category || 'General'} · {formatDate(claim.createdAt)}
                                                </p>
                                            </div>

                                            <StatusBadge status={claim.status} />
                                        </div>

                                        {claim.source && (
                                            <p className="mt-3 text-xs text-gray-400">
                                                Source: {claim.source}
                                            </p>
                                        )}

                                        <div className="mt-4 flex items-center justify-between gap-3">
                                            <button
                                                type="button"
                                                disabled={savingId === claim._id}
                                                onClick={() => toggleSaved(claim)}
                                                className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition disabled:opacity-50 cursor-pointer ${
                                                    claim.isSaved
                                                        ? 'bg-[#E2F0E8] text-[#008F65]'
                                                        : 'border border-[#DCE6DF] text-gray-600'
                                                }`}
                                            >
                                                <BookmarkIcon filled={claim.isSaved} className="w-3.5 h-3.5" />
                                                <span>
                                                    {savingId === claim._id
                                                        ? 'Saving...'
                                                        : claim.isSaved
                                                        ? 'Saved'
                                                        : 'Save'}
                                                </span>
                                            </button>

                                            <Link
                                                to={`/claim/${claim._id}`}
                                                className="text-xs font-bold text-[#008F65] hover:text-[#006F4F] cursor-pointer"
                                            >
                                                Details →
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Empty State */}
                            {filteredClaims.length === 0 && (
                                <div className="px-5 py-16 text-center">
                                    <EmptyStateVisual type="search" size={80} />

                                    <h3 className="mt-4 font-bold text-[#172B24] text-base">
                                        {claims.length === 0
                                            ? 'No claims submitted yet'
                                            : 'No matching claims found'}
                                    </h3>

                                    <p className="mt-1 text-xs text-gray-500 max-w-sm mx-auto leading-relaxed">
                                        {claims.length === 0
                                            ? 'Your submitted financial claims and their verification assessments will appear here.'
                                            : 'Try adjusting your search keywords or switching status filters.'}
                                    </p>

                                    {claims.length === 0 ? (
                                        <Link
                                            to="/verify"
                                            className="mt-5 inline-flex items-center gap-1.5 rounded-xl bg-[#00A878] px-5 py-2.5 text-xs font-semibold text-white hover:bg-[#008F65] transition cursor-pointer"
                                        >
                                            <PlusIcon className="w-3.5 h-3.5" />
                                            <span>Verify Your First Claim</span>
                                        </Link>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setSearchTerm('')
                                                setActiveFilter('All Claims')
                                            }}
                                            className="mt-4 text-xs font-bold text-[#008F65] hover:underline cursor-pointer"
                                        >
                                            Clear all filters
                                        </button>
                                    )}
                                </div>
                            )}
                        </>
                    )}
                </div>

                <div className="mt-6 rounded-xl border border-[#E1E9E3] bg-white/70 p-4">
                    <p className="text-xs leading-6 text-gray-500">
                        <strong className="text-gray-600">Note:</strong>{' '}
                        Claims are retrieved from MongoDB. Saving a claim
                        adds it to your Saved Claims list; it does not
                        independently verify the claim.
                    </p>
                </div>
            </div>
        </div>
    )
}

export default ClaimHistory
