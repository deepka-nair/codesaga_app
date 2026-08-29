import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import useStore from './store/useStore';
import ErrorBoundary from './components/ErrorBoundary';
import Login from './screens/Login';
import Onboarding from './screens/Onboarding';
import Dashboard from './screens/Dashboard';
import SqlWorld from './screens/SqlWorld';
import Profile from './screens/Profile';
import CertificateView from './screens/CertificateView';

import PythonWorld from './screens/PythonWorld';
import JavaWorld from './screens/JavaWorld';
import FrontendWorld from './screens/FrontendWorld';
import CppWorld from './screens/CppWorld';
import BackendWorld from './screens/BackendWorld';

import { getUserFromApi } from './services/apiService';
import { normalizeEmail } from './services/accountService';

// Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
  const { user, isGuest } = useStore();
  if (!user && !isGuest) {
    return <Navigate to="/login" replace />;
  }
  return <ErrorBoundary>{children}</ErrorBoundary>;
};

function App() {
  const { login, logout, user, syncError, setSyncError } = useStore();

  // Startup session verification & progress restoration
  useEffect(() => {
    async function restoreSession() {
      try {
        const rawSession = localStorage.getItem("codesaga_session");
        if (!rawSession) return;

        const session = JSON.parse(rawSession);
        const cleanEmail = normalizeEmail(session.email);
        if (!cleanEmail) return;

        const dbRes = await getUserFromApi(cleanEmail);

        if (dbRes.success && dbRes.exists && dbRes.user) {
          // Valid user in database — restore state
          login(
            { email: cleanEmail, name: dbRes.user.username || session.username || cleanEmail.split('@')[0], id: session.userId || dbRes.user.userId },
            dbRes.user
          );
          setSyncError(null);
        } else if (dbRes.success && dbRes.exists === false) {
          // EXPLICITLY confirmed user does not exist -> clear session
          localStorage.removeItem("codesaga_session");
          logout();
        } else {
          // Network failure / DB temporarily offline -> PRESERVE session & show non-blocking message
          if (!user) {
            login({ email: cleanEmail, name: session.username || cleanEmail.split('@')[0], id: session.userId || 'USR_OFFLINE' });
          }
          setSyncError("Unable to connect to CodeSaga's database. Progress will sync when connection is restored.");
        }
      } catch (err) {
        console.warn("Session restore error:", err);
      }
    }

    restoreSession();
  }, []);

  return (
    <div className="app-container">
      {/* Non-blocking sync warning banner */}
      {syncError && (
        <div style={{
          backgroundColor: '#92400e',
          color: '#fef3c7',
          padding: '0.5rem 1rem',
          textAlign: 'center',
          fontSize: '0.8rem',
          fontFamily: 'var(--font-pixel)',
          borderBottom: '2px solid #f59e0b',
          position: 'relative',
          zIndex: 9999,
          display: 'flex',
          justify: 'space-between',
          alignItems: 'center'
        }}>
          <span>⚠️ {syncError}</span>
          <button 
            onClick={() => setSyncError(null)}
            style={{ background: 'none', border: 'none', color: '#fef3c7', cursor: 'pointer', fontWeight: 'bold' }}
          >
            ✕
          </button>
        </div>
      )}

      <Routes>
        <Route path="/" element={<Navigate to="/worlds" replace />} />
        
        {/* Public Route */}
        <Route path="/login" element={<Login />} />
        
        {/* Onboarding / Character Selection Flow */}
        <Route path="/onboarding" element={
          <ProtectedRoute>
            <Onboarding />
          </ProtectedRoute>
        } />

        {/* Protected Routes */}
        <Route path="/worlds" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />

        {/* SQL Database Detective City Main World */}
        <Route path="/sql-detective" element={
          <ProtectedRoute>
            <SqlWorld />
          </ProtectedRoute>
        } />
        <Route path="/sql-detective/chapter/:chapterId" element={
          <ProtectedRoute>
            <SqlWorld />
          </ProtectedRoute>
        } />

        {/* Python Valley Main World */}
        <Route path="/python-valley" element={
          <ProtectedRoute>
            <PythonWorld />
          </ProtectedRoute>
        } />
        <Route path="/python-valley/chapter/:chapterId" element={
          <ProtectedRoute>
            <PythonWorld />
          </ProtectedRoute>
        } />

        {/* Java Kingdom Main World */}
        <Route path="/java-kingdom" element={
          <ProtectedRoute>
            <JavaWorld />
          </ProtectedRoute>
        } />
        <Route path="/java-kingdom/chapter/:chapterId" element={
          <ProtectedRoute>
            <JavaWorld />
          </ProtectedRoute>
        } />

        {/* Web Creator City Main World */}
        <Route path="/web-creator" element={
          <ProtectedRoute>
            <FrontendWorld />
          </ProtectedRoute>
        } />
        <Route path="/web-creator/chapter/:chapterId" element={
          <ProtectedRoute>
            <FrontendWorld />
          </ProtectedRoute>
        } />

        {/* C++ Cyber Arena Main World */}
        <Route path="/cpp-arena" element={
          <ProtectedRoute>
            <CppWorld />
          </ProtectedRoute>
        } />
        <Route path="/cpp-arena/chapter/:chapterId" element={
          <ProtectedRoute>
            <CppWorld />
          </ProtectedRoute>
        } />

        {/* Server Fortress Main World */}
        <Route path="/server-fortress" element={
          <ProtectedRoute>
            <BackendWorld />
          </ProtectedRoute>
        } />
        <Route path="/server-fortress/chapter/:chapterId" element={
          <ProtectedRoute>
            <BackendWorld />
          </ProtectedRoute>
        } />

        {/* Profile Character Sheet Route */}
        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />

        {/* Certificate View Route */}
        <Route path="/certificate" element={
          <ProtectedRoute>
            <CertificateView />
          </ProtectedRoute>
        } />

        {/* World & Mission Routes */}
        <Route path="/world/:worldId" element={<ProtectedRoute><SqlWorld /></ProtectedRoute>} />
        
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/worlds" replace />} />
      </Routes>
    </div>
  );
}

export default App;



