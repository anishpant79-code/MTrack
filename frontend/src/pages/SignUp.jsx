import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { setAuthToken, setCurrentUser } from '../utils/auth'
import useDocumentTitle from '../utils/useDocumentTitle'
import MTrackLogo from '../components/MTrackLogo'
import BackButton from '../components/BackButton'

const API_URL =
    import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'

function SignUp() {
    useDocumentTitle('Sign Up')
    const navigate = useNavigate()

    const [fullName, setFullName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')

        if (!fullName.trim() || !email.trim() || !password) {
            setError('Please fill in all required fields.')
            return
        }

        if (password.length < 8) {
            setError('Password must be at least 8 characters long.')
            return
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match. Please try again.')
            return
        }

        try {
            setLoading(true)

            const response = await fetch(`${API_URL}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    fullName: fullName.trim(),
                    email: email.trim(),
                    password,
                }),
            })

            const result = await response.json()

            if (!response.ok || !result.success) {
                throw new Error(result.message || 'Unable to create your account.')
            }

            setAuthToken(result.data.token)
            setCurrentUser(result.data.user)

            navigate('/dashboard')
        } catch (err) {
            setError(err.message || 'Unable to complete registration. Please check your connection.')
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
                    Create your account
                </h1>

                <p className="mt-2 text-sm text-gray-500">
                    Join MTrack AI to audit corporate claims, save evidence, and track verification history.
                </p>

                {error && (
                    <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-xs sm:text-sm text-red-700">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-[#172B24] mb-2">
                            Full name
                        </label>

                        <input
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="Enter your full name"
                            autoComplete="name"
                            required
                            className="w-full rounded-xl border border-[#DCE6DF] bg-[#FAFCFA] px-4 py-3 text-sm outline-none focus:border-[#00A878] focus:bg-white focus:ring-2 focus:ring-[#00A878]/10 transition"
                        />
                    </div>

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
                                placeholder="Create a password (min 8 chars)"
                                autoComplete="new-password"
                                minLength={8}
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

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-[#172B24] mb-2">
                            Confirm password
                        </label>

                        <div className="relative">
                            <input
                                type={showConfirmPassword ? 'text' : 'password'}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Confirm your password"
                                autoComplete="new-password"
                                minLength={8}
                                required
                                className="w-full rounded-xl border border-[#DCE6DF] bg-[#FAFCFA] px-4 py-3 pr-16 text-sm outline-none focus:border-[#00A878] focus:bg-white focus:ring-2 focus:ring-[#00A878]/10 transition"
                            />

                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-[#00A878] hover:text-[#008F65] cursor-pointer"
                            >
                                {showConfirmPassword ? 'Hide' : 'Show'}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-xl bg-[#00A878] py-3.5 font-semibold text-white transition hover:bg-[#008F65] disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer shadow-sm active:scale-[0.99] text-sm mt-2"
                    >
                        {loading ? 'Creating Account...' : 'Create Account'}
                    </button>
                </form>

                <p className="mt-6 text-center text-xs sm:text-sm text-gray-500">
                    Already have an account?{' '}
                    <Link to="/login" className="font-bold text-[#00A878] hover:text-[#008F65] cursor-pointer">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    )
}

export default SignUp
