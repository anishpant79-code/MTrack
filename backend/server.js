import 'dotenv/config'

import express from 'express'
import cors from 'cors'
import helmet from 'helmet'

import connectDB from './config/db.js'
import authRoutes from './routes/authRoutes.js'
import claimRoutes from './routes/claimRoutes.js'
import evidenceRoutes from './routes/evidenceRoutes.js'
import sourceRoutes from './routes/sourceRoutes.js'

const app = express()
const PORT = process.env.PORT || 5000

app.use(helmet())

const allowedOrigins = [
    process.env.CLIENT_URL,
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://localhost:3000',
].filter(Boolean)

app.use(
    cors({
        origin: (origin, callback) => {
            // Allow requests with no origin (e.g. mobile apps, curl, same-origin)
            if (!origin || allowedOrigins.includes(origin)) {
                return callback(null, true)
            }
            return callback(null, true) // Allow local dev environments flexibly
        },
        credentials: true,
    })
)

app.use(express.json({ limit: '50kb' }))

app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Welcome to MTrack AI API',
        version: '1.0.0',
    })
})

app.get('/api/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'MTrack AI backend is running',
        timestamp: new Date().toISOString(),
    })
})

// Ensure database connection is ready for stateful API endpoints
app.use('/api', async (req, res, next) => {
    if (req.path === '/health') return next()
    try {
        await connectDB()
        next()
    } catch (err) {
        console.error('Database connection error on route ' + req.path + ':', err.message)
        return res.status(503).json({
            success: false,
            message: 'Database connection failed: ' + err.message,
        })
    }
})

app.use('/api/auth', authRoutes)
app.use('/api/claims', claimRoutes)
app.use('/api/evidence', evidenceRoutes)
app.use('/api/sources', sourceRoutes)

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'API route not found',
    })
})

app.use((error, req, res, next) => {
    console.error('Unhandled server error:', error)

    res.status(error.status || 500).json({
        success: false,
        message: error.message || 'Internal server error',
    })
})

const startServer = async () => {
    try {
        await connectDB()

        app.listen(PORT, () => {
            console.log(`MTrack AI server running on port ${PORT}`)
        })
    } catch (error) {
        console.error('Server startup failed:', error.message)
        process.exit(1)
    }
}

if (!process.env.VERCEL) {
    startServer()
} else {
    // In Vercel serverless environment, ensure DB connection on import
    connectDB().catch((err) => console.error('MongoDB serverless connection error:', err.message))
}

export default app
