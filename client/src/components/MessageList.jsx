import { useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';
import { isDifferentDate, formatDate } from '../utils/formatTime';

/**
 * Scrollable message list with auto-scroll and date separators.
 */
const MessageList = ({ messages, currentUser, onMessagesViewed }) => {
  const listRef = useRef(null);
  const bottomRef = useRef(null);
  const prevLengthRef = useRef(0);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messages.length > prevLengthRef.current) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
    prevLengthRef.current = messages.length;
  }, [messages.length]);

  // Mark messages as read when visible
  useEffect(() => {
    if (!messages.length || !currentUser) return;

    const unreadIds = messages
      .filter(
        (m) =>
          m.sender !== currentUser &&
          m.status !== 'read'
      )
      .map((m) => m._id);

    if (unreadIds.length > 0 && onMessagesViewed) {
      onMessagesViewed(unreadIds);
    }
  }, [messages, currentUser, onMessagesViewed]);

  if (!messages.length) {
    return (
      <div className="message-list-container">
        <div className="messages-empty">
          <div className="messages-empty-icon">💬</div>
          <p className="messages-empty-text">No messages yet</p>
          <p className="messages-empty-sub">
            Start the conversation by sending a message!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="message-list-container" ref={listRef}>
      {messages.map((message, index) => {
        const prevMessage = index > 0 ? messages[index - 1] : null;
        const showDateSeparator = isDifferentDate(
          prevMessage?.timestamp,
          message.timestamp
        );

        return (
          <div key={message._id || index}>
            {showDateSeparator && (
              <div className="date-separator">
                <span>{formatDate(message.timestamp)}</span>
              </div>
            )}
            <MessageBubble
              message={message}
              isSent={message.sender === currentUser}
            />
          </div>
        );
      })}
      <div ref={bottomRef} />
    </div>
  );
};

export default MessageList;
