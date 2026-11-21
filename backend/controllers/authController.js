import jwt from 'jsonwebtoken'
import User from '../models/User.js'

const JWT_SECRET = process.env.JWT_SECRET || 'mtrack-ai-jwt-secret-key-default-2026'
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d'

const generateToken = (userId) => {
    return jwt.sign({ id: userId }, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN,
    })
}

// REGISTER NEW USER
export const register = async (req, res) => {
    try {
        const { fullName, email, password } = req.body

        if (!fullName || !fullName.trim()) {
            return res.status(400).json({
                success: false,
                message: 'Full name is required',
            })
        }

        if (!email || !email.trim()) {
            return res.status(400).json({
                success: false,
                message: 'Email address is required',
            })
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email.trim())) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a valid email address',
            })
        }

        if (!password || password.length < 8) {
            return res.status(400).json({
                success: false,
                message: 'Password must contain at least 8 characters',
            })
        }

        const normalizedEmail = email.trim().toLowerCase()
        const existingUser = await User.findOne({ email: normalizedEmail })

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'An account with this email address already exists',
            })
        }

        const user = await User.create({
            fullName: fullName.trim(),
            email: normalizedEmail,
            password,
        })

        const token = generateToken(user._id)

        return res.status(201).json({
            success: true,
            message: 'Account created successfully',
            data: {
                user: {
                    id: user._id,
                    fullName: user.fullName,
                    email: user.email,
                    createdAt: user.createdAt,
                },
                token,
            },
        })
    } catch (error) {
        console.error('Registration error:', error.message)

        if (error.name === 'ValidationError') {
            return res.status(400).json({
                success: false,
                message: error.message,
            })
        }

        return res.status(500).json({
            success: false,
            message: 'Unable to complete registration. Please try again.',
        })
    }
}

// LOGIN EXISTING USER
export const login = async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email || !email.trim() || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide both email and password',
            })
        }

        const normalizedEmail = email.trim().toLowerCase()
        const user = await User.findOne({ email: normalizedEmail })

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password',
            })
        }

        const isMatch = await user.comparePassword(password)

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password',
            })
        }

        const token = generateToken(user._id)

        return res.status(200).json({
            success: true,
            message: 'Signed in successfully',
            data: {
                user: {
                    id: user._id,
                    fullName: user.fullName,
                    email: user.email,
                    createdAt: user.createdAt,
                },
                token,
            },
        })
    } catch (error) {
        console.error('Login error:', error.message)

        return res.status(500).json({
            success: false,
            message: 'Unable to sign in. Please try again.',
        })
    }
}

// GET CURRENT USER PROFILE
export const getMe = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Not authenticated',
            })
        }

        return res.status(200).json({
            success: true,
            data: {
                user: {
                    id: req.user._id,
                    fullName: req.user.fullName,
                    email: req.user.email,
                    createdAt: req.user.createdAt,
                },
            },
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Unable to fetch user profile',
        })
    }
}

// LOGOUT
export const logout = async (req, res) => {
    return res.status(200).json({
        success: true,
        message: 'Logged out successfully',
    })
}
