import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { loginAPI } from '../services/api';

/**
 * Login page with glassmorphism design.
 * Allows users to enter a username (dummy auth — no password required).
 */
const Login = () => {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const trimmed = username.trim();

    // Validation
    if (trimmed.length < 2) {
      setError('Username must be at least 2 characters');
      return;
    }

    if (trimmed.length > 20) {
      setError('Username cannot exceed 20 characters');
      return;
    }

    if (!/^[a-zA-Z0-9_]+$/.test(trimmed)) {
      setError('Username can only contain letters, numbers, and underscores');
      return;
    }

    try {
      setIsLoading(true);

      // Register/login on the server
      await loginAPI(trimmed);

      // Save locally
      login(trimmed);
    } catch (err) {
      setError('Failed to connect. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="app-bg" />

      <div className="login-card">
        <div className="login-logo">💬</div>
        <h2 className="login-title">Welcome to ChatApp</h2>
        <p className="login-subtitle">
          Enter a username to start chatting in real-time
        </p>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="username-input">Username</label>
            <input
              id="username-input"
              type="text"
              className="input-field"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={isLoading}
              autoComplete="off"
              autoFocus
              maxLength={20}
            />
          </div>

          {error && <div className="login-error">{error}</div>}

          <button
            id="login-btn"
            type="submit"
            className="login-btn"
            disabled={isLoading || !username.trim()}
          >
            {isLoading ? 'Connecting...' : 'Join Chat'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
