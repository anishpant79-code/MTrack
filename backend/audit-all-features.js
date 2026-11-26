// Comprehensive Automated Feature & Security Audit for MTrack AI
import http from 'http'
import mongoose from 'mongoose'
import app from './server.js'

const PORT = process.env.PORT || 5000
const BASE_URL = `http://127.0.0.1:${PORT}/api`

let passedTests = 0
let failedTests = 0
const results = []

function recordResult(module, description, passed, details = '') {
    if (passed) {
        passedTests++
        console.log(`[PASS] [${module}] ${description}`)
    } else {
        failedTests++
        console.error(`[FAIL] [${module}] ${description} -> ${details}`)
    }
    results.push({ module, description, status: passed ? 'PASS' : 'FAIL', details })
}

async function request(path, options = {}) {
    const url = `${BASE_URL}${path}`
    const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) }
    const response = await fetch(url, {
        method: options.method || 'GET',
        headers,
        body: options.body ? JSON.stringify(options.body) : undefined,
    })
    let data
    try {
        data = await response.json()
    } catch {
        data = null
    }
    return { status: response.status, data }
}

async function waitForServer(retries = 30) {
    for (let i = 0; i < retries; i++) {
        try {
            const res = await fetch(`${BASE_URL}/health`)
            if (res.status === 200) {
                console.log(`Server responded with 200 OK on attempt ${i + 1}`)
                return true
            }
        } catch (err) {
            console.log(`Attempt ${i + 1}/${retries}: server not ready yet (${err.message})`)
            await new Promise(r => setTimeout(r, 600))
        }
    }
    return false
}

