export default function ChangeCard({ report }) {
  const isBreaking = report.hasBreakingChanges

  let changes = []
  try {
    changes = report.changesJson ? JSON.parse(report.changesJson) : []
  } catch (e) {
    changes = []
  }

  return (
    <div className="card" style={{
      borderLeft: `3px solid ${isBreaking ? 'var(--accent)' : 'var(--accent2)'}`,
      marginBottom: '1rem',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span className={`badge ${isBreaking ? 'badge-red' : 'badge-green'}`}>
            {isBreaking ? '🚨 BREAKING' : '✓ SAFE'}
          </span>
          {report.commitSha && (
            <span style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: 'var(--muted)' }}>
              {report.commitSha.substring(0, 7)}
            </span>
          )}
          {report.pushedBy && (
            <span style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>
              by {report.pushedBy}
            </span>
          )}
        </div>
        <span style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>
          {new Date(report.createdAt).toLocaleString()}
        </span>
      </div>

      {report.commitMessage && (
        <p style={{ fontSize: '0.82rem', color: 'var(--muted)', marginBottom: '0.75rem', fontStyle: 'italic' }}>
          "{report.commitMessage}"
        </p>
      )}

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '0.75rem' }}>
        {report.breakingCount > 0 && (
          <span style={{ fontSize: '0.82rem', color: 'var(--danger)' }}>
            ✗ {report.breakingCount} breaking
          </span>
        )}
        {report.nonBreakingCount > 0 && (
          <span style={{ fontSize: '0.82rem', color: 'var(--accent2)' }}>
            ⚠ {report.nonBreakingCount} non-breaking
          </span>
        )}
        {report.breakingCount === 0 && report.nonBreakingCount === 0 && (
          <span style={{ fontSize: '0.82rem', color: 'var(--muted)' }}>
            No changes detected
          </span>
        )}
      </div>

      {changes.length > 0 && (
        <div style={{
          background: 'rgba(0,0,0,0.2)',
          borderRadius: '6px',
          padding: '0.75rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.4rem',
        }}>
          {changes.map((change, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.82rem' }}>
              <span style={{ color: change.type === 'BREAKING' ? 'var(--danger)' : 'var(--accent2)', flexShrink: 0 }}>
                {change.type === 'BREAKING' ? '✗' : '⚠'}
              </span>
              <span style={{ fontFamily: 'monospace', color: 'var(--text)', flexShrink: 0 }}>
                {change.endpoint}
              </span>
              <span style={{ color: 'var(--muted)' }}>
                — {change.description}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}