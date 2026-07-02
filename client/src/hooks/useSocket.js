import { useEffect, useCallback, useRef } from 'react';
import { useSocketContext } from '../context/SocketContext';

/**
 * Custom hook for Socket.io event management.
 * Handles subscribing/unsubscribing to events cleanly.
 *
 * @param {string} event - Socket event name
 * @param {Function} handler - Event handler function
 */
export const useSocketEvent = (event, handler) => {
  const { socket } = useSocketContext();
  const handlerRef = useRef(handler);

  // Keep handler ref current
  useEffect(() => {
    handlerRef.current = handler;
  }, [handler]);

  useEffect(() => {
    if (!socket) return;

    const eventHandler = (...args) => handlerRef.current(...args);

    socket.on(event, eventHandler);

    return () => {
      socket.off(event, eventHandler);
    };
  }, [socket, event]);
};

/**
 * Custom hook to emit Socket.io events.
 * Returns a stable emit function.
 */
export const useSocketEmit = () => {
  const { socket } = useSocketContext();

  const emit = useCallback(
    (event, data) => {
      if (socket && socket.connected) {
        socket.emit(event, data);
      } else {
        console.warn('Socket not connected. Cannot emit:', event);
      }
    },
    [socket]
  );

  return emit;
};

export default useSocketEvent;
