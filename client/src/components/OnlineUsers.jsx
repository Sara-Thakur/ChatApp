/**
 * Online users list component.
 * Shows each user with their online status dot and avatar initial.
 */
const OnlineUsers = ({ users, currentUser }) => {
  if (!users || users.length === 0) {
    return (
      <div className="online-users-list">
        <div className="user-item">
          <span style={{ color: 'var(--text-tertiary)', fontSize: 'var(--font-size-sm)' }}>
            No users online
          </span>
        </div>
      </div>
    );
  }

  // Sort: current user first, then alphabetically
  const sortedUsers = [...users].sort((a, b) => {
    if (a.username === currentUser) return -1;
    if (b.username === currentUser) return 1;
    return a.username.localeCompare(b.username);
  });

  return (
    <div className="online-users-list">
      {sortedUsers.map((user) => {
        const isSelf = user.username === currentUser;
        const initial = user.username.charAt(0).toUpperCase();

        return (
          <div className="user-item" key={user.username || user.socketId}>
            <div className={`user-avatar ${isSelf ? 'is-self' : ''}`}>
              {initial}
              <span className="status-dot online" />
            </div>
            <div className="user-info">
              <div className="user-name">
                {user.username}
                {isSelf && ' (You)'}
              </div>
              <div className="user-status-text online">Online</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default OnlineUsers;
