import { useState } from 'react'
import { VerifyCheckIcon, TrendingUpIcon, FileTextIcon, ShieldCheckIcon } from './Icons'

/**
 * HeroVisual - Polished financial intelligence preview component for the Landing Page Hero.
 * Visualizes authentic exchange disclosure verification, data delta, and transparency score.
 * 
 * AUDIT NOTE: Labeled explicitly as an Illustrative Demo Model to ensure zero ambiguity
 * regarding synthetic test figures versus actual statutory disclosures.
 */
export default function HeroVisual() {
    const [activeTab, setActiveTab] = useState('verification') // 'verification' | 'chart'

    return (
        <div className="w-full max-w-xl mx-auto select-none">
            {/* Ambient backdrop glow */}
            <div className="relative">
                <div className="absolute -inset-1.5 rounded-3xl bg-gradient-to-r from-[#00A878]/20 via-[#E2F0E8] to-[#00A878]/10 blur-xl opacity-75" />

                {/* Primary Card */}
                <div className="relative rounded-3xl border border-[#DCE6DF] bg-white p-5 sm:p-7 shadow-xl shadow-[#172B24]/5">
                    
                    {/* Header */}
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#EAEFEA] pb-4">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E2F0E8] text-[#008F65]">
                                <TrendingUpIcon className="w-5 h-5" />
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <h3 className="text-sm font-bold text-[#172B24]">
                                        Reliance Industries Ltd
                                    </h3>
                                    <span className="rounded bg-[#F0F4F1] px-1.5 py-0.5 text-[10px] font-semibold text-gray-500">
                                        NSE: RELIANCE
                                    </span>
                                    <span className="rounded bg-[#FFF4DF] px-2 py-0.5 text-[10px] font-bold text-[#A66A12] border border-[#F3E2C4]">
                                        Demo Model
                                    </span>
                                </div>
                                <p className="text-xs text-gray-400">
                                    Interactive Demonstration &bull; Synthetic Case Study
                                </p>
                            </div>
                        </div>

                        {/* Status Badge with Live Pulsing Dot */}
                        <div className="inline-flex items-center gap-1.5 rounded-full border border-[#00A878]/30 bg-[#E7F5EC] px-3 py-1 text-xs font-bold text-[#008F65]">
                            <span className="relative flex h-2 w-2">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#00A878] opacity-75" />
                                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#00A878]" />
                            </span>
                            Verified (Demo)
                        </div>
                    </div>

                    {/* Claim Statement Box */}
                    <div className="mt-4 rounded-2xl border border-[#DCE6DF] bg-[#F7FAF8] p-4">
                        <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                            <span>Evaluated Demo Claim</span>
                            <span className="text-[#008F65] font-semibold">Simulated Model Match</span>
                        </div>
                        <p className="text-sm font-medium text-[#172B24] leading-relaxed">
                            &ldquo;Reliance Industries revenue increased by 15% in FY2026.&rdquo;
                        </p>
                    </div>

                    {/* Interactive Tabs */}
                    <div className="mt-4 flex items-center gap-2 border-b border-[#EAEFEA] pb-3 text-xs font-semibold">
                        <button
                            type="button"
                            onClick={() => setActiveTab('verification')}
                            className={`rounded-lg px-3 py-1.5 transition-all duration-200 cursor-pointer ${
                                activeTab === 'verification'
                                    ? 'bg-[#00A878] text-white shadow-xs'
                                    : 'text-gray-500 hover:text-[#172B24] hover:bg-[#F4F7F5]'
                            }`}
                        >
                            Mathematical Audit
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab('chart')}
                            className={`rounded-lg px-3 py-1.5 transition-all duration-200 cursor-pointer ${
                                activeTab === 'chart'
                                    ? 'bg-[#00A878] text-white shadow-xs'
                                    : 'text-gray-500 hover:text-[#172B24] hover:bg-[#F4F7F5]'
                            }`}
                        >
                            Revenue Trajectory (5Y)
                        </button>
                    </div>

                    {activeTab === 'verification' ? (
                        <>
                            {/* Deterministic Calculation Grid */}
                            <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center">
                                <div className="rounded-xl border border-[#E1E9E3] bg-white p-2.5">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase">Simulated Base (FY25)</p>
                                    <p className="text-xs sm:text-sm font-extrabold text-[#172B24] mt-0.5 tabular-nums">
                                        ₹100,000 Cr
                                    </p>
                                </div>
                                <div className="rounded-xl border border-[#E1E9E3] bg-white p-2.5">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase">Simulated Target (FY26)</p>
                                    <p className="text-xs sm:text-sm font-extrabold text-[#172B24] mt-0.5 tabular-nums">
                                        ₹115,000 Cr
                                    </p>
                                </div>
                                <div className="rounded-xl border border-[#00A878]/30 bg-[#E2F0E8]/50 p-2.5">
                                    <p className="text-[10px] font-bold text-[#008F65] uppercase">Calculated Growth</p>
                                    <p className="text-xs sm:text-sm font-extrabold text-[#008F65] mt-0.5 tabular-nums">
                                        +15.00%
                                    </p>
                                </div>
                                <div className="rounded-xl border border-[#E1E9E3] bg-white p-2.5">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase">Claimed Growth</p>
                                    <p className="text-xs sm:text-sm font-extrabold text-[#172B24] mt-0.5 tabular-nums">
                                        15.00%
                                    </p>
                                </div>
                            </div>

                            {/* Evidence Citation Details */}
                            <div className="mt-4 rounded-xl border border-[#E6ECE7] bg-[#FAFCFA] p-3 flex items-center justify-between text-xs">
                                <div className="flex items-center gap-2">
                                    <FileTextIcon className="w-4 h-4 text-[#008F65]" />
                                    <div>
                                        <p className="font-semibold text-[#172B24]">
                                            Illustrative Filing Citation (Demo Model)
                                        </p>
                                        <p className="text-[11px] text-gray-400">
                                            Model Ref: DEMO-NSE-2026 &bull; Engine Tolerance: &plusmn;0.5%
                                        </p>
                                    </div>
                                </div>
                                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#008F65]">
                                    <ShieldCheckIcon className="w-3.5 h-3.5" />
                                    Verified (Simulated)
                                </span>
                            </div>
                        </>
                    ) : (
                        /* SVG Area Chart */
                        <div className="mt-4">
                            <p className="text-[11px] font-semibold text-gray-400 mb-2">
                                Simulated 5-Year Revenue Trend (Illustrative Demo Model)
                            </p>
                            <div className="h-32 w-full pt-1">
                                <svg viewBox="0 0 400 120" className="w-full h-full overflow-visible">
                                    <defs>
                                        <linearGradient id="hero-chart-gradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#00A878" stopOpacity="0.3" />
                                            <stop offset="100%" stopColor="#00A878" stopOpacity="0.0" />
                                        </linearGradient>
                                    </defs>

                                    {/* Grid Lines */}
                                    <line x1="0" y1="20" x2="400" y2="20" stroke="#EAEFEA" strokeDasharray="3 3" />
                                    <line x1="0" y1="60" x2="400" y2="60" stroke="#EAEFEA" strokeDasharray="3 3" />
                                    <line x1="0" y1="100" x2="400" y2="100" stroke="#EAEFEA" strokeDasharray="3 3" />

                                    {/* Area Fill */}
                                    <polygon
                                        fill="url(#hero-chart-gradient)"
                                        points="10,105 85,92 165,75 250,55 335,40 390,20 390,115 10,115"
                                    />

                                    {/* Trend Line */}
                                    <polyline
                                        fill="none"
                                        stroke="#00A878"
                                        strokeWidth="3"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        points="10,105 85,92 165,75 250,55 335,40 390,20"
                                    />

                                    {/* Data Points */}
                                    {[
                                        { x: 10, y: 105, label: 'FY22' },
                                        { x: 85, y: 92, label: 'FY23' },
                                        { x: 165, y: 75, label: 'FY24' },
                                        { x: 250, y: 55, label: 'FY25' },
                                        { x: 390, y: 20, label: 'FY26' },
                                    ].map((pt, i) => (
                                        <g key={i}>
                                            <circle cx={pt.x} cy={pt.y} r="4" fill="#FFFFFF" stroke="#00A878" strokeWidth="2.5" />
                                            <text x={pt.x} y="118" textAnchor="middle" fontSize="9" fill="#9CA3AF" fontWeight="600">
                                                {pt.label}
                                            </text>
                                        </g>
                                    ))}
                                </svg>
                            </div>
                        </div>
                    )}

                    {/* Transparency Score Bar */}
                    <div className="mt-5 border-t border-[#EAEFEA] pt-4">
                        <div className="flex items-center justify-between text-xs">
                            <span className="font-semibold text-gray-500 flex items-center gap-1.5">
                                <VerifyCheckIcon className="w-3.5 h-3.5 text-[#00A878]" />
                                Demonstration Transparency Score
                            </span>
                            <span className="font-bold text-[#008F65] text-sm tabular-nums">
                                96 / 100
                            </span>
                        </div>
                        <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-[#EAEFEA]">
                            <div className="h-full rounded-full bg-gradient-to-r from-[#00A878] to-[#00C48C] transition-all duration-700" style={{ width: '96%' }} />
                        </div>
                    </div>

                    {/* Credibility & Audit Footnote */}
                    <div className="mt-4 rounded-xl bg-[#F4F7F5] border border-[#DCE6DF] p-3 text-[11px] text-gray-500 leading-relaxed">
                        <span className="font-semibold text-[#172B24]">Credibility Notice:</span> The figures and citations displayed in this card are synthetic demo figures demonstrating MTrack AI&apos;s deterministic verification algorithm. Retail investors should evaluate actual claims using primary statutory filings from SEBI, BSE, or NSE.
                    </div>
                </div>
            </div>
        </div>
    )
}
