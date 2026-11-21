
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { getAuthHeaders } from '../utils/auth'
import useDocumentTitle from '../utils/useDocumentTitle'
import MTrackLogo from '../components/MTrackLogo'
import BackButton from '../components/BackButton'
import { RefreshCwIcon } from '../components/Icons'

const API_URL =
    import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'

// These are directory entries, not live financial data.
const companies = [
    {
        symbol: 'RELIANCE',
        name: 'Reliance Industries Limited',
        sector: 'Oil, Retail & Telecommunications',
        exchange: 'NSE: RELIANCE',
        description:
            'A diversified Indian company with business interests across energy, retail, digital services and other sectors.',
    },
    {
        symbol: 'TCS',
        name: 'Tata Consultancy Services Limited',
        sector: 'Information Technology',
        exchange: 'NSE: TCS',
        description:
            'An IT services and consulting company providing technology, business and digital transformation services.',
    },
    {
        symbol: 'INFY',
        name: 'Infosys Limited',
        sector: 'Information Technology',
        exchange: 'NSE: INFY',
        description:
            'An Indian multinational technology company offering consulting, IT and digital services.',
    },
]

const statusStyle = {
    Verified: 'bg-[#E7F5EC] text-[#16804D]',
    Unverified: 'bg-[#FFF4DF] text-[#A66A12]',
    Contradicted: 'bg-[#FCECEC] text-[#C34B4B]',
    Pending: 'bg-[#EDF1F5] text-[#526273]',
}

function formatDate(value) {
    if (!value) return 'Date unavailable'

    const date = new Date(value)

    if (Number.isNaN(date.getTime())) return 'Date unavailable'

    return date.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    })
}

