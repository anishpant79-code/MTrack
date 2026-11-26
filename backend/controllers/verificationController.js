import mongoose from 'mongoose'
import Claim from '../models/Claim.js'
import Evidence from '../models/Evidence.js'
import { verifyFinancialGrowth } from '../services/verificationService.js'
import { extractClaimDetailsWithGemini, explainVerificationResult } from '../services/geminiService.js'
import { autoAssociateEvidenceForCompany } from './claimController.js'

export const verifyClaim = async (req, res) => {
    try {
        const { id } = req.params
        const { claimDetails } = req.body || {}

        // Validate MongoDB ID
        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid claim ID',
            })
        }

        // Find the claim
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
                    message: 'You do not have permission to verify this private claim',
                })
            }
        }

        // Determine structured details: provided in body > saved in claim > extracted via AI / rule engine
        let activeClaimDetails = claimDetails

        if (
            !activeClaimDetails ||
            !activeClaimDetails.company ||
            !activeClaimDetails.currentPeriod ||
            !Number.isFinite(activeClaimDetails.claimedGrowthPercent)
        ) {
            const saved = claim.extractedDetails
            if (
                saved &&
                saved.company &&
                saved.currentPeriod &&
                Number.isFinite(saved.claimedGrowthPercent)
            ) {
                activeClaimDetails = {
                    company: activeClaimDetails?.company?.trim() || saved.company,
                    metric: activeClaimDetails?.metric || saved.metric || 'Revenue',
                    previousPeriod: activeClaimDetails?.previousPeriod?.trim() || saved.previousPeriod || '',
                    currentPeriod: activeClaimDetails?.currentPeriod?.trim() || saved.currentPeriod || '',
                    claimedGrowthPercent:
                        Number.isFinite(activeClaimDetails?.claimedGrowthPercent)
                            ? activeClaimDetails.claimedGrowthPercent
                            : saved.claimedGrowthPercent,
                    tolerancePercent: activeClaimDetails?.tolerancePercent || saved.tolerancePercent || 0.5,
                }
            } else {
                const aiExtracted = await extractClaimDetailsWithGemini(claim.title)
                activeClaimDetails = {
                    company: activeClaimDetails?.company?.trim() || saved?.company || aiExtracted?.company || '',
                    metric: activeClaimDetails?.metric || saved?.metric || aiExtracted?.metric || 'Revenue',
                    previousPeriod: activeClaimDetails?.previousPeriod?.trim() || saved?.previousPeriod || aiExtracted?.previousPeriod || '',
                    currentPeriod: activeClaimDetails?.currentPeriod?.trim() || saved?.currentPeriod || aiExtracted?.currentPeriod || '',
                    claimedGrowthPercent:
                        Number.isFinite(activeClaimDetails?.claimedGrowthPercent)
                            ? activeClaimDetails.claimedGrowthPercent
                            : Number.isFinite(saved?.claimedGrowthPercent)
                            ? saved.claimedGrowthPercent
                            : Number.isFinite(aiExtracted?.claimedGrowthPercent)
                            ? aiExtracted.claimedGrowthPercent
                            : null,
                    tolerancePercent: activeClaimDetails?.tolerancePercent || saved?.tolerancePercent || 0.5,
                }
            }
        }

        // Auto-associate official statutory disclosures and company announcements
        if (activeClaimDetails?.company) {
            const existingEvidenceWithFacts = await Evidence.countDocuments({
                claim: claim._id,
                'facts.0': { $exists: true },
            })
            if (existingEvidenceWithFacts === 0) {
                await autoAssociateEvidenceForCompany(claim._id, activeClaimDetails.company)
            }
        }

        // Retrieve evidence belonging to this claim
        const evidence = await Evidence.find({
            claim: claim._id,
        }).lean().sort({ createdAt: -1 })

        // Run independent deterministic verification rules
        const result = verifyFinancialGrowth({
            claimDetails: activeClaimDetails,
            evidence,
        })

        // Update evidence stance based on verification outcome
        if (result.status === 'Verified' || result.status === 'Contradicted') {
            const targetStance = result.status === 'Verified' ? 'supports' : 'contradicts'
            await Evidence.updateMany(
                {
                    claim: claim._id,
                    'facts.0': { $exists: true },
                    sourceAuthority: 'official_primary',
                },
                { stance: targetStance }
            )
        }

        // Generate transparent AI / rule explanation
        const aiExplanation = await explainVerificationResult({
            claimTitle: claim.title,
            claimDetails: activeClaimDetails,
            status: result.status,
            calculation: result.calculation,
            limitations: result.limitations,
            evidence,
        })

        // Save the verification result in MongoDB
        claim.status = result.status
        claim.extractedDetails = {
            company: activeClaimDetails.company || '',
            metric: activeClaimDetails.metric || '',
            previousPeriod: activeClaimDetails.previousPeriod || '',
            currentPeriod: activeClaimDetails.currentPeriod || '',
            claimedGrowthPercent: activeClaimDetails.claimedGrowthPercent,
            tolerancePercent: activeClaimDetails.tolerancePercent || 0.5,
        }

        claim.verification = {
            method: result.method,
            summary: aiExplanation || result.summary,
            aiExplanation,
            limitations: result.limitations,
            transparencyScore: result.transparencyScore,
            checkedAt: new Date(),
            inputs: activeClaimDetails,
            calculation: result.calculation,
        }

        await claim.save()

        return res.status(200).json({
            success: true,
            message: 'Claim verification completed',
            data: {
                claimId: claim._id,
                title: claim.title,
                status: result.status,
                extractedDetails: claim.extractedDetails,
                verification: claim.verification,
                evidenceCount: evidence.length,
                evidence: evidence.map((item) => ({
                    id: item._id,
                    sourceName: item.sourceName,
                    sourceType: item.sourceType,
                    sourceAuthority: item.sourceAuthority,
                    sourceUrl: item.sourceUrl,
                    documentTitle: item.documentTitle,
                    publishedAt: item.publishedAt,
                    reportingPeriod: item.reportingPeriod,
                    excerpt: item.excerpt,
                    stance: item.stance,
                    facts: item.facts,
                })),
            },
        })
    } catch (error) {
        console.error('Claim verification failed:', error.message)

        return res.status(500).json({
            success: false,
            message: 'Unable to verify claim',
        })
    }
}
