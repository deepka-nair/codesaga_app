import React, { useEffect } from 'react';
import PixelPanel from './PixelPanel';
import GameButton from './GameButton';
import audioManager from '../services/audioManager';

const ChapterCompletionModal = ({ chapter, xpEarned = 500, coinsEarned = 200, stars = 3, onContinue, isWorldComplete = false, worldId = 'sql', worldName = '' }) => {
  useEffect(() => {
    audioManager.playChapterCompleted();
  }, []);

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(10, 14, 23, 0.9)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
      }}
    >
      <PixelPanel 
        style={{
          maxWidth: '520px',
          width: '100%',
          textAlign: 'center',
          border: '4px solid var(--accent-gold)',
          boxShadow: '0 0 30px rgba(245, 158, 11, 0.5)',
          padding: '2.5rem 2rem',
        }}
      >
        {/* Trophy / Star Banner */}
        <div style={{ fontSize: '3rem', marginBottom: '0.5rem', animation: 'bounce 1s infinite alternate' }}>
          🏆
        </div>

        <h2 style={{ color: 'var(--accent-gold)', marginBottom: '0.5rem', fontSize: '1.8rem', textShadow: '2px 2px 0 #000' }}>
          CHAPTER {chapter?.id || 1} COMPLETED!
        </h2>

        <p style={{ color: 'var(--accent-teal)', fontFamily: 'var(--font-pixel)', fontSize: '0.8rem', marginBottom: '1.5rem' }}>
          {(chapter?.title || 'CHAPTER').toUpperCase()} — MYSTERY SOLVED
        </p>

        {/* Stars Display */}
        <div style={{ fontSize: '2rem', marginBottom: '1.5rem', display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
          {[1, 2, 3].map((star) => (
            <span key={star} style={{ opacity: star <= stars ? 1 : 0.3, filter: star <= stars ? 'drop-shadow(0 0 8px #f59e0b)' : 'none' }}>
              ⭐
            </span>
          ))}
        </div>

        {/* Rewards Breakdown */}
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '1rem',
            backgroundColor: '#0f172a',
            padding: '1rem',
            borderRadius: '8px',
            border: '2px solid var(--panel-border)',
            marginBottom: '1.5rem',
          }}
        >
          <div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-pixel)' }}>XP REWARD</div>
            <div style={{ fontSize: '1.2rem', color: 'var(--accent-teal)', fontFamily: 'var(--font-pixel)' }}>+{xpEarned} XP</div>
          </div>
          <div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-pixel)' }}>COINS EARNED</div>
            <div style={{ fontSize: '1.2rem', color: 'var(--accent-gold)', fontFamily: 'var(--font-pixel)' }}>+{coinsEarned} 💰</div>
          </div>
        </div>

        {/* Concepts Mastered */}
        <div style={{ marginBottom: '2rem', textAlign: 'left' }}>
          <div style={{ fontSize: '0.7rem', color: 'var(--accent-gold)', fontFamily: 'var(--font-pixel)', marginBottom: '0.5rem' }}>
            CONCEPTS MASTERED:
          </div>
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
            {(chapter?.concepts || ['Syntax', 'Logic', 'Problem Solving']).map((c) => (
              <span 
                key={c}
                style={{
                  fontSize: '0.7rem',
                  backgroundColor: '#1e293b',
                  color: 'white',
                  padding: '3px 8px',
                  borderRadius: '4px',
                  border: '1px solid #334155'
                }}
              >
                ✓ {c}
              </span>
            ))}
          </div>
        </div>


        {/* World Completion Celebration Card */}
        {isWorldComplete && (
          <div style={{
            backgroundColor: 'rgba(234, 179, 8, 0.2)',
            border: '2px solid #eab308',
            padding: '1rem',
            borderRadius: '8px',
            marginBottom: '1.5rem',
            color: '#fef08a'
          }}>
            <h3 style={{ margin: '0 0 0.4rem 0', fontFamily: 'var(--font-pixel)', fontSize: '1.2rem', color: '#eab308' }}>
              🎉 WORLD COMPLETE!
            </h3>
            <p style={{ margin: 0, fontSize: '0.85rem' }}>
              You have successfully completed <strong>{worldName || 'this world'}</strong>! Your official World Certificate is now unlocked.
            </p>
          </div>
        )}

        {isWorldComplete ? (
          <GameButton onClick={() => window.location.href = `/certificate?world=${worldId || 'sql'}`} variant="gold" style={{ width: '100%', padding: '1rem' }}>
            VIEW CERTIFICATE 🎓
          </GameButton>
        ) : (
          <GameButton onClick={onContinue} variant="gold" style={{ width: '100%', padding: '1rem' }}>
            CONTINUE TO NEXT CHAPTER →
          </GameButton>
        )}
      </PixelPanel>
    </div>
  );
};

export default ChapterCompletionModal;
