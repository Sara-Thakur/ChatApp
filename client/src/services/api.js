const API_BASE = '/api';

/**
 * Fetch paginated chat history from the server.
 * @param {number} page - Page number (default: 1)
 * @param {number} limit - Messages per page (default: 50)
 * @returns {Promise<Object>} Response with messages array and pagination info
 */
export const fetchMessages = async (page = 1, limit = 50) => {
  try {
    const response = await fetch(`${API_BASE}/messages?page=${page}&limit=${limit}`);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching messages:', error);
    throw error;
  }
};

/**
 * Send a new message via REST API.
 * @param {Object} data - Message data { sender, text }
 * @returns {Promise<Object>} The created message
 */
export const sendMessageAPI = async (data) => {
  try {
    const response = await fetch(`${API_BASE}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

/**
 * Login with a username (dummy authentication).
 * @param {string} username - The username to login with
 * @returns {Promise<Object>} User data
 */
export const loginAPI = async (username) => {
  try {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username }),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error during login:', error);
    throw error;
  }
};

/**
 * Fetch online users list.
 * @returns {Promise<Object>} Online users array
 */
export const fetchOnlineUsers = async () => {
  try {
    const response = await fetch(`${API_BASE}/auth/users`);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching online users:', error);
    throw error;
  }
};
