import React from 'react';
import { useNavigate } from 'react-router-dom';
import GameHUD from '../components/GameHUD';
import PixelPanel from '../components/PixelPanel';
import GameButton from '../components/GameButton';
import PixelIcon from '../components/PixelIcon';
import InactivityReminder from '../components/InactivityReminder';
import audioManager from '../services/audioManager';
import useStore from '../store/useStore';

const Dashboard = () => {
  const navigate = useNavigate();
  const { logout, user, completedChapters, pythonProgress, javaProgress, frontendProgress, cppProgress, backendProgress, sqlProgress: storeSqlProgress } = useStore();

  const handleLogout = () => {
    audioManager.playBack();
    logout();
    navigate('/login');
  };

  const handleEnterWorld = (worldId) => {
    if (worldId === 'sql') {
      audioManager.playWorldSelected();
      const targetCh = storeSqlProgress?.currentChapter || 1;
      navigate(`/sql-detective/chapter/${targetCh}`);
    } else if (worldId === 'python') {
      audioManager.playWorldSelected();
      const targetCh = pythonProgress?.currentChapter || 1;
      navigate(`/python-valley/chapter/${targetCh}`);
    } else if (worldId === 'java') {
      audioManager.playWorldSelected();
      const targetCh = javaProgress?.currentChapter || 1;
      navigate(`/java-kingdom/chapter/${targetCh}`);
    } else if (worldId === 'frontend') {
      audioManager.playWorldSelected();
      const targetCh = frontendProgress?.currentChapter || 1;
      navigate(`/web-creator/chapter/${targetCh}`);
    } else if (worldId === 'cpp') {
      audioManager.playWorldSelected();
      const targetCh = cppProgress?.currentChapter || 1;
      navigate(`/cpp-arena/chapter/${targetCh}`);
    } else if (worldId === 'backend') {
      audioManager.playWorldSelected();
      const targetCh = backendProgress?.currentChapter || 1;
      navigate(`/server-fortress/chapter/${targetCh}`);
    } else {
      audioManager.playDisabled();
    }
  };

  const sqlCompletedCount = completedChapters ? completedChapters.length : 0;
  const pyCompletedCount = (pythonProgress?.completedChapters || []).length;
  const javaCompletedCount = (javaProgress?.completedChapters || []).length;
  const feCompletedCount = (frontendProgress?.completedChapters || []).length;
  const cppCompletedCount = (cppProgress?.completedChapters || []).length;
  const beCompletedCount = (backendProgress?.completedChapters || []).length;

  const worlds = [
    { 
      id: 'sql', 
      name: 'DATABASE DETECTIVE CITY', 
      language: 'SQL', 
      guide: 'Detective Aria Silver', 
      description: 'Solve crime mysteries using relational SQL queries in a cyberpunk detective city.', 
      progress: sqlCompletedCount, 
      total: 14, 
      color: '#06b6d4', 
      icon: '🕵️', 
      action: sqlCompletedCount > 0 ? 'CONTINUE CASE 🕵️' : 'START LEARNING 🕵️', 
      isLocked: false 
    },
    { 
      id: 'python', 
      name: 'PYTHON VALLEY', 
      language: 'Python', 
      guide: 'Aiden & Byte', 
      description: 'Master Python fundamentals, OOP, collections, file I/O, and build the Robot Management Capstone.', 
      progress: pyCompletedCount, 
      total: 12, 
      color: '#22c55e', 
      icon: '🐍', 
      action: pyCompletedCount > 0 || (pythonProgress?.currentMissionIndex || 0) > 0 ? 'CONTINUE PYTHON 🐍' : 'START PYTHON 🐍', 
      isLocked: false 
    },
    { 
      id: 'java', 
      name: 'JAVA KINGDOM', 
      language: 'Java', 
      guide: 'Jax', 
      description: 'Master Java primitives, operators, control flow, methods, OOP inheritance, and the Grade Manager Capstone.', 
      progress: javaCompletedCount, 
      total: 12, 
      color: '#f59e0b', 
      icon: '☕', 
      action: javaCompletedCount > 0 || (javaProgress?.currentMissionIndex || 0) > 0 ? 'CONTINUE JAVA ☕' : 'START JAVA ☕', 
      isLocked: false 
    },
    { 
      id: 'frontend', 
      name: 'WEB CREATOR CITY', 
      language: 'Frontend', 
      guide: 'Pixel', 
      description: 'Master HTML5, CSS3, Flexbox, Grid, JavaScript, DOM events, APIs, and the Developer Dashboard Capstone.', 
      progress: feCompletedCount, 
      total: 12, 
      color: '#0ea5e9', 
      icon: '🌐', 
      action: feCompletedCount > 0 || (frontendProgress?.currentMissionIndex || 0) > 0 ? 'CONTINUE FRONTEND 🌐' : 'START FRONTEND 🌐', 
      isLocked: false 
    },
    { 
      id: 'cpp', 
      name: 'C++ CYBER ARENA', 
      language: 'C++', 
      guide: 'Vector', 
      description: 'Master C++ I/O streams, pointers, memory addresses, references, OOP inheritance, STL, and Player Manager Capstone.', 
      progress: cppCompletedCount, 
      total: 12, 
      color: '#a855f7', 
      icon: '⚡', 
      action: cppCompletedCount > 0 || (cppProgress?.currentMissionIndex || 0) > 0 ? 'CONTINUE C++ ⚡' : 'START C++ ⚡', 
      isLocked: false 
    },
    { 
      id: 'backend', 
      name: 'SERVER FORTRESS', 
      language: 'Backend', 
      guide: 'Server', 
      description: 'Master Node.js, Express, REST APIs, Databases, Validation, Auth, JWT, Security, and CodeSaga Backend Capstone.', 
      progress: beCompletedCount, 
      total: 12, 
      color: '#ef4444', 
      icon: '⚙️', 
      action: beCompletedCount > 0 || (backendProgress?.currentMissionIndex || 0) > 0 ? 'CONTINUE BACKEND ⚙️' : 'START BACKEND ⚙️', 
      isLocked: false 
    }
  ];




  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <h2 style={{ color: 'var(--accent-gold)', margin: 0, fontSize: '1.8rem', textShadow: '2px 2px 0px #000' }}>CodeSaga</h2>
          <span style={{ fontSize: '0.75rem', color: 'var(--accent-teal)', fontFamily: 'var(--font-pixel)' }}>
            HERO: {user?.name?.toUpperCase()}
          </span>
        </div>
        
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <GameHUD />
          <button 
            onClick={handleLogout} 
            data-cursor="interaction"
            style={{ color: 'var(--text-secondary)', background: 'none', border: 'none', textDecoration: 'underline', fontSize: '0.8rem', cursor: 'pointer' }}
          >
            Logout
          </button>
        </div>
      </header>

      <InactivityReminder />

      <section>
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontFamily: 'var(--font-pixel)', fontSize: '1.8rem', marginBottom: '0.5rem', color: 'white', textShadow: '2px 2px 0px #000' }}>CHOOSE YOUR WORLD</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Select a coding adventure world to begin your detective quests.</p>
        </div>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
          gap: '1.5rem' 
        }}>
          {worlds.map(world => (
            <PixelPanel key={world.id} style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              borderTop: `4px solid ${world.color}`,
              opacity: world.isLocked ? 0.7 : 1,
              position: 'relative',
              overflow: 'hidden'
            }}>
              {world.isLocked && (
                <div style={{ position: 'absolute', top: '10px', right: '10px', fontSize: '1.2rem' }}>🔒</div>
              )}
              <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
                <div style={{ 
                  width: '70px', height: '70px', 
                  backgroundColor: '#1e293b', 
                  borderRadius: '12px', 
                  border: `2px solid ${world.color}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', 
                  flexShrink: 0,
                  fontSize: '2rem',
                  boxShadow: `0 0 10px ${world.color}40`
                }}>
                  {world.id === 'sql' ? '🕵️' : '⚔️'}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.65rem', color: world.color, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.25rem', fontFamily: 'var(--font-pixel)' }}>WORLD • {world.language}</div>
                  <h3 style={{ color: 'white', marginBottom: '0.25rem', fontSize: '1.1rem' }}>{world.name}</h3>
                  <div style={{ fontSize: '0.75rem', color: 'var(--accent-gold)', marginBottom: '0.5rem' }}>Guide: {world.guide}</div>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', lineHeight: 1.4, margin: 0 }}>{world.description}</p>
                </div>
              </div>
              
              <div style={{ marginTop: 'auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', fontFamily: 'var(--font-pixel)' }}>
                  <span>{world.progress === 0 ? 'Not started' : `${world.progress} / ${world.total} chapters`}</span>
                  <span>{world.progress > 0 ? `${Math.round((world.progress / world.total) * 100)}%` : '0%'}</span>
                </div>
                <div style={{ width: '100%', height: '8px', backgroundColor: '#1e293b', borderRadius: '4px', marginBottom: '1rem', overflow: 'hidden', border: '1px solid #334155' }}>
                  <div style={{ width: `${(world.progress / world.total) * 100}%`, height: '100%', backgroundColor: world.color, transition: 'width 0.3s' }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                  <GameButton 
                    onClick={() => handleEnterWorld(world.id)}
                    variant={world.isLocked ? 'secondary' : world.progress > 0 ? 'gold' : 'primary'}
                    disabled={world.isLocked}
                  >
                    {world.action}
                  </GameButton>
                </div>
              </div>
            </PixelPanel>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;

