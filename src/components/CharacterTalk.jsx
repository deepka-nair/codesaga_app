import React, { useState, useEffect } from 'react';
import { getCharacterById } from '../data/characterSprites';
import audioManager from '../services/audioManager';

const CharacterTalk = ({ 
  characterId = 'f1', 
  dialogText = '', 
  onSpeakEnd,
  style = {} 
}) => {
  const character = getCharacterById(characterId);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [eyeState, setEyeState] = useState('open'); // 'open', 'closed'

  // Natural Blinking Animation Interval
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setEyeState('closed');
      setTimeout(() => setEyeState('open'), 160);
    }, 4500 + Math.random() * 2000);

    return () => clearInterval(blinkInterval);
  }, []);

  // Trigger natural English speech dialogue
  const handleTalkTrigger = () => {
    if (isSpeaking) return;
    setIsSpeaking(true);

    // Prefer Web Speech API English synthesis if available in browser
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel(); // Stop any pending speech
        const utterance = new SpeechSynthesisUtterance(dialogText);
        utterance.rate = 1.0;
        utterance.pitch = character.voiceType === 'female' ? 1.2 : 0.9;
        utterance.lang = 'en-US';

        utterance.onend = () => {
          setIsSpeaking(false);
          if (onSpeakEnd) onSpeakEnd();
        };

        utterance.onerror = () => {
          setIsSpeaking(false);
          // Fallback to retro audio chirp
          if (character.voiceType === 'male') {
            audioManager.playMaleVoice();
          } else {
            audioManager.playFemaleVoice();
          }
        };

        window.speechSynthesis.speak(utterance);
      } catch (e) {
        setIsSpeaking(false);
      }
    } else {
      // Fallback to retro voice chirp
      if (character.voiceType === 'male') {
        audioManager.playMaleVoice();
      } else {
        audioManager.playFemaleVoice();
      }
      setTimeout(() => {
        setIsSpeaking(false);
        if (onSpeakEnd) onSpeakEnd();
      }, 1500);
    }
  };

  const imageSrc = `/assets/characters/${character.id}_${character.name.toLowerCase()}.jpg`;

  return (
    <div 
      onClick={handleTalkTrigger}
      data-cursor="interaction"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        border: `3px solid ${character.color}`,
        borderRadius: '12px',
        padding: '0.85rem 1.25rem',
        boxShadow: `0 0 15px ${character.color}40`,
        maxWidth: '720px',
        userSelect: 'none',
        transition: 'transform 0.15s ease',
        transform: isSpeaking ? 'scale(1.01)' : 'scale(1)',
        ...style
      }}
    >
      {/* Animated Character Avatar */}
      <div 
        style={{
          width: '76px',
          height: '76px',
          borderRadius: '10px',
          overflow: 'hidden',
          backgroundColor: '#0a0e17',
          border: `2px solid ${isSpeaking ? 'var(--accent-gold)' : character.color}`,
          flexShrink: 0,
          position: 'relative',
          boxShadow: isSpeaking ? '0 0 14px rgba(245, 158, 11, 0.8)' : 'none',
          transition: 'all 0.15s ease'
        }}
      >
        {/* Character Portrait Asset */}
        <img
          src={imageSrc}
          alt={character.name}
          onError={(e) => { e.target.style.display = 'none'; }}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block'
          }}
        />
      </div>


      {/* Detective Dialog Text */}
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
          <span style={{ fontFamily: 'var(--font-pixel)', fontSize: '0.75rem', color: character.color }}>
            {character.name.toUpperCase()}
          </span>
          <span style={{ fontSize: '0.65rem', color: 'var(--accent-gold)', fontFamily: 'var(--font-pixel)' }}>
            ({character.title})
          </span>
          {isSpeaking && (
            <span style={{ fontSize: '0.6rem', color: 'var(--accent-teal)', fontFamily: 'var(--font-pixel)' }}>
              🗣️ SPEAKING ENGLISH...
            </span>
          )}
        </div>
        <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-primary)', lineHeight: 1.4 }}>
          "{dialogText}"
        </p>
      </div>
    </div>
  );
};

export default CharacterTalk;
