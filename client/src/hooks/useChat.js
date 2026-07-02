import { useState, useEffect, useCallback, useRef } from 'react';
import { useSocketContext } from '../context/SocketContext';
import { useSocketEvent, useSocketEmit } from './useSocket';
import { useAuth } from '../context/AuthContext';
import { fetchMessages } from '../services/api';

/**
 * Custom hook encapsulating all chat logic:
 * - Message fetching and state
 * - Real-time message sending/receiving via Socket.io
 * - Typing indicators
 * - Online users tracking
 * - Message status updates
 */
const useChat = () => {
  const { user } = useAuth();
  const { socket, isConnected } = useSocketContext();
  const emit = useSocketEmit();

  // State
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Refs
  const typingTimeoutRef = useRef(null);
  const isTypingRef = useRef(false);

  // ─── Fetch Chat History ──────────────────────────────────────
  const loadMessages = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetchMessages(1, 100);
      if (response.success) {
        setMessages(response.data);
      }
    } catch (err) {
      console.error('Failed to load messages:', err);
      setError('Failed to load messages. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load messages on mount
  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  // ─── Join Room on Connect ────────────────────────────────────
  useEffect(() => {
    if (socket && isConnected && user) {
      emit('user_join', user.username);
    }
  }, [socket, isConnected, user, emit]);

  // ─── Socket Event Handlers ──────────────────────────────────

  // Receive new messages in real-time
  useSocketEvent('new_message', (message) => {
    setMessages((prev) => {
      // Avoid duplicates
      const exists = prev.some((m) => m._id === message._id);
      if (exists) return prev;
      return [...prev, message];
    });
  });

  // Track online/offline users
  useSocketEvent('user_status', (users) => {
    setOnlineUsers(users);
  });

  // Typing indicator — someone started typing
  useSocketEvent('typing', (username) => {
    if (username === user?.username) return;
    setTypingUsers((prev) => {
      if (prev.includes(username)) return prev;
      return [...prev, username];
    });
  });

  // Typing indicator — someone stopped typing
  useSocketEvent('stop_typing', (username) => {
    setTypingUsers((prev) => prev.filter((u) => u !== username));
  });

  // Message status updates
  useSocketEvent('message_status_update', ({ messageId, status }) => {
    setMessages((prev) =>
      prev.map((msg) => (msg._id === messageId ? { ...msg, status } : msg))
    );
  });

  // Handle socket errors
  useSocketEvent('error_message', (data) => {
    console.error('Socket error:', data.error);
    setError(data.error);
    setTimeout(() => setError(null), 3000);
  });

  // ─── Send Message ────────────────────────────────────────────
  const sendMessage = useCallback(
    (text) => {
      if (!text.trim() || !user) return;

      // Stop typing indicator
      if (isTypingRef.current) {
        emit('stop_typing', user.username);
        isTypingRef.current = false;
      }

      // Clear typing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = null;
      }

      // Send via Socket.io for real-time delivery
      emit('send_message', {
        sender: user.username,
        text: text.trim(),
      });
    },
    [user, emit]
  );

  // ─── Typing Indicator ───────────────────────────────────────
  const handleTyping = useCallback(() => {
    if (!user) return;

    if (!isTypingRef.current) {
      isTypingRef.current = true;
      emit('typing', user.username);
    }

    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Stop typing after 2 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      isTypingRef.current = false;
      emit('stop_typing', user.username);
    }, 2000);
  }, [user, emit]);

  // ─── Mark Messages as Read ──────────────────────────────────
  const markAsRead = useCallback(
    (messageIds) => {
      if (!user || !messageIds.length) return;

      emit('message_read', {
        messageIds,
        reader: user.username,
      });
    },
    [user, emit]
  );

  // Cleanup typing timeout on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  return {
    messages,
    onlineUsers,
    typingUsers,
    isLoading,
    error,
    sendMessage,
    handleTyping,
    markAsRead,
    loadMessages,
  };
};

export default useChat;
