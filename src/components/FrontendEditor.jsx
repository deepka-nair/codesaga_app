import React, { useState, useEffect } from 'react';
import frontendEngine from '../services/frontendEngine';
import audioManager from '../services/audioManager';
import GameButton from './GameButton';

const FrontendEditor = ({ 
  initialCode = '', 
  onExecuteResult, 
  hintList = [], 
  onHintUsed,
  requirements = {}
}) => {
  const [activeTab, setActiveTab] = useState('html'); // 'html', 'css', 'js'
  const [htmlCode, setHtmlCode] = useState(initialCode || '');
  const [cssCode, setCssCode] = useState('');
  const [jsCode, setJsCode] = useState('');
  
  const [result, setResult] = useState(null);
  const [currentHintIndex, setCurrentHintIndex] = useState(-1);

  useEffect(() => {
    setHtmlCode(initialCode || '');
    setCssCode('');
    setJsCode('');
    setResult(null);
    setCurrentHintIndex(-1);
    setActiveTab('html');
  }, [initialCode]);

  const handleRunScript = () => {
    const res = frontendEngine.execute(htmlCode, cssCode, jsCode);
    const reqValidation = frontendEngine.validateRequirements(htmlCode, cssCode, jsCode, requirements);

    if (!reqValidation.valid) {
      res.success = false;
      res.error = reqValidation.reason;
    }

    setResult(res);

    if (res.success) {
      audioManager.playCorrectSql();
    } else {
      audioManager.playWrongSql();
    }

    if (onExecuteResult) {
      onExecuteResult(res, { htmlCode, cssCode, jsCode });
    }
  };

  const handleClear = () => {
    audioManager.playClick();
    if (activeTab === 'html') setHtmlCode('');
    if (activeTab === 'css') setCssCode('');
    if (activeTab === 'js') setJsCode('');
    setResult(null);
  };

  const handleReset = () => {
    audioManager.playClick();
    setHtmlCode(initialCode || '');
    setCssCode('');
    setJsCode('');
    setResult(null);
  };

  const handleNextHint = () => {
    if (hintList.length === 0) return;
    audioManager.playHintOpened();
    const nextIdx = Math.min(currentHintIndex + 1, hintList.length - 1);
    setCurrentHintIndex(nextIdx);
    if (onHintUsed) onHintUsed(nextIdx);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%' }}>
      {/* Multi-Tab Header Bar (HTML / CSS / JS) */}
      <div style={{ display: 'flex', gap: '0.25rem', backgroundColor: '#0f172a', border: '2px solid #0ea5e9', borderRadius: '8px 8px 0 0', padding: '0.4rem 0.5rem 0 0.5rem' }}>
        {[
          { id: 'html', label: '📄 index.html', color: '#e34f26' },
          { id: 'css', label: '🎨 style.css', color: '#1572b6' },
          { id: 'js', label: '⚡ script.js', color: '#f7df1e' }
        ].map((tab) => {
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              data-cursor="interaction"
              style={{
                backgroundColor: isActive ? '#0a0e17' : '#1e293b',
                color: isActive ? tab.color : '#94a3b8',
                border: '1px solid',
                borderColor: isActive ? tab.color : '#334155',
                borderBottom: isActive ? 'none' : '1px solid #334155',
                borderRadius: '6px 6px 0 0',
                padding: '0.4rem 0.85rem',
                fontFamily: 'Consolas, monospace',
                fontSize: '0.75rem',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Editor Input Area */}
      <div style={{ position: 'relative' }}>
        {activeTab === 'html' && (
          <textarea
            value={htmlCode}
            onChange={(e) => setHtmlCode(e.target.value)}
            placeholder="<!-- Write your HTML code here... -->"
            data-cursor="text"
            rows={7}
            style={{
              width: '100%',
              backgroundColor: '#0a0e17',
              color: '#38bdf8',
              fontFamily: 'Consolas, Monaco, monospace',
              fontSize: '0.95rem',
              padding: '1rem',
              borderRadius: '0 0 8px 8px',
              border: '2px solid #0ea5e9',
              borderTop: 'none',
              outline: 'none',
              resize: 'vertical',
              boxShadow: 'inset 0 0 10px rgba(0,0,0,0.8)',
              lineHeight: 1.5,
              boxSizing: 'border-box'
            }}
          />
        )}

        {activeTab === 'css' && (
          <textarea
            value={cssCode}
            onChange={(e) => setCssCode(e.target.value)}
            placeholder="/* Write your CSS code here... */"
            data-cursor="text"
            rows={7}
            style={{
              width: '100%',
              backgroundColor: '#0a0e17',
              color: '#38bdf8',
              fontFamily: 'Consolas, Monaco, monospace',
              fontSize: '0.95rem',
              padding: '1rem',
              borderRadius: '0 0 8px 8px',
              border: '2px solid #0ea5e9',
              borderTop: 'none',
              outline: 'none',
              resize: 'vertical',
              boxShadow: 'inset 0 0 10px rgba(0,0,0,0.8)',
              lineHeight: 1.5,
              boxSizing: 'border-box'
            }}
          />
        )}

        {activeTab === 'js' && (
          <textarea
            value={jsCode}
            onChange={(e) => setJsCode(e.target.value)}
            placeholder="// Write your JavaScript code here..."
            data-cursor="text"
            rows={7}
            style={{
              width: '100%',
              backgroundColor: '#0a0e17',
              color: '#38bdf8',
              fontFamily: 'Consolas, Monaco, monospace',
              fontSize: '0.95rem',
              padding: '1rem',
              borderRadius: '0 0 8px 8px',
              border: '2px solid #0ea5e9',
              borderTop: 'none',
              outline: 'none',
              resize: 'vertical',
              boxShadow: 'inset 0 0 10px rgba(0,0,0,0.8)',
              lineHeight: 1.5,
              boxSizing: 'border-box'
            }}
          />
        )}

        {/* Toolbar Controls */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <GameButton onClick={handleRunScript} variant="gold">
              ▶ RENDER WEBPAGE PREVIEW
            </GameButton>
            <GameButton onClick={handleClear} variant="secondary">
              CLEAR TAB
            </GameButton>
            <GameButton onClick={handleReset} variant="secondary">
              RESET CODE
            </GameButton>
          </div>

          {hintList.length > 0 && (
            <GameButton 
              onClick={handleNextHint} 
              variant="primary" 
              disabled={currentHintIndex >= hintList.length - 1}
            >
              💡 HINT {currentHintIndex >= 0 ? `(${currentHintIndex + 1}/${hintList.length})` : ''}
            </GameButton>
          )}
        </div>
      </div>

      {/* Active Hint Banner */}
      {currentHintIndex >= 0 && (
        <div style={{ backgroundColor: 'rgba(245, 158, 11, 0.15)', border: '2px solid var(--accent-gold)', padding: '0.75rem', borderRadius: '6px', fontSize: '0.8rem', color: '#fef08a' }}>
          🔎 <strong>Frontend Hint {currentHintIndex + 1}:</strong> {hintList[currentHintIndex]}
        </div>
      )}

      {/* Live Webpage Iframe Preview */}
      {result && (
        <div style={{ backgroundColor: '#090d16', border: `2px solid ${result.success ? '#0ea5e9' : '#ef4444'}`, borderRadius: '8px', padding: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ color: result.success ? '#0ea5e9' : '#ef4444', fontFamily: 'var(--font-pixel)', fontSize: '0.7rem' }}>
              {result.success ? '✓ WEBPAGE LIVE PREVIEW RENDERED' : '❌ FRONTEND VALIDATION ERROR'}
            </span>
          </div>

          {result.success ? (
            <div>
              <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontFamily: 'var(--font-pixel)', marginBottom: '0.4rem' }}>
                BROWSER VIEWPORT PREVIEW:
              </div>
              <iframe
                title="Webpage Live Preview"
                src={result.previewSrc}
                style={{
                  width: '100%',
                  height: '220px',
                  backgroundColor: '#ffffff',
                  borderRadius: '6px',
                  border: '2px solid #334155'
                }}
              />
            </div>
          ) : (
            <div style={{ color: '#fee2e2', backgroundColor: '#7f1d1d40', padding: '0.75rem', borderRadius: '6px', fontSize: '0.85rem' }}>
              ❌ {result.error}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FrontendEditor;
