import { useState, useRef, useCallback } from 'react';

/**
 * Message input component with send button.
 * Emits typing events as the user types.
 */
const MessageInput = ({ onSend, onTyping, disabled }) => {
  const [text, setText] = useState('');
  const inputRef = useRef(null);

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      if (!text.trim() || disabled) return;

      onSend(text);
      setText('');

      // Refocus input after sending
      inputRef.current?.focus();
    },
    [text, disabled, onSend]
  );

  const handleChange = useCallback(
    (e) => {
      setText(e.target.value);
      if (onTyping) onTyping();
    },
    [onTyping]
  );

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSubmit(e);
      }
    },
    [handleSubmit]
  );

  return (
    <div className="message-input-container">
      <form className="message-input-form" onSubmit={handleSubmit}>
        <div className="message-input-wrapper">
          <input
            ref={inputRef}
            id="message-input"
            type="text"
            className="message-input"
            placeholder="Type a message..."
            value={text}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            autoComplete="off"
            maxLength={2000}
          />
        </div>
        <button
          id="send-button"
          type="submit"
          className="send-btn"
          disabled={!text.trim() || disabled}
          aria-label="Send message"
        >
          ➤
        </button>
      </form>
    </div>
  );
};

export default MessageInput;
