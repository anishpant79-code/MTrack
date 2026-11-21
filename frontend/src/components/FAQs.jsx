import { useState } from 'react'

const questions = [
    {
        question: 'What is MTrack AI?',
        answer:
            'MTrack AI is an evidence-first financial intelligence and claim verification platform designed to help retail investors audit corporate growth claims using official exchange disclosures, SEBI filings, and deterministic calculations.',
    },
    {
        question: 'How does MTrack AI verify financial claims?',
        answer:
            'The system extracts key parameters (Company, Metric, Periods, Claimed Growth) using AI, retrieves authenticated disclosures from NSE and SEBI, and performs a strict mathematical comparison against disclosed numbers within an allowed tolerance (±0.5%).',
    },
    {
        question: 'What do Verified, Contradicted and Unverified mean?',
        answer:
            'Verified means official disclosures confirm the claimed growth within allowed tolerance. Contradicted means audited filings reveal conflicting numbers. Unverified means disclosures are missing or inconclusive — MTrack AI never labels a claim false simply because data is absent.',
    },
    {
        question: 'Does MTrack AI provide buy or sell recommendations?',
        answer:
            'No. MTrack AI is purely an evidence-focused verification and analytical platform. It does not provide stock tips, price targets, buy/sell calls, or investment advisory services.',
    },
    {
        question: 'Which sources does MTrack AI retrieve?',
        answer:
            'The platform ingests disclosures directly from National Stock Exchange (NSE India) corporate announcement feeds, Securities and Exchange Board of India (SEBI) regulatory circulars, and certified statutory audit filings.',
    },
    {
        question: 'What is the Transparency Score?',
        answer:
            'The Transparency Score (0-100) measures whether a claim has verifiable primary source links, authenticated filing IDs, audited consolidated figures, and absence of unresolved regulatory ambiguities.',
    },
]

function FAQs() {
    const [openIndex, setOpenIndex] = useState(0)

    return (
        <section id="faqs" className="px-5 sm:px-8 py-20 sm:py-24 bg-white border-t border-[#E2EAE5]">
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-12">
                    <p className="text-xs font-bold tracking-widest text-[#00A878] uppercase">
                        GOT QUESTIONS?
                    </p>

                    <h2 className="text-3xl sm:text-4xl font-extrabold text-[#172B24] mt-2">
                        Frequently Asked Questions
                    </h2>

                    <p className="text-gray-600 mt-3 leading-relaxed text-sm sm:text-base">
                        Everything you need to know about MTrack AI, deterministic verification, and regulatory evidence.
                    </p>
                </div>

                <div className="space-y-3.5">
                    {questions.map((item, index) => {
                        const isOpen = openIndex === index

                        return (
                            <div
                                key={item.question}
                                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                                    isOpen
                                        ? 'border-[#00A878] bg-[#F7FAF8] shadow-xs'
                                        : 'border-[#DCE6DF] bg-white hover:border-[#BFD8C8]'
                                }`}
                            >
                                <button
                                    type="button"
                                    onClick={() => setOpenIndex(isOpen ? -1 : index)}
                                    aria-expanded={isOpen}
                                    aria-controls={`faq-answer-${index}`}
                                    className="w-full flex items-center justify-between gap-4 text-left p-5 sm:p-6 cursor-pointer select-none"
                                >
                                    <span className="font-bold text-[#172B24] text-sm sm:text-base">
                                        {item.question}
                                    </span>

                                    <span
                                        className={`w-7 h-7 shrink-0 rounded-full flex items-center justify-center transition-colors duration-200 ${
                                            isOpen
                                                ? 'bg-[#00A878] text-white'
                                                : 'bg-[#E2F0E8] text-[#008F65]'
                                        }`}
                                    >
                                        <svg
                                            className={`w-3.5 h-3.5 transition-transform duration-200 ${
                                                isOpen ? 'rotate-180' : ''
                                            }`}
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2.5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <polyline points="6 9 12 15 18 9" />
                                        </svg>
                                    </span>
                                </button>

                                {isOpen && (
                                    <div
                                        id={`faq-answer-${index}`}
                                        className="px-5 pb-5 sm:px-6 sm:pb-6 text-xs sm:text-sm text-gray-600 leading-relaxed border-t border-[#EAEFEA] pt-4"
                                    >
                                        {item.answer}
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}

export default FAQs
