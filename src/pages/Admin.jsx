import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import api from '../api/axios'

function StatCard({ label, value, sub, color }) {
  return (
    <div className="card" style={{ flex: 1, minWidth: '160px', padding: '1.25rem 1.5rem' }}>
      <p style={{ fontSize: '0.75rem', color: 'var(--muted)', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</p>
      <p style={{ fontSize: '2rem', fontWeight: 700, color: color || 'var(--text)', lineHeight: 1, marginBottom: '0.3rem' }}>{value ?? '—'}</p>
      {sub && <p style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>{sub}</p>}
    </div>
  )
}

function Badge({ text, color }) {
  const colors = {
    green: { bg: 'rgba(0,217,100,0.12)', text: '#00d964' },
    red:   { bg: 'rgba(255,77,109,0.12)', text: '#ff4d6d' },
    blue:  { bg: 'rgba(0,217,255,0.12)', text: '#00d9ff' },
    gray:  { bg: 'rgba(255,255,255,0.06)', text: 'var(--muted)' },
  }
  const c = colors[color] || colors.gray
  return (
    <span style={{ background: c.bg, color: c.text, padding: '0.15rem 0.5rem', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 600 }}>
      {text}
    </span>
  )
}

export default function Admin() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const toast = useToast()

  const [stats, setStats]     = useState(null)
  const [users, setUsers]     = useState([])
  const [projects, setProjects] = useState([])
  const [tab, setTab]         = useState('users')
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(null)
  const [search, setSearch]   = useState('')

  useEffect(() => {
    if (!user?.admin) { navigate('/dashboard'); return }
    loadAll()
  }, [])

  async function loadAll() {
    setLoading(true)
    try {
      const [s, u, p] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/users'),
        api.get('/admin/projects'),
      ])
      setStats(s.data)
      setUsers(u.data)
      setProjects(p.data)
    } catch {
      toast.error('Failed to load admin data')
      navigate('/dashboard')
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id, email) {
    if (!window.confirm(`Delete user "${email}" and all their projects? This cannot be undone.`)) return
    setDeleting(id)
    try {
      await api.delete(`/admin/users/${id}`)
      toast.success(`Deleted ${email}`)
      setUsers(u => u.filter(x => x.id !== id))
      setStats(s => s ? { ...s, totalUsers: s.totalUsers - 1 } : s)
    } catch {
      toast.error('Failed to delete user')
    } finally {
      setDeleting(null)
    }
  }

  const filteredUsers = users.filter(u =>
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    (u.name || '').toLowerCase().includes(search.toLowerCase())
  )

  const filteredProjects = projects.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.ownerEmail.toLowerCase().includes(search.toLowerCase()) ||
    p.repoFullName.toLowerCase().includes(search.toLowerCase())
  )

  const tabStyle = (t) => ({
    padding: '0.45rem 1rem',
    borderRadius: '6px',
    fontSize: '0.83rem',
    fontWeight: tab === t ? 600 : 400,
    color: tab === t ? 'var(--text)' : 'var(--muted)',
    background: tab === t ? 'rgba(255,255,255,0.07)' : 'transparent',
    border: 'none',
    cursor: 'pointer',
  })

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '5rem', color: 'var(--muted)' }}>
      Loading admin data…
    </div>
  )

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <h1 style={{ fontSize: '1.4rem', fontWeight: 700, margin: 0 }}>Admin Panel</h1>
        <Badge text="ADMIN" color="red" />
        <button onClick={loadAll} style={{ marginLeft: 'auto', background: 'none', border: '1px solid var(--border)', color: 'var(--muted)', borderRadius: '6px', padding: '0.35rem 0.75rem', fontSize: '0.78rem', cursor: 'pointer' }}>
          Refresh
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
        <StatCard label="Total Users"    value={stats?.totalUsers}    sub="all time"      color="var(--accent2)" />
        <StatCard label="Total Projects" value={stats?.totalProjects} sub="all time"      color="var(--accent)" />
        <StatCard label="New Users"      value={stats?.newUsersThisWeek}    sub="last 7 days" color="#a78bfa" />
        <StatCard label="New Projects"   value={stats?.newProjectsThisWeek} sub="last 7 days" color="#34d399" />
      </div>

      {/* Tabs + Search */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        <button style={tabStyle('users')}    onClick={() => { setTab('users');    setSearch('') }}>Users ({users.length})</button>
        <button style={tabStyle('projects')} onClick={() => { setTab('projects'); setSearch('') }}>Projects ({projects.length})</button>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder={tab === 'users' ? 'Search users…' : 'Search projects…'}
          style={{ marginLeft: 'auto', padding: '0.4rem 0.75rem', borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--card-bg)', color: 'var(--text)', fontSize: '0.83rem', width: '220px' }}
        />
      </div>

      {/* Users Table */}
      {tab === 'users' && (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.83rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)', textAlign: 'left' }}>
                  {['ID', 'Name', 'Email', 'Plan', 'Provider', 'Verified', 'Projects', 'Joined', ''].map(h => (
                    <th key={h} style={{ padding: '0.75rem 1rem', color: 'var(--muted)', fontWeight: 500, whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 && (
                  <tr><td colSpan={9} style={{ padding: '2rem', textAlign: 'center', color: 'var(--muted)' }}>No users found</td></tr>
                )}
                {filteredUsers.map(u => (
                  <tr key={u.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <td style={{ padding: '0.65rem 1rem', color: 'var(--muted)', fontFamily: 'monospace' }}>{u.id}</td>
                    <td style={{ padding: '0.65rem 1rem', fontWeight: 500, whiteSpace: 'nowrap' }}>{u.name || '—'}</td>
                    <td style={{ padding: '0.65rem 1rem', fontFamily: 'monospace', fontSize: '0.78rem' }}>{u.email}</td>
                    <td style={{ padding: '0.65rem 1rem' }}>
                      <Badge text={u.plan} color={u.plan === 'FREE' ? 'gray' : u.plan === 'PRO' ? 'blue' : 'green'} />
                    </td>
                    <td style={{ padding: '0.65rem 1rem' }}>
                      <Badge text={u.provider || 'LOCAL'} color={u.provider === 'GITHUB' ? 'gray' : 'gray'} />
                    </td>
                    <td style={{ padding: '0.65rem 1rem' }}>
                      {u.emailVerified
                        ? <Badge text="Yes" color="green" />
                        : <Badge text="No"  color="red" />}
                    </td>
                    <td style={{ padding: '0.65rem 1rem', textAlign: 'center' }}>{u.projectCount}</td>
                    <td style={{ padding: '0.65rem 1rem', color: 'var(--muted)', fontSize: '0.75rem', whiteSpace: 'nowrap' }}>{u.createdAt}</td>
                    <td style={{ padding: '0.65rem 1rem' }}>
                      {u.email !== user?.email && (
                        <button
                          onClick={() => handleDelete(u.id, u.email)}
                          disabled={deleting === u.id}
                          style={{ background: 'rgba(255,77,109,0.1)', color: '#ff4d6d', border: '1px solid rgba(255,77,109,0.2)', borderRadius: '5px', padding: '0.25rem 0.6rem', fontSize: '0.72rem', cursor: 'pointer' }}
                        >
                          {deleting === u.id ? '…' : 'Delete'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Projects Table */}
      {tab === 'projects' && (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.83rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)', textAlign: 'left' }}>
                  {['ID', 'Project', 'Owner', 'Repo / Branch', 'Created', 'Last Check'].map(h => (
                    <th key={h} style={{ padding: '0.75rem 1rem', color: 'var(--muted)', fontWeight: 500, whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredProjects.length === 0 && (
                  <tr><td colSpan={6} style={{ padding: '2rem', textAlign: 'center', color: 'var(--muted)' }}>No projects found</td></tr>
                )}
                {filteredProjects.map(p => (
                  <tr key={p.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <td style={{ padding: '0.65rem 1rem', color: 'var(--muted)', fontFamily: 'monospace' }}>{p.id}</td>
                    <td style={{ padding: '0.65rem 1rem', fontWeight: 500 }}>{p.name}</td>
                    <td style={{ padding: '0.65rem 1rem', fontFamily: 'monospace', fontSize: '0.78rem', color: 'var(--muted)' }}>{p.ownerEmail}</td>
                    <td style={{ padding: '0.65rem 1rem', fontFamily: 'monospace', fontSize: '0.75rem' }}>
                      {p.repoFullName}<span style={{ color: 'var(--muted)' }}>@{p.branch}</span>
                    </td>
                    <td style={{ padding: '0.65rem 1rem', color: 'var(--muted)', fontSize: '0.75rem', whiteSpace: 'nowrap' }}>{p.createdAt}</td>
                    <td style={{ padding: '0.65rem 1rem', color: 'var(--muted)', fontSize: '0.75rem', whiteSpace: 'nowrap' }}>{p.lastCheckedAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
