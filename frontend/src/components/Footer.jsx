import { Link } from 'react-router-dom'
import MTrackLogo from './MTrackLogo'
import { ArrowRightIcon } from './Icons'

const footerGroups = [
  {
    title: 'Platform',
    links: [
      { label: 'Verify Claims', href: '/verify', isRoute: true },
      { label: 'Claim History', href: '/history', isRoute: true },
      { label: 'Saved Claims', href: '/saved', isRoute: true },
      { label: 'Market Insights', href: '/market-insights', isRoute: true },
      { label: 'Company Research', href: '/company-research', isRoute: true },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Trusted Sources', href: '/#sources', isRoute: false },
      { label: 'How It Works', href: '/#how-it-works', isRoute: false },
      { label: 'Features', href: '/#features', isRoute: false },
      { label: 'About Us', href: '/#about', isRoute: false },
      { label: 'FAQs', href: '/#faqs', isRoute: false },
    ],
  },
]

function Footer() {
  return (
    <footer className="bg-[#E2ECE5] text-[#172B24] border-t border-[#D2E1D7]">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 pt-14 sm:pt-16 pb-8">

        {/* Main Footer */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1.2fr] gap-10 lg:gap-12 pb-12">

          {/* Brand */}
          <div>
            <Link to="/" className="inline-block cursor-pointer">
              <MTrackLogo size="lg" />
            </Link>

            <p className="text-sm font-semibold text-[#008F65] mt-3">
              Evidence over assumptions. Clarity over confusion.
            </p>

            <p className="text-sm text-gray-600 leading-relaxed mt-4 max-w-xs">
              MTrack AI helps retail investors evaluate financial claims using
              audited regulatory disclosures and deterministic verification.
            </p>
          </div>

          {/* Navigation Groups */}
          {footerGroups.map((group) => (
            <div key={group.title}>
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#172B24] mb-4">
                {group.title}
              </h3>

              <ul className="space-y-3">
                {group.links.map((link) => (
                  <li key={link.label}>
                    {link.isRoute ? (
                      <Link
                        to={link.href}
                        className="text-sm text-gray-600 hover:text-[#008F65] transition-colors cursor-pointer"
                      >
                        {link.label}
                      </Link>
                    ) : (
                      <a
                        href={link.href}
                        className="text-sm text-gray-600 hover:text-[#008F65] transition-colors cursor-pointer"
                      >
                        {link.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* About / Financial Intelligence Seal */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#172B24] mb-4">
              Financial Intelligence
            </h3>

            <p className="text-sm text-gray-600 leading-relaxed">
              Transparent, evidence-based verification powered by official SEBI circulars and NSE exchange filings.
            </p>

            <Link
              to="/verify"
              className="inline-flex items-center gap-1.5 mt-4 text-sm font-semibold text-[#008F65] hover:text-[#006F50] transition-colors cursor-pointer group"
            >
              <span>Submit a claim to verify</span>
              <ArrowRightIcon className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>

            <div className="mt-5 p-3.5 rounded-xl bg-white/70 border border-[#D2E1D7]">
              <p className="text-xs font-bold text-[#172B24]">
                Audited Disclosures
              </p>
              <p className="text-xs text-gray-600 leading-5 mt-1">
                NSE Announcements &bull; SEBI Investor Notices &bull; Consolidated Annual Reports
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[#C9D9CF] pt-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <p className="text-xs text-gray-600">
            &copy; {new Date().getFullYear()} MTrack AI. All rights reserved.
          </p>

          <a
            href="#home"
            className="text-xs font-semibold text-gray-600 hover:text-[#008F65] transition-colors cursor-pointer"
          >
            Back to top &uarr;
          </a>
        </div>

        {/* Regulatory Disclaimer */}
        <p className="text-xs text-gray-500 leading-relaxed mt-5 max-w-4xl">
          Disclaimer: MTrack AI provides evidence-based analysis and fact-checking of financial disclosures.
          It does not provide investment advice, buy/sell recommendations, stock tips, or price forecasts.
        </p>
      </div>
    </footer>
  )
}

export default Footer
