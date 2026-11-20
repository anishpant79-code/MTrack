// src/pages/Verification.jsx - The Flagship AI Claim Verification Engine

import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { AppLayout } from '../components/navigation'
import { Button, StatusBadge, RiskBadge } from '../components/common'
import {
  SAMPLE_CLAIMS_FOR_VERIFICATION,
  getVerificationsHistory,
  saveNewVerification,
} from '../data'
import {
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Cpu,
  History,
  RotateCcw,
  AlertOctagon,
} from 'lucide-react'

export default function Verification() {
  const location = useLocation()
  const [claimText, setClaimText] = useState(() => location.state?.prefilledClaim || '')
  const [ticker, setTicker] = useState(() => location.state?.prefilledTicker || '')
  const [sourceType, setSourceType] = useState('Social Media / FinTwit')
  const [sourceUrl, setSourceUrl] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisStage, setAnalysisStage] = useState(0)
  const [currentResult, setCurrentResult] = useState(null)
  const [history, setHistory] = useState(getVerificationsHistory)

  const stages = [
    'Parsing claim semantics, target entities & financial figures...',
    'Querying SEC EDGAR database (10-K, 10-Q, 8-K disclosures)...',
    'Cross-referencing Tier-1 Wire services (Bloomberg, Reuters, WSJ)...',
    'Analyzing source historical veracity & anomalous volatility skew...',
    'Synthesizing multi-factor evidence verdict...',
  ]

  const handleRunVerification = (e) => {
    e?.preventDefault()
    if (!claimText.trim()) return

    setIsAnalyzing(true)
    setAnalysisStage(0)
    setCurrentResult(null)

    // Simulate multi-stage pipeline
    const interval = setInterval(() => {
      setAnalysisStage((prev) => {
        if (prev < stages.length - 1) {
          return prev + 1
        } else {
          clearInterval(interval)
          finishAnalysis()
          return prev
        }
      })
    }, 600)
  }

  const finishAnalysis = () => {
    const textLower = claimText.toLowerCase()
    let verdict
    let credibilityScore
    let confidenceScore
    let riskLevel
    let summary
    let evidenceFor
    let evidenceAgainst

    if (
      textLower.includes('acquisition') ||
      textLower.includes('buyout') ||
      textLower.includes('merger') ||
      textLower.includes('rivian') ||
      textLower.includes('15b') ||
      textLower.includes('14b')
    ) {
      verdict = 'MISLEADING'
      credibilityScore = 24
      confidenceScore = 91
      riskLevel = 'High'
      summary =
        'Speculative merger rumor. No Hart-Scott-Rodino premerger antitrust notifications have been submitted, and both parties confirmed existing independent partnerships.'
      evidenceFor = [
        { text: 'Social media leak citing cross-executive travel to Silicon Valley', source: 'FinTwit / Leak', credibility: 28 },
      ]
      evidenceAgainst = [
        { text: 'No material transaction 8-K filed with the Securities and Exchange Commission', source: 'SEC EDGAR', credibility: 99 },
        { text: 'Target CEO confirmed independence during investor conference', source: 'Investor Relations Call', credibility: 96 },
      ]
    } else if (
      textLower.includes('margin') ||
      textLower.includes('defect') ||
      textLower.includes('blackwell') ||
      textLower.includes('halt') ||
      textLower.includes('yield')
    ) {
      verdict = 'DEBUNKED'
      credibilityScore = 14
      confidenceScore = 95
      riskLevel = 'High'
      summary =
        'Completely unsubstantiated rumor. Foundry yields and partner manufacturing reports confirm normal production ramp with margins guided within official expectations.'
      evidenceFor = [
        { text: 'Anonymous forum thread purporting supply chain delay', source: 'Tech Forum', credibility: 18 },
      ]
      evidenceAgainst = [
        { text: 'Foundry partner official monthly revenue & wafer output release', source: 'Taiwan Stock Exchange', credibility: 99 },
        { text: 'Company reiterated quarterly gross margin outlook during investor summit', source: 'Official Press Transcript', credibility: 97 },
      ]
    } else if (
      textLower.includes('contract') ||
      textLower.includes('sovereign') ||
      textLower.includes('defense') ||
      textLower.includes('awarded') ||
      textLower.includes('approved')
    ) {
      verdict = 'VERIFIED'
      credibilityScore = 96
      confidenceScore = 98
      riskLevel = 'Low'
      summary =
        'Verified official award. The procurement agreement is formally registered in public government databases with authorized budget appropriation.'
      evidenceFor = [
        { text: 'Government procurement contract record published in formal register', source: 'Official Tender Registry', credibility: 100 },
        { text: 'Form 8-K disclosure filed regarding major commercial agreement', source: 'SEC EDGAR', credibility: 99 },
        { text: 'Tier-1 wire confirmation quoting verified agency signatories', source: 'Reuters Business Wire', credibility: 94 },
      ]
      evidenceAgainst = []
    } else {
      verdict = 'UNVERIFIED'
      credibilityScore = 48
      confidenceScore = 76
      riskLevel = 'Moderate'
      summary =
        'Insufficient primary evidence available. The claim originates from secondary channels and lacks official corporate or regulatory disclosures.'
      evidenceFor = [
        { text: 'Secondary industry blog commentary citing unspecified insider', source: 'Industry Blog', credibility: 45 },
      ]
      evidenceAgainst = [
        { text: 'No matching regulatory disclosure filed within required statutory timeline', source: 'SEC EDGAR', credibility: 95 },
      ]
    }

    const newRecord = {
      id: `VER-${Math.floor(1000 + Math.random() * 9000)}`,
      claimText,
      ticker: ticker.toUpperCase() || 'MARKET',
      sourceUrl: sourceUrl || 'Direct User Input',
      sourceType,
      timestamp: 'Just now',
      verdict,
      credibilityScore,
      confidenceScore,
      riskLevel,
      summary,
      evidenceFor,
      evidenceAgainst,
    }

    setCurrentResult(newRecord)
    const updatedHistory = saveNewVerification(newRecord)
    setHistory(updatedHistory)
    setIsAnalyzing(false)
  }

  const handleSelectSample = (sample) => {
    setClaimText(sample.title)
    setTicker(sample.ticker)
    setSourceType(sample.source)
  }

  const handleLoadHistory = (item) => {
    setClaimText(item.claimText)
    setTicker(item.ticker)
    setSourceType(item.sourceType)
    setCurrentResult(item)
  }

  return (
    <AppLayout>
      <div className="space-y-8 sm:space-y-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              AI Financial Claim Verifier
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-500">
              Cross-reference any financial rumor, news leak, or social claim against SEC filings & verified sources.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-blue-700 bg-blue-50 px-4 py-2 rounded-2xl border border-blue-200 shadow-2xs">
            <Cpu className="h-4 w-4 text-blue-600" />
            <span>Multi-Factor Synthesis Engine</span>
          </div>
        </div>

        {/* 1-Click Sample Claim Templates */}
        <div className="rounded-3xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
            <Sparkles className="h-3.5 w-3.5 text-blue-600" />
            Try Pre-loaded Financial Claims
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {SAMPLE_CLAIMS_FOR_VERIFICATION.map((sample, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleSelectSample(sample)}
                className="flex flex-col justify-between rounded-2xl border border-slate-100 bg-slate-50/70 p-4 text-left text-xs transition-all hover:border-blue-200 hover:bg-blue-50/60 hover:shadow-sm cursor-pointer"
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="font-extrabold text-blue-700 text-xs">${sample.ticker}</span>
                  <span className="text-[10px] font-semibold text-slate-400">{sample.category}</span>
                </div>
                <p className="line-clamp-2 font-semibold text-slate-800 leading-snug">{sample.title}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Two-Column Layout: Input Form (Left) & Verification Report / Analysis (Right) */}
        <div className="grid gap-8 lg:gap-10 lg:grid-cols-12">
          {/* Left Column: Claim Input Form */}
          <div className="lg:col-span-5 space-y-6 sm:space-y-8">
            <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xs">
              <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-4 mb-5">
                Claim Verification Parameters
              </h2>

              <form onSubmit={handleRunVerification} className="space-y-4 sm:space-y-5">
                {/* Claim Text Area */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Claim or Rumor Statement *
                  </label>
                  <textarea
                    rows={4}
                    value={claimText}
                    onChange={(e) => setClaimText(e.target.value)}
                    placeholder="E.g., Tech conglomerate secret $15B acquisition offer for open-source AI lab..."
                    className="mt-2 w-full rounded-2xl border border-slate-200 p-3.5 text-xs sm:text-sm leading-relaxed text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    required
                  />
                </div>

                {/* Ticker & Source Category Grid */}
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Stock Ticker (Optional)
                    </label>
                    <input
                      type="text"
                      value={ticker}
                      onChange={(e) => setTicker(e.target.value.toUpperCase())}
                      placeholder="e.g. NVDA, AAPL"
                      className="mt-2 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Source Category
                    </label>
                    <select
                      value={sourceType}
                      onChange={(e) => setSourceType(e.target.value)}
                      className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-800 focus:border-blue-500 focus:outline-none"
                    >
                      <option value="Social Media / FinTwit">Social Media / FinTwit</option>
                      <option value="Reddit / WSB">Reddit / WSB</option>
                      <option value="Anonymous Leak / Forum">Anonymous Leak / Forum</option>
                      <option value="Mainstream News / Wire">Mainstream News / Wire</option>
                      <option value="SEC Filing / Regulatory">SEC Filing / Regulatory</option>
                      <option value="Corporate Press Release">Corporate Press Release</option>
                    </select>
                  </div>
                </div>

                {/* Source URL (Optional) */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Source Link / Citation URL (Optional)
                  </label>
                  <input
                    type="url"
                    value={sourceUrl}
                    onChange={(e) => setSourceUrl(e.target.value)}
                    placeholder="https://..."
                    className="mt-2 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:outline-none"
                  />
                </div>

                {/* Verification CTA Button */}
                <div className="pt-2">
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    className="w-full shadow-lg shadow-blue-600/20"
                    loading={isAnalyzing}
                    disabled={!claimText.trim() || isAnalyzing}
                  >
                    <Sparkles className="h-4 w-4" />
                    Verify with MTrack AI
                  </Button>
                </div>
              </form>
            </div>

            {/* Past Verifications History */}
            <div className="rounded-3xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
                <div className="flex items-center gap-2">
                  <History className="h-4 w-4 text-slate-500" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Verification History
                  </h3>
                </div>
                <span className="text-[11px] font-semibold text-slate-400">{history.length} Saved</span>
              </div>

              <div className="max-h-64 overflow-y-auto space-y-2.5 pr-1">
                {history.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleLoadHistory(item)}
                    className="flex items-center justify-between p-3 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-blue-50/60 hover:border-blue-200 transition cursor-pointer text-xs"
                  >
                    <div className="pr-2 truncate">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-blue-700">${item.ticker}</span>
                        <StatusBadge status={item.verdict} size="sm" />
                      </div>
                      <p className="mt-1 truncate text-slate-600 font-medium text-[11px]">{item.claimText}</p>
                    </div>
                    <span className="text-[10px] text-slate-400 shrink-0 font-medium">{item.timestamp}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: AI Analysis Engine Output */}
          <div className="lg:col-span-7">
            {isAnalyzing ? (
              /* Simulated Multi-Step Analysis Progress Screen */
              <div className="rounded-3xl border border-blue-200 bg-white p-8 sm:p-12 shadow-xl text-center space-y-6">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 animate-pulse">
                  <Cpu className="h-8 w-8 animate-spin" />
                </div>

                <div>
                  <h3 className="text-xl font-bold text-slate-900">
                    MTrack AI Ingestion Engine Processing
                  </h3>
                  <p className="mt-1.5 text-xs text-slate-500 max-w-sm mx-auto">
                    Running natural language verification against global financial databases
                  </p>
                </div>

                {/* Progress Pipeline */}
                <div className="space-y-3 max-w-md mx-auto text-left pt-2">
                  {stages.map((stg, idx) => {
                    const isDone = idx < analysisStage
                    const isCurrent = idx === analysisStage

                    return (
                      <div
                        key={idx}
                        className={`flex items-center gap-3.5 p-3 rounded-2xl text-xs transition-all ${
                          isDone
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-100'
                            : isCurrent
                            ? 'bg-blue-50 text-blue-800 border border-blue-200 font-bold shadow-xs'
                            : 'text-slate-400'
                        }`}
                      >
                        {isDone ? (
                          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                        ) : isCurrent ? (
                          <Sparkles className="h-4 w-4 text-blue-600 shrink-0 animate-spin" />
                        ) : (
                          <span className="h-2 w-2 rounded-full bg-slate-300 ml-1 shrink-0" />
                        )}
                        <span>{stg}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            ) : currentResult ? (
              /* Final Comprehensive Verification Report */
              <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 lg:p-9 shadow-lg space-y-6 sm:space-y-7">
                {/* Result Header */}
                <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 pb-6">
                  <div>
                    <div className="flex items-center gap-2.5">
                      <span className="rounded-xl bg-blue-600 px-3.5 py-1 text-xs font-bold text-white shadow-2xs">
                        ${currentResult.ticker}
                      </span>
                      <StatusBadge status={currentResult.verdict} />
                      <RiskBadge level={currentResult.riskLevel} />
                    </div>
                    <span className="text-xs text-slate-400 mt-2 block font-medium">
                      Audit Reference: {currentResult.id} • {currentResult.timestamp}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Credibility Index</span>
                    <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                      {currentResult.credibilityScore}
                      <span className="text-xs font-bold text-slate-400">/100</span>
                    </div>
                  </div>
                </div>

                {/* Claim Statement Under Review */}
                <div className="rounded-2xl bg-slate-50/80 p-4 sm:p-5 border border-slate-100">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Claim Under Review
                  </span>
                  <p className="text-sm font-bold text-slate-900 leading-snug">
                    "{currentResult.claimText}"
                  </p>
                  <p className="mt-2 text-xs text-slate-500">
                    Source: <strong className="text-slate-800">{currentResult.sourceType}</strong>
                  </p>
                </div>

                {/* AI Verdict Box */}
                <div className="rounded-2xl border border-blue-200 bg-blue-50/70 p-5 sm:p-6">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-blue-600" />
                      <h4 className="text-sm font-bold text-blue-900">MTrack AI Synthesis Verdict</h4>
                    </div>
                    <span className="rounded-full bg-blue-600 px-3 py-0.5 text-xs font-bold text-white shadow-2xs">
                      {currentResult.confidenceScore}% Model Confidence
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed text-blue-950 font-medium">
                    {currentResult.summary}
                  </p>
                </div>

                {/* Evidence breakdown */}
                <div className="grid gap-5 sm:grid-cols-2">
                  {/* Evidence For */}
                  <div className="rounded-2xl border border-emerald-100 bg-emerald-50/40 p-5">
                    <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-800 mb-3">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      Supporting Evidence ({currentResult.evidenceFor?.length || 0})
                    </div>
                    <div className="space-y-2.5">
                      {currentResult.evidenceFor && currentResult.evidenceFor.length > 0 ? (
                        currentResult.evidenceFor.map((ev, i) => (
                          <div key={i} className="rounded-2xl bg-white p-3.5 border border-emerald-100 text-xs shadow-2xs">
                            <p className="font-semibold text-slate-800 leading-snug">{ev.text}</p>
                            <div className="mt-2 flex justify-between text-[11px] text-slate-500">
                              <span>Source: {ev.source}</span>
                              <span className="font-bold text-emerald-600">{ev.credibility}% Trust</span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-xs text-slate-500 italic">No credible affirmative evidence identified.</p>
                      )}
                    </div>
                  </div>

                  {/* Evidence Against */}
                  <div className="rounded-2xl border border-rose-100 bg-rose-50/40 p-5">
                    <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-rose-800 mb-3">
                      <AlertOctagon className="h-4 w-4 text-rose-600" />
                      Contradictory Evidence ({currentResult.evidenceAgainst?.length || 0})
                    </div>
                    <div className="space-y-2.5">
                      {currentResult.evidenceAgainst && currentResult.evidenceAgainst.length > 0 ? (
                        currentResult.evidenceAgainst.map((ev, i) => (
                          <div key={i} className="rounded-2xl bg-white p-3.5 border border-rose-100 text-xs shadow-2xs">
                            <p className="font-semibold text-slate-800 leading-snug">{ev.text}</p>
                            <div className="mt-2 flex justify-between text-[11px] text-slate-500">
                              <span>Source: {ev.source}</span>
                              <span className="font-bold text-rose-600">{ev.credibility}% Trust</span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-xs text-slate-500 italic">No contradicting filings recorded.</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actionable Investor Takeaways */}
                <div className="rounded-2xl border border-slate-200 bg-slate-50/90 p-5 text-xs text-slate-600 leading-relaxed">
                  <span className="font-bold text-slate-800 uppercase tracking-wider block mb-1">
                    Investor Advisory Takeaway
                  </span>
                  {currentResult.verdict === 'DEBUNKED' || currentResult.verdict === 'MISLEADING' ? (
                    <p>
                      Avoid reacting to price swings driven by this rumor. Prioritize audited Form 10-Q/10-K filings over social sentiment.
                    </p>
                  ) : currentResult.verdict === 'VERIFIED' ? (
                    <p>
                      The transaction or milestone is officially confirmed by legal records. Factor verified fundamentals into portfolio models.
                    </p>
                  ) : (
                    <p>
                      Hold execution pending primary source verification. Place alerts for incoming Form 8-K disclosures.
                    </p>
                  )}
                </div>

                {/* Reset or Run Another */}
                <div className="flex justify-end pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setClaimText('')
                      setTicker('')
                      setCurrentResult(null)
                    }}
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    Verify Another Claim
                  </Button>
                </div>
              </div>
            ) : (
              /* Initial Empty Callout */
              <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 sm:p-16 text-center space-y-4">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                  <ShieldCheck className="h-8 w-8" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900">
                  Ready to audit financial information
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                  Input any market claim or choose a sample prompt on the left, then click <strong>Verify with MTrack AI</strong> to run our evidence cross-referencing engine.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
