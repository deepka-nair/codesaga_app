import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PlatformWorld from '../components/platform/PlatformWorld';
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
    const userEmail = String(useStore.getState().user?.email || '').trim().toLowerCase();
    const isSpecial = userEmail === 'deepkanair8@gmail.com';
    const isUnlocked = isSpecial 
      ? (chId === 1 || unlockedChapters.includes(chId) || (completedChapters || []).includes(chId - 1))
      : (isDev || chId === 1 || unlockedChapters.includes(chId) || (completedChapters || []).includes(chId - 1));

    if (!isUnlocked) {
      audioManager.playDisabled();
      return;
    }
    audioManager.playTabSwitch();
    setActiveChapterId(chId);
    const targetCh = getChapterById(chId);
    setActiveMissionIndex(getResumedMissionIndex(targetCh));
  };


  const handleSqlResult = (userResult) => {
    if (!userResult.success) {
      setMcFeedback('sql-wrong');
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
      if (isLastMission && activeChapter.missions.every(m => m.id === currentMission.id || useStore.getState().completedMissions.includes(m.id))) {
        completeChapter(activeChapterId, 3);
        setShowCompletionModal(true);
      }
    } else {
      audioManager.playWrongSql();
      setMcFeedback('sql-wrong');
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
      if (isLastMission && activeChapter.missions.every(m => m.id === currentMission.id || useStore.getState().completedMissions.includes(m.id))) {
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
      if (!activeChapter.missions.every(m => useStore.getState().completedMissions.includes(m.id))) return;
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
    <>
      <PlatformWorld key={activeChapterId + ':' + currentMission.id}
        mission={currentMission} chapter={activeChapter} solved={isMissionSolved}
        onNext={handleNextMission} chapters={SQL_CURRICULUM} onChapter={handleSelectChapter}
        unlocked={id => !(isGuest && id > 1) && (id === 1 || isDev || unlockedChapters.includes(id) || completedChapters.includes(id - 1))}
        guest={isGuest}>
        {['multiple_choice', 'code_matching', 'predict_output'].includes(currentMission.type) ? <>
          {currentMission.options?.map((opt,idx) => <button key={idx}
            className={'saga-answer' + (selectedOption === idx ? ' selected' : '')}
            aria-pressed={selectedOption === idx} disabled={isMissionSolved}
            onClick={() => handleSelectOption(idx)}>
            <b>{String.fromCharCode(65+idx)}.</b> {typeof opt === 'string' ? opt : `${opt.text}${opt.label ? ' — ' + opt.label : ''}`}
          </button>)}
          <button className="saga-primary" disabled={selectedOption === null || isMissionSolved} onClick={handleOptionSubmit}>Check answer</button>
          {!isMissionSolved && currentMission.hints?.length > 0 && <details className="saga-hint"><summary>Ask Aria for a hint</summary><p>{currentMission.hints[0]}</p></details>}
        </> : <SqlEditor key={currentMission.id}
          initialCode={currentMission.template || currentMission.buggyQuery || currentMission.buggyCode || ''}
          onExecuteResult={handleSqlResult} hintList={currentMission.hints || []} />}
        <div aria-live="polite">
          {mcFeedback === 'wrong' && <p className="saga-feedback wrong">That isn't quite right. Try another answer, or ask for a hint.</p>}
          {isMissionSolved && <p className="saga-feedback">✓ Mission solved. Close this terminal and reach the flag to continue.</p>}
          {mcFeedback === 'sql-wrong' && <p className="saga-feedback wrong">Your result doesn't match the mission. Check your query and try again.</p>}
        </div>
        {isMissionSolved && currentMission.conceptExplanation && <section className="saga-explanation"><b>Aria's explanation</b>{Object.entries(currentMission.conceptExplanation).map(([label,value]) => <div key={label}><strong>{label.toUpperCase()}: </strong>{value}</div>)}</section>}
        {activeMissionIndex > 0 && <button className="saga-primary" onClick={handlePrevMission}>← Previous mission</button>}
      </PlatformWorld>
      {showGuestUnlockModal && <div className="saga-shade" style={{position:'fixed'}}><section className="saga-mission"><h2>Continue your adventure</h2><p>Create an account to unlock more missions and save your progress.</p><button className="saga-primary" onClick={() => navigate('/login')}>Sign in / Create account</button><button className="saga-primary" onClick={() => setShowGuestUnlockModal(false)}>Return to preview</button></section></div>}
      {showCompletionModal && <ChapterCompletionModal chapter={activeChapter} xpEarned={activeChapter.missions.reduce((sum,m) => sum + (m.xp || 50),0)} coinsEarned={activeChapter.missions.reduce((sum,m) => sum + (m.coins || 20),0)} stars={3} onContinue={handleModalContinue} isWorldComplete={activeChapterId === 14} worldId="sql" worldName="DATABASE DETECTIVE CITY" />}
    </>
  );
};

export default SqlWorld;
