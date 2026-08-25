import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('CodeSaga ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div 
          style={{ 
            padding: '2rem', 
            backgroundColor: '#0f172a', 
            border: '3px solid #ef4444', 
            borderRadius: '12px', 
            margin: '1rem',
            textAlign: 'center',
            color: '#fee2e2'
          }}
        >
          <h3 style={{ fontFamily: 'var(--font-pixel)', fontSize: '1rem', color: '#f87171', marginBottom: '0.75rem' }}>
            ⚠️ DETECTIVE MODULE RECOVERED
          </h3>
          <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '1rem' }}>
            A temporary component anomaly occurred. Rest of CodeSaga remains operational.
          </p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            style={{
              padding: '0.6rem 1.2rem',
              backgroundColor: '#14b8a6',
              color: '#0a0e17',
              border: '2px solid #0f766e',
              borderRadius: '6px',
              fontFamily: 'var(--font-pixel)',
              fontSize: '0.75rem',
              cursor: 'pointer'
            }}
          >
            RETRY MODULE 🔄
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
