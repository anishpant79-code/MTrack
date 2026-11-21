import express from 'express'

import {
    createClaim,
    getClaims,
    getClaimById,
    updateClaim,
    deleteClaim,
    extractClaimDetails,
} from '../controllers/claimController.js'

import {
    verifyClaim,
} from '../controllers/verificationController.js'

import {
    addEvidence,
    getClaimEvidence,
} from '../controllers/evidenceController.js'

import { optionalAuth } from '../middleware/authMiddleware.js'

const router = express.Router()

// Extract entities from claim text (preview or auto-populate)
router.post('/extract', optionalAuth, extractClaimDetails)

// Claim management
router.post('/', optionalAuth, createClaim)
router.get('/', optionalAuth, getClaims)

// Evidence belonging to a specific claim
router.post('/:id/evidence', optionalAuth, addEvidence)
router.get('/:id/evidence', optionalAuth, getClaimEvidence)

// Verification
router.post('/:id/verify', optionalAuth, verifyClaim)

// Update and delete claims
router.patch('/:id', optionalAuth, updateClaim)
router.delete('/:id', optionalAuth, deleteClaim)

// Retrieve one claim
router.get('/:id', optionalAuth, getClaimById)

export default router
