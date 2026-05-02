import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const validatePassword = (password) => {
    if (password.length < 8) return 'Password must be at least 8 characters'
    if (!/[A-Z]/.test(password)) return 'Password must contain at least one uppercase letter'
    if (!/[0-9]/.test(password)) return 'Password must contain at least one number'
    if (!/[!@#$%^&*]/.test(password)) return 'Password must contain at least one special character (!@#$%^&*)'
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const passwordError = validatePassword(form.password)
    if (passwordError) {
      setError(passwordError)
      setLoading(false)
      return
    }
    try {
      const res = await api.post('/auth/register', form)
      login({
        email: res.data.email,
        name: res.data.name,
        plan: res.data.plan,
      }, res.data.token)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data || 'Registration failed')
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
      padding: '2rem',
    }}>
      <div style={{ width: '100%', maxWidth: '400px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            fontFamily: 'monospace',
            fontSize: '1.5rem',
            fontWeight: 700,
            marginBottom: '0.5rem',
          }}>
            Spec<span style={{ color: 'var(--accent)' }}>Watch</span>
          </div>
          <p style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>
            Create your free account
          </p>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                placeholder="Enter your name"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                required
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
              />
              {form.password && (
                <div style={{ marginTop: '0.4rem' }}>
                  {[
                    { check: form.password.length >= 8, label: '8+ characters' },
                    { check: /[A-Z]/.test(form.password), label: 'Uppercase letter' },
                    { check: /[0-9]/.test(form.password), label: 'Number' },
                    { check: /[!@#$%^&*]/.test(form.password), label: 'Special character' },
                  ].map(item => (
                    <div key={item.label} style={{
                      fontSize: '0.75rem',
                      color: item.check ? 'var(--success)' : 'var(--muted)',
                      display: 'flex', alignItems: 'center', gap: '0.3rem',
                    }}>
                      {item.check ? '✓' : '○'} {item.label}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {error && <p className="error-msg">{error}</p>}

            <button
              type="submit"
              className="btn-primary"
              style={{ width: '100%', marginTop: '0.5rem' }}
              disabled={loading}
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <div className="divider" />

          <p style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--muted)' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--accent2)' }}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}