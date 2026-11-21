import { Link } from 'react-router-dom'
import Features from '../components/Features'
import Footer from '../components/Footer'
import Navbar from '../components/Navbar'
import ExploreClaims from '../components/ExploreClaims'
import HowItWorks from '../components/HowItWorks'
import About from '../components/About'
import TrustedSources from '../components/TrustedSources'
import FAQs from '../components/FAQs'
import HeroVisual from '../components/HeroVisual'
import { ArrowRightIcon, CheckCircleIcon, SparklesIcon } from '../components/Icons'

function Home() {
    return (
        <div
            id="home"
            className="min-h-screen pt-[72px] bg-[#EDF3EF] text-[#172B24]"
        >
            <Navbar />

            <main>
                {/* Hero Section */}
                <section className="relative max-w-7xl mx-auto px-5 sm:px-8 py-16 sm:py-24 lg:py-28 overflow-hidden">
                    <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                        <div>
                            <div className="inline-flex items-center gap-2 bg-[#E2F0E8] text-[#008F65] px-4 py-2 rounded-full text-xs sm:text-sm font-bold tracking-wide mb-7 border border-[#C5DFD0]">
                                <SparklesIcon className="w-4 h-4 text-[#00A878]" />
                                <span>AI-POWERED FINANCIAL VERIFICATION</span>
                            </div>

                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.15] tracking-tight text-[#172B24]">
                                Don&apos;t just trust
                                <span className="text-[#00A878]"> financial claims.</span>
                                <br />
                                Verify them.
                            </h1>

                            <p className="text-gray-600 text-base sm:text-lg leading-relaxed mt-6 max-w-xl">
                                Understand market claims, quarterly earnings headlines and financial figures
                                through official exchange filings, audited disclosures, and transparent
                                deterministic verification.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 mt-8">
                                <Link
                                    to="/verify"
                                    className="inline-flex items-center justify-center gap-2 bg-[#00A878] hover:bg-[#008F65] text-white px-7 py-3.5 rounded-xl font-semibold transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md active:scale-[0.99]"
                                >
                                    <span>Start Verifying Now</span>
                                    <ArrowRightIcon className="w-4 h-4" />
                                </Link>

                                <a
                                    href="#how-it-works"
                                    className="inline-flex items-center justify-center border border-[#C9D7CE] bg-white hover:border-[#00A878] hover:bg-[#F4F8F5] text-[#172B24] px-7 py-3.5 rounded-xl font-semibold transition-all duration-200 cursor-pointer active:scale-[0.99]"
                                >
                                    Learn How It Works
                                </a>
                            </div>

                            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 mt-9 text-xs sm:text-sm font-medium text-gray-600">
                                <span className="flex items-center gap-2">
                                    <CheckCircleIcon className="w-4 h-4 text-[#00A878]" />
                                    Evidence-focused analysis
                                </span>
                                <span className="flex items-center gap-2">
                                    <CheckCircleIcon className="w-4 h-4 text-[#00A878]" />
                                    NSE &amp; SEBI Disclosures
                                </span>
                                <span className="flex items-center gap-2">
                                    <CheckCircleIcon className="w-4 h-4 text-[#00A878]" />
                                    Deterministic Calculations
                                </span>
                            </div>
                        </div>

                        {/* Financial Intelligence Interactive Graphic Preview */}
                        <div>
                            <HeroVisual />
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <Features />

                {/* Explore Claims Section */}
                <ExploreClaims />

                {/* How It Works Section */}
                <HowItWorks />

                {/* Trusted Sources Section */}
                <TrustedSources />

                {/* About Section */}
                <About />

                {/* FAQs Section */}
                <FAQs />
            </main>

            <Footer />
        </div>
    )
}

export default Home
