import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import ChangeCard from '../components/ChangeCard'
import api from '../api/axios'

export default function ProjectDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [project, setProject] = useState(null)
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  useEffect(() => {
    Promise.all([
      api.get(`/projects`),
      api.get(`/projects/${id}/history`)
    ]).then(([projectsRes, historyRes]) => {
      const projects = Array.isArray(projectsRes.data) ? projectsRes.data : projectsRes.data.content || []
      const found = projects.find(p => p.id === parseInt(id))
      setProject(found)
      setHistory(historyRes.data.content || [])
    }).catch(console.error)
      .finally(() => setLoading(false))
  }, [id])

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await api.delete(`/projects/${id}`)
      navigate('/')
    } catch (err) {
      alert('Failed to delete')
      setDeleting(false)
    }
  }

  if (loading) return <div className="loading">Loading...</div>
  if (!project) return <div className="loading">Project not found</div>

  const breakingCount = history.filter(r => r.hasBreakingChanges).length

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <button
            onClick={() => navigate('/')}
            style={{ background: 'none', border: 'none', color: 'var(--muted)', fontSize: '0.85rem', cursor: 'pointer', padding: 0, marginBottom: '0.5rem' }}
          >
            ← Back
          </button>
          <h1 className="page-title">{project.name}</h1>
          <p style={{ color: 'var(--muted)', fontSize: '0.85rem', fontFamily: 'monospace', marginTop: '0.25rem' }}>
            {project.repoFullName} / {project.branch}
          </p>
        </div>
        <button
          className="btn-secondary btn-sm"
          onClick={() => setShowDeleteModal(true)}
          style={{ color: 'var(--danger)', borderColor: 'var(--danger)' }}
        >
          Delete Project
        </button>
      </div>

      {/* Project info */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <div className="card" style={{ flex: 1, minWidth: '140px', textAlign: 'center', padding: '1rem' }}>
          <div style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--accent2)' }}>
            {history.length}
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--muted)', marginTop: '0.25rem' }}>Total Scans</div>
        </div>
        <div className="card" style={{ flex: 1, minWidth: '140px', textAlign: 'center', padding: '1rem' }}>
          <div style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--danger)' }}>
            {breakingCount}
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--muted)', marginTop: '0.25rem' }}>Breaking Changes</div>
        </div>
        <div className="card" style={{ flex: 1, minWidth: '140px', textAlign: 'center', padding: '1rem' }}>
          <div style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--success)' }}>
            {project.lastSpecVersion || 'N/A'}
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--muted)', marginTop: '0.25rem' }}>Current Version</div>
        </div>
        <div className="card" style={{ flex: 1, minWidth: '140px', textAlign: 'center', padding: '1rem' }}>
          <div style={{ fontSize: '1.4rem', fontWeight: 700, color: project.slackWebhookUrl ? 'var(--success)' : 'var(--muted)' }}>
            {project.slackWebhookUrl ? '✓' : '✗'}
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--muted)', marginTop: '0.25rem' }}>Slack Alert</div>
        </div>
      </div>

      {/* Webhook setup info */}
      <div className="card" style={{ marginBottom: '2rem', background: 'rgba(0,217,255,0.03)', borderColor: 'rgba(0,217,255,0.15)' }}>
        <p style={{ fontSize: '0.82rem', color: 'var(--accent2)', fontWeight: 600, marginBottom: '0.4rem' }}>
          GitHub Webhook URL
        </p>
        <code style={{ fontSize: '0.82rem', color: 'var(--text)', fontFamily: 'monospace', wordBreak: 'break-all' }}>
  POST https://specwatch-backend.onrender.com/api/webhook/github?token=YOUR_WEBHOOK_SECRET
</code>
        <p style={{ fontSize: '0.75rem', color: 'var(--muted)', marginTop: '0.4rem' }}>
          Add this in GitHub → Repo Settings → Webhooks. Select "push" events only.
        </p>
      </div>

      {/* Change history */}
      <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem' }}>
        Change History
      </h2>

      {history.length === 0 ? (
        <div className="empty-state">
          <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>📭</div>
          <h3>No changes recorded yet</h3>
          <p>Push a commit to your repo — SpecWatch will detect and record changes here.</p>
        </div>
      ) : (
        <div>
          {history.map(report => (
            <ChangeCard key={report.id} report={report} />
          ))}
        </div>
      )}

      {showDeleteModal && (
        <div style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.7)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 999,
        }}>
          <div className="card" style={{ maxWidth: '400px', width: '90%', textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🗑️</div>
            <h3 style={{ marginBottom: '0.5rem', fontFamily: 'monospace' }}>Delete Project?</h3>
            <p style={{ color: 'var(--muted)', fontSize: '0.88rem', marginBottom: '1.5rem' }}>
              This will permanently delete <strong>{project?.name}</strong> and all its change history. This cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button
                className="btn-secondary"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
              <button
                className="btn-primary"
                onClick={() => { setShowDeleteModal(false); handleDelete(); }}
                disabled={deleting}
                style={{ background: 'var(--danger)' }}
              >
                {deleting ? 'Deleting...' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}