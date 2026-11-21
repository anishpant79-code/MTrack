import jwt from 'jsonwebtoken'
import User from '../models/User.js'

const JWT_SECRET = process.env.JWT_SECRET || 'mtrack-ai-jwt-secret-key-default-2026'

// Protect middleware: Requires valid JWT
export const protect = async (req, res, next) => {
    try {
        let token = null

        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith('Bearer')
        ) {
            token = req.headers.authorization.split(' ')[1]
        } else if (req.cookies && req.cookies.token) {
            token = req.cookies.token
        }

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required. Please sign in to continue.',
            })
        }

        const decoded = jwt.verify(token, JWT_SECRET)
        const user = await User.findById(decoded.id).select('-password')

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'User account not found.',
            })
        }

        req.user = user
        next()
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Invalid or expired session. Please sign in again.',
        })
    }
}

// Optional auth middleware: Attaches user if token present, but never blocks
export const optionalAuth = async (req, res, next) => {
    try {
        let token = null

        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith('Bearer')
        ) {
            token = req.headers.authorization.split(' ')[1]
        } else if (req.cookies && req.cookies.token) {
            token = req.cookies.token
        }

        if (token) {
            try {
                const decoded = jwt.verify(token, JWT_SECRET)
                const user = await User.findById(decoded.id).select('-password')
                if (user) {
                    req.user = user
                }
            } catch {
                // Token invalid or expired: proceed as anonymous guest/demo user
                req.user = null
            }
        } else {
            req.user = null
        }

        next()
    } catch (error) {
        req.user = null
        next()
    }
}
