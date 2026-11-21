import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRightIcon, SparklesIcon } from './Icons'

function ExploreClaims() {
    const navigate = useNavigate()
    const [claim, setClaim] = useState('')
    const [message, setMessage] = useState('')

    const sampleClaims = [
        'Tata Consultancy Services consolidated revenue grew by 6.85% in FY2024.',
        'Infosys consolidated net profit jumped by 25% in FY2024.',
        'Reliance Industries consolidated gross revenue grew by 2.59% in FY2024.',
        'Tata Motors electric commercial vehicle deliveries will increase by 45% next financial year.',
    ]

    const handleSubmit = (e) => {
        e.preventDefault()

        const trimmed = claim.trim()
        if (!trimmed) {
            setMessage('Please enter a financial claim first.')
            return
        }

        if (trimmed.length < 10) {
            setMessage('Please enter at least 10 characters so the claim can be evaluated.')
            return
        }

        navigate(`/verify?claim=${encodeURIComponent(trimmed)}`)
    }

    return (
        <section id="explore" className="px-5 sm:px-8 py-20 bg-[#EDF3EF]">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-10">
                    <p className="text-xs font-bold uppercase tracking-widest text-[#00A878]">
                        INTERACTIVE AUDIT
                    </p>

                    <h2 className="text-3xl sm:text-4xl font-extrabold text-[#172B24] mt-2">
                        Have a financial claim?
                        <span className="text-[#00A878]"> Let&apos;s examine it.</span>
                    </h2>

                    <p className="text-gray-600 mt-3 text-sm sm:text-base max-w-xl mx-auto">
                        Type any corporate earnings figure or growth claim for instant AI detail extraction and deterministic evidence verification.
                    </p>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="bg-white border border-[#DCE6DF] rounded-3xl p-6 sm:p-9 shadow-sm transition hover:shadow-md"
                >
                    <label htmlFor="claim" className="block text-sm font-bold text-[#172B24] mb-2.5">
                        Enter financial claim statement
                    </label>

                    <textarea
                        id="claim"
                        value={claim}
                        onChange={(e) => {
                            setClaim(e.target.value)
                            setMessage('')
                        }}
                        rows={3}
                        maxLength={1000}
                        placeholder="e.g. Reliance Industries revenue increased by 15% in FY2026."
                        className="w-full rounded-2xl border border-[#DCE6DF] bg-[#F8FAF8] p-4 text-sm text-[#172B24] outline-none focus:border-[#00A878] focus:bg-white focus:ring-2 focus:ring-[#00A878]/10 transition-all duration-200"
                    />

                    <div className="flex items-center justify-between text-xs text-gray-400 mt-2">
                        <span>{message ? <span className="text-red-600 font-semibold">{message}</span> : 'Natural language claims supported'}</span>
                        <span className="font-mono">{claim.length}/1000</span>
                    </div>

                    {/* Quick Pick Samples */}
                    <div className="mt-4 pt-3 border-t border-[#F0F4F1]">
                        <p className="text-xs font-semibold text-gray-500 mb-2">Or test with a sample claim:</p>
                        <div className="flex flex-wrap gap-2">
                            {sampleClaims.map((sample, idx) => (
                                <button
                                    key={idx}
                                    type="button"
                                    onClick={() => {
                                        setClaim(sample)
                                        setMessage('')
                                    }}
                                    className="text-left text-xs bg-[#F4F8F5] hover:bg-[#E2F0E8] text-[#172B24] hover:text-[#008F65] border border-[#DCE6DF] hover:border-[#00A878] px-3 py-1.5 rounded-lg transition-all duration-150 cursor-pointer"
                                >
                                    &ldquo;{sample}&rdquo;
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 mt-6">
                        <button
                            type="submit"
                            className="inline-flex items-center gap-2 bg-[#00A878] hover:bg-[#008F65] text-white px-7 py-3.5 rounded-xl font-semibold transition-all duration-200 cursor-pointer shadow-sm hover:shadow active:scale-[0.99]"
                        >
                            <SparklesIcon className="w-4 h-4" />
                            <span>Verify with AI</span>
                            <ArrowRightIcon className="w-4 h-4 ml-1" />
                        </button>

                        <button
                            type="button"
                            onClick={() => {
                                setClaim('')
                                setMessage('')
                            }}
                            className="rounded-xl border border-[#DCE6DF] bg-white px-4 py-3.5 text-xs font-semibold text-gray-600 hover:bg-[#F4F7F5] transition cursor-pointer"
                        >
                            Clear Input
                        </button>
                    </div>
                </form>
            </div>
        </section>
    )
}

export default ExploreClaims
