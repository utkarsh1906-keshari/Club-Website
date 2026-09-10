import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an unhandled error:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '60vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
          textAlign: 'center',
          background: 'var(--color-bg-base, #0b0f17)',
          color: 'var(--color-text-primary, #ffffff)'
        }}>
          <div style={{
            maxWidth: '520px',
            width: '100%',
            background: 'var(--color-bg-surface, #151d2a)',
            border: '1px solid var(--color-border, #243044)',
            borderRadius: '16px',
            padding: '2.5rem',
            boxShadow: '0 20px 40px rgba(0,0,0,0.4)'
          }}>
            <AlertTriangle size={52} color="#f59e0b" style={{ margin: '0 auto 1.25rem auto' }} />
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.75rem' }}>
              Something went wrong
            </h2>
            <p style={{ color: 'var(--color-text-secondary, #94a3b8)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1.75rem' }}>
              An unexpected error occurred while displaying this page. We've protected your session so you can reload or safely return to the home page.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={this.handleReload}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.65rem 1.25rem',
                  background: '#8b1d24',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  cursor: 'pointer'
                }}
              >
                <RefreshCw size={15} /> Reload Page
              </button>
              <button
                onClick={this.handleReset}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.65rem 1.25rem',
                  background: 'rgba(255,255,255,0.08)',
                  color: 'var(--color-text-primary, #ffffff)',
                  border: '1px solid var(--color-border, #243044)',
                  borderRadius: '8px',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  cursor: 'pointer'
                }}
              >
                <Home size={15} /> Back to Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
