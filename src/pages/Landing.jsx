// src/pages/Landing.jsx - Public Landing Page with Hero, Live Demo, Features, How It Works, About, FAQ & Footer

import { useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/layout/Navbar'
import Hero from '../components/sections/Hero'
import Features from '../components/sections/Features'
import HowItWorks from '../components/sections/HowItWorks'
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  ChevronDown,
  FileCheck,
  TrendingUp,
  Cpu,
  Lock,
} from 'lucide-react'
import { INITIAL_CLAIMS } from '../data'

export default function Landing() {
  const [selectedDemoClaim, setSelectedDemoClaim] = useState(INITIAL_CLAIMS[0])
  const [openFaq, setOpenFaq] = useState(null)

  const faqs = [
    {
      q: 'Does MTrack AI provide investment or financial advice?',
      a: 'No. MTrack AI is an objective financial intelligence and source-verification platform. We evaluate the factual accuracy, source credibility, and evidentiary backing of claims circulating in the market, empowering you to make well-informed decisions.'
    },
    {
      q: 'How does MTrack AI verify financial claims so quickly?',
      a: 'Our AI engine continuously ingests regulatory filings (SEC EDGAR, European TED, global gazettes), official earnings transcripts, tier-1 news wires, and corporate press releases. When a claim or rumor surfaces, our models cross-reference semantic claims against verified public records.'
    },
    {
      q: 'What sources does the platform evaluate?',
      a: 'We rank and analyze sources across the entire information hierarchy: government registries, audited balance sheets, mainstream financial newsrooms (Bloomberg, Reuters, WSJ), sell-side analyst reports, executive social accounts, and retail trading forums (Reddit, X, Discord).'
    },
    {
      q: 'Can I test my own custom financial rumors or news links?',
      a: 'Yes! The full AI Verifier application allows you to paste any rumor text, article link, or forum post to generate an instantaneous evidentiary audit report.'
    }
  ]

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1">
        {/* 1. Hero Section */}
        <Hero />

        {/* 2. Live Interactive Claim Inspector Demo */}
        <section id="live-demo" className="border-y border-slate-200/80 bg-slate-50/70 py-20 sm:py-28 px-5 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-6xl">
            <div className="text-center max-w-3xl mx-auto">
              <span className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-blue-700 shadow-2xs">
                <Sparkles className="h-3.5 w-3.5" />
                Interactive Experience
              </span>
              <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
                See Claim Verification in Action
              </h2>
              <p className="mt-4 text-sm sm:text-base text-slate-600 leading-relaxed">
                Click any real-world market rumor below to inspect how MTrack AI breaks down claims against official evidence.
              </p>
            </div>

            {/* Selector tabs for sample claims */}
            <div className="mt-9 flex flex-wrap justify-center gap-2.5 sm:gap-3.5">
              {INITIAL_CLAIMS.slice(0, 3).map((claim) => (
                <button
                  key={claim.id}
                  onClick={() => setSelectedDemoClaim(claim)}
                  className={`rounded-2xl px-5 py-3 text-xs font-bold transition-all cursor-pointer ${
                    selectedDemoClaim.id === claim.id
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20 scale-[1.02]'
                      : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300'
                  }`}
                >
                  <span className="opacity-75 mr-1.5">${claim.ticker}</span>
                  {claim.id === 'CLM-1082' ? 'Blackwell Margin Leak' : claim.id === 'CLM-1081' ? 'Apple Rivian Buyout' : 'Microsoft EU Contract'}
                </button>
              ))}
            </div>

            {/* Interactive Demo Card */}
            <div className="mt-10 rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-10 shadow-2xl">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-6">
                <div className="flex items-center gap-2.5">
                  <span className="rounded-xl bg-blue-600 px-3.5 py-1 text-xs font-bold text-white shadow-2xs">
                    ${selectedDemoClaim.ticker}
                  </span>
                  <span className="text-xs font-semibold text-slate-500">
                    {selectedDemoClaim.category}
                  </span>
                  <span className="text-xs text-slate-400">• Source: {selectedDemoClaim.sourceName}</span>
                </div>

                <div className="flex items-center gap-2.5">
                  <span className={`inline-flex items-center gap-1 rounded-full px-3.5 py-1 text-xs font-bold ${
                    selectedDemoClaim.status === 'VERIFIED'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : selectedDemoClaim.status === 'DEBUNKED'
                      ? 'bg-rose-50 text-rose-700 border border-rose-200'
                      : 'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}>
                    {selectedDemoClaim.status}
                  </span>
                  <span className="text-xs font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                    {selectedDemoClaim.confidenceScore}% AI Confidence
                  </span>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight leading-snug">
                  {selectedDemoClaim.title}
                </h3>
                <p className="mt-2.5 text-sm sm:text-base text-slate-600 leading-relaxed">
                  {selectedDemoClaim.claimSummary}
                </p>
              </div>

              {/* AI Verdict */}
              <div className="mt-8 rounded-2xl border border-blue-100 bg-blue-50/70 p-6">
                <div className="flex items-center gap-2 text-xs font-bold text-blue-800 uppercase tracking-wider mb-2">
                  <Sparkles className="h-4 w-4 text-blue-600" />
                  MTrack AI Synthetic Verdict
                </div>
                <p className="text-sm sm:text-base leading-relaxed font-medium text-slate-800">
                  {selectedDemoClaim.aiVerdictSummary}
                </p>
              </div>

              {/* Evidence Two-Column Comparison */}
              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <div className="rounded-2xl border border-emerald-100 bg-emerald-50/40 p-5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 uppercase tracking-wider mb-3">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    Verified Evidence ({selectedDemoClaim.evidenceFor?.length || 0})
                  </div>
                  <div className="space-y-2.5">
                    {selectedDemoClaim.evidenceFor?.map((ev, i) => (
                      <div key={i} className="rounded-xl bg-white p-3.5 border border-emerald-100 text-xs shadow-2xs">
                        <p className="font-semibold text-slate-800 leading-snug">{ev.text}</p>
                        <p className="mt-1.5 text-[11px] text-slate-500 font-medium">Source: {ev.source}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl border border-rose-100 bg-rose-50/40 p-5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-rose-800 uppercase tracking-wider mb-3">
                    <XCircle className="h-4 w-4 text-rose-600" />
                    Refuting / Conflicting Facts ({selectedDemoClaim.evidenceAgainst?.length || 0})
                  </div>
                  <div className="space-y-2.5">
                    {selectedDemoClaim.evidenceAgainst?.map((ev, i) => (
                      <div key={i} className="rounded-xl bg-white p-3.5 border border-rose-100 text-xs shadow-2xs">
                        <p className="font-semibold text-slate-800 leading-snug">{ev.text}</p>
                        <p className="mt-1.5 text-[11px] text-slate-500 font-medium">Source: {ev.source}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Demo Action */}
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100 pt-6">
                <span className="text-xs sm:text-sm text-slate-500 font-medium">
                  Try verifying your own custom news items or rumors in the interactive app.
                </span>
                <Link
                  to="/verification"
                  className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-xs sm:text-sm font-bold text-white shadow-md hover:bg-blue-700 transition"
                >
                  Open Full Verifier Tool
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Features Section */}
        <Features />

        {/* 4. How It Works Section */}
        <HowItWorks />

        {/* 5. About & Credibility Methodology Section */}
        <section id="about" className="py-20 sm:py-28 px-5 sm:px-8 lg:px-12 bg-slate-900 text-white">
          <div className="mx-auto max-w-7xl">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-blue-400 shadow-2xs">
                  <ShieldCheck className="h-4 w-4" />
                  Our Credibility Methodology
                </span>
                <h2 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl leading-tight">
                  Built on rigorous, evidence-first financial principles.
                </h2>
                <p className="mt-5 text-sm sm:text-base leading-relaxed text-slate-300">
                  Modern financial markets move at the speed of social media, but reliable investment decisions require substantiated facts. MTrack AI ranks every claim on a deterministic credibility hierarchy, penalizing anonymous whisper numbers and surfacing primary audit trails.
                </p>

                <div className="mt-8 sm:mt-10 space-y-4">
                  {[
                    {
                      title: 'Tier 1: Regulatory & Audited Filings',
                      desc: 'Direct EDGAR SEC filings, Court Dockets, Government Gazette awards (98-100% reliability weighting).',
                    },
                    {
                      title: 'Tier 2: Primary Institutional Press',
                      desc: 'Reuters, Bloomberg Terminal, WSJ with dual-reporter verification standards (88-95% weighting).',
                    },
                    {
                      title: 'Tier 3: Corporate PR & Executive Communications',
                      desc: 'Official company press releases, earnings conference calls, and verified IR presentations.',
                    },
                    {
                      title: 'Tier 4: Retail & Social Crowdsourcing',
                      desc: 'FinTwit, Reddit, and chat rooms tracked for velocity and sentiment, flagged as unverified by default.',
                    },
                  ].map((tier, idx) => (
                    <div key={idx} className="flex items-start gap-4 rounded-2xl bg-slate-800/60 p-4 sm:p-5 border border-slate-700/60 transition hover:bg-slate-800/80">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-blue-600/20 text-blue-400 font-extrabold text-xs mt-0.5 shadow-2xs">
                        {idx + 1}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white">{tier.title}</h4>
                        <p className="mt-1 text-xs text-slate-400 leading-relaxed">{tier.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right column: Trust pillars */}
              <div className="grid gap-5 sm:gap-6 sm:grid-cols-2">
                <div className="rounded-3xl border border-slate-800 bg-slate-800/50 p-6 sm:p-7 shadow-xs">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600/20 text-blue-400 mb-4 shadow-2xs">
                    <FileCheck className="h-6 w-6" />
                  </div>
                  <h3 className="text-base font-bold text-white">Full Citation Traceability</h3>
                  <p className="mt-2 text-xs leading-relaxed text-slate-400">
                    Never trust a black box. Every verification verdict provides direct citations to the primary filings and statements analyzed.
                  </p>
                </div>

                <div className="rounded-3xl border border-slate-800 bg-slate-800/50 p-6 sm:p-7 shadow-xs">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600/20 text-indigo-400 mb-4 shadow-2xs">
                    <Cpu className="h-6 w-6" />
                  </div>
                  <h3 className="text-base font-bold text-white">Semantic Cross-Checking</h3>
                  <p className="mt-2 text-xs leading-relaxed text-slate-400">
                    Advanced NLP checks for contradictory language, temporal anomalies, and historical recurrence of recycled rumors.
                  </p>
                </div>

                <div className="rounded-3xl border border-slate-800 bg-slate-800/50 p-6 sm:p-7 shadow-xs">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-600/20 text-emerald-400 mb-4 shadow-2xs">
                    <TrendingUp className="h-6 w-6" />
                  </div>
                  <h3 className="text-base font-bold text-white">Market Impact Gauging</h3>
                  <p className="mt-2 text-xs leading-relaxed text-slate-400">
                    Correlate anomalous claim volume with options skew and intraday volatility to detect coordinated pump-and-dump rumors.
                  </p>
                </div>

                <div className="rounded-3xl border border-slate-800 bg-slate-800/50 p-6 sm:p-7 shadow-xs">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-600/20 text-amber-400 mb-4 shadow-2xs">
                    <Lock className="h-6 w-6" />
                  </div>
                  <h3 className="text-base font-bold text-white">Objective & Unbiased</h3>
                  <p className="mt-2 text-xs leading-relaxed text-slate-400">
                    Zero editorial bias. We don't take positions or recommend trades; we purely verify claims against reality.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 6. FAQ Section */}
        <section id="faq" className="py-20 sm:py-28 px-5 sm:px-8 lg:px-12 bg-white">
          <div className="mx-auto max-w-4xl">
            <div className="text-center">
              <span className="inline-flex rounded-full border border-blue-100 bg-blue-50 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-blue-700 shadow-2xs">
                Frequently Asked Questions
              </span>
              <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
                Got questions? We've got answers.
              </h2>
            </div>

            <div className="mt-12 space-y-4 sm:space-y-5">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="rounded-3xl border border-slate-200/90 bg-white overflow-hidden shadow-2xs transition-all hover:border-slate-300"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    className="flex w-full items-center justify-between p-5 sm:p-6 text-left font-bold text-slate-900 transition hover:bg-slate-50 cursor-pointer text-sm sm:text-base"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`h-4 w-4 text-slate-400 transition-transform duration-200 shrink-0 ml-4 ${
                        openFaq === index ? 'rotate-180 text-blue-600' : ''
                      }`}
                    />
                  </button>
                  {openFaq === index && (
                    <div className="border-t border-slate-100 px-5 sm:px-6 pb-6 pt-3 text-xs sm:text-sm leading-relaxed text-slate-600 bg-slate-50/50">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 7. Call To Action Banner */}
        <section className="bg-gradient-to-br from-blue-600 to-indigo-700 py-20 sm:py-24 px-5 sm:px-8 lg:px-12 text-white text-center">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl leading-tight">
              Stop guessing. Start verifying.
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-sm sm:text-lg text-blue-100 leading-relaxed">
              Join thousands of analysts, active traders, and research investors who use MTrack AI to filter market noise and verify claims in seconds.
            </p>
            <div className="mt-9 flex flex-col sm:flex-row justify-center items-center gap-4">
              <Link
                to="/signup"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-8 py-4 text-sm font-bold text-blue-700 shadow-xl hover:bg-blue-50 transition hover:-translate-y-0.5 active:scale-98"
              >
                Create Free Account
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/dashboard"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl border border-blue-300/40 bg-blue-700/50 px-8 py-4 text-sm font-bold text-white hover:bg-blue-700 transition"
              >
                Launch Intelligence App
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* 8. Modern SaaS Footer */}
      <footer className="border-t border-slate-200 bg-white py-14 sm:py-16 px-5 sm:px-8 lg:px-12 text-slate-600 text-xs">
        <div className="mx-auto max-w-7xl flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white font-bold shadow-xs">
                M
              </div>
              <span className="text-lg font-bold text-slate-900 tracking-tight">
                MTrack <span className="text-blue-600">AI</span>
              </span>
            </div>
            <p className="mt-2 text-xs text-slate-500 max-w-sm leading-relaxed">
              Evidence-based financial intelligence and market claim verification engine.
            </p>
          </div>

          <div className="flex flex-wrap gap-6 sm:gap-8 text-slate-600 font-semibold text-xs sm:text-sm">
            <Link to="/dashboard" className="hover:text-blue-600 transition">Dashboard</Link>
            <Link to="/feed" className="hover:text-blue-600 transition">Claims Feed</Link>
            <Link to="/stocks" className="hover:text-blue-600 transition">Stocks Intel</Link>
            <Link to="/verification" className="hover:text-blue-600 transition">AI Verifier</Link>
            <Link to="/login" className="hover:text-blue-600 transition">Sign In</Link>
          </div>
        </div>

        <div className="mx-auto max-w-7xl mt-10 pt-8 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4 text-slate-400 text-[11px]">
          <p>© {new Date().getFullYear()} MTrack AI, Inc. All rights reserved.</p>
          <p className="max-w-xl text-center sm:text-right leading-relaxed">
            Disclaimer: MTrack AI provides informational intelligence and source verification. Content does not constitute financial, legal, or investment advice.
          </p>
        </div>
      </footer>
    </div>
  )
}
