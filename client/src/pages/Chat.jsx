import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSocketContext } from '../context/SocketContext';
import useChat from '../hooks/useChat';
import Sidebar from '../components/Sidebar';
import ChatHeader from '../components/ChatHeader';
import MessageList from '../components/MessageList';
import MessageInput from '../components/MessageInput';
import TypingIndicator from '../components/TypingIndicator';

/**
 * Main chat page — combines sidebar, header, message list, typing indicator, and input.
 */
const Chat = () => {
  const { user } = useAuth();
  const { isConnected, isReconnecting } = useSocketContext();
  const {
    messages,
    onlineUsers,
    typingUsers,
    isLoading,
    error,
    sendMessage,
    handleTyping,
    markAsRead,
  } = useChat();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="chat-layout">
      <div className="app-bg" />

      {/* Sidebar — Online Users */}
      <Sidebar
        onlineUsers={onlineUsers}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Chat Area */}
      <main className="chat-main">
        {/* Connection Status Banner */}
        {!isConnected && !isReconnecting && (
          <div className="connection-banner disconnected">
            ⚠ Disconnected from server. Messages may not be delivered.
          </div>
        )}
        {isReconnecting && (
          <div className="connection-banner reconnecting">
            🔄 Reconnecting to server...
          </div>
        )}

        {/* Header */}
        <ChatHeader
          onlineCount={onlineUsers.length}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />

        {/* Error Banner */}
        {error && (
          <div className="connection-banner disconnected">{error}</div>
        )}

        {/* Messages */}
        {isLoading ? (
          <div className="loading-container">
            <div className="spinner" />
            <p className="loading-text">Loading messages...</p>
          </div>
        ) : (
          <MessageList
            messages={messages}
            currentUser={user?.username}
            onMessagesViewed={markAsRead}
          />
        )}

        {/* Typing Indicator */}
        <TypingIndicator typingUsers={typingUsers} />

        {/* Message Input */}
        <MessageInput
          onSend={sendMessage}
          onTyping={handleTyping}
          disabled={!isConnected}
        />
      </main>
    </div>
  );
};

export default Chat;
