import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav style={{
      background: 'rgba(10,10,15,0.95)',
      borderBottom: '1px solid var(--border)',
      padding: '1rem 2rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      backdropFilter: 'blur(12px)',
    }}>
      <Link to="/" style={{
        fontFamily: 'monospace',
        fontWeight: 700,
        fontSize: '1.1rem',
        letterSpacing: '-0.02em',
      }}>
        Spec<span style={{ color: 'var(--accent)' }}>Watch</span>
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <span style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>
          {user?.email}
        </span>
        <span className="badge badge-blue">
          {user?.plan || 'FREE'}
        </span>
        <button
          className="btn-secondary btn-sm"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </nav>
  )
}