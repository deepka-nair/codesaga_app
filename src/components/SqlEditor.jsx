import React, { useState, useEffect } from 'react';
import sqlEngine, { INITIAL_DATABASE } from '../services/sqlEngine';
import audioManager from '../services/audioManager';
import GameButton from './GameButton';

const SqlEditor = ({ 
  initialCode = '', 
  onExecuteResult, 
  hintList = [], 
  onHintUsed 
}) => {
  const [code, setCode] = useState(initialCode);
  const [result, setResult] = useState(null);
  const [currentHintIndex, setCurrentHintIndex] = useState(-1);
  const [activeSchemaTab, setActiveSchemaTab] = useState('citizens');

  useEffect(() => {
    setCode(initialCode);
    setResult(null);
    setCurrentHintIndex(-1);
  }, [initialCode]);

  const handleRunQuery = () => {
    const res = sqlEngine.execute(code);
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
    sqlEngine.resetDatabase();
    setCode(initialCode);
    setResult(null);
  };

  const handleNextHint = () => {
    if (hintList.length === 0) return;
    audioManager.playHintOpened();
    const nextIdx = Math.min(currentHintIndex + 1, hintList.length - 1);
    setCurrentHintIndex(nextIdx);
    if (onHintUsed) {
      onHintUsed(nextIdx);
    }
  };

  const tables = Object.keys(INITIAL_DATABASE);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%' }}>
      {/* Schema Browser Bar */}
      <div 
        style={{ 
          backgroundColor: '#0f172a', 
          border: '2px solid var(--panel-border)', 
          borderRadius: '8px', 
          padding: '0.75rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontFamily: 'var(--font-pixel)', fontSize: '0.7rem', color: 'var(--accent-teal)' }}>
            📁 DATABASE SCHEMA ARCHIVE
          </span>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
            Select table to inspect structure
          </span>
        </div>

        {/* Table Tabs */}
        <div style={{ display: 'flex', gap: '0.4rem', overflowX: 'auto', paddingBottom: '4px' }}>
          {tables.map(tbl => (
            <button
              key={tbl}
              onClick={() => {
                audioManager.playTabSwitch();
                setActiveSchemaTab(tbl);
              }}
              data-cursor="interaction"
              style={{
                fontFamily: 'var(--font-pixel)',
                fontSize: '0.65rem',
                padding: '4px 8px',
                borderRadius: '4px',
                backgroundColor: activeSchemaTab === tbl ? 'var(--accent-teal)' : '#1e293b',
                color: activeSchemaTab === tbl ? '#0a0e17' : 'white',
                border: '1px solid #334155',
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              {tbl}
            </button>
          ))}
        </div>

        {/* Table Columns Preview */}
        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <span style={{ color: 'var(--accent-gold)' }}>Columns:</span>
          {Object.keys(INITIAL_DATABASE[activeSchemaTab][0] || {}).map(col => (
            <code key={col} style={{ backgroundColor: '#1e293b', padding: '1px 5px', borderRadius: '3px', color: '#38bdf8' }}>
              {col}
            </code>
          ))}
        </div>
      </div>

      {/* SQL Editor Area */}
      <div style={{ position: 'relative' }}>
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="WRITE YOUR DETECTIVE SQL QUERY HERE..."
          data-cursor="text"
          rows={5}
          style={{
            width: '100%',
            backgroundColor: '#0a0e17',
            color: '#38bdf8',
            fontFamily: 'Consolas, Monaco, monospace',
            fontSize: '0.95rem',
            padding: '1rem',
            borderRadius: '8px',
            border: '2px solid var(--accent-teal)',
            outline: 'none',
            resize: 'vertical',
            boxShadow: 'inset 0 0 10px rgba(0,0,0,0.8)',
            lineHeight: 1.5
          }}
        />

        {/* Controls Toolbar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <GameButton onClick={handleRunQuery} variant="gold">
              ▶ RUN QUERY
            </GameButton>
            <GameButton onClick={handleClear} variant="secondary">
              CLEAR
            </GameButton>
            <GameButton onClick={handleReset} variant="secondary">
              RESET DB
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
          🔎 <strong>Detective Hint {currentHintIndex + 1}:</strong> {hintList[currentHintIndex]}
        </div>
      )}

      {/* Results or Error Output Display */}
      {result && (
        <div style={{ backgroundColor: '#111827', border: '2px solid var(--panel-border)', borderRadius: '8px', padding: '1rem' }}>
          {result.success ? (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <span style={{ color: 'var(--accent-teal)', fontFamily: 'var(--font-pixel)', fontSize: '0.75rem' }}>
                  ✓ QUERY EXECUTED SUCCESSFULLY ({result.count} rows)
                </span>
              </div>

              {result.rows.length === 0 ? (
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontStyle: 'italic', padding: '1rem 0' }}>
                  Query returned 0 records.
                </div>
              ) : (
                <div style={{ overflowX: 'auto', maxHeight: '250px' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', textAlign: 'left' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#1e293b', color: 'var(--accent-gold)' }}>
                        {result.columns.map(col => (
                          <th key={col} style={{ padding: '8px 12px', border: '1px solid #334155', fontFamily: 'var(--font-pixel)', fontSize: '0.65rem' }}>
                            {col}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {result.rows.map((row, idx) => (
                        <tr key={idx} style={{ backgroundColor: idx % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent' }}>
                          {result.columns.map(col => (
                            <td key={col} style={{ padding: '8px 12px', border: '1px solid #334155', color: '#f8fafc' }}>
                              {row[col] !== null && row[col] !== undefined ? String(row[col]) : <span style={{ color: '#64748b', fontStyle: 'italic' }}>NULL</span>}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ) : (
            <div style={{ color: '#fee2e2', backgroundColor: '#7f1d1d40', padding: '0.85rem', borderRadius: '6px', border: '2px solid #ef4444', fontSize: '0.85rem' }}>
              ❌ {result.error}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SqlEditor;
