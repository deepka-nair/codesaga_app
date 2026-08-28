import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import CharacterTalk from '../components/CharacterTalk';
import GameHUD from '../components/GameHUD';
import PixelPanel from '../components/PixelPanel';
import GameButton from '../components/GameButton';
import SqlEditor from '../components/SqlEditor';
import ChapterCompletionModal from '../components/ChapterCompletionModal';
import { SQL_CURRICULUM, getChapterById } from '../data/sqlCurriculum';
import sqlEngine, { compareResultSets } from '../services/sqlEngine';
import audioManager from '../services/audioManager';
import useStore from '../store/useStore';
import { isGuestUser, GUEST_PREVIEW_LIMITS } from '../utils/guestPreview';
import { isDeveloper } from '../utils/userRole';


const SqlWorld = () => {
  const navigate = useNavigate();
  const { chapterId: routeChapterId } = useParams();

  const {
    unlockedChapters,
    completedChapters,
    completedMissions,
    completeMission,
    completeChapter
  } = useStore();

  const [activeChapterId, setActiveChapterId] = useState(Number(routeChapterId) || 1);
  const activeChapter = getChapterById(activeChapterId);

  // Resume latest uncompleted mission index from completedMissions single source of truth
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
      const ch = getChapterById(targetCh);
      setActiveMissionIndex(getResumedMissionIndex(ch));
    }
  }, [routeChapterId]);

  // Reset mission state on mission switch
  useEffect(() => {
    setSelectedOption(null);
    setMcFeedback(null);
    setIsMissionSolved(completedMissions.includes(currentMission.id));
  }, [activeMissionIndex, activeChapterId, currentMission.id, completedMissions]);

  const handleSelectChapter = (chId) => {
    if (!unlockedChapters.includes(chId)) {
      audioManager.playDisabled();
      return;
    }
    audioManager.playTabSwitch();
    setActiveChapterId(chId);
    const targetCh = getChapterById(chId);
    setActiveMissionIndex(getResumedMissionIndex(targetCh));
  };


  const handleSqlResult = (userResult, code) => {
    if (!userResult.success) {
      setIsMissionSolved(false);
      return;
    }

    let isCorrect = false;

    if (currentMission.expectedQuery) {
      const expectedRes = sqlEngine.execute(currentMission.expectedQuery);
      isCorrect = compareResultSets(userResult, expectedRes);
    } else if (currentMission.solution) {
      const expectedRes = sqlEngine.execute(currentMission.solution);
      isCorrect = compareResultSets(userResult, expectedRes);
    }

    if (isCorrect) {
      audioManager.playSuccess();
      setIsMissionSolved(true);
      completeMission(currentMission.id, currentMission.xp || 50, currentMission.coins || 20);

      // Check if all missions in chapter are finished
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

    const correctIdx = currentMission.answerIndex !== undefined ? currentMission.answerIndex : currentMission.correctPair;

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


  const isGuest = isGuestUser(useStore.getState());
  const [showGuestUnlockModal, setShowGuestUnlockModal] = useState(false);

  const handleNextMission = () => {
    audioManager.playContinue();
    if (isGuest && activeMissionIndex >= GUEST_PREVIEW_LIMITS.maxMissionsPerChapter - 1) {
      setShowGuestUnlockModal(true);
      return;
    }

    if (activeMissionIndex < activeChapter.missions.length - 1) {
      setActiveMissionIndex(activeMissionIndex + 1);
    } else {
      // Completed all missions in chapter
      completeChapter(activeChapterId, 3);
      setShowCompletionModal(true);
    }
  };

  const handlePrevMission = () => {
    audioManager.playBack();
    if (activeMissionIndex > 0) {
      setActiveMissionIndex(activeMissionIndex - 1);
    }
  };

  const handleModalContinue = () => {
    setShowCompletionModal(false);
    const nextChapterId = activeChapterId + 1;
    if (nextChapterId <= 14) {
      setActiveChapterId(nextChapterId);
      setActiveMissionIndex(0);
    }
  };

  const sqlCompletedChapters = completedChapters || [];

  const isDev = isDeveloper(useStore.getState().user);

  const isGuestChapterLocked = isGuest && activeChapterId > 1;
  const isCurrentChapterLocked = !isDev && (isGuestChapterLocked || (activeChapterId > 1 && !sqlCompletedChapters.includes(activeChapterId - 1)));
  const isCurrentMissionLocked = !isDev && !isGuest && activeMissionIndex > 0 && !completedMissions.includes(activeChapter.missions[activeMissionIndex - 1]?.id);

  if (isGuestChapterLocked) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#0a0e17', padding: '4rem 1.5rem', textAlign: 'center', color: 'white' }}>
        <PixelPanel style={{ maxWidth: '600px', margin: '0 auto', borderTop: '4px solid #f59e0b', backgroundColor: '#1e293b' }}>
          <span style={{ fontSize: '3.5rem', display: 'block', marginBottom: '1rem' }}>🔒</span>
          <h2 style={{ color: '#f59e0b', fontFamily: 'var(--font-pixel)', fontSize: '1.4rem', marginBottom: '0.75rem' }}>
            GUEST PREVIEW LIMIT
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: 1.5 }}>
            Chapters 2+ are locked for Guest sessions. Create a free detective account or log in to unlock all 14 SQL chapters, earn certificates, and save your progress to the cloud!
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <GameButton onClick={() => navigate('/login')} variant="gold">
              CREATE ACCOUNT / LOGIN 🔑
            </GameButton>
            <GameButton onClick={() => { setActiveChapterId(1); setActiveMissionIndex(0); }} variant="secondary">
              RETURN TO CHAPTER 1 📜
            </GameButton>
          </div>
        </PixelPanel>
      </div>
    );
  }

  if (isCurrentChapterLocked || isCurrentMissionLocked) {
    const isChapLock = isCurrentChapterLocked;

    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#0a0e17', padding: '4rem 1.5rem', textAlign: 'center', color: 'white' }}>
        <PixelPanel style={{ maxWidth: '600px', margin: '0 auto', borderTop: '4px solid #ef4444', backgroundColor: '#1e293b' }}>
          <span style={{ fontSize: '3.5rem', display: 'block', marginBottom: '1rem' }}>🔒</span>
          <h2 style={{ color: '#ef4444', fontFamily: 'var(--font-pixel)', fontSize: '1.5rem', marginBottom: '0.75rem' }}>
            {isChapLock ? `SQL CHAPTER ${activeChapterId} IS LOCKED` : `SQL MISSION ${activeMissionIndex + 1} IS LOCKED`}
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: 1.5 }}>
            {isChapLock
              ? `Complete all required missions in Chapter ${activeChapterId - 1} first to unlock Chapter ${activeChapterId}.`
              : `Complete Mission ${activeMissionIndex} (${activeChapter.missions[activeMissionIndex - 1]?.title || 'Previous Mission'}) first to unlock Mission ${activeMissionIndex + 1}.`
            }
          </p>
          <GameButton
            onClick={() => {
              if (isChapLock) {
                const lastUnlocked = Math.max(1, ...(sqlCompletedChapters.map(c => c + 1)), 1);
                setActiveChapterId(lastUnlocked);
                const ch = getChapterById(lastUnlocked);
                setActiveMissionIndex(getResumedMissionIndex(ch));
              } else {
                setActiveMissionIndex(getResumedMissionIndex(activeChapter));
              }
            }}
            variant="gold"
          >
            {isChapLock ? 'RETURN TO UNLOCKED CHAPTER 🕵️' : 'RETURN TO UNLOCKED MISSION 🎯'}
          </GameButton>
        </PixelPanel>
      </div>
    );
  }


  return (
    <div

      style={{
        minHeight: '100vh',
        background: 'linear-gradient(to bottom, rgba(10,14,23,0.85), rgba(10,14,23,0.95)), url("/assets/worlds/sql_hq.jpg") center/cover no-repeat fixed',
        padding: '1.5rem 1rem'
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
            <span style={{ fontSize: '1.4rem' }}>🏙️</span>
            <div>
              <h2 style={{ color: 'var(--accent-gold)', margin: 0, fontSize: '1.4rem', textShadow: '2px 2px 0 #000' }}>
                DATABASE DETECTIVE CITY
              </h2>
              <span style={{ fontSize: '0.7rem', color: 'var(--accent-teal)', fontFamily: 'var(--font-pixel)' }}>
                Chapter {activeChapterId} of 14 • {activeChapter.title}
              </span>
            </div>
          </div>

          <GameHUD />
        </header>

        {/* Guest Preview Mode Banner */}
        {isGuest && (
          <div style={{
            backgroundColor: 'rgba(234, 179, 8, 0.15)',
            border: '2px solid #eab308',
            color: '#fef08a',
            padding: '0.65rem 1rem',
            borderRadius: '8px',
            fontSize: '0.75rem',
            fontFamily: 'var(--font-pixel)',
            marginBottom: '1.25rem',
            display: 'flex',
            justify: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '0.5rem'
          }}>
            <span>🎭 <strong>GUEST PREVIEW MODE:</strong> Exploring sample missions. Create a free account to unlock all chapters & save progress.</span>
            <button
              onClick={() => navigate('/login')}
              style={{
                backgroundColor: '#eab308',
                color: '#0a0e17',
                border: 'none',
                padding: '4px 10px',
                borderRadius: '4px',
                fontFamily: 'var(--font-pixel)',
                fontSize: '0.65rem',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              CREATE FREE ACCOUNT 🚀
            </button>
          </div>
        )}

        {/* Guest Unlock Modal */}
        {showGuestUnlockModal && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(10, 14, 23, 0.9)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 99999,
            padding: '1.5rem'
          }}>
            <PixelPanel style={{ maxWidth: '520px', width: '100%', backgroundColor: '#1e293b', borderTop: '4px solid var(--accent-gold)', textAlign: 'center' }}>
              <span style={{ fontSize: '3.5rem', display: 'block', marginBottom: '0.75rem' }}>🔐</span>
              <h2 style={{ color: 'var(--accent-gold)', fontFamily: 'var(--font-pixel)', fontSize: '1.3rem', marginBottom: '0.75rem' }}>
                FULL CODESAGA EXPERIENCE
              </h2>
              <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '1.25rem', lineHeight: 1.5 }}>
                You are currently exploring the <strong>Guest Preview Mode</strong>. Create your free account to unlock:
              </p>

              <div style={{ backgroundColor: '#0f172a', padding: '1rem', borderRadius: '8px', border: '1px solid #334155', textAlign: 'left', fontSize: '0.85rem', marginBottom: '1.5rem', color: '#f8fafc' }}>
                <div style={{ marginBottom: '0.4rem' }}>✓ Full 14 SQL & Multi-World Programming Chapters</div>
                <div style={{ marginBottom: '0.4rem' }}>✓ Complete Interactive Detective Missions</div>
                <div style={{ marginBottom: '0.4rem' }}>✓ XP, Levels & Daily Streaks</div>
                <div style={{ marginBottom: '0.4rem' }}>✓ Automatic Progress Saving to Database</div>
                <div>✓ Official Verified CodeSaga Certificate</div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <GameButton onClick={() => navigate('/login')} variant="gold">
                  CREATE FREE ACCOUNT 🚀
                </GameButton>
                <GameButton onClick={() => setShowGuestUnlockModal(false)} variant="secondary">
                  CONTINUE PREVIEW 👁️
                </GameButton>
              </div>
            </PixelPanel>
          </div>
        )}

        {/* Chapter Selection Carousel Bar */}
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
          {SQL_CURRICULUM.map((ch) => {
            const isUnlocked = isDev || unlockedChapters.includes(ch.id);
            const isCompleted = completedChapters.includes(ch.id);
            const isActive = activeChapterId === ch.id;

            return (
              <button
                key={ch.id}
                onClick={() => handleSelectChapter(ch.id)}
                disabled={!isUnlocked}
                data-cursor={!isUnlocked ? 'disabled' : 'interaction'}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.6rem 0.9rem',
                  borderRadius: '8px',
                  backgroundColor: isActive ? 'var(--accent-teal)' : isUnlocked ? '#1e293b' : '#0f172a',
                  color: isActive ? '#0a0e17' : isUnlocked ? 'white' : '#64748b',
                  border: '2px solid',
                  borderColor: isActive ? '#0f766e' : isCompleted ? 'var(--accent-gold)' : '#334155',
                  fontFamily: 'var(--font-pixel)',
                  fontSize: '0.65rem',
                  cursor: isUnlocked ? 'pointer' : 'not-allowed',
                  whiteSpace: 'nowrap',
                  opacity: isUnlocked ? 1 : 0.6,
                  transition: 'all 0.15s ease'
                }}
              >
                <span>{isCompleted ? '⭐' : isUnlocked ? '📁' : '🔒'}</span>
                <span>CH {ch.id}</span>
              </button>
            );
          })}
        </div>

        {/* Main Gameplay Layout Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: '1.5rem' }}>

          {/* Mission Card Header */}
          <PixelPanel style={{ borderTop: `4px solid ${activeChapter.color}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div>
                <span style={{ fontSize: '0.7rem', fontFamily: 'var(--font-pixel)', color: 'var(--accent-gold)' }}>
                  CASE FILE #{activeChapterId}0{activeMissionIndex + 1} • {currentMission.type ? currentMission.type.toUpperCase().replace('_', ' ') : 'MISSION'}
                </span>
                <h3 style={{ color: 'white', margin: '0.25rem 0 0 0', fontSize: '1.3rem' }}>
                  {currentMission.title || 'Detective Mission'}
                </h3>
              </div>

              {/* Mission Progress Indicator */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-pixel)', color: 'var(--text-secondary)' }}>
                  Mission {activeMissionIndex + 1} / {activeChapter.missions.length}
                </span>
                {isMissionSolved && (
                  <span style={{ color: 'var(--accent-teal)', fontFamily: 'var(--font-pixel)', fontSize: '0.75rem' }}>
                    ✓ SOLVED
                  </span>
                )}
              </div>
            </div>

            {/* Animated Talking Character Dialog */}
            <div style={{ marginBottom: '1.25rem' }}>
              <CharacterTalk
                characterId={activeChapterId % 2 === 1 ? 'f1' : 'm1'}
                dialogText={currentMission.story || ''}
              />
              {/* Educational Concept Card (Loaded Immediately) */}
              {currentMission.conceptExplanation && (
                <div style={{ backgroundColor: '#0E2526', border: '1px solid #2a5a5c', borderRadius: '8px', padding: '1rem', marginBottom: '1.25rem' }}>
                  <h4 style={{ color: '#06b6d4', fontSize: '0.8rem', marginBottom: '0.5rem', fontFamily: 'var(--font-pixel)' }}>
                    📖 SQL BRIEFING & EXPLANATION
                  </h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem', fontSize: '0.8rem' }}>
                    {currentMission.conceptExplanation.what && <div><strong style={{ color: '#E6A93D' }}>WHAT:</strong> {currentMission.conceptExplanation.what}</div>}
                    {currentMission.conceptExplanation.why && <div><strong style={{ color: '#E6A93D' }}>WHY:</strong> {currentMission.conceptExplanation.why}</div>}
                    {currentMission.conceptExplanation.when && <div><strong style={{ color: '#E6A93D' }}>WHEN:</strong> {currentMission.conceptExplanation.when}</div>}
                    {currentMission.conceptExplanation.how && <div><strong style={{ color: '#E6A93D' }}>HOW:</strong> <code style={{ color: '#38bdf8' }}>{currentMission.conceptExplanation.how}</code></div>}
                  </div>
                </div>
              )}

              {/* Interactive Mission Solver */}
              {['multiple_choice', 'code_matching', 'predict_output'].includes(currentMission.type) ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.75rem' }}>
                    {currentMission.options && currentMission.options.map((opt, idx) => {
                      const isOptSelected = selectedOption === idx;
                      const optionLabel = typeof opt === 'string'
                        ? opt
                        : (opt && typeof opt === 'object' && opt.text
                          ? `${opt.text}${opt.label ? ` — (${opt.label})` : ''}`
                          : String(opt || ''));

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
                  <SqlEditor
                    key={currentMission.id}
                    initialCode={currentMission.template || currentMission.buggyQuery || currentMission.buggyCode || ''}
                    onExecuteResult={handleSqlResult}
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
            </div>

            {/* Navigation Controls */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '2px solid var(--panel-border)' }}>
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
            isWorldComplete={activeChapterId === 14}
            worldId="sql"
            worldName="DATABASE DETECTIVE CITY"
          />
        )}
      </div>
    </div>
  );
};

export default SqlWorld;

