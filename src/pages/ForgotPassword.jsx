import { useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await api.post('/auth/forgot-password', { email })
      setSent(true)
    } catch (err) {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ width: '100%', maxWidth: '400px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontFamily: 'monospace', fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>
            Spec<span style={{ color: 'var(--accent)' }}>Watch</span>
          </div>
          <p style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>Reset your password</p>
        </div>

        <div className="card">
          {sent ? (
            <div style={{ textAlign: 'center', padding: '1rem' }}>
              <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>📧</div>
              <h3 style={{ marginBottom: '0.5rem' }}>Check your email</h3>
              <p style={{ color: 'var(--muted)', fontSize: '0.88rem', lineHeight: 1.6 }}>
                If that email is registered, you'll receive a reset link shortly.
              </p>
              <Link to="/login" style={{ display: 'block', marginTop: '1.5rem', color: 'var(--accent2)', fontSize: '0.85rem' }}>
                Back to login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Email address</label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>
              {error && <p className="error-msg">{error}</p>}
              <button type="submit" className="btn-primary" style={{ width: '100%' }} disabled={loading}>
                {loading ? 'Sending...' : 'Send Reset Link →'}
              </button>
              <div className="divider" />
              <p style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--muted)' }}>
                <Link to="/login" style={{ color: 'var(--accent2)' }}>Back to login</Link>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
