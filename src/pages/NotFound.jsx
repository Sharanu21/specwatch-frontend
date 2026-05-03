import { useNavigate } from 'react-router-dom'

export default function NotFound() {
  const navigate = useNavigate()
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
      <div style={{
        fontFamily: 'Space Mono, monospace',
        fontSize: '5rem',
        fontWeight: 700,
        color: '#1e1e2e',
        marginBottom: '0.5rem',
        lineHeight: 1,
      }}>
        404
      </div>
      <div style={{
        fontFamily: 'Space Mono, monospace',
        fontWeight: 700,
        fontSize: '1.2rem',
        marginBottom: '0.75rem',
      }}>
        Spec<span style={{ color: '#ff4d6d' }}>Watch</span>
      </div>
      <p style={{ color: '#6b6b80', fontSize: '0.9rem', maxWidth: '360px', lineHeight: 1.7, marginBottom: '2rem' }}>
        This page doesn't exist. Maybe the endpoint was deprecated? 😉
      </p>
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            background: 'transparent',
            border: '1px solid #1e1e2e',
            color: '#6b6b80',
            padding: '0.7rem 1.4rem',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '0.85rem',
            fontFamily: 'DM Sans, sans-serif',
          }}
        >
          ← Go Back
        </button>
        <button
          onClick={() => navigate('/')}
          style={{
            background: '#ff4d6d',
            border: 'none',
            color: 'white',
            padding: '0.7rem 1.4rem',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '0.85rem',
            fontFamily: 'Space Mono, monospace',
            fontWeight: 700,
          }}
        >
          Home →
        </button>
      </div>
    </div>
  )
}
