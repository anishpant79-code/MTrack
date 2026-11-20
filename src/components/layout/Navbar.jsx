
import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ChartNoAxesCombined,
  Menu,
  X,
  ArrowUpRight,
} from 'lucide-react'

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  const closeMenu = () => setMenuOpen(false)

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/95 shadow-sm backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-6 lg:px-8">

        {/* Logo */}
        <Link
          to="/"
          onClick={closeMenu}
          className="flex shrink-0 items-center gap-2.5"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 shadow-md shadow-blue-600/20">
            <ChartNoAxesCombined className="h-5 w-5 text-white" />
          </div>

          <span className="text-xl font-bold tracking-tight text-slate-900">
            MTrack <span className="text-blue-600">AI</span>
          </span>
        </Link>

        {/* Desktop navigation */}
        <div className="hidden items-center gap-9 md:flex">
          <a
            href="#features"
            className="text-sm font-medium text-slate-600 transition-colors hover:text-blue-600"
          >
            Features
          </a>

          <a
            href="#how-it-works"
            className="text-sm font-medium text-slate-600 transition-colors hover:text-blue-600"
          >
            How It Works
          </a>

          <a
            href="#about"
            className="text-sm font-medium text-slate-600 transition-colors hover:text-blue-600"
          >
            About
          </a>
        </div>

        {/* Desktop actions */}
        <div className="hidden items-center gap-6 sm:flex">
          <Link
            to="/login"
            className="text-sm font-semibold text-slate-700 transition-colors hover:text-blue-600"
          >
            Login
          </Link>

          <Link
            to="/signup"
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-600/20 transition-all hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-lg"
          >
            Get Started
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={menuOpen}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-700 transition hover:bg-slate-50 sm:hidden"
        >
          {menuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Mobile navigation */}
      {menuOpen && (
        <div className="border-t border-slate-200 bg-white px-5 py-5 shadow-lg sm:hidden">
          <div className="flex flex-col gap-5">
            <a
              href="#features"
              onClick={closeMenu}
              className="text-sm font-medium text-slate-700 hover:text-blue-600"
            >
              Features
            </a>

            <a
              href="#how-it-works"
              onClick={closeMenu}
              className="text-sm font-medium text-slate-700 hover:text-blue-600"
            >
              How It Works
            </a>

            <a
              href="#about"
              onClick={closeMenu}
              className="text-sm font-medium text-slate-700 hover:text-blue-600"
            >
              About
            </a>

            <div className="flex items-center gap-4 border-t border-slate-100 pt-4">
              <Link
                to="/login"
                onClick={closeMenu}
                className="text-sm font-semibold text-slate-700"
              >
                Login
              </Link>

              <Link
                to="/signup"
                onClick={closeMenu}
                className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
