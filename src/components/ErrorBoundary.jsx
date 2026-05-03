import { Component } from 'react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0a0a0f',
          color: '#e8e8f0',
          textAlign: 'center',
          padding: '2rem',
          fontFamily: 'DM Sans, sans-serif',
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠</div>
          <div style={{
            fontFamily: 'Space Mono, monospace',
            fontWeight: 700,
            fontSize: '1.2rem',
            marginBottom: '0.5rem',
          }}>
            Spec<span style={{ color: '#ff4d6d' }}>Watch</span>
          </div>
          <h2 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.5rem', color: '#ff4d6d' }}>
            Something went wrong
          </h2>
          <p style={{ color: '#6b6b80', fontSize: '0.88rem', maxWidth: '400px', marginBottom: '1.5rem', lineHeight: 1.6 }}>
            An unexpected error occurred. Try refreshing the page.
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              background: '#ff4d6d',
              border: 'none',
              color: 'white',
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              cursor: 'pointer',
              fontFamily: 'Space Mono, monospace',
              fontWeight: 700,
              fontSize: '0.85rem',
            }}
          >
            Refresh Page
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
