import { GoogleGenAI, Type } from '@google/genai'

const KNOWN_COMPANIES = [
    'Reliance Industries Limited',
    'Reliance Industries',
    'Reliance',
    'Tata Consultancy Services Limited',
    'Tata Consultancy Services',
    'TCS',
    'Infosys Limited',
    'Infosys',
    'HDFC Bank Limited',
    'HDFC Bank',
    'ICICI Bank Limited',
    'ICICI Bank',
    'State Bank of India',
    'SBI',
    'Wipro Limited',
    'Wipro',
    'ITC Limited',
    'ITC',
    'Bharti Airtel Limited',
    'Bharti Airtel',
    'Larsen & Toubro Limited',
    'Larsen & Toubro',
    'L&T',
    'Tata Motors Limited',
    'Tata Motors',
    'Maruti Suzuki India Limited',
    'Maruti Suzuki',
    'Hindustan Unilever Limited',
    'Hindustan Unilever',
    'HUL',
    'Adani Enterprises Limited',
    'Adani Enterprises',
    'Shalimar Paints Limited',
    'Shalimar Paints',
    'Gabriel India Limited',
    'Gabriel India',
]

export const isGeminiConfigured = () => {
    return Boolean(
        process.env.GEMINI_API_KEY &&
        process.env.GEMINI_API_KEY.trim() !== '' &&
        process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here'
    )
}

