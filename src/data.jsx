// src/data.jsx - Financial data, Claims dataset, Market indicators & Persistence helpers

export const INITIAL_STOCKS = [
  {
    ticker: 'NVDA',
    name: 'NVIDIA Corporation',
    price: 138.25,
    change: 3.45,
    changePercent: 2.56,
    marketCap: '$3.40T',
    peRatio: 52.8,
    volume: '54.2M',
    high52: 140.76,
    low52: 45.12,
    sector: 'Semiconductors',
    veracityScore: 92,
    riskLevel: 'Moderate',
    sentiment: 'Bullish',
    activeClaimsCount: 4,
    description: 'NVIDIA is the pioneer of GPU-accelerated computing and the undisputed market leader in AI hardware and high-performance computing platforms.',
    history: [
      { time: '09:30', price: 134.80, volume: 4.2 },
      { time: '10:30', price: 135.90, volume: 8.5 },
      { time: '11:30', price: 136.40, volume: 14.1 },
      { time: '12:30', price: 137.10, volume: 20.3 },
      { time: '13:30', price: 136.80, volume: 28.7 },
      { time: '14:30', price: 137.95, volume: 38.2 },
      { time: '15:30', price: 138.10, volume: 46.5 },
      { time: '16:00', price: 138.25, volume: 54.2 },
    ]
  },
  {
    ticker: 'AAPL',
    name: 'Apple Inc.',
    price: 228.60,
    change: -1.20,
    changePercent: -0.52,
    marketCap: '$3.48T',
    peRatio: 33.4,
    volume: '42.1M',
    high52: 237.23,
    low52: 164.08,
    sector: 'Consumer Electronics',
    veracityScore: 88,
    riskLevel: 'Low',
    sentiment: 'Neutral',
    activeClaimsCount: 3,
    description: 'Apple designs, manufactures, and markets smartphones, personal computers, tablets, wearables, and accessories, along with software and services.',
    history: [
      { time: '09:30', price: 229.80, volume: 3.8 },
      { time: '10:30', price: 229.20, volume: 7.9 },
      { time: '11:30', price: 228.90, volume: 13.5 },
      { time: '12:30', price: 228.40, volume: 19.2 },
      { time: '13:30', price: 228.10, volume: 24.8 },
      { time: '14:30', price: 228.30, volume: 32.1 },
      { time: '15:30', price: 228.50, volume: 38.6 },
      { time: '16:00', price: 228.60, volume: 42.1 },
    ]
  },
  {
    ticker: 'MSFT',
    name: 'Microsoft Corporation',
    price: 432.10,
    change: 4.80,
    changePercent: 1.12,
    marketCap: '$3.21T',
    peRatio: 36.2,
    volume: '21.4M',
    high52: 468.35,
    low52: 366.50,
    sector: 'Cloud & Software',
    veracityScore: 95,
    riskLevel: 'Low',
    sentiment: 'Bullish',
    activeClaimsCount: 2,
    description: 'Microsoft develops and licenses enterprise cloud solutions, software products, AI services via Azure, devices, and digital gaming platforms.',
    history: [
      { time: '09:30', price: 427.50, volume: 2.1 },
      { time: '10:30', price: 429.00, volume: 5.4 },
      { time: '11:30', price: 430.20, volume: 8.9 },
      { time: '12:30', price: 431.00, volume: 11.8 },
      { time: '13:30', price: 430.70, volume: 14.5 },
      { time: '14:30', price: 431.50, volume: 17.2 },
      { time: '15:30', price: 431.90, volume: 19.8 },
      { time: '16:00', price: 432.10, volume: 21.4 },
    ]
  },
  {
    ticker: 'TSLA',
    name: 'Tesla, Inc.',
    price: 246.80,
    change: 11.20,
    changePercent: 4.75,
    marketCap: '$786.5B',
    peRatio: 68.4,
    volume: '88.3M',
    high52: 271.00,
    low52: 138.80,
    sector: 'Automotive & Clean Energy',
    veracityScore: 68,
    riskLevel: 'High',
    sentiment: 'Bullish',
    activeClaimsCount: 8,
    description: 'Tesla designs, manufactures, and sells fully electric vehicles, energy generation and storage systems, and autonomous driving software.',
    history: [
      { time: '09:30', price: 236.00, volume: 9.5 },
      { time: '10:30', price: 239.50, volume: 21.0 },
      { time: '11:30', price: 242.00, volume: 34.5 },
      { time: '12:30', price: 244.20, volume: 46.1 },
      { time: '13:30', price: 243.80, volume: 58.2 },
      { time: '14:30', price: 245.50, volume: 71.0 },
      { time: '15:30', price: 246.20, volume: 81.4 },
      { time: '16:00', price: 246.80, volume: 88.3 },
    ]
  },
  {
    ticker: 'GOOGL',
    name: 'Alphabet Inc.',
    price: 182.40,
    change: 2.15,
    changePercent: 1.19,
    marketCap: '$2.26T',
    peRatio: 24.1,
    volume: '26.8M',
    high52: 191.75,
    low52: 129.40,
    sector: 'Internet & Search',
    veracityScore: 90,
    riskLevel: 'Low',
    sentiment: 'Bullish',
    activeClaimsCount: 3,
    description: 'Alphabet provides web-based search, advertisements, maps, cloud computing, software, operating systems, and autonomous mobility via Waymo.',
    history: [
      { time: '09:30', price: 180.20, volume: 2.9 },
      { time: '10:30', price: 181.10, volume: 6.8 },
      { time: '11:30', price: 181.80, volume: 11.2 },
      { time: '12:30', price: 182.00, volume: 15.6 },
      { time: '13:30', price: 181.90, volume: 19.3 },
      { time: '14:30', price: 182.20, volume: 22.8 },
      { time: '15:30', price: 182.35, volume: 25.1 },
      { time: '16:00', price: 182.40, volume: 26.8 },
    ]
  },
  {
    ticker: 'AMZN',
    name: 'Amazon.com, Inc.',
    price: 197.50,
    change: -0.85,
    changePercent: -0.43,
    marketCap: '$2.06T',
    peRatio: 42.6,
    volume: '34.7M',
    high52: 201.20,
    low52: 140.25,
    sector: 'E-Commerce & Cloud',
    veracityScore: 91,
    riskLevel: 'Low',
    sentiment: 'Neutral',
    activeClaimsCount: 2,
    description: 'Amazon focuses on e-commerce, cloud computing infrastructure (AWS), online advertising, digital streaming subscriptions, and hardware.',
    history: [
      { time: '09:30', price: 198.80, volume: 3.4 },
      { time: '10:30', price: 198.20, volume: 8.2 },
      { time: '11:30', price: 197.90, volume: 13.9 },
      { time: '12:30', price: 197.40, volume: 18.7 },
      { time: '13:30', price: 197.10, volume: 23.5 },
      { time: '14:30', price: 197.30, volume: 28.1 },
      { time: '15:30', price: 197.45, volume: 32.0 },
      { time: '16:00', price: 197.50, volume: 34.7 },
    ]
  },
  {
    ticker: 'META',
    name: 'Meta Platforms, Inc.',
    price: 588.20,
    change: 8.40,
    changePercent: 1.45,
    marketCap: '$1.49T',
    peRatio: 28.9,
    volume: '16.5M',
    high52: 602.95,
    low52: 296.80,
    sector: 'Social Platforms',
    veracityScore: 86,
    riskLevel: 'Moderate',
    sentiment: 'Bullish',
    activeClaimsCount: 3,
    description: 'Meta builds technologies that help people connect, find communities, and grow businesses across Instagram, WhatsApp, Messenger, and Quest.',
    history: [
      { time: '09:30', price: 580.00, volume: 1.8 },
      { time: '10:30', price: 583.50, volume: 4.5 },
      { time: '11:30', price: 585.10, volume: 7.2 },
      { time: '12:30', price: 586.40, volume: 9.8 },
      { time: '13:30', price: 586.00, volume: 11.9 },
      { time: '14:30', price: 587.20, volume: 14.1 },
      { time: '15:30', price: 588.00, volume: 15.6 },
      { time: '16:00', price: 588.20, volume: 16.5 },
    ]
  },
  {
    ticker: 'PLTR',
    name: 'Palantir Technologies',
    price: 61.40,
    change: 3.20,
    changePercent: 5.50,
    marketCap: '$137.2B',
    peRatio: 114.2,
    volume: '76.8M',
    high52: 66.00,
    low52: 15.72,
    sector: 'Data & Enterprise AI',
    veracityScore: 74,
    riskLevel: 'High',
    sentiment: 'Bullish',
    activeClaimsCount: 6,
    description: 'Palantir builds software platforms for government intelligence agencies and enterprise commercial operations to integrate data and deploy AI models.',
    history: [
      { time: '09:30', price: 58.40, volume: 8.2 },
      { time: '10:30', price: 59.80, volume: 19.5 },
      { time: '11:30', price: 60.50, volume: 31.0 },
      { time: '12:30', price: 61.00, volume: 42.4 },
      { time: '13:30', price: 60.70, volume: 53.6 },
      { time: '14:30', price: 61.20, volume: 64.1 },
      { time: '15:30', price: 61.35, volume: 72.0 },
      { time: '16:00', price: 61.40, volume: 76.8 },
    ]
  },
  {
    ticker: 'AMD',
    name: 'Advanced Micro Devices',
    price: 141.50,
    change: -2.30,
    changePercent: -1.60,
    marketCap: '$229.4B',
    peRatio: 112.0,
    volume: '39.4M',
    high52: 227.30,
    low52: 121.80,
    sector: 'Semiconductors',
    veracityScore: 85,
    riskLevel: 'Moderate',
    sentiment: 'Neutral',
    activeClaimsCount: 3,
    description: 'AMD designs semiconductor processing products including microprocessors, GPUs, and APUs for data centers, gaming, and embedded systems.',
    history: [
      { time: '09:30', price: 143.90, volume: 4.1 },
      { time: '10:30', price: 143.10, volume: 9.6 },
      { time: '11:30', price: 142.50, volume: 15.8 },
      { time: '12:30', price: 142.00, volume: 21.5 },
      { time: '13:30', price: 141.80, volume: 27.2 },
      { time: '14:30', price: 141.40, volume: 32.7 },
      { time: '15:30', price: 141.60, volume: 37.1 },
      { time: '16:00', price: 141.50, volume: 39.4 },
    ]
  }
];

