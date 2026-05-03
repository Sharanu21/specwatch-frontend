import { createContext, useContext, useState, useCallback } from 'react'

const ToastContext = createContext(null)

const ICONS = {
  success: '✓',
  error: '✗',
  warning: '⚠',
  info: 'ℹ',
}

const COLORS = {
  success: { bg: 'rgba(105,219,124,0.12)', border: 'rgba(105,219,124,0.3)', color: '#69db7c' },
  error:   { bg: 'rgba(255,77,109,0.12)',  border: 'rgba(255,77,109,0.3)',  color: '#ff4d6d' },
  warning: { bg: 'rgba(255,212,59,0.12)',  border: 'rgba(255,212,59,0.3)',  color: '#ffd43b' },
  info:    { bg: 'rgba(0,217,255,0.10)',   border: 'rgba(0,217,255,0.3)',   color: '#00d9ff' },
}

function ToastItem({ toast, onRemove }) {
  const c = COLORS[toast.type] || COLORS.info
  return (
    <div
      onClick={() => onRemove(toast.id)}
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '0.6rem',
        background: c.bg,
        border: `1px solid ${c.border}`,
        borderRadius: '8px',
        padding: '0.75rem 1rem',
        cursor: 'pointer',
        minWidth: '260px',
        maxWidth: '360px',
        boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
        animation: 'slideIn 0.2s ease',
      }}
    >
      <span style={{ color: c.color, fontWeight: 700, fontSize: '0.9rem', flexShrink: 0, lineHeight: 1.4 }}>
        {ICONS[toast.type]}
      </span>
      <span style={{ fontSize: '0.85rem', color: '#e8e8f0', lineHeight: 1.5 }}>
        {toast.message}
      </span>
    </div>
  )
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  const toast = useCallback((message, type = 'info') => {
    const id = Date.now() + Math.random()
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => removeToast(id), 4000)
  }, [removeToast])

  toast.success = (msg) => toast(msg, 'success')
  toast.error   = (msg) => toast(msg, 'error')
  toast.warning = (msg) => toast(msg, 'warning')
  toast.info    = (msg) => toast(msg, 'info')

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div style={{
        position: 'fixed',
        bottom: '1.5rem',
        right: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
        zIndex: 9999,
      }}>
        <style>{`@keyframes slideIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }`}</style>
        {toasts.map(t => (
          <ToastItem key={t.id} toast={t} onRemove={removeToast} />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}
