import React, { useRef, useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import useStore from '../store/useStore';
import { WORLD_CERTIFICATES, isWorldCompleted } from '../utils/worldCertificates';
import { isDeveloper } from '../utils/userRole';
import PixelPanel from '../components/PixelPanel';
import GameButton from '../components/GameButton';
import ErrorBoundary from '../components/ErrorBoundary';
import audioManager from '../services/audioManager';

const CertificateView = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const certRef = useRef(null);

  const targetWorldId = searchParams.get('world') || 'sql';
  const worldConfig = WORLD_CERTIFICATES[targetWorldId] || WORLD_CERTIFICATES.sql;

  const store = useStore();
  const { 
    user, 
    isGuest, 
    certificateName, 
    worldCertificates,
    claimWorldCertificate
  } = store;

  const isDev = isDeveloper(user);
  const isGuestMode = isGuest || (!user && !isDev);
  const isCompleted = isWorldCompleted(targetWorldId, store);
  const isEligible = isDev || isCompleted;

  const [localCertInfo, setLocalCertInfo] = useState(null);
  const [isClaiming, setIsClaiming] = useState(false);

  // Automatically claim/retrieve world-specific certificate on load if eligible
  useEffect(() => {
    async function initCertificate() {
      if (!isGuestMode && isEligible) {
        const currentCerts = worldCertificates || {};
        if (!currentCerts[targetWorldId]) {
          setIsClaiming(true);
          const res = await claimWorldCertificate(targetWorldId);
          setLocalCertInfo(res);
          setIsClaiming(false);
        }
      }
    }
    initCertificate();
  }, [isGuestMode, isEligible, targetWorldId, worldCertificates]);

  const activeUsername = isGuestMode 
    ? 'CodeSaga Explorer' 
    : (user?.name || certificateName || (isDev ? 'Developer' : (user?.email ? user.email.split('@')[0] : '')));

  const existingCert = (worldCertificates || {})[targetWorldId] || localCertInfo;

  const displayCertId = isGuestMode 
    ? `CS-${worldConfig.codePrefix.replace('CS-', '')}-PREVIEW` 
    : (existingCert?.id || `${worldConfig.codePrefix}-PENDING`);
  
  const rawDate = existingCert?.issued_at || new Date().toISOString();
  const formattedDate = isGuestMode ? 'PREVIEW MODE' : new Date(rawDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const handlePrint = () => {
    audioManager.playClick();
    window.print();
  };

  const handleDownload = () => {
    audioManager.playSuccess();
    window.print();
  };

  // Block normal users if world is incomplete
  if (!isGuestMode && !isEligible) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#0a0e17', color: 'white', padding: '4rem 1.5rem', textAlign: 'center' }}>
        <PixelPanel style={{ maxWidth: '600px', margin: '0 auto', borderTop: '4px solid #ef4444', backgroundColor: '#1e293b' }}>
          <span style={{ fontSize: '3.5rem', display: 'block', marginBottom: '1rem' }}>🎓🔒</span>
          <h2 style={{ color: '#ef4444', fontFamily: 'var(--font-pixel)', fontSize: '1.4rem', marginBottom: '0.75rem' }}>
            {worldConfig.name} CERTIFICATE HIDDEN
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: 1.5 }}>
            Complete all {worldConfig.totalChapters} chapters in {worldConfig.name} to earn this certificate.
          </p>
          <GameButton onClick={() => navigate('/worlds')} variant="gold">
            RETURN TO GAME 🏙️
          </GameButton>
        </PixelPanel>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <style>{`
        @media print {
          body * {
            visibility: hidden !important;
          }
          #printable-certificate, #printable-certificate * {
            visibility: visible !important;
          }
          #printable-certificate {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 !important;
            padding: 2rem !important;
            box-shadow: none !important;
            border: 8px double #c59b27 !important;
            background: #ffffff !important;
            color: #0f172a !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      <div 
        style={{ 
          minHeight: '100vh',
          backgroundColor: '#0a0e17',
          color: '#f8fafc',
          padding: '1.5rem 1rem'
        }}
      >
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          {/* Header Action Bar */}
          <header className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h2 style={{ color: 'var(--accent-gold)', margin: 0, fontSize: '1.4rem', fontFamily: 'var(--font-pixel)' }}>
                {worldConfig.badge} {worldConfig.name} CERTIFICATE
              </h2>
              <span style={{ fontSize: '0.75rem', color: 'var(--accent-teal)', fontFamily: 'var(--font-pixel)' }}>
                WORLD {worldConfig.worldNumber} OF 6 • CODESAGA ACADEMY
              </span>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <GameButton onClick={handlePrint} variant="gold">
                🖨️ PRINT CERTIFICATE
              </GameButton>
              <GameButton onClick={handleDownload} variant="primary">
                📥 DOWNLOAD CERTIFICATE
              </GameButton>
              <GameButton onClick={() => navigate('/profile')} variant="secondary">
                BACK TO PROFILE
              </GameButton>
            </div>
          </header>

          {/* REAL WORLD CERTIFICATE DISPLAY CARD */}
          <div
            id="printable-certificate"
            ref={certRef}
            style={{
              backgroundColor: '#0f172a',
              backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(234, 179, 8, 0.05) 0%, transparent 70%)',
              border: '12px double #eab308',
              borderRadius: '16px',
              padding: '3.5rem 2.5rem',
              textAlign: 'center',
              position: 'relative',
              boxShadow: '0 20px 50px rgba(0,0,0,0.8), inset 0 0 30px rgba(234, 179, 8, 0.1)',
              color: '#f8fafc',
              margin: '0 auto 2rem auto',
              boxSizing: 'border-box'
            }}
          >
            {/* Corner Decorative Ornaments */}
            <div style={{ position: 'absolute', top: '15px', left: '20px', fontSize: '1.8rem', color: '#eab308' }}>⚜️</div>
            <div style={{ position: 'absolute', top: '15px', right: '20px', fontSize: '1.8rem', color: '#eab308' }}>⚜️</div>
            <div style={{ position: 'absolute', bottom: '15px', left: '20px', fontSize: '1.8rem', color: '#eab308' }}>⚜️</div>
            <div style={{ position: 'absolute', bottom: '15px', right: '20px', fontSize: '1.8rem', color: '#eab308' }}>⚜️</div>

            {/* Logo & Academy Name Header */}
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.25rem' }}>{worldConfig.badge}📜</div>
              <h1 style={{ 
                fontFamily: 'var(--font-pixel)', 
                fontSize: '1.8rem', 
                color: '#eab308', 
                letterSpacing: '2px', 
                margin: 0,
                textTransform: 'uppercase',
                textShadow: '2px 2px 4px rgba(0,0,0,0.8)'
              }}>
                CODE SAGA ACADEMY
              </h1>
              <div style={{ fontSize: '0.75rem', color: '#38bdf8', fontFamily: 'var(--font-pixel)', letterSpacing: '3px', marginTop: '4px' }}>
                LEARNING THROUGH ADVENTURE
              </div>
              {isDev && !isCompleted && (
                <div style={{
                  display: 'inline-block',
                  marginTop: '8px',
                  backgroundColor: 'rgba(6, 182, 212, 0.2)',
                  border: '1px solid #06b6d4',
                  color: '#06b6d4',
                  padding: '3px 10px',
                  borderRadius: '4px',
                  fontFamily: 'var(--font-pixel)',
                  fontSize: '0.65rem'
                }}>
                  🛠️ DEVELOPER TESTING ACCESS
                </div>
              )}
            </div>

            {/* Certificate Title */}
            <div style={{ margin: '2rem 0 1.5rem 0' }}>
              <h2 style={{ 
                fontSize: '1.5rem', 
                fontFamily: 'Georgia, serif', 
                fontStyle: 'italic', 
                color: '#94a3b8', 
                fontWeight: 'normal',
                margin: '0 0 0.5rem 0'
              }}>
                This Certificate of Completion is proudly presented to
              </h2>
            </div>

            {/* Recipient Student Name */}
            <div style={{ margin: '1.5rem 0 2rem 0', borderBottom: '2px solid #eab308', display: 'inline-block', paddingBottom: '0.5rem', minWidth: '60%' }}>
              <h1 style={{ 
                fontFamily: 'var(--font-pixel)', 
                fontSize: '2.2rem', 
                color: '#ffffff', 
                margin: 0,
                letterSpacing: '1px',
                textShadow: '0 0 15px rgba(250, 204, 21, 0.4)'
              }}>
                {activeUsername}
              </h1>
            </div>

            {/* World Completion Description */}
            <div style={{ maxWidth: '750px', margin: '0 auto 2rem auto', fontSize: '1.05rem', color: '#cbd5e1', lineHeight: 1.6 }}>
              for successfully completing all {worldConfig.totalChapters} chapters of
              <div style={{ color: '#eab308', fontFamily: 'var(--font-pixel)', fontSize: '1.4rem', margin: '0.75rem 0', letterSpacing: '1px' }}>
                {worldConfig.name}
              </div>
              demonstrating verified mastery in <strong>{worldConfig.language}</strong> as part of the CodeSaga learning journey.
            </div>

            {/* Metadata Footer: Date & ID */}
            <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', margin: '3rem 0 2rem 0', flexWrap: 'wrap', gap: '1.5rem' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-pixel)', color: '#94a3b8', marginBottom: '0.25rem' }}>
                  DATE ISSUED
                </div>
                <div style={{ fontSize: '1rem', fontWeight: 'bold', color: '#f8fafc' }}>
                  {formattedDate}
                </div>
              </div>

              {/* Gold Official Seal Badge */}
              <div style={{
                width: '90px',
                height: '90px',
                borderRadius: '50%',
                backgroundColor: '#1e293b',
                border: '4px double #eab308',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 20px rgba(234, 179, 8, 0.3)'
              }}>
                <span style={{ fontSize: '1.5rem' }}>🎓</span>
                <span style={{ fontSize: '0.55rem', fontFamily: 'var(--font-pixel)', color: '#eab308', marginTop: '2px' }}>WORLD {worldConfig.worldNumber}</span>
              </div>

              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-pixel)', color: '#94a3b8', marginBottom: '0.25rem' }}>
                  CERTIFICATE ID
                </div>
                <div style={{ fontSize: '1rem', fontFamily: 'Consolas, monospace', fontWeight: 'bold', color: '#38bdf8' }}>
                  {displayCertId}
                </div>
              </div>
            </div>

            {/* Guest Preview Watermark Banner */}
            {isGuestMode && (
              <div style={{
                backgroundColor: 'rgba(239, 68, 68, 0.2)',
                border: '2px dashed #ef4444',
                color: '#fca5a5',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                fontSize: '0.85rem',
                fontFamily: 'var(--font-pixel)',
                marginBottom: '1.5rem',
                textAlign: 'center'
              }}>
                ⚠️ PREVIEW — NOT A VALID CERTIFICATE
                <div style={{ fontSize: '0.7rem', color: '#fef08a', marginTop: '4px', fontFamily: 'sans-serif' }}>
                  Create a free CodeSaga account & complete your journey to earn an official verified certificate.
                </div>
              </div>
            )}

            {/* Signature Section */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '1px solid #334155', flexWrap: 'wrap', gap: '1rem' }}>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: '1.2rem', color: '#eab308', marginBottom: '4px' }}>
                  Detective Aria Silver
                </div>
                <div style={{ fontSize: '0.7rem', fontFamily: 'var(--font-pixel)', color: '#94a3b8' }}>
                  CHIEF INSTRUCTOR, CODESAGA ACADEMY
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-pixel)', color: isGuestMode ? '#ef4444' : '#22c55e' }}>
                  {isGuestMode ? 'SAMPLE PREVIEW ONLY ⚠️' : 'VERIFIED CREDENTIAL ✓'}
                </div>
                <div style={{ fontSize: '0.65rem', color: '#94a3b8', marginTop: '2px' }}>
                  {isGuestMode ? 'CodeSaga Guest Demo' : 'CodeSaga Central Database Registry'}
                </div>
              </div>
            </div>
          </div>

          {/* Guest Registration CTA Box */}
          {isGuestMode && (
            <div className="no-print" style={{
              backgroundColor: '#1e293b',
              border: '2px solid #eab308',
              borderRadius: '12px',
              padding: '1.5rem',
              textAlign: 'center',
              marginTop: '2rem'
            }}>
              <h3 style={{ color: '#eab308', fontFamily: 'var(--font-pixel)', fontSize: '1.2rem', margin: '0 0 0.5rem 0' }}>
                🎓 THIS IS WHAT YOU CAN EARN
              </h3>
              <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: '0 0 1.25rem 0' }}>
                Complete your CodeSaga journey to unlock your official verified certificate with your name and unique database ID.
              </p>
              <GameButton onClick={() => navigate('/login')} variant="gold">
                CREATE FREE ACCOUNT 🚀
              </GameButton>
            </div>
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default CertificateView;
