import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'

export default function AddProject() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    name: '',
    repoFullName: '',
    specFilePath: '',
    branch: 'main',
    slackWebhookUrl: '',
    discordWebhookUrl: '',
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await api.post('/projects', form)
      navigate('/')
    } catch (err) {
      setError(err.response?.data || 'Failed to create project')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Add Project</h1>
          <p style={{ color: 'var(--muted)', fontSize: '0.88rem', marginTop: '0.25rem' }}>
            Connect a GitHub repo to monitor API changes
          </p>
        </div>
        <button className="btn-secondary" onClick={() => navigate('/')}>
          Cancel
        </button>
      </div>

      <div style={{ maxWidth: '600px' }}>
        <div className="card">
          <form onSubmit={handleSubmit}>

            <div className="form-group">
              <label>Project Name</label>
              <input
                type="text"
                placeholder="My API"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>GitHub Repo</label>
              <input
                type="text"
                placeholder="username/repo-name"
                value={form.repoFullName}
                onChange={e => setForm({ ...form, repoFullName: e.target.value })}
                required
              />
              <span style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>
                e.g. octocat/hello-world
              </span>
            </div>

            <div className="form-group">
              <label>OpenAPI Spec File Path</label>
              <input
                type="text"
                placeholder="docs/openapi.yaml"
                value={form.specFilePath}
                onChange={e => setForm({ ...form, specFilePath: e.target.value })}
                required
              />
              <span style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>
                Path to your swagger/openapi YAML or JSON file inside the repo
              </span>
            </div>

            <div className="form-group">
              <label>Branch to Monitor</label>
              <input
                type="text"
                placeholder="main"
                value={form.branch}
                onChange={e => setForm({ ...form, branch: e.target.value })}
              />
            </div>

            <div className="divider" />

            <p style={{ fontSize: '0.85rem', color: 'var(--muted)', marginBottom: '1rem' }}>
              Notifications (optional — add at least one)
            </p>

            <div className="form-group">
              <label>Slack Webhook URL</label>
              <input
                type="url"
                placeholder="https://hooks.slack.com/services/..."
                value={form.slackWebhookUrl}
                onChange={e => setForm({ ...form, slackWebhookUrl: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Discord Webhook URL</label>
              <input
                type="url"
                placeholder="https://discord.com/api/webhooks/..."
                value={form.discordWebhookUrl}
                onChange={e => setForm({ ...form, discordWebhookUrl: e.target.value })}
              />
            </div>

            {error && <p className="error-msg">{error}</p>}

            <button
              type="submit"
              className="btn-primary"
              style={{ width: '100%', marginTop: '0.5rem' }}
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Project →'}
            </button>
          </form>
        </div>

        <div className="card" style={{ marginTop: '1rem', background: 'rgba(0,217,255,0.04)', borderColor: 'rgba(0,217,255,0.2)' }}>
          <p style={{ fontSize: '0.82rem', color: 'var(--accent2)', fontWeight: 600, marginBottom: '0.5rem' }}>
            ℹ Next step after creating
          </p>
          <p style={{ fontSize: '0.82rem', color: 'var(--muted)', lineHeight: 1.6 }}>
            Go to your GitHub repo → Settings → Webhooks → Add webhook.<br />
            Set Payload URL to: <code style={{ fontFamily: 'monospace', color: 'var(--text)' }}>https://your-domain.com/api/webhook/github</code><br />
            Content type: <code style={{ fontFamily: 'monospace' }}>application/json</code> → Save.
          </p>
        </div>
      </div>
    </div>
  )
}