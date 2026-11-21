
import mongoose from 'mongoose'

import Claim from '../models/Claim.js'
import Evidence from '../models/Evidence.js'

import {
    fetchSEBIUpdates,
    fetchNSEAnnouncements,
} from '../services/sourceIngestionService.js'

// Retrieve SEBI updates.
export const getSEBIUpdates = async (req, res) => {
    try {
        const searchTerm =
            typeof req.query.q === 'string'
                ? req.query.q.trim().slice(0, 100)
                : ''

        const result = await fetchSEBIUpdates(searchTerm)

        return res.status(200).json({
            success: true,
            message: 'SEBI updates retrieved successfully',
            ...result,
        })
    } catch (error) {
        console.error('SEBI retrieval failed:', error.message)

        return res.status(500).json({
            success: false,
            message: 'Unable to retrieve SEBI updates',
        })
    }
}

// Retrieve NSE announcements.
export const getNSEAnnouncements = async (req, res) => {
    try {
        const searchTerm =
            typeof req.query.q === 'string'
                ? req.query.q.trim().slice(0, 100)
                : ''

        const result = await fetchNSEAnnouncements(searchTerm)

        return res.status(200).json({
            success: true,
            message: 'NSE announcements retrieved successfully',
            ...result,
        })
    } catch (error) {
        console.error('NSE retrieval failed:', error.message)

        return res.status(500).json({
            success: false,
            message: 'Unable to retrieve NSE announcements',
        })
    }
}

// Shared function to import official updates into a claim.
const importUpdatesToClaim = async ({
    claimId,
    searchTerm,
    fetchUpdates,
}) => {
    if (!mongoose.isValidObjectId(claimId)) {
        return {
            status: 400,
            body: {
                success: false,
                message: 'Invalid claim ID',
            },
        }
    }

    if (!searchTerm || searchTerm.length < 2) {
        return {
            status: 400,
            body: {
                success: false,
                message: 'Search term must contain at least 2 characters',
            },
        }
    }

    const claim = await Claim.findById(claimId)

    if (!claim) {
        return {
            status: 404,
            body: {
                success: false,
                message: 'Claim not found',
            },
        }
    }

    const result = await fetchUpdates(searchTerm)

    let imported = 0
    let skipped = 0

    const importedIds = []

    for (const item of result.data) {
        if (!item.sourceUrl || !item.documentTitle || !item.excerpt) {
            skipped++
            continue
        }

        const existingEvidence = await Evidence.findOne({
            claim: claim._id,
            sourceUrl: item.sourceUrl,
        })

        if (existingEvidence) {
            skipped++
            continue
        }

        const evidence = await Evidence.create({
            claim: claim._id,
            sourceName: item.sourceName,
            sourceType: item.sourceType,
            sourceAuthority: 'official_primary',
            sourceUrl: item.sourceUrl,
            documentTitle: item.documentTitle,
            publishedAt: item.publishedAt,
            excerpt: item.excerpt,
            facts: [],
            stance: 'not_assessed',
        })

        importedIds.push(evidence._id)
        imported++
    }

    if (importedIds.length > 0) {
        await Claim.findByIdAndUpdate(claim._id, {
            $addToSet: {
                evidence: {
                    $each: importedIds,
                },
            },
        })
    }

    return {
        status: 200,
        body: {
            success: true,
            message: 'Official updates imported successfully',
            data: {
                claimId: claim._id,
                searchTerm,
                matchedUpdates: result.count,
                imported,
                skipped,
                note: 'Imported documents have not yet been assessed for relevance or whether they support or contradict the claim.',
            },
        },
    }
}

// Import SEBI updates into a claim.
export const importSEBIUpdates = async (req, res) => {
    try {
        const searchTerm =
            typeof req.query.q === 'string'
                ? req.query.q.trim().slice(0, 100)
                : ''

        const result = await importUpdatesToClaim({
            claimId: req.params.claimId,
            searchTerm,
            fetchUpdates: fetchSEBIUpdates,
        })

        return res.status(result.status).json(result.body)
    } catch (error) {
        console.error('SEBI import failed:', error.message)

        return res.status(500).json({
            success: false,
            message: 'Unable to import SEBI updates',
        })
    }
}

// Import NSE announcements into a claim.
export const importNSEAnnouncements = async (req, res) => {
    try {
        const searchTerm =
            typeof req.query.q === 'string'
                ? req.query.q.trim().slice(0, 100)
                : ''

        const result = await importUpdatesToClaim({
            claimId: req.params.claimId,
            searchTerm,
            fetchUpdates: fetchNSEAnnouncements,
        })

        return res.status(result.status).json(result.body)
    } catch (error) {
        console.error('NSE import failed:', error.message)

        return res.status(500).json({
            success: false,
            message: 'Unable to import NSE announcements',
        })
    }
}
