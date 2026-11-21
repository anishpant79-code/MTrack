import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const routeTitles = {
    '/': 'MTrack AI — AI-Powered Financial Claim Verification',
    '/login': 'Sign In | MTrack AI',
    '/signin': 'Sign In | MTrack AI',
    '/signup': 'Sign Up | MTrack AI',
    '/dashboard': 'Dashboard | MTrack AI',
    '/verify': 'Verify Financial Claims | MTrack AI',
    '/history': 'Claim History | MTrack AI',
    '/saved': 'Saved Claims | MTrack AI',
    '/market-insights': 'Market Insights & Disclosures | MTrack AI',
    '/company-research': 'Company Research & Filings | MTrack AI',
}

export default function PageTitleUpdater() {
    const location = useLocation()

    useEffect(() => {
        const path = location.pathname

        if (routeTitles[path]) {
            document.title = routeTitles[path]
        } else if (path.startsWith('/claim/')) {
            document.title = 'Claim Verification Report | MTrack AI'
        } else {
            document.title = 'MTrack AI — Financial Claim Verification'
        }
    }, [location.pathname])

    return null
}
