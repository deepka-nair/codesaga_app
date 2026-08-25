import React from 'react';
import { useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';
import { getCharacterById } from '../data/characterSprites';
import audioManager from '../services/audioManager';

const GameHUD = () => {
  const navigate = useNavigate();
  const { hearts, xp, streak, level, coins, character, isMuted, toggleMute } = useStore();
  const activeChar = getCharacterById(character || 'm1');

  const handleMuteToggle = () => {
    toggleMute();
    audioManager.playClick();
  };

  const handleOpenProfile = () => {
    audioManager.playClick();
    navigate('/profile');
  };

  const safeXp = xp || 0;
  const safeLevel = level || 1;
  const safeCoins = coins || 0;
  const safeStreak = streak || 1;
  const safeHearts = hearts || 5;

  const currentXpProgress = safeXp % 500;
  const xpPercentage = (currentXpProgress / 500) * 100;

  return (
    <div className="hud-container" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
      {/* Player Character Avatar */}
      <div 
        onClick={handleOpenProfile}
        data-cursor="interaction"
        title="Open Character Sheet Profile"
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.5rem', 
          backgroundColor: 'rgba(0,0,0,0.5)', 
          padding: '4px 10px', 
          borderRadius: '8px', 
          border: `2px solid ${activeChar.color}`,
          cursor: 'pointer'
        }}
      >
        <div style={{ width: '24px', height: '24px', borderRadius: '4px', overflow: 'hidden', backgroundColor: '#0f172a' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ shapeRendering: 'crispEdges' }}>
            <rect width="24" height="24" fill="#0f172a" />
            <rect x="5" y="4" width="14" height="6" fill={activeChar.hairColor} />
            <rect x="7" y="7" width="10" height="7" fill={activeChar.skinColor} />
            <rect x="9" y="9" width="2" height="2" fill="#0f172a" />
            <rect x="13" y="9" width="2" height="2" fill="#0f172a" />
            <rect x="6" y="14" width="12" height="8" fill={activeChar.coatColor} />
            <rect x="10" y="14" width="4" height="8" fill={activeChar.accentColor} />
          </svg>
        </div>
        <span style={{ fontFamily: 'var(--font-pixel)', fontSize: '0.7rem', color: 'var(--accent-gold)' }}>
          {activeChar.name}
        </span>
      </div>

      {/* Level & XP */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', minWidth: '85px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', fontFamily: 'var(--font-pixel)' }}>
          <span style={{ color: 'var(--accent-teal)' }}>LV {safeLevel}</span>
          <span style={{ color: 'var(--text-secondary)' }}>{safeXp} XP</span>
        </div>
        <div style={{ width: '100%', height: '6px', backgroundColor: '#1e293b', borderRadius: '3px', overflow: 'hidden', border: '1px solid #334155' }}>
          <div style={{ width: `${xpPercentage}%`, height: '100%', backgroundColor: 'var(--accent-teal)', transition: 'width 0.3s ease' }} />
        </div>
      </div>

      {/* Coins */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '0.75rem', fontFamily: 'var(--font-pixel)', color: '#f59e0b' }}>
        <span>💰</span>
        <span>{safeCoins}</span>
      </div>

      {/* Streak */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '0.75rem', fontFamily: 'var(--font-pixel)', color: '#f97316' }}>
        <span>🔥</span>
        <span>{safeStreak}</span>
      </div>

      {/* Hearts */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '0.75rem', fontFamily: 'var(--font-pixel)', color: '#ef4444' }}>
        <span>❤️</span>
        <span>{safeHearts}</span>
      </div>

      {/* Audio Mute Toggle Button */}
      <button
        onClick={handleMuteToggle}
        data-cursor="interaction"
        style={{
          backgroundColor: isMuted ? 'rgba(239, 68, 68, 0.2)' : 'rgba(0,0,0,0.5)',
          border: `2px solid ${isMuted ? '#ef4444' : 'var(--border-color)'}`,
          color: isMuted ? '#ef4444' : 'var(--text-secondary)',
          borderRadius: '8px',
          padding: '6px 10px',
          fontFamily: 'var(--font-pixel)',
          fontSize: '0.7rem',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          transition: 'all 0.2s ease'
        }}
      >
        <span>{isMuted ? '🔇' : '🔊'}</span>
      </button>
    </div>
  );
};

export default GameHUD;
