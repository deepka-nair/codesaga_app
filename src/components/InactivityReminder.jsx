import React, { useState, useEffect } from 'react';
import useStore from '../store/useStore';
import audioManager from '../services/audioManager';

const REMINDER_MESSAGES = [
  "👀 We missed you! Ready to continue your CodeSaga journey?",
  "🚀 Your next mission is waiting for you!",
  "🔥 Your streak is waiting — let's keep learning!",
  "💻 Your coding adventure isn't finished yet!",
  "✨ Come back and conquer your next mission!"
];

const InactivityReminder = () => {
  const { lastActiveTimestamp, updateLastActiveTimestamp } = useStore();
  const [showReminder, setShowReminder] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const now = Date.now();
    const lastActive = lastActiveTimestamp || 0;
    
    // Show reminder if user returns after 12+ hours of inactivity
    const INACTIVITY_THRESHOLD_MS = 12 * 60 * 60 * 1000;

    if (lastActive > 0 && (now - lastActive > INACTIVITY_THRESHOLD_MS)) {
      const randomMsg = REMINDER_MESSAGES[Math.floor(Math.random() * REMINDER_MESSAGES.length)];
      setMessage(randomMsg);
      setShowReminder(true);
    }

    // Always update last active timestamp on session activity
    updateLastActiveTimestamp(now);
  }, []);

  const handleDismiss = () => {
    audioManager.playClick();
    setShowReminder(false);
  };

  if (!showReminder) return null;

  return (
    <div 
      style={{
        backgroundColor: 'rgba(23, 53, 54, 0.95)',
        border: '2px solid #E6A93D',
        borderRadius: '10px',
        padding: '0.85rem 1.25rem',
        marginBottom: '1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 4px 15px rgba(230, 169, 61, 0.2)',
        flexWrap: 'wrap',
        gap: '0.75rem',
        animation: 'fadeIn 0.3s ease'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <span style={{ fontSize: '1.4rem' }}>🌟</span>
        <div>
          <strong style={{ color: '#E6A93D', fontFamily: 'var(--font-pixel)', fontSize: '0.8rem', display: 'block' }}>
            WELCOME BACK, SLEUTH!
          </strong>
          <span style={{ color: '#F6F4EB', fontSize: '0.85rem' }}>
            {message}
          </span>
        </div>
      </div>

      <button
        onClick={handleDismiss}
        data-cursor="interaction"
        style={{
          backgroundColor: '#0E2526',
          color: '#A8B8B4',
          border: '1px solid #2a5a5c',
          borderRadius: '6px',
          padding: '4px 10px',
          fontFamily: 'var(--font-pixel)',
          fontSize: '0.65rem',
          cursor: 'pointer',
          transition: 'all 0.15s ease'
        }}
      >
        DISMISS ×
      </button>
    </div>
  );
};

export default InactivityReminder;
