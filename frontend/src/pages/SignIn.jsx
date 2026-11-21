import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { setAuthToken, setCurrentUser } from '../utils/auth'
import useDocumentTitle from '../utils/useDocumentTitle'
import MTrackLogo from '../components/MTrackLogo'
import BackButton from '../components/BackButton'

const API_URL =
    import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'

function SignIn() {
    useDocumentTitle('Sign In')
    const navigate = useNavigate()
    const [showPassword, setShowPassword] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')

        if (!email.trim() || !password) {
            setError('Please enter both your email and password.')
            return
        }

        try {
            setLoading(true)

            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email.trim(),
                    password,
                }),
            })

            const result = await response.json()

            if (!response.ok || !result.success) {
                throw new Error(result.message || 'Unable to sign in. Please check your credentials.')
            }

            // Save token and user info
            setAuthToken(result.data.token)
            setCurrentUser(result.data.user)

            navigate('/dashboard')
        } catch (err) {
            setError(err.message || 'Unable to connect to the authentication server.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-[#EDF3EF] flex flex-col justify-center px-4 py-10">
            <div className="w-full max-w-md mx-auto mb-4">
                <BackButton label="Back to Home" fallbackUrl="/" />
            </div>

            <div className="w-full max-w-md mx-auto rounded-3xl bg-white border border-[#DCE6DF] p-7 sm:p-9 shadow-sm hover:shadow-md transition-shadow">
                <Link to="/" className="inline-block cursor-pointer">
                    <MTrackLogo size="md" />
                </Link>

                <h1 className="mt-7 text-2xl sm:text-3xl font-extrabold text-[#172B24]">
                    Welcome back
                </h1>

                <p className="mt-2 text-sm text-gray-500">
                    Sign in to access your saved financial claim audits and verification history.
                </p>

                {error && (
                    <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-xs sm:text-sm text-red-700">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-[#172B24] mb-2">
                            Email address
                        </label>

                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            autoComplete="email"
                            required
                            className="w-full rounded-xl border border-[#DCE6DF] bg-[#FAFCFA] px-4 py-3 text-sm outline-none focus:border-[#00A878] focus:bg-white focus:ring-2 focus:ring-[#00A878]/10 transition"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-[#172B24] mb-2">
                            Password
                        </label>

                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                                autoComplete="current-password"
                                required
                                className="w-full rounded-xl border border-[#DCE6DF] bg-[#FAFCFA] px-4 py-3 pr-16 text-sm outline-none focus:border-[#00A878] focus:bg-white focus:ring-2 focus:ring-[#00A878]/10 transition"
                            />

                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-[#00A878] hover:text-[#008F65] cursor-pointer"
                            >
                                {showPassword ? 'Hide' : 'Show'}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-xl bg-[#00A878] py-3.5 font-semibold text-white transition hover:bg-[#008F65] disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer shadow-sm active:scale-[0.99] text-sm mt-2"
                    >
                        {loading ? 'Signing In...' : 'Sign In to Workspace'}
                    </button>
                </form>

                <p className="mt-6 text-center text-xs sm:text-sm text-gray-500">
                    Don&apos;t have an account?{' '}
                    <Link to="/signup" className="font-bold text-[#00A878] hover:text-[#008F65] cursor-pointer">
                        Create free account
                    </Link>
                </p>
            </div>
        </div>
    )
}

export default SignIn
