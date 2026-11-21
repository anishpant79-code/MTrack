import { useNavigate } from 'react-router-dom'
import { ArrowLeftIcon } from './Icons'

/**
 * BackButton - Consistent navigation component across MTrack AI pages.
 * Supports both `fallbackUrl` and `fallbackTo` props.
 * Intelligently uses router history if an in-app session entry exists (window.history.state.idx > 0),
 * or falls back to a guaranteed safe route when accessed via direct URL, bookmark, or after refresh.
 */
export default function BackButton({
    label = 'Back',
    fallbackUrl,
    fallbackTo = '/dashboard',
    className = '',
}) {
    const navigate = useNavigate()
    const target = fallbackUrl || fallbackTo || '/dashboard'

    const handleBack = () => {
        if (
            window.history.state &&
            typeof window.history.state.idx === 'number' &&
            window.history.state.idx > 0
        ) {
            navigate(-1)
        } else {
            navigate(target)
        }
    }

    return (
        <button
            type="button"
            onClick={handleBack}
            className={`inline-flex items-center gap-2 rounded-xl border border-[#DCE6DF] bg-white px-3.5 py-2 text-xs sm:text-sm font-semibold text-gray-700 shadow-xs hover:border-[#00A878] hover:bg-[#F4F8F5] hover:text-[#008F65] transition-all duration-200 cursor-pointer active:scale-[0.98] select-none ${className}`}
            aria-label={label}
        >
            <ArrowLeftIcon className="w-4 h-4 text-gray-500 group-hover:text-[#008F65] transition-colors" />
            <span>{label}</span>
        </button>
    )
}
