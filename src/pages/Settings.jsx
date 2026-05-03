import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import api from '../api/axios'

const PLAN_LIMITS = {
  FREE: { repos: 1, label: 'Starter', price: 'Free', color: 'var(--muted)' },
  TEAM: { repos: 10, label: 'Team', price: '$19/mo', color: 'var(--accent2)' },
  PRO:  { repos: 999, label: 'Pro', price: '$49/mo', color: 'var(--success)' },
}

// ─── Email preview ────────────────────────────────────────────────────────────
const PREVIEW_VARIANTS = {
  breaking: {
    label: '🚨 Breaking Changes',
    report: {
      hasBreakingChanges: true,
      breakingCount: 2,
      nonBreakingCount: 1,
      commitSha: 'a1b2c3d',
      pushedBy: 'alice',
      commitMessage: 'refactor: update user API endpoints',
      changes: [
        { type: 'BREAKING', endpoint: 'DELETE /users/{id}',      description: 'Endpoint removed' },
        { type: 'BREAKING', endpoint: 'GET /users',              description: 'Response field "role" removed' },
        { type: 'SAFE',     endpoint: 'POST /users',             description: 'Optional field "avatar" added' },
      ],
    },
  },
  safe: {
    label: '✓ No Breaking Changes',
    report: {
      hasBreakingChanges: false,
      breakingCount: 0,
      nonBreakingCount: 2,
      commitSha: 'f4e5d6c',
      pushedBy: 'bob',
      commitMessage: 'feat: add optional avatar field to user',
      changes: [
        { type: 'SAFE', endpoint: 'POST /users',  description: 'Optional field "avatar" added' },
        { type: 'SAFE', endpoint: 'GET /profile', description: 'New optional query parameter "fields"' },
      ],
    },
  },
}

function EmailPreview({ variant }) {
  const v = PREVIEW_VARIANTS[variant]
  const r = v.report
  const isBreaking = r.hasBreakingChanges
  const accentColor = isBreaking ? '#ff4d6d' : '#69db7c'
  const bgBadge = isBreaking ? 'rgba(255,77,109,0.15)' : 'rgba(105,219,124,0.15)'

  return (
    <div style={{
      background: '#0a0a0f',
      border: '1px solid #1e1e2e',
      borderRadius: '10px',
      padding: '28px 32px',
      fontFamily: 'DM Sans, sans-serif',
      maxWidth: '520px',
      margin: '0 auto',
    }}>
      {/* Logo */}
      <div style={{ fontFamily: 'Space Mono, monospace', fontSize: '18px', fontWeight: 700, marginBottom: '20px', color: '#e8e8f0' }}>
        Spec<span style={{ color: '#ff4d6d' }}>Watch</span>
      </div>

      {/* Subject line */}
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: '8px',
        background: bgBadge, borderRadius: '6px',
        padding: '6px 12px', marginBottom: '16px',
      }}>
        <span style={{ fontSize: '13px', fontWeight: 700, color: accentColor }}>
          {isBreaking ? '🚨 Breaking Changes Detected' : '✓ API Change Detected — No Breaking Changes'}
        </span>
      </div>

      <h2 style={{ fontSize: '15px', fontWeight: 600, color: '#e8e8f0', marginBottom: '8px' }}>
        {isBreaking
          ? `${r.breakingCount} breaking change${r.breakingCount !== 1 ? 's' : ''} in your API`
          : 'Your API was updated safely'}
      </h2>

      <p style={{ fontSize: '13px', color: '#6b6b80', lineHeight: 1.6, marginBottom: '20px' }}>
        A push by <strong style={{ color: '#e8e8f0' }}>{r.pushedBy}</strong> to{' '}
        <code style={{ fontFamily: 'monospace', background: 'rgba(0,217,255,0.08)', color: '#00d9ff', padding: '1px 6px', borderRadius: '4px' }}>
          {r.commitSha}
        </code>{' '}
        triggered a spec comparison.
      </p>

      {/* Commit message */}
      <div style={{
        background: 'rgba(255,255,255,0.03)', border: '1px solid #1e1e2e',
        borderRadius: '6px', padding: '10px 14px', marginBottom: '20px',
      }}>
        <p style={{ fontSize: '12px', color: '#6b6b80', marginBottom: '2px' }}>Commit message</p>
        <p style={{ fontSize: '13px', color: '#e8e8f0', fontStyle: 'italic' }}>"{r.commitMessage}"</p>
      </div>

      {/* Changes */}
      <div style={{ marginBottom: '24px' }}>
        <p style={{ fontSize: '11px', fontWeight: 700, color: '#6b6b80', letterSpacing: '0.08em', marginBottom: '10px' }}>
          CHANGES DETECTED
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {r.changes.map((c, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'flex-start', gap: '8px',
              background: 'rgba(255,255,255,0.02)', borderRadius: '6px',
              padding: '8px 10px',
              borderLeft: `2px solid ${c.type === 'BREAKING' ? '#ff4d6d' : '#00d9ff'}`,
            }}>
              <span style={{ color: c.type === 'BREAKING' ? '#ff4d6d' : '#00d9ff', fontWeight: 700, fontSize: '12px', flexShrink: 0 }}>
                {c.type === 'BREAKING' ? '✗' : '△'}
              </span>
              <code style={{ fontFamily: 'monospace', fontSize: '11px', color: '#e8e8f0', flexShrink: 0 }}>
                {c.endpoint}
              </code>
              <span style={{ fontSize: '12px', color: '#6b6b80' }}>— {c.description}</span>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <a href="#" style={{
        display: 'inline-block',
        background: accentColor, color: '#0a0a0f',
        padding: '10px 20px', borderRadius: '6px',
        textDecoration: 'none', fontWeight: 700,
        fontSize: '13px', marginBottom: '24px',
      }}>
        View Full Report →
      </a>

      <div style={{ height: '1px', background: '#1e1e2e', marginBottom: '16px' }} />

      <p style={{ fontSize: '11px', color: '#6b6b80', lineHeight: 1.6 }}>
        You're receiving this because you monitor this repo on SpecWatch.<br />
        Manage your notifications in your <a href="#" style={{ color: '#00d9ff', textDecoration: 'none' }}>account settings</a>.
      </p>
    </div>
  )
}

