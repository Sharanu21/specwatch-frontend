import { useEffect, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import api from '../api/axios'

export default function OAuthCallback() {
  const [searchParams] = useSearchParams()
  const { login } = useAuth()
  const navigate = useNavigate()
  const toast = useToast()
  const handled = useRef(false)

  useEffect(() => {
    if (handled.current) return
    handled.current = true

    const token = searchParams.get('token')
    if (!token) {
      toast.error('OAuth login failed. Please try again.')
      navigate('/login')
      return
    }

    api.get('/auth/me', {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => {
     login({ email: res.data.email, name: res.data.name, plan: res.data.plan, isAdmin: res.data.isAdmin }, token)
      navigate('/dashboard')
    }).catch(() => {
      toast.error('OAuth login failed. Please try again.')
      navigate('/login')
    })
  }, [])

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      gap: '1rem',
    }}>
      <div style={{
        width: 36,
        height: 36,
        border: '3px solid var(--border)',
        borderTopColor: 'var(--accent)',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
      }} />
      <p style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>Completing sign-in…</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
