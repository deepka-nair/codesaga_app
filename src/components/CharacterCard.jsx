import React, { useRef } from 'react';
import audioManager from '../services/audioManager';

const CharacterCard = ({ character, isSelected, onSelect }) => {
  const lastHoverTime = useRef(0);

  const handleMouseEnter = () => {
    const now = Date.now();
    // 400ms debounce cooldown to prevent sound spam when rapidly moving across cards
    if (now - lastHoverTime.current > 400) {
      lastHoverTime.current = now;
      if (character?.voiceType === 'male') {
        audioManager.playMaleVoice();
      } else {
        audioManager.playFemaleVoice();
      }
    }
  };

  const handleClick = () => {
    audioManager.playCharacterSelected();
    if (onSelect && character?.id) {
      onSelect(character.id);
    }
  };

  const safeChar = character || {
    id: 'm1',
    name: 'Aiden',
    gender: 'Male',
    title: 'Tactical Detective',
    color: '#06b6d4'
  };

  const imageSrc = `/assets/characters/${safeChar.id}_${safeChar.name.toLowerCase()}.jpg`;

  return (
    <div
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      data-cursor="interaction"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '1rem 0.85rem',
        backgroundColor: isSelected ? '#173536' : '#112223',
        border: `3px solid ${isSelected ? '#E6A93D' : '#234a4b'}`,
        borderRadius: '10px',
        boxShadow: isSelected
          ? '0 0 15px rgba(230, 169, 61, 0.4), inset 0 0 8px rgba(230, 169, 61, 0.15)'
          : '0 4px 6px rgba(0,0,0,0.3)',
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        userSelect: 'none',
        transform: isSelected ? 'translateY(-4px)' : 'none',
        position: 'relative',
        cursor: 'pointer'
      }}
    >
      {/* Selected Badge Indicator */}
      {isSelected && (
        <div
          style={{
            position: 'absolute',
            top: '-10px',
            right: '-8px',
            backgroundColor: '#E6A93D',
            color: '#0E2526',
            fontSize: '0.6rem',
            fontFamily: 'var(--font-pixel)',
            fontWeight: 'bold',
            padding: '2px 8px',
            borderRadius: '4px',
            border: '1.5px solid #0E2526',
            boxShadow: '0 2px 4px rgba(0,0,0,0.4)',
            zIndex: 2
          }}
        >
          SELECTED
        </div>
      )}

      {/* 1:1 Aspect Ratio Portrait Container */}
      <div
        style={{
          width: '84px',
          height: '84px',
          backgroundColor: '#0E2526',
          borderRadius: '8px',
          border: `2px solid ${isSelected ? '#E6A93D' : '#2a5a5c'}`,
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '0.75rem',
          position: 'relative',
          flexShrink: 0
        }}
      >
        {/* Gemini Pixel Portrait Asset */}
        <img
          src={imageSrc}
          alt={safeChar.name}
          onError={(e) => {
            // Fallback to SVG pixel render if image file fails
            e.target.style.display = 'none';
          }}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
            transition: 'transform 0.2s ease'
          }}
        />

        {/* SVG Fallback Render */}
        <svg
          width="76"
          height="76"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{
            position: 'absolute',
            top: 4,
            left: 4,
            shapeRendering: 'crispEdges',
            pointerEvents: 'none'
          }}
        >
          <rect x="3" y="3" width="18" height="18" fill="#0E2526" />
          <rect x="6" y="4" width="12" height="6" fill={safeChar.hairColor || '#3b82f6'} />
          {safeChar.gender === 'Female' && (
            <rect x="4" y="6" width="16" height="10" fill={safeChar.hairColor || '#3b82f6'} />
          )}
          <rect x="7" y="7" width="10" height="7" fill={safeChar.skinColor || '#fde047'} />
          <rect x="9" y="9" width="2" height="2" fill="#0E2526" />
          <rect x="13" y="9" width="2" height="2" fill="#0E2526" />
          <rect x="10" y="12" width="4" height="1" fill="#9a3412" />
          <rect x="6" y="14" width="12" height="8" fill={safeChar.coatColor || '#1e293b'} />
          <rect x="10" y="14" width="4" height="8" fill={safeChar.accentColor || '#06b6d4'} />
        </svg>
      </div>

      {/* Character Name — Strongest visual text */}
      <h4
        style={{
          fontFamily: 'var(--font-pixel)',
          fontSize: '0.85rem',
          color: isSelected ? '#E6A93D' : '#F6F4EB',
          margin: '0 0 0.2rem 0',
          textAlign: 'center',
          lineHeight: 1.2
        }}
      >
        {safeChar.name}
      </h4>

      {/* Role / Title — Muted smaller text */}
      <div
        style={{
          fontSize: '0.7rem',
          color: '#A8B8B4',
          textAlign: 'center',
          marginBottom: '0.5rem',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          maxWidth: '100%'
        }}
      >
        {safeChar.title}
      </div>

      {/* Gender Tag — Subtle pill */}
      <span
        style={{
          fontSize: '0.58rem',
          fontFamily: 'var(--font-pixel)',
          color: '#A8D5CE',
          backgroundColor: 'rgba(14, 37, 38, 0.7)',
          padding: '2px 8px',
          borderRadius: '4px',
          border: '1px solid #2a5a5c'
        }}
      >
        {safeChar.gender.toUpperCase()}
      </span>
    </div>
  );
};

export default CharacterCard;
