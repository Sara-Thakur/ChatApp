import OnlineUsers from './OnlineUsers';
import { useAuth } from '../context/AuthContext';

/**
 * Sidebar component with app branding, online users list,
 * current user info, and logout button.
 */
const Sidebar = ({ onlineUsers, isOpen, onClose }) => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    window.location.reload();
  };

  return (
    <>
      {/* Mobile overlay */}
      <div
        className={`sidebar-overlay ${isOpen ? 'open' : ''}`}
        onClick={onClose}
      />

      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        {/* Sidebar Header */}
        <div className="sidebar-header">
          <div className="sidebar-logo">💬</div>
          <span className="sidebar-title">ChatApp</span>
        </div>

        {/* Online Users Section */}
        <div className="sidebar-section-title">
          Online — {onlineUsers.length}
        </div>
        <OnlineUsers users={onlineUsers} currentUser={user?.username} />

        {/* Current User Footer */}
        <div className="sidebar-footer">
          <div className="current-user-info">
            <div className="user-avatar is-self">
              {user?.username?.charAt(0).toUpperCase()}
              <span className="status-dot online" />
            </div>
            <div className="current-user-details">
              <div className="current-user-name">{user?.username}</div>
              <div className="current-user-label">Logged in</div>
            </div>
            <button
              className="logout-btn"
              onClick={handleLogout}
              id="logout-btn"
            >
              Logout
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
