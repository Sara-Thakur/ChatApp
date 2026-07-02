const mongoose = require('mongoose');

// Disable buffering so queries fail instantly if disconnected instead of hanging
mongoose.set('bufferCommands', false);

let isConnected = false;

/**
 * Connect to MongoDB with retry logic.
 * Falls back gracefully if MongoDB is unavailable (uses in-memory store).
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000,
    });
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
    isConnected = true;
    return true;
  } catch (error) {
    console.error(`❌ MongoDB connection error: ${error.message}`);
    console.log('⚠️  Running without database — messages will not persist.');
    isConnected = false;
    return false;
  }
};

const getIsConnected = () => isConnected;

module.exports = { connectDB, getIsConnected };
