import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getCurrentUser, isAuthenticated, logout } from '../utils/auth'
import MTrackLogo from './MTrackLogo'
import { SearchIcon } from './Icons'

function Navbar() {
    const navigate = useNavigate()
    const [user, setUser] = useState(null)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')

    useEffect(() => {
        if (isAuthenticated()) {
            setUser(getCurrentUser())
        }
    }, [])

    const handleLogout = () => {
        logout()
        setUser(null)
        setMobileMenuOpen(false)
        navigate('/')
    }

    const handleSearchSubmit = (e) => {
        e.preventDefault()
        if (searchQuery.trim()) {
            navigate(`/verify?claim=${encodeURIComponent(searchQuery.trim())}`)
            setSearchQuery('')
        }
    }

    const navLinks = [
        { name: 'Features', href: '/#features' },
        { name: 'How It Works', href: '/#how-it-works' },
        { name: 'Trusted Sources', href: '/#sources' },
        { name: 'About', href: '/#about' },
        { name: 'FAQs', href: '/#faqs' },
    ]

    return (
        <header className="fixed top-0 left-0 z-50 w-full h-[72px] bg-white/95 backdrop-blur-md border-b border-[#E2EAE5]">
            <div className="max-w-[1440px] h-full mx-auto px-4 sm:px-6 lg:px-10 flex items-center justify-between gap-4">

                {/* Left Section: Logo and Navigation */}
                <div className="flex items-center gap-6 xl:gap-9 min-w-0">
                    <Link
                        to="/"
                        className="cursor-pointer shrink-0 transition-opacity hover:opacity-90"
                        aria-label="MTrack AI Home"
                    >
                        <MTrackLogo size="md" />
                    </Link>

                    {/* Desktop Navigation Links */}
                    <nav className="hidden xl:flex items-center gap-7">
                        {navLinks.map((link) => (
                            <a
                                key={link.name}
                                href={link.href}
                                className="text-sm font-medium text-gray-600 hover:text-[#00A878] transition-colors whitespace-nowrap cursor-pointer"
                            >
                                {link.name}
                            </a>
                        ))}
                    </nav>
                </div>

                {/* Right Section: Search and Login */}
                <div className="flex items-center gap-3 sm:gap-4">
                    {/* Search Bar */}
                    <form
                        onSubmit={handleSearchSubmit}
                        className="hidden md:flex items-center w-48 lg:w-64 h-10 px-3 gap-2 rounded-xl bg-[#F4F7F5] border border-[#E2EAE5] focus-within:border-[#00A878] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#00A878]/10 transition-all duration-200"
                    >
                        <SearchIcon className="w-4 h-4 text-gray-400 shrink-0" />
                        <input
                            type="search"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Verify claim or stock..."
                            aria-label="Search MTrack AI"
                            className="w-full min-w-0 bg-transparent outline-none text-xs sm:text-sm text-[#172B24] placeholder:text-gray-400"
                        />
                    </form>

                    {/* Auth Status & Actions */}
                    {user ? (
                        <div className="flex items-center gap-2.5">
                            <Link
                                to="/dashboard"
                                className="inline-flex items-center gap-2 rounded-xl bg-[#E2F0E8] px-3.5 py-2 text-xs sm:text-sm font-semibold text-[#008F65] transition hover:bg-[#d5e9dc] cursor-pointer"
                            >
                                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#00A878] text-[11px] font-bold text-white">
                                    {(user.fullName || 'U').charAt(0).toUpperCase()}
                                </span>
                                <span className="hidden sm:inline">
                                    {user.fullName ? user.fullName.split(' ')[0] : 'Dashboard'}
                                </span>
                            </Link>

                            <button
                                type="button"
                                onClick={handleLogout}
                                className="rounded-xl border border-[#DCE6DF] bg-white px-3 py-2 text-xs font-semibold text-gray-600 transition hover:bg-gray-100 hover:text-red-600 cursor-pointer"
                            >
                                Sign Out
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Link
                                to="/login"
                                className="hidden sm:inline-flex items-center justify-center rounded-xl border border-[#DCE6DF] bg-white px-4 py-2 text-xs sm:text-sm font-semibold text-[#172B24] transition hover:border-[#00A878] hover:text-[#008F65] hover:bg-[#F4F8F5] cursor-pointer"
                            >
                                Sign In
                            </Link>
                            <Link
                                to="/signup"
                                className="inline-flex items-center justify-center whitespace-nowrap bg-[#00A878] hover:bg-[#008F65] text-white px-4 sm:px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer shadow-xs active:scale-[0.98]"
                            >
                                Get Started
                            </Link>
                        </div>
                    )}

                    {/* Mobile Menu Button */}
                    <button
                        type="button"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="xl:hidden flex items-center justify-center p-2 rounded-xl border border-[#DCE6DF] text-gray-600 hover:bg-[#F4F7F5] cursor-pointer"
                        aria-label="Toggle navigation menu"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {mobileMenuOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </div>
            </div>

            {/* Mobile Dropdown Menu */}
            {mobileMenuOpen && (
                <div className="xl:hidden bg-white border-b border-[#E2EAE5] px-4 py-4 space-y-3 shadow-lg">
                    <form onSubmit={handleSearchSubmit} className="flex items-center h-10 px-3 gap-2 rounded-xl bg-[#F4F7F5] border border-[#E2EAE5]">
                        <SearchIcon className="w-4 h-4 text-gray-400 shrink-0" />
                        <input
                            type="search"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Verify financial claim..."
                            className="w-full bg-transparent outline-none text-sm text-[#172B24]"
                        />
                    </form>

                    <div className="flex flex-col space-y-2 pt-2 border-t border-gray-100">
                        {navLinks.map((link) => (
                            <a
                                key={link.name}
                                href={link.href}
                                onClick={() => setMobileMenuOpen(false)}
                                className="text-sm font-semibold text-gray-700 hover:text-[#00A878] py-2 cursor-pointer"
                            >
                                {link.name}
                            </a>
                        ))}
                        <Link
                            to="/verify"
                            onClick={() => setMobileMenuOpen(false)}
                            className="text-sm font-semibold text-[#008F65] py-2 cursor-pointer"
                        >
                            Verify a Claim →
                        </Link>
                    </div>
                </div>
            )}
        </header>
    )
}

export default Navbar
