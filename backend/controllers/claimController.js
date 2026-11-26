import mongoose from 'mongoose'
import Claim from '../models/Claim.js'
import Evidence from '../models/Evidence.js'
import { extractClaimDetailsWithGemini } from '../services/geminiService.js'
import { fetchNSEAnnouncements, fetchSEBIUpdates } from '../services/sourceIngestionService.js'
import {
    resolveCompany,
    getStatutoryDisclosureForCompany,
} from '../services/evidenceExtractionService.js'
import { verifyFinancialGrowth } from '../services/verificationService.js'

// Automatically find and attach relevant official statutory disclosures and company announcements
export const autoAssociateEvidenceForCompany = async (claimId, companyName) => {
    if (!companyName || companyName === 'Specified Company' || companyName.length < 2) {
        return []
    }

    try {
        const resolved = resolveCompany(companyName)
        const canonicalName = resolved ? resolved.name : companyName.trim()
        const addedEvidenceIds = []

        // 1. Check if official primary statutory disclosure exists in the repository
        const statutoryDoc = getStatutoryDisclosureForCompany(companyName)
        if (statutoryDoc) {
            const existing = await Evidence.findOne({
                claim: claimId,
                sourceUrl: statutoryDoc.sourceUrl,
            })

            if (!existing) {
                const doc = await Evidence.create({
                    claim: claimId,
                    sourceName: statutoryDoc.sourceName,
                    sourceType: statutoryDoc.sourceType,
                    sourceAuthority: statutoryDoc.sourceAuthority,
                    sourceUrl: statutoryDoc.sourceUrl,
                    documentTitle: statutoryDoc.documentTitle,
                    publishedAt: statutoryDoc.publishedAt,
                    excerpt: statutoryDoc.excerpt,
                    facts: statutoryDoc.facts || [],
                    stance: 'not_assessed',
                })
                addedEvidenceIds.push(doc._id)
            } else if (existing.facts.length === 0 && statutoryDoc.facts?.length > 0) {
                existing.facts = statutoryDoc.facts
                await existing.save()
                addedEvidenceIds.push(existing._id)
            }
        }

        // 2. Query live announcements from NSE & SEBI
        const [nseResult, sebiResult] = await Promise.all([
            fetchNSEAnnouncements(canonicalName).catch(() => ({ data: [] })),
            fetchSEBIUpdates(canonicalName).catch(() => ({ data: [] })),
        ])

        const candidateAnnouncements = [
            ...(nseResult.data || []),
            ...(sebiResult.data || []),
        ]

        for (const item of candidateAnnouncements) {
            if (!item.sourceUrl || !item.documentTitle) continue

            const existing = await Evidence.findOne({
                claim: claimId,
                sourceUrl: item.sourceUrl,
            })

            if (!existing) {
                const doc = await Evidence.create({
                    claim: claimId,
                    sourceName: item.sourceName,
                    sourceType: item.sourceType,
                    sourceAuthority: item.sourceAuthority || 'official_primary',
                    sourceUrl: item.sourceUrl,
                    documentTitle: item.documentTitle,
                    publishedAt: item.publishedAt,
                    excerpt: item.excerpt || item.documentTitle,
                    facts: item.facts || [],
                    stance: 'not_assessed',
                })
                addedEvidenceIds.push(doc._id)
            }
        }

        if (addedEvidenceIds.length > 0) {
            await Claim.findByIdAndUpdate(claimId, {
                $addToSet: { evidence: { $each: addedEvidenceIds } },
            })
        }

        return addedEvidenceIds
    } catch (err) {
        console.warn('Evidence auto-association warning:', err.message)
        return []
    }
}

// EXTRACT STRUCTURED DETAILS FROM NATURAL LANGUAGE CLAIM
export const extractClaimDetails = async (req, res) => {
    try {
        const { claim } = req.body

        if (!claim || !claim.trim()) {
            return res.status(400).json({
                success: false,
                message: 'Claim text is required for entity extraction',
            })
        }

        const extracted = await extractClaimDetailsWithGemini(claim.trim())

        return res.status(200).json({
            success: true,
            data: extracted,
        })
    } catch (error) {
        console.error('Extract claim error:', error.message)
        return res.status(500).json({
            success: false,
            message: 'Unable to extract claim details',
        })
    }
}