export const INITIAL_CLAIMS = [
  {
    id: 'CLM-1082',
    title: 'NVIDIA reports 40% margin squeeze on next-gen Blackwell rack server packaging',
    claimSummary: 'Anonymous posts circulating on tech forums allege major heat dissipating yields are compressing Blackwell architecture gross margins down from 75% to 35%.',
    ticker: 'NVDA',
    category: 'Technology & Hardware',
    sourceName: 'FinTwit Forum Leak',
    sourceType: 'Social Media / Unverified Forum',
    sourceCredibility: 32,
    date: '2 hours ago',
    status: 'DEBUNKED',
    confidenceScore: 94,
    marketImpact: 'High',
    aiVerdictSummary: 'False rumor. TSMC official packaging yield reports and NVIDIA Form 10-Q guidance confirm gross margins remain safely guided in the 74.5% - 75.5% corridor.',
    evidenceFor: [
      { text: 'Unverified forum post citing purported ODM assembly contract in Taiwan', credibility: 24, source: 'X / HardwareLeaker99' },
      { text: 'Previous historical delays in B200 stepping revision cited as circumstantial proxy', credibility: 40, source: 'Semiconductor blog post' }
    ],
    evidenceAgainst: [
      { text: 'TSMC CoWoS capacity report filed with Taiwan Stock Exchange shows 98.4% package yields', credibility: 98, source: 'Taiwan Stock Exchange Regulatory Filing' },
      { text: 'CFO Colette Kress reiterate FY25 gross margin outlook at Goldman Sachs Communacopia', credibility: 96, source: 'Goldman Sachs Tech Conference Transcript' },
      { text: 'Audited balance sheet provisions show standard warranty reserves without spike', credibility: 99, source: 'SEC Form 10-Q filing' }
    ],
    upvotes: 342,
    commentsCount: 68
  },
  {
    id: 'CLM-1081',
    title: 'Apple entering advanced merger discussions to acquire Rivian Automotive for $14B',
    claimSummary: 'Speculation on investment chat rooms claims Apple has revived Project Titan by initiating confidential acquisition talks with EV manufacturer Rivian.',
    ticker: 'AAPL',
    category: 'Mergers & Acquisitions',
    sourceName: 'Substack Newsletter & Reddit WSB',
    sourceType: 'Anonymous Newsletter',
    sourceCredibility: 28,
    date: '4 hours ago',
    status: 'MISLEADING',
    confidenceScore: 89,
    marketImpact: 'High',
    aiVerdictSummary: 'Highly misleading speculation. While Apple has explored automotive software partnerships with several EV vendors, no regulatory Hart-Scott-Rodino filings or investment bank engagements exist for an acquisition.',
    evidenceFor: [
      { text: 'Rivian software engineers hired by Apple AI foundation team in Cupertino', credibility: 65, source: 'LinkedIn Talent Movement Data' },
      { text: 'Executive travel spotted between Normal, Illinois and San Jose', credibility: 30, source: 'Flight tracking social post' }
    ],
    evidenceAgainst: [
      { text: 'Volkswagen Group joint venture already locked exclusive software licensing with Rivian', credibility: 97, source: 'VW Group Official Press Release' },
      { text: 'Rivian CEO RJ Scaringe explicitly denied sale intentions during Q3 earnings conference', credibility: 95, source: 'Rivian Earnings Call Transcript' },
      { text: 'Apple Board resolution dissolved vehicle manufacturing capital expenditure commitments in March', credibility: 94, source: 'Bloomberg Enterprise Reporting' }
    ],
    upvotes: 521,
    commentsCount: 142
  },
  {
    id: 'CLM-1080',
    title: 'Microsoft signs landmark $10B enterprise sovereign cloud contract with European Union',
    claimSummary: 'Regulatory compliance filings confirm Microsoft Azure was selected as prime sovereign infrastructure provider for 14 EU defense and administrative agencies.',
    ticker: 'MSFT',
    category: 'Government & Cloud',
    sourceName: 'EU Official Journal & Reuters',
    sourceType: 'Mainstream Financial Press',
    sourceCredibility: 96,
    date: '6 hours ago',
    status: 'VERIFIED',
    confidenceScore: 98,
    marketImpact: 'Medium',
    aiVerdictSummary: 'Verified factual contract award. Contract reference EU-DIGIT-2024-C9 is formally recorded in the Tenders Electronic Daily database with multi-year framework allocations.',
    evidenceFor: [
      { text: 'Tenders Electronic Daily (TED) formal public procurement award notice published', credibility: 99, source: 'European Union Official Gazette' },
      { text: 'Reuters and Bloomberg Brussels bureau corroboration with signed signatory statements', credibility: 95, source: 'Reuters Business Wire' },
      { text: 'Microsoft President Brad Smith announced European Cloud Sovereignty Pledge milestone', credibility: 92, source: 'Microsoft Official Blog' }
    ],
    evidenceAgainst: [
      { text: 'French privacy advocates filed formal review petition with CJEU regarding CLOUD Act reach', credibility: 80, source: 'Politico Europe' }
    ],
    upvotes: 689,
    commentsCount: 45
  },
  {
    id: 'CLM-1079',
    title: 'Tesla Robotaxi commercial permit approved for unrestricted California operations',
    claimSummary: 'Viral social media video claims Tesla has received unconditional autonomous passenger service operating authority from the California DMV and CPUC.',
    ticker: 'TSLA',
    category: 'Autonomous Driving & Regulation',
    sourceName: 'X / Influencer Post',
    sourceType: 'Social Media Video',
    sourceCredibility: 41,
    date: '8 hours ago',
    status: 'MISLEADING',
    confidenceScore: 92,
    marketImpact: 'High',
    aiVerdictSummary: 'Misleading half-truth. Tesla holds testing permits with safety drivers present, but the California DMV official licensing database shows NO application or grant for Driverless Passenger Service.',
    evidenceFor: [
      { text: 'Tesla holds active California Autonomous Vehicle Testing permit with safety drivers', credibility: 98, source: 'California DMV Autonomous Records' },
      { text: 'Recent test vehicle observed near Burbank studio facilities', credibility: 50, source: 'Local bystander video' }
    ],
    evidenceAgainst: [
      { text: 'California Public Utilities Commission (CPUC) confirmed Tesla has not submitted Phase 2 permit filing', credibility: 99, source: 'CPUC Official Press Liaison' },
      { text: 'Alphabet Waymo is currently the only entity permitted for paid commercial driverless rides statewide', credibility: 97, source: 'State Transport Registry' }
    ],
    upvotes: 890,
    commentsCount: 230
  },
  {
    id: 'CLM-1078',
    title: 'Palantir awards $480M Maven Smart System defense expansion contract',
    claimSummary: 'Department of Defense contract database confirms Palantir USG Inc awarded firm-fixed-price task order for AI-enabled target identification algorithms.',
    ticker: 'PLTR',
    category: 'Defense & AI',
    sourceName: 'US Department of Defense Contracts',
    sourceType: 'Government Contract Portal',
    sourceCredibility: 99,
    date: '12 hours ago',
    status: 'VERIFIED',
    confidenceScore: 99,
    marketImpact: 'Medium',
    aiVerdictSummary: 'Verified accurate government contract. Recorded under Defense contract modification W911NF-24-C-0032 with performance completion scheduled through May 2029.',
    evidenceFor: [
      { text: 'DoD Daily Release of Contracts records $480,000,000 award to Palantir Technologies Inc', credibility: 100, source: 'defense.gov/News/Contracts' },
      { text: 'SEC Form 8-K filing posted on EDGAR system detailing material customer contract', credibility: 99, source: 'SEC EDGAR System' }
    ],
    evidenceAgainst: [],
    upvotes: 412,
    commentsCount: 31
  },
  {
    id: 'CLM-1077',
    title: 'Alphabet facing forced divestiture of Chrome browser and Android OS in DOJ antitrust remedy',
    claimSummary: 'Leaked draft proposals from Department of Justice antitrust division outline structural breakup remedies requiring Alphabet to spin off its web browser division.',
    ticker: 'GOOGL',
    category: 'Antitrust & Legal',
    sourceName: 'Bloomberg News Special Report',
    sourceType: 'Mainstream Financial Press',
    sourceCredibility: 94,
    date: '1 day ago',
    status: 'VERIFIED',
    confidenceScore: 95,
    marketImpact: 'High',
    aiVerdictSummary: 'Verified legal proceeding filing. While divestiture is a requested remedy from prosecutors in U.S. v. Google, judicial approval is subject to multi-year appeals before implementation.',
    evidenceFor: [
      { text: 'DOJ proposed final judgment framework submitted to Judge Amit Mehta in D.C. District Court', credibility: 99, source: 'U.S. District Court Docket #20-cv-03010' },
      { text: 'DOJ Antitrust Division Assistant Attorney General Jonathan Kanter briefing quotes', credibility: 96, source: 'DOJ Press Release' }
    ],
    evidenceAgainst: [
      { text: 'Alphabet legal counsel filed motion indicating comprehensive appeal to DC Circuit upon final ruling', credibility: 95, source: 'Alphabet Legal Affairs statement' }
    ],
    upvotes: 754,
    commentsCount: 189
  },
  {
    id: 'CLM-1076',
    title: 'Amazon Web Services suffering widespread silent outages across US-East-1 datacenter cluster',
    claimSummary: 'Social claims allege major financial institutions and streaming services are failing over due to catastrophic fiber cuts in Northern Virginia.',
    ticker: 'AMZN',
    category: 'Cloud & Infrastructure',
    sourceName: 'FinTwit / Downdetector User Spikes',
    sourceType: 'Social Media Crowdsourcing',
    sourceCredibility: 35,
    date: '1 day ago',
    status: 'UNVERIFIED',
    confidenceScore: 78,
    marketImpact: 'Medium',
    aiVerdictSummary: 'Unverified transient incident. AWS Health Dashboard shows 99.98% green status with only isolated third-party DNS resolver latency reported by one regional ISP.',
    evidenceFor: [
      { text: 'Spike in user reports on Downdetector for several retail banking apps', credibility: 45, source: 'Downdetector crowdsourced graphs' }
    ],
    evidenceAgainst: [
      { text: 'AWS Service Health Dashboard confirmed all EC2 and S3 API endpoints operating normally', credibility: 97, source: 'status.aws.amazon.com' },
      { text: 'Major internet exchange route monitors in Ashburn VA report zero packet drop', credibility: 95, source: 'Cloudflare Radar & ThousandEyes telemetry' }
    ],
    upvotes: 182,
    commentsCount: 52
  },
  {
    id: 'CLM-1075',
    title: 'Meta Platforms deploying proprietary silicon MTIA v2 across 100% of Llama 4 training clusters',
    claimSummary: 'Tech blog article asserts Meta has completely stopped procurement of commercial NVIDIA H100 GPUs and migrated entire next-gen LLM training to internal ASIC chips.',
    ticker: 'META',
    category: 'Hardware & Artificial Intelligence',
    sourceName: 'Independent Tech Blog',
    sourceType: 'Blog / Analysis',
    sourceCredibility: 58,
    date: '2 days ago',
    status: 'MISLEADING',
    confidenceScore: 88,
    marketImpact: 'Medium',
    aiVerdictSummary: 'Misleading exaggeration. Meta MTIA silicon is currently utilized primarily for recommendation inference workloads, whereas Llama 4 frontier pre-training remains on 100k+ NVIDIA clusters.',
    evidenceFor: [
      { text: 'Mark Zuckerberg public post showcasing MTIA generation 2 deployment for ranking ads', credibility: 92, source: 'Meta AI Research announcement' }
    ],
    evidenceAgainst: [
      { text: 'Meta reported $37B - $40B CapEx guidance with specific confirmation of external GPU orders', credibility: 98, source: 'SEC Form 10-Q filing' },
      { text: 'NVIDIA CEO Jensen Huang confirmed delivery schedules to Meta datacenter teams', credibility: 93, source: 'NVIDIA GTC Keynote Q&A' }
    ],
    upvotes: 295,
    commentsCount: 38
  }
];

