import { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import api from '../api/axios'

export default function VerifyEmail() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const navigate = useNavigate()
  const [status, setStatus] = useState('verifying')

  useEffect(() => {
    if (!token) {
      setStatus('error')
      return
    }
    api.get(`/auth/verify-email?token=${token}`)
      .then(() => {
        setStatus('success')
        setTimeout(() => navigate('/login'), 3000)
      })
      .catch(() => setStatus('error'))
  }, [token, navigate])

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <div style={{ fontFamily: 'monospace', fontSize: '1.5rem', fontWeight: 700, marginBottom: '2rem' }}>
          Spec<span style={{ color: 'var(--accent)' }}>Watch</span>
        </div>
        {status === 'verifying' && (
          <>
            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
            <p style={{ color: 'var(--muted)' }}>Verifying your email...</p>
          </>
        )}
        {status === 'success' && (
          <>
            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>✅</div>
            <h3 style={{ marginBottom: '0.5rem' }}>Email verified!</h3>
            <p style={{ color: 'var(--muted)' }}>Redirecting to login...</p>
          </>
        )}
        {status === 'error' && (
          <>
            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>❌</div>
            <h3 style={{ marginBottom: '0.5rem' }}>Invalid link</h3>
            <p style={{ color: 'var(--muted)' }}>This verification link is invalid or expired.</p>
          </>
        )}
      </div>
    </div>
  )
}
