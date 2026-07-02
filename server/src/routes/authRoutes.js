const express = require('express');
const router = express.Router();
const { login, getOnlineUsers } = require('../controllers/authController');

// POST /api/auth/login — Login / Register with username
router.post('/login', login);

// GET /api/auth/users — Get online users list
router.get('/users', getOnlineUsers);

module.exports = router;
