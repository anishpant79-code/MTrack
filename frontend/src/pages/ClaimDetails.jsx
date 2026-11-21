import { Link, useParams } from 'react-router-dom'
import { useCallback, useEffect, useState } from 'react'
import { getAuthHeaders } from '../utils/auth'
import useDocumentTitle from '../utils/useDocumentTitle'
import BackButton from '../components/BackButton'
import EmptyStateVisual from '../components/EmptyStateVisual'
import { RefreshCwIcon, PlusIcon } from '../components/Icons'

const API_URL =
    import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'

const statusStyles = {
    Verified: 'bg-[#E7F5EC] text-[#008F65] border-green-200',
    Unverified: 'bg-[#FFF3DF] text-[#A66A00] border-amber-200',
    Contradicted: 'bg-[#FCE9E8] text-[#C43D36] border-red-200',
    Pending: 'bg-[#FFF3DF] text-[#A66A00] border-amber-200',
}

function formatDate(date) {
    if (!date) return 'Not available'

    const parsedDate = new Date(date)

    if (Number.isNaN(parsedDate.getTime())) return 'Not available'

    return parsedDate.toLocaleString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    })
}

function ClaimDetails() {
    const { id } = useParams()

    const [claim, setClaim] = useState(null)
    const [evidence, setEvidence] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [saving, setSaving] = useState(false)
    const [reverifying, setReverifying] = useState(false)

    useDocumentTitle(
        claim?.extractedDetails?.company
            ? `${claim.extractedDetails.company} - Audit Report`
            : claim?.title
            ? `${claim.title.slice(0, 30)}... - Audit Report`
            : 'Claim Verification Report'
    )

    // Direct Evidence form state
    const [showAddEvidence, setShowAddEvidence] = useState(false)
    const [evidenceSourceName, setEvidenceSourceName] = useState('NSE Exchange Filing')
    const [evidenceSourceUrl, setEvidenceSourceUrl] = useState('')
    const [evidenceDocTitle, setEvidenceDocTitle] = useState('')
    const [evidencePrevVal, setEvidencePrevVal] = useState('')
    const [evidenceCurrVal, setEvidenceCurrVal] = useState('')
    const [evidenceUnit, setEvidenceUnit] = useState('₹ Crore')
    const [evidenceExcerpt, setEvidenceExcerpt] = useState('')
    const [submittingEvidence, setSubmittingEvidence] = useState(false)

    const fetchClaimDetails = useCallback(async () => {
        try {
            setLoading(true)
            setError('')

            const [claimResponse, evidenceResponse] = await Promise.all([
                fetch(`${API_URL}/claims/${id}`, { headers: getAuthHeaders() }),
                fetch(`${API_URL}/claims/${id}/evidence`, { headers: getAuthHeaders() }),
            ])

            const claimResult = await claimResponse.json()

            if (!claimResponse.ok || !claimResult.success) {
                throw new Error(
                    claimResult.message || 'Unable to load claim details.'
                )
            }

            setClaim(claimResult.data)

            if (evidenceResponse.ok) {
                const evidenceResult = await evidenceResponse.json()
                setEvidence(
                    Array.isArray(evidenceResult.data)
                        ? evidenceResult.data
                        : []
                )
            } else {
                setEvidence([])
            }
        } catch (err) {
            setError(err.message || 'Something went wrong.')
        } finally {
            setLoading(false)
        }
    }, [id])

    useEffect(() => {
        fetchClaimDetails()
    }, [fetchClaimDetails])

    const toggleSaved = async () => {
        if (!claim || saving) return

        try {
            setSaving(true)

            const response = await fetch(`${API_URL}/claims/${id}`, {
                method: 'PATCH',
                headers: getAuthHeaders(),
                body: JSON.stringify({
                    isSaved: !claim.isSaved,
                }),
            })

            const result = await response.json()

            if (!response.ok || !result.success) {
                throw new Error(
                    result.message || 'Could not update saved status.'
                )
            }

            setClaim(result.data)
        } catch (err) {
            setError(err.message || 'Could not update saved status.')
        } finally {
            setSaving(false)
        }
    }

    const handleReverify = async () => {
        if (!claim || reverifying) return

        try {
            setReverifying(true)
            const response = await fetch(`${API_URL}/claims/${id}/verify`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify({
                    claimDetails: claim.extractedDetails || {},
                }),
            })

            const result = await response.json()
            if (!response.ok || !result.success) {
                throw new Error(result.message || 'Verification could not be re-run.')
            }

            await fetchClaimDetails()
        } catch (err) {
            alert(err.message || 'Re-verification failed.')
        } finally {
            setReverifying(false)
        }
    }

    const handleAddEvidence = async (e) => {
        e.preventDefault()
        if (!claim || submittingEvidence) return

        if (!evidenceExcerpt.trim()) {
            alert('Please provide an excerpt from the document.')
            return
        }

        try {
            setSubmittingEvidence(true)

            const facts = []
            const metric = claim.extractedDetails?.metric || 'Revenue'
            const prevPeriod = claim.extractedDetails?.previousPeriod || 'FY2025'
            const currPeriod = claim.extractedDetails?.currentPeriod || 'FY2026'

            if (evidencePrevVal && Number.isFinite(Number(evidencePrevVal))) {
                facts.push({
                    metric,
                    period: prevPeriod,
                    value: Number(evidencePrevVal),
                    unit: evidenceUnit,
                    basis: 'Consolidated',
                })
            }

            if (evidenceCurrVal && Number.isFinite(Number(evidenceCurrVal))) {
                facts.push({
                    metric,
                    period: currPeriod,
                    value: Number(evidenceCurrVal),
                    unit: evidenceUnit,
                    basis: 'Consolidated',
                })
            }

            const evidenceRes = await fetch(`${API_URL}/claims/${id}/evidence`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify({
                    sourceName: evidenceSourceName,
                    sourceType: 'exchange_filing',
                    sourceAuthority: 'official_primary',
                    sourceUrl: evidenceSourceUrl.trim() || 'https://nsearchives.nseindia.com',
                    documentTitle: evidenceDocTitle.trim() || 'Official Financial Disclosures',
                    publishedAt: new Date().toISOString(),
                    reportingPeriod: `${prevPeriod} - ${currPeriod}`,
                    excerpt: evidenceExcerpt.trim(),
                    facts,
                }),
            })

            const evidenceData = await evidenceRes.json()
            if (!evidenceRes.ok || !evidenceData.success) {
                throw new Error(evidenceData.message || 'Failed to add evidence.')
            }

            // Immediately re-run verification
            await fetch(`${API_URL}/claims/${id}/verify`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify({
                    claimDetails: claim.extractedDetails || {},
                }),
            })

            setShowAddEvidence(false)
            setEvidenceExcerpt('')
            setEvidencePrevVal('')
            setEvidenceCurrVal('')
            await fetchClaimDetails()
        } catch (err) {
            alert(err.message || 'Error attaching evidence.')
        } finally {
            setSubmittingEvidence(false)
        }
    }

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#F4F7F5] px-4">
                <div className="text-center">
                    <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-[#DCE6DF] border-t-[#00A878]" />
                    <p className="mt-4 text-sm font-medium text-gray-500">
                        Loading claim details...
                    </p>
                </div>
            </div>
        )
    }

    if (error && !claim) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#F4F7F5] px-4 py-10">
                <div className="w-full max-w-md rounded-2xl border border-[#E1E9E3] bg-white p-8 text-center shadow-sm">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FCE9E8] text-2xl font-bold text-[#C43D36]">
                        !
                    </div>

                    <h1 className="mt-5 text-xl font-bold text-[#172B24]">
                        Unable to load claim
                    </h1>

                    <p className="mt-2 text-sm leading-6 text-gray-500">
                        {error}
                    </p>

                    <button
                        onClick={fetchClaimDetails}
                        className="mt-6 rounded-xl bg-[#00A878] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#008F65]"
                    >
                        Try Again
                    </button>

                    <div>
                        <Link
                            to="/history"
                            className="mt-4 inline-block text-sm font-semibold text-[#008F65]"
                        >
                            Return to Claim History
                        </Link>
                    </div>
                </div>
            </div>
        )
    }

    if (!claim) return null

    const status = claim.status || 'Pending'
    const verification = claim.verification || {}
    const calculation = verification.calculation || null
    const limitations = Array.isArray(verification.limitations)
        ? verification.limitations
        : []
    const extracted = claim.extractedDetails || {}

    const claimId = claim._id || id

    return (
        <div className="min-h-screen bg-[#F4F7F5] px-4 py-6 sm:px-6 lg:px-10 lg:py-9">
            <div className="mx-auto max-w-5xl">
                {/* Navigation Bar */}
                <div className="mb-7 flex flex-wrap items-center justify-between gap-3">
                    <BackButton label="Back to Claim History" fallbackUrl="/history" />

                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={handleReverify}
                            disabled={reverifying}
                            className="inline-flex items-center gap-1.5 rounded-xl border border-[#DCE6DF] bg-white px-4 py-2.5 text-xs sm:text-sm font-semibold text-[#008F65] hover:bg-[#E2F0E8] transition disabled:opacity-50 cursor-pointer shadow-xs"
                        >
                            <RefreshCwIcon className={`w-3.5 h-3.5 ${reverifying ? 'animate-spin' : ''}`} />
                            <span>{reverifying ? 'Verifying...' : 'Re-verify Claim'}</span>
                        </button>

                        <Link
                            to="/verify"
                            className="inline-flex items-center gap-1.5 rounded-xl bg-[#00A878] px-4 py-2.5 text-xs sm:text-sm font-semibold text-white hover:bg-[#008F65] transition cursor-pointer shadow-xs"
                        >
                            <PlusIcon className="w-3.5 h-3.5" />
                            <span>New Claim</span>
                        </Link>
                    </div>
                </div>

                {/* Heading */}
                <div className="mb-7">
                    <p className="text-xs font-bold text-[#008F65] tracking-wider uppercase">
                        CLAIM AUDIT & VERIFICATION REPORT
                    </p>

                    <h1 className="mt-2 max-w-3xl text-2xl font-bold leading-tight tracking-tight text-[#172B24] sm:text-3xl">
                        {claim.title}
                    </h1>

                    <div className="mt-4 flex flex-wrap items-center gap-3">
                        <span
                            className={`rounded-full px-3.5 py-1 text-xs font-bold border ${
                                statusStyles[status] || statusStyles.Pending
                            }`}
                        >
                            {status}
                        </span>

                        <span className="text-sm font-medium text-gray-500">
                            {claim.category || 'Company Financials'}
                        </span>

                        <span className="text-sm text-gray-400">·</span>

                        <span className="text-sm text-gray-500">
                            {formatDate(claim.createdAt)}
                        </span>
                    </div>
                </div>

                {error && (
                    <div className="mb-5 rounded-xl border border-[#F1DFBD] bg-[#FFFAF1] p-4 text-sm text-[#96600D]">
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Main content */}
                    <div className="space-y-6 lg:col-span-2">
                        {/* Extracted Details Pill Grid */}
                        {extracted.company && (
                            <section className="rounded-2xl border border-[#DCE6DF] bg-white p-5 shadow-sm">
                                <h2 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                                    Structured Extraction
                                </h2>
                                <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
                                    <div className="bg-[#F8FAF8] rounded-xl p-3 border border-[#E1E9E3]">
                                        <p className="text-[11px] text-gray-400 font-semibold uppercase">Company</p>
                                        <p className="text-sm font-bold text-[#172B24] mt-1">{extracted.company}</p>
                                    </div>
                                    <div className="bg-[#F8FAF8] rounded-xl p-3 border border-[#E1E9E3]">
                                        <p className="text-[11px] text-gray-400 font-semibold uppercase">Metric</p>
                                        <p className="text-sm font-bold text-[#172B24] mt-1">{extracted.metric || 'Revenue'}</p>
                                    </div>
                                    <div className="bg-[#F8FAF8] rounded-xl p-3 border border-[#E1E9E3]">
                                        <p className="text-[11px] text-gray-400 font-semibold uppercase">Periods</p>
                                        <p className="text-sm font-bold text-[#172B24] mt-1">
                                            {extracted.previousPeriod || 'FY2025'} → {extracted.currentPeriod || 'FY2026'}
                                        </p>
                                    </div>
                                    {typeof extracted.claimedGrowthPercent === 'number' && (
                                        <div className="bg-[#F8FAF8] rounded-xl p-3 border border-[#E1E9E3]">
                                            <p className="text-[11px] text-gray-400 font-semibold uppercase">Claimed Growth</p>
                                            <p className="text-sm font-bold text-[#008F65] mt-1">
                                                {extracted.claimedGrowthPercent}%
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </section>
                        )}

                        {/* Verification Assessment Section */}
                        <section className="rounded-2xl border border-[#E1E9E3] bg-white p-5 shadow-sm sm:p-7">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E2F0E8] text-[#008F65]">
                                    <svg
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        className="h-5 w-5"
                                        aria-hidden="true"
                                    >
                                        <path d="M12 3 20 6v5c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6l8-3Z" />
                                        <path d="m9 12 2 2 4-4" />
                                    </svg>
                                </div>

                                <div>
                                    <h2 className="font-bold text-[#172B24]">
                                        Verification Assessment
                                    </h2>
                                    <p className="text-xs text-gray-500">
                                        Evidence-based deterministic analysis
                                    </p>
                                </div>
                            </div>

                            <div className="mt-6 rounded-xl border border-[#E1E9E3] bg-[#F8FAF8] p-5">
                                <div className="flex flex-wrap items-center justify-between gap-3">
                                    <p className="text-sm font-bold text-[#172B24]">
                                        Status Summary
                                    </p>

                                    <span
                                        className={`rounded-full px-3 py-1 text-xs font-bold border ${
                                            statusStyles[status] || statusStyles.Pending
                                        }`}
                                    >
                                        {status}
                                    </span>
                                </div>

                                <p className="mt-3 text-sm leading-relaxed text-gray-700">
                                    {verification.summary ||
                                        (status === 'Pending'
                                            ? 'This claim has been saved but has not yet received a verification assessment.'
                                            : 'No verification summary is available for this claim.')}
                                </p>

                                {verification.checkedAt && (
                                    <div className="mt-4 border-t border-[#E1E9E3] pt-3 text-xs text-gray-400">
                                        Checked at: {formatDate(verification.checkedAt)}
                                    </div>
                                )}
                            </div>

                            {/* Mathematical Calculation Card */}
                            {calculation && (
                                <div className="mt-5 rounded-xl border border-[#00A878]/30 bg-[#E2F0E8]/40 p-5">
                                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#008F65]">
                                        Deterministic Mathematical Verification
                                    </h3>

                                    <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                                        <div className="bg-white rounded-xl p-3 border border-[#DCE6DF]">
                                            <p className="text-[11px] text-gray-400">{calculation.previousPeriod}</p>
                                            <p className="text-sm font-bold text-[#172B24] mt-0.5">
                                                {calculation.previousValue} {calculation.unit}
                                            </p>
                                        </div>
                                        <div className="bg-white rounded-xl p-3 border border-[#DCE6DF]">
                                            <p className="text-[11px] text-gray-400">{calculation.currentPeriod}</p>
                                            <p className="text-sm font-bold text-[#172B24] mt-0.5">
                                                {calculation.currentValue} {calculation.unit}
                                            </p>
                                        </div>
                                        <div className="bg-white rounded-xl p-3 border border-[#DCE6DF]">
                                            <p className="text-[11px] text-gray-400">Actual Growth</p>
                                            <p className="text-sm font-bold text-[#008F65] mt-0.5">
                                                {calculation.actualGrowthPercent}%
                                            </p>
                                        </div>
                                        <div className="bg-white rounded-xl p-3 border border-[#DCE6DF]">
                                            <p className="text-[11px] text-gray-400">Claimed Growth</p>
                                            <p className="text-sm font-bold text-[#172B24] mt-0.5">
                                                {calculation.claimedGrowthPercent}%
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Transparency score */}
                            {typeof verification.transparencyScore === 'number' && (
                                <div className="mt-5 rounded-xl border border-[#E1E9E3] p-5">
                                    <div className="flex items-center justify-between gap-3">
                                        <div>
                                            <p className="text-sm font-bold text-[#172B24]">
                                                Transparency Score
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                Evidence transparency indicator
                                            </p>
                                        </div>

                                        <p className="text-2xl font-bold text-[#008F65]">
                                            {verification.transparencyScore}/100
                                        </p>
                                    </div>

                                    <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#E8EEE9]">
                                        <div
                                            className="h-full rounded-full bg-[#00A878]"
                                            style={{
                                                width: `${Math.min(
                                                    100,
                                                    Math.max(
                                                        0,
                                                        verification.transparencyScore
                                                    )
                                                )}%`,
                                            }}
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Limitations */}
                            {limitations.length > 0 && (
                                <div className="mt-5 rounded-xl border border-[#F1DFBD] bg-[#FFFAF1] p-5">
                                    <h3 className="text-sm font-bold text-[#96600D]">
                                        Audit Limitations
                                    </h3>

                                    <ul className="mt-3 space-y-2">
                                        {limitations.map((item, index) => (
                                            <li
                                                key={index}
                                                className="flex gap-2 text-sm leading-6 text-[#725B36]"
                                            >
                                                <span>•</span>
                                                <span>
                                                    {typeof item === 'string'
                                                        ? item
                                                        : item.message || JSON.stringify(item)}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </section>

                        {/* Evidence Records */}
                        <section className="rounded-2xl border border-[#E1E9E3] bg-white p-5 shadow-sm sm:p-7">
                            <div className="flex flex-wrap items-center justify-between gap-3">
                                <div>
                                    <h2 className="font-bold text-[#172B24]">
                                        Evidence Records ({evidence.length})
                                    </h2>
                                    <p className="mt-1 text-xs text-gray-500">
                                        Official filings and disclosures linked to this claim
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => setShowAddEvidence(!showAddEvidence)}
                                    className="rounded-lg bg-[#E2F0E8] px-3 py-1.5 text-xs font-semibold text-[#008F65] hover:bg-[#d5ebd9]"
                                >
                                    {showAddEvidence ? 'Cancel Input' : '+ Add Direct Evidence'}
                                </button>
                            </div>

                            {/* Add Evidence Form */}
                            {showAddEvidence && (
                                <form onSubmit={handleAddEvidence} className="mt-5 rounded-2xl border border-[#DCE6DF] bg-[#F8FAF8] p-5 space-y-4">
                                    <p className="text-xs font-bold uppercase text-[#008F65]">
                                        Add Authenticated Document Figures
                                    </p>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-600 mb-1">
                                                Source Authority / Publisher
                                            </label>
                                            <input
                                                type="text"
                                                value={evidenceSourceName}
                                                onChange={(e) => setEvidenceSourceName(e.target.value)}
                                                className="w-full rounded-lg border border-[#DCE6DF] bg-white px-3 py-2 text-xs"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-xs font-semibold text-gray-600 mb-1">
                                                Document Title / Reference
                                            </label>
                                            <input
                                                type="text"
                                                value={evidenceDocTitle}
                                                onChange={(e) => setEvidenceDocTitle(e.target.value)}
                                                placeholder="e.g. Audited Annual Filing FY2026"
                                                className="w-full rounded-lg border border-[#DCE6DF] bg-white px-3 py-2 text-xs"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-xs font-semibold text-gray-600 mb-1">
                                                {extracted.previousPeriod || 'Previous Period'} Value
                                            </label>
                                            <input
                                                type="number"
                                                step="any"
                                                value={evidencePrevVal}
                                                onChange={(e) => setEvidencePrevVal(e.target.value)}
                                                placeholder="e.g. 100000"
                                                className="w-full rounded-lg border border-[#DCE6DF] bg-white px-3 py-2 text-xs"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-xs font-semibold text-gray-600 mb-1">
                                                {extracted.currentPeriod || 'Current Period'} Value
                                            </label>
                                            <input
                                                type="number"
                                                step="any"
                                                value={evidenceCurrVal}
                                                onChange={(e) => setEvidenceCurrVal(e.target.value)}
                                                placeholder="e.g. 115000"
                                                className="w-full rounded-lg border border-[#DCE6DF] bg-white px-3 py-2 text-xs"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-xs font-semibold text-gray-600 mb-1">
                                                Source URL
                                            </label>
                                            <input
                                                type="url"
                                                value={evidenceSourceUrl}
                                                onChange={(e) => setEvidenceSourceUrl(e.target.value)}
                                                placeholder="https://nsearchives.nseindia.com/..."
                                                className="w-full rounded-lg border border-[#DCE6DF] bg-white px-3 py-2 text-xs"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-xs font-semibold text-gray-600 mb-1">
                                                Unit
                                            </label>
                                            <input
                                                type="text"
                                                value={evidenceUnit}
                                                onChange={(e) => setEvidenceUnit(e.target.value)}
                                                placeholder="₹ Crore"
                                                className="w-full rounded-lg border border-[#DCE6DF] bg-white px-3 py-2 text-xs"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-gray-600 mb-1">
                                            Evidence Excerpt / Citation
                                        </label>
                                        <textarea
                                            value={evidenceExcerpt}
                                            onChange={(e) => setEvidenceExcerpt(e.target.value)}
                                            rows={2}
                                            required
                                            placeholder="Audited statement shows revenue increased from 100,000 to 115,000..."
                                            className="w-full rounded-lg border border-[#DCE6DF] bg-white px-3 py-2 text-xs"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={submittingEvidence}
                                        className="rounded-lg bg-[#00A878] text-white px-4 py-2 text-xs font-semibold hover:bg-[#008F65]"
                                    >
                                        {submittingEvidence ? 'Saving & Re-Verifying...' : 'Save Evidence & Re-Verify Claim'}
                                    </button>
                                </form>
                            )}

                            {evidence.length === 0 ? (
                                <div className="mt-5 rounded-2xl border border-dashed border-[#DCE6DF] bg-[#F8FAF8] px-5 py-8 text-center">
                                    <EmptyStateVisual type="evidence" size={72} />
                                    <p className="mt-3 text-sm font-bold text-[#172B24]">
                                        No evidence records attached yet
                                    </p>
                                    <p className="mt-1.5 text-xs leading-5 text-gray-500 max-w-sm mx-auto">
                                        Evidence records will appear here when company filings from NSE or SEBI are associated with this claim.
                                    </p>
                                </div>
                            ) : (
                                <div className="mt-5 space-y-4">
                                    {evidence.map((item, index) => (
                                        <div
                                            key={item._id || index}
                                            className="rounded-xl border border-[#E1E9E3] p-4 bg-white"
                                        >
                                            <div className="flex flex-wrap items-center justify-between gap-2">
                                                <div>
                                                    <h3 className="text-sm font-bold text-[#172B24]">
                                                        {item.documentTitle || item.sourceName || `Evidence ${index + 1}`}
                                                    </h3>
                                                    {item.documentTitle && item.sourceName && (
                                                        <p className="text-xs text-gray-400 mt-0.5">
                                                            {item.sourceName}
                                                        </p>
                                                    )}
                                                </div>

                                                <span className="rounded-full bg-[#E2F0E8] px-2.5 py-1 text-xs font-semibold text-[#008F65]">
                                                    {item.sourceAuthority || item.sourceType || 'Source'}
                                                </span>
                                            </div>

                                            <p className="mt-3 text-xs sm:text-sm leading-relaxed text-gray-600">
                                                {item.excerpt || item.description || 'No excerpt available.'}
                                            </p>

                                            {item.sourceUrl && (
                                                <a
                                                    href={item.sourceUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="mt-3 inline-flex break-all text-xs font-semibold text-[#008F65] hover:text-[#006F4F]"
                                                >
                                                    Open original source ↗
                                                </a>
                                            )}

                                            {Array.isArray(item.facts) && item.facts.length > 0 && (
                                                <div className="mt-3 border-t border-[#E1E9E3] pt-2">
                                                    <p className="text-[11px] font-semibold uppercase text-gray-400">
                                                        Extracted Facts:
                                                    </p>
                                                    <div className="flex flex-wrap gap-2 mt-1">
                                                        {item.facts.map((f, fi) => (
                                                            <span key={fi} className="text-xs bg-[#F4F7F5] border border-[#DCE6DF] px-2 py-0.5 rounded">
                                                                {f.period}: {f.metric} = {f.value} {f.unit}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>
                    </div>

                    {/* Sidebar */}
                    <aside className="space-y-6">
                        <section className="rounded-2xl border border-[#E1E9E3] bg-white p-5 shadow-sm">
                            <h2 className="font-bold text-[#172B24]">
                                Claim Overview
                            </h2>

                            <div className="mt-5 space-y-4">
                                <div>
                                    <p className="text-xs text-gray-400">Current status</p>
                                    <div className="mt-2">
                                        <span
                                            className={`rounded-full px-3 py-1.5 text-xs font-bold border ${
                                                statusStyles[status] || statusStyles.Pending
                                            }`}
                                        >
                                            {status}
                                        </span>
                                    </div>
                                </div>

                                <div className="border-t border-[#E1E9E3] pt-4">
                                    <p className="text-xs text-gray-400">Claim ID</p>
                                    <p className="mt-1 break-all text-xs font-mono text-[#172B24]">
                                        {claimId}
                                    </p>
                                </div>

                                <div className="border-t border-[#E1E9E3] pt-4">
                                    <p className="text-xs text-gray-400">Category</p>
                                    <p className="mt-1 text-sm font-semibold text-[#172B24]">
                                        {claim.category || 'Company Financials'}
                                    </p>
                                </div>

                                <div className="border-t border-[#E1E9E3] pt-4">
                                    <p className="text-xs text-gray-400">Submitted</p>
                                    <p className="mt-1 text-sm font-semibold text-[#172B24]">
                                        {formatDate(claim.createdAt)}
                                    </p>
                                </div>

                                <div className="border-t border-[#E1E9E3] pt-4">
                                    <p className="text-xs text-gray-400">Saved to Favourites</p>
                                    <button
                                        onClick={toggleSaved}
                                        disabled={saving}
                                        className="mt-2 w-full rounded-xl border border-[#DCE6DF] px-4 py-2.5 text-sm font-semibold text-[#008F65] transition hover:bg-[#F2F8F4] disabled:opacity-60"
                                    >
                                        {saving
                                            ? 'Updating...'
                                            : claim.isSaved
                                                ? '★ Remove from Saved'
                                                : '☆ Save this Claim'}
                                    </button>
                                </div>
                            </div>
                        </section>

                        <section className="rounded-2xl border border-[#DCE6DF] bg-[#EAF2EC] p-5">
                            <h2 className="font-bold text-[#172B24]">
                                Evidence-first investing
                            </h2>

                            <p className="mt-2 text-xs sm:text-sm leading-relaxed text-gray-600">
                                Always check official exchange disclosures and verified sources before making financial decisions.
                            </p>

                            <Link
                                to="/market-insights"
                                className="mt-4 inline-flex text-xs sm:text-sm font-semibold text-[#008F65] hover:text-[#006F4F]"
                            >
                                Explore Market Insights →
                            </Link>
                        </section>
                    </aside>
                </div>

                {/* Disclaimer */}
                <div className="mt-8 rounded-xl border border-[#E1E9E3] bg-white/70 p-4">
                    <p className="text-xs leading-relaxed text-gray-500">
                        <strong className="text-gray-600">Important Notice:</strong>{' '}
                        Verification results depend on official disclosures and deterministic comparison rules. Unverified denotes absent or inconclusive primary documentation, never assumed falsehood. MTrack AI does not provide stock recommendations or investment advice.
                    </p>
                </div>
            </div>
        </div>
    )
}

export default ClaimDetails
