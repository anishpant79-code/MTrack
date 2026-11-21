import { ArrowUpRightIcon } from './Icons'

const sources = [
    {
        name: 'NSE India',
        category: 'Stock Exchange',
        description: 'Official corporate announcements, circulars, and quarterly financial filings.',
        url: 'https://www.nseindia.com/',
    },
    {
        name: 'BSE India',
        category: 'Stock Exchange',
        description: 'Primary exchange filings, financial disclosures, and corporate compliance updates.',
        url: 'https://www.bseindia.com/',
    },
    {
        name: 'SEBI',
        category: 'Regulatory Authority',
        description: 'Statutory investor circulars, regulatory guidelines, and enforcement orders.',
        url: 'https://www.sebi.gov.in/',
    },
    {
        name: 'Reuters Markets',
        category: 'Financial News',
        description: 'Independent global market reporting, corporate earnings, and macro analysis.',
        url: 'https://www.reuters.com/markets/',
    },
    {
        name: 'Moneycontrol',
        category: 'Financial News',
        description: 'Indian capital markets coverage, corporate balance sheets, and earnings calls.',
        url: 'https://www.moneycontrol.com/',
    },
    {
        name: 'The Economic Times',
        category: 'Business News',
        description: 'Corporate affairs, quarterly results, economy, and regulatory reporting.',
        url: 'https://economictimes.indiatimes.com/',
    },
]

function TrustedSources() {
    return (
        <section id="sources" className="px-5 sm:px-8 py-20 sm:py-24 bg-[#EDF3EF]">
            <div className="max-w-7xl mx-auto">
                <div className="text-center max-w-2xl mx-auto mb-14">
                    <p className="text-xs font-bold tracking-widest text-[#00A878] uppercase">
                        TRUSTED SOURCES
                    </p>

                    <h2 className="text-3xl sm:text-4xl font-extrabold text-[#172B24] mt-2">
                        Evidence from authenticated origins
                    </h2>

                    <p className="text-gray-600 mt-4 leading-relaxed text-sm sm:text-base">
                        MTrack AI cross-references claims exclusively against recognized exchange repositories, regulatory announcements, and established financial news providers.
                    </p>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sources.map((source) => (
                        <a
                            key={source.name}
                            href={source.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group block bg-white border border-[#DCE6DF] rounded-2xl p-6 hover:border-[#00A878] hover:shadow-md hover:-translate-y-1 transition-all duration-200 cursor-pointer"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <span className="inline-block text-[11px] font-bold text-[#008F65] bg-[#E2F0E8] px-2.5 py-1 rounded-md tracking-wide">
                                    {source.category}
                                </span>

                                <ArrowUpRightIcon className="w-4 h-4 text-gray-400 group-hover:text-[#00A878] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200" />
                            </div>

                            <h3 className="text-lg font-bold text-[#172B24] group-hover:text-[#008F65] transition-colors">
                                {source.name}
                            </h3>

                            <p className="text-xs sm:text-sm text-gray-600 mt-2 leading-relaxed">
                                {source.description}
                            </p>
                        </a>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default TrustedSources
