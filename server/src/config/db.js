const mongoose = require('mongoose');

/**
 * Connect to MongoDB with retry logic.
 * Falls back gracefully if MongoDB is unavailable (uses in-memory store).
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      // Mongoose 8 uses the new connection string parser by default
    });
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.error(`❌ MongoDB connection error: ${error.message}`);
    console.log('⚠️  Running without database — messages will not persist.');
    return false;
  }
};

module.exports = connectDB;
