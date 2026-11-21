
import express from 'express'

import {
    getSEBIUpdates,
    getNSEAnnouncements,
    importSEBIUpdates,
    importNSEAnnouncements,
} from '../controllers/sourceController.js'

const router = express.Router()

// Retrieve official updates.
router.get('/sebi', getSEBIUpdates)
router.get('/nse', getNSEAnnouncements)

// Import updates into a specific claim.
router.post('/sebi/import/:claimId', importSEBIUpdates)
router.post('/nse/import/:claimId', importNSEAnnouncements)

export default router
