export function SkeletonBox({ width = '100%', height = '1rem', borderRadius = '6px', style = {} }) {
  return (
    <div style={{
      width,
      height,
      borderRadius,
      background: 'linear-gradient(90deg, #1e1e2e 25%, #2a2a3e 50%, #1e1e2e 75%)',
      backgroundSize: '200% 100%',
      animation: 'shimmer 1.4s infinite',
      ...style,
    }} />
  )
}

export function SkeletonCard({ style = {} }) {
  return (
    <div style={{
      background: '#111118',
      border: '1px solid #1e1e2e',
      borderRadius: '10px',
      padding: '1.5rem',
      ...style,
    }}>
      <style>{`@keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }`}</style>
      <SkeletonBox height="1.1rem" width="60%" style={{ marginBottom: '0.6rem' }} />
      <SkeletonBox height="0.8rem" width="40%" style={{ marginBottom: '1.2rem' }} />
      <SkeletonBox height="0.75rem" width="80%" style={{ marginBottom: '0.4rem' }} />
      <SkeletonBox height="0.75rem" width="50%" />
    </div>
  )
}

export function SkeletonStat() {
  return (
    <div style={{
      background: '#111118',
      border: '1px solid #1e1e2e',
      borderRadius: '10px',
      padding: '1rem',
      flex: 1,
      minWidth: '150px',
      textAlign: 'center',
    }}>
      <style>{`@keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }`}</style>
      <SkeletonBox height="2rem" width="50%" style={{ margin: '0 auto 0.5rem' }} />
      <SkeletonBox height="0.7rem" width="70%" style={{ margin: '0 auto' }} />
    </div>
  )
}
