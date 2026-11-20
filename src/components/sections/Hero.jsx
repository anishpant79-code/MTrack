
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  ArrowUpRight,
  ShieldCheck,
  SearchCheck,
  BrainCircuit,
  Activity,
  CheckCircle2,
  Sparkles,
} from 'lucide-react'

function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-white">
      {/* Background decoration */}
      <div className="pointer-events-none absolute -right-40 -top-40 -z-10 h-[500px] w-[500px] rounded-full bg-blue-100/50 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-48 -left-40 -z-10 h-[450px] w-[450px] rounded-full bg-indigo-100/40 blur-3xl" />

      <div className="mx-auto grid max-w-7xl items-center gap-16 px-5 py-20 sm:px-6 sm:py-24 lg:grid-cols-2 lg:gap-20 lg:px-8 lg:py-28">

        {/* Left: Hero content */}
        <div className="max-w-2xl">
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50/80 px-4 py-2 text-sm font-semibold text-blue-700">
            <Sparkles className="h-4 w-4" />
            Smarter financial intelligence
          </div>

          <h1 className="text-4xl font-bold leading-[1.12] tracking-tight text-slate-950 sm:text-5xl lg:text-[62px]">
            Less confusion.
            <span className="mt-1 block text-blue-600">
              More clarity.
            </span>
            <span className="mt-1 block">
              Smarter investing.
            </span>
          </h1>

          <p className="mt-7 max-w-xl text-base leading-8 text-slate-600 sm:text-lg">
            MTrack AI helps you evaluate financial claims, understand
            information sources and separate reliable insights from
            market noise. Make sense of information before making
            investment decisions.
          </p>

          {/* Action buttons */}
          <div className="mt-9 flex flex-col gap-4 sm:flex-row">
            <Link
              to="/signup"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-7 py-3.5 font-semibold text-white shadow-lg shadow-blue-600/20 transition duration-300 hover:-translate-y-1 hover:bg-blue-700"
            >
              Get Started
              <ArrowRight className="h-5 w-5" />
            </Link>

            <a
              href="#how-it-works"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-7 py-3.5 font-semibold text-slate-700 transition duration-300 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
            >
              See How It Works
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>

          {/* Supporting points */}
          <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3">
            {[
              'Evidence-focused analysis',
              'Source credibility',
              'Clearer insights',
            ].map((item) => (
              <div key={item} className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-slate-600">
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Dashboard illustration */}
        <div className="relative mx-auto w-full max-w-[560px]">

          {/* Decorative SVG background */}
          <svg
            className="absolute -left-12 -top-12 h-40 w-40 text-blue-200"
            viewBox="0 0 160 160"
            fill="none"
            aria-hidden="true"
          >
            <circle cx="80" cy="80" r="60" stroke="currentColor" strokeWidth="1.5" strokeDasharray="5 7" />
            <circle cx="80" cy="80" r="40" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 6" />
            <circle cx="80" cy="80" r="5" fill="currentColor" />
          </svg>

          {/* Main dashboard */}
          <div className="relative rounded-3xl border border-slate-200/80 bg-white p-5 shadow-2xl shadow-slate-900/10 sm:p-7">

            {/* Dashboard heading */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-5">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white">
                  <Activity className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-500">
                    MTRACK AI
                  </p>
                  <h2 className="text-lg font-bold text-slate-900">
                    Intelligence Dashboard
                  </h2>
                </div>
              </div>

              <div className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700">
                Live preview
              </div>
            </div>

            {/* Analysis card */}
            <div className="mt-6 rounded-2xl border border-slate-100 bg-slate-50/80 p-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Incoming information
                </span>
                <SearchCheck className="h-5 w-5 text-blue-600" />
              </div>

              <p className="mt-3 text-sm font-semibold leading-6 text-slate-800">
                A company announces a major business expansion.
              </p>

              <div className="mt-4 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-amber-400" />
                <span className="text-xs font-medium text-slate-500">
                  Financial claim awaiting analysis
                </span>
              </div>
            </div>

            {/* Verification progress */}
            <div className="mt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-blue-600" />
                  <span className="text-sm font-semibold text-slate-800">
                    Source verification
                  </span>
                </div>
                <span className="text-xs font-semibold text-blue-600">
                  In review
                </span>
              </div>

              <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
                <div className="h-full w-2/3 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500" />
              </div>

              <div className="mt-2 flex justify-between text-xs text-slate-400">
                <span>Checking available evidence</span>
                <span>Illustrative progress</span>
              </div>
            </div>

            {/* Insight cards */}
            <div className="mt-7 grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-blue-100 bg-blue-50/70 p-4">
                <SearchCheck className="h-5 w-5 text-blue-600" />
                <p className="mt-3 text-xs font-medium text-slate-500">
                  Source analysis
                </p>
                <p className="mt-1 text-sm font-bold text-slate-800">
                  Evidence check
                </p>
              </div>

              <div className="rounded-xl border border-indigo-100 bg-indigo-50/70 p-4">
                <BrainCircuit className="h-5 w-5 text-indigo-600" />
                <p className="mt-3 text-xs font-medium text-slate-500">
                  AI processing
                </p>
                <p className="mt-1 text-sm font-bold text-slate-800">
                  Claim analysis
                </p>
              </div>
            </div>

            {/* Bottom message */}
            <div className="mt-5 flex items-start gap-3 rounded-xl border border-emerald-100 bg-emerald-50/70 p-4">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
              <div>
                <p className="text-sm font-semibold text-emerald-800">
                  Evidence before conclusions
                </p>
                <p className="mt-1 text-xs leading-5 text-emerald-700">
                  Understand the available information before drawing conclusions.
                </p>
              </div>
            </div>
          </div>

          {/* Floating decorative card */}
          <div className="absolute -bottom-7 -left-5 hidden items-center gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-xl sm:flex">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50">
              <ShieldCheck className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500">
                Analysis approach
              </p>
              <p className="text-sm font-bold text-slate-900">
                Evidence first
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}

export default Hero