function CompanyResearch() {
    useDocumentTitle('Company Research & Filings')
    const [search, setSearch] = useState('')
    const [selectedSymbol, setSelectedSymbol] = useState('RELIANCE')
    const [nseUpdates, setNseUpdates] = useState([])
    const [sebiUpdates, setSebiUpdates] = useState([])
    const [claims, setClaims] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    const filteredCompanies = useMemo(() => {
        const query = search.trim().toLowerCase()

        if (!query) return companies

        return companies.filter((company) =>
            `${company.name} ${company.symbol} ${company.sector}`
                .toLowerCase()
                .includes(query)
        )
    }, [search])

    const selectedCompany =
        companies.find((company) => company.symbol === selectedSymbol) ||
        companies[0]

    const loadResearchData = useCallback(async () => {
        setLoading(true)
        setError('')

        try {
            const [nseRes, sebiRes, claimsRes] = await Promise.allSettled([
                fetch(`${API_URL}/sources/nse`),
                fetch(`${API_URL}/sources/sebi`),
                fetch(`${API_URL}/claims`, { headers: getAuthHeaders() }),
            ])

            if (nseRes.status === 'fulfilled' && nseRes.value.ok) {
                const nseData = await nseRes.value.json()
                if (nseData.success && Array.isArray(nseData.data)) {
                    setNseUpdates(nseData.data)
                }
            }

            if (sebiRes.status === 'fulfilled' && sebiRes.value.ok) {
                const sebiData = await sebiRes.value.json()
                if (sebiData.success && Array.isArray(sebiData.data)) {
                    setSebiUpdates(sebiData.data)
                }
            }

            if (claimsRes.status === 'fulfilled' && claimsRes.value.ok) {
                const claimsData = await claimsRes.value.json()
                if (claimsData.success && Array.isArray(claimsData.data)) {
                    setClaims(claimsData.data)
                }
            }
        } catch (err) {
            setError(err.message || 'Unable to load company research data.')
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        loadResearchData()
    }, [loadResearchData])

    const matchesCompany = useCallback(
        (item) => {
            const searchableText = [
                item.title,
                item.name,
                item.company,
                item.symbol,
                item.description,
                item.contentSnippet,
                item.summary,
            ]
                .filter(Boolean)
                .join(' ')
                .toLowerCase()

            return (
                searchableText.includes(selectedCompany.symbol.toLowerCase()) ||
                searchableText.includes(selectedCompany.name.toLowerCase())
            )
        },
        [selectedCompany]
    )

    const companyNseUpdates = useMemo(
        () => nseUpdates.filter(matchesCompany),
        [nseUpdates, matchesCompany]
    )

    const companySebiUpdates = useMemo(
        () => sebiUpdates.filter(matchesCompany),
        [sebiUpdates, matchesCompany]
    )

    const companyClaims = useMemo(
        () =>
            claims.filter((claim) => {
                const text = `${claim.title || ''} ${claim.source || ''}`.toLowerCase()

                return (
                    text.includes(selectedCompany.symbol.toLowerCase()) ||
                    text.includes(selectedCompany.name.toLowerCase())
                )
            }),
        [claims, selectedCompany]
    )

    const renderUpdate = (item, index, sourceName) => {
        const title = item.title || item.name || 'Untitled announcement'
        const link = item.link || item.url || item.sourceUrl || item.guid
        const date =
            item.pubDate || item.publishedAt || item.date || item.isoDate
        const description =
            item.contentSnippet || item.description || item.summary || ''

        return (
            <article
                key={item.guid || item.sourceUrl || link || `${sourceName}-${index}`}
                className="rounded-xl border border-[#E6ECE7] bg-[#FAFCFA] p-4"
            >
                <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-md bg-[#E2F0E8] px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-[#008F65]">
                        {sourceName}
                    </span>
                    <span className="text-xs text-gray-400">
                        {formatDate(date)}
                    </span>
                </div>

                <h3 className="mt-3 text-sm font-semibold leading-6 text-[#172B24]">
                    {title}
                </h3>

                {description && (
                    <p className="mt-2 line-clamp-3 text-xs leading-6 text-gray-500">
                        {description}
                    </p>
                )}

                {link && (
                    <a
                        href={link}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-3 inline-flex text-xs font-semibold text-[#008F65] hover:underline"
                    >
                        View original source →
                    </a>
                )}
            </article>
        )
    }

    return (
        <div className="min-h-screen bg-[#F4F7F5] text-[#172B24]">
            <header className="sticky top-0 z-20 border-b border-[#E1E9E3] bg-white/95 backdrop-blur-md">
                <div className="mx-auto flex h-[72px] max-w-[1440px] items-center justify-between px-4 sm:px-7 lg:px-10">
                    <Link to="/" className="cursor-pointer">
                        <MTrackLogo size="md" />
                    </Link>

                    <BackButton label="Back to Dashboard" fallbackUrl="/dashboard" />
                </div>
            </header>

            <main className="mx-auto max-w-[1440px] px-4 py-7 sm:px-7 sm:py-9 lg:px-10">
                <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                    <div>
                        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.15em] text-[#00A878]">
                            Research workspace
                        </p>
                        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                            Company Research
                        </h1>
                        <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
                            Explore company-related announcements and examine
                            financial claims using available evidence.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={loadResearchData}
                        disabled={loading}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-[#00A878] px-4 py-2.5 text-xs sm:text-sm font-semibold text-white transition hover:bg-[#008F65] disabled:opacity-50 cursor-pointer shadow-xs active:scale-[0.99]"
                    >
                        <RefreshCwIcon className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                        <span>{loading ? 'Refreshing...' : 'Refresh Research'}</span>
                    </button>
                </div>

                <section className="mb-7 rounded-2xl border border-[#E1E9E3] bg-white p-5 sm:p-6">
                    <label
                        htmlFor="company-search"
                        className="mb-2 block text-sm font-semibold"
                    >
                        Find a company
                    </label>

                    <input
                        id="company-search"
                        type="search"
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder="Search by company name, symbol, or sector..."
                        className="w-full rounded-xl border border-[#DCE6DF] bg-[#FAFCFA] px-4 py-3 text-sm outline-none transition placeholder:text-gray-400 focus:border-[#00A878] focus:bg-white"
                    />

                    <div className="mt-4 flex flex-wrap gap-2">
                        {filteredCompanies.map((company) => (
                            <button
                                key={company.symbol}
                                type="button"
                                onClick={() => setSelectedSymbol(company.symbol)}
                                className={`rounded-lg border px-3.5 py-2 text-xs font-semibold transition ${
                                    selectedSymbol === company.symbol
                                        ? 'border-[#00A878] bg-[#E2F0E8] text-[#008F65]'
                                        : 'border-[#E1E9E3] bg-white text-gray-500 hover:bg-[#F4F7F5]'
                                }`}
                            >
                                {company.symbol}
                            </button>
                        ))}

                        {filteredCompanies.length === 0 && (
                            <p className="py-2 text-xs text-gray-500">
                                No company in the current directory matches
                                your search.
                            </p>
                        )}
                    </div>

                    <p className="mt-3 text-[11px] text-gray-400">
                        Current directory: Reliance, TCS and Infosys. More
                        companies can be added later.
                    </p>
                </section>

                <section className="mb-7 rounded-2xl border border-[#DCE6DF] bg-white p-5 sm:p-7">
                    <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
                        <div className="flex items-start gap-4">
                            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#E2F0E8] text-lg font-bold text-[#008F65]">
                                {selectedCompany.symbol.slice(0, 2)}
                            </div>

                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wider text-[#00A878]">
                                    {selectedCompany.exchange}
                                </p>
                                <h2 className="mt-1 text-xl font-bold sm:text-2xl">
                                    {selectedCompany.name}
                                </h2>
                                <p className="mt-1 text-sm text-gray-500">
                                    {selectedCompany.sector}
                                </p>
                            </div>
                        </div>

                        <Link
                            to="/verify"
                            className="inline-flex shrink-0 items-center justify-center rounded-xl bg-[#00A878] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#008F65]"
                        >
                            Verify a claim →
                        </Link>
                    </div>

                    <div className="mt-6 border-t border-[#EDF1EE] pt-5">
                        <h3 className="text-sm font-bold">Company overview</h3>
                        <p className="mt-2 max-w-4xl text-sm leading-7 text-gray-500">
                            {selectedCompany.description}
                        </p>
                    </div>
                </section>

                <section className="mb-7">
                    <div className="mb-4">
                        <h2 className="text-lg font-bold">
                            Financial snapshot
                        </h2>
                        <p className="mt-1 text-xs text-gray-500">
                            Live financial figures are not connected yet.
                            We will not display invented market values.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
                        {[
                            'Market Capitalisation',
                            'Annual Revenue',
                            'Net Profit',
                            'Outstanding Debt',
                        ].map((label) => (
                            <div
                                key={label}
                                className="rounded-2xl border border-[#E1E9E3] bg-white p-5"
                            >
                                <p className="text-xs leading-5 text-gray-500">
                                    {label}
                                </p>
                                <p className="mt-3 text-lg font-bold">
                                    Not available
                                </p>
                                <p className="mt-2 text-[10px] text-gray-400">
                                    Verified data source required
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                {error && (
                    <div className="mb-7 rounded-xl border border-red-200 bg-red-50 p-4">
                        <p className="text-sm font-semibold text-red-700">
                            Research data could not be loaded
                        </p>
                        <p className="mt-1 text-xs text-red-600">{error}</p>
                        <button
                            onClick={loadResearchData}
                            className="mt-3 text-xs font-bold text-red-700 underline"
                        >
                            Try again
                        </button>
                    </div>
                )}

                <section className="mb-7 grid gap-6 lg:grid-cols-2">
                    <div className="overflow-hidden rounded-2xl border border-[#E1E9E3] bg-white">
                        <div className="border-b border-[#EDF1EE] p-5 sm:p-6">
                            <div className="flex items-center justify-between gap-3">
                                <h2 className="text-lg font-bold">
                                    NSE announcements
                                </h2>
                                <span className="rounded-lg bg-[#E2F0E8] px-2.5 py-1 text-[10px] font-bold text-[#008F65]">
                                    NSE
                                </span>
                            </div>
                            <p className="mt-1 text-xs text-gray-500">
                                Exchange announcements matching this company.
                            </p>
                        </div>

                        <div className="space-y-3 p-4 sm:p-5">
                            {loading ? (
                                <p className="py-6 text-center text-sm text-gray-400">
                                    Loading NSE announcements...
                                </p>
                            ) : companyNseUpdates.length > 0 ? (
                                companyNseUpdates.map((item, index) =>
                                    renderUpdate(item, index, 'NSE')
                                )
                            ) : (
                                <p className="py-8 text-center text-sm text-gray-400">
                                    No matching NSE announcements were found
                                    in the retrieved feed.
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="overflow-hidden rounded-2xl border border-[#E1E9E3] bg-white">
                        <div className="border-b border-[#EDF1EE] p-5 sm:p-6">
                            <div className="flex items-center justify-between gap-3">
                                <h2 className="text-lg font-bold">
                                    SEBI updates
                                </h2>
                                <span className="rounded-lg bg-[#E2F0E8] px-2.5 py-1 text-[10px] font-bold text-[#008F65]">
                                    SEBI
                                </span>
                            </div>
                            <p className="mt-1 text-xs text-gray-500">
                                Regulatory updates matching this company.
                            </p>
                        </div>

                        <div className="space-y-3 p-4 sm:p-5">
                            {loading ? (
                                <p className="py-6 text-center text-sm text-gray-400">
                                    Loading SEBI updates...
                                </p>
                            ) : companySebiUpdates.length > 0 ? (
                                companySebiUpdates.map((item, index) =>
                                    renderUpdate(item, index, 'SEBI')
                                )
                            ) : (
                                <p className="py-8 text-center text-sm text-gray-400">
                                    No matching SEBI updates were found
                                    in the retrieved feed.
                                </p>
                            )}
                        </div>
                    </div>
                </section>

                <section className="mb-7 overflow-hidden rounded-2xl border border-[#E1E9E3] bg-white">
                    <div className="border-b border-[#EDF1EE] p-5 sm:p-6">
                        <h2 className="text-lg font-bold">
                            Related financial claims
                        </h2>
                        <p className="mt-1 text-xs text-gray-500">
                            Claims retrieved from your MTrack AI database.
                        </p>
                    </div>

                    <div className="divide-y divide-[#EDF1EE]">
                        {loading ? (
                            <p className="p-6 text-center text-sm text-gray-400">
                                Loading claims...
                            </p>
                        ) : companyClaims.length > 0 ? (
                            companyClaims.map((claim) => (
                                <div
                                    key={claim._id}
                                    className="flex flex-col justify-between gap-4 p-5 sm:flex-row sm:items-center sm:px-6"
                                >
                                    <div className="max-w-3xl">
                                        <Link
                                            to={`/claim/${claim._id}`}
                                            className="text-sm font-semibold leading-6 hover:text-[#008F65]"
                                        >
                                            {claim.title}
                                        </Link>
                                        <p className="mt-2 text-xs text-gray-400">
                                            {claim.category || 'Uncategorized'}
                                            {' · '}
                                            {formatDate(claim.createdAt)}
                                        </p>
                                    </div>

                                    <span
                                        className={`w-fit shrink-0 rounded-lg px-3 py-1.5 text-xs font-bold ${
                                            statusStyle[claim.status] ||
                                            statusStyle.Pending
                                        }`}
                                    >
                                        {claim.status || 'Pending'}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <div className="p-7 text-center">
                                <p className="text-sm font-semibold">
                                    No related claims found
                                </p>
                                <p className="mt-2 text-xs text-gray-500">
                                    Claims mentioning this company will appear
                                    here when saved in MTrack AI.
                                </p>
                                <Link
                                    to="/verify"
                                    className="mt-4 inline-flex rounded-xl bg-[#00A878] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#008F65]"
                                >
                                    Submit a claim
                                </Link>
                            </div>
                        )}
                    </div>
                </section>

                <section className="rounded-2xl border border-[#DCE6DF] bg-[#E2F0E8] p-5 sm:p-6">
                    <h2 className="text-base font-bold">
                        Research with reliable evidence
                    </h2>
                    <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-600">
                        Compare company-related statements with official
                        exchange filings, company reports, regulatory notices
                        and credible financial reporting. A missing feed match
                        does not mean a claim is false.
                    </p>

                    <div className="mt-4 flex flex-wrap gap-3">
                        <Link
                            to="/verify"
                            className="rounded-xl bg-[#00A878] px-4 py-3 text-xs font-semibold text-white transition hover:bg-[#008F65]"
                        >
                            Start claim verification
                        </Link>
                        <Link
                            to="/market-insights"
                            className="rounded-xl border border-[#C8DCCF] bg-white px-4 py-3 text-xs font-semibold text-[#40534A] transition hover:bg-[#F4F7F5]"
                        >
                            Explore market insights
                        </Link>
                    </div>
                </section>

                <p className="mt-8 text-center text-xs leading-5 text-gray-400">
                    Company descriptions are informational. Announcements
                    come from retrieved feeds; financial figures are not yet
                    connected. This page is not investment advice.
                </p>
            </main>
        </div>
    )
}

export default CompanyResearch