export const SOURCE_CREDIBILITY_LEADERBOARD = [
  { source: 'SEC EDGAR Filings', score: 99, category: 'Official Regulatory', verifiedCount: 1420, disputedCount: 2 },
  { source: 'Audited Financial Statements', score: 98, category: 'Audit / Legal', verifiedCount: 980, disputedCount: 4 },
  { source: 'Bloomberg Terminal Data', score: 94, category: 'Institutional Press', verifiedCount: 2840, disputedCount: 48 },
  { source: 'Reuters Business Wire', score: 92, category: 'Tier 1 Wire', verifiedCount: 3120, disputedCount: 62 },
  { source: 'Wall Street Journal Newsroom', score: 90, category: 'Financial Journalism', verifiedCount: 1950, disputedCount: 54 },
  { source: 'Company Investor Relations PR', score: 82, category: 'Corporate PR', verifiedCount: 2200, disputedCount: 180 },
  { source: 'Sell-Side Equity Research', score: 76, category: 'Investment Banking', verifiedCount: 1450, disputedCount: 290 },
  { source: 'Verified Industry Insiders (LinkedIn)', score: 62, category: 'Professional Network', verifiedCount: 680, disputedCount: 210 },
  { source: 'Financial Twitter / X Accounts', score: 44, category: 'Social Media', verifiedCount: 1240, disputedCount: 1840 },
  { source: 'Reddit (r/WallStreetBets & Stocks)', score: 38, category: 'Online Forum', verifiedCount: 890, disputedCount: 1620 },
  { source: 'Anonymous Telegram / Discord Channels', score: 22, category: 'Encrypted Chat', verifiedCount: 210, disputedCount: 1140 },
];

