import { useState, useEffect, useCallback } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { getAuthHeaders } from '../utils/auth'
import useDocumentTitle from '../utils/useDocumentTitle'
import MTrackLogo from '../components/MTrackLogo'
import BackButton from '../components/BackButton'
import { SparklesIcon, CheckCircleIcon } from '../components/Icons'

const API_URL =
    import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'

function VerifyClaims() {
    useDocumentTitle('Verify Financial Claims')
    const [searchParams] = useSearchParams()

    const [claim, setClaim] = useState('')
    const [source, setSource] = useState('')
    const [category, setCategory] = useState('Company Financials')

    // Structured details extracted or provided
    const [company, setCompany] = useState('')
    const [metric, setMetric] = useState('Revenue')
    const [previousPeriod, setPreviousPeriod] = useState('FY2025')
    const [currentPeriod, setCurrentPeriod] = useState('FY2026')
    const [claimedGrowthPercent, setClaimedGrowthPercent] = useState('')
    const [tolerancePercent, setTolerancePercent] = useState('0.5')

    const [extracting, setExtracting] = useState(false)
    const [extractionSource, setExtractionSource] = useState(null)
    const [loading, setLoading] = useState(false)
    const [submittedClaim, setSubmittedClaim] = useState(null)
    const [verificationError, setVerificationError] = useState('')
    const [error, setError] = useState('')

    // Direct evidence modal/form states
    const [showAddEvidence, setShowAddEvidence] = useState(false)
    const [evidenceSourceName, setEvidenceSourceName] = useState('NSE Exchange Filing')
    const [evidenceSourceUrl, setEvidenceSourceUrl] = useState('')
    const [evidenceDocTitle, setEvidenceDocTitle] = useState('')
    const [evidencePrevVal, setEvidencePrevVal] = useState('')
    const [evidenceCurrVal, setEvidenceCurrVal] = useState('')
    const [evidenceUnit, setEvidenceUnit] = useState('₹ Crore')
    const [evidenceExcerpt, setEvidenceExcerpt] = useState('')
    const [addingEvidence, setAddingEvidence] = useState(false)

    // Entity extraction function
    const extractDetails = useCallback(async (textToExtract) => {
        const target = (textToExtract || claim).trim()
        if (target.length < 5) return

        try {
            setExtracting(true)
            const response = await fetch(`${API_URL}/claims/extract`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify({ claim: target }),
            })

            const result = await response.json()
            if (response.ok && result.success && result.data) {
                const d = result.data
                if (d.company && d.company !== 'Specified Company') setCompany(d.company)
                if (d.metric) setMetric(d.metric)
                if (d.previousPeriod) setPreviousPeriod(d.previousPeriod)
                if (d.currentPeriod) setCurrentPeriod(d.currentPeriod)
                if (typeof d.claimedGrowthPercent === 'number') {
                    setClaimedGrowthPercent(String(d.claimedGrowthPercent))
                }
                if (typeof d.tolerancePercent === 'number') {
                    setTolerancePercent(String(d.tolerancePercent))
                }
                if (d.category) setCategory(d.category)
                setExtractionSource(d.extractionSource === 'gemini_ai' ? 'Gemini AI' : 'Rule Engine')
            }
        } catch (err) {
            console.warn('Extraction preview request error:', err.message)
        } finally {
            setExtracting(false)
        }
    }, [claim])

    // Pre-populate claim from query param if available
    useEffect(() => {
        const queryClaim = searchParams.get('claim')
        if (queryClaim && queryClaim.trim()) {
            setClaim(queryClaim.trim())
            extractDetails(queryClaim.trim())
        }
    }, [searchParams, extractDetails])

    const handleSubmit = async (event) => {
        event.preventDefault()

        setError('')
        setVerificationError('')
        setSubmittedClaim(null)

        const trimmedClaim = claim.trim()

        if (trimmedClaim.length < 10) {
            setError('Please enter a claim containing at least 10 characters.')
            return
        }

        const hasGrowthDetails = claimedGrowthPercent.trim() !== ''

        if (
            hasGrowthDetails &&
            (
                !Number.isFinite(Number(claimedGrowthPercent)) ||
                !Number.isFinite(Number(tolerancePercent)) ||
                Number(tolerancePercent) < 0
            )
        ) {
            setError('Enter valid numbers for growth percentage and tolerance.')
            return
        }

        setLoading(true)
        let createdClaim = null

        try {
            // 1. Save the claim in MongoDB with structured details
            const createResponse = await fetch(`${API_URL}/claims`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify({
                    title: trimmedClaim,
                    category,
                    source: source.trim(),
                    claimDetails: {
                        company: company.trim(),
                        metric,
                        previousPeriod: previousPeriod.trim(),
                        currentPeriod: currentPeriod.trim(),
                        claimedGrowthPercent: hasGrowthDetails ? Number(claimedGrowthPercent) : null,
                        tolerancePercent: Number(tolerancePercent) || 0.5,
                    },
                }),
            })

            const createResult = await createResponse.json()

            if (!createResponse.ok || !createResult.success) {
                throw new Error(
                    createResult.message || 'Unable to save your claim in MongoDB.'
                )
            }

            createdClaim = createResult.data

            if (!createdClaim?._id) {
                throw new Error('The server did not return a valid MongoDB claim ID.')
            }

            // 2. Run deterministic verification & AI explanation
            const verifyResponse = await fetch(
                `${API_URL}/claims/${createdClaim._id}/verify`,
                {
                    method: 'POST',
                    headers: getAuthHeaders(),
                    body: JSON.stringify({
                        claimDetails: {
                            company: company.trim() || createdClaim.extractedDetails?.company,
                            metric,
                            previousPeriod: previousPeriod.trim(),
                            currentPeriod: currentPeriod.trim(),
                            claimedGrowthPercent: hasGrowthDetails ? Number(claimedGrowthPercent) : null,
                            tolerancePercent: Number(tolerancePercent) || 0.5,
                        },
                    }),
                }
            )

            const verifyResult = await verifyResponse.json()

            if (!verifyResponse.ok || !verifyResult.success) {
                setVerificationError(
                    verifyResult.message ||
                    'Claim was saved, but verification could not be completed.'
                )
                setSubmittedClaim({
                    ...createdClaim,
                    verificationResult: null,
                })
                return
            }

            // 3. Display verification result
            setSubmittedClaim({
                ...createdClaim,
                status: verifyResult.data.status,
                verificationResult: verifyResult.data,
            })
        } catch (err) {
            console.error('Claim submission error:', err)
            if (createdClaim) {
                setSubmittedClaim({
                    ...createdClaim,
                    verificationResult: null,
                })
                setVerificationError(err.message)
            } else {
                setError(err.message || 'Unable to connect to the MTrack AI backend.')
            }
        } finally {
            setLoading(false)
        }
    }

    // Add direct authenticated evidence to re-test verification
    const handleAddDirectEvidence = async (e) => {
        e.preventDefault()
        if (!submittedClaim?._id) return

        if (!evidenceExcerpt.trim()) {
            alert('Please provide an excerpt or citation from the document.')
            return
        }

        try {
            setAddingEvidence(true)

            const facts = []
            if (evidencePrevVal && Number.isFinite(Number(evidencePrevVal))) {
                facts.push({
                    metric,
                    period: previousPeriod.trim(),
                    value: Number(evidencePrevVal),
                    unit: evidenceUnit,
                    basis: 'Consolidated',
                })
            }

            if (evidenceCurrVal && Number.isFinite(Number(evidenceCurrVal))) {
                facts.push({
                    metric,
                    period: currentPeriod.trim(),
                    value: Number(evidenceCurrVal),
                    unit: evidenceUnit,
                    basis: 'Consolidated',
                })
            }

            const evidenceRes = await fetch(`${API_URL}/claims/${submittedClaim._id}/evidence`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify({
                    sourceName: evidenceSourceName,
                    sourceType: 'exchange_filing',
                    sourceAuthority: 'official_primary',
                    sourceUrl: evidenceSourceUrl.trim() || 'https://nsearchives.nseindia.com',
                    documentTitle: evidenceDocTitle.trim() || `${company || 'Company'} Financial Disclosures`,
                    publishedAt: new Date().toISOString(),
                    reportingPeriod: `${previousPeriod} - ${currentPeriod}`,
                    excerpt: evidenceExcerpt.trim(),
                    facts,
                }),
            })

            const evidenceData = await evidenceRes.json()
            if (!evidenceRes.ok || !evidenceData.success) {
                throw new Error(evidenceData.message || 'Failed to add evidence.')
            }

            // Re-verify immediately
            const verifyRes = await fetch(`${API_URL}/claims/${submittedClaim._id}/verify`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify({
                    claimDetails: {
                        company: company.trim(),
                        metric,
                        previousPeriod: previousPeriod.trim(),
                        currentPeriod: currentPeriod.trim(),
                        claimedGrowthPercent: Number(claimedGrowthPercent),
                        tolerancePercent: Number(tolerancePercent) || 0.5,
                    },
                }),
            })

            const verifyData = await verifyRes.json()
            if (verifyRes.ok && verifyData.success) {
                setSubmittedClaim((prev) => ({
                    ...prev,
                    status: verifyData.data.status,
                    verificationResult: verifyData.data,
                }))
                setShowAddEvidence(false)
            }
        } catch (err) {
            alert(err.message || 'Error updating evidence and re-verifying.')
        } finally {
            setAddingEvidence(false)
        }
    }

    const statusStyle = {
        Verified: 'bg-green-100 text-[#008F65] border-green-200',
        Contradicted: 'bg-red-100 text-[#C43D36] border-red-200',
        Unverified: 'bg-amber-100 text-[#A66A00] border-amber-200',
        Pending: 'bg-gray-100 text-gray-700 border-gray-200',
    }

    return (
        <div className="min-h-screen bg-[#EDF3EF] text-[#172B24]">
            {/* Header */}
            <header className="h-[72px] bg-white border-b border-[#DCE6DF] sticky top-0 z-30">
                <div className="max-w-7xl mx-auto h-full px-5 sm:px-8 flex items-center justify-between">
                    <Link to="/" className="cursor-pointer">
                        <MTrackLogo size="md" />
                    </Link>

                    <BackButton label="Back to Dashboard" fallbackUrl="/dashboard" />
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
                <div className="mb-8">
                    <p className="text-xs font-bold text-[#008F65] uppercase tracking-wider">
                        AI Claim Verification
                    </p>

                    <h1 className="text-3xl sm:text-4xl font-bold mt-2">
                        Verify before you believe.
                    </h1>

                    <p className="text-gray-600 mt-2 max-w-2xl leading-relaxed text-sm sm:text-base">
                        Submit a financial claim in natural language. MTrack AI extracts key metrics,
                        gathers official evidence, and runs deterministic verification with full transparency.
                    </p>
                </div>

                {/* Claim Input Form */}
                <section className="bg-white border border-[#DCE6DF] rounded-3xl p-5 sm:p-8 shadow-sm">
                    <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                        <h2 className="text-xl font-bold">
                            Submit Financial Claim
                        </h2>

                        <div className="flex flex-wrap items-center gap-2">
                            <span className="text-xs text-gray-400 font-medium hidden sm:inline">Try genuine case:</span>
                            {[
                                { label: 'TCS Revenue (+6.85%)', text: 'Tata Consultancy Services consolidated revenue grew by 6.85% in FY2024.' },
                                { label: 'Infosys Profit (+25% Rumor)', text: 'Infosys consolidated net profit jumped by 25% in FY2024.' },
                                { label: 'Reliance Gross (+2.59%)', text: 'Reliance Industries consolidated gross revenue grew by 2.59% in FY2024.' },
                            ].map((s, idx) => (
                                <button
                                    key={idx}
                                    type="button"
                                    onClick={() => {
                                        setClaim(s.text)
                                        extractDetails(s.text)
                                    }}
                                    className="rounded-lg border border-[#DCE6DF] bg-[#F5F8F6] px-2.5 py-1 text-xs font-semibold text-[#008F65] hover:bg-[#E2F0E8] hover:border-[#00A878] transition cursor-pointer"
                                >
                                    {s.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label
                                    htmlFor="claim"
                                    className="text-sm font-semibold text-[#172B24]"
                                >
                                    Claim Statement
                                </label>

                                <button
                                    type="button"
                                    onClick={() => extractDetails(claim)}
                                    disabled={extracting || claim.trim().length < 5}
                                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#008F65] hover:text-[#006F4F] disabled:opacity-50 cursor-pointer"
                                >
                                    {extracting ? (
                                        <span className="flex items-center gap-1">
                                            <span className="h-3 w-3 animate-spin rounded-full border-2 border-[#00A878] border-t-transparent" />
                                            Analyzing...
                                        </span>
                                    ) : (
                                        <>
                                            <SparklesIcon className="w-3.5 h-3.5" />
                                            <span>Extract Details with AI</span>
                                        </>
                                    )}
                                </button>
                            </div>

                            <textarea
                                id="claim"
                                value={claim}
                                onChange={(event) => setClaim(event.target.value)}
                                placeholder="Example: Tata Consultancy Services consolidated revenue grew by 6.85% in FY2024."
                                rows={4}
                                maxLength={2000}
                                required
                                className="w-full resize-y rounded-2xl border border-[#DCE6DF] bg-[#FAFCFA] p-4 text-sm outline-none focus:border-[#00A878] focus:bg-white focus:ring-2 focus:ring-[#00A878]/10 transition"
                            />

                            <div className="flex items-center justify-between mt-2 text-xs text-gray-400">
                                <span>
                                    {extractionSource && (
                                        <span className="inline-flex items-center gap-1.5 text-[#008F65] font-semibold bg-[#E2F0E8] px-2.5 py-1 rounded-lg border border-[#C5DFD0]">
                                            <CheckCircleIcon className="w-3.5 h-3.5" />
                                            Extracted via {extractionSource}
                                        </span>
                                    )}
                                </span>
                                <span>{claim.length}/2000</span>
                            </div>
                        </div>

                        {/* Additional Optional Inputs */}
                        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <div>
                                <label
                                    htmlFor="category"
                                    className="block text-sm font-semibold mb-2"
                                >
                                    Claim category
                                </label>

                                <select
                                    id="category"
                                    value={category}
                                    onChange={(event) => setCategory(event.target.value)}
                                    className="w-full rounded-xl border border-[#DCE6DF] bg-[#FAFCFA] px-4 py-3 text-sm outline-none focus:border-[#00A878]"
                                >
                                    <option>Company Financials</option>
                                    <option>Stock Market</option>
                                    <option>Corporate Announcements</option>
                                    <option>SEBI and Regulations</option>
                                    <option>Mutual Funds</option>
                                    <option>Other Financial Claims</option>
                                </select>
                            </div>

                            <div>
                                <label
                                    htmlFor="source"
                                    className="block text-sm font-semibold mb-2"
                                >
                                    Source link (optional)
                                </label>

                                <input
                                    id="source"
                                    type="url"
                                    value={source}
                                    onChange={(event) => setSource(event.target.value)}
                                    placeholder="https://example.com/article"
                                    className="w-full rounded-xl border border-[#DCE6DF] bg-[#FAFCFA] px-4 py-3 text-sm outline-none focus:border-[#00A878]"
                                />
                            </div>
                        </div>

                        {/* Extracted / Structured Numerical Growth Fields */}
                        <div className="mt-8 border-t border-[#DCE6DF] pt-7">
                            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                                <h3 className="font-bold text-base sm:text-lg">
                                    Structured Financial Details
                                </h3>
                                <span className="text-xs text-gray-500">
                                    Auto-populated from your claim text
                                </span>
                            </div>

                            <p className="text-xs sm:text-sm text-gray-500 mb-5">
                                Verified by deterministic mathematical calculation against official filings.
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">
                                        Company Name
                                    </label>
                                    <input
                                        type="text"
                                        value={company}
                                        onChange={(e) => setCompany(e.target.value)}
                                        placeholder="e.g. Reliance Industries"
                                        className="w-full rounded-xl border border-[#DCE6DF] bg-[#FAFCFA] px-3.5 py-2.5 text-sm outline-none focus:border-[#00A878]"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">
                                        Financial Metric
                                    </label>
                                    <select
                                        value={metric}
                                        onChange={(e) => setMetric(e.target.value)}
                                        className="w-full rounded-xl border border-[#DCE6DF] bg-[#FAFCFA] px-3.5 py-2.5 text-sm outline-none focus:border-[#00A878]"
                                    >
                                        <option>Revenue</option>
                                        <option>Net Profit</option>
                                        <option>Operating Profit</option>
                                        <option>EBITDA</option>
                                        <option>Earnings Per Share</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">
                                        Claimed Growth (%)
                                    </label>
                                    <input
                                        type="number"
                                        step="any"
                                        value={claimedGrowthPercent}
                                        onChange={(e) => setClaimedGrowthPercent(e.target.value)}
                                        placeholder="e.g. 15"
                                        className="w-full rounded-xl border border-[#DCE6DF] bg-[#FAFCFA] px-3.5 py-2.5 text-sm outline-none focus:border-[#00A878]"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">
                                        Baseline Period
                                    </label>
                                    <input
                                        type="text"
                                        value={previousPeriod}
                                        onChange={(e) => setPreviousPeriod(e.target.value)}
                                        placeholder="e.g. FY2025"
                                        className="w-full rounded-xl border border-[#DCE6DF] bg-[#FAFCFA] px-3.5 py-2.5 text-sm outline-none focus:border-[#00A878]"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">
                                        Target Period
                                    </label>
                                    <input
                                        type="text"
                                        value={currentPeriod}
                                        onChange={(e) => setCurrentPeriod(e.target.value)}
                                        placeholder="e.g. FY2026"
                                        className="w-full rounded-xl border border-[#DCE6DF] bg-[#FAFCFA] px-3.5 py-2.5 text-sm outline-none focus:border-[#00A878]"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">
                                        Allowed Tolerance (±%)
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        step="any"
                                        value={tolerancePercent}
                                        onChange={(e) => setTolerancePercent(e.target.value)}
                                        className="w-full rounded-xl border border-[#DCE6DF] bg-[#FAFCFA] px-3.5 py-2.5 text-sm outline-none focus:border-[#00A878]"
                                    />
                                </div>
                            </div>
                        </div>

                        {error && (
                            <div className="mt-5 rounded-xl bg-red-50 text-red-700 px-4 py-3 text-sm border border-red-200">
                                {error}
                            </div>
                        )}

                        <div className="mt-8 flex flex-wrap items-center gap-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="inline-flex items-center justify-center gap-3 rounded-xl bg-[#00A878] hover:bg-[#008F65] disabled:opacity-60 disabled:cursor-not-allowed text-white px-8 py-3.5 font-semibold text-sm transition shadow-sm"
                            >
                                {loading ? (
                                    <>
                                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                        <span>Retrieving Evidence & Verifying...</span>
                                    </>
                                ) : (
                                    <span>Verify Claim →</span>
                                )}
                            </button>

                            <button
                                type="button"
                                onClick={() => {
                                    setClaim('')
                                    setCompany('')
                                    setClaimedGrowthPercent('')
                                    setSubmittedClaim(null)
                                    setExtractionSource(null)
                                }}
                                className="rounded-xl border border-[#DCE6DF] bg-white px-5 py-3 text-sm font-semibold text-gray-600 hover:bg-gray-50"
                            >
                                Clear
                            </button>
                        </div>
                    </form>
                </section>

                {/* Submitted Claim & Verification Results */}
                {submittedClaim && (
                    <section className="mt-8 rounded-3xl border border-[#DCE6DF] bg-white p-5 sm:p-8 shadow-sm">
                        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E1E9E3] pb-6">
                            <div>
                                <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                                    Verification Result
                                </span>
                                <h2 className="text-xl sm:text-2xl font-bold text-[#172B24] mt-1">
                                    {submittedClaim.title}
                                </h2>
                            </div>

                            <span
                                className={`rounded-full px-4 py-1.5 text-sm font-bold border ${
                                    statusStyle[submittedClaim.status] ||
                                    statusStyle.Pending
                                }`}
                            >
                                {submittedClaim.status || 'Pending'}
                            </span>
                        </div>

                        {/* Transparent Explanation */}
                        {submittedClaim.verificationResult && (
                            <div className="mt-6 space-y-6">
                                <div className="rounded-2xl bg-[#F8FAF8] border border-[#E1E9E3] p-5 sm:p-6">
                                    <h3 className="font-bold text-sm text-[#172B24] uppercase tracking-wide">
                                        Executive Assessment
                                    </h3>
                                    <p className="mt-3 text-sm sm:text-base leading-relaxed text-gray-700">
                                        {submittedClaim.verificationResult.verification?.summary ||
                                            'Assessment completed.'}
                                    </p>
                                </div>

                                {/* Calculation Breakdown if available */}
                                {submittedClaim.verificationResult.verification?.calculation && (
                                    <div className="rounded-2xl border border-[#00A878]/30 bg-[#E2F0E8]/40 p-5">
                                        <h3 className="font-bold text-sm text-[#008F65] uppercase tracking-wide">
                                            Deterministic Math Verification
                                        </h3>

                                        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                                            <div className="bg-white rounded-xl p-3 border border-[#DCE6DF]">
                                                <p className="text-xs text-gray-500">
                                                    {submittedClaim.verificationResult.verification.calculation.previousPeriod}
                                                </p>
                                                <p className="text-base font-bold text-[#172B24] mt-1">
                                                    {submittedClaim.verificationResult.verification.calculation.previousValue}{' '}
                                                    <span className="text-xs font-normal">
                                                        {submittedClaim.verificationResult.verification.calculation.unit}
                                                    </span>
                                                </p>
                                            </div>

                                            <div className="bg-white rounded-xl p-3 border border-[#DCE6DF]">
                                                <p className="text-xs text-gray-500">
                                                    {submittedClaim.verificationResult.verification.calculation.currentPeriod}
                                                </p>
                                                <p className="text-base font-bold text-[#172B24] mt-1">
                                                    {submittedClaim.verificationResult.verification.calculation.currentValue}{' '}
                                                    <span className="text-xs font-normal">
                                                        {submittedClaim.verificationResult.verification.calculation.unit}
                                                    </span>
                                                </p>
                                            </div>

                                            <div className="bg-white rounded-xl p-3 border border-[#DCE6DF]">
                                                <p className="text-xs text-gray-500">Calculated Growth</p>
                                                <p className="text-base font-bold text-[#008F65] mt-1">
                                                    {submittedClaim.verificationResult.verification.calculation.actualGrowthPercent}%
                                                </p>
                                            </div>

                                            <div className="bg-white rounded-xl p-3 border border-[#DCE6DF]">
                                                <p className="text-xs text-gray-500">Claimed Growth</p>
                                                <p className="text-base font-bold text-[#172B24] mt-1">
                                                    {submittedClaim.verificationResult.verification.calculation.claimedGrowthPercent}%
                                                </p>
                                            </div>
                                        </div>

                                        <p className="text-xs text-gray-600 mt-4 text-center">
                                            Difference: {submittedClaim.verificationResult.verification.calculation.differencePercent}% (Allowed tolerance: ±{submittedClaim.verificationResult.verification.calculation.tolerancePercent}%)
                                        </p>
                                    </div>
                                )}

                                {/* Transparency Score & Limitations */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <div className="rounded-2xl border border-[#DCE6DF] p-5">
                                        <div className="flex items-center justify-between">
                                            <p className="text-sm font-bold text-[#172B24]">
                                                Evidence Transparency
                                            </p>
                                            <p className="text-2xl font-bold text-[#008F65]">
                                                {submittedClaim.verificationResult.verification?.transparencyScore ?? 0}/100
                                            </p>
                                        </div>

                                        <div className="mt-3 h-2.5 rounded-full bg-gray-100 overflow-hidden">
                                            <div
                                                className="h-full bg-[#00A878] rounded-full"
                                                style={{
                                                    width: `${Math.min(
                                                        100,
                                                        Math.max(
                                                            0,
                                                            submittedClaim.verificationResult.verification?.transparencyScore || 0
                                                        )
                                                    )}%`,
                                                }}
                                            />
                                        </div>

                                        <p className="mt-3 text-xs text-gray-500">
                                            Scores presence of official primary sources, verifiable URLs, and audited figures.
                                        </p>
                                    </div>

                                    <div className="rounded-2xl border border-[#F1DFBD] bg-[#FFFAF1] p-5">
                                        <p className="text-sm font-bold text-[#96600D]">
                                            Audit Limitations
                                        </p>

                                        <ul className="mt-2 space-y-1.5 text-xs sm:text-sm text-[#725B36]">
                                            {submittedClaim.verificationResult.verification?.limitations?.length > 0 ? (
                                                submittedClaim.verificationResult.verification.limitations.map(
                                                    (item, index) => (
                                                        <li key={index} className="flex gap-2">
                                                            <span>•</span>
                                                            <span>{item}</span>
                                                        </li>
                                                    )
                                                )
                                            ) : (
                                                <li>No limitations flagged for this calculation.</li>
                                            )}
                                        </ul>
                                    </div>
                                </div>

                                {/* Evidence Discovered & Associated */}
                                <div className="border-t border-[#E1E9E3] pt-6">
                                    <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                                        <div>
                                            <h3 className="font-bold text-base text-[#172B24]">
                                                Associated Official Documents ({submittedClaim.verificationResult.evidenceCount || 0})
                                            </h3>
                                            <p className="text-xs text-gray-500">
                                                Primary announcements and exchange filings linked to this claim
                                            </p>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => setShowAddEvidence(!showAddEvidence)}
                                            className="text-xs font-semibold text-[#008F65] bg-[#E2F0E8] px-3 py-1.5 rounded-lg hover:bg-[#d4eadc]"
                                        >
                                            {showAddEvidence ? 'Hide Direct Input' : '+ Add Document Figures'}
                                        </button>
                                    </div>

                                    {/* Optional Direct Evidence Input Form */}
                                    {showAddEvidence && (
                                        <form onSubmit={handleAddDirectEvidence} className="mb-6 rounded-2xl border border-[#DCE6DF] bg-[#F5F8F6] p-5 space-y-4">
                                            <p className="text-xs font-bold uppercase text-[#008F65]">
                                                Add Authenticated Financial Disclosure Figures
                                            </p>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-xs font-semibold text-gray-600 mb-1">
                                                        Source Name
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
                                                        Document Title / Filing Ref
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={evidenceDocTitle}
                                                        onChange={(e) => setEvidenceDocTitle(e.target.value)}
                                                        placeholder="Audited Annual Financial Results"
                                                        className="w-full rounded-lg border border-[#DCE6DF] bg-white px-3 py-2 text-xs"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-xs font-semibold text-gray-600 mb-1">
                                                        {previousPeriod} {metric} Value
                                                    </label>
                                                    <input
                                                        type="number"
                                                        step="any"
                                                        value={evidencePrevVal}
                                                        onChange={(e) => setEvidencePrevVal(e.target.value)}
                                                        placeholder="e.g. 225458"
                                                        className="w-full rounded-lg border border-[#DCE6DF] bg-white px-3 py-2 text-xs"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-xs font-semibold text-gray-600 mb-1">
                                                        {currentPeriod} {metric} Value
                                                    </label>
                                                    <input
                                                        type="number"
                                                        step="any"
                                                        value={evidenceCurrVal}
                                                        onChange={(e) => setEvidenceCurrVal(e.target.value)}
                                                        placeholder="e.g. 240893"
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
                                                    Document Excerpt / Note
                                                </label>
                                                <textarea
                                                    value={evidenceExcerpt}
                                                    onChange={(e) => setEvidenceExcerpt(e.target.value)}
                                                    rows={2}
                                                    placeholder="Audited statement excerpt confirming revenue figures..."
                                                    className="w-full rounded-lg border border-[#DCE6DF] bg-white px-3 py-2 text-xs"
                                                />
                                            </div>

                                            {verificationError && (
                                                <p className="text-xs text-amber-700 bg-amber-50 p-2.5 rounded-lg border border-amber-200">
                                                    {verificationError}
                                                </p>
                                            )}

                                            <button
                                                type="submit"
                                                disabled={addingEvidence}
                                                className="rounded-lg bg-[#00A878] text-white px-4 py-2 text-xs font-semibold hover:bg-[#008F65]"
                                            >
                                                {addingEvidence ? 'Saving & Re-verifying...' : 'Submit Evidence & Re-Verify'}
                                            </button>
                                        </form>
                                    )}

                                    {/* Evidence List */}
                                    {submittedClaim.verificationResult.evidence?.length > 0 ? (
                                        <div className="space-y-3">
                                            {submittedClaim.verificationResult.evidence.map((item, idx) => (
                                                <div
                                                    key={item.id || idx}
                                                    className="rounded-xl border border-[#E1E9E3] p-4 bg-white"
                                                >
                                                    <div className="flex flex-wrap items-center justify-between gap-2">
                                                        <h4 className="text-sm font-bold text-[#172B24]">
                                                            {item.documentTitle || item.sourceName}
                                                        </h4>
                                                        <span className="rounded-md bg-[#E2F0E8] px-2 py-0.5 text-[11px] font-semibold text-[#008F65]">
                                                            {item.sourceAuthority}
                                                        </span>
                                                    </div>

                                                    <p className="mt-2 text-xs text-gray-600 leading-relaxed">
                                                        {item.excerpt}
                                                    </p>

                                                    {item.sourceUrl && (
                                                        <a
                                                            href={item.sourceUrl}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-[#008F65] hover:text-[#006F4F]"
                                                        >
                                                            Open official source document ↗
                                                        </a>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="rounded-xl border border-dashed border-[#DCE6DF] p-6 text-center text-xs text-gray-500">
                                            No automated filing matches found for this entity in the live feed. You can attach source figures using the button above.
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-[#E1E9E3] pt-6">
                            <Link
                                to={`/claim/${submittedClaim._id}`}
                                className="rounded-xl bg-[#00A878] px-6 py-3 text-sm font-semibold text-white hover:bg-[#008F65] transition"
                            >
                                View Detailed Audit Page →
                            </Link>

                            <Link
                                to="/history"
                                className="rounded-xl border border-[#DCE6DF] px-6 py-3 text-sm font-semibold text-gray-700 hover:bg-[#F4F7F5] transition"
                            >
                                View Claim History
                            </Link>

                            <button
                                type="button"
                                onClick={() => {
                                    setSubmittedClaim(null)
                                    setClaim('')
                                    setCompany('')
                                    setClaimedGrowthPercent('')
                                }}
                                className="text-sm font-semibold text-gray-500 hover:text-[#172B24] ml-auto"
                            >
                                + Verify Another Claim
                            </button>
                        </div>
                    </section>
                )}

                <p className="text-center text-xs text-gray-400 mt-12">
                    MTrack AI provides evidence-based claim verification for retail investors. Not financial advice.
                </p>
            </main>
        </div>
    )
}

export default VerifyClaims
