import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PixelPanel from '../components/PixelPanel';
import GameButton from '../components/GameButton';
import GameHUD from '../components/GameHUD';
import ErrorBoundary from '../components/ErrorBoundary';
import { getCharacterById } from '../data/characterSprites';
import audioManager from '../services/audioManager';
import useStore from '../store/useStore';
import { fetchRealGithubProfile, publishProjectToGithub } from '../services/githubService';
import { isDeveloper } from '../utils/userRole';
import { WORLD_CERTIFICATES, isWorldCompleted, getEarnedCertificatesCount } from '../utils/worldCertificates';
import { checkCertificateEligibility } from '../utils/certificateEligibility';

const Profile = () => {
  const navigate = useNavigate();
  const storeState = useStore();
  const certEligibility = checkCertificateEligibility(storeState);
  const earnedCertCount = getEarnedCertificatesCount(storeState);
  const worldKeys = Object.keys(WORLD_CERTIFICATES);
  const { 
    user, 
    isGuest, 
    character, 
    xp, 
    level, 
    coins, 
    hearts, 
    streak, 
    longestStreak,
    weeklyActivity,
    dailyGoalMinutes,
    todayActivityMinutes,
    setDailyGoalMinutes,
    completedChapters,
    completedMissions,
    pythonProgress,
    javaProgress,
    frontendProgress,
    cppProgress,
    backendProgress,
    sqlProgress,
    earnedAchievements,
    certificateName,
    updateCertificateName,
    githubConnected,
    githubProfile,
    githubStatus,
    githubError,
    setGithubStatus,
    setGithubProfile,
    disconnectGithub
  } = useStore();

  const isDev = isDeveloper(user);

  const activeChar = getCharacterById(character || 'm1');

  const [activeTab, setActiveTab] = useState('overview');

  const [githubInput, setGithubInput] = useState('deepka-nair');
  const [linkedinInput, setLinkedinInput] = useState('');
  const [githubLoading, setGithubLoading] = useState(false);
  const [githubLocalError, setGithubLocalError] = useState(null);
  const [publishStatus, setPublishStatus] = useState(null); // { type: 'success'|'error'|'info', message: string, url?: string }
  const [patInput, setPatInput] = useState('');
  const [showPublishModal, setShowPublishModal] = useState(false);

  const handleConnectGithub = async () => {
    if (!githubInput.trim()) return;
    audioManager.playClick();
    setGithubLoading(true);
    setGithubLocalError(null);
    setGithubStatus('CONNECTING');

    try {
      const profile = await fetchRealGithubProfile(githubInput);
      setGithubProfile(profile);
      setGithubInput('deepka-nair');
      audioManager.playSuccess();
    } catch (err) {
      setGithubLocalError(err.message);
      setGithubStatus('ERROR', err.message);
      audioManager.playError();
    } finally {
      setGithubLoading(false);
    }
  };

  const handlePublishProject = async () => {
    if (!patInput.trim()) {
      setPublishStatus({ type: 'error', message: 'GitHub Personal Access Token (PAT) with "repo" scope is required to publish.' });
      return;
    }

    setGithubLoading(true);
    setPublishStatus({ type: 'info', message: 'Creating repository deepka-nair/codesaga & committing project files... ⏳' });
    audioManager.playClick();

    try {
      const res = await publishProjectToGithub(patInput.trim(), 'codesaga', false, {
        xp,
        level,
        completedMissions,
        completedChapters
      });

      audioManager.playSuccess();
      setPublishStatus({ 
        type: 'success', 
        message: `Project published successfully to GitHub! ✓ Repository: ${res.name}`,
        url: res.html_url
      });
      setShowPublishModal(false);
      setPatInput('');
    } catch (err) {
      audioManager.playError();
      setPublishStatus({ type: 'error', message: err.message });
    } finally {
      setGithubLoading(false);
    }
  };


  const handleRefreshGithub = async () => {
    if (!githubProfile?.login) return;
    audioManager.playClick();
    setGithubLoading(true);
    setGithubLocalError(null);

    try {
      const profile = await fetchRealGithubProfile(githubProfile.login);
      setGithubProfile(profile);
      audioManager.playSuccess();
    } catch (err) {
      setGithubLocalError(err.message);
    } finally {
      setGithubLoading(false);
    }
  };

  const handleDisconnectGithub = () => {
    audioManager.playBack();
    disconnectGithub();
    setGithubLocalError(null);
  };

  const handleConnectLinkedinUrl = () => {
    if (!linkedinInput.trim()) return;
    audioManager.playClick();
    const cleanUrl = linkedinInput.trim().startsWith('http') 
      ? linkedinInput.trim() 
      : `https://www.linkedin.com/in/${linkedinInput.trim().replace(/^\//, '')}`;

    const profileName = cleanUrl.split('/in/')[1]?.replace(/\/$/, '') || 'LinkedIn User';

    setLinkedinProfile({
      url: cleanUrl,
      username: profileName,
      connected_at: new Date().toLocaleDateString()
    });
    setLinkedinInput('');
    audioManager.playSuccess();
  };

  const handleDisconnectLinkedin = () => {
    audioManager.playBack();
    disconnectLinkedin();
  };


  const handleReturnToWorld = () => {
    audioManager.playWorldSelected();
    navigate('/sql-detective');
  };

  const handleChangeCharacter = () => {
    audioManager.playClick();
    navigate('/onboarding');
  };

  const handleTabSwitch = (tab) => {
    audioManager.playTabSwitch();
    setActiveTab(tab);
  };

  // Safe data fallbacks
  const safeUser = user || { name: 'Guest Sleuth', email: 'guest@codesaga.local' };
  const safeXp = xp || 0;
  const safeLevel = level || 1;
  const safeCoins = coins || 0;
  const safeHearts = hearts || 5;
  const safeStreak = streak || 1;
  const safeLongestStreak = longestStreak || 3;
  const safeWeekly = weeklyActivity || [true, true, true, true, true, false, false];
  const safeGoal = dailyGoalMinutes || 20;
  const safeActivity = todayActivityMinutes || 14;
  const safeEarned = earnedAchievements || ['c1_m1'];

  const goalOptions = [10, 20, 30, 45, 60];
  const daysOfWeek = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

  const sqlCompleted = completedChapters?.length || 0;
  const pyCompleted = (pythonProgress?.completedChapters || []).length;
  const javaCompleted = (javaProgress?.completedChapters || []).length;
  const feCompleted = (frontendProgress?.completedChapters || []).length;
  const cppCompleted = (cppProgress?.completedChapters || []).length;
  const beCompleted = (backendProgress?.completedChapters || []).length;

  const worldsProgress = [
    { id: 'sql', name: 'DATABASE DETECTIVE CITY', language: 'SQL', progress: Math.min(100, Math.round((sqlCompleted / 14) * 100)), totalChapters: 14, completed: sqlCompleted, color: '#A8D5CE', status: sqlCompleted > 0 ? 'IN PROGRESS' : 'UNLOCKED' },
    { id: 'python', name: 'PYTHON VALLEY', language: 'Python', progress: Math.min(100, Math.round((pyCompleted / 12) * 100)), totalChapters: 12, completed: pyCompleted, color: '#22c55e', status: pyCompleted > 0 ? 'IN PROGRESS' : 'UNLOCKED' },
    { id: 'java', name: 'JAVA KINGDOM', language: 'Java', progress: Math.min(100, Math.round((javaCompleted / 12) * 100)), totalChapters: 12, completed: javaCompleted, color: '#f59e0b', status: javaCompleted > 0 ? 'IN PROGRESS' : 'UNLOCKED' },
    { id: 'frontend', name: 'WEB CREATOR CITY', language: 'Frontend', progress: Math.min(100, Math.round((feCompleted / 12) * 100)), totalChapters: 12, completed: feCompleted, color: '#0ea5e9', status: feCompleted > 0 ? 'IN PROGRESS' : 'UNLOCKED' },
    { id: 'cpp', name: 'C++ CYBER ARENA', language: 'C++', progress: Math.min(100, Math.round((cppCompleted / 12) * 100)), totalChapters: 12, completed: cppCompleted, color: '#a855f7', status: cppCompleted > 0 ? 'IN PROGRESS' : 'UNLOCKED' },
    { id: 'backend', name: 'SERVER FORTRESS', language: 'Backend', progress: Math.min(100, Math.round((beCompleted / 12) * 100)), totalChapters: 12, completed: beCompleted, color: '#ef4444', status: beCompleted > 0 ? 'IN PROGRESS' : 'UNLOCKED' },
  ];


  const achievementsList = [
    { id: 'c1_m1', title: 'FIRST CASE', icon: '🕵️', desc: 'Complete your first SQL detective mission.', unlockCondition: '1 Mission Completed' },
    { id: 'c1_chapter', title: 'CASE SOLVED', icon: '🔎', desc: 'Solve your first complete SQL chapter.', unlockCondition: '1 Chapter Completed' },
    { id: 'week_warrior', title: 'WEEK WARRIOR', icon: '🔥', desc: 'Maintain a 7-day learning streak.', unlockCondition: '7-Day Streak' },
    { id: 'tech_round', title: 'TECHNICAL ROUND', icon: '🎯', desc: 'Pass your first technical interview round.', unlockCondition: 'Technical Quiz Passed' },
    { id: 'python_exp', title: 'PYTHON EXPLORER', icon: '🐍', desc: 'Complete Python Valley adventure.', unlockCondition: 'Python World Completed' },
    { id: 'java_knight', title: 'JAVA CODE KNIGHT', icon: '☕', desc: 'Forge your skills in Java Kingdom.', unlockCondition: 'Java World Completed' },
    { id: 'web_builder', title: 'WEB BUILDER', icon: '🌐', desc: 'Rebuild Web Creator City.', unlockCondition: 'Frontend World Completed' },
    { id: 'server_engineer', title: 'SERVER ENGINEER', icon: '⚙️', desc: 'Defend Server Fortress.', unlockCondition: 'Backend World Completed' },
    { id: 'first_push', title: 'FIRST PUSH', icon: '🚀', desc: 'Publish your first verified project to GitHub.', unlockCondition: 'GitHub Connected' },
    { id: 'verified_builder', title: 'VERIFIED BUILDER', icon: '🏆', desc: 'Complete and verify your first project.', unlockCondition: '1 Verified Project' },
    { id: 'codesaga_certified', title: 'CODE SAGA CERTIFIED', icon: '🎓', desc: 'Earn your first official CodeSaga certificate.', unlockCondition: 'Certificate Issued' },
  ];

  return (
    <ErrorBoundary>
      <div 
        style={{ 
          minHeight: '100vh',
          backgroundColor: '#0E2526',
          color: '#F6F4EB',
          padding: '1.5rem 1rem'
        }}
      >
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          {/* Top Header Bar */}
          <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h2 style={{ color: '#E6A93D', margin: 0, fontSize: '1.6rem', fontFamily: 'var(--font-pixel)', textShadow: '2px 2px 0 #000' }}>
                CODE SAGA CHARACTER SHEET
              </h2>
              <span style={{ fontSize: '0.75rem', color: isGuest ? '#f59e0b' : isDev ? '#06b6d4' : '#A8D5CE', fontFamily: 'var(--font-pixel)' }}>
                {isGuest ? '🎭 GUEST PREVIEW MODE' : isDev ? '🛠️ DEVELOPER MODE' : 'AUTHENTICATED SLEUTH'}
              </span>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <GameHUD />
              <GameButton onClick={handleReturnToWorld} variant="gold">
                RETURN TO GAME 🏙️
              </GameButton>
            </div>
          </header>

          {/* Guest Notice Banner */}
          {isGuest && (
            <div style={{
              backgroundColor: 'rgba(234, 179, 8, 0.15)',
              border: '2px solid #eab308',
              color: '#fef08a',
              padding: '0.75rem 1rem',
              borderRadius: '8px',
              fontSize: '0.8rem',
              fontFamily: 'var(--font-pixel)',
              marginBottom: '1.5rem',
              display: 'flex',
              justify: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '0.5rem'
            }}>
              <div>
                🎭 <strong>GUEST PREVIEW MODE:</strong> Progress is temporary. Create an account to save your CodeSaga journey.
              </div>
              <GameButton onClick={() => navigate('/login')} variant="gold">
                CREATE FREE ACCOUNT 🚀
              </GameButton>
            </div>
          )}

          {/* Hero Profile Status Panel */}
          <PixelPanel style={{ backgroundColor: '#173536', borderColor: '#234a4b', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
              {/* Character Avatar Box */}
              <div 
                style={{
                  width: '96px',
                  height: '96px',
                  backgroundColor: '#0E2526',
                  borderRadius: '10px',
                  border: '3px solid #E6A93D',
                  overflow: 'hidden',
                  flexShrink: 0,
                  boxShadow: '0 0 15px rgba(230, 169, 61, 0.3)',
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

              {/* Character Info & Metadata */}
              <div style={{ flex: 1, minWidth: '240px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
                  <h3 style={{ color: '#F6F4EB', margin: 0, fontSize: '1.5rem', fontFamily: 'var(--font-pixel)' }}>
                    {safeUser?.name || 'Sleuth'}
                  </h3>
                  <span style={{ fontSize: '0.65rem', color: '#A8D5CE', fontFamily: 'var(--font-pixel)', backgroundColor: '#0E2526', padding: '3px 8px', borderRadius: '4px', border: '1px solid #2a5a5c' }}>
                    {activeChar.name.toUpperCase()} • {activeChar.title}
                  </span>
                </div>

                <div style={{ fontSize: '0.85rem', color: '#A8B8B4', marginBottom: '1rem' }}>
                  {safeUser?.email || 'sleuth@codesaga.dev'}
                </div>

                {/* Grouped RPG Stat Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: '0.85rem', marginTop: '0.75rem' }}>
                  <div style={{ backgroundColor: '#0E2526', padding: '0.75rem 1rem', borderRadius: '8px', border: '2px solid #06b6d4', textAlign: 'center', boxShadow: '0 2px 6px rgba(0,0,0,0.3)' }}>
                    <div style={{ fontSize: '0.65rem', color: '#06b6d4', fontFamily: 'var(--font-pixel)', marginBottom: '0.2rem', letterSpacing: '1px' }}>
                      LEVEL
                    </div>
                    <div style={{ fontSize: '1.4rem', color: '#ffffff', fontFamily: 'var(--font-pixel)', fontWeight: 'bold' }}>
                      {safeLevel}
                    </div>
                  </div>

                  <div style={{ backgroundColor: '#0E2526', padding: '0.75rem 1rem', borderRadius: '8px', border: '2px solid #eab308', textAlign: 'center', boxShadow: '0 2px 6px rgba(0,0,0,0.3)' }}>
                    <div style={{ fontSize: '0.65rem', color: '#eab308', fontFamily: 'var(--font-pixel)', marginBottom: '0.2rem', letterSpacing: '1px' }}>
                      TOTAL XP
                    </div>
                    <div style={{ fontSize: '1.4rem', color: '#fef08a', fontFamily: 'var(--font-pixel)', fontWeight: 'bold' }}>
                      {safeXp}
                    </div>
                  </div>

                  <div style={{ backgroundColor: '#0E2526', padding: '0.75rem 1rem', borderRadius: '8px', border: '2px solid #f59e0b', textAlign: 'center', boxShadow: '0 2px 6px rgba(0,0,0,0.3)' }}>
                    <div style={{ fontSize: '0.65rem', color: '#f59e0b', fontFamily: 'var(--font-pixel)', marginBottom: '0.2rem', letterSpacing: '1px' }}>
                      COINS
                    </div>
                    <div style={{ fontSize: '1.3rem', color: '#fef3c7', fontFamily: 'var(--font-pixel)', fontWeight: 'bold' }}>
                      💰 {safeCoins}
                    </div>
                  </div>

                  <div style={{ backgroundColor: '#0E2526', padding: '0.75rem 1rem', borderRadius: '8px', border: '2px solid #f97316', textAlign: 'center', boxShadow: '0 2px 6px rgba(0,0,0,0.3)' }}>
                    <div style={{ fontSize: '0.65rem', color: '#f97316', fontFamily: 'var(--font-pixel)', marginBottom: '0.2rem', letterSpacing: '1px' }}>
                      STREAK
                    </div>
                    <div style={{ fontSize: '1.3rem', color: '#ffedd5', fontFamily: 'var(--font-pixel)', fontWeight: 'bold' }}>
                      🔥 {safeStreak} D
                    </div>
                  </div>
                </div>
              </div>

              {/* Change Character Action & Certificate Name Input */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', minWidth: '220px' }}>
                <GameButton onClick={handleChangeCharacter} variant="secondary">
                  CHANGE CHARACTER 🎭
                </GameButton>

                {/* 6 World Certificates Section */}
                <div style={{ 
                  backgroundColor: '#0E2526', 
                  padding: '0.85rem', 
                  borderRadius: '8px', 
                  border: '2px solid #eab308' 
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span style={{ fontFamily: 'var(--font-pixel)', fontSize: '0.75rem', color: '#eab308' }}>
                      🎓 MY CERTIFICATES
                    </span>
                    <span style={{ 
                      fontFamily: 'var(--font-pixel)', 
                      fontSize: '0.65rem', 
                      padding: '2px 8px',
                      borderRadius: '4px',
                      backgroundColor: 'rgba(234, 179, 8, 0.2)',
                      color: '#eab308',
                      border: '1px solid #eab308'
                    }}>
                      {isGuest ? 'PREVIEW MODE' : isDev ? 'DEVELOPER (6/6 ACCESSIBLE)' : `${earnedCertCount} / 6 EARNED`}
                    </span>
                  </div>

                  {isGuest ? (
                    <div>
                      <p style={{ fontSize: '0.75rem', color: '#A8B8B4', margin: '0 0 0.6rem 0', lineHeight: 1.3 }}>
                        Preview what your official CodeSaga Certificate of Completion will look like once earned.
                      </p>
                      <GameButton onClick={() => navigate('/certificate?world=sql')} variant="gold">
                        VIEW CERTIFICATE PREVIEW 📜
                      </GameButton>
                    </div>
                  ) : isDev ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
                      <div style={{ fontSize: '0.65rem', color: '#06b6d4', fontFamily: 'var(--font-pixel)', marginBottom: '0.2rem' }}>
                        🛠️ DEVELOPER TESTING ACCESS (6/6 WORLDS):
                      </div>
                      {worldKeys.map((wId) => {
                        const wConfig = WORLD_CERTIFICATES[wId];
                        return (
                          <div key={wId} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#173536', padding: '6px 10px', borderRadius: '4px', border: '1px solid #2a5a5c' }}>
                            <span style={{ fontSize: '0.75rem', color: '#F6F4EB', fontWeight: 'bold' }}>
                              {wConfig.badge} {wConfig.name}
                            </span>
                            <GameButton onClick={() => navigate(`/certificate?world=${wId}`)} variant="gold" style={{ padding: '4px 8px', fontSize: '0.6rem' }}>
                              VIEW 📜
                            </GameButton>
                          </div>
                        );
                      })}
                    </div>
                  ) : earnedCertCount > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
                      {worldKeys.filter((wId) => isWorldCompleted(wId, storeState)).map((wId) => {
                        const wConfig = WORLD_CERTIFICATES[wId];
                        return (
                          <div key={wId} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#173536', padding: '8px 12px', borderRadius: '6px', border: '1px solid #eab308' }}>
                            <div>
                              <div style={{ fontSize: '0.8rem', color: '#F6F4EB', fontWeight: 'bold' }}>
                                {wConfig.badge} {wConfig.name}
                              </div>
                              <div style={{ fontSize: '0.65rem', color: '#22c55e', fontFamily: 'var(--font-pixel)' }}>
                                ✓ EARNED ({wConfig.totalChapters}/{wConfig.totalChapters} Chapters Completed)
                              </div>
                            </div>
                            <GameButton onClick={() => navigate(`/certificate?world=${wId}`)} variant="gold">
                              VIEW CERTIFICATE 📜
                            </GameButton>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div style={{ fontSize: '0.75rem', color: '#A8B8B4', padding: '0.5rem 0' }}>
                      Complete a CodeSaga world to earn your first certificate.
                    </div>
                  )}
                </div>

                {/* Certificate Name Setup Card */}
                <div style={{ backgroundColor: '#0E2526', padding: '0.75rem', borderRadius: '8px', border: '1px solid #2a5a5c' }}>
                  <label style={{ display: 'block', fontSize: '0.65rem', fontFamily: 'var(--font-pixel)', color: '#E6A93D', marginBottom: '0.3rem' }}>
                    📜 CERTIFICATE DISPLAY NAME
                  </label>
                  <input
                    type="text"
                    value={certificateName || ''}
                    onChange={(e) => updateCertificateName(e.target.value)}
                    placeholder={safeUser?.name || "Enter your display name"}
                    data-cursor="text"
                    style={{
                      width: '100%',
                      backgroundColor: '#173536',
                      color: '#F6F4EB',
                      border: '1px solid #2a5a5c',
                      borderRadius: '4px',
                      padding: '6px 8px',
                      fontSize: '0.8rem',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                  <div style={{ fontSize: '0.62rem', color: '#f59e0b', marginTop: '0.4rem', lineHeight: 1.3 }}>
                    ⚠️ <strong>This name will appear on your CodeSaga certificate.</strong>
                  </div>
                </div>
              </div>
            </div>
          </PixelPanel>


          {/* Navigation Tabs */}
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', overflowX: 'auto', paddingBottom: '4px' }}>
            {[
              { id: 'overview', label: '📊 PROGRESS OVERVIEW' },
              { id: 'streak', label: '🔥 STREAK & GOALS' },
              { id: 'achievements', label: '🏆 ACHIEVEMENTS BOARD' },
              { id: 'career', label: '💼 CAREER CREDENTIALS' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => handleTabSwitch(tab.id)}
                data-cursor="interaction"
                style={{
                  padding: '0.7rem 1.2rem',
                  borderRadius: '8px',
                  fontFamily: 'var(--font-pixel)',
                  fontSize: '0.7rem',
                  backgroundColor: activeTab === tab.id ? '#E6A93D' : '#173536',
                  color: activeTab === tab.id ? '#0E2526' : '#F6F4EB',
                  border: '2px solid',
                  borderColor: activeTab === tab.id ? '#d97706' : '#234a4b',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s ease'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* TAB 1: OVERVIEW & WORLD PROGRESS */}
          {activeTab === 'overview' && (
            <PixelPanel style={{ backgroundColor: '#173536', borderColor: '#234a4b' }}>
              <h3 style={{ color: '#E6A93D', marginBottom: '1rem', fontSize: '1.1rem', fontFamily: 'var(--font-pixel)' }}>
                🗺️ WORLD LEARNING PROGRESS
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {worldsProgress.map(world => (
                  <div key={world.id} style={{ backgroundColor: '#0E2526', padding: '1rem', borderRadius: '8px', border: '1px solid #2a5a5c' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontSize: '0.65rem', color: world.color, fontFamily: 'var(--font-pixel)' }}>[{world.language}]</span>
                        <strong style={{ color: '#F6F4EB', fontSize: '0.95rem' }}>{world.name}</strong>
                      </div>
                      <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-pixel)', color: '#E6A93D' }}>
                        {world.completed} / {world.totalChapters} Chapters ({world.progress}%)
                      </span>
                    </div>

                    <div style={{ width: '100%', height: '10px', backgroundColor: '#173536', borderRadius: '5px', overflow: 'hidden', border: '1px solid #2a5a5c' }}>
                      <div style={{ width: `${world.progress}%`, height: '100%', backgroundColor: world.color, transition: 'width 0.3s' }} />
                    </div>
                  </div>
                ))}
              </div>
            </PixelPanel>
          )}

          {/* TAB 2: STREAK & GOALS */}
          {activeTab === 'streak' && (
            <PixelPanel style={{ backgroundColor: '#173536', borderColor: '#234a4b' }}>
              <h3 style={{ color: '#E6A93D', marginBottom: '1rem', fontSize: '1.1rem', fontFamily: 'var(--font-pixel)' }}>
                🔥 LEARNING STREAK & DAILY GOALS
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                <div style={{ backgroundColor: '#0E2526', padding: '1.25rem', borderRadius: '8px', border: '2px solid #f97316', textAlign: 'center' }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: '0.25rem' }}>🔥</div>
                  <div style={{ fontSize: '1.8rem', color: '#f97316', fontFamily: 'var(--font-pixel)' }}>{safeStreak} DAYS</div>
                  <div style={{ fontSize: '0.75rem', color: '#A8B8B4', fontFamily: 'var(--font-pixel)', marginTop: '0.25rem' }}>
                    CURRENT STREAK
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#E6A93D', marginTop: '0.5rem' }}>
                    Personal Best: {safeLongestStreak} Days
                  </div>
                </div>

                <div style={{ backgroundColor: '#0E2526', padding: '1.25rem', borderRadius: '8px', border: '2px solid #A8D5CE' }}>
                  <div style={{ fontSize: '0.75rem', color: '#A8D5CE', fontFamily: 'var(--font-pixel)', marginBottom: '0.5rem' }}>
                    TODAY'S LEARNING GOAL
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.5rem', color: '#F6F4EB' }}>
                    <span>Active Activity:</span>
                    <strong style={{ color: '#E6A93D' }}>{safeActivity} / {safeGoal} MINS</strong>
                  </div>

                  <div style={{ width: '100%', height: '10px', backgroundColor: '#173536', borderRadius: '5px', overflow: 'hidden', marginBottom: '1rem', border: '1px solid #2a5a5c' }}>
                    <div style={{ width: `${Math.min(100, (safeActivity / safeGoal) * 100)}%`, height: '100%', backgroundColor: '#A8D5CE' }} />
                  </div>

                  <div style={{ fontSize: '0.7rem', color: '#A8B8B4', marginBottom: '0.4rem', fontFamily: 'var(--font-pixel)' }}>
                    Set Daily Target:
                  </div>
                  <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                    {goalOptions.map(g => (
                      <button
                        key={g}
                        onClick={() => {
                          audioManager.playClick();
                          setDailyGoalMinutes(g);
                        }}
                        data-cursor="interaction"
                        style={{
                          fontSize: '0.65rem',
                          fontFamily: 'var(--font-pixel)',
                          padding: '4px 10px',
                          borderRadius: '4px',
                          backgroundColor: safeGoal === g ? '#E6A93D' : '#173536',
                          color: safeGoal === g ? '#0E2526' : '#F6F4EB',
                          border: '1px solid #2a5a5c',
                          cursor: 'pointer'
                        }}
                      >
                        {g}m
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <h4 style={{ color: '#F6F4EB', fontSize: '0.85rem', marginBottom: '0.75rem', fontFamily: 'var(--font-pixel)' }}>
                WEEKLY LEARNING TRACKER
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.5rem', textAlign: 'center' }}>
                {daysOfWeek.map((day, idx) => {
                  const isActive = safeWeekly[idx];
                  return (
                    <div 
                      key={day}
                      style={{
                        backgroundColor: isActive ? 'rgba(168, 213, 206, 0.15)' : '#0E2526',
                        border: `2px solid ${isActive ? '#A8D5CE' : '#2a5a5c'}`,
                        borderRadius: '8px',
                        padding: '0.75rem 0.25rem'
                      }}
                    >
                      <div style={{ fontSize: '0.65rem', fontFamily: 'var(--font-pixel)', color: '#A8B8B4', marginBottom: '0.25rem' }}>
                        {day}
                      </div>
                      <div style={{ fontSize: '1.2rem' }}>
                        {isActive ? '✓' : '•'}
                      </div>
                    </div>
                  );
                })}
              </div>
            </PixelPanel>
          )}

          {/* TAB 3: ACHIEVEMENTS */}
          {activeTab === 'achievements' && (
            <PixelPanel style={{ backgroundColor: '#173536', borderColor: '#234a4b' }}>
              <h3 style={{ color: '#E6A93D', marginBottom: '1rem', fontSize: '1.1rem', fontFamily: 'var(--font-pixel)' }}>
                🏆 CODE SAGA ACHIEVEMENTS BOARD
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
                {achievementsList.map(ach => {
                  const isEarned = safeEarned.includes(ach.id);

                  return (
                    <div
                      key={ach.id}
                      style={{
                        display: 'flex',
                        gap: '0.85rem',
                        alignItems: 'center',
                        padding: '0.85rem',
                        backgroundColor: isEarned ? 'rgba(230, 169, 61, 0.12)' : '#0E2526',
                        border: `2px solid ${isEarned ? '#E6A93D' : '#2a5a5c'}`,
                        borderRadius: '8px',
                        opacity: isEarned ? 1 : 0.65,
                        filter: isEarned ? 'none' : 'grayscale(60%)'
                      }}
                    >
                      <div 
                        style={{
                          fontSize: '2rem',
                          width: '48px',
                          height: '48px',
                          backgroundColor: '#173536',
                          borderRadius: '8px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          border: `1px solid ${isEarned ? '#E6A93D' : '#2a5a5c'}`
                        }}
                      >
                        {ach.icon}
                      </div>

                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <strong style={{ color: isEarned ? '#E6A93D' : '#F6F4EB', fontSize: '0.85rem', fontFamily: 'var(--font-pixel)' }}>
                            {ach.title}
                          </strong>
                          <span style={{ fontSize: '0.6rem', fontFamily: 'var(--font-pixel)', color: isEarned ? '#A8D5CE' : '#64748b' }}>
                            {isEarned ? 'EARNED ✓' : 'LOCKED 🔒'}
                          </span>
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#A8B8B4', margin: '2px 0' }}>
                          {ach.desc}
                        </div>
                        <div style={{ fontSize: '0.65rem', color: '#A8D5CE' }}>
                          Requirement: {ach.unlockCondition}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </PixelPanel>
          )}

          {/* TAB 4: CAREER CREDENTIALS & REAL INTEGRATIONS */}
          {activeTab === 'career' && (
            <PixelPanel style={{ backgroundColor: '#173536', borderColor: '#234a4b' }}>
              <h3 style={{ color: '#E6A93D', marginBottom: '1.25rem', fontSize: '1.1rem', fontFamily: 'var(--font-pixel)' }}>
                💼 REAL CAREER INTEGRATIONS & LIVE CREDENTIALS
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
                {/* Real GitHub Integration Card */}
                <div style={{ backgroundColor: '#0E2526', padding: '1.25rem', borderRadius: '8px', border: `2px solid ${githubProfile ? '#22c55e' : '#2a5a5c'}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontSize: '1.4rem' }}>🌐</span>
                      <strong style={{ fontFamily: 'var(--font-pixel)', fontSize: '0.9rem', color: '#F6F4EB' }}>
                        AUTHENTICATED GITHUB REST API INTEGRATION
                      </strong>
                    </div>

                    <span 
                      style={{ 
                        fontSize: '0.7rem', 
                        fontFamily: 'var(--font-pixel)', 
                        padding: '4px 8px',
                        borderRadius: '4px',
                        backgroundColor: githubProfile ? 'rgba(34, 197, 94, 0.2)' : githubLoading ? 'rgba(245, 158, 11, 0.2)' : githubLocalError ? 'rgba(239, 68, 68, 0.2)' : '#173536',
                        color: githubProfile ? '#22c55e' : githubLoading ? '#f59e0b' : githubLocalError ? '#ef4444' : '#94a3b8',
                        border: `1px solid ${githubProfile ? '#22c55e' : githubLoading ? '#f59e0b' : githubLocalError ? '#ef4444' : '#2a5a5c'}`
                      }}
                    >
                      {githubProfile ? 'CONNECTED ✓' : githubLoading ? 'CONNECTING... ⏳' : githubLocalError ? 'CONNECTION ERROR ❌' : 'NOT CONNECTED'}
                    </span>
                  </div>

                  {!githubProfile ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      <p style={{ fontSize: '0.85rem', color: '#A8B8B4', margin: 0, lineHeight: 1.4 }}>
                        Connect your real GitHub account via username or Personal Access Token (PAT). Live profile metadata, avatar, followers, and public repositories will be retrieved directly from official GitHub REST APIs.
                      </p>

                      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <input
                          type="text"
                          value={githubInput}
                          onChange={(e) => setGithubInput(e.target.value)}
                          placeholder="Enter GitHub username (e.g. torvalds or your_username)"
                          disabled={githubLoading}
                          style={{
                            flex: 1,
                            minWidth: '240px',
                            backgroundColor: '#071516',
                            color: '#F6F4EB',
                            border: '1px solid #2a5a5c',
                            borderRadius: '6px',
                            padding: '0.6rem 0.85rem',
                            fontSize: '0.85rem',
                            outline: 'none'
                          }}
                        />
                        <GameButton onClick={handleConnectGithub} disabled={githubLoading || !githubInput.trim()} variant="gold">
                          {githubLoading ? 'VERIFYING... ⏳' : 'CONNECT GITHUB ACCOUNT 🚀'}
                        </GameButton>
                      </div>

                      {githubLocalError && (
                        <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.15)', border: '1px solid #ef4444', color: '#fca5a5', padding: '0.75rem', borderRadius: '6px', fontSize: '0.8rem' }}>
                          ❌ <strong>GitHub Integration Error:</strong> {githubLocalError}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div>
                      {/* Live GitHub Profile Banner */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', backgroundColor: '#071516', padding: '1rem', borderRadius: '8px', border: '1px solid #2a5a5c', marginBottom: '1rem', flexWrap: 'wrap' }}>
                        <img 
                          src={githubProfile.avatar_url} 
                          alt={githubProfile.login} 
                          style={{ width: '64px', height: '64px', borderRadius: '50%', border: '2px solid #22c55e' }}
                        />
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <strong style={{ color: '#F6F4EB', fontSize: '1.1rem' }}>{githubProfile.name}</strong>
                            <span style={{ fontSize: '0.8rem', color: '#38bdf8' }}>@{githubProfile.login}</span>
                          </div>
                          <p style={{ margin: '0.25rem 0', fontSize: '0.8rem', color: '#A8B8B4' }}>
                            {githubProfile.bio}
                          </p>
                          <div style={{ display: 'flex', gap: '1rem', fontSize: '0.75rem', color: '#E6A93D', fontFamily: 'var(--font-pixel)' }}>
                            <span>📦 {githubProfile.public_repos} Public Repos</span>
                            <span>👥 {githubProfile.followers} Followers</span>
                            <span>📍 {githubProfile.location}</span>
                          </div>
                        </div>

                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                          <a 
                            href={githubProfile.html_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            style={{ textDecoration: 'none' }}
                          >
                            <GameButton variant="primary">VIEW GITHUB PROFILE ↗️</GameButton>
                          </a>
                          <GameButton onClick={() => setShowPublishModal(true)} variant="gold">
                            🚀 SEND PROJECT TO GITHUB
                          </GameButton>
                          <GameButton onClick={handleRefreshGithub} disabled={githubLoading} variant="secondary">
                            {githubLoading ? 'REFRESHING... ⏳' : '🔄 REFRESH LIVE DATA'}
                          </GameButton>
                          <GameButton onClick={handleDisconnectGithub} variant="secondary">
                            DISCONNECT
                          </GameButton>
                        </div>
                      </div>

                      {/* Publish Status Feedback Banner */}
                      {publishStatus && (
                        <div style={{ 
                          backgroundColor: publishStatus.type === 'error' ? 'rgba(239, 68, 68, 0.15)' : publishStatus.type === 'success' ? 'rgba(34, 197, 94, 0.15)' : 'rgba(56, 189, 248, 0.15)',
                          border: `1px solid ${publishStatus.type === 'error' ? '#ef4444' : publishStatus.type === 'success' ? '#22c55e' : '#38bdf8'}`,
                          color: publishStatus.type === 'error' ? '#fca5a5' : publishStatus.type === 'success' ? '#86efac' : '#bae6fd',
                          padding: '0.85rem', borderRadius: '6px', fontSize: '0.85rem', marginBottom: '1rem'
                        }}>
                          <div>{publishStatus.message}</div>
                          {publishStatus.url && (
                            <a 
                              href={publishStatus.url} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              style={{ color: '#E6A93D', textDecoration: 'underline', fontWeight: 'bold', display: 'inline-block', marginTop: '0.4rem', fontFamily: 'var(--font-pixel)', fontSize: '0.8rem' }}
                            >
                              🔗 OPEN GITHUB REPOSITORY ({publishStatus.url}) ↗️
                            </a>
                          )}
                        </div>
                      )}

                      {/* Publish Modal Dialog */}
                      {showPublishModal && (
                        <div style={{ backgroundColor: '#071516', border: '2px solid #E6A93D', padding: '1.25rem', borderRadius: '8px', marginBottom: '1.25rem' }}>
                          <h4 style={{ color: '#E6A93D', fontFamily: 'var(--font-pixel)', fontSize: '0.9rem', marginTop: 0, marginBottom: '0.5rem' }}>
                            🚀 PUBLISH CODESAGA PROJECT TO GITHUB (@deepka-nair)
                          </h4>
                          <p style={{ fontSize: '0.8rem', color: '#A8B8B4', margin: '0 0 0.85rem 0', lineHeight: 1.4 }}>
                            Enter your GitHub Personal Access Token (PAT) with <code style={{ color: '#38bdf8' }}>repo</code> scope to create repository <strong style={{ color: '#F6F4EB' }}>deepka-nair/codesaga</strong> and commit your project files. Note: <code style={{ color: '#ef4444' }}>.env</code> and private credentials are automatically excluded by <code style={{ color: '#38bdf8' }}>.gitignore</code>.
                          </p>
                          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                            <input 
                              type="password" 
                              value={patInput}
                              onChange={(e) => setPatInput(e.target.value)}
                              placeholder="Enter Personal Access Token (ghp_...)"
                              disabled={githubLoading}
                              style={{
                                flex: 1,
                                minWidth: '240px',
                                backgroundColor: '#0E2526',
                                color: '#F6F4EB',
                                border: '1px solid #2a5a5c',
                                borderRadius: '6px',
                                padding: '0.65rem 0.85rem',
                                fontSize: '0.85rem',
                                outline: 'none'
                              }}
                            />
                            <GameButton onClick={handlePublishProject} disabled={githubLoading || !patInput.trim()} variant="gold">
                              {githubLoading ? 'PUBLISHING... ⏳' : 'CONFIRM & PUSH TO GITHUB 🚀'}
                            </GameButton>
                            <GameButton onClick={() => setShowPublishModal(false)} variant="secondary">
                              CANCEL
                            </GameButton>
                          </div>
                        </div>
                      )}


                      {/* Live Public Repositories List */}
                      {githubProfile.repos && githubProfile.repos.length > 0 && (
                        <div>
                          <h4 style={{ color: '#F6F4EB', fontSize: '0.85rem', marginBottom: '0.75rem', fontFamily: 'var(--font-pixel)' }}>
                            📦 LIVE REPOSITORIES FETCHED FROM GITHUB:
                          </h4>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '0.75rem' }}>
                            {githubProfile.repos.map((repo) => (
                              <div key={repo.id} style={{ backgroundColor: '#173536', padding: '0.75rem', borderRadius: '6px', border: '1px solid #2a5a5c' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                                  <a 
                                    href={repo.html_url} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    style={{ color: '#38bdf8', fontWeight: 'bold', fontSize: '0.85rem', textDecoration: 'none' }}
                                  >
                                    {repo.name} ↗
                                  </a>
                                  <span style={{ fontSize: '0.65rem', color: '#f59e0b', fontFamily: 'var(--font-pixel)' }}>
                                    ⭐ {repo.stargazers_count}
                                  </span>
                                </div>
                                <p style={{ fontSize: '0.75rem', color: '#A8B8B4', margin: '0 0 0.5rem 0', height: '2.4em', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                  {repo.description}
                                </p>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', color: '#94a3b8' }}>
                                  <span>💻 {repo.language}</span>
                                  <span>Updated: {repo.updated_at}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </PixelPanel>
          )}


        </div>
      </div>
    </ErrorBoundary>
  );
};

export default Profile;
