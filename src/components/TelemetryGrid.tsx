interface Props {
  speed: number | null
  heading: number
  signal: number
}

function barWidth(key: string, value: number): number {
  if (key === 'speed') return Math.min(100, (value / 5) * 100)
  if (key === 'heading') return (value / 360) * 100
  if (key === 'signal') return Math.min(100, Math.max(0, (value + 100) * 2))
  return 50
}

interface CardProps {
  label: string
  value: string
  unit: string
  colorKey: string
  rawValue: number
}

function Card({ label, value, unit, colorKey, rawValue }: CardProps) {
  const fill = barWidth(colorKey, rawValue)

  return (
    <div className="flex flex-col p-3 rounded-lg"
      style={{ background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border-accent)', flex: 1 }}>
      <div className="text-xs font-mono tracking-widest mb-1" style={{ color: 'var(--color-text-muted)' }}>
        {label}
      </div>
      <div className="font-mono text-2xl" style={{ color: 'var(--color-accent-green)' }}>
        {value}
        <span className="text-sm ml-1" style={{ color: 'var(--color-text-muted)' }}>{unit}</span>
      </div>
      <div className="mt-2 h-1 rounded-full" style={{ background: 'var(--color-bg-surface)' }}>
        <div
          className="h-1 rounded-full transition-all duration-300"
          style={{ width: `${fill}%`, background: 'var(--color-accent-green)' }}
        />
      </div>
    </div>
  )
}

export function TelemetryGrid({ speed, heading, signal }: Props) {
  return (
    <div className="flex gap-3 p-3">
      <Card label="SPEED" value={speed !== null ? speed.toFixed(1) : '--'} unit="mph" colorKey="speed" rawValue={speed ?? 0} />
      <Card label="HEADING" value={heading.toFixed(0)} unit="°" colorKey="heading" rawValue={heading} />
      <Card label="SIGNAL" value={signal.toString()} unit="dBm" colorKey="signal" rawValue={signal} />
    </div>
  )
}
