const Message = require('../models/Message');

/**
 * @desc    Fetch paginated chat history
 * @route   GET /api/messages
 * @query   page (default 1), limit (default 50)
 */
const getMessages = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    const messages = await Message.find()
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Message.countDocuments();

    res.status(200).json({
      success: true,
      data: messages.reverse(), // Return in chronological order
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching messages:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch messages',
    });
  }
};

/**
 * @desc    Send a new message
 * @route   POST /api/messages
 * @body    { sender, text }
 */
const sendMessage = async (req, res) => {
  try {
    const { sender, text } = req.body;

    if (!sender || !text) {
      return res.status(400).json({
        success: false,
        error: 'Sender and text are required',
      });
    }

    if (text.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Message text cannot be empty',
      });
    }

    const message = await Message.create({
      sender: sender.trim(),
      text: text.trim(),
      timestamp: new Date(),
      status: 'sent',
    });

    res.status(201).json({
      success: true,
      data: message,
    });
  } catch (error) {
    console.error('Error sending message:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to send message',
    });
  }
};

/**
 * @desc    Update message status (delivered/read)
 * @route   PATCH /api/messages/:id/status
 * @body    { status }
 */
const updateMessageStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['sent', 'delivered', 'read'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
      });
    }

    const message = await Message.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!message) {
      return res.status(404).json({
        success: false,
        error: 'Message not found',
      });
    }

    res.status(200).json({
      success: true,
      data: message,
    });
  } catch (error) {
    console.error('Error updating message status:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to update message status',
    });
  }
};

module.exports = {
  getMessages,
  sendMessage,
  updateMessageStatus,
};