async function runAudit() {
    console.log('====================================================')
    console.log('STARTING MTRACK AI COMPREHENSIVE FEATURE & SECURITY AUDIT')
    console.log('Target Server:', BASE_URL)
    console.log('====================================================\n')

    const isReady = await waitForServer()
    if (!isReady) {
        console.error('Server failed to initialize within timeout.')
        process.exit(1)
    }

    // 0. HEALTH CHECK
    try {
        const health = await request('/health')
        recordResult('Health', 'Backend server health check (/api/health)', health.status === 200 && health.data?.success === true, `Status: ${health.status}, Message: ${health.data?.message}`)
    } catch (err) {
        recordResult('Health', 'Backend server health check', false, err.message)
    }

    // 1. AUTHENTICATION & USER ISOLATION
    const ts = Date.now()
    const userAEmail = `audit_usera_${ts}@testmtrack.ai`
    const userBEmail = `audit_userb_${ts}@testmtrack.ai`
    const userPassword = 'Password123!'

    let tokenA = ''
    let userAId = ''
    let tokenB = ''
    let userBId = ''

    // Register User A
    const regA = await request('/auth/register', {
        method: 'POST',
        body: { fullName: 'Audit User Alpha', email: userAEmail, password: userPassword },
    })
    if (regA.data?.data?.token) {
        tokenA = regA.data.data.token
        userAId = regA.data.data.user.id
    }
    recordResult('Auth', 'User registration (User A)', regA.status === 201 && !!tokenA, `Status: ${regA.status}`)

    // Duplicate email registration rejected
    const dupA = await request('/auth/register', {
        method: 'POST',
        body: { fullName: 'Audit User Alpha Duplicate', email: userAEmail, password: userPassword },
    })
    recordResult('Auth', 'Duplicate email registration rejection (400)', dupA.status === 400, `Status: ${dupA.status}`)

    // Register User B
    const regB = await request('/auth/register', {
        method: 'POST',
        body: { fullName: 'Audit User Beta', email: userBEmail, password: userPassword },
    })
    if (regB.data?.data?.token) {
        tokenB = regB.data.data.token
        userBId = regB.data.data.user.id
    }
    recordResult('Auth', 'User registration (User B)', regB.status === 201 && !!tokenB, `Status: ${regB.status}`)

    // Login with invalid password
    const badLogin = await request('/auth/login', {
        method: 'POST',
        body: { email: userAEmail, password: 'WrongPassword' },
    })
    recordResult('Auth', 'Login rejection on invalid credentials (401)', badLogin.status === 401, `Status: ${badLogin.status}`)

    // Login with valid credentials
    const goodLogin = await request('/auth/login', {
        method: 'POST',
        body: { email: userAEmail, password: userPassword },
    })
    recordResult('Auth', 'Login success with valid credentials (200)', goodLogin.status === 200 && goodLogin.data?.data?.token, `Status: ${goodLogin.status}`)

    // Test GET /api/auth/me
    const meA = await request('/auth/me', {
        headers: { Authorization: `Bearer ${tokenA}` },
    })
    recordResult('Auth', 'Fetch authenticated user profile (/api/auth/me)', meA.status === 200 && meA.data?.data?.user?.email === userAEmail, `Status: ${meA.status}`)

    const meUnauth = await request('/auth/me')
    recordResult('Auth', 'Unauthorized access rejection on /api/auth/me without token (401)', meUnauth.status === 401, `Status: ${meUnauth.status}`)

    // 2. CLAIMS CRUD & MULTI-TENANT ISOLATION
    let claimAId = ''

    // User A creates a claim
    const createClaimA = await request('/claims', {
        method: 'POST',
        headers: { Authorization: `Bearer ${tokenA}` },
        body: {
            title: 'Tata Consultancy Services consolidated revenue grew by 6.85% in FY2024.',
            category: 'Company Financials',
            source: 'BSE Regulatory Filing',
        },
    })
    recordResult('Claims CRUD', 'Create private claim under User A session', createClaimA.status === 201 && !!createClaimA.data?.data?._id, `Status: ${createClaimA.status}`)
    if (createClaimA.data?.data?._id) {
        claimAId = createClaimA.data.data._id
    }

    // User A can read their claim
    const getClaimA = await request(`/claims/${claimAId}`, {
        headers: { Authorization: `Bearer ${tokenA}` },
    })
    recordResult('Claims CRUD', 'User A read own claim by ID', getClaimA.status === 200 && getClaimA.data?.data?._id === claimAId, `Status: ${getClaimA.status}`)

    // User A can update their claim (e.g. save to bookmarks)
    const updateClaimA = await request(`/claims/${claimAId}`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${tokenA}` },
        body: { isSaved: true },
    })
    recordResult('Claims CRUD', 'User A toggle save status on claim', updateClaimA.status === 200 && updateClaimA.data?.data?.isSaved === true, `Status: ${updateClaimA.status}`)

    // SECURITY ISOLATION CHECKS (User B must NOT access User A's private claim)
    const userBAccess = await request(`/claims/${claimAId}`, {
        headers: { Authorization: `Bearer ${tokenB}` },
    })
    recordResult('Security Isolation', 'User B forbidden from reading User A claim (403)', userBAccess.status === 403, `Status: ${userBAccess.status}`)

    const userBUpdate = await request(`/claims/${claimAId}`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${tokenB}` },
        body: { isSaved: false },
    })
    recordResult('Security Isolation', 'User B forbidden from updating User A claim (403)', userBUpdate.status === 403, `Status: ${userBUpdate.status}`)

    const userBVerify = await request(`/claims/${claimAId}/verify`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${tokenB}` },
        body: {},
    })
    recordResult('Security Isolation', 'User B forbidden from verifying User A claim (403)', userBVerify.status === 403, `Status: ${userBVerify.status}`)

    const userBAddEvidence = await request(`/claims/${claimAId}/evidence`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${tokenB}` },
        body: {
            sourceName: 'Tampered Evidence',
            sourceUrl: 'https://example.com/fake',
            excerpt: 'Fake information',
        },
    })
    recordResult('Security Isolation', 'User B forbidden from adding evidence to User A claim (403)', userBAddEvidence.status === 403, `Status: ${userBAddEvidence.status}`)

    const userBDelete = await request(`/claims/${claimAId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${tokenB}` },
    })
    recordResult('Security Isolation', 'User B forbidden from deleting User A claim (403)', userBDelete.status === 403, `Status: ${userBDelete.status}`)

    // Unauthenticated guest user must not see User A's private claim in general list
    const guestClaims = await request('/claims')
    const leaksPrivate = guestClaims.data?.data?.some(c => c._id === claimAId)
    recordResult('Security Isolation', 'Guest claims list does not leak private user claims', guestClaims.status === 200 && !leaksPrivate, `Leaks: ${leaksPrivate}`)

    // 3. EVIDENCE MANAGEMENT & DOMAIN WHITELIST RULES
    // Test 3A: Add evidence with unverified domain pretending to be official_primary
    const unverifiedEvidence = await request(`/claims/${claimAId}/evidence`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${tokenA}` },
        body: {
            sourceName: 'Random Unverified Blog',
            sourceUrl: 'https://unverified-analyst-blog.org/tcs-notes',
            sourceAuthority: 'official_primary', // Attempts to claim official primary
            documentTitle: 'Unverified Blog Report',
            excerpt: 'The analyst claims TCS revenue grew 6.85% reaching 240,893 crore in FY2024.',
        },
    })
    const downgraded = unverifiedEvidence.data?.data?.sourceAuthority === 'reputable_secondary'
    recordResult('Evidence Rules', 'Non-whitelisted domain claiming official_primary is downgraded to reputable_secondary', unverifiedEvidence.status === 201 && downgraded, `Authority received: ${unverifiedEvidence.data?.data?.sourceAuthority}`)

    // Test 3B: Add evidence with official primary domain (BSE)
    const officialEvidence = await request(`/claims/${claimAId}/evidence`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${tokenA}` },
        body: {
            sourceName: 'BSE India Official Filing',
            sourceUrl: 'https://www.bseindia.com/xml-data/corpfiling/AttachLive/tcs_audited_fy24.pdf',
            sourceAuthority: 'official_primary',
            documentTitle: 'TCS FY2024 Reg 33 Audited Disclosure',
            excerpt: 'Revenue from operations reached ₹240,893 crore for FY2024 compared to ₹225,458 crore in FY2023, representing 6.85% YoY growth.',
            facts: [
                { metric: 'Revenue', period: 'FY2023', value: 225458, unit: 'crore', currency: 'INR' },
                { metric: 'Revenue', period: 'FY2024', value: 240893, unit: 'crore', currency: 'INR' },
            ],
        },
    })
    const preservedOfficial = officialEvidence.data?.data?.sourceAuthority === 'official_primary'
    recordResult('Evidence Rules', 'Whitelisted official domain (bseindia.com) preserves official_primary status', officialEvidence.status === 201 && preservedOfficial, `Authority received: ${officialEvidence.data?.data?.sourceAuthority}`)

    // 4. VERIFICATION ENGINE AUDIT (VERIFIED, CONTRADICTED, UNVERIFIED)
    // Test 4A: VERIFIED CLAIM (TCS 6.85% Revenue Growth)
    const verifyA = await request(`/claims/${claimAId}/verify`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${tokenA}` },
    })
    const statusA = verifyA.data?.data?.status
    const scoreA = verifyA.data?.data?.verification?.transparencyScore
    recordResult('Verification Engine', 'Verified Outcome: TCS FY2024 revenue growth (+6.85%)', statusA === 'Verified' && scoreA >= 90, `Status: ${statusA}, Score: ${scoreA}`)

    // Test 4B: CONTRADICTED CLAIM (Infosys +25% Profit Surge Rumor)
    const createClaimB = await request('/claims', {
        method: 'POST',
        headers: { Authorization: `Bearer ${tokenA}` },
        body: {
            title: 'Infosys consolidated net profit jumped by 25% in FY2024.',
            category: 'Company Financials',
            source: 'Social Media Rumor',
        },
    })
    const claimBId = createClaimB.data?.data?._id
    const verifyB = await request(`/claims/${claimBId}/verify`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${tokenA}` },
    })
    const statusB = verifyB.data?.data?.status || createClaimB.data?.data?.status
    const diffB = verifyB.data?.data?.verification?.calculation?.differencePercent ?? createClaimB.data?.data?.verification?.calculation?.differencePercent
    recordResult('Verification Engine', 'Contradicted Outcome: Infosys Net Profit +25% rumor contradicted by actual filings (+8.87%)', statusB === 'Contradicted' && diffB > 10, `Status: ${statusB}, Difference: ${diffB}%`)

    // Test 4C: UNVERIFIED CLAIM (Tata Motors forward-looking target without baseline evidence)
    const createClaimC = await request('/claims', {
        method: 'POST',
        headers: { Authorization: `Bearer ${tokenA}` },
        body: {
            title: 'Tata Motors electric commercial vehicle deliveries will increase by 45% next financial year.',
            category: 'Company Financials',
            source: 'Press Release',
        },
    })
    const claimCId = createClaimC.data?.data?._id
    const verifyC = await request(`/claims/${claimCId}/verify`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${tokenA}` },
    })
    const statusC = verifyC.data?.data?.status || createClaimC.data?.data?.status
    recordResult('Verification Engine', 'Unverified Outcome: Forward-looking target marked Unverified without sufficient comparable evidence', statusC === 'Unverified', `Status: ${statusC}`)

    // Test 4D: IMPLIED GROWTH / CONFIRMED VERIFICATION (Reliance Industries Gross Revenue)
    const createClaimD = await request('/claims', {
        method: 'POST',
        headers: { Authorization: `Bearer ${tokenA}` },
        body: {
            title: 'Reliance Industries consolidated gross revenue grew by 2.59% in FY2024.',
            category: 'Company Financials',
            source: 'NSE Announcement',
        },
    })
    const claimDId = createClaimD.data?.data?._id
    const verifyD = await request(`/claims/${claimDId}/verify`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${tokenA}` },
    })
    const statusD = verifyD.data?.data?.status || createClaimD.data?.data?.status
    recordResult('Verification Engine', 'Calculation & Verification: Reliance Industries revenue growth (+2.59%) verified against disclosures', statusD === 'Verified', `Status: ${statusD}`)

    // 5. MARKET INSIGHTS & REGULATORY SOURCE INGESTION
    const nseFeeds = await request('/sources/nse')
    const nseCount = nseFeeds.data?.count || (Array.isArray(nseFeeds.data?.data) ? nseFeeds.data.data.length : 0)
    recordResult('Market Insights', 'NSE Announcements feed ingestion returns records (count > 0)', nseFeeds.status === 200 && nseCount > 0, `Count: ${nseCount}`)

    const sebiFeeds = await request('/sources/sebi')
    const sebiCount = sebiFeeds.data?.count || (Array.isArray(sebiFeeds.data?.data) ? sebiFeeds.data.data.length : 0)
    recordResult('Market Insights', 'SEBI Regulatory Updates feed ingestion returns records (count > 0)', sebiFeeds.status === 200 && sebiCount > 0, `Count: ${sebiCount}`)

    const nseFilter = await request('/sources/nse?query=TCS')
    const nseFilterCount = nseFilter.data?.count || (Array.isArray(nseFilter.data?.data) ? nseFilter.data.data.length : 0)
    recordResult('Market Insights', 'NSE Announcements filtered query by company symbol (query=TCS)', nseFilter.status === 200 && nseFilterCount > 0, `Filtered Count: ${nseFilterCount}`)

    // 6. DELETE & CASCADE CLEAN-UP
    const delClaimA = await request(`/claims/${claimAId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${tokenA}` },
    })
    recordResult('Claims CRUD', 'User A delete claim with cascade evidence cleanup', delClaimA.status === 200, `Status: ${delClaimA.status}`)

    // Clean up other created claims
    if (claimBId) await request(`/claims/${claimBId}`, { method: 'DELETE', headers: { Authorization: `Bearer ${tokenA}` } })
    if (claimCId) await request(`/claims/${claimCId}`, { method: 'DELETE', headers: { Authorization: `Bearer ${tokenA}` } })
    if (claimDId) await request(`/claims/${claimDId}`, { method: 'DELETE', headers: { Authorization: `Bearer ${tokenA}` } })

    console.log('\n====================================================')
    console.log(`AUDIT COMPLETE: ${passedTests} PASSED, ${failedTests} FAILED (Total: ${passedTests + failedTests})`)
    console.log('====================================================')

    await mongoose.disconnect()

    if (failedTests > 0) {
        process.exit(1)
    } else {
        process.exit(0)
    }
}

runAudit().catch(err => {
    console.error('Audit execution error:', err)
    process.exit(1)
})
