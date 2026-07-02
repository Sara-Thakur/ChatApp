const express = require('express');
const router = express.Router();
const {
  getMessages,
  sendMessage,
  updateMessageStatus,
} = require('../controllers/messageController');

// GET /api/messages — Fetch paginated chat history
router.get('/', getMessages);

// POST /api/messages — Send a new message
router.post('/', sendMessage);

// PATCH /api/messages/:id/status — Update message status
router.patch('/:id/status', updateMessageStatus);

module.exports = router;
