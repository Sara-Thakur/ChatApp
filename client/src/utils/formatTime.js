/**
 * Format a timestamp into a readable time string.
 * @param {string|Date} timestamp - ISO string or Date object
 * @returns {string} Formatted time (e.g., "2:30 PM")
 */
export const formatTime = (timestamp) => {
  if (!timestamp) return '';

  const date = new Date(timestamp);

  if (isNaN(date.getTime())) return '';

  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

/**
 * Format a timestamp into a readable date string.
 * Returns "Today", "Yesterday", or the full date.
 * @param {string|Date} timestamp - ISO string or Date object
 * @returns {string} Formatted date
 */
export const formatDate = (timestamp) => {
  if (!timestamp) return '';

  const date = new Date(timestamp);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) {
    return 'Today';
  }

  if (date.toDateString() === yesterday.toDateString()) {
    return 'Yesterday';
  }

  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined,
  });
};

/**
 * Check if two timestamps are on different dates.
 * Used to insert date separators between messages.
 * @param {string|Date} ts1 - First timestamp
 * @param {string|Date} ts2 - Second timestamp
 * @returns {boolean} True if dates differ
 */
export const isDifferentDate = (ts1, ts2) => {
  if (!ts1 || !ts2) return true;
  const d1 = new Date(ts1);
  const d2 = new Date(ts2);
  return d1.toDateString() !== d2.toDateString();
};
