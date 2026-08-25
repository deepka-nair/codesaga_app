import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CharacterCard from '../components/CharacterCard';
import PixelPanel from '../components/PixelPanel';
import GameButton from '../components/GameButton';
import { CHARACTERS, getCharacterById } from '../data/characterSprites';
import audioManager from '../services/audioManager';
import useStore from '../store/useStore';

const Onboarding = () => {
  const navigate = useNavigate();
  const { character: currentStoreCharacter, updateCharacter, completeOnboarding } = useStore();

  const [selectedCharId, setSelectedCharId] = useState(currentStoreCharacter || 'm1');
  const activeChar = getCharacterById(selectedCharId);

  const handleSelectCharacter = (id) => {
    setSelectedCharId(id);
  };

  const handleConfirmAdventure = () => {
    audioManager.playContinue();
    updateCharacter(selectedCharId);
    completeOnboarding({ character: selectedCharId });
    navigate('/sql-detective');
  };

  return (
    <div 
      style={{ 
        minHeight: '100vh',
        backgroundColor: '#0E2526',
        color: '#F6F4EB',
        padding: '2rem 1rem 3rem 1rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}
    >
      <div style={{ maxWidth: '1100px', width: '100%' }}>
        {/* Header Title Section */}
        <header style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <span style={{ fontSize: '0.8rem', fontFamily: 'var(--font-pixel)', color: '#A8D5CE', letterSpacing: '2px' }}>
            DISTRICT 7 RECRUITMENT BUREAU
          </span>
          <h1 style={{ color: '#E6A93D', fontSize: '2.2rem', margin: '0.25rem 0 0.5rem 0', textShadow: '2px 2px 0 #000' }}>
            CHOOSE YOUR DETECTIVE
          </h1>
          <p style={{ color: '#A8B8B4', fontSize: '0.9rem', maxWidth: '600px', margin: '0 auto', lineHeight: 1.4 }}>
            Select your pixel-art RPG operative for Database Detective City. Every detective brings unique technical instincts to crime investigations.
          </p>
        </header>

        {/* Responsive 12-Character Selection Grid */}
        <div 
          style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', 
            gap: '1.25rem',
            marginBottom: '2rem'
          }}
        >
          {CHARACTERS.map((char) => (
            <CharacterCard
              key={char.id}
              character={char}
              isSelected={selectedCharId === char.id}
              onSelect={handleSelectCharacter}
            />
          ))}
        </div>

        {/* Selected Character Summary Banner */}
        <PixelPanel style={{ backgroundColor: '#173536', borderColor: '#234a4b', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center', flexWrap: 'wrap' }}>
            {/* Active Character Portrait Preview */}
            <div 
              style={{
                width: '76px',
                height: '76px',
                borderRadius: '8px',
                overflow: 'hidden',
                backgroundColor: '#0E2526',
                border: '2px solid #E6A93D',
                flexShrink: 0,
                position: 'relative'
              }}
            >
              <img
                src={`/assets/characters/${activeChar.id}_${activeChar.name.toLowerCase()}.jpg`}
                alt={activeChar.name}
                onError={(e) => { e.target.style.display = 'none'; }}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>

            {/* Character Specs & Quote */}
            <div style={{ flex: 1, minWidth: '240px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
                <h3 style={{ color: '#F6F4EB', margin: 0, fontSize: '1.25rem', fontFamily: 'var(--font-pixel)' }}>
                  {activeChar.name.toUpperCase()}
                </h3>
                <span style={{ fontSize: '0.7rem', color: '#A8D5CE', fontFamily: 'var(--font-pixel)' }}>
                  [{activeChar.title}]
                </span>
              </div>
              <p style={{ margin: '0 0 0.4rem 0', fontSize: '0.85rem', color: '#A8B8B4', lineHeight: 1.4 }}>
                {activeChar.description}
              </p>
              <div style={{ fontSize: '0.8rem', color: '#E6A93D', fontStyle: 'italic' }}>
                "{activeChar.quote}"
              </div>
            </div>
          </div>
        </PixelPanel>

        {/* Anchored Primary Action Button */}
        <div style={{ textAlign: 'center', paddingBottom: '2rem' }}>
          <GameButton
            onClick={handleConfirmAdventure}
            variant="gold"
            style={{
              fontSize: '1rem',
              padding: '1rem 3rem',
              boxShadow: '0 4px 15px rgba(230, 169, 61, 0.4)'
            }}
          >
            BEGIN MY ADVENTURE 🚀
          </GameButton>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
