import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useToast } from '../context/ToastContext'
import api from '../api/axios'

export default function AddProject() {
  const navigate = useNavigate()
  const toast = useToast()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    name: '',
    repoFullName: '',
    specFilePath: '',
    branch: 'main',
    slackWebhookUrl: '',
    discordWebhookUrl: '',
    githubToken: '',
  })

  const set = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await api.post('/projects', form)
      toast.success('Project created! Set up your GitHub webhook below.')
      navigate(`/projects/${res.data.id}`)
    } catch (err) {
      const msg = err.response?.data || 'Failed to create project'
      setError(msg)
      toast.error(msg)
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
        <button className="btn-secondary" onClick={() => navigate('/dashboard')}>
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
                onChange={set('name')}
                required
                autoFocus
              />
            </div>

            <div className="form-group">
              <label>GitHub Repo</label>
              <input
                type="text"
                placeholder="username/repo-name"
                value={form.repoFullName}
                onChange={set('repoFullName')}
                required
              />
              <span>e.g. octocat/hello-world</span>
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
              <span>Path to your OpenAPI YAML or JSON file inside the repo</span>
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

            <div className="divider" />

            <p style={{ fontSize: '0.83rem', color: 'var(--muted)', marginBottom: '1rem', fontWeight: 500 }}>
              Notifications <span style={{ fontWeight: 400 }}>(optional)</span>
            </p>

            <div className="form-group">
              <label>Slack Webhook URL</label>
              <input
                type="url"
                placeholder="https://hooks.slack.com/services/..."
                value={form.slackWebhookUrl}
                onChange={set('slackWebhookUrl')}
              />
            </div>

            <div className="form-group">
              <label>Discord Webhook URL</label>
              <input
                type="url"
                placeholder="https://discord.com/api/webhooks/..."
                value={form.discordWebhookUrl}
                onChange={set('discordWebhookUrl')}
              />
            </div>

            <div className="form-group">
              <label>GitHub Personal Access Token <span style={{ fontWeight: 400 }}>(private repos only)</span></label>
              <input
                type="password"
                placeholder="ghp_xxxxxxxxxxxx"
                value={form.githubToken}
                onChange={set('githubToken')}
              />
              <span>GitHub → Settings → Developer Settings → Tokens. Select <code style={{ fontFamily: 'monospace', color: 'var(--accent2)' }}>repo</code> scope.</span>
            </div>

            {error && <p className="error-msg">{error}</p>}

            <button
              type="submit"
              className="btn-primary"
              style={{ width: '100%', marginTop: '0.25rem' }}
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
          <p style={{ fontSize: '0.82rem', color: 'var(--muted)', lineHeight: 1.7 }}>
            After creating your project, a unique webhook URL will appear on the project page.<br />
            GitHub → your repo → Settings → Webhooks → Add webhook → paste URL →
            content type: <code style={{ fontFamily: 'monospace', color: 'var(--accent2)' }}>application/json</code> → Save.
          </p>
        </div>
      </div>
    </div>
  )
}
