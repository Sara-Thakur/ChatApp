import { formatTime } from '../utils/formatTime';

/**
 * Individual message bubble component.
 * Shows sender name (for received), text, timestamp, and delivery status.
 */
const MessageBubble = ({ message, isSent }) => {
  const { sender, text, timestamp, status } = message;

  // Delivery status icon
  const getStatusIcon = () => {
    switch (status) {
      case 'read':
        return '✓✓';
      case 'delivered':
        return '✓✓';
      case 'sent':
      default:
        return '✓';
    }
  };

  return (
    <div className={`message-wrapper ${isSent ? 'sent' : 'received'}`}>
      {!isSent && <span className="message-sender">{sender}</span>}
      <div className="message-bubble">
        {text}
      </div>
      <div className="message-meta">
        <span className="message-time">{formatTime(timestamp)}</span>
        {isSent && (
          <span className={`message-status ${status || 'sent'}`}>
            {getStatusIcon()}
          </span>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;
