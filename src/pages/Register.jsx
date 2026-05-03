import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'

const checks = [
  { key: 'len',     test: p => p.length >= 8,         label: '8+ characters' },
  { key: 'upper',   test: p => /[A-Z]/.test(p),       label: 'Uppercase letter' },
  { key: 'num',     test: p => /[0-9]/.test(p),       label: 'Number' },
  { key: 'special', test: p => /[!@#$%^&*]/.test(p),  label: 'Special character (!@#$%^&*)' },
]

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login, user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => { if (user) navigate('/dashboard') }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    for (const c of checks) {
      if (!c.test(form.password)) {
        setError(`Password: ${c.label} required`)
        return
      }
    }
    setLoading(true)
    try {
      const res = await api.post('/auth/register', form)
      login({ email: res.data.email, name: res.data.name, plan: res.data.plan }, res.data.token)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data || 'Registration failed. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem',
      background: 'radial-gradient(ellipse at top, rgba(0,217,255,0.04) 0%, transparent 60%)',
    }}>
      <div style={{ width: '100%', maxWidth: '400px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Link to="/" style={{
            fontFamily: 'Space Mono, monospace',
            fontSize: '1.4rem',
            fontWeight: 700,
            display: 'inline-block',
            marginBottom: '0.5rem',
          }}>
            Spec<span style={{ color: 'var(--accent)' }}>Watch</span>
          </Link>
          <p style={{ color: 'var(--muted)', fontSize: '0.88rem' }}>
            Create your free account
          </p>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                placeholder="Your name"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                required
                autoFocus
                autoComplete="name"
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                required
                autoComplete="email"
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                required
                autoComplete="new-password"
              />
              {form.password && (
                <div style={{ marginTop: '0.5rem', display: 'flex', flexWrap: 'wrap', gap: '0.3rem 0.6rem' }}>
                  {checks.map(c => (
                    <div key={c.key} style={{
                      fontSize: '0.72rem',
                      color: c.test(form.password) ? 'var(--success)' : 'var(--muted)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                      transition: 'color 0.2s',
                    }}>
                      <span>{c.test(form.password) ? '✓' : '○'}</span>
                      <span>{c.label}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {error && <p className="error-msg">{error}</p>}

            <button
              type="submit"
              className="btn-primary"
              style={{ width: '100%', marginTop: '0.25rem' }}
              disabled={loading}
            >
              {loading ? 'Creating account...' : 'Create Account →'}
            </button>
          </form>

          <div className="divider" />

          <p style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--muted)' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--accent2)', fontWeight: 500 }}>
              Sign in
            </Link>
          </p>
        </div>

        <p style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--muted)', marginTop: '1.25rem', lineHeight: 1.6 }}>
          Free during beta · No credit card required
        </p>
      </div>
    </div>
  )
}