// ─── Main Settings page ───────────────────────────────────────────────────────
export default function Settings() {
  const { user, logout } = useAuth()
  const toast = useToast()

  const [passwordForm, setPasswordForm] = useState({ current: '', next: '', confirm: '' })
  const [pwLoading, setPwLoading] = useState(false)
  const [emailVariant, setEmailVariant] = useState('breaking')

  const plan = user?.plan || 'FREE'
  const planInfo = PLAN_LIMITS[plan] || PLAN_LIMITS.FREE

  const handlePasswordChange = async (e) => {
    e.preventDefault()
    if (passwordForm.next !== passwordForm.confirm) {
      toast.error('New passwords do not match')
      return
    }
    if (passwordForm.next.length < 8) {
      toast.error('New password must be at least 8 characters')
      return
    }
    setPwLoading(true)
    try {
      await api.post('/auth/change-password', {
        currentPassword: passwordForm.current,
        newPassword: passwordForm.next,
      })
      toast.success('Password updated successfully')
      setPasswordForm({ current: '', next: '', confirm: '' })
    } catch (err) {
      toast.error(err.response?.data || 'Failed to update password')
    } finally {
      setPwLoading(false)
    }
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Settings</h1>
          <p style={{ color: 'var(--muted)', fontSize: '0.88rem', marginTop: '0.25rem' }}>
            Manage your account, subscription, and notifications
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gap: '1.5rem', maxWidth: '680px' }}>

        {/* Account Info */}
        <div className="card">
          <h2 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '1.2rem', fontFamily: 'Space Mono, monospace' }}>
            Account
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            {[
              { label: 'Name', value: user?.name || '—' },
              { label: 'Email', value: user?.email },
              { label: 'Plan', value: planInfo.label },
            ].map(row => (
              <div key={row.label} className="settings-row">
                <span className="settings-label">{row.label}</span>
                <span className="settings-value">{row.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Current Plan */}
        <div className="card" style={{ borderColor: plan === 'TEAM' ? 'rgba(0,217,255,0.25)' : plan === 'PRO' ? 'rgba(105,219,124,0.25)' : 'var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h2 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.4rem', fontFamily: 'Space Mono, monospace' }}>
                Current Plan
              </h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '1.4rem', fontWeight: 700, color: planInfo.color }}>
                  {planInfo.label}
                </span>
                <span style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>{planInfo.price}</span>
              </div>
              <p style={{ color: 'var(--muted)', fontSize: '0.78rem', marginTop: '0.3rem' }}>
                Up to {planInfo.repos === 999 ? 'unlimited' : planInfo.repos} {planInfo.repos === 1 ? 'repository' : 'repositories'}
              </p>
            </div>
            {plan === 'FREE' && (
              <button
                className="btn-primary"
                style={{ fontSize: '0.82rem', padding: '0.6rem 1.2rem' }}
                onClick={() => toast.info('Upgrade plans coming soon! You\'re on the free beta — enjoy unlimited access for now.')}
              >
                Upgrade Plan →
              </button>
            )}
          </div>

          <div style={{ marginTop: '1.2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '0.6rem' }}>
            {[
              { label: 'Repos', value: planInfo.repos === 999 ? '∞' : planInfo.repos },
              { label: 'Email Alerts', value: '✓' },
              { label: 'History', value: plan === 'FREE' ? '7 days' : '∞' },
              { label: 'Slack/Discord', value: plan !== 'FREE' ? '✓' : '—' },
            ].map(item => (
              <div key={item.label} style={{
                background: 'rgba(0,0,0,0.2)', borderRadius: '8px',
                padding: '0.65rem', textAlign: 'center',
              }}>
                <div style={{ fontWeight: 700, color: 'var(--text)', marginBottom: '0.15rem' }}>{item.value}</div>
                <div style={{ fontSize: '0.68rem', color: 'var(--muted)' }}>{item.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Email Alert Preview */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.2rem', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div>
              <h2 style={{ fontSize: '0.9rem', fontWeight: 700, fontFamily: 'Space Mono, monospace' }}>
                Email Alert Preview
              </h2>
              <p style={{ fontSize: '0.76rem', color: 'var(--muted)', marginTop: '0.25rem' }}>
                This is what your breaking change alerts look like in your inbox
              </p>
            </div>
            {/* Toggle */}
            <div style={{ display: 'flex', background: 'rgba(0,0,0,0.3)', borderRadius: '6px', padding: '3px', gap: '2px', flexShrink: 0 }}>
              {Object.entries(PREVIEW_VARIANTS).map(([key, v]) => (
                <button
                  key={key}
                  onClick={() => setEmailVariant(key)}
                  style={{
                    background: emailVariant === key ? 'var(--surface)' : 'transparent',
                    border: emailVariant === key ? '1px solid var(--border)' : '1px solid transparent',
                    color: emailVariant === key ? 'var(--text)' : 'var(--muted)',
                    borderRadius: '4px',
                    padding: '0.3rem 0.7rem',
                    fontSize: '0.72rem',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {v.label}
                </button>
              ))}
            </div>
          </div>
          <EmailPreview variant={emailVariant} />
        </div>

        {/* Change Password */}
        <div className="card">
          <h2 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '1.2rem', fontFamily: 'Space Mono, monospace' }}>
            Change Password
          </h2>
          <form onSubmit={handlePasswordChange}>
            <div className="form-group">
              <label>Current Password</label>
              <input type="password" placeholder="••••••••" value={passwordForm.current}
                onChange={e => setPasswordForm({ ...passwordForm, current: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>New Password</label>
              <input type="password" placeholder="••••••••" value={passwordForm.next}
                onChange={e => setPasswordForm({ ...passwordForm, next: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>Confirm New Password</label>
              <input type="password" placeholder="••••••••" value={passwordForm.confirm}
                onChange={e => setPasswordForm({ ...passwordForm, confirm: e.target.value })} required />
            </div>
            <button type="submit" className="btn-primary" style={{ alignSelf: 'flex-start' }} disabled={pwLoading}>
              {pwLoading ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </div>

        {/* Danger Zone */}
        <div className="card" style={{ borderColor: 'rgba(255,77,109,0.2)' }}>
          <h2 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.5rem', fontFamily: 'Space Mono, monospace', color: 'var(--accent)' }}>
            Danger Zone
          </h2>
          <p style={{ color: 'var(--muted)', fontSize: '0.82rem', marginBottom: '1rem', lineHeight: 1.6 }}>
            Signing out will end your session on this device.
          </p>
          <button className="btn-secondary" onClick={() => logout()}
            style={{ color: 'var(--danger)', borderColor: 'rgba(255,77,109,0.3)' }}>
            Sign Out
          </button>
        </div>

      </div>
    </div>
  )
}
