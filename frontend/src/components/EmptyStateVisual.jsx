/**
 * EmptyStateVisual - High-quality local SVG illustrations for clean empty states.
 * Replaces missing imagery and text placeholders with cohesive fintech graphics.
 */
export default function EmptyStateVisual({ type = 'search', size = 96, className = '' }) {
    if (type === 'saved') {
        return (
            <svg
                width={size}
                height={size}
                viewBox="0 0 120 120"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className={`mx-auto ${className}`}
                aria-hidden="true"
            >
                <circle cx="60" cy="60" r="54" fill="#E2F0E8" fillOpacity="0.6" />
                <rect x="36" y="28" width="48" height="64" rx="8" fill="#FFFFFF" stroke="#DCE6DF" strokeWidth="2" />
                <path d="M48 42H72" stroke="#DCE6DF" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M48 52H64" stroke="#DCE6DF" strokeWidth="2.5" strokeLinecap="round" />
                <rect x="46" y="62" width="28" height="18" rx="4" fill="#F4F8F5" stroke="#00A878" strokeWidth="1.5" strokeDasharray="2 2" />
                {/* Floating Bookmark */}
                <path
                    d="M74 24V48L64 42L54 48V24C54 22.8954 54.8954 22 56 22H72C73.1046 22 74 22.8954 74 24Z"
                    fill="#00A878"
                    filter="drop-shadow(0px 4px 6px rgba(0, 168, 120, 0.25))"
                />
                <circle cx="64" cy="31" r="2.5" fill="#FFFFFF" />
            </svg>
        )
    }

    if (type === 'evidence') {
        return (
            <svg
                width={size}
                height={size}
                viewBox="0 0 120 120"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className={`mx-auto ${className}`}
                aria-hidden="true"
            >
                <circle cx="60" cy="60" r="54" fill="#F4F8F5" />
                <rect x="34" y="30" width="52" height="64" rx="8" fill="#FFFFFF" stroke="#DCE6DF" strokeWidth="2" />
                <line x1="46" y1="44" x2="74" y2="44" stroke="#00A878" strokeWidth="2.5" strokeLinecap="round" />
                <line x1="46" y1="54" x2="70" y2="54" stroke="#DCE6DF" strokeWidth="2" strokeLinecap="round" />
                <line x1="46" y1="64" x2="62" y2="64" stroke="#DCE6DF" strokeWidth="2" strokeLinecap="round" />
                {/* Stamp Seal */}
                <circle cx="70" cy="74" r="14" fill="#E2F0E8" stroke="#00A878" strokeWidth="2" />
                <path d="M66 74L69 77L75 71" stroke="#008F65" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        )
    }

    // Default: 'search' / 'claims'
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 120 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={`mx-auto ${className}`}
            aria-hidden="true"
        >
            <circle cx="60" cy="60" r="54" fill="#EDF3EF" />
            {/* Folder / Document Background */}
            <rect x="32" y="32" width="56" height="58" rx="8" fill="#FFFFFF" stroke="#DCE6DF" strokeWidth="2" />
            <path d="M42 46H78 M42 56H68 M42 66H58" stroke="#DCE6DF" strokeWidth="2.5" strokeLinecap="round" />
            {/* Magnifying Glass */}
            <g transform="translate(10, 10)">
                <circle cx="62" cy="62" r="18" fill="#FFFFFF" stroke="#00A878" strokeWidth="3.5" />
                <circle cx="62" cy="62" r="12" fill="#E2F0E8" fillOpacity="0.4" />
                <line x1="75" y1="75" x2="90" y2="90" stroke="#008F65" strokeWidth="4.5" strokeLinecap="round" />
                <line x1="56" y1="62" x2="68" y2="62" stroke="#00A878" strokeWidth="2" strokeLinecap="round" />
                <line x1="62" y1="56" x2="62" y2="68" stroke="#00A878" strokeWidth="2" strokeLinecap="round" />
            </g>
        </svg>
    )
}
