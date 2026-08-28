import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';
import GameHUD from './GameHUD';
import audioManager from '../services/audioManager';

export default function WebAppShell({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isGuest, logout } = useStore();

  const isAuthPage = location.pathname === '/login';

  const handleNav = (path) => {
    audioManager.playClick();
    navigate(path);
  };

  const handleLogout = () => {
    audioManager.playBack();
    logout();
    navigate('/login');
  };

  const isActive = (path) => {
    if (path === '/worlds') return location.pathname === '/worlds' || location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <div className="webapp-shell">
      {/* Web App Glassmorphism Top Header Bar */}
      {!isAuthPage && (
        <header className="webapp-header">
          <div className="webapp-logo-group" onClick={() => handleNav('/worlds')}>
            <img 
              src="/assets/codesaga-logo-web.png" 
              alt="CodeSaga WebApp" 
              style={{ height: '38px', objectFit: 'contain' }}
              onError={(e) => { e.target.style.display = 'none'; }}
            />
            <span className="webapp-logo-title">CODESAGA</span>
            <div className="webapp-status-badge">
              <div className="webapp-status-dot" />
              <span>SPA APP</span>
            </div>
          </div>

          {/* Web App Navigation Tabs (Desktop & Tablet) */}
          <nav className="webapp-nav-tabs">
            <button 
              className={`webapp-tab-btn ${isActive('/worlds') ? 'active' : ''}`}
              onClick={() => handleNav('/worlds')}
            >
              🗺️ WORLDS
            </button>
            <button 
              className={`webapp-tab-btn ${isActive('/sql-detective') ? 'active' : ''}`}
              onClick={() => handleNav('/sql-detective')}
            >
              🕵️ SQL
            </button>
            <button 
              className={`webapp-tab-btn ${isActive('/python-valley') ? 'active' : ''}`}
              onClick={() => handleNav('/python-valley')}
            >
              🐍 PYTHON
            </button>
            <button 
              className={`webapp-tab-btn ${isActive('/java-kingdom') ? 'active' : ''}`}
              onClick={() => handleNav('/java-kingdom')}
            >
              ☕ JAVA
            </button>
            <button 
              className={`webapp-tab-btn ${isActive('/web-creator') ? 'active' : ''}`}
              onClick={() => handleNav('/web-creator')}
            >
              🌐 FRONTEND
            </button>
            <button 
              className={`webapp-tab-btn ${isActive('/cpp-arena') ? 'active' : ''}`}
              onClick={() => handleNav('/cpp-arena')}
            >
              ⚡ C++
            </button>
            <button 
              className={`webapp-tab-btn ${isActive('/server-fortress') ? 'active' : ''}`}
              onClick={() => handleNav('/server-fortress')}
            >
              ⚙️ BACKEND
            </button>
            <button 
              className={`webapp-tab-btn ${isActive('/profile') ? 'active' : ''}`}
              onClick={() => handleNav('/profile')}
            >
              👤 PROFILE
            </button>
          </nav>

          {/* Web App HUD & Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {(user || isGuest) && <GameHUD />}
            {(user || isGuest) && (
              <button 
                onClick={handleLogout}
                style={{
                  fontFamily: 'var(--font-pixel)',
                  fontSize: '0.65rem',
                  color: 'var(--accent-red)',
                  backgroundColor: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid var(--accent-red)',
                  padding: '6px 10px',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                🚪 EXIT
              </button>
            )}
          </div>
        </header>
      )}

      {/* Main Web App Viewport */}
      <main className="webapp-viewport">
        {children}
      </main>

      {/* Web App Dock Bottom Navigation */}
      {!isAuthPage && (user || isGuest) && (
        <nav className="webapp-bottom-dock">
          <button 
            className={`webapp-dock-btn ${isActive('/worlds') ? 'active' : ''}`}
            onClick={() => handleNav('/worlds')}
          >
            <span style={{ fontSize: '1.1rem' }}>🏰</span>
            <span>WORLDS</span>
          </button>
          <button 
            className={`webapp-dock-btn ${isActive('/sql-detective') ? 'active' : ''}`}
            onClick={() => handleNav('/sql-detective')}
          >
            <span style={{ fontSize: '1.1rem' }}>📊</span>
            <span>SQL</span>
          </button>
          <button 
            className={`webapp-dock-btn ${isActive('/python-valley') ? 'active' : ''}`}
            onClick={() => handleNav('/python-valley')}
          >
            <span style={{ fontSize: '1.1rem' }}>🐍</span>
            <span>PYTHON</span>
          </button>
          <button 
            className={`webapp-dock-btn ${isActive('/java-kingdom') ? 'active' : ''}`}
            onClick={() => handleNav('/java-kingdom')}
          >
            <span style={{ fontSize: '1.1rem' }}>☕</span>
            <span>JAVA</span>
          </button>
          <button 
            className={`webapp-dock-btn ${isActive('/web-creator') ? 'active' : ''}`}
            onClick={() => handleNav('/web-creator')}
          >
            <span style={{ fontSize: '1.1rem' }}>🌐</span>
            <span>WEB</span>
          </button>
          <button 
            className={`webapp-dock-btn ${isActive('/cpp-arena') ? 'active' : ''}`}
            onClick={() => handleNav('/cpp-arena')}
          >
            <span style={{ fontSize: '1.1rem' }}>⚡</span>
            <span>C++</span>
          </button>
          <button 
            className={`webapp-dock-btn ${isActive('/server-fortress') ? 'active' : ''}`}
            onClick={() => handleNav('/server-fortress')}
          >
            <span style={{ fontSize: '1.1rem' }}>⚙️</span>
            <span>BACKEND</span>
          </button>
          <button 
            className={`webapp-dock-btn ${isActive('/profile') ? 'active' : ''}`}
            onClick={() => handleNav('/profile')}
          >
            <span style={{ fontSize: '1.1rem' }}>👤</span>
            <span>PROFILE</span>
          </button>
        </nav>
      )}
    </div>
  );
}
