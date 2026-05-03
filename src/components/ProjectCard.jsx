import { useNavigate } from 'react-router-dom'
import { timeAgo } from '../utils/timeAgo'

export default function ProjectCard({ project }) {
  const navigate = useNavigate()
  const scanned = !!project.lastCheckedAt
  const lastScan = timeAgo(project.lastCheckedAt)

  return (
    <div
      className="card"
      onClick={() => navigate(`/projects/${project.id}`)}
      style={{
        cursor: 'pointer',
        transition: 'border-color 0.2s, transform 0.15s',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.85rem',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = 'rgba(0,217,255,0.4)'
        e.currentTarget.style.transform = 'translateY(-1px)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'var(--border)'
        e.currentTarget.style.transform = 'translateY(0)'
      }}
    >
      {/* Top row: name + branch badge */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem' }}>
        <div style={{ minWidth: 0 }}>
          <h3 style={{
            fontSize: '0.97rem',
            fontWeight: 700,
            marginBottom: '0.2rem',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}>
            {project.name}
          </h3>
          <p style={{
            fontSize: '0.76rem',
            color: 'var(--muted)',
            fontFamily: 'Space Mono, monospace',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}>
            {project.repoFullName}
          </p>
        </div>
        <span className="badge badge-blue" style={{ flexShrink: 0 }}>
          {project.branch || 'main'}
        </span>
      </div>

      {/* Spec file path */}
      <div style={{
        fontSize: '0.76rem',
        color: 'var(--muted)',
        fontFamily: 'Space Mono, monospace',
        background: 'rgba(0,0,0,0.25)',
        borderRadius: '5px',
        padding: '0.4rem 0.65rem',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
      }}>
        📄 {project.specFilePath}
      </div>

      {/* Status + badges row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
        {/* Scan status dot */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <div style={{
            width: '7px',
            height: '7px',
            borderRadius: '50%',
            background: scanned ? 'var(--success)' : 'var(--muted)',
            flexShrink: 0,
            boxShadow: scanned ? '0 0 6px rgba(105,219,124,0.6)' : 'none',
          }} />
          <span style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>
            {scanned ? lastScan : 'Not scanned yet'}
          </span>
        </div>

        {project.lastSpecVersion && (
          <span className="badge badge-gray">v{project.lastSpecVersion}</span>
        )}
        {project.slackWebhookUrl && (
          <span className="badge badge-green" title="Slack alerts enabled">Slack</span>
        )}
        {project.discordWebhookUrl && (
          <span className="badge" style={{ background: 'rgba(88,101,242,0.15)', color: '#7289da' }} title="Discord alerts enabled">
            Discord
          </span>
        )}
      </div>
    </div>
  )
}
