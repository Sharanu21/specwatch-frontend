import { useNavigate } from 'react-router-dom'

export default function ProjectCard({ project }) {
  const navigate = useNavigate()

  return (
    <div
      className="card"
      onClick={() => navigate(`/projects/${project.id}`)}
      style={{ cursor: 'pointer', transition: 'border-color 0.2s', }}
      onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent2)'}
      onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <div>
          <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.25rem' }}>
            {project.name}
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--muted)', fontFamily: 'monospace' }}>
            {project.repoFullName}
          </p>
        </div>
        <span className="badge badge-blue">
          {project.branch || 'main'}
        </span>
      </div>

      <div style={{ fontSize: '0.8rem', color: 'var(--muted)', marginBottom: '1rem' }}>
        <span style={{ fontFamily: 'monospace' }}>{project.specFilePath}</span>
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
        {project.slackWebhookUrl && (
          <span className="badge badge-green">Slack ✓</span>
        )}
        {project.discordWebhookUrl && (
          <span className="badge badge-blue">Discord ✓</span>
        )}
        {project.lastSpecVersion && (
          <span className="badge badge-gray">v{project.lastSpecVersion}</span>
        )}
        {!project.lastSpecContent && (
          <span className="badge badge-gray">No spec yet</span>
        )}
      </div>

      {project.lastCheckedAt && (
        <p style={{ fontSize: '0.75rem', color: 'var(--muted)', marginTop: '1rem' }}>
          Last checked: {new Date(project.lastCheckedAt).toLocaleString()}
        </p>
      )}
    </div>
  )
}