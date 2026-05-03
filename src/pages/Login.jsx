import { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import api from '../api/axios'

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login, user } = useAuth()
  const navigate = useNavigate()
  const toast = useToast()
  const [searchParams] = useSearchParams()

  useEffect(() => {
    if (user) navigate('/dashboard')
    if (searchParams.get('reset') === 'success') {
      toast.success('Password reset! Sign in with your new password.')
    }
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await api.post('/auth/login', form)
      login({ email: res.data.email, name: res.data.name, plan: res.data.plan }, res.data.token)
      navigate('/dashboard')
    } catch (err) {
      const msg = err.response?.data || 'Invalid email or password'
      setError(msg)
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
      background: 'radial-gradient(ellipse at top, rgba(255,77,109,0.05) 0%, transparent 60%)',
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
            Sign in to your account
          </p>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit}>
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
                autoComplete="current-password"
              />
            </div>
            <div style={{ textAlign: 'right', marginTop: '-0.6rem', marginBottom: '1rem' }}>
              <Link to="/forgot-password" style={{ fontSize: '0.78rem', color: 'var(--accent2)' }}>
                Forgot password?
              </Link>
            </div>

            {error && <p className="error-msg">{error}</p>}

            <button
              type="submit"
              className="btn-primary"
              style={{ width: '100%', marginTop: '0.25rem' }}
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign In →'}
            </button>
          </form>

          <div className="divider" />

          <p style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--muted)' }}>
            No account?{' '}
            <Link to="/register" style={{ color: 'var(--accent2)', fontWeight: 500 }}>
              Create one free
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
