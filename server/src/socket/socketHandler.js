const Message = require('../models/Message');
const User = require('../models/User');
const { getIsConnected } = require('../config/db');

/**
 * Initialize Socket.io event handlers.
 * Manages real-time messaging, typing indicators, user status, and message delivery.
 *
 * @param {import('socket.io').Server} io - Socket.io server instance
 */
const initializeSocket = (io) => {
  // Track connected users in memory for quick lookups
  const connectedUsers = new Map(); // socketId -> { username, socketId }

  io.on('connection', (socket) => {
    console.log(`🔌 New connection: ${socket.id}`);

    /**
     * Event: user_join
     * When a user joins the chat after logging in.
     * Updates their online status and broadcasts the updated user list.
     */
    socket.on('user_join', async (username) => {
      try {
        if (!username) return;

        // Store user in memory map
        connectedUsers.set(socket.id, { username, socketId: socket.id });

        // Update user status in database if connected
        if (getIsConnected()) {
          await User.findOneAndUpdate(
            { username },
            {
              isOnline: true,
              socketId: socket.id,
              lastSeen: new Date(),
            },
            { upsert: true, new: true }
          );
        }

        // Broadcast updated user list to all clients
        const onlineUsers = Array.from(connectedUsers.values());
        io.emit('user_status', onlineUsers);

        console.log(`✅ ${username} joined (${socket.id})`);
      } catch (error) {
        console.error('Error handling user_join:', error.message);
      }
    });

    /**
     * Event: send_message
     * When a user sends a chat message.
     * Saves to DB and broadcasts to all connected clients.
     */
    socket.on('send_message', async (data) => {
      try {
        const { sender, text } = data;

        if (!sender || !text || text.trim().length === 0) {
          socket.emit('error_message', { error: 'Invalid message data' });
          return;
        }

        const cleanSender = sender.trim();
        const cleanText = text.trim();
        let messageData;

        // Save message to database if connected, else create in-memory payload
        if (getIsConnected()) {
          const message = await Message.create({
            sender: cleanSender,
            text: cleanText,
            timestamp: new Date(),
            status: 'sent',
          });
          messageData = {
            _id: message._id,
            sender: message.sender,
            text: message.text,
            timestamp: message.timestamp,
            status: message.status,
          };
        } else {
          messageData = {
            _id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            sender: cleanSender,
            text: cleanText,
            timestamp: new Date(),
            status: 'sent',
          };
        }

        // Broadcast to ALL connected clients (including sender)
        io.emit('new_message', messageData);

        // Mark as delivered for all connected users except sender
        setTimeout(async () => {
          try {
            if (getIsConnected()) {
              await Message.findByIdAndUpdate(messageData._id, { status: 'delivered' });
            }
            io.emit('message_status_update', {
              messageId: messageData._id,
              status: 'delivered',
            });
          } catch (err) {
            console.error('Error updating delivery status:', err.message);
          }
        }, 500);

        console.log(`💬 ${cleanSender}: ${cleanText.substring(0, 50)}...`);
      } catch (error) {
        console.error('Error handling send_message:', error.message);
        socket.emit('error_message', { error: 'Failed to send message' });
      }
    });

    /**
     * Event: typing
     * When a user starts typing. Broadcasts to all other clients.
     */
    socket.on('typing', (username) => {
      socket.broadcast.emit('typing', username);
    });

    /**
     * Event: stop_typing
     * When a user stops typing. Broadcasts to all other clients.
     */
    socket.on('stop_typing', (username) => {
      socket.broadcast.emit('stop_typing', username);
    });

    /**
     * Event: message_read
     * When a user reads messages. Updates status in DB and notifies others.
     */
    socket.on('message_read', async (data) => {
      try {
        const { messageIds, reader } = data;

        if (!messageIds || !Array.isArray(messageIds) || !reader) return;

        // Update messages to 'read' status if database is connected
        if (getIsConnected()) {
          await Message.updateMany(
            {
              _id: { $in: messageIds },
              sender: { $ne: reader }, // Don't mark own messages as read
            },
            { status: 'read' }
          );
        }

        // Notify all clients about the status update
        messageIds.forEach((messageId) => {
          io.emit('message_status_update', {
            messageId,
            status: 'read',
          });
        });
      } catch (error) {
        console.error('Error handling message_read:', error.message);
      }
    });

    /**
     * Event: disconnect
     * When a user disconnects. Updates their status and broadcasts.
     */
    socket.on('disconnect', async () => {
      try {
        const user = connectedUsers.get(socket.id);

        if (user) {
          // Remove from memory map
          connectedUsers.delete(socket.id);

          // Update database if connected
          if (getIsConnected()) {
            await User.findOneAndUpdate(
              { username: user.username },
              {
                isOnline: false,
                socketId: null,
                lastSeen: new Date(),
              }
            );
          }

          // Broadcast updated user list
          const onlineUsers = Array.from(connectedUsers.values());
          io.emit('user_status', onlineUsers);

          console.log(`❌ ${user.username} disconnected (${socket.id})`);
        }
      } catch (error) {
        console.error('Error handling disconnect:', error.message);
      }
    });
  });
};

module.exports = initializeSocket;
