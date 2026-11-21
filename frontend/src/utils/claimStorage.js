
const STORAGE_KEY = 'mtrack_ai_claims'
const SAVED_MIGRATION_KEY = 'mtrack_ai_saved_migration_v1'

export function getClaims() {
    try {
        const storedClaims = localStorage.getItem(STORAGE_KEY)

        if (!storedClaims) {
            return []
        }

        const parsedClaims = JSON.parse(storedClaims)

        return Array.isArray(parsedClaims) ? parsedClaims : []
    } catch (error) {
        console.error('Unable to read claims:', error)
        return []
    }
}

export function saveClaims(claims) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(claims))
        return true
    } catch (error) {
        console.error('Unable to save claims:', error)
        return false
    }
}

export function initializeClaims(initialClaims) {
    const storedClaims = getClaims()

    if (
        storedClaims.length > 0 ||
        localStorage.getItem(STORAGE_KEY) !== null
    ) {
        return storedClaims
    }

    saveClaims(initialClaims)
    return initialClaims
}

export function initializeSavedClaims(initialSavedClaims) {
    let storedClaims = getClaims()

    // Migrate the old Saved Claims sample list only once.
    if (localStorage.getItem(SAVED_MIGRATION_KEY) !== 'done') {
        const savedIds = new Set(initialSavedClaims.map((claim) => claim.id))

        storedClaims = storedClaims.map((claim) => {
            if (savedIds.has(claim.id)) {
                const savedSample = initialSavedClaims.find(
                    (item) => item.id === claim.id
                )

                return {
                    ...claim,
                    isSaved: true,
                    source: claim.source || savedSample.source,
                }
            }

            return {
                ...claim,
                isSaved: Boolean(claim.isSaved),
            }
        })

        // Add any old saved sample claims not already in shared storage.
        initialSavedClaims.forEach((savedSample) => {
            const exists = storedClaims.some(
                (claim) => claim.id === savedSample.id
            )

            if (!exists) {
                storedClaims.push({
                    ...savedSample,
                    isSaved: true,
                })
            }
        })

        saveClaims(storedClaims)
        localStorage.setItem(SAVED_MIGRATION_KEY, 'done')
    }

    return storedClaims.filter((claim) => claim.isSaved)
}
