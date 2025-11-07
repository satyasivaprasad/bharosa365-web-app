import { useState, useEffect } from 'react';

export const useNotification = () => {
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type = 'success', duration = 5000) => {
    const id = Date.now();
    setNotification({ id, message, type, duration });
  };

  const hideNotification = () => {
    setNotification(null);
  };

  useEffect(() => {
    if (notification && notification.duration > 0) {
      const timer = setTimeout(() => {
        hideNotification();
      }, notification.duration);

      return () => clearTimeout(timer);
    }
  }, [notification]);

  return {
    notification,
    showNotification,
    hideNotification
  };
};

export const NotificationContainer = ({ notification, onClose }) => {
  if (!notification) return null;

  return (
    <div className={`notification ${notification.type}`}>
      <span>{notification.type === 'success' ? '✓' : '⚠'}</span>
      <span>{notification.message}</span>
      <button 
        className="notification-close"
        onClick={onClose}
        aria-label="Close notification"
      >
        ×
      </button>
    </div>
  );
};