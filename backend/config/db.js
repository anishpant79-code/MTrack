import mongoose from 'mongoose'
import dns from 'dns'

// Ensure reliable DNS SRV resolution for MongoDB Atlas on Windows environments
try {
    dns.setServers(['8.8.8.8', '8.8.4.4'])
} catch {
    // Ignore if not supported in environment
}

let cachedConnection = null

const connectDB = async () => {
    // If already connected, return cached connection
    if (cachedConnection && mongoose.connection.readyState === 1) {
        return cachedConnection
    }

    // If currently connecting, wait for connection
    if (mongoose.connection.readyState === 2) {
        await new Promise((resolve) => {
            mongoose.connection.once('connected', resolve)
            mongoose.connection.once('error', resolve)
        })
        if (mongoose.connection.readyState === 1) {
            cachedConnection = mongoose.connection
            return cachedConnection
        }
    }

    try {
        const opts = {
            bufferCommands: false,
            serverSelectionTimeoutMS: 8000,
            socketTimeoutMS: 20000,
        }

        const connection = await mongoose.connect(process.env.MONGODB_URI, opts)
        cachedConnection = connection
        console.log(`MongoDB Connected: ${connection.connection.host}`)
        return connection
    } catch (error) {
        console.error('MongoDB connection failed:', error.message)
        throw error
    }
}

export default connectDB
