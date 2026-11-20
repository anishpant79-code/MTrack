# MTrack AI — Financial Intelligence & Claim Verification Platform

**Less confusion. More clarity. Smarter investing.**

MTrack AI helps investors and analysts evaluate market rumors, unconfirmed claims, and financial news before making investment decisions. By cross-referencing information against SEC EDGAR regulatory filings, court records, tier-1 news wires, and audited statements, MTrack AI separates reliable market insights from speculative noise.

---

## 🚀 Key Features

- **AI Claim Verifier (`/verification`)**: Submit any financial rumor, analyst leak, or headline. The multi-factor AI engine extracts entities, checks regulatory databases (10-K, 10-Q, 8-K), scores source credibility, and generates an evidentiary audit report with confidence ratings.
- **Intelligence Dashboard (`/dashboard`)**: Comprehensive market overview featuring live market pulse indices, trending claims, high-risk rumor alerts, source reliability leaderboards, and quick verification inputs.
- **Live Claims & News Feed (`/feed`)**: Real-time stream of financial claims filterable by status (*Verified*, *Misleading*, *Debunked*, *Under Review*), category, and market impact, with evidence deep-dives.
- **Stocks Intel (`/stocks`)**: Equities directory with interactive Recharts price charts, financial fundamentals, veracity scores, noise volatility ratings, and claim histories for each ticker.
- **Watchlist Tracker (`/watchlist`)**: Personalized tracking portfolio with persistent stock monitoring, veracity alerts, and saved claim audits.
- **User Settings & Engine Tuning (`/settings`)**: Configurable AI confidence thresholds, rumor alerts, daily digest preferences, and data export.
- **Public Showcase & Demo (`/`)**: Landing page featuring Hero, interactive in-page Claim Inspector Demo, Features, How It Works, Credibility Methodology, FAQs, and full navigation.
- **Authentication (`/login`, `/signup`)**: Streamlined sign-in with 1-click **Continue as Demo Analyst** access.

---

## 🛠 Tech Stack

- **Framework**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Routing**: [React Router v7](https://reactrouter.com/) (with dynamic route code-splitting via `React.lazy`)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Data Visualizations**: [Recharts](https://recharts.org/) (Interactive AreaCharts, BarCharts, DonutCharts)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Linter**: ESLint 9/10 with strict React Hooks rules

---

## 🏁 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```
Open your browser at `http://localhost:5173`.

### 3. Production Build & Linting
```bash
npm run lint   # Verifies 0 ESLint errors & warnings
npm run build  # Builds optimized, code-split production bundle
npm run preview # Preview production build locally
```

---

## ⚖️ Disclaimer

MTrack AI is a research and analytical intelligence tool designed to evaluate source credibility and factual evidence. It does not provide investment, financial, tax, or legal advice.
