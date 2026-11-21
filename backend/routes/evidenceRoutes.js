import express from 'express'

import {
    deleteEvidence,
} from '../controllers/evidenceController.js'
import { optionalAuth } from '../middleware/authMiddleware.js'

const router = express.Router()

router.delete('/:evidenceId', optionalAuth, deleteEvidence)

export default router
