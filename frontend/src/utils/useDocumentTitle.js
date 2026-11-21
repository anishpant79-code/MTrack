import { useEffect } from 'react'

/**
 * useDocumentTitle - Custom hook to maintain clear, consistent browser tab titles
 * Format: `<Page Title> | MTrack AI` or default brand title
 */
export function useDocumentTitle(title) {
    useEffect(() => {
        const defaultTitle = 'MTrack AI — AI-Powered Financial Claim Verification'
        if (title) {
            document.title = `${title} | MTrack AI`
        } else {
            document.title = defaultTitle
        }
    }, [title])
}

export default useDocumentTitle