export const MARKET_METRICS = {
  totalClaimsAnalyzed: '14,892',
  verifiedRate: '68.4%',
  rumorsDebunked: '4,108',
  highRiskAlertsToday: 7,
  activeTrackedTickers: 284,
  aiConfidenceAvg: '94.2%',
  indices: [
    { symbol: 'S&P 500', value: '5,894.20', change: '+28.40', percent: '+0.48%', positive: true },
    { symbol: 'NASDAQ', value: '18,872.10', change: '+156.80', percent: '+0.84%', positive: true },
    { symbol: 'DOW JONES', value: '43,440.15', change: '-45.20', percent: '-0.10%', positive: false },
    { symbol: 'VIX (Volatility)', value: '14.82', change: '-0.74', percent: '-4.76%', positive: true },
  ]
};

export const SAMPLE_CLAIMS_FOR_VERIFICATION = [
  {
    title: 'Tech conglomerate secret $15B acquisition offer for open-source AI lab',
    ticker: 'MSFT',
    source: 'Anonymous leak on X / Twitter',
    category: 'M&A Speculation',
  },
  {
    title: 'Foundry giant reports 3nm chip wafer defect halting Q4 flagship shipments',
    ticker: 'NVDA',
    source: 'Hardware forum leak / Supply chain rumor',
    category: 'Hardware & Supply Chain',
  },
  {
    title: 'Automaker cutting quarterly vehicle production targets by 30% due to battery inventory bottleneck',
    ticker: 'TSLA',
    source: 'Financial gossip newsletter',
    category: 'Automotive & Production',
  },
  {
    title: 'Department of Justice initiates formal grand jury subpoena over cloud pricing collusion',
    ticker: 'GOOGL',
    source: 'Investigative tech podcast report',
    category: 'Regulatory & Legal',
  }
];

