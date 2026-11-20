// src/pages/Login.jsx - Authentication Sign In Page

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ChartNoAxesCombined,
  ArrowRight,
  Sparkles,
  Eye,
  EyeOff,
  Lock,
  Mail,
} from 'lucide-react'
import { Button } from '../components/common'

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = (e) => {
    e.preventDefault()
    if (!email || !password) {
      setError('Please provide your email and password.')
      return
    }
    setError('')
    setIsLoading(true)

    setTimeout(() => {
      setIsLoading(false)
      navigate('/dashboard')
    }, 700)
  }

  const handleDemoLogin = () => {
    setEmail('alex.vance@investor.com')
    setPassword('••••••••••••')
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      navigate('/dashboard')
    }, 500)
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-16 sm:py-20 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        {/* Logo */}
        <Link to="/" className="inline-flex items-center gap-2.5">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 shadow-md shadow-blue-600/20 text-white">
            <ChartNoAxesCombined className="h-6 w-6" />
          </div>
          <span className="text-2xl font-extrabold tracking-tight text-slate-900">
            MTrack <span className="text-blue-600">AI</span>
          </span>
        </Link>

        <h2 className="mt-6 text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
          Sign in to your account
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-slate-500">
          Access your verified claims, intelligence dashboard, and watchlist.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="rounded-3xl border border-slate-200/90 bg-white p-7 sm:p-10 shadow-xl">
          {/* Quick Demo Access Button */}
          <div className="mb-6 rounded-2xl bg-blue-50/80 border border-blue-100 p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-blue-900">
                <Sparkles className="h-4 w-4 text-blue-600" />
                <span>Instant Demo Access</span>
              </div>
              <span className="text-[10px] bg-blue-600 text-white font-bold px-2.5 py-0.5 rounded-full shadow-2xs">
                1-Click
              </span>
            </div>
            <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
              Skip typing and explore all features immediately as an institutional analyst.
            </p>
            <button
              type="button"
              onClick={handleDemoLogin}
              disabled={isLoading}
              className="mt-3.5 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 px-4 text-xs font-bold text-white shadow-md hover:bg-blue-700 transition active:scale-98 cursor-pointer"
            >
              Continue as Demo Analyst
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white px-3 text-slate-400 font-bold uppercase text-[10px] tracking-wider">
                Or sign in with email
              </span>
            </div>
          </div>

          {error && (
            <div className="mb-5 rounded-2xl bg-rose-50 border border-rose-200 p-3.5 text-xs text-rose-700 font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 sm:space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Email address
              </label>
              <div className="relative mt-2">
                <Mail className="pointer-events-none absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="analyst@domain.com"
                  className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Password
                </label>
                <a href="#forgot" onClick={(e) => { e.preventDefault(); alert('Demo password reset: Simply click "Continue as Demo Analyst" above.'); }} className="text-xs text-blue-600 font-semibold hover:underline">
                  Forgot?
                </a>
              </div>
              <div className="relative mt-2">
                <Lock className="pointer-events-none absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-10 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full mt-2"
              loading={isLoading}
            >
              Sign In to MTrack AI
            </Button>
          </form>

          <div className="mt-6 text-center text-xs text-slate-500 font-medium">
            Don't have an account yet?{' '}
            <Link to="/signup" className="font-bold text-blue-600 hover:underline">
              Create an account
            </Link>
          </div>
        </div>

        {/* Back to Home Link */}
        <div className="mt-6 text-center">
          <Link to="/" className="text-xs font-semibold text-slate-500 hover:text-slate-800 transition">
            ← Back to Homepage
          </Link>
        </div>
      </div>
    </div>
  )
}