// Fallback rule-based extractor
export const deterministicExtractClaimDetails = (claimText = '') => {
    const text = (claimText || '').trim()

    // 1. Company extraction
    let company = ''
    for (const known of KNOWN_COMPANIES) {
        const regex = new RegExp(`\\b${known.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i')
        if (regex.test(text)) {
            company = known
            break
        }
    }

    if (!company) {
        const companyMatch = text.match(/^([A-Z][A-Za-z0-9&.\s]{2,40}?)(?:'s|\s+revenue|\s+net profit|\s+profit|\s+ebitda|\s+sales|\s+reported|\s+q[1-4]|\s+fy)/i)
        if (companyMatch) {
            company = companyMatch[1].trim()
        }
    }

    // 2. Metric extraction
    let metric = 'Revenue'
    if (/\b(?:net profit|pat|net income|profit after tax)\b/i.test(text)) {
        metric = 'Net Profit'
    } else if (/\b(?:operating profit|ebit)\b/i.test(text)) {
        metric = 'Operating Profit'
    } else if (/\b(?:ebitda|operating margin)\b/i.test(text)) {
        metric = 'EBITDA'
    } else if (/\b(?:eps|earnings per share)\b/i.test(text)) {
        metric = 'Earnings Per Share'
    } else if (/\b(?:revenue|sales|turnover|topline)\b/i.test(text)) {
        metric = 'Revenue'
    }

    // 3. Claimed growth % extraction
    let claimedGrowthPercent = null
    const growthMatch =
        text.match(/(?:increased|grew|jumped|rose|surged|up|down|declined|fell|dropped)\s*(?:by\s*)?([+-]?\d+(?:\.\d+)?)\s*%/i) ||
        text.match(/([+-]?\d+(?:\.\d+)?)\s*%\s*(?:growth|increase|jump|rise|surge|decline|drop|fall)/i) ||
        text.match(/([+-]?\d+(?:\.\d+)?)\s*%/i)

    if (growthMatch) {
        let val = parseFloat(growthMatch[1])
        if (/\b(?:down|declined|fell|dropped|decreased)\b/i.test(text) && val > 0) {
            val = -val
        }
        claimedGrowthPercent = val
    }

    // 4. Period extraction
    let currentPeriod = 'FY2026'
    let previousPeriod = 'FY2025'

    const fyMatches = text.match(/FY\s*(20\d{2}|\d{2})/gi)
    const quarterMatches = text.match(/Q[1-4]\s*(?:FY)?\s*(?:20\d{2}|\d{2})?/gi)

    if (fyMatches && fyMatches.length >= 2) {
        const cleanPeriods = fyMatches.map(p => p.toUpperCase().replace(/\s+/g, ''))
        previousPeriod = cleanPeriods[0]
        currentPeriod = cleanPeriods[1]
    } else if (fyMatches && fyMatches.length === 1) {
        const raw = fyMatches[0].toUpperCase().replace(/\s+/g, '')
        const yearMatch = raw.match(/\d+/)
        if (yearMatch) {
            let year = parseInt(yearMatch[0], 10)
            if (year < 100) year += 2000
            currentPeriod = `FY${year}`
            previousPeriod = `FY${year - 1}`
        }
    } else if (quarterMatches && quarterMatches.length > 0) {
        currentPeriod = quarterMatches[0].toUpperCase().replace(/\s+/g, ' ')
        previousPeriod = 'Previous Quarter'
    }

    // 5. Category
    let category = 'Company Financials'
    if (/\b(?:sebi|regulation|circular|penalty|probe|compliance|order)\b/i.test(text)) {
        category = 'SEBI and Regulations'
    } else if (/\b(?:stock|share|market|nifty|sensex|bull|bear|dividend)\b/i.test(text)) {
        category = 'Stock Market'
    } else if (/\b(?:board meeting|merger|acquisition|demerger|announcement)\b/i.test(text)) {
        category = 'Corporate Announcements'
    } else if (/\b(?:mutual fund|nav|amc|sip)\b/i.test(text)) {
        category = 'Mutual Funds'
    }

    return {
        company: company || 'Specified Company',
        metric,
        previousPeriod,
        currentPeriod,
        claimedGrowthPercent: claimedGrowthPercent !== null ? claimedGrowthPercent : 15,
        tolerancePercent: 0.5,
        category,
        extractionSource: 'rule_engine',
    }
}

// Extract structured entities using Gemini with automatic fallback
export const extractClaimDetailsWithGemini = async (claimText) => {
    if (!isGeminiConfigured()) {
        return deterministicExtractClaimDetails(claimText)
    }

    try {
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })

        const response = await ai.models.generateContent({
            model: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
            contents: `Analyze this financial claim submitted by a retail investor and extract structured entities:
Claim: "${claimText}"

Extract:
1. company: The target company or entity name.
2. metric: Financial metric (Revenue, Net Profit, Operating Profit, EBITDA, Earnings Per Share, or other).
3. previousPeriod: The baseline reporting period (e.g. FY2025, Q1 FY25). If only current period is mentioned, infer the immediately preceding fiscal period.
4. currentPeriod: The reported or claimed period (e.g. FY2026, Q2 FY26).
5. claimedGrowthPercent: The numeric percentage growth, increase, or change claimed (as a float).
6. tolerancePercent: Standard numerical comparison tolerance (default 0.5).
7. category: One of "Company Financials", "Stock Market", "Corporate Announcements", "SEBI and Regulations", "Mutual Funds", "Other Financial Claims".`,
            config: {
                responseMimeType: 'application/json',
                responseJsonSchema: {
                    type: Type.OBJECT,
                    properties: {
                        company: { type: Type.STRING, description: 'Company name' },
                        metric: { type: Type.STRING, description: 'Financial metric' },
                        previousPeriod: { type: Type.STRING, description: 'Baseline financial period' },
                        currentPeriod: { type: Type.STRING, description: 'Target financial period' },
                        claimedGrowthPercent: { type: Type.NUMBER, description: 'Claimed percentage growth' },
                        tolerancePercent: { type: Type.NUMBER, description: 'Allowed tolerance percentage' },
                        category: { type: Type.STRING, description: 'Claim category' },
                    },
                    required: ['company', 'metric', 'previousPeriod', 'currentPeriod', 'claimedGrowthPercent'],
                },
            },
        })

        if (response.text) {
            const parsed = JSON.parse(response.text)
            return {
                company: parsed.company || 'Specified Company',
                metric: parsed.metric || 'Revenue',
                previousPeriod: parsed.previousPeriod || 'FY2025',
                currentPeriod: parsed.currentPeriod || 'FY2026',
                claimedGrowthPercent: typeof parsed.claimedGrowthPercent === 'number' ? parsed.claimedGrowthPercent : 15,
                tolerancePercent: typeof parsed.tolerancePercent === 'number' ? parsed.tolerancePercent : 0.5,
                category: parsed.category || 'Company Financials',
                extractionSource: 'gemini_ai',
            }
        }
    } catch (error) {
        console.warn('Gemini entity extraction fallback to rule engine:', error.message)
    }

    return deterministicExtractClaimDetails(claimText)
}

// Generate an understandable explanation of deterministic verification result
export const explainVerificationResult = async ({
    claimTitle,
    claimDetails,
    status,
    calculation,
    limitations = [],
    evidence = [],
}) => {
    const company = claimDetails?.company || 'The company'
    const metric = claimDetails?.metric || 'metric'
    const claimedGrowth = claimDetails?.claimedGrowthPercent

    // If Gemini is configured, generate natural-language narrative
    if (isGeminiConfigured()) {
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })

            const prompt = `You are the MTrack AI verification explainer.
Explain the following verification assessment clearly and transparently for a retail investor.
STRICT RULES:
- You must NOT change or question the status (${status}).
- You must NOT fabricate numbers or facts.
- Explain deterministically based ONLY on the calculation and limitations provided.
- Keep the explanation within 2 to 3 clear, objective sentences.

Claim: "${claimTitle}"
Company: ${company}
Metric: ${metric}
Claimed Growth: ${claimedGrowth}%
Deterministic Status: ${status}
Calculation: ${calculation ? JSON.stringify(calculation) : 'None (Insufficient figures in evidence)'}
Limitations: ${JSON.stringify(limitations)}
Evidence Count: ${evidence.length}`

            const response = await ai.models.generateContent({
                model: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
                contents: prompt,
            })

            if (response.text && response.text.trim()) {
                return response.text.trim()
            }
        } catch (error) {
            console.warn('Gemini explanation fallback to template:', error.message)
        }
    }

    // Deterministic explanation fallback
    if (status === 'Verified' && calculation) {
        return `The claim that ${company}'s ${metric} grew by ${calculation.claimedGrowthPercent}% is Verified. Official evidence demonstrates ${metric} increased from ${calculation.previousValue} ${calculation.unit || ''} (${calculation.previousPeriod}) to ${calculation.currentValue} ${calculation.unit || ''} (${calculation.currentPeriod}), yielding an actual growth of ${calculation.actualGrowthPercent}%, which falls within the permitted tolerance of ±${calculation.tolerancePercent}%.`
    }

    if (status === 'Contradicted' && calculation) {
        return `The claim that ${company}'s ${metric} grew by ${calculation.claimedGrowthPercent}% is Contradicted by official evidence. The verified calculation shows ${metric} changed from ${calculation.previousValue} ${calculation.unit || ''} (${calculation.previousPeriod}) to ${calculation.currentValue} ${calculation.unit || ''} (${calculation.currentPeriod}), representing actual growth of ${calculation.actualGrowthPercent}%—a discrepancy of ${calculation.differencePercent}% from the claim.`
    }

    if (status === 'Unverified') {
        const missingText = limitations.length > 0 ? limitations.join(' ') : 'Missing official audited figures for the comparison periods.'
        return `The claim is Unverified because authoritative primary disclosures for ${company} covering ${claimDetails?.previousPeriod || 'baseline'} and ${claimDetails?.currentPeriod || 'target'} could not be unambiguously confirmed. ${missingText} MTrack AI never labels claims false solely due to absent data.`
    }

    return `The claim is currently Pending evidence gathering and authentication.`
}
