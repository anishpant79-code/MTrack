import mongoose from 'mongoose'

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
