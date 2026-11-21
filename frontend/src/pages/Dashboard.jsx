import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getCurrentUser, isAuthenticated, logout, getAuthHeaders } from '../utils/auth'
import useDocumentTitle from '../utils/useDocumentTitle'
import MTrackLogo from '../components/MTrackLogo'
import EmptyStateVisual from '../components/EmptyStateVisual'
import {
    OverviewIcon,
    PlusIcon,
    HistoryClockIcon,
    BookmarkIcon,
    TrendingUpIcon,
    BuildingIcon,
    FileTextIcon,
    CheckCircleIcon,
    AlertCircleIcon,
    HelpCircleIcon,
    RefreshCwIcon,
    LogOutIcon,
    VerifyCheckIcon,
    ArrowRightIcon,
} from '../components/Icons'

const API_URL =
    import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'

const navigationItems = [
    { label: 'Overview', path: '/dashboard', Icon: OverviewIcon },
    { label: 'Verify Claims', path: '/verify', Icon: PlusIcon },
    { label: 'Claim History', path: '/history', Icon: HistoryClockIcon },
    { label: 'Saved Claims', path: '/saved', Icon: BookmarkIcon },
    { label: 'Market Insights', path: '/market-insights', Icon: TrendingUpIcon },
    { label: 'Company Research', path: '/company-research', Icon: BuildingIcon },
]

const statusStyles = {
    Verified: 'bg-[#E7F5EC] text-[#008F65] border-[#BBD9C7]',
    Unverified: 'bg-[#FFF3DF] text-[#A66A00] border-[#F0D5A8]',
    Contradicted: 'bg-[#FCE9E8] text-[#C43D36] border-[#F7C6C4]',
    Pending: 'bg-[#FFF3DF] text-[#A66A00] border-[#F0D5A8]',
}

