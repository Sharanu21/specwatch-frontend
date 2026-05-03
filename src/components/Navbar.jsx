import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
    setMenuOpen(false)
  }

  const isActive = (path) => location.pathname === path

  const linkStyle = (path) => ({
    fontSize: '0.83rem',
    color: isActive(path) ? 'var(--text)' : 'var(--muted)',
    padding: '0.4rem 0.75rem',
    borderRadius: '6px',
    background: isActive(path) ? 'rgba(255,255,255,0.06)' : 'transparent',
    fontWeight: isActive(path) ? 600 : 400,
    cursor: 'pointer',
    textDecoration: 'none',
    transition: 'color 0.15s, background 0.15s',
    display: 'block',
    whiteSpace: 'nowrap',
  })

  return (
    <nav style={{
      background: 'rgba(10,10,15,0.97)',
      borderBottom: '1px solid var(--border)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      backdropFilter: 'blur(12px)',
    }}>
      <div style={{
        maxWidth: '1100px',
        margin: '0 auto',
        padding: '0 1.5rem',
        height: '60px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
      }}>
        {/* Logo */}
        <Link to="/dashboard" style={{
          fontFamily: 'Space Mono, monospace',
          fontWeight: 700,
          fontSize: '1rem',
          letterSpacing: '-0.02em',
          flexShrink: 0,
          color: 'var(--text)',
        }}>
          Spec<span style={{ color: 'var(--accent)' }}>Watch</span>
        </Link>

        {/* Desktop nav links */}
        <div className="nav-links" style={{ flex: 1, justifyContent: 'center' }}>
          <Link to="/dashboard" style={linkStyle('/dashboard')}>Dashboard</Link>
          <Link to="/projects/add" style={linkStyle('/projects/add')}>+ Add Project</Link>
          <Link to="/settings" style={linkStyle('/settings')}>Settings</Link>
          {user?.admin && (
            <Link to="/admin" style={{ ...linkStyle('/admin'), color: isActive('/admin') ? '#ff4d6d' : 'rgba(255,77,109,0.7)' }}>Admin</Link>
          )}
        </div>

        {/* Desktop right side */}
        <div className="nav-links" style={{ gap: '0.75rem' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--muted)', fontFamily: 'monospace', maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {user?.email}
          </span>
          <span className="badge badge-blue" style={{ flexShrink: 0 }}>
            {user?.plan || 'FREE'}
          </span>
          <button
            className="btn-secondary btn-sm"
            onClick={handleLogout}
            style={{ flexShrink: 0 }}
          >
            Sign Out
          </button>
        </div>

        {/* Mobile hamburger */}
        <button
          className="hamburger"
          onClick={() => setMenuOpen(o => !o)}
          aria-label="Toggle menu"
        >
          <span style={{ transform: menuOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none' }} />
          <span style={{ opacity: menuOpen ? 0 : 1 }} />
          <span style={{ transform: menuOpen ? 'rotate(-45deg) translate(5px, -5px)' : 'none' }} />
        </button>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="mobile-menu">
          <div style={{ fontSize: '0.75rem', color: 'var(--muted)', padding: '0.25rem 0.5rem 0.5rem', fontFamily: 'monospace' }}>
            {user?.email}
            <span className="badge badge-blue" style={{ marginLeft: '0.5rem' }}>{user?.plan || 'FREE'}</span>
          </div>
          <Link to="/dashboard" style={linkStyle('/dashboard')} onClick={() => setMenuOpen(false)}>Dashboard</Link>
          <Link to="/projects/add" style={linkStyle('/projects/add')} onClick={() => setMenuOpen(false)}>+ Add Project</Link>
          <Link to="/settings" style={linkStyle('/settings')} onClick={() => setMenuOpen(false)}>Settings</Link>
          {user?.admin && (
            <Link to="/admin" style={{ ...linkStyle('/admin'), color: '#ff4d6d' }} onClick={() => setMenuOpen(false)}>Admin</Link>
          )}
          <div style={{ height: '1px', background: 'var(--border)', margin: '0.5rem 0' }} />
          <button
            onClick={handleLogout}
            style={{
              ...linkStyle('/'),
              color: 'var(--danger)',
              textAlign: 'left',
              border: 'none',
              background: 'none',
              width: '100%',
              fontFamily: 'var(--sans)',
            }}
          >
            Sign Out
          </button>
        </div>
      )}
    </nav>
  )
}
