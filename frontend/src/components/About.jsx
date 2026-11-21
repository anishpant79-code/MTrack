import { Link } from 'react-router-dom'
import { CheckCircleIcon, VerifyCheckIcon } from './Icons'

function About() {
  return (
    <section id="about" className="bg-white py-20 sm:py-24 px-5 sm:px-8">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

        <div>
          <p className="text-xs font-bold tracking-wider text-[#00A878] uppercase">
            ABOUT MTRACK AI
          </p>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#172B24] leading-tight mt-3">
            Making financial information
            <span className="text-[#00A878]"> easier to understand.</span>
          </h2>

          <p className="text-gray-600 leading-relaxed mt-6 text-sm sm:text-base">
            Financial claims spread rapidly across news channels, social platforms, and investment groups.
            However, not every sensational headline is supported by authenticated disclosures.
          </p>

          <p className="text-gray-600 leading-relaxed mt-4 text-sm sm:text-base">
            MTrack AI empowers retail investors to verify claims against official exchange filings,
            evaluate the mathematical discrepancy, and understand the transparent evidence without bias.
          </p>

          <Link
            to="/verify"
            className="inline-flex items-center gap-2 mt-8 bg-[#00A878] hover:bg-[#008F65] text-white px-7 py-3 rounded-xl font-semibold transition-all duration-200 cursor-pointer shadow-sm active:scale-[0.99]"
          >
            Explore MTrack AI Verification &rarr;
          </Link>
        </div>

        <div className="bg-[#EDF3EF] border border-[#DCE6DF] rounded-3xl p-6 sm:p-9 transition-all hover:border-[#BBD9C7]">
          <div className="w-12 h-12 rounded-2xl bg-[#E2F0E8] flex items-center justify-center text-[#008F65]">
            <VerifyCheckIcon className="w-6 h-6" />
          </div>

          <h3 className="text-2xl font-bold text-[#172B24] mt-5">
            Our Mission
          </h3>

          <p className="text-gray-600 leading-relaxed mt-3 text-sm">
            To provide everyday investors with the institutional-grade verification tools needed
            to evaluate financial figures critically, separating verified disclosures from market speculation.
          </p>

          <div className="border-t border-[#DCE6DF] mt-7 pt-6 space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-[#172B24]">
              Core Principles
            </h4>

            {[
              ['Evidence over assumptions', 'Every evaluation is grounded in official, audited documents.'],
              ['Deterministic calculations', 'Financial growth is verified mathematically, not guessed by AI.'],
              ['Transparent uncertainty', 'When disclosure figures are missing, claims are labeled Unverified.'],
            ].map(([title, description]) => (
              <div key={title} className="flex items-start gap-3">
                <CheckCircleIcon className="w-5 h-5 text-[#00A878] shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-[#172B24]">{title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}

export default About
