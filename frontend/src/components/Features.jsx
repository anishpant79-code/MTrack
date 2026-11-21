const features = [
  {
    number: '01',
    title: 'Financial Claim Verification',
    description:
      'Examine financial statements, corporate performance claims, and social media rumours using official disclosures rather than speculative hearsay.',
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 12l2 2 4-4" />
        <path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11z" />
      </svg>
    ),
  },
  {
    number: '02',
    title: 'Source Credibility Index',
    description:
      'Retrieve and cross-reference information directly from NSE regulatory disclosures, SEBI circulars, and certified statutory audit filings.',
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M2 12h20" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
  },
  {
    number: '03',
    title: 'Deterministic AI Math Audit',
    description:
      'Extract company name, financial metric, and target period via AI, while executing strictly deterministic mathematical formulas to evaluate growth.',
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3v3" />
        <path d="M12 18v3" />
        <path d="M3 12h3" />
        <path d="M18 12h3" />
        <path d="m5.6 5.6 2.1 2.1" />
        <path d="m16.3 16.3 2.1 2.1" />
        <path d="m18.4 5.6-2.1 2.1" />
        <path d="m7.7 16.3-2.1 2.1" />
        <circle cx="12" cy="12" r="4" />
      </svg>
    ),
  },
  {
    number: '04',
    title: 'Noise & Rumour Filtering',
    description:
      'Separate genuine financial fundamentals from market hype, unverified tips, and unsubstantiated percentage assertions.',
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 21v-7" />
        <path d="M4 10V3" />
        <path d="M12 21v-9" />
        <path d="M12 8V3" />
        <path d="M20 21v-5" />
        <path d="M20 12V3" />
        <path d="M2 14h4" />
        <path d="M10 8h4" />
        <path d="M18 16h4" />
      </svg>
    ),
  },
]

function Features() {
  return (
    <section
      id="features"
      className="bg-white py-20 sm:py-24 px-5 sm:px-8 border-b border-[#E2EAE5]"
    >
      <div className="max-w-7xl mx-auto">

        <div className="max-w-2xl mx-auto text-center mb-14">
          <p className="text-[#00A878] text-xs font-bold tracking-widest uppercase">
            WHY MTRACK AI
          </p>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#172B24] mt-3">
            Clarity backed by
            <span className="text-[#00A878]"> intelligent analysis.</span>
          </h2>

          <p className="text-gray-600 mt-4 leading-relaxed text-sm sm:text-base">
            Purpose-built tools designed to evaluate financial claims, verify evidence against authenticated disclosures, and communicate findings transparently.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => (
            <div
              key={feature.number}
              className="group bg-[#F7FAF8] border border-[#DCE6DF] rounded-2xl p-6 sm:p-7 hover:border-[#00A878] hover:bg-white hover:-translate-y-1 hover:shadow-md transition-all duration-200 cursor-default"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 rounded-xl bg-[#E2F0E8] text-[#008F65] flex items-center justify-center group-hover:bg-[#00A878] group-hover:text-white transition-colors duration-200 shadow-xs">
                  {feature.icon}
                </div>

                <span className="text-xs font-extrabold text-gray-400 font-mono tracking-wider">
                  {feature.number}
                </span>
              </div>

              <h3 className="text-base font-bold text-[#172B24] mb-2.5">
                {feature.title}
              </h3>

              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}

export default Features