function StatusBadge({ status }) {
    const safeStatus = status || 'Pending'

    return (
        <span
            className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-1 text-xs font-bold ${
                statusStyles[safeStatus] || statusStyles.Pending
            }`}
        >
            <span
                className={`h-1.5 w-1.5 rounded-full ${
                    safeStatus === 'Verified'
                        ? 'bg-[#00A878]'
                        : safeStatus === 'Contradicted'
                        ? 'bg-[#C43D36]'
                        : 'bg-[#A66A00]'
                }`}
            />
            {safeStatus}
        </span>
    )
}

function formatDate(date) {
    if (!date) return 'Date unavailable'

    const parsedDate = new Date(date)
    if (Number.isNaN(parsedDate.getTime())) return 'Date unavailable'

    return parsedDate.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    })
}

function Dashboard() {
    useDocumentTitle('Dashboard')
    const navigate = useNavigate()
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [claims, setClaims] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [user, setUser] = useState(null)

    useEffect(() => {
        if (isAuthenticated()) {
            setUser(getCurrentUser())
        }
    }, [])

    const handleLogout = () => {
        logout()
        setUser(null)
        navigate('/')
    }

    const refreshClaims = useCallback(async () => {
        setLoading(true)
        setError('')

        try {
            const response = await fetch(`${API_URL}/claims`, {
                headers: getAuthHeaders(),
            })
            const result = await response.json()

            if (!response.ok || !result.success) {
                throw new Error(
                    result.message || 'Unable to load dashboard data.'
                )
            }

            setClaims(Array.isArray(result.data) ? result.data : [])
        } catch (err) {
            setError(
                err.message ||
                    'Could not connect to the backend. Please check your server.'
            )
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        refreshClaims()
    }, [refreshClaims])

    const savedClaims = useMemo(
        () => claims.filter((claim) => claim.isSaved === true),
        [claims]
    )

    const pendingCount = useMemo(
        () =>
            claims.filter(
                (claim) => !claim.status || claim.status === 'Pending'
            ).length,
        [claims]
    )

    const stats = useMemo(
        () => [
            {
                label: 'Total Claims',
                value: claims.length,
                description: 'Total submitted claims',
                Icon: FileTextIcon,
                color: 'text-[#172B24]',
                background: 'bg-[#F0F4F1]',
            },
            {
                label: 'Verified',
                value: claims.filter((claim) => claim.status === 'Verified').length,
                description: 'Marked as verified',
                Icon: CheckCircleIcon,
                color: 'text-[#008F65]',
                background: 'bg-[#E7F5EC]',
            },
            {
                label: 'Unverified',
                value: claims.filter((claim) => claim.status === 'Unverified').length,
                description: 'Insufficient evidence',
                Icon: HelpCircleIcon,
                color: 'text-[#A66A00]',
                background: 'bg-[#FFF3DF]',
            },
            {
                label: 'Contradicted',
                value: claims.filter((claim) => claim.status === 'Contradicted').length,
                description: 'Conflicting evidence',
                Icon: AlertCircleIcon,
                color: 'text-[#C43D36]',
                background: 'bg-[#FCE9E8]',
            },
        ],
        [claims]
    )

    const recentClaims = useMemo(
        () =>
            [...claims]
                .sort(
                    (a, b) =>
                        new Date(b.createdAt || 0) -
                        new Date(a.createdAt || 0)
                )
                .slice(0, 5),
        [claims]
    )

    return (
        <div className="min-h-screen bg-[#F4F7F5] text-[#172B24]">

            {/* Mobile overlay */}
            {sidebarOpen && (
                <button
                    type="button"
                    aria-label="Close navigation menu"
                    onClick={() => setSidebarOpen(false)}
                    className="fixed inset-0 z-40 bg-black/30 lg:hidden cursor-pointer"
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 flex w-[260px] flex-col border-r border-[#E1E9E3] bg-white transition-transform duration-300 lg:translate-x-0 ${
                    sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                {/* Branding */}
                <div className="flex h-[76px] items-center justify-between border-b border-[#E1E9E3] px-5">
                    <Link to="/" className="cursor-pointer">
                        <MTrackLogo size="md" />
                    </Link>

                    <button
                        type="button"
                        onClick={() => setSidebarOpen(false)}
                        aria-label="Close menu"
                        className="text-gray-400 hover:text-gray-600 lg:hidden cursor-pointer p-1"
                    >
                        &times;
                    </button>
                </div>

                {/* Navigation */}
                <div className="flex-1 overflow-y-auto px-4 py-6">
                    <p className="mb-3 px-3 text-[11px] font-bold uppercase tracking-[0.15em] text-gray-400">
                        Workspace
                    </p>

                    <nav className="space-y-1">
                        {navigationItems.map((item, index) => {
                            const ItemIcon = item.Icon
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    onClick={() => setSidebarOpen(false)}
                                    className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs sm:text-sm font-semibold transition-all duration-150 cursor-pointer ${
                                        index === 0
                                            ? 'bg-[#E2F0E8] text-[#008F65]'
                                            : 'text-gray-600 hover:bg-[#F4F7F5] hover:text-[#172B24]'
                                    }`}
                                >
                                    <ItemIcon className="w-4 h-4 shrink-0" />
                                    <span>{item.label}</span>
                                </Link>
                            )
                        })}
                    </nav>

                    <div className="mt-8 rounded-2xl border border-[#DCE6DF] bg-[#F4F8F5] p-4">
                        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#E2F0E8] text-[#008F65]">
                            <VerifyCheckIcon className="w-4 h-4" />
                        </div>

                        <h3 className="mt-3 text-xs font-bold text-[#172B24]">
                            Evidence-first research
                        </h3>

                        <p className="mt-1 text-[11px] leading-5 text-gray-500">
                            Evaluate financial claims using audited disclosures, not market rumors.
                        </p>

                        <Link
                            to="/verify"
                            className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-[#008F65] hover:text-[#006F4F] cursor-pointer group"
                        >
                            <span>Verify a claim</span>
                            <ArrowRightIcon className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                        </Link>
                    </div>
                </div>

                {/* Sidebar footer */}
                <div className="border-t border-[#E1E9E3] p-4">
                    <div className="flex items-center justify-between rounded-xl p-2 bg-[#F4F8F5]">
                        <div className="flex items-center gap-2.5 min-w-0">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#00A878] text-xs font-bold text-white">
                                {user?.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
                            </div>

                            <div className="min-w-0">
                                <p className="truncate text-xs font-bold text-[#172B24]">
                                    {user?.fullName || 'Investor Workspace'}
                                </p>
                                <p className="truncate text-[10px] text-gray-500">
                                    {user?.email || 'Guest Mode'}
                                </p>
                            </div>
                        </div>

                        {user ? (
                            <button
                                type="button"
                                onClick={handleLogout}
                                title="Sign Out"
                                className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-400 hover:text-red-600 hover:bg-white transition cursor-pointer"
                            >
                                <LogOutIcon className="w-4 h-4" />
                            </button>
                        ) : (
                            <Link
                                to="/login"
                                className="text-[11px] font-bold text-[#00A878] hover:text-[#008F65] cursor-pointer"
                            >
                                Login
                            </Link>
                        )}
                    </div>
                </div>
            </aside>

            {/* Main section */}
            <div className="min-h-screen lg:pl-[260px]">

                {/* Top header */}
                <header className="sticky top-0 z-30 flex h-[76px] items-center justify-between border-b border-[#E1E9E3] bg-white/95 px-4 backdrop-blur-md sm:px-7 lg:px-9">
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={() => setSidebarOpen(true)}
                            aria-label="Open navigation menu"
                            className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#E1E9E3] text-[#172B24] lg:hidden hover:bg-[#F4F7F5] cursor-pointer"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>

                        <div>
                            <p className="text-sm font-bold text-[#172B24]">
                                Financial Intelligence Dashboard
                            </p>
                            <p className="hidden text-xs text-gray-400 sm:block">
                                Monitor audited disclosures and claim activities
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-3">
                        <button
                            type="button"
                            onClick={refreshClaims}
                            disabled={loading}
                            title="Refresh dashboard data"
                            aria-label="Refresh dashboard data"
                            className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#E1E9E3] text-gray-500 transition hover:border-[#00A878] hover:text-[#008F65] hover:bg-[#F4F8F5] disabled:opacity-50 cursor-pointer"
                        >
                            <RefreshCwIcon className={`w-4 h-4 ${loading ? 'animate-spin text-[#00A878]' : ''}`} />
                        </button>

                        <Link
                            to="/saved"
                            title="Saved Claims"
                            className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-[#E1E9E3] text-gray-500 transition hover:border-[#00A878] hover:text-[#008F65] hover:bg-[#F4F8F5] cursor-pointer"
                        >
                            <BookmarkIcon className="w-4 h-4" />
                            {savedClaims.length > 0 && (
                                <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#00A878] px-1 text-[9px] font-bold text-white">
                                    {savedClaims.length}
                                </span>
                            )}
                        </Link>

                        <div className="hidden h-9 w-9 items-center justify-center rounded-xl bg-[#E2F0E8] text-xs font-bold text-[#008F65] sm:flex border border-[#C5DFD0]">
                            {user?.fullName ? user.fullName.charAt(0).toUpperCase() : 'M'}
                        </div>
                    </div>
                </header>

                <main className="mx-auto max-w-[1500px] px-4 py-6 sm:px-7 sm:py-8 lg:px-9">

                    {/* Welcome section */}
                    <section className="mb-7 flex flex-col justify-between gap-5 rounded-2xl border border-[#DCE6DF] bg-white p-5 shadow-sm sm:p-7 lg:flex-row lg:items-center hover:border-[#BBD9C7] transition-all">
                        <div className="max-w-2xl">
                            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#008F65]">
                                YOUR WORKSPACE
                            </p>

                            <h1 className="mt-2 text-2xl font-bold tracking-tight text-[#172B24] sm:text-3xl">
                                Financial claims, clearly evaluated.
                            </h1>

                            <p className="mt-2 max-w-xl text-xs sm:text-sm leading-relaxed text-gray-500">
                                Track submitted claims, review official exchange disclosures from NSE and SEBI,
                                and audit growth assertions with full transparency.
                            </p>
                        </div>

                        <Link
                            to="/verify"
                            className="inline-flex w-fit shrink-0 items-center justify-center gap-2 rounded-xl bg-[#00A878] px-5 py-3 text-xs sm:text-sm font-semibold text-white shadow-sm transition hover:bg-[#008F65] cursor-pointer active:scale-[0.99]"
                        >
                            <PlusIcon className="w-4 h-4" />
                            <span>Verify New Claim</span>
                        </Link>
                    </section>

                    {/* Error message */}
                    {error && (
                        <div className="mb-6 flex flex-col gap-3 rounded-xl border border-red-200 bg-red-50 p-4 sm:flex-row sm:items-center sm:justify-between text-xs sm:text-sm text-red-700">
                            <p>{error}</p>
                            <button
                                type="button"
                                onClick={refreshClaims}
                                className="shrink-0 font-semibold underline cursor-pointer"
                            >
                                Try again
                            </button>
                        </div>
                    )}

                    {/* Statistics */}
                    <section className="mb-8">
                        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                            <div>
                                <h2 className="text-base sm:text-lg font-bold text-[#172B24]">
                                    Verification Overview
                                </h2>
                                <p className="text-xs text-gray-500">
                                    Audited metrics from MongoDB database records.
                                </p>
                            </div>

                            <span className="text-xs text-gray-400 font-mono">
                                {loading ? 'Loading...' : `${pendingCount} pending reviews`}
                            </span>
                        </div>

                        <div className="grid grid-cols-2 gap-3 xl:grid-cols-4 xl:gap-4">
                            {stats.map((stat) => {
                                const StatIcon = stat.Icon
                                return (
                                    <div
                                        key={stat.label}
                                        className="rounded-2xl border border-[#E1E9E3] bg-white p-4 shadow-sm sm:p-5 hover:border-[#BBD9C7] hover:-translate-y-0.5 transition-all duration-200 cursor-default"
                                    >
                                        <div className="flex items-center justify-between gap-2">
                                            <p className="text-xs font-semibold text-gray-500 sm:text-sm">
                                                {stat.label}
                                            </p>

                                            <span
                                                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-sm font-bold ${stat.color} ${stat.background}`}
                                            >
                                                <StatIcon className="w-4 h-4" />
                                            </span>
                                        </div>

                                        <p className={`mt-3 text-2xl sm:text-3xl font-extrabold ${stat.color} tabular-nums`}>
                                            {loading ? '—' : stat.value}
                                        </p>

                                        <p className="mt-1 text-xs text-gray-400">
                                            {stat.description}
                                        </p>
                                    </div>
                                )
                            })}
                        </div>
                    </section>

                    {/* Pending and saved summary */}
                    <section className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="flex items-center justify-between gap-4 rounded-2xl border border-[#E1E9E3] bg-white p-5 shadow-sm hover:border-[#BBD9C7] transition-all">
                            <div>
                                <p className="text-sm font-bold text-[#172B24]">
                                    Pending Reviews
                                </p>
                                <p className="mt-1 text-xs leading-relaxed text-gray-500">
                                    Claims submitted and waiting for official evidence verification.
                                </p>
                                <Link
                                    to="/history"
                                    className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-[#008F65] hover:text-[#006F4F] cursor-pointer"
                                >
                                    <span>View Claim History</span>
                                    <ArrowRightIcon className="w-3.5 h-3.5" />
                                </Link>
                            </div>

                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#FFF3DF] text-xl font-bold text-[#A66A00] tabular-nums">
                                {loading ? '—' : pendingCount}
                            </div>
                        </div>

                        <div className="flex items-center justify-between gap-4 rounded-2xl border border-[#E1E9E3] bg-white p-5 shadow-sm hover:border-[#BBD9C7] transition-all">
                            <div>
                                <p className="text-sm font-bold text-[#172B24]">
                                    Saved Claims
                                </p>
                                <p className="mt-1 text-xs leading-relaxed text-gray-500">
                                    Audited financial claims bookmarked for long-term reference.
                                </p>
                                <Link
                                    to="/saved"
                                    className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-[#008F65] hover:text-[#006F4F] cursor-pointer"
                                >
                                    <span>Open Saved Claims</span>
                                    <ArrowRightIcon className="w-3.5 h-3.5" />
                                </Link>
                            </div>

                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#E7F5EC] text-xl font-bold text-[#008F65] tabular-nums">
                                {loading ? '—' : savedClaims.length}
                            </div>
                        </div>
                    </section>

                    {/* Recent activity */}
                    <section className="mb-8 overflow-hidden rounded-2xl border border-[#E1E9E3] bg-white shadow-sm">
                        <div className="flex flex-col justify-between gap-3 border-b border-[#E1E9E3] p-5 sm:flex-row sm:items-center sm:px-6">
                            <div>
                                <h2 className="text-base sm:text-lg font-bold text-[#172B24]">
                                    Recent Activity
                                </h2>
                                <p className="text-xs text-gray-500">
                                    Your latest financial claims recorded in MongoDB.
                                </p>
                            </div>

                            <Link
                                to="/history"
                                className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-[#008F65] hover:text-[#006F4F] cursor-pointer"
                            >
                                <span>View All Claims</span>
                                <ArrowRightIcon className="w-4 h-4" />
                            </Link>
                        </div>

                        {loading ? (
                            <div className="px-5 py-12 text-center text-xs text-gray-500">
                                <RefreshCwIcon className="w-5 h-5 mx-auto mb-2 animate-spin text-[#00A878]" />
                                Loading recent activity...
                            </div>
                        ) : recentClaims.length > 0 ? (
                            <div className="divide-y divide-[#E1E9E3]">
                                {recentClaims.map((claim) => (
                                    <div
                                        key={claim._id}
                                        className="flex flex-col justify-between gap-3 p-5 transition hover:bg-[#FAFCFA] sm:flex-row sm:items-center sm:px-6"
                                    >
                                        <div className="min-w-0 flex-1">
                                            <Link
                                                to={`/claim/${claim._id}`}
                                                className="block break-words text-sm font-semibold leading-relaxed text-[#172B24] transition hover:text-[#008F65] cursor-pointer"
                                            >
                                                {claim.title}
                                            </Link>

                                            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-gray-400">
                                                <span className="font-medium text-gray-600">
                                                    {claim.category || 'Company Financials'}
                                                </span>
                                                <span>&bull;</span>
                                                <span className="tabular-nums">
                                                    {formatDate(claim.createdAt)}
                                                </span>

                                                {claim.isSaved && (
                                                    <>
                                                        <span>&bull;</span>
                                                        <span className="inline-flex items-center gap-1 font-semibold text-[#008F65]">
                                                            <BookmarkIcon filled className="w-3 h-3" />
                                                            Saved
                                                        </span>
                                                    </>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between gap-4 sm:justify-end">
                                            <StatusBadge status={claim.status} />

                                            <Link
                                                to={`/claim/${claim._id}`}
                                                className="inline-flex items-center gap-1 text-xs font-bold text-[#008F65] hover:text-[#006F4F] cursor-pointer"
                                            >
                                                <span>Audit Details</span>
                                                <ArrowRightIcon className="w-3.5 h-3.5" />
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="px-5 py-12 text-center">
                                <EmptyStateVisual type="claims" size={80} />
                                <p className="font-bold text-[#172B24] text-sm mt-3">
                                    No claims submitted yet
                                </p>
                                <p className="mt-1 text-xs text-gray-500">
                                    Submit your first financial claim to evaluate its evidence.
                                </p>
                                <Link
                                    to="/verify"
                                    className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-[#00A878] px-4 py-2 text-xs font-semibold text-white hover:bg-[#008F65] transition cursor-pointer"
                                >
                                    <PlusIcon className="w-4 h-4" />
                                    <span>Submit First Claim</span>
                                </Link>
                            </div>
                        )}
                    </section>

                    {/* Market insights and information */}
                    <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                        <div className="rounded-2xl border border-[#E1E9E3] bg-white p-5 shadow-sm sm:p-6 hover:border-[#BBD9C7] transition-all">
                            <div className="flex items-center justify-between gap-3">
                                <div>
                                    <h2 className="font-bold text-[#172B24] text-base">
                                        Market Announcements
                                    </h2>
                                    <p className="mt-0.5 text-xs text-gray-500">
                                        Explore live NSE announcements and SEBI updates.
                                    </p>
                                </div>

                                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E2F0E8] text-[#008F65]">
                                    <TrendingUpIcon className="w-5 h-5" />
                                </span>
                            </div>

                            <p className="mt-4 text-xs sm:text-sm leading-relaxed text-gray-600">
                                Keep track of official exchange announcements, board meetings, and regulatory circulars across Indian public companies.
                            </p>

                            <div className="mt-5 flex flex-wrap gap-2.5">
                                <Link
                                    to="/market-insights"
                                    className="rounded-xl bg-[#00A878] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[#008F65] cursor-pointer"
                                >
                                    Market Insights
                                </Link>

                                <Link
                                    to="/company-research"
                                    className="rounded-xl border border-[#DCE6DF] bg-white px-4 py-2.5 text-xs font-semibold text-[#172B24] transition hover:bg-[#F4F7F5] cursor-pointer"
                                >
                                    Company Research
                                </Link>
                            </div>
                        </div>

                        <div className="rounded-2xl border border-[#DCE6DF] bg-[#EAF2EC] p-5 sm:p-6 hover:border-[#BBD9C7] transition-all">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#008F65] shadow-xs">
                                <VerifyCheckIcon className="w-5 h-5" />
                            </div>

                            <h2 className="mt-4 font-bold text-[#172B24] text-base">
                                Grounded in Authenticated Filings
                            </h2>

                            <p className="mt-1.5 text-xs sm:text-sm leading-relaxed text-gray-600">
                                A financial claim should be verified using statutory disclosures, audited balance sheets, and primary exchange citations rather than market hearsay.
                            </p>

                            <Link
                                to="/verify"
                                className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-[#008F65] hover:text-[#006F4F] cursor-pointer group"
                            >
                                <span>Verify a New Claim</span>
                                <ArrowRightIcon className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                            </Link>
                        </div>
                    </section>

                    {/* Disclaimer */}
                    <div className="mt-7 rounded-xl border border-[#E1E9E3] bg-white/70 p-4">
                        <p className="text-[11px] leading-relaxed text-gray-500">
                            <strong className="text-gray-600">Disclaimer:</strong>{' '}
                            Dashboard claim statistics are queried live from your MongoDB Atlas database. Unverified and Pending claims do not indicate falsehood; they reflect absence of verified primary documentation. MTrack AI does not provide stock recommendations.
                        </p>
                    </div>
                </main>
            </div>
        </div>
    )
}

export default Dashboard
