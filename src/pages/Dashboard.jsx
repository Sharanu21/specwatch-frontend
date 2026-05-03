import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import ProjectCard from '../components/ProjectCard'
import { SkeletonCard, SkeletonStat } from '../components/Skeleton'
import api from '../api/axios'

export default function Dashboard() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const navigate = useNavigate()
  const toast = useToast()

  const planLimit = user?.plan === 'FREE' ? 1 : user?.plan === 'TEAM' ? 10 : Infinity
  const atLimit = projects.length >= planLimit

  useEffect(() => {
    api.get('/projects')
      .then(res => setProjects(Array.isArray(res.data) ? res.data : res.data.content || []))
      .catch(() => toast.error('Failed to load projects'))
      .finally(() => setLoading(false))
  }, [])

  const handleAddProject = () => {
    if (atLimit) {
      toast.warning(`Your ${user?.plan || 'FREE'} plan allows up to ${planLimit} repo${planLimit !== 1 ? 's' : ''}. Upgrade to add more.`)
      return
    }
    navigate('/projects/add')
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Your Projects</h1>
          <p style={{ color: 'var(--muted)', fontSize: '0.88rem', marginTop: '0.25rem' }}>
            {loading ? 'Loading...' : `${projects.length} repo${projects.length !== 1 ? 's' : ''} monitored`}
          </p>
        </div>
        <button
          className="btn-primary"
          onClick={handleAddProject}
          style={{ opacity: atLimit ? 0.6 : 1 }}
        >
          + Add Project
        </button>
      </div>

      {/* Stats bar */}
      {loading ? (
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
          <SkeletonStat />
          <SkeletonStat />
          <SkeletonStat />
        </div>
      ) : projects.length > 0 && (
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
          <div className="card" style={{ flex: 1, minWidth: '140px', textAlign: 'center', padding: '1rem' }}>
            <div style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--accent2)' }}>
              {projects.length}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--muted)', marginTop: '0.25rem' }}>
              Repos Monitored
            </div>
          </div>
          <div className="card" style={{ flex: 1, minWidth: '140px', textAlign: 'center', padding: '1rem' }}>
            <div style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--success)', letterSpacing: '-0.02em' }}>
              {user?.plan || 'FREE'}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--muted)', marginTop: '0.25rem' }}>
              Current Plan
            </div>
          </div>
          <div className="card" style={{ flex: 1, minWidth: '140px', textAlign: 'center', padding: '1rem' }}>
            <div style={{ fontSize: '1.8rem', fontWeight: 700, color: atLimit ? 'var(--danger)' : 'var(--warning)' }}>
              {projects.length}/{planLimit === Infinity ? '∞' : planLimit}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--muted)', marginTop: '0.25rem' }}>
              Repo Usage
            </div>
          </div>
        </div>
      )}

      {/* Plan limit banner */}
      {!loading && atLimit && (
        <div style={{
          background: 'rgba(255,77,109,0.08)',
          border: '1px solid rgba(255,77,109,0.25)',
          borderRadius: '8px',
          padding: '0.9rem 1.2rem',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.75rem',
        }}>
          <p style={{ fontSize: '0.85rem', color: 'var(--accent)', fontWeight: 500 }}>
            You've reached your {user?.plan || 'FREE'} plan limit of {planLimit} repo{planLimit !== 1 ? 's' : ''}.
          </p>
          <button
            className="btn-primary btn-sm"
            onClick={() => navigate('/settings')}
          >
            View Plans →
          </button>
        </div>
      )}

      {/* Loading skeletons */}
      {loading && (
        <div className="grid-2">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      )}

      {!loading && projects.length === 0 && (
        <div className="empty-state">
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
          <h3>No projects yet</h3>
          <p style={{ marginBottom: '1.5rem', maxWidth: '340px', margin: '0 auto 1.5rem', lineHeight: 1.7 }}>
            Connect your first GitHub repo to start monitoring API changes automatically.
          </p>
          <button
            className="btn-primary"
            onClick={() => navigate('/projects/add')}
          >
            + Add Your First Project
          </button>
        </div>
      )}

      {!loading && projects.length > 0 && (
        <div className="grid-2">
          {projects.map(project => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  )
}
