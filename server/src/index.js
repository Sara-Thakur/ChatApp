require('dotenv').config();

const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');

const connectDB = require('./config/db');
const messageRoutes = require('./routes/messageRoutes');
const authRoutes = require('./routes/authRoutes');
const initializeSocket = require('./socket/socketHandler');

// ─── Express App Setup ──────────────────────────────────────────────
const app = express();
const server = http.createServer(app);

// ─── CORS Configuration ─────────────────────────────────────────────
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

app.use(
  cors({
    origin: CLIENT_URL,
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    credentials: true,
  })
);

// ─── Body Parsing Middleware ─────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── REST API Routes ─────────────────────────────────────────────────
app.use('/api/messages', messageRoutes);
app.use('/api/auth', authRoutes);

// ─── Health Check ────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'ChatApp Server is running',
    timestamp: new Date().toISOString(),
  });
});

// ─── Serve Frontend Static Files in Production ───────────────────────
const path = require('path');
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../../client/dist')));
  
  // Wildcard handler to support SPA routing (returns index.html)
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.join(__dirname, '../../client/dist/index.html'));
  });
}

// ─── 404 Handler ─────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// ─── Global Error Handler ────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.stack);
  res.status(500).json({
    success: false,
    error: 'Internal Server Error',
  });
});

// ─── Socket.io Setup ─────────────────────────────────────────────────
const io = new Server(server, {
  cors: {
    origin: CLIENT_URL,
    methods: ['GET', 'POST'],
    credentials: true,
  },
  pingTimeout: 60000,
  pingInterval: 25000,
});

// Initialize Socket.io event handlers
initializeSocket(io);

// ─── Start Server ────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  // Connect to MongoDB
  await connectDB();

  server.listen(PORT, () => {
    console.log(`\n🚀 ChatApp Server running on port ${PORT}`);
    console.log(`📡 REST API:   http://localhost:${PORT}/api`);
    console.log(`🔌 Socket.io:  http://localhost:${PORT}`);
    console.log(`💻 Client URL: ${CLIENT_URL}\n`);
  });
};

startServer();
