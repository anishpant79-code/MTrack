/**
 * MTrack AI - Modern Geometric Logo & Wordmark
 * Represents financial intelligence, verified data tracking, and market credibility.
 */
export function LogoMark({ size = 36, className = '' }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={`shrink-0 ${className}`}
            aria-hidden="true"
        >
            <defs>
                <linearGradient id="mtrack-grad-primary" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#00C48C" />
                    <stop offset="100%" stopColor="#008F65" />
                </linearGradient>
                <linearGradient id="mtrack-grad-dark" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#1E3E33" />
                    <stop offset="100%" stopColor="#172B24" />
                </linearGradient>
                <filter id="mtrack-glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="2" stdDeviation="2.5" floodColor="#00A878" floodOpacity="0.25" />
                </filter>
            </defs>

            {/* Squircle Background Container */}
            <rect
                x="1"
                y="1"
                width="38"
                height="38"
                rx="11"
                fill="url(#mtrack-grad-dark)"
                stroke="#2A453A"
                strokeWidth="1"
            />

            {/* Subtle background grid pattern */}
            <path
                d="M1 20H39 M20 1V39"
                stroke="#FFFFFF"
                strokeOpacity="0.04"
                strokeWidth="1"
            />

            {/* Financial Candlestick / Bar Chart 1 (Left Leg) */}
            <rect
                x="8"
                y="19"
                width="4.5"
                height="11"
                rx="2"
                fill="#FFFFFF"
                fillOpacity="0.8"
            />
            <path
                d="M10.25 15V19 M10.25 30V32"
                stroke="#FFFFFF"
                strokeOpacity="0.4"
                strokeWidth="1.5"
                strokeLinecap="round"
            />

            {/* Central Ascending Peak & Verification Vector (M Shape) */}
            <path
                d="M12 21L17.5 12.5C18.2 11.5 19.8 11.5 20.5 12.5L24 18L30 8"
                stroke="url(#mtrack-grad-primary)"
                strokeWidth="3.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="url(#mtrack-glow)"
            />

            {/* Verification Check Badge Node at the Summit */}
            <circle
                cx="30.5"
                cy="8.5"
                r="3.5"
                fill="#00E59B"
            />
            <path
                d="M29.5 8.5L30.2 9.2L31.8 7.6"
                stroke="#172B24"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />

            {/* Secondary Financial Bar (Right Leg) */}
            <rect
                x="24"
                y="21"
                width="4.5"
                height="9"
                rx="2"
                fill="#00A878"
                fillOpacity="0.85"
            />
        </svg>
    )
}

export default function MTrackLogo({
    size = 'md',
    showText = true,
    textClassName = '',
    className = '',
}) {
    const sizeMap = {
        sm: { icon: 28, text: 'text-base', badge: 'text-[9px] px-1 py-0.2' },
        md: { icon: 34, text: 'text-lg', badge: 'text-[10px] px-1.5 py-0.5' },
        lg: { icon: 42, text: 'text-2xl', badge: 'text-xs px-2 py-0.5' },
    }

    const current = sizeMap[size] || sizeMap.md

    return (
        <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
            <LogoMark size={current.icon} />

            {showText && (
                <div className="flex items-center gap-1.5">
                    <span className={`font-extrabold tracking-tight text-[#172B24] ${current.text} ${textClassName}`}>
                        MTrack
                    </span>
                    <span className={`inline-flex items-center justify-center font-bold uppercase tracking-wider rounded-md bg-[#E2F0E8] text-[#008F65] border border-[#C5DFD0] ${current.badge}`}>
                        AI
                    </span>
                </div>
            )}
        </div>
    )
}
