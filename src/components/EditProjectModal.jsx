import { useState, useEffect } from 'react'
import { useToast } from '../context/ToastContext'
import api from '../api/axios'

export default function EditProjectModal({ project, onClose, onSaved }) {
  const toast = useToast()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: '',
    repoFullName: '',
    specFilePath: '',
    branch: 'main',
    slackWebhookUrl: '',
    discordWebhookUrl: '',
    githubToken: '',
  })

  useEffect(() => {
    if (project) {
      setForm({
        name: project.name || '',
        repoFullName: project.repoFullName || '',
        specFilePath: project.specFilePath || '',
        branch: project.branch || 'main',
        slackWebhookUrl: '',
        discordWebhookUrl: '',
        githubToken: '',
      })
    }
  }, [project])

  const set = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await api.put(`/projects/${project.id}`, form)
      toast.success('Project settings saved')
      onSaved(res.data)
      onClose()
    } catch (err) {
      toast.error(err.response?.data || 'Failed to save changes')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(0,0,0,0.75)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 1000, padding: '1rem',
        backdropFilter: 'blur(4px)',
      }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: '12px',
        width: '100%',
        maxWidth: '520px',
        maxHeight: '90vh',
        overflowY: 'auto',
        padding: '1.75rem',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <div>
            <h2 style={{ fontSize: '1rem', fontWeight: 700, fontFamily: 'Space Mono, monospace' }}>
              Edit Project
            </h2>
            <p style={{ fontSize: '0.78rem', color: 'var(--muted)', marginTop: '0.2rem' }}>
              {project?.repoFullName}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none', border: 'none',
              color: 'var(--muted)', fontSize: '1.3rem',
              cursor: 'pointer', lineHeight: 1, padding: '4px',
            }}
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Project Name</label>
            <input
              type="text"
              value={form.name}
              onChange={set('name')}
              required
              autoFocus
            />
          </div>

          <div className="form-group">
            <label>OpenAPI Spec File Path</label>
            <input
              type="text"
              placeholder="docs/openapi.yaml"
              value={form.specFilePath}
              onChange={set('specFilePath')}
              required
            />
          </div>

          <div className="form-group">
            <label>Branch to Monitor</label>
            <input
              type="text"
              placeholder="main"
              value={form.branch}
              onChange={set('branch')}
            />
          </div>

          <div style={{ height: '1px', background: 'var(--border)', margin: '1rem 0' }} />

          <p style={{ fontSize: '0.8rem', color: 'var(--muted)', marginBottom: '1rem', fontWeight: 500 }}>
            Notifications <span style={{ fontWeight: 400 }}>(leave blank to keep existing)</span>
          </p>

          <div className="form-group">
            <label>Slack Webhook URL</label>
            <input
              type="url"
              placeholder={project?.slackWebhookUrl ? '●●●● (configured — paste new to update)' : 'https://hooks.slack.com/services/...'}
              value={form.slackWebhookUrl}
              onChange={set('slackWebhookUrl')}
            />
            {project?.slackWebhookUrl && (
              <span style={{ color: 'var(--success)', fontSize: '0.72rem' }}>✓ Slack is connected</span>
            )}
          </div>

          <div className="form-group">
            <label>Discord Webhook URL</label>
            <input
              type="url"
              placeholder={project?.discordWebhookUrl ? '●●●● (configured — paste new to update)' : 'https://discord.com/api/webhooks/...'}
              value={form.discordWebhookUrl}
              onChange={set('discordWebhookUrl')}
            />
            {project?.discordWebhookUrl && (
              <span style={{ color: 'var(--success)', fontSize: '0.72rem' }}>✓ Discord is connected</span>
            )}
          </div>

          <div className="form-group">
            <label>GitHub Personal Access Token <span style={{ fontWeight: 400 }}>(private repos)</span></label>
            <input
              type="password"
              placeholder={project?.hasGithubToken ? '●●●● (configured — paste new to update)' : 'ghp_xxxxxxxxxxxx'}
              value={form.githubToken}
              onChange={set('githubToken')}
            />
            {project?.hasGithubToken && (
              <span style={{ color: 'var(--success)', fontSize: '0.72rem' }}>✓ Token is set</span>
            )}
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem', justifyContent: 'flex-end' }}>
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
