const steps = [
  {
    number: '01',
    title: 'Submit a Financial Claim',
    description:
      'Enter an earnings headline, corporate claim, or market statement in plain natural language.',
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <path d="M14 2v6h6" />
        <path d="M8 13h8M8 17h5" />
      </svg>
    ),
  },
  {
    number: '02',
    title: 'Extract Structured Metrics',
    description:
      'AI identifies the company, reporting period, metric (e.g. Revenue), and claimed growth percentage.',
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-4-4" />
        <path d="M8 11h6M11 8v6" />
      </svg>
    ),
  },
  {
    number: '03',
    title: 'Retrieve Official Evidence',
    description:
      'The system examines verified exchange disclosures, SEBI regulatory notices, and audited filings.',
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11z" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    ),
  },
  {
    number: '04',
    title: 'Deterministic Math Verification',
    description:
      'Disclosed numbers are mathematically computed against the claim to determine Verified, Contradicted, or Unverified.',
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 6h13M8 12h13M8 18h13" />
        <path d="M3 6h.01M3 12h.01M3 18h.01" />
      </svg>
    ),
  },
]

function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="py-20 sm:py-24 px-5 sm:px-8 bg-white border-b border-[#E2EAE5]"
    >
      <div className="max-w-7xl mx-auto">

        {/* Section Heading */}
        <div className="max-w-2xl mx-auto text-center mb-16">
          <p className="text-[#00A878] text-xs font-bold tracking-widest uppercase">
            STRUCTURED PROCESS
          </p>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#172B24] mt-2">
            From market claims to
            <span className="text-[#00A878]"> verified evidence.</span>
          </h2>

          <p className="text-gray-600 mt-4 leading-relaxed text-sm sm:text-base">
            MTrack AI enforces a strict multi-stage audit pipeline to examine financial figures and provide an evidence-backed verification summary.
          </p>
        </div>

        {/* Process Steps */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step) => (
            <div
              key={step.number}
              className="group relative bg-[#F7FAF8] border border-[#DCE6DF] rounded-2xl p-6 sm:p-7 hover:border-[#00A878] hover:bg-white hover:-translate-y-1 hover:shadow-md transition-all duration-200 cursor-default"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 rounded-xl bg-[#E2F0E8] text-[#008F65] flex items-center justify-center group-hover:bg-[#00A878] group-hover:text-white transition-colors duration-200 shadow-xs">
                  {step.icon}
                </div>

                <span className="text-xs font-extrabold text-[#00A878] bg-[#E2F0E8] px-2.5 py-1 rounded-md font-mono">
                  STEP {step.number}
                </span>
              </div>

              <h3 className="text-base font-bold text-[#172B24] mb-2.5">
                {step.title}
              </h3>

              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}

export default HowItWorks
