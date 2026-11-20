// src/pages/Signup.jsx - User Registration & Investor Onboarding

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ChartNoAxesCombined,
  ArrowRight,
  User,
  Mail,
  Lock,
} from 'lucide-react'
import { Button } from '../components/common'

export default function Signup() {
  const navigate = useNavigate()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [persona, setPersona] = useState('Analyst')
  const [agreeTerms, setAgreeTerms] = useState(true)
  const [isLoading, setIsLoading] = useState(false)

  const handleSignup = (e) => {
    e.preventDefault()
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      navigate('/dashboard')
    }, 700)
  }

  const personas = ['Analyst', 'Retail Investor', 'Portfolio Manager', 'Day Trader']

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
          Create your free account
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-slate-500">
          Start verifying financial rumors and filtering market noise with evidence.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="rounded-3xl border border-slate-200/90 bg-white p-7 sm:p-10 shadow-xl">
          <form onSubmit={handleSignup} className="space-y-4 sm:space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Full Name
              </label>
              <div className="relative mt-2">
                <User className="pointer-events-none absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Alex Vance"
                  className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative mt-2">
                <Mail className="pointer-events-none absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex.vance@investor.com"
                  className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Password
              </label>
              <div className="relative mt-2">
                <Lock className="pointer-events-none absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  required
                />
              </div>
            </div>

            {/* Investor Persona Picker */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Investor Profile Type
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                {personas.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPersona(p)}
                    className={`rounded-xl border py-2.5 px-3 text-xs font-bold text-center transition ${
                      persona === p
                        ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-2xs'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Terms Checkbox */}
            <div className="pt-1">
              <label className="flex items-start gap-2.5 text-xs text-slate-500 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  required
                />
                <span className="leading-relaxed">
                  I agree to MTrack AI's Terms of Service and acknowledge informational disclaimer.
                </span>
              </label>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full mt-3 shadow-lg shadow-blue-600/20"
              loading={isLoading}
              disabled={!agreeTerms}
            >
              Create Account & Launch Dashboard
              <ArrowRight className="h-4 w-4" />
            </Button>
          </form>

          <div className="mt-6 text-center text-xs text-slate-500 font-medium">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-blue-600 hover:underline">
              Sign In
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
