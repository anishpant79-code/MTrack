// src/App.jsx - Application Router & Code-Split Route Definitions

import { lazy, Suspense } from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import { ArrowLeft, ChartNoAxesCombined, Loader2 } from 'lucide-react'

// Code-split pages for optimized bundle size & fast loading
const Landing = lazy(() => import('./pages/Landing'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Feed = lazy(() => import('./pages/Feed'))
const Stocks = lazy(() => import('./pages/Stocks'))
const Watchlist = lazy(() => import('./pages/Watchlist'))
const Verification = lazy(() => import('./pages/Verification'))
const Settings = lazy(() => import('./pages/Settings'))
const Login = lazy(() => import('./pages/Login'))
const Signup = lazy(() => import('./pages/Signup'))

function PageLoader() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-50 text-slate-600">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 mb-3 animate-pulse">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
      <p className="text-xs font-semibold text-slate-500">Loading MTrack AI...</p>
    </div>
  )
}

function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-slate-50">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/20 mb-4">
        <ChartNoAxesCombined className="h-7 w-7" />
      </div>
      <h1 className="text-4xl font-bold tracking-tight text-slate-900">404</h1>
      <p className="mt-2 text-base font-semibold text-slate-700">Page not found</p>
      <p className="mt-1 text-xs text-slate-500 max-w-sm">
        The intelligence page or claim record you are searching for does not exist or has been relocated.
      </p>
      <div className="mt-6 flex gap-3">
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-blue-700 transition"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Public Pages */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Intelligence Application Pages */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/feed" element={<Feed />} />
        <Route path="/stocks" element={<Stocks />} />
        <Route path="/watchlist" element={<Watchlist />} />
        <Route path="/verification" element={<Verification />} />
        <Route path="/settings" element={<Settings />} />

        {/* 404 Fallback */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  )
}
