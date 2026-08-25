import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import CharacterTalk from '../components/CharacterTalk';
import GameHUD from '../components/GameHUD';
import PixelPanel from '../components/PixelPanel';
import GameButton from '../components/GameButton';
import CppEditor from '../components/CppEditor';
import ChapterCompletionModal from '../components/ChapterCompletionModal';
import ErrorBoundary from '../components/ErrorBoundary';
import { CPP_CURRICULUM, getCppChapterById } from '../data/cppCurriculum';
import cppEngine from '../services/cppEngine';
import audioManager from '../services/audioManager';
import useStore from '../store/useStore';
import { isDeveloper } from '../utils/userRole';
import { isGuestUser } from '../utils/guestPreview';

const CppWorld = () => {
  const navigate = useNavigate();
  const { chapterId: routeChapterId } = useParams();
  
  const { 
    completedMissions, 
    completeMission, 
    completeChapter,
    cppProgress,
    updateCppProgress 
  } = useStore();

  const [activeChapterId, setActiveChapterId] = useState(Number(routeChapterId) || 1);
  const activeChapter = getCppChapterById(activeChapterId);

  const getResumedMissionIndex = (chapter) => {
    const firstUncompletedIdx = chapter.missions.findIndex(m => !completedMissions.includes(m.id));
    return firstUncompletedIdx === -1 ? chapter.missions.length - 1 : firstUncompletedIdx;
  };

  const [activeMissionIndex, setActiveMissionIndex] = useState(() => getResumedMissionIndex(activeChapter));
  
  // Interactive Mission State
  const [selectedOption, setSelectedOption] = useState(null);
  const [mcFeedback, setMcFeedback] = useState(null);
  const [isMissionSolved, setIsMissionSolved] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);

  const currentMission = activeChapter.missions[activeMissionIndex] || activeChapter.missions[0];

  useEffect(() => {
    if (routeChapterId) {
      const targetCh = Number(routeChapterId);
      setActiveChapterId(targetCh);
      const ch = getCppChapterById(targetCh);
      setActiveMissionIndex(getResumedMissionIndex(ch));
    }
  }, [routeChapterId]);

  // Reset mission state on mission switch
  useEffect(() => {
    setSelectedOption(null);
    setMcFeedback(null);
    setIsMissionSolved(completedMissions.includes(currentMission.id));
    updateCppProgress(activeChapterId, activeMissionIndex);
  }, [activeMissionIndex, activeChapterId, currentMission.id, completedMissions]);

  const handleSelectChapter = (chId) => {
    audioManager.playTabSwitch();
    setActiveChapterId(chId);
    const targetCh = getCppChapterById(chId);
    setActiveMissionIndex(getResumedMissionIndex(targetCh));
  };

  const handleCppResult = (userResult, code) => {
    if (!userResult.success) {
      setIsMissionSolved(false);
      return;
    }

    let isCorrect = false;

    if (currentMission.expectedOutput) {
      isCorrect = cppEngine.compareOutputs(userResult.output, currentMission.expectedOutput);
    } else {
      isCorrect = userResult.success && userResult.output.length > 0;
    }

    if (isCorrect) {
      audioManager.playSuccess();
      setIsMissionSolved(true);
      completeMission(currentMission.id, currentMission.xp || 50, currentMission.coins || 20);

      const isLastMission = activeMissionIndex === activeChapter.missions.length - 1;
      if (isLastMission) {
        completeChapter(activeChapterId, 3);
        setShowCompletionModal(true);
      }
    } else {
      audioManager.playWrongSql();
      setIsMissionSolved(false);
    }
  };

  const handleSelectOption = (optIdx) => {
    audioManager.playClick();
    setSelectedOption(optIdx);
    setMcFeedback(null);
  };

  const handleOptionSubmit = () => {
    if (selectedOption === null) return;

    const correctIdx = currentMission.answerIndex !== undefined ? currentMission.answerIndex : 0;
    
    if (selectedOption === correctIdx) {
      audioManager.playSuccess();
      setMcFeedback('correct');
      setIsMissionSolved(true);
      completeMission(currentMission.id, currentMission.xp || 50, currentMission.coins || 20);

      const isLastMission = activeMissionIndex === activeChapter.missions.length - 1;
      if (isLastMission) {
        completeChapter(activeChapterId, 3);
        setShowCompletionModal(true);
      }
    } else {
      audioManager.playError();
      setMcFeedback('wrong');
      setIsMissionSolved(false);
    }
  };


  const handleNextMission = () => {
    audioManager.playContinue();
    if (activeMissionIndex < activeChapter.missions.length - 1) {
      const nextIdx = activeMissionIndex + 1;
      setActiveMissionIndex(nextIdx);
      updateCppProgress(activeChapterId, nextIdx);
    } else {
      completeChapter(activeChapterId, 3);
      setShowCompletionModal(true);
    }
  };

  const handlePrevMission = () => {
    audioManager.playBack();
    if (activeMissionIndex > 0) {
      const prevIdx = activeMissionIndex - 1;
      setActiveMissionIndex(prevIdx);
      updateCppProgress(activeChapterId, prevIdx);
    }
  };

  const handleModalContinue = () => {
    setShowCompletionModal(false);
    const nextChapterId = activeChapterId + 1;
    if (nextChapterId <= 12) {
      setActiveChapterId(nextChapterId);
      setActiveMissionIndex(0);
      updateCppProgress(nextChapterId, 0);
    } else {
      navigate('/worlds');
    }
  };

  const cppCompletedChapters = cppProgress?.completedChapters || [];

  const isDev = isDeveloper(useStore.getState().user);
  const isGuest = isGuestUser(useStore.getState());

  const isCurrentChapterLocked = !isDev && !isGuest && activeChapterId > 1 && !cppCompletedChapters.includes(activeChapterId - 1);
  const isCurrentMissionLocked = !isDev && !isGuest && activeMissionIndex > 0 && !completedMissions.includes(activeChapter.missions[activeMissionIndex - 1]?.id);

  if (isCurrentChapterLocked || isCurrentMissionLocked) {
    const isChapLock = isCurrentChapterLocked;

    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#0E2526', padding: '4rem 1.5rem', textAlign: 'center', color: '#F6F4EB' }}>
        <PixelPanel style={{ maxWidth: '600px', margin: '0 auto', borderTop: '4px solid #ef4444', backgroundColor: '#173536' }}>
          <span style={{ fontSize: '3.5rem', display: 'block', marginBottom: '1rem' }}>🔒</span>
          <h2 style={{ color: '#ef4444', fontFamily: 'var(--font-pixel)', fontSize: '1.5rem', marginBottom: '0.75rem' }}>
            {isChapLock ? `C++ CHAPTER ${activeChapterId} IS LOCKED` : `C++ MISSION ${activeMissionIndex + 1} IS LOCKED`}
          </h2>
          <p style={{ color: '#A8B8B4', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: 1.5 }}>
            {isChapLock 
              ? `Complete all required missions in Chapter ${activeChapterId - 1} first to unlock Chapter ${activeChapterId}.`
              : `Complete Mission ${activeMissionIndex} (${activeChapter.missions[activeMissionIndex - 1]?.title || 'Previous Mission'}) first to unlock Mission ${activeMissionIndex + 1}.`
            }
          </p>
          <GameButton 
            onClick={() => {
              if (isChapLock) {
                const lastUnlocked = Math.max(1, ...(cppCompletedChapters.map(c => c + 1)), 1);
                setActiveChapterId(lastUnlocked);
                const ch = getCppChapterById(lastUnlocked);
                setActiveMissionIndex(getResumedMissionIndex(ch));
              } else {
                setActiveMissionIndex(getResumedMissionIndex(activeChapter));
              }
            }} 
            variant="gold"
          >
            {isChapLock ? 'RETURN TO UNLOCKED CHAPTER ⚡' : 'RETURN TO UNLOCKED MISSION 🎯'}
          </GameButton>
        </PixelPanel>
      </div>
    );
  }


  return (
    <ErrorBoundary>
      <div 
        style={{ 
          minHeight: '100vh',
          backgroundColor: '#0E2526',
          backgroundImage: 'linear-gradient(to bottom, rgba(14,37,38,0.9), rgba(10,14,23,0.95)), url("/assets/worlds/sql_hq.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          padding: '1.5rem 1rem',
          color: '#F6F4EB'
        }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {/* Header Bar */}
          <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div 
              onClick={() => navigate('/worlds')} 
              data-cursor="interaction"
              style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}
            >
              <span style={{ fontSize: '1.4rem' }}>⚡</span>
              <div>
                <h2 style={{ color: '#a855f7', margin: 0, fontSize: '1.4rem', fontFamily: 'var(--font-pixel)', textShadow: '2px 2px 0 #000' }}>
                  C++ CYBER ARENA RPG
                </h2>
                <span style={{ fontSize: '0.7rem', color: '#A8D5CE', fontFamily: 'var(--font-pixel)' }}>
                  Chapter {activeChapterId} of 12 • {activeChapter.title}
                </span>
              </div>
            </div>

            <GameHUD />
          </header>

          {/* Chapter Selection Bar */}
          <div 
            style={{ 
              display: 'flex', 
              gap: '0.5rem', 
              overflowX: 'auto', 
              paddingBottom: '0.75rem', 
              marginBottom: '1.5rem',
              scrollbarWidth: 'thin'
            }}
          >
            {CPP_CURRICULUM.map((ch) => {
              const isActive = activeChapterId === ch.id;

              return (
                <button
                  key={ch.id}
                  onClick={() => handleSelectChapter(ch.id)}
                  data-cursor="interaction"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    padding: '0.6rem 0.9rem',
                    borderRadius: '8px',
                    backgroundColor: isActive ? '#a855f7' : '#173536',
                    color: isActive ? '#0E2526' : '#F6F4EB',
                    border: '2px solid',
                    borderColor: isActive ? '#9333ea' : '#234a4b',
                    fontFamily: 'var(--font-pixel)',
                    fontSize: '0.65rem',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <span>{ch.icon}</span>
                  <span>CH {ch.id}</span>
                </button>
              );
            })}
          </div>

          {/* Main Gameplay Layout */}
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: '1.5rem' }}>
            <PixelPanel style={{ backgroundColor: '#173536', borderColor: '#234a4b', borderTop: `4px solid ${activeChapter.color}` }}>
              {/* Mission Card Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div>
                  <span style={{ fontSize: '0.7rem', fontFamily: 'var(--font-pixel)', color: '#E6A93D' }}>
                    MISSION #{activeChapterId}0{activeMissionIndex + 1} • {currentMission.type.toUpperCase().replace('_', ' ')}
                  </span>
                  <h3 style={{ color: '#F6F4EB', margin: '0.25rem 0 0 0', fontSize: '1.3rem' }}>
                    {currentMission.title}
                  </h3>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-pixel)', color: '#A8B8B4' }}>
                    Mission {activeMissionIndex + 1} / {activeChapter.missions.length}
                  </span>
                  {isMissionSolved && (
                    <span style={{ color: '#a855f7', fontFamily: 'var(--font-pixel)', fontSize: '0.75rem' }}>
                      ✓ SOLVED
                    </span>
                  )}
                </div>
              </div>

              {/* Animated Character Dialogue */}
              <div style={{ marginBottom: '1.25rem' }}>
                <CharacterTalk
                  characterId={activeChapterId % 2 === 1 ? 'm1' : 'm2'}
                  dialogText={currentMission.story}
                />
              </div>

              {/* Educational Concept Card (Loaded Immediately) */}
              {currentMission.conceptExplanation && (
                <div style={{ backgroundColor: '#0E2526', border: '1px solid #2a5a5c', borderRadius: '8px', padding: '1rem', marginBottom: '1.25rem' }}>
                  <h4 style={{ color: '#a855f7', fontSize: '0.8rem', marginBottom: '0.5rem', fontFamily: 'var(--font-pixel)' }}>
                    📖 C++ BRIEFING & EXPLANATION
                  </h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem', fontSize: '0.8rem' }}>
                    <div><strong style={{ color: '#E6A93D' }}>WHAT:</strong> {currentMission.conceptExplanation.what}</div>
                    <div><strong style={{ color: '#E6A93D' }}>WHY:</strong> {currentMission.conceptExplanation.why}</div>
                    <div><strong style={{ color: '#E6A93D' }}>WHEN:</strong> {currentMission.conceptExplanation.when}</div>
                    <div><strong style={{ color: '#E6A93D' }}>HOW:</strong> <code style={{ color: '#38bdf8' }}>{currentMission.conceptExplanation.how}</code></div>
                  </div>
                </div>
              )}

              {/* Interactive Mission Solver */}
              {['multiple_choice', 'code_matching', 'predict_output'].includes(currentMission.type) ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.75rem' }}>
                    {currentMission.options && currentMission.options.map((opt, idx) => {
                      const isOptSelected = selectedOption === idx;
                      const optionLabel = typeof opt === 'string' ? opt : `${opt.text} — (${opt.label})`;

                      return (
                        <button
                          key={idx}
                          onClick={() => handleSelectOption(idx)}
                          data-cursor="interaction"
                          style={{
                            padding: '1rem',
                            textAlign: 'left',
                            backgroundColor: isOptSelected ? (mcFeedback === 'correct' ? 'rgba(34, 197, 94, 0.2)' : mcFeedback === 'wrong' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(6, 182, 212, 0.25)') : '#0E2526',
                            color: '#F6F4EB',
                            border: '2px solid',
                            borderColor: isOptSelected ? (mcFeedback === 'correct' ? '#22c55e' : mcFeedback === 'wrong' ? '#ef4444' : '#06b6d4') : '#2a5a5c',
                            borderRadius: '8px',
                            fontSize: '0.85rem',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          <strong>{String.fromCharCode(65 + idx)}.</strong> {optionLabel}
                        </button>
                      );
                    })}
                  </div>

                  <GameButton 
                    onClick={handleOptionSubmit} 
                    disabled={selectedOption === null || isMissionSolved} 
                    variant="gold"
                    style={{ width: '100%', padding: '0.9rem', fontSize: '0.9rem' }}
                  >
                    SUBMIT ANSWER 🚀
                  </GameButton>


                  {mcFeedback && (
                    <div 
                      style={{
                        padding: '0.85rem',
                        borderRadius: '6px',
                        fontSize: '0.85rem',
                        fontFamily: 'var(--font-pixel)',
                        backgroundColor: mcFeedback === 'correct' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                        border: `2px solid ${mcFeedback === 'correct' ? '#22c55e' : '#ef4444'}`,
                        color: mcFeedback === 'correct' ? '#22c55e' : '#ef4444'
                      }}
                    >
                      {mcFeedback === 'correct' ? '✓ CORRECT ANSWER! Mission Completed!' : '❌ INCORRECT. Review the clue and try again.'}
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <CppEditor
                    key={currentMission.id}
                    initialCode={currentMission.template || currentMission.buggyCode || ''}
                    onExecuteResult={handleCppResult}
                    hintList={currentMission.hints || []}
                  />

                  {isMissionSolved && (
                    <div 
                      style={{
                        marginTop: '1rem',
                        padding: '0.85rem',
                        borderRadius: '6px',
                        fontSize: '0.85rem',
                        fontFamily: 'var(--font-pixel)',
                        backgroundColor: 'rgba(34, 197, 94, 0.2)',
                        border: '2px solid #22c55e',
                        color: '#22c55e'
                      }}
                    >
                      ✓ CORRECT ANSWER! Mission Completed!
                    </div>
                  )}
                </div>
              )}


              {/* Navigation Controls */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '2px solid #234a4b' }}>
                <GameButton 
                  onClick={handlePrevMission} 
                  disabled={activeMissionIndex === 0} 
                  variant="secondary"
                >
                  ← PREVIOUS
                </GameButton>

                <GameButton 
                  onClick={handleNextMission} 
                  disabled={!isMissionSolved} 
                  variant={isMissionSolved ? 'gold' : 'secondary'}
                >
                  {activeMissionIndex === activeChapter.missions.length - 1 ? 'COMPLETE CHAPTER 🏆' : 'NEXT MISSION →'}
                </GameButton>
              </div>
            </PixelPanel>
          </div>

          {/* Chapter Completion Modal */}
          {showCompletionModal && (
            <ChapterCompletionModal
              chapter={activeChapter}
              xpEarned={300}
              coinsEarned={150}
              stars={3}
              onContinue={handleModalContinue}
            />
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default CppWorld;
