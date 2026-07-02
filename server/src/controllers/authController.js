const User = require('../models/User');

/**
 * @desc    Login / Register user (dummy auth — no password)
 * @route   POST /api/auth/login
 * @body    { username }
 */
const login = async (req, res) => {
  try {
    const { username } = req.body;

    if (!username || username.trim().length < 2) {
      return res.status(400).json({
        success: false,
        error: 'Username must be at least 2 characters',
      });
    }

    if (username.trim().length > 20) {
      return res.status(400).json({
        success: false,
        error: 'Username cannot exceed 20 characters',
      });
    }

    // Find existing user or create a new one
    let user = await User.findOne({ username: username.trim() });

    if (!user) {
      user = await User.create({
        username: username.trim(),
        isOnline: true,
        lastSeen: new Date(),
      });
    } else {
      user.isOnline = true;
      user.lastSeen = new Date();
      await user.save();
    }

    res.status(200).json({
      success: true,
      data: {
        id: user._id,
        username: user.username,
      },
    });
  } catch (error) {
    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(200).json({
        success: true,
        data: {
          username: req.body.username.trim(),
        },
      });
    }

    console.error('Error during login:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to login',
    });
  }
};

/**
 * @desc    Get all online users
 * @route   GET /api/auth/users
 */
const getOnlineUsers = async (req, res) => {
  try {
    const users = await User.find({ isOnline: true })
      .select('username isOnline lastSeen')
      .lean();

    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    console.error('Error fetching users:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch users',
    });
  }
};

module.exports = {
  login,
  getOnlineUsers,
};
