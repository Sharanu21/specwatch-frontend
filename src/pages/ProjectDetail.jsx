import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useToast } from '../context/ToastContext'
import ChangeCard from '../components/ChangeCard'
import EditProjectModal from '../components/EditProjectModal'
import { SkeletonCard, SkeletonStat } from '../components/Skeleton'
import { timeAgo, formatDate } from '../utils/timeAgo'
import api from '../api/axios'

export default function ProjectDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const toast = useToast()
  const [project, setProject] = useState(null)
  const [history, setHistory] = useState([])
  const [totalScans, setTotalScans] = useState(0)
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    Promise.all([
      api.get(`/projects/${id}`),
      api.get(`/projects/${id}/history`)
    ]).then(([projectRes, historyRes]) => {
      setProject(projectRes.data || null)
      setHistory(historyRes.data.content || [])
      setTotalScans(historyRes.data.totalElements || 0)
    }).catch((err) => {
      if (err.response?.status === 404 || err.response?.status === 403) {
        setProject(null)
      } else {
        toast.error('Failed to load project')
      }
    })
      .finally(() => setLoading(false))
  }, [id])

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await api.delete(`/projects/${id}`)
      toast.success('Project deleted')
      navigate('/dashboard')
    } catch {
      toast.error('Failed to delete project')
      setDeleting(false)
    }
  }

  const handleCopyWebhook = () => {
    const url = `${window.location.origin}/api/webhook/github?token=${project?.webhookToken}`
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true)
      toast.success('Webhook URL copied!')
      setTimeout(() => setCopied(false), 2500)
    }).catch(() => toast.error('Could not copy to clipboard'))
  }

  if (loading) {
    return (
      <div className="page">
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
          <SkeletonStat /><SkeletonStat /><SkeletonStat /><SkeletonStat />
        </div>
        <SkeletonCard style={{ marginBottom: '1rem' }} />
        <SkeletonCard />
      </div>
    )
  }

  if (!project) {
    return (
      <div className="empty-state" style={{ marginTop: '4rem' }}>
        <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🔍</div>
        <h3>Project not found</h3>
        <p style={{ marginBottom: '1.5rem' }}>This project may have been deleted.</p>
        <button className="btn-primary" onClick={() => navigate('/dashboard')}>← Back to Dashboard</button>
      </div>
    )
  }

  const breakingCount = history.filter(r => r.hasBreakingChanges).length
  const lastScanAgo = timeAgo(project.lastCheckedAt)
  const lastScanFull = formatDate(project.lastCheckedAt)

  return (
    <div className="page">
      {/* Header */}
      <div className="page-header">
        <div style={{ minWidth: 0 }}>
          <button
            onClick={() => navigate('/dashboard')}
            style={{ background: 'none', border: 'none', color: 'var(--muted)', fontSize: '0.83rem', cursor: 'pointer', padding: 0, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
          >
            ← Dashboard
          </button>
          <h1 className="page-title" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {project.name}
          </h1>
          <p style={{ color: 'var(--muted)', fontSize: '0.8rem', fontFamily: 'Space Mono, monospace', marginTop: '0.3rem' }}>
            {project.repoFullName} · {project.branch}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.6rem', flexShrink: 0, flexWrap: 'wrap' }}>
          <button
            className="btn-secondary btn-sm"
            onClick={() => setShowEditModal(true)}
          >
            ✎ Edit
          </button>
          <button
            className="btn-secondary btn-sm"
            onClick={() => setShowDeleteModal(true)}
            style={{ color: 'var(--danger)', borderColor: 'rgba(255,107,107,0.35)' }}
          >
            Delete
          </button>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {[
          { value: totalScans, label: 'Total Scans', color: 'var(--accent2)' },
          { value: breakingCount, label: 'Breaking Scans', color: breakingCount > 0 ? 'var(--danger)' : 'var(--success)' },
          { value: project.lastSpecVersion ? `v${project.lastSpecVersion}` : 'N/A', label: 'Current Version', color: 'var(--success)', small: true },
          {
            value: lastScanAgo || '—',
            label: 'Last Scan',
            color: 'var(--muted)',
            small: true,
            title: lastScanFull,
          },
        ].map(s => (
          <div key={s.label} className="card" title={s.title || ''} style={{ flex: 1, minWidth: '130px', textAlign: 'center', padding: '1rem' }}>
            <div style={{ fontSize: s.small ? '1.1rem' : '1.8rem', fontWeight: 700, color: s.color, letterSpacing: '-0.02em', fontFamily: s.small ? 'Space Mono, monospace' : undefined }}>
              {s.value}
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--muted)', marginTop: '0.3rem' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Webhook setup */}
      <div className="card" style={{ marginBottom: '2rem', background: 'rgba(0,217,255,0.03)', borderColor: 'rgba(0,217,255,0.15)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.6rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <p style={{ fontSize: '0.8rem', color: 'var(--accent2)', fontWeight: 600 }}>
            GitHub Webhook URL
          </p>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {[
              { label: 'Content-Type', value: 'application/json' },
              { label: 'Events', value: 'Push only' },
            ].map(t => (
              <span key={t.label} style={{ fontSize: '0.68rem', color: 'var(--muted)', background: 'rgba(0,0,0,0.2)', borderRadius: '4px', padding: '0.15rem 0.5rem' }}>
                {t.label}: <strong style={{ color: 'var(--text)' }}>{t.value}</strong>
              </span>
            ))}
          </div>
        </div>
        <div style={{
          background: 'rgba(0,0,0,0.3)',
          borderRadius: '6px',
          padding: '0.75rem 1rem',
          fontFamily: 'Space Mono, monospace',
          fontSize: '0.76rem',
          color: 'var(--text)',
          wordBreak: 'break-all',
          marginBottom: '0.75rem',
          lineHeight: 1.7,
        }}>
          POST {window.location.origin}/api/webhook/github?token=<span style={{ color: 'var(--accent2)' }}>{project?.webhookToken || '...'}</span>
        </div>
        <button
          className="btn-secondary btn-sm"
          onClick={handleCopyWebhook}
          style={{ borderColor: copied ? 'rgba(105,219,124,0.4)' : undefined, color: copied ? 'var(--success)' : undefined }}
        >
          {copied ? '✓ Copied!' : '⧉ Copy URL'}
        </button>
      </div>

      {/* Notification status */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        {[
          { label: 'Email Alerts', active: true, icon: '✉' },
          { label: 'Slack', active: project.slackWebhookUrl, icon: '#' },
          { label: 'Discord', active: project.discordWebhookUrl, icon: '◈' },
        ].map(n => (
          <div key={n.label} style={{
            display: 'flex', alignItems: 'center', gap: '0.4rem',
            fontSize: '0.78rem', color: n.active ? 'var(--success)' : 'var(--muted)',
            background: n.active ? 'rgba(105,219,124,0.07)' : 'rgba(107,107,128,0.07)',
            border: `1px solid ${n.active ? 'rgba(105,219,124,0.2)' : 'rgba(107,107,128,0.15)'}`,
            borderRadius: '6px', padding: '0.35rem 0.75rem',
          }}>
            <span>{n.icon}</span>
            <span>{n.label}</span>
            <span>{n.active ? '✓' : '✗'}</span>
          </div>
        ))}
        <button
          onClick={() => setShowEditModal(true)}
          style={{
            fontSize: '0.72rem', color: 'var(--muted)', background: 'none',
            border: '1px dashed var(--border)', borderRadius: '6px',
            padding: '0.35rem 0.75rem', cursor: 'pointer',
          }}
          onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent2)'}
          onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
        >
          + Configure
        </button>
      </div>

      {/* Change History */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <h2 style={{ fontSize: '1rem', fontWeight: 600 }}>Change History</h2>
        {history.length > 0 && (
          <span style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>
            {totalScans} scan{totalScans !== 1 ? 's' : ''} · {breakingCount} breaking
          </span>
        )}
      </div>

      {history.length === 0 ? (
        <div className="empty-state" style={{ padding: '3rem 1rem' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>📭</div>
          <h3>No changes recorded yet</h3>
          <p style={{ marginBottom: '1.25rem', lineHeight: 1.7 }}>
            Push a commit to your repo — SpecWatch will detect and record changes here.
          </p>
          <button className="btn-secondary btn-sm" onClick={handleCopyWebhook}>
            ⧉ Copy Webhook URL
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {history.map(report => (
            <ChangeCard key={report.id} report={report} />
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <EditProjectModal
          project={project}
          onClose={() => setShowEditModal(false)}
          onSaved={(updated) => setProject(p => ({ ...p, ...updated }))}
        />
      )}

      {/* Delete modal */}
      {showDeleteModal && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999, padding: '1rem' }}
          onClick={e => { if (e.target === e.currentTarget) setShowDeleteModal(false) }}
        >
          <div className="card" style={{ maxWidth: '400px', width: '100%', textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🗑️</div>
            <h3 style={{ marginBottom: '0.5rem', fontFamily: 'Space Mono, monospace', fontSize: '1rem' }}>Delete Project?</h3>
            <p style={{ color: 'var(--muted)', fontSize: '0.85rem', marginBottom: '1.5rem', lineHeight: 1.6 }}>
              This will permanently delete <strong style={{ color: 'var(--text)' }}>{project?.name}</strong> and all its history. This cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
              <button className="btn-secondary" onClick={() => setShowDeleteModal(false)}>Cancel</button>
              <button
                className="btn-primary"
                onClick={() => { setShowDeleteModal(false); handleDelete() }}
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
