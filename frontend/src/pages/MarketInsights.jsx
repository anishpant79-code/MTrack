
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import useDocumentTitle from '../utils/useDocumentTitle'
import MTrackLogo from '../components/MTrackLogo'
import BackButton from '../components/BackButton'
import { RefreshCwIcon, ArrowUpRightIcon } from '../components/Icons'

const API_URL =
    import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'

function formatDate(date) {
    if (!date) return 'Date unavailable'

    const parsedDate = new Date(date)

    if (Number.isNaN(parsedDate.getTime())) return 'Date unavailable'

    return parsedDate.toLocaleString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    })
}

function getItemTitle(item) {
    return item.title || item.name || 'Untitled announcement'
}

function getItemLink(item) {
    return item.link || item.url || item.sourceUrl || item.guid || ''
}

function getItemDate(item) {
    return item.pubDate || item.publishedAt || item.date || item.isoDate
}

function getItemDescription(item) {
    return (
        item.contentSnippet ||
        item.description ||
        item.summary ||
        item.content ||
        ''
    )
}

function AnnouncementCard({ item, source }) {
    const link = getItemLink(item)

    return (
        <article className="rounded-2xl border border-[#E1E9E3] bg-white p-5 transition hover:border-[#BBD9C7] hover:shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="rounded-md bg-[#E2F0E8] px-2.5 py-1 text-[10px] font-bold tracking-wide text-[#008F65]">
                    {source}
                </span>

                <span className="text-xs text-gray-400">
                    {formatDate(getItemDate(item))}
                </span>
            </div>

            <h3 className="mt-4 text-sm font-bold leading-6 text-[#172B24] sm:text-base">
                {getItemTitle(item)}
            </h3>

            {getItemDescription(item) && (
                <p className="mt-3 line-clamp-4 text-sm leading-6 text-gray-500">
                    {getItemDescription(item)}
                </p>
            )}

            {link ? (
                <a
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-[#008F65] transition hover:text-[#006F4F] cursor-pointer"
                >
                    <span>Read original filing</span>
                    <ArrowUpRightIcon className="w-3.5 h-3.5" />
                </a>
            ) : (
                <p className="mt-5 text-xs text-gray-400">
                    Original source link unavailable.
                </p>
            )}
        </article>
    )
}

function MarketInsights() {
    useDocumentTitle('Market Insights & Disclosures')
    const [activeTab, setActiveTab] = useState('Overview')
    const [nseUpdates, setNseUpdates] = useState([])
    const [sebiUpdates, setSebiUpdates] = useState([])
    const [search, setSearch] = useState('')
    const [searchInput, setSearchInput] = useState('')
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [lastUpdated, setLastUpdated] = useState(null)

    const fetchUpdates = useCallback(async (query = '') => {
        try {
            setLoading(true)
            setError('')

            const searchParam = query
                ? `?q=${encodeURIComponent(query)}`
                : ''

            let nseData = []
            let sebiData = []
            const errors = []

            try {
                const nseResponse = await fetch(`${API_URL}/sources/nse${searchParam}`)
                const nseResult = await nseResponse.json()
                if (nseResponse.ok && nseResult.success && Array.isArray(nseResult.data)) {
                    nseData = nseResult.data
                }
            } catch (nseErr) {
                console.warn('NSE retrieval notice:', nseErr.message)
                errors.push('NSE announcements')
            }

            try {
                const sebiResponse = await fetch(`${API_URL}/sources/sebi${searchParam}`)
                const sebiResult = await sebiResponse.json()
                if (sebiResponse.ok && sebiResult.success && Array.isArray(sebiResult.data)) {
                    sebiData = sebiResult.data
                }
            } catch (sebiErr) {
                console.warn('SEBI retrieval notice:', sebiErr.message)
                errors.push('SEBI updates')
            }

            if (nseData.length === 0 && sebiData.length === 0 && errors.length === 2) {
                throw new Error('Unable to retrieve financial disclosures at this moment.')
            }

            setNseUpdates(nseData)
            setSebiUpdates(sebiData)
            setLastUpdated(new Date())
        } catch (err) {
            setError(err.message || 'Unable to retrieve financial updates.')
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchUpdates()
    }, [fetchUpdates])

    const handleSearch = (event) => {
        event.preventDefault()
        setSearch(searchInput.trim())
        fetchUpdates(searchInput.trim())
    }

    const clearSearch = () => {
        setSearch('')
        setSearchInput('')
        fetchUpdates()
    }

    const allUpdates = useMemo(() => {
        return [
            ...nseUpdates.map((item) => ({
                ...item,
                feedSource: 'NSE',
            })),
            ...sebiUpdates.map((item) => ({
                ...item,
                feedSource: 'SEBI',
            })),
        ].sort((a, b) => {
            const dateA = new Date(getItemDate(a)).getTime() || 0
            const dateB = new Date(getItemDate(b)).getTime() || 0
            return dateB - dateA
        })
    }, [nseUpdates, sebiUpdates])

    const visibleUpdates =
        activeTab === 'NSE'
            ? nseUpdates
            : activeTab === 'SEBI'
                ? sebiUpdates
                : allUpdates

    const tabs = ['Overview', 'NSE', 'SEBI']

    return (
        <div className="min-h-screen bg-[#F4F7F5] text-[#172B24]">

            {/* Header */}
            <header className="sticky top-0 z-20 border-b border-[#E1E9E3] bg-white/95 backdrop-blur-md">
                <div className="mx-auto flex h-[72px] max-w-[1440px] items-center justify-between px-4 sm:px-7 lg:px-10">
                    <Link to="/" className="cursor-pointer">
                        <MTrackLogo size="md" />
                    </Link>

                    <BackButton label="Back to Dashboard" fallbackUrl="/dashboard" />
                </div>
            </header>

            <main className="mx-auto max-w-[1440px] px-4 py-7 sm:px-7 sm:py-9 lg:px-10">

                {/* Page heading */}
                <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
                    <div>
                        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.15em] text-[#00A878]">
                            Financial intelligence
                        </p>

                        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                            Market Insights
                        </h1>

                        <p className="mt-2 max-w-2xl text-xs sm:text-sm leading-relaxed text-gray-500">
                            Explore official company announcements and regulatory filings from India&apos;s capital markets.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => fetchUpdates(search)}
                        disabled={loading}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-[#00A878] px-4 py-2.5 text-xs sm:text-sm font-semibold text-white transition hover:bg-[#008F65] disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer shadow-xs active:scale-[0.99]"
                    >
                        <RefreshCwIcon className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                        <span>{loading ? 'Refreshing...' : 'Refresh updates'}</span>
                    </button>
                </div>

                {/* Feed status */}
                <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#DCE6DF] bg-white px-4 py-3">
                    <div className="flex items-center gap-2">
                        <span className={`h-2.5 w-2.5 rounded-full ${loading ? 'bg-amber-400' : error ? 'bg-red-400' : 'bg-[#00A878]'}`} />

                        <p className="text-xs font-medium text-gray-600">
                            {loading
                                ? 'Retrieving official feeds...'
                                : error
                                    ? 'Feed retrieval needs attention'
                                    : 'Official feeds retrieved successfully'}
                        </p>
                    </div>

                    <p className="text-xs text-gray-400">
                        {lastUpdated
                            ? `Last updated: ${formatDate(lastUpdated)}`
                            : 'Waiting for first update'}
                    </p>
                </div>

                {/* Search */}
                <form
                    onSubmit={handleSearch}
                    className="mb-6 flex flex-col gap-3 sm:flex-row"
                >
                    <div className="relative flex-1">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                            <svg
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                aria-hidden="true"
                            >
                                <circle cx="11" cy="11" r="7" />
                                <path d="m16 16 4 4" />
                            </svg>
                        </span>

                        <input
                            type="search"
                            value={searchInput}
                            onChange={(event) => setSearchInput(event.target.value)}
                            placeholder="Search companies, announcements or regulations..."
                            className="w-full rounded-xl border border-[#DCE6DF] bg-white py-3.5 pl-11 pr-4 text-sm text-[#172B24] outline-none transition placeholder:text-gray-400 focus:border-[#00A878] focus:ring-2 focus:ring-[#00A878]/10"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="rounded-xl bg-[#172B24] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#294438] disabled:opacity-60"
                    >
                        Search feeds
                    </button>

                    {search && (
                        <button
                            type="button"
                            onClick={clearSearch}
                            className="rounded-xl border border-[#DCE6DF] bg-white px-4 py-3.5 text-sm font-semibold text-gray-600 hover:bg-[#F8FAF8]"
                        >
                            Clear
                        </button>
                    )}
                </form>

                {/* Summary cards */}
                <section className="mb-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <div className="rounded-2xl border border-[#E1E9E3] bg-white p-5">
                        <p className="text-sm font-medium text-gray-500">
                            Total announcements
                        </p>
                        <p className="mt-3 text-3xl font-bold tracking-tight text-[#172B24]">
                            {nseUpdates.length + sebiUpdates.length}
                        </p>
                        <p className="mt-2 text-xs text-gray-400">
                            Records returned by both feeds
                        </p>
                    </div>

                    <div className="rounded-2xl border border-[#E1E9E3] bg-white p-5">
                        <p className="text-sm font-medium text-gray-500">
                            NSE announcements
                        </p>
                        <p className="mt-3 text-3xl font-bold tracking-tight text-[#008F65]">
                            {nseUpdates.length}
                        </p>
                        <p className="mt-2 text-xs text-gray-400">
                            Exchange disclosures and updates
                        </p>
                    </div>

                    <div className="rounded-2xl border border-[#E1E9E3] bg-white p-5 sm:col-span-2 lg:col-span-1">
                        <p className="text-sm font-medium text-gray-500">
                            SEBI updates
                        </p>
                        <p className="mt-3 text-3xl font-bold tracking-tight text-[#008F65]">
                            {sebiUpdates.length}
                        </p>
                        <p className="mt-2 text-xs text-gray-400">
                            Regulatory notices and publications
                        </p>
                    </div>
                </section>

                {/* Tabs */}
                <div className="mb-6 flex gap-2 overflow-x-auto border-b border-[#DCE6DF]">
                    {tabs.map((tab) => (
                        <button
                            key={tab}
                            type="button"
                            onClick={() => setActiveTab(tab)}
                            className={`shrink-0 border-b-2 px-4 py-3 text-sm font-semibold transition ${
                                activeTab === tab
                                    ? 'border-[#00A878] text-[#008F65]'
                                    : 'border-transparent text-gray-500 hover:text-[#172B24]'
                            }`}
                        >
                            {tab === 'Overview'
                                ? 'All Updates'
                                : `${tab} Updates`}
                        </button>
                    ))}
                </div>

                {/* Feed error */}
                {error && (
                    <div className="mb-6 rounded-xl border border-[#F1C9C7] bg-[#FFF5F4] p-5">
                        <h2 className="text-sm font-bold text-[#B33B35]">
                            Unable to retrieve official updates
                        </h2>
                        <p className="mt-2 text-sm leading-6 text-[#8F514D]">
                            {error}
                        </p>
                        <button
                            type="button"
                            onClick={() => fetchUpdates(search)}
                            className="mt-3 text-sm font-semibold text-[#B33B35] underline"
                        >
                            Try again
                        </button>
                    </div>
                )}

                {/* Announcements */}
                <section>
                    <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
                        <div>
                            <h2 className="text-lg font-bold">
                                {activeTab === 'Overview'
                                    ? 'Latest financial updates'
                                    : `${activeTab} announcements`}
                            </h2>
                            <p className="mt-1 text-xs text-gray-500">
                                {search
                                    ? `Results matching "${search}"`
                                    : 'Updates retrieved from the configured official RSS feeds'}
                            </p>
                        </div>

                        <span className="rounded-lg bg-[#E2F0E8] px-3 py-2 text-xs font-semibold text-[#008F65]">
                            {visibleUpdates.length} records
                        </span>
                    </div>

                    {loading ? (
                        <div className="grid gap-4 lg:grid-cols-2">
                            {[1, 2, 3, 4].map((item) => (
                                <div
                                    key={item}
                                    className="animate-pulse rounded-2xl border border-[#E1E9E3] bg-white p-5"
                                >
                                    <div className="h-4 w-24 rounded bg-[#E8EEE9]" />
                                    <div className="mt-5 h-5 w-4/5 rounded bg-[#E8EEE9]" />
                                    <div className="mt-3 h-4 w-full rounded bg-[#E8EEE9]" />
                                    <div className="mt-2 h-4 w-3/4 rounded bg-[#E8EEE9]" />
                                </div>
                            ))}
                        </div>
                    ) : visibleUpdates.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-[#DCE6DF] bg-white px-5 py-14 text-center">
                            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#E2F0E8] text-[#008F65]">
                                <svg
                                    width="22"
                                    height="22"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.8"
                                    aria-hidden="true"
                                >
                                    <circle cx="11" cy="11" r="7" />
                                    <path d="m16 16 4 4" />
                                </svg>
                            </div>

                            <h3 className="mt-4 text-base font-bold text-[#172B24]">
                                No announcements found
                            </h3>

                            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
                                {search
                                    ? 'Try another company name or search term.'
                                    : 'There are currently no records available in this feed response.'}
                            </p>

                            {search && (
                                <button
                                    type="button"
                                    onClick={clearSearch}
                                    className="mt-5 text-sm font-semibold text-[#008F65]"
                                >
                                    Clear search
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="grid gap-4 lg:grid-cols-2">
                            {visibleUpdates.map((item, index) => (
                                <AnnouncementCard
                                    key={`${activeTab}-${item.guid || getItemLink(item) || getItemTitle(item)}-${index}`}
                                    item={item}
                                    source={
                                        activeTab === 'Overview'
                                            ? item.feedSource
                                            : activeTab
                                    }
                                />
                            ))}
                        </div>
                    )}
                </section>

                {/* Verify CTA */}
                <section className="mt-8 rounded-2xl border border-[#DCE6DF] bg-[#EAF2EC] p-6 sm:p-8">
                    <div className="flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-center">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-wider text-[#008F65]">
                                Evidence-first investing
                            </p>
                            <h2 className="mt-2 text-xl font-bold text-[#172B24]">
                                Found a financial claim worth checking?
                            </h2>
                            <p className="mt-2 max-w-xl text-sm leading-6 text-gray-600">
                                Submit the claim to MTrack AI and evaluate it
                                using the evidence available to the platform.
                            </p>
                        </div>

                        <Link
                            to="/verify"
                            className="shrink-0 rounded-xl bg-[#00A878] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#008F65]"
                        >
                            Verify a claim →
                        </Link>
                    </div>
                </section>

                {/* Disclaimer */}
                <p className="mt-8 text-center text-xs leading-6 text-gray-400">
                    Announcements are retrieved from configured NSE and SEBI
                    feeds. Feed availability and publication times depend on
                    their respective sources. Displaying an announcement does
                    not mean its contents have been independently verified.
                    MTrack AI does not provide investment advice or
                    buy/sell recommendations.
                </p>
            </main>
        </div>
    )
}

export default MarketInsights