// Helper functions for LocalStorage persistence

const WATCHLIST_KEY = 'mtrack_watchlist';
const SAVED_CLAIMS_KEY = 'mtrack_saved_claims';
const VERIFICATIONS_HISTORY_KEY = 'mtrack_verifications_history';
const USER_SETTINGS_KEY = 'mtrack_user_settings';

export function getWatchlist() {
  try {
    const raw = localStorage.getItem(WATCHLIST_KEY);
    if (!raw) {
      // default initial watchlist
      return ['NVDA', 'AAPL', 'MSFT', 'TSLA', 'PLTR'];
    }
    return JSON.parse(raw);
  } catch {
    return ['NVDA', 'AAPL', 'MSFT', 'TSLA', 'PLTR'];
  }
}

export function saveWatchlist(tickers) {
  try {
    localStorage.setItem(WATCHLIST_KEY, JSON.stringify(tickers));
  } catch (e) {
    console.error('Error saving watchlist:', e);
  }
}

export function toggleWatchlistTicker(ticker) {
  const current = getWatchlist();
  let updated;
  if (current.includes(ticker)) {
    updated = current.filter(t => t !== ticker);
  } else {
    updated = [...current, ticker];
  }
  saveWatchlist(updated);
  return updated;
}

export function getSavedClaims() {
  try {
    const raw = localStorage.getItem(SAVED_CLAIMS_KEY);
    return raw ? JSON.parse(raw) : ['CLM-1082', 'CLM-1080'];
  } catch {
    return ['CLM-1082', 'CLM-1080'];
  }
}

