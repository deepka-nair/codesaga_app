import React from 'react';
import audioManager from '../services/audioManager';

const GameButton = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  disabled = false,
  className = '', 
  style = {},
  type = 'button',
  ...props 
}) => {

  const handleMouseEnter = () => {
    if (disabled) {
      audioManager.playDisabled();
    } else {
      audioManager.playHover();
    }
  };

  const handleClick = (e) => {
    if (disabled) {
      e.preventDefault();
      audioManager.playDisabled();
      return;
    }
    audioManager.playClick();
    if (onClick) {
      onClick(e);
    }
  };

  const getVariantStyle = () => {
    if (disabled) {
      return {
        backgroundColor: '#1e293b',
        borderColor: '#334155',
        color: '#64748b',
        opacity: 0.6,
        cursor: 'not-allowed',
      };
    }
    switch (variant) {
      case 'gold':
        return { backgroundColor: 'var(--accent-gold)', borderColor: '#b45309', color: '#0a0e17' };
      case 'secondary':
        return { backgroundColor: 'transparent', borderColor: 'var(--panel-border)', color: 'var(--text-secondary)' };
      case 'danger':
        return { backgroundColor: 'var(--accent-red)', borderColor: '#991b1b', color: 'white' };
      case 'primary':
      default:
        return { backgroundColor: 'var(--accent-teal)', borderColor: '#0f766e', color: '#0a0e17' };
    }
  };

  return (
    <button 
      type={type}
      className={`pixel-button ${className}`}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      disabled={disabled}
      data-cursor={disabled ? 'disabled' : 'interaction'}
      style={{
        ...getVariantStyle(),
        ...style
      }}
      {...props}
    >
      {children}
    </button>
  );
};

export default GameButton;

