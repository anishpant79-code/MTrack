import { normalizeMetric, normalizePeriod } from './evidenceExtractionService.js'

const ALLOWED_AUTHORITIES = [
    'official_primary',
    'reputable_secondary',
    'other',
]

const round = (value, decimals = 2) => {
    const factor = 10 ** decimals
    return Math.round((value + Number.EPSILON) * factor) / factor
}

const calculateTransparencyScore = (evidence, hasComparableFacts) => {
    let score = 0

    const hasOfficialSource = evidence.some(
        (item) => item.sourceAuthority === 'official_primary'
    )

    const hasSecondarySource = evidence.some(
        (item) => item.sourceAuthority === 'reputable_secondary'
    )

    const hasSourceUrl = evidence.some(
        (item) => Boolean(item.sourceUrl)
    )

    const hasPublicationDate = evidence.some(
        (item) => item.publishedAt instanceof Date || Boolean(item.publishedAt)
    )

    if (hasOfficialSource) score += 35
    else if (hasSecondarySource) score += 15

    if (hasComparableFacts) score += 35
    if (hasSourceUrl) score += 10
    if (hasPublicationDate) score += 10
    if (evidence.length >= 2) score += 10

    return Math.min(score, 100)
}

// Verify a numerical growth claim using two comparable financial figures
export const verifyFinancialGrowth = ({
    claimDetails,
    evidence = [],
}) => {
    const {
        metric,
        previousPeriod,
        currentPeriod,
        claimedGrowthPercent,
        tolerancePercent = 0.5,
    } = claimDetails || {}

    const limitations = []

    if (
        !metric ||
        !previousPeriod ||
        !currentPeriod ||
        !Number.isFinite(claimedGrowthPercent) ||
        !Number.isFinite(tolerancePercent) ||
        tolerancePercent < 0
    ) {
        return {
            status: 'Unverified',
            method: 'financial_growth_comparison',
            summary: 'The claim does not contain enough structured information for numerical verification.',
            transparencyScore: 0,
            limitations: [
                'Metric, reporting periods, claimed growth percentage and a valid tolerance are required.',
            ],
            calculation: null,
        }
    }

    if (!Array.isArray(evidence) || evidence.length === 0) {
        return {
            status: 'Unverified',
            method: 'financial_growth_comparison',
            summary: 'No official primary evidence or statutory filings were available for comparison.',
            transparencyScore: 0,
            limitations: ['No source documents or financial figures were available.'],
            calculation: null,
        }
    }

    // Extract all facts from evidence documents, converting Mongoose subdocuments safely
    const facts = evidence.flatMap((item) => {
        if (!Array.isArray(item.facts)) return []

        return item.facts.map((fact) => {
            const raw = typeof fact?.toObject === 'function' ? fact.toObject() : fact
            return {
                metric: raw?.metric,
                value: raw?.value,
                unit: raw?.unit || '₹ Crore',
                period: raw?.period,
                basis: raw?.basis || 'Consolidated',
                sourceAuthority: item.sourceAuthority,
                sourceName: item.sourceName,
                sourceUrl: item.sourceUrl,
            }
        })
    })

    const targetMetricNorm = normalizeMetric(metric).toLowerCase()

    // Match facts by metric (supporting common metric equivalencies)
    const matchingFacts = facts.filter((fact) => {
        const factMetricNorm = normalizeMetric(fact.metric).toLowerCase()
        return factMetricNorm === targetMetricNorm
    })

    const prevPeriodNorm = normalizePeriod(previousPeriod).toLowerCase()
    const currPeriodNorm = normalizePeriod(currentPeriod).toLowerCase()

    let previousCandidates = matchingFacts.filter(
        (fact) => normalizePeriod(fact.period).toLowerCase() === prevPeriodNorm
    )

    let currentCandidates = matchingFacts.filter(
        (fact) => normalizePeriod(fact.period).toLowerCase() === currPeriodNorm
    )

    if (previousCandidates.length === 0 || currentCandidates.length === 0) {
        return {
            status: 'Unverified',
            method: 'financial_growth_comparison',
            summary: `Statutory financial figures for ${metric} (${previousPeriod} or ${currentPeriod}) could not be confirmed in available disclosures.`,
            transparencyScore: calculateTransparencyScore(evidence, false),
            limitations: [
                `No official figures found matching metric "${metric}" for baseline period ${previousPeriod} or target period ${currentPeriod}.`,
                'MTrack AI does not label claims false solely due to absent data.',
            ],
            calculation: null,
        }
    }

    // If multiple candidates exist, prefer Consolidated accounting basis (standard in India for listed groups)
    if (previousCandidates.some((f) => (f.basis || '').toLowerCase() === 'consolidated')) {
        previousCandidates = previousCandidates.filter((f) => (f.basis || '').toLowerCase() === 'consolidated')
    }
    if (currentCandidates.some((f) => (f.basis || '').toLowerCase() === 'consolidated')) {
        currentCandidates = currentCandidates.filter((f) => (f.basis || '').toLowerCase() === 'consolidated')
    }

    // Deduplicate corroborating official primary figures with identical values
    const uniquePrevValues = [...new Set(previousCandidates.map((f) => f.value))]
    const uniqueCurrValues = [...new Set(currentCandidates.map((f) => f.value))]

    if (uniquePrevValues.length > 1 || uniqueCurrValues.length > 1) {
        return {
            status: 'Unverified',
            method: 'financial_growth_comparison',
            summary: 'Conflicting financial figures were found across disclosures for the same period and metric.',
            transparencyScore: calculateTransparencyScore(evidence, false),
            limitations: [
                `Multiple conflicting figures found: previous period values [${uniquePrevValues.join(', ')}], current period values [${uniqueCurrValues.join(', ')}].`,
                'Discrepancy must be resolved through revised official exchange filings.',
            ],
            calculation: null,
        }
    }

    const previous = previousCandidates[0]
    const current = currentCandidates[0]

    const sameUnit =
        (previous.unit || '').trim().toLowerCase() ===
        (current.unit || '').trim().toLowerCase()

    const sameBasis =
        (previous.basis || '').trim().toLowerCase() ===
        (current.basis || '').trim().toLowerCase()

    const hasOfficialSource = [
        previous.sourceAuthority,
        current.sourceAuthority,
    ].every((authority) => authority === 'official_primary')

    if (
        !sameUnit ||
        !sameBasis ||
        !hasOfficialSource ||
        !ALLOWED_AUTHORITIES.includes(previous.sourceAuthority) ||
        !ALLOWED_AUTHORITIES.includes(current.sourceAuthority)
    ) {
        return {
            status: 'Unverified',
            method: 'financial_growth_comparison',
            summary: 'The financial figures are not sufficiently comparable or authoritative.',
            transparencyScore: calculateTransparencyScore(evidence, false),
            limitations: [
                ...(!sameUnit ? ['The financial figures use different reporting units.'] : []),
                ...(!sameBasis ? ['The financial figures use different accounting bases.'] : []),
                ...(!hasOfficialSource ? ['Both figures must come from official primary sources (BSE/NSE filings).'] : []),
            ],
            calculation: null,
        }
    }

    if (
        !Number.isFinite(previous.value) ||
        !Number.isFinite(current.value) ||
        previous.value <= 0 ||
        current.value < 0
    ) {
        return {
            status: 'Unverified',
            method: 'financial_growth_comparison',
            summary: 'The financial figures are invalid for a growth calculation.',
            transparencyScore: calculateTransparencyScore(evidence, false),
            limitations: [
                'The previous value must be greater than zero and both values must be valid numbers.',
            ],
            calculation: null,
        }
    }

    const actualGrowthPercent = round(
        ((current.value - previous.value) / previous.value) * 100
    )

    const differencePercent = round(
        Math.abs(actualGrowthPercent - claimedGrowthPercent)
    )

    const status =
        differencePercent <= tolerancePercent
            ? 'Verified'
            : 'Contradicted'

    const summary =
        status === 'Verified'
            ? `The submitted growth figure of ${claimedGrowthPercent}% is consistent with the calculated growth of ${actualGrowthPercent}% within ±${tolerancePercent}% tolerance.`
            : `The submitted growth figure of ${claimedGrowthPercent}% is contradicted by official statutory disclosures (calculated growth is ${actualGrowthPercent}%, discrepancy: ${differencePercent}%).`

    return {
        status,
        method: 'financial_growth_comparison',
        summary,
        transparencyScore: calculateTransparencyScore(evidence, true),
        limitations,
        calculation: {
            metric,
            previousPeriod: previous.period || previousPeriod,
            currentPeriod: current.period || currentPeriod,
            previousValue: previous.value,
            currentValue: current.value,
            unit: previous.unit || '₹ Crore',
            claimedGrowthPercent,
            actualGrowthPercent,
            differencePercent,
            tolerancePercent,
        },
    }
}
