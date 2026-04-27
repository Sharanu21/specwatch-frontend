import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import ProjectCard from '../components/ProjectCard'
import api from '../api/axios'

export default function Dashboard() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    api.get('/projects')
      .then(res => setProjects(Array.isArray(res.data) ? res.data : res.data.content || []))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Your Projects</h1>
          <p style={{ color: 'var(--muted)', fontSize: '0.88rem', marginTop: '0.25rem' }}>
            {projects.length} repo{projects.length !== 1 ? 's' : ''} monitored
          </p>
        </div>
        <button
          className="btn-primary"
          onClick={() => navigate('/projects/add')}
        >
          + Add Project
        </button>
      </div>

      {/* Stats bar */}
      {projects.length > 0 && (
        <div style={{
          display: 'flex',
          gap: '1rem',
          marginBottom: '2rem',
          flexWrap: 'wrap',
        }}>
          <div className="card" style={{ flex: 1, minWidth: '150px', textAlign: 'center', padding: '1rem' }}>
            <div style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--accent2)' }}>
              {projects.length}
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--muted)', marginTop: '0.25rem' }}>
              Repos Monitored
            </div>
          </div>
          <div className="card" style={{ flex: 1, minWidth: '150px', textAlign: 'center', padding: '1rem' }}>
            <div style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--success)' }}>
              {user?.plan || 'FREE'}
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--muted)', marginTop: '0.25rem' }}>
              Current Plan
            </div>
          </div>
          <div className="card" style={{ flex: 1, minWidth: '150px', textAlign: 'center', padding: '1rem' }}>
            <div style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--warning)' }}>
              {user?.plan === 'FREE' ? 1 : user?.plan === 'TEAM' ? 10 : '∞'}
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--muted)', marginTop: '0.25rem' }}>
              Repo Limit
            </div>
          </div>
        </div>
      )}

      {loading && <div className="loading">Loading projects...</div>}

      {!loading && projects.length === 0 && (
        <div className="empty-state">
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
          <h3>No projects yet</h3>
          <p style={{ marginBottom: '1.5rem' }}>
            Connect your first GitHub repo to start monitoring API changes
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