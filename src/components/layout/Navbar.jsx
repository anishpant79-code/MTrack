// src/components/layout/Navbar.jsx - Modern Public Header

import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  ChartNoAxesCombined,
  Menu,
  X,
  ArrowUpRight,
  LayoutDashboard,
} from 'lucide-react'

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  const closeMenu = () => setMenuOpen(false)
  const isHome = location.pathname === '/'

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/95 shadow-xs backdrop-blur-md">
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
        <div className="hidden items-center gap-8 md:flex">
          <a
            href={isHome ? '#features' : '/#features'}
            className="text-sm font-medium text-slate-600 transition-colors hover:text-blue-600"
          >
            Features
          </a>

          <a
            href={isHome ? '#how-it-works' : '/#how-it-works'}
            className="text-sm font-medium text-slate-600 transition-colors hover:text-blue-600"
          >
            How It Works
          </a>

          <a
            href={isHome ? '#live-demo' : '/#live-demo'}
            className="text-sm font-medium text-slate-600 transition-colors hover:text-blue-600"
          >
            Interactive Demo
          </a>

          <a
            href={isHome ? '#about' : '/#about'}
            className="text-sm font-medium text-slate-600 transition-colors hover:text-blue-600"
          >
            About & Credibility
          </a>

          <a
            href={isHome ? '#faq' : '/#faq'}
            className="text-sm font-medium text-slate-600 transition-colors hover:text-blue-600"
          >
            FAQ
          </a>
        </div>

        {/* Desktop actions */}
        <div className="hidden items-center gap-4 sm:flex">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:border-blue-200 hover:bg-blue-50/60 hover:text-blue-700 transition"
          >
            <LayoutDashboard className="h-4 w-4 text-blue-600" />
            Dashboard
          </Link>

          <Link
            to="/login"
            className="text-sm font-semibold text-slate-700 transition-colors hover:text-blue-600 px-2"
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
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile navigation */}
      {menuOpen && (
        <div className="border-t border-slate-200 bg-white px-5 py-5 shadow-lg sm:hidden">
          <div className="flex flex-col gap-4">
            <a
              href={isHome ? '#features' : '/#features'}
              onClick={closeMenu}
              className="text-sm font-medium text-slate-700 hover:text-blue-600"
            >
              Features
            </a>

            <a
              href={isHome ? '#how-it-works' : '/#how-it-works'}
              onClick={closeMenu}
              className="text-sm font-medium text-slate-700 hover:text-blue-600"
            >
              How It Works
            </a>

            <a
              href={isHome ? '#live-demo' : '/#live-demo'}
              onClick={closeMenu}
              className="text-sm font-medium text-slate-700 hover:text-blue-600"
            >
              Interactive Demo
            </a>

            <a
              href={isHome ? '#about' : '/#about'}
              onClick={closeMenu}
              className="text-sm font-medium text-slate-700 hover:text-blue-600"
            >
              About & Credibility
            </a>

            <a
              href={isHome ? '#faq' : '/#faq'}
              onClick={closeMenu}
              className="text-sm font-medium text-slate-700 hover:text-blue-600"
            >
              FAQ
            </a>

            <div className="flex flex-col gap-2 border-t border-slate-100 pt-4">
              <Link
                to="/dashboard"
                onClick={closeMenu}
                className="flex items-center justify-center gap-2 rounded-lg border border-blue-200 bg-blue-50 py-2.5 text-sm font-semibold text-blue-700"
              >
                <LayoutDashboard className="h-4 w-4" />
                Open Dashboard
              </Link>

              <div className="flex items-center gap-3 pt-1">
                <Link
                  to="/login"
                  onClick={closeMenu}
                  className="flex-1 text-center rounded-lg border border-slate-200 py-2.5 text-sm font-semibold text-slate-700"
                >
                  Login
                </Link>

                <Link
                  to="/signup"
                  onClick={closeMenu}
                  className="flex-1 text-center rounded-lg bg-blue-600 py-2.5 text-sm font-semibold text-white"
                >
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
