/**
 * Chat header showing room name, online count, and mobile menu toggle.
 */
const ChatHeader = ({ onlineCount, onToggleSidebar }) => {
  return (
    <header className="chat-header">
      <div className="chat-header-left">
        <button
          className="mobile-menu-btn"
          onClick={onToggleSidebar}
          aria-label="Toggle sidebar"
          id="mobile-menu-btn"
        >
          ☰
        </button>
        <div className="chat-header-info">
          <h1>General Chat</h1>
          <p className="chat-header-status">
            <span className="online-count">{onlineCount}</span>{' '}
            {onlineCount === 1 ? 'user' : 'users'} online
          </p>
        </div>
      </div>
    </header>
  );
};

export default ChatHeader;
