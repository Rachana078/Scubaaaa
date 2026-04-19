interface Props {
  speed: number
  maxSpeed?: number
}

export function ThrottleBar({ speed, maxSpeed = 15 }: Props) {
  const pct = Math.min(1, speed / maxSpeed)
  const segments = 20
  const filled = Math.round(pct * segments)

  function segmentColor(i: number): string {
    const ratio = i / segments
    if (ratio < 0.5) return 'var(--color-accent-green)'
    if (ratio < 0.75) return 'var(--color-warning)'
    return 'var(--color-danger)'
  }

  return (
    <div className="px-3 pb-3">
      <div className="text-xs font-mono tracking-widest mb-2" style={{ color: 'var(--color-text-muted)' }}>
        THROTTLE
      </div>
      <div className="flex gap-1">
        {Array.from({ length: segments }, (_, i) => (
          <div
            key={i}
            className="h-4 flex-1 rounded-sm transition-all duration-200"
            style={{
              background: i < filled ? segmentColor(i) : 'var(--color-bg-elevated)',
              opacity: i < filled ? 1 : 0.3,
              boxShadow: i < filled ? `0 0 4px ${segmentColor(i)}` : 'none',
            }}
          />
        ))}
      </div>
    </div>
  )
}
