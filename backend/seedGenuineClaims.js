import mongoose from 'mongoose'
import dotenv from 'dotenv'
import Claim from './models/Claim.js'
import Evidence from './models/Evidence.js'

dotenv.config()

/**
 * seedGenuineClaims - Seeds authentic, audited corporate financial claims
 * with genuine statutory disclosures from BSE/NSE filings for live hackathon presentation.
 */
async function seedGenuineClaims() {
    try {
        console.log('Connecting to MongoDB Atlas...')
        await mongoose.connect(process.env.MONGODB_URI)
        console.log('MongoDB Connected successfully.')

        const genuineClaims = [
            {
                title: 'Tata Consultancy Services consolidated revenue grew by 6.85% in FY2024.',
                category: 'Company Financials',
                source: 'BSE / NSE Corporate Disclosures — Audited Annual Financial Report FY2024',
                status: 'Verified',
                isSaved: true,
                user: null,
                extractedDetails: {
                    company: 'Tata Consultancy Services',
                    metric: 'Revenue',
                    previousPeriod: 'FY2023',
                    currentPeriod: 'FY2024',
                    claimedGrowthPercent: 6.85,
                    tolerancePercent: 0.5,
                },
                verification: {
                    method: 'financial_growth_comparison',
                    summary: 'The claim is consistent with official audited consolidated financial disclosures within a ±0.5% tolerance.',
                    aiExplanation: 'Audited consolidated financial statements filed with BSE and NSE confirm that TCS revenue from operations grew from ₹225,458 crore in FY2023 to ₹240,893 crore in FY2024 (+6.85% year-on-year growth).',
                    transparencyScore: 100,
                    checkedAt: new Date(),
                    limitations: [],
                    inputs: {
                        metric: 'Revenue',
                        previousPeriod: 'FY2023',
                        currentPeriod: 'FY2024',
                        previousValue: 225458,
                        currentValue: 240893,
                        unit: '₹ Crore',
                        claimedGrowthPercent: 6.85,
                        actualGrowthPercent: 6.85,
                        differencePercent: 0,
                        tolerancePercent: 0.5,
                    },
                },
                evidenceData: {
                    sourceName: 'TCS Integrated Annual Report FY2023-24',
                    sourceAuthority: 'official_primary',
                    sourceType: 'exchange_filing',
                    documentTitle: 'Audited Consolidated Financial Statements (Ind AS) - Note 22: Revenue from Operations',
                    sourceUrl: 'https://www.bseindia.com/corporates/ann.html',
                    excerpt: 'Revenue from operations for the year ended March 31, 2024 was ₹240,893 crore compared to ₹225,458 crore for the year ended March 31, 2023, representing year-on-year growth of 6.85%.',
                    facts: [
                        { metric: 'Revenue', value: 225458, unit: '₹ Crore', period: 'FY2023', basis: 'Consolidated' },
                        { metric: 'Revenue', value: 240893, unit: '₹ Crore', period: 'FY2024', basis: 'Consolidated' },
                    ],
                    stance: 'supports',
                },
            },
            {
                title: 'Infosys consolidated net profit jumped by 25% in FY2024.',
                category: 'Company Financials',
                source: 'Market Rumor / Unverified Social Media Analysis',
                status: 'Contradicted',
                isSaved: true,
                user: null,
                extractedDetails: {
                    company: 'Infosys',
                    metric: 'Net Profit',
                    previousPeriod: 'FY2023',
                    currentPeriod: 'FY2024',
                    claimedGrowthPercent: 25,
                    tolerancePercent: 0.5,
                },
                verification: {
                    method: 'financial_growth_comparison',
                    summary: 'Audited statutory filings report actual net profit growth of +8.87%, which contradicts the claimed 25.00% surge (discrepancy of 16.13% exceeds ±0.5% tolerance).',
                    aiExplanation: 'The claim asserts a 25% surge in net profit. However, official audited accounts certified by statutory auditors indicate net profit grew from ₹24,095 crore to ₹26,233 crore (+8.87%), contradicting the claim.',
                    transparencyScore: 90,
                    checkedAt: new Date(),
                    limitations: [
                        'Calculated against full-year consolidated audited net profit (PAT).',
                    ],
                    inputs: {
                        metric: 'Net Profit',
                        previousPeriod: 'FY2023',
                        currentPeriod: 'FY2024',
                        previousValue: 24095,
                        currentValue: 26233,
                        unit: '₹ Crore',
                        claimedGrowthPercent: 25,
                        actualGrowthPercent: 8.87,
                        differencePercent: 16.13,
                        tolerancePercent: 0.5,
                    },
                },
                evidenceData: {
                    sourceName: 'Infosys Annual Report 2023-24 / BSE Regulatory Filing',
                    sourceAuthority: 'official_primary',
                    sourceType: 'company_report',
                    documentTitle: 'Audited Consolidated Statement of Profit and Loss for the year ended March 31, 2024',
                    sourceUrl: 'https://www.bseindia.com',
                    excerpt: 'Consolidated profit for the period ended March 31, 2024 was ₹26,233 crore as against ₹24,095 crore for the previous year, reflecting actual growth of 8.87%.',
                    facts: [
                        { metric: 'Net Profit', value: 24095, unit: '₹ Crore', period: 'FY2023', basis: 'Consolidated' },
                        { metric: 'Net Profit', value: 26233, unit: '₹ Crore', period: 'FY2024', basis: 'Consolidated' },
                    ],
                    stance: 'contradicts',
                },
            },
            {
                title: 'Reliance Industries consolidated gross revenue grew by 2.59% in FY2024.',
                category: 'Company Financials',
                source: 'Corporate Press Release & Earnings Summary',
                status: 'Verified',
                isSaved: false,
                user: null,
                extractedDetails: {
                    company: 'Reliance Industries',
                    metric: 'Revenue',
                    previousPeriod: 'FY2023',
                    currentPeriod: 'FY2024',
                    claimedGrowthPercent: 2.59,
                    tolerancePercent: 0.5,
                },
                verification: {
                    method: 'financial_growth_comparison',
                    summary: 'Audited consolidated financial statements confirm gross revenue reached ₹1,000,122 crore vs ₹974,864 crore (+2.59%), verifying the claim within tolerance.',
                    aiExplanation: 'Audited financial statements show gross turnover crossed the ₹10 lakh crore threshold, reaching ₹1,000,122 crore in FY2023-24 versus ₹974,864 crore in FY2022-23 (+2.59%).',
                    transparencyScore: 100,
                    checkedAt: new Date(),
                    limitations: [],
                    inputs: {
                        metric: 'Revenue',
                        previousPeriod: 'FY2023',
                        currentPeriod: 'FY2024',
                        previousValue: 974864,
                        currentValue: 1000122,
                        unit: '₹ Crore',
                        claimedGrowthPercent: 2.59,
                        actualGrowthPercent: 2.59,
                        differencePercent: 0,
                        tolerancePercent: 0.5,
                    },
                },
                evidenceData: {
                    sourceName: 'Reliance Industries Integrated Annual Report 2023-24',
                    sourceAuthority: 'official_primary',
                    sourceType: 'exchange_filing',
                    documentTitle: 'Audited Consolidated Financial Statements - Value of Sales and Services (Gross)',
                    sourceUrl: 'https://www.nseindia.com',
                    excerpt: 'Gross Value of Sales & Services for FY 2023-24 was ₹1,000,122 crore, up 2.59% compared to ₹974,864 crore in FY 2022-23.',
                    facts: [
                        { metric: 'Revenue', value: 974864, unit: '₹ Crore', period: 'FY2023', basis: 'Consolidated' },
                        { metric: 'Revenue', value: 1000122, unit: '₹ Crore', period: 'FY2024', basis: 'Consolidated' },
                    ],
                    stance: 'supports',
                },
            },
            {
                title: 'Tata Motors electric commercial vehicle deliveries will increase by 45% next financial year.',
                category: 'Corporate Announcements',
                source: 'Industry Commentary & Forward Outlook',
                status: 'Unverified',
                isSaved: false,
                user: null,
                extractedDetails: {
                    company: 'Tata Motors',
                    metric: 'Deliveries',
                    previousPeriod: 'FY2024',
                    currentPeriod: 'FY2025',
                    claimedGrowthPercent: 45,
                    tolerancePercent: 0.5,
                },
                verification: {
                    method: 'financial_growth_comparison',
                    summary: 'This claim is a forward-looking operational projection. In accordance with evidence-based standards, forward statements cannot be marked Verified without concluded audited statutory disclosures.',
                    aiExplanation: 'MTrack AI does not label claims false merely due to absent future figures. Because future reporting periods cannot have concluded statutory audits, this claim remains transparently classified as Unverified.',
                    transparencyScore: 0,
                    checkedAt: new Date(),
                    limitations: [
                        'Forward-looking projection without concluded statutory audit disclosures.',
                        'No comparative historical baseline available for future reporting periods.',
                    ],
                    inputs: null,
                },
                evidenceData: null,
            },
        ]

        for (const item of genuineClaims) {
            const { evidenceData, ...claimFields } = item
            const existing = await Claim.findOne({ title: claimFields.title })

            if (existing) {
                console.log(`Claim already exists: "${existing.title.slice(0, 45)}..."`)
                continue
            }

            const claim = await Claim.create(claimFields)
            console.log(`Created Claim: "${claim.title.slice(0, 45)}..." (ID: ${claim._id})`)

            if (evidenceData) {
                const evidence = await Evidence.create({
                    claim: claim._id,
                    ...evidenceData,
                })
                claim.evidence.push(evidence._id)
                await claim.save()
                console.log(`  -> Attached Evidence ID: ${evidence._id} (${evidence.sourceName})`)
            }
        }

        console.log('Seeding completed successfully.')
        await mongoose.disconnect()
        process.exit(0)
    } catch (err) {
        console.error('Seeding error:', err.message)
        process.exit(1)
    }
}

seedGenuineClaims()
