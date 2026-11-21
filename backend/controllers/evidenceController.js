
import mongoose from 'mongoose'
import Claim from '../models/Claim.js'
import Evidence from '../models/Evidence.js'
import { extractFactsFromText } from '../services/evidenceExtractionService.js'

const OFFICIAL_PRIMARY_DOMAINS = [
    'bseindia.com',
    'www.bseindia.com',
    'nseindia.com',
    'www.nseindia.com',
    'nsearchives.nseindia.com',
    'sebi.gov.in',
    'www.sebi.gov.in',
    'mca.gov.in',
    'www.mca.gov.in',
    'rbi.org.in',
    'www.rbi.org.in',
]

const isOfficialDomain = (urlStr) => {
    try {
        const u = new URL(urlStr)
        return OFFICIAL_PRIMARY_DOMAINS.includes(u.hostname.toLowerCase())
    } catch {
        return false
    }
}

// ADD EVIDENCE TO A CLAIM
export const addEvidence = async (req, res) => {
    try {
        const { id } = req.params
        const {
            sourceName,
            sourceUrl,
            documentTitle,
            publishedAt,
            reportingPeriod,
            excerpt,
            facts,
        } = req.body

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid claim ID',
            })
        }

        const claim = await Claim.findById(id)

        if (!claim) {
            return res.status(404).json({
                success: false,
                message: 'Claim not found',
            })
        }

        // Ownership enforcement
        if (claim.user) {
            if (!req.user || claim.user.toString() !== req.user._id.toString()) {
                return res.status(403).json({
                    success: false,
                    message: 'You do not have permission to add evidence to this private claim',
                })
            }
        }

        if (
            typeof sourceName !== 'string' ||
            !sourceName.trim() ||
            typeof excerpt !== 'string' ||
            !excerpt.trim()
        ) {
            return res.status(400).json({
                success: false,
                message: 'Source name and evidence excerpt are required',
            })
        }

        if (sourceUrl) {
            try {
                const parsedUrl = new URL(sourceUrl)

                if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
                    throw new Error('Unsupported URL protocol')
                }
            } catch {
                return res.status(400).json({
                    success: false,
                    message: 'Please provide a valid HTTP or HTTPS source URL',
                })
            }
        }

        if (publishedAt && Number.isNaN(Date.parse(publishedAt))) {
            return res.status(400).json({
                success: false,
                message: 'Invalid publication date',
            })
        }

        if (facts !== undefined && !Array.isArray(facts)) {
            return res.status(400).json({
                success: false,
                message: 'Facts must be an array',
            })
        }

        let safeFacts = facts || []

        // If no facts explicitly provided, attempt deterministic extraction from document excerpt
        if (safeFacts.length === 0 && excerpt.trim()) {
            safeFacts = extractFactsFromText(excerpt.trim(), claim.extractedDetails?.metric)
        }

        for (const fact of safeFacts) {
            if (
                typeof fact.metric !== 'string' ||
                !fact.metric.trim() ||
                typeof fact.value !== 'number' ||
                !Number.isFinite(fact.value)
            ) {
                return res.status(400).json({
                    success: false,
                    message: 'Each fact must have a metric and a valid numeric value',
                })
            }
        }

        const allowedAuthorities = ['official_primary', 'reputable_secondary', 'other']
        const allowedSourceTypes = [
            'exchange_filing',
            'regulatory_document',
            'company_report',
            'news_report',
            'other',
        ]
        const allowedStances = ['supports', 'contradicts', 'neutral', 'not_assessed']

        let sourceAuthority = allowedAuthorities.includes(req.body.sourceAuthority)
            ? req.body.sourceAuthority
            : 'other'

        // Guard: Manual evidence URLs cannot claim official_primary status without originating from verified official domains
        if (sourceAuthority === 'official_primary' && sourceUrl && !isOfficialDomain(sourceUrl)) {
            sourceAuthority = 'reputable_secondary'
        }

        const sourceType = allowedSourceTypes.includes(req.body.sourceType)
            ? req.body.sourceType
            : 'other'

        const stance = allowedStances.includes(req.body.stance)
            ? req.body.stance
            : 'not_assessed'

        const evidence = await Evidence.create({
            claim: claim._id,
            sourceName: sourceName.trim(),
            sourceUrl: sourceUrl || '',
            documentTitle: documentTitle || '',
            publishedAt: publishedAt || null,
            reportingPeriod: reportingPeriod || '',
            excerpt: excerpt.trim(),
            facts: safeFacts,
            sourceType,
            sourceAuthority,
            stance,
        })

        await Claim.findByIdAndUpdate(claim._id, {
            $addToSet: { evidence: evidence._id },
        })

        return res.status(201).json({
            success: true,
            message: 'Evidence added successfully. It has not been independently authenticated.',
            data: evidence,
        })
    } catch (error) {
        console.error('Add evidence error:', error.message)

        return res.status(500).json({
            success: false,
            message: 'Unable to add evidence',
        })
    }
}

// GET ALL EVIDENCE FOR A CLAIM
export const getClaimEvidence = async (req, res) => {
    try {
        const { id } = req.params

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid claim ID',
            })
        }

        const claim = await Claim.findById(id)

        if (!claim) {
            return res.status(404).json({
                success: false,
                message: 'Claim not found',
            })
        }

        // Ownership enforcement
        if (claim.user) {
            if (!req.user || claim.user.toString() !== req.user._id.toString()) {
                return res.status(403).json({
                    success: false,
                    message: 'You do not have permission to view evidence for this private claim',
                })
            }
        }

        const evidence = await Evidence.find({
            claim: claim._id,
        }).sort({ createdAt: -1 })

        return res.status(200).json({
            success: true,
            count: evidence.length,
            data: evidence,
        })
    } catch (error) {
        console.error('Get evidence error:', error.message)

        return res.status(500).json({
            success: false,
            message: 'Unable to retrieve evidence',
        })
    }
}

// DELETE EVIDENCE
export const deleteEvidence = async (req, res) => {
    try {
        const { evidenceId } = req.params

        if (!mongoose.isValidObjectId(evidenceId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid evidence ID',
            })
        }

        const evidence = await Evidence.findById(evidenceId)

        if (!evidence) {
            return res.status(404).json({
                success: false,
                message: 'Evidence not found',
            })
        }

        const claim = await Claim.findById(evidence.claim)
        if (claim && claim.user) {
            if (!req.user || claim.user.toString() !== req.user._id.toString()) {
                return res.status(403).json({
                    success: false,
                    message: 'You do not have permission to delete evidence from this private claim',
                })
            }
        }

        await Evidence.findByIdAndDelete(evidenceId)

        await Claim.findByIdAndUpdate(evidence.claim, {
            $pull: { evidence: evidence._id },
        })

        return res.status(200).json({
            success: true,
            message: 'Evidence deleted successfully',
        })
    } catch (error) {
        console.error('Delete evidence error:', error.message)

        return res.status(500).json({
            success: false,
            message: 'Unable to delete evidence',
        })
    }
}
