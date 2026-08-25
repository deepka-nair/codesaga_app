import React, { useState, useEffect } from 'react';
import cppEngine from '../services/cppEngine';
import audioManager from '../services/audioManager';
import GameButton from './GameButton';

const CppEditor = ({ 
  initialCode = '', 
  onExecuteResult, 
  hintList = [], 
  onHintUsed 
}) => {
  const [code, setCode] = useState(initialCode);
  const [result, setResult] = useState(null);
  const [currentHintIndex, setCurrentHintIndex] = useState(-1);

  useEffect(() => {
    setCode(initialCode);
    setResult(null);
    setCurrentHintIndex(-1);
  }, [initialCode]);

  const handleRunScript = () => {
    const res = cppEngine.execute(code);
    setResult(res);

    if (res.success) {
      audioManager.playCorrectSql();
    } else {
      audioManager.playWrongSql();
    }

    if (onExecuteResult) {
      onExecuteResult(res, code);
    }
  };

  const handleClear = () => {
    audioManager.playClick();
    setCode('');
    setResult(null);
  };

  const handleReset = () => {
    audioManager.playClick();
    setCode(initialCode);
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
      {/* C++ Code Terminal Container */}
      <div style={{ position: 'relative' }}>
        <div 
          style={{ 
            backgroundColor: '#0f172a', 
            border: '2px solid #a855f7', 
            borderRadius: '8px 8px 0 0', 
            padding: '0.5rem 0.75rem',
            display: 'flex',
            justify: 'space-between',
            alignItems: 'center'
          }}
        >
          <span style={{ fontFamily: 'var(--font-pixel)', fontSize: '0.7rem', color: '#a855f7' }}>
            ⚡ C++ CYBER IDE (.cpp)
          </span>
          <span style={{ fontSize: '0.65rem', color: '#94a3b8' }}>
            GCC 13.2 / Clang 17.0 Runtime
          </span>
        </div>

        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="// Write your C++ code here..."
          data-cursor="text"
          rows={7}
          style={{
            width: '100%',
            backgroundColor: '#0a0e17',
            color: '#c084fc',
            fontFamily: 'Consolas, Monaco, monospace',
            fontSize: '0.95rem',
            padding: '1rem',
            borderRadius: '0 0 8px 8px',
            border: '2px solid #a855f7',
            borderTop: 'none',
            outline: 'none',
            resize: 'vertical',
            boxShadow: 'inset 0 0 10px rgba(0,0,0,0.8)',
            lineHeight: 1.5,
            boxSizing: 'border-box'
          }}
        />

        {/* Toolbar Controls */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <GameButton onClick={handleRunScript} variant="gold">
              ▶ RUN C++ SCRIPT
            </GameButton>
            <GameButton onClick={handleClear} variant="secondary">
              CLEAR
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
          🔎 <strong>C++ Hint {currentHintIndex + 1}:</strong> {hintList[currentHintIndex]}
        </div>
      )}

      {/* Output Console Window */}
      {result && (
        <div style={{ backgroundColor: '#090d16', border: `2px solid ${result.success ? '#a855f7' : '#ef4444'}`, borderRadius: '8px', padding: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ color: result.success ? '#a855f7' : '#ef4444', fontFamily: 'var(--font-pixel)', fontSize: '0.7rem' }}>
              {result.success ? '✓ C++ CODE COMPILED & EXECUTED' : '❌ C++ COMPILATION ERROR'}
            </span>
          </div>

          {result.success ? (
            <div>
              <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontFamily: 'var(--font-pixel)', marginBottom: '0.4rem' }}>
                STD::COUT OUTPUT:
              </div>
              <div style={{ backgroundColor: '#020617', padding: '0.75rem', borderRadius: '4px', border: '1px solid #1e293b', fontFamily: 'Consolas, monospace', fontSize: '0.85rem', color: '#c084fc' }}>
                {result.output.length === 0 ? (
                  <span style={{ color: '#64748b', fontStyle: 'italic' }}>Program completed with 0 printed outputs.</span>
                ) : (
                  result.output.map((line, i) => (
                    <div key={i} style={{ lineHeight: 1.4 }}>{line}</div>
                  ))
                )}
              </div>
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

export default CppEditor;