export function saveSavedClaims(claimIds) {
  try {
    localStorage.setItem(SAVED_CLAIMS_KEY, JSON.stringify(claimIds));
  } catch (e) {
    console.error('Error saving claims:', e);
  }
}

export function toggleSavedClaim(claimId) {
  const current = getSavedClaims();
  let updated;
  if (current.includes(claimId)) {
    updated = current.filter(id => id !== claimId);
  } else {
    updated = [...current, claimId];
  }
  saveSavedClaims(updated);
  return updated;
}

export function getVerificationsHistory() {
  try {
    const raw = localStorage.getItem(VERIFICATIONS_HISTORY_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Error reading verifications:', e);
  }
  // Return preloaded historical verifications
  return [
    {
      id: 'VER-904',
      claimText: 'NVIDIA reports 40% margin squeeze on next-gen Blackwell rack server packaging',
      ticker: 'NVDA',
      sourceUrl: 'https://twitter.com/semileaks/status/982348',
      sourceType: 'Social Media / Unverified Forum',
      timestamp: 'Today at 14:20',
      verdict: 'DEBUNKED',
      credibilityScore: 18,
      confidenceScore: 94,
      riskLevel: 'High',
      summary: 'TSMC packaging yields are normal (98.4%). Formal SEC 10-Q guidance maintains gross margin projections at 75%.',
    },
    {
      id: 'VER-903',
      claimText: 'Microsoft signs landmark $10B enterprise sovereign cloud contract with European Union',
      ticker: 'MSFT',
      sourceUrl: 'https://ted.europa.eu/notice/2024-C9',
      sourceType: 'Government Gazette / Wire',
      timestamp: 'Today at 11:45',
      verdict: 'VERIFIED',
      credibilityScore: 96,
      confidenceScore: 98,
      riskLevel: 'Low',
      summary: 'Formally recorded under EU TED tender reference EU-DIGIT-2024-C9 with certified agency allocations.',
    }
  ];
}

export function saveNewVerification(record) {
  try {
    const current = getVerificationsHistory();
    const updated = [record, ...current.slice(0, 19)]; // Keep latest 20
    localStorage.setItem(VERIFICATIONS_HISTORY_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Error saving verification:', e);
    return [];
  }
}

export function getUserSettings() {
  try {
    const raw = localStorage.getItem(USER_SETTINGS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Error reading settings:', e);
  }
  return {
    fullName: 'Alex Vance',
    email: 'alex.vance@investor.com',
    role: 'Senior Portfolio Analyst',
    confidenceThreshold: 85,
    rumorAlerts: true,
    earningsVerificationOnly: false,
    dailyDigest: true,
    marketDataAutoRefresh: true,
  };
}

export function saveUserSettings(settings) {
  try {
    localStorage.setItem(USER_SETTINGS_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error('Error saving settings:', e);
  }
}
