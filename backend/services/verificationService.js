
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
        (item) => item.publishedAt instanceof Date ||
            Boolean(item.publishedAt)
    )

    if (hasOfficialSource) score += 35
    else if (hasSecondarySource) score += 15

    if (hasComparableFacts) score += 35
    if (hasSourceUrl) score += 10
    if (hasPublicationDate) score += 10
    if (evidence.length >= 2) score += 10

    return Math.min(score, 100)
}

// Verify a numerical growth claim using two comparable financial figures.
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
            summary: 'No evidence was provided for comparison.',
            transparencyScore: 0,
            limitations: ['No source documents or financial figures were available.'],
            calculation: null,
        }
    }

    const facts = evidence.flatMap((item) => {
        if (!Array.isArray(item.facts)) return []

        return item.facts.map((fact) => {
            const raw = typeof fact?.toObject === 'function' ? fact.toObject() : fact
            return {
                metric: raw?.metric,
                value: raw?.value,
                unit: raw?.unit,
                period: raw?.period,
                basis: raw?.basis,
                sourceAuthority: item.sourceAuthority,
                sourceName: item.sourceName,
                sourceUrl: item.sourceUrl,
            }
        })
    })

    const matchingFacts = facts.filter((fact) =>
        fact.metric?.trim().toLowerCase() === metric.trim().toLowerCase()
    )

    const prevPeriodNorm = (previousPeriod || '').trim().toLowerCase()
    const currPeriodNorm = (currentPeriod || '').trim().toLowerCase()

    const previousFacts = matchingFacts.filter(
        (fact) => (fact.period || '').trim().toLowerCase() === prevPeriodNorm
    )

    const currentFacts = matchingFacts.filter(
        (fact) => (fact.period || '').trim().toLowerCase() === currPeriodNorm
    )

    if (previousFacts.length !== 1 || currentFacts.length !== 1) {
        return {
            status: 'Unverified',
            method: 'financial_growth_comparison',
            summary: 'The required financial figures could not be identified unambiguously.',
            transparencyScore: 0,
            limitations: [
                `Expected exactly one ${metric} figure for ${previousPeriod} and one for ${currentPeriod}.`,
                'Missing or duplicate figures must be resolved before verification.',
            ],
            calculation: null,
        }
    }

    const previous = previousFacts[0]
    const current = currentFacts[0]

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
                ...(!sameUnit ? ['The financial figures use different units.'] : []),
                ...(!sameBasis ? ['The financial figures use different accounting bases.'] : []),
                ...(!hasOfficialSource ? ['Both figures must come from official primary sources for this verification rule.'] : []),
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
            ? `The submitted growth figure of ${claimedGrowthPercent}% is consistent with the calculated growth of ${actualGrowthPercent}%.`
            : `The submitted growth figure of ${claimedGrowthPercent}% does not match the calculated growth of ${actualGrowthPercent}%.`

    return {
        status,
        method: 'financial_growth_comparison',
        summary,
        transparencyScore: calculateTransparencyScore(evidence, true),
        limitations,
        calculation: {
            metric,
            previousPeriod,
            currentPeriod,
            previousValue: previous.value,
            currentValue: current.value,
            unit: previous.unit || '',
            claimedGrowthPercent,
            actualGrowthPercent,
            differencePercent,
            tolerancePercent,
        },
    }
}
