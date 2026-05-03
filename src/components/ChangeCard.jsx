import { useState } from 'react'
import { timeAgo, formatDate } from '../utils/timeAgo'

export default function ChangeCard({ report }) {
  const [expanded, setExpanded] = useState(false)
  const isBreaking = report.hasBreakingChanges
  const hasChanges = (report.breakingCount || 0) + (report.nonBreakingCount || 0) > 0

  let changes = []
  try {
    changes = report.changesJson ? JSON.parse(report.changesJson) : []
  } catch {
    changes = []
  }

  const breakingChanges = changes.filter(c => c.type === 'BREAKING')
  const nonBreakingChanges = changes.filter(c => c.type !== 'BREAKING')
  const ago = timeAgo(report.createdAt)
  const full = formatDate(report.createdAt)

  return (
    <div style={{
      background: 'var(--surface)',
      border: `1px solid ${isBreaking ? 'rgba(255,77,109,0.3)' : 'rgba(105,219,124,0.2)'}`,
      borderLeft: `3px solid ${isBreaking ? 'var(--accent)' : 'var(--accent2)'}`,
      borderRadius: '8px',
      overflow: 'hidden',
    }}>
      {/* Main row */}
      <div style={{ padding: '1rem 1.25rem' }}>
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: '0.75rem',
          marginBottom: '0.6rem',
          flexWrap: 'wrap',
        }}>
          {/* Left: badge + commit */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
            <span className={`badge ${isBreaking ? 'badge-red' : 'badge-green'}`}>
              {isBreaking ? '⚡ BREAKING' : '✓ SAFE'}
            </span>
            {report.commitSha && (
              <code style={{
                fontSize: '0.73rem',
                color: 'var(--accent2)',
                background: 'rgba(0,217,255,0.07)',
                padding: '0.15rem 0.45rem',
                borderRadius: '4px',
                fontFamily: 'Space Mono, monospace',
              }}>
                {report.commitSha.substring(0, 7)}
              </code>
            )}
            {report.pushedBy && (
              <span style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>
                by <strong style={{ color: 'var(--text)' }}>{report.pushedBy}</strong>
              </span>
            )}
          </div>

          {/* Right: version diff + time */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
            {(report.oldVersion || report.newVersion) && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.73rem' }}>
                {report.oldVersion && (
                  <span style={{ color: 'var(--muted)', textDecoration: report.newVersion ? 'line-through' : 'none' }}>
                    v{report.oldVersion}
                  </span>
                )}
                {report.oldVersion && report.newVersion && (
                  <span style={{ color: 'var(--muted)' }}>→</span>
                )}
                {report.newVersion && (
                  <span style={{ color: 'var(--success)', fontWeight: 600 }}>v{report.newVersion}</span>
                )}
              </div>
            )}
            <span
              style={{ fontSize: '0.73rem', color: 'var(--muted)', cursor: 'default' }}
              title={full}
            >
              {ago || full}
            </span>
          </div>
        </div>

        {/* Commit message */}
        {report.commitMessage && (
          <p style={{
            fontSize: '0.82rem',
            color: 'var(--muted)',
            marginBottom: '0.6rem',
            fontStyle: 'italic',
            lineHeight: 1.5,
          }}>
            "{report.commitMessage.length > 120
              ? report.commitMessage.substring(0, 120) + '…'
              : report.commitMessage}"
          </p>
        )}

        {/* Summary counts */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          {report.breakingCount > 0 && (
            <span style={{ fontSize: '0.8rem', color: 'var(--danger)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <span>✗</span>
              <span>{report.breakingCount} breaking {report.breakingCount === 1 ? 'change' : 'changes'}</span>
            </span>
          )}
          {report.nonBreakingCount > 0 && (
            <span style={{ fontSize: '0.8rem', color: 'var(--accent2)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <span>△</span>
              <span>{report.nonBreakingCount} non-breaking</span>
            </span>
          )}
          {!hasChanges && (
            <span style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>No spec changes detected</span>
          )}

          {/* Expand/collapse toggle */}
          {changes.length > 0 && (
            <button
              onClick={e => { e.stopPropagation(); setExpanded(x => !x) }}
              style={{
                background: 'none',
                border: '1px solid var(--border)',
                borderRadius: '4px',
                color: 'var(--muted)',
                fontSize: '0.72rem',
                padding: '0.2rem 0.6rem',
                cursor: 'pointer',
                marginLeft: 'auto',
                transition: 'color 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--text)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--muted)'}
            >
              {expanded ? '▲ Hide' : `▼ Show ${changes.length} change${changes.length !== 1 ? 's' : ''}`}
            </button>
          )}
        </div>
      </div>

      {/* Expandable change list */}
      {expanded && changes.length > 0 && (
        <div style={{
          borderTop: '1px solid var(--border)',
          padding: '0.85rem 1.25rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
          background: 'rgba(0,0,0,0.15)',
        }}>
          {breakingChanges.length > 0 && (
            <div style={{ marginBottom: nonBreakingChanges.length > 0 ? '0.75rem' : 0 }}>
              <p style={{ fontSize: '0.7rem', color: 'var(--danger)', fontWeight: 700, marginBottom: '0.4rem', letterSpacing: '0.05em' }}>
                BREAKING
              </p>
              {breakingChanges.map((change, i) => (
                <ChangeItem key={i} change={change} type="breaking" />
              ))}
            </div>
          )}
          {nonBreakingChanges.length > 0 && (
            <div>
              <p style={{ fontSize: '0.7rem', color: 'var(--accent2)', fontWeight: 700, marginBottom: '0.4rem', letterSpacing: '0.05em' }}>
                NON-BREAKING
              </p>
              {nonBreakingChanges.map((change, i) => (
                <ChangeItem key={i} change={change} type="safe" />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function ChangeItem({ change, type }) {
  const isBreaking = type === 'breaking'
  return (
    <div style={{
      display: 'flex',
      alignItems: 'flex-start',
      gap: '0.6rem',
      fontSize: '0.8rem',
      padding: '0.3rem 0',
      borderBottom: '1px solid rgba(255,255,255,0.04)',
    }}>
      <span style={{
        color: isBreaking ? 'var(--danger)' : 'var(--accent2)',
        flexShrink: 0,
        fontWeight: 700,
        marginTop: '1px',
      }}>
        {isBreaking ? '✗' : '△'}
      </span>
      {change.endpoint && (
        <code style={{
          fontFamily: 'Space Mono, monospace',
          fontSize: '0.75rem',
          color: 'var(--text)',
          flexShrink: 0,
          background: 'rgba(255,255,255,0.04)',
          padding: '0.1rem 0.35rem',
          borderRadius: '3px',
        }}>
          {change.endpoint}
        </code>
      )}
      <span style={{ color: 'var(--muted)', lineHeight: 1.5 }}>
        {change.description}
      </span>
    </div>
  )
}
