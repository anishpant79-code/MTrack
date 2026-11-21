# MTrack AI — AI-Powered Financial Claim Verification Platform

[![Vite](https://img.shields.io/badge/Vite-8.3-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

> **Evidence over assumptions. Clarity over confusion.**  
> MTrack AI empowers retail investors to evaluate corporate financial claims, quarterly earnings headlines, and market rumors using official regulatory disclosures, audited annual accounts, and transparent deterministic mathematical verification.

---

## 📌 Project Overview

In fast-moving financial markets, viral claims, social media speculation, and exaggerated earnings headlines often mislead retail investors. MTrack AI provides a credible fact-checking intelligence platform designed to replace guesswork with empirical evidence.

### Core Verification Workflow:
1. **Natural Language Claim Input**: User enters any financial statement or earnings headline.
2. **Entity Extraction**: System extracts the company, financial metric, baseline reporting period, target reporting period, and claimed percentage change.
3. **Evidence Retrieval**: Gathers matching official primary documents (NSE announcements, SEBI circulars, audited annual financial statements).
4. **Deterministic Mathematical Verification**: Compares extracted baseline and target figures using pure mathematical verification within a strict $\pm 0.5\%$ tolerance.
5. **Audited Transparency Report**: Returns an evidence ledger with calculated growth, discrepancies, official filing citations, auditor notes, and an Evidence Transparency Score (0–100).

### Verification Classifications:
* **Verified**: The mathematical comparison between audited figures matches the claim within the allowed tolerance ($\pm 0.5\%$).
* **Contradicted**: Audited statutory disclosures report figures that conflict with the claim beyond the tolerance.
* **Unverified**: Insufficient audited data is currently available (forward projections, unverified sources). *MTrack AI never labels a claim false merely because evidence is missing.*
* **Pending**: Analysis or evidence retrieval is in progress.

---

## 🏗️ Architecture & Repository Structure

```
mtrack-ai/
├── frontend/                     # React + Vite + Tailwind CSS v4 Client
│   ├── public/                   # Static assets & favicon.svg
│   ├── src/
│   │   ├── components/           # UI components (MTrackLogo, HeroVisual, BackButton, Icons, etc.)
│   │   ├── pages/                # Application routes (Home, Dashboard, VerifyClaims, History, Saved, etc.)
│   │   ├── utils/                # Auth helpers, title managers, API clients
│   │   ├── App.jsx               # Router definition
│   │   └── index.css             # Fintech theme & typography
│   ├── package.json
│   ├── vite.config.js
│   └── vercel.json               # SPA routing rewrite configuration
│
├── backend/                      # Node.js + Express + MongoDB Server
│   ├── config/                   # Database connection (MongoDB Atlas)
│   ├── controllers/              # Auth, Claim, Evidence, and Source controllers
│   ├── middleware/               # JWT authentication, rate limiting, error handling
│   ├── models/                   # Mongoose schemas (User, Claim, Evidence)
│   ├── routes/                   # RESTful API route definitions
│   ├── services/                 # Verification engine, Gemini entity extractor, NSE/SEBI feed ingestion
│   ├── seedGenuineClaims.js      # Authentic presentation data seeder (TCS, Infosys, Reliance, etc.)
│   ├── package.json
│   ├── server.js                 # Express server & Serverless entrypoint
│   └── vercel.json               # Serverless deployment configuration
│
├── .gitignore                    # Comprehensive repository gitignore
└── README.md                     # Platform documentation
```

---

## 🚀 Quick Start & Local Setup

### Prerequisites
* **Node.js** (v18 or higher)
* **npm** or **pnpm**
* **MongoDB Atlas** database cluster (or local MongoDB)

### 1. Backend Setup
```bash
cd backend
npm install

# Create .env file with the following variables:
PORT=5000
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_secure_jwt_secret
GEMINI_API_KEY=your_optional_gemini_api_key
CLIENT_URL=http://localhost:5173

# (Optional) Seed genuine presentation test claims:
node seedGenuineClaims.js

# Start the backend server:
npm start
```

### 2. Frontend Setup
```bash
cd ../frontend
npm install

# Create .env file (optional for local dev, defaults to http://localhost:5000/api):
VITE_API_BASE_URL=http://localhost:5000/api

# Run the Vite development server:
npm run dev
```

Visit `http://localhost:5173` in your browser.

---

## 🔒 Security & Privacy

* **Zero Hardcoded Secrets**: All database connection strings, JWT secrets, and AI API keys are read strictly from environment variables.
* **User Isolation**: Authenticated users enjoy private workspaces; claims created with user ownership cannot be accessed or manipulated by third parties.
* **Safe Guest Mode**: Unauthenticated visitors can view curated public case studies without exposing user accounts.
* **No AI Guesswork on Math**: While AI assists in natural language entity extraction, **all verification verdicts are 100% deterministic code computations**.

---

## ⚖️ Regulatory Disclaimer

*MTrack AI provides empirical, evidence-based analysis and fact-checking of financial disclosures. It does not provide investment advice, buy/sell recommendations, stock tips, or price forecasts. Retail investors should evaluate claims using primary statutory filings from SEBI, BSE, or NSE.*

---

## 📄 License
MIT License. Created for the Hackathon presentation.
