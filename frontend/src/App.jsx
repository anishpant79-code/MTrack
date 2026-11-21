import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

import PageTitleUpdater from './components/PageTitleUpdater'
import Home from './pages/Home'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import Dashboard from './pages/Dashboard'
import VerifyClaims from './pages/VerifyClaims'
import ClaimHistory from './pages/ClaimHistory'
import SavedClaims from './pages/SavedClaims'
import MarketInsights from './pages/MarketInsights'
import CompanyResearch from './pages/CompanyResearch'
import ClaimDetails from './pages/ClaimDetails'

function App() {
    return (
        <BrowserRouter>
            <PageTitleUpdater />
            <Routes>
                {/* Landing Page */}
                <Route path="/" element={<Home />} />

                {/* Authentication */}
                <Route path="/login" element={<SignIn />} />
                <Route path="/signin" element={<SignIn />} />
                <Route path="/signup" element={<SignUp />} />

                {/* Dashboard Pages */}
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/verify" element={<VerifyClaims />} />
                <Route path="/history" element={<ClaimHistory />} />
                <Route path="/saved" element={<SavedClaims />} />
                <Route path="/market-insights" element={<MarketInsights />} />
                <Route path="/company-research" element={<CompanyResearch />} />

                {/* Claim Details */}
                <Route path="/claim/:id" element={<ClaimDetails />} />

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App