// CREATE CLAIM
export const createClaim = async (req, res) => {
    try {
        const { title, category, source, claimDetails } = req.body

        if (!title || !title.trim()) {
            return res.status(400).json({
                success: false,
                message: 'Claim text is required',
            })
        }

        // Extract entities if not explicitly provided or if incomplete
        let extractedDetails = claimDetails
        if (
            !extractedDetails ||
            !extractedDetails.company ||
            !extractedDetails.currentPeriod ||
            !Number.isFinite(extractedDetails.claimedGrowthPercent)
        ) {
            const aiExtracted = await extractClaimDetailsWithGemini(title.trim())
            extractedDetails = {
                company: extractedDetails?.company?.trim() || aiExtracted?.company || '',
                metric: extractedDetails?.metric || aiExtracted?.metric || 'Revenue',
                previousPeriod: extractedDetails?.previousPeriod?.trim() || aiExtracted?.previousPeriod || '',
                currentPeriod: extractedDetails?.currentPeriod?.trim() || aiExtracted?.currentPeriod || '',
                claimedGrowthPercent:
                    Number.isFinite(extractedDetails?.claimedGrowthPercent)
                        ? extractedDetails.claimedGrowthPercent
                        : Number.isFinite(aiExtracted?.claimedGrowthPercent)
                        ? aiExtracted.claimedGrowthPercent
                        : null,
                tolerancePercent:
                    typeof extractedDetails?.tolerancePercent === 'number'
                        ? extractedDetails.tolerancePercent
                        : aiExtracted?.tolerancePercent || 0.5,
            }
        }

        const claim = await Claim.create({
            title: title.trim(),
            category: category || extractedDetails?.category || 'Company Financials',
            source: source ? source.trim() : '',
            user: req.user?._id || null,
            extractedDetails: {
                company: extractedDetails?.company || '',
                metric: extractedDetails?.metric || '',
                previousPeriod: extractedDetails?.previousPeriod || '',
                currentPeriod: extractedDetails?.currentPeriod || '',
                claimedGrowthPercent:
                    typeof extractedDetails?.claimedGrowthPercent === 'number'
                        ? extractedDetails.claimedGrowthPercent
                        : null,
                tolerancePercent:
                    typeof extractedDetails?.tolerancePercent === 'number'
                        ? extractedDetails.tolerancePercent
                        : 0.5,
            },
        })

        // Auto-associate official announcements for the identified company
        if (extractedDetails?.company) {
            await autoAssociateEvidenceForCompany(claim._id, extractedDetails.company)
        }

        // Run initial verification if structured comparison details are available
        if (
            extractedDetails?.metric &&
            extractedDetails?.previousPeriod &&
            extractedDetails?.currentPeriod &&
            Number.isFinite(extractedDetails?.claimedGrowthPercent)
        ) {
            const evidence = await Evidence.find({ claim: claim._id }).lean()
            if (evidence.length > 0) {
                const result = verifyFinancialGrowth({
                    claimDetails: extractedDetails,
                    evidence,
                })
                claim.status = result.status
                claim.verification = {
                    method: result.method,
                    summary: result.summary,
                    limitations: result.limitations,
                    transparencyScore: result.transparencyScore,
                    checkedAt: new Date(),
                    inputs: extractedDetails,
                    calculation: result.calculation,
                }
                await claim.save()
            }
        }

        const populatedClaim = await Claim.findById(claim._id).populate('evidence')

        return res.status(201).json({
            success: true,
            message: 'Claim created successfully',
            data: populatedClaim || claim,
        })
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                success: false,
                message: error.message,
            })
        }

        console.error('Create claim error:', error.message)
        return res.status(500).json({
            success: false,
            message: 'Unable to create claim',
        })
    }
}

// GET ALL CLAIMS
export const getClaims = async (req, res) => {
    try {
        const { status, saved, userOnly } = req.query

        const filter = {}

        if (status) {
            const allowedStatuses = [
                'Pending',
                'Verified',
                'Contradicted',
                'Unverified',
            ]

            if (!allowedStatuses.includes(status)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid claim status',
                })
            }

            filter.status = status
        }

        if (saved !== undefined) {
            if (!['true', 'false'].includes(saved)) {
                return res.status(400).json({
                    success: false,
                    message: 'Saved filter must be true or false',
                })
            }

            filter.isSaved = saved === 'true'
        }

        // Strict User-Level Isolation
        if (req.user) {
            if (userOnly === 'true') {
                filter.user = req.user._id
            } else {
                filter.$or = [
                    { user: req.user._id },
                    { user: null },
                ]
            }
        } else {
            // Guest users only see unowned/demo claims, never a registered user's private claims
            filter.user = null
        }

        const claims = await Claim.find(filter)
            .populate('evidence')
            .sort({ createdAt: -1 })
            .limit(100)

        return res.status(200).json({
            success: true,
            count: claims.length,
            data: claims,
        })
    } catch (error) {
        console.error('Get claims error:', error.message)
        return res.status(500).json({
            success: false,
            message: 'Unable to retrieve claims',
        })
    }
}

// GET SINGLE CLAIM
export const getClaimById = async (req, res) => {
    try {
        const { id } = req.params

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid claim ID',
            })
        }

        const claim = await Claim.findById(id).populate('evidence')

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
                    message: 'You do not have permission to view this private claim',
                })
            }
        }

        return res.status(200).json({
            success: true,
            data: claim,
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Unable to retrieve claim',
        })
    }
}

// UPDATE CLAIM
export const updateClaim = async (req, res) => {
    try {
        const { id } = req.params

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid claim ID',
            })
        }

        const existingClaim = await Claim.findById(id)

        if (!existingClaim) {
            return res.status(404).json({
                success: false,
                message: 'Claim not found',
            })
        }

        // Ownership enforcement
        if (existingClaim.user) {
            if (!req.user || existingClaim.user.toString() !== req.user._id.toString()) {
                return res.status(403).json({
                    success: false,
                    message: 'You do not have permission to modify this private claim',
                })
            }
        }

        const allowedFields = ['title', 'category', 'source', 'isSaved', 'extractedDetails']
        const updates = {}

        for (const field of allowedFields) {
            if (req.body[field] !== undefined) {
                updates[field] = req.body[field]
            }
        }

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No valid fields provided for update',
            })
        }

        const claim = await Claim.findByIdAndUpdate(
            id,
            updates,
            {
                new: true,
                runValidators: true,
            }
        ).populate('evidence')

        return res.status(200).json({
            success: true,
            message: 'Claim updated successfully',
            data: claim,
        })
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                success: false,
                message: error.message,
            })
        }

        return res.status(500).json({
            success: false,
            message: 'Unable to update claim',
        })
    }
}

// DELETE CLAIM
export const deleteClaim = async (req, res) => {
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
                    message: 'You do not have permission to delete this private claim',
                })
            }
        }

        await Claim.findByIdAndDelete(id)

        // Remove linked evidence
        await Evidence.deleteMany({ claim: id })

        return res.status(200).json({
            success: true,
            message: 'Claim deleted successfully',
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Unable to delete claim',
        })
    }
}
