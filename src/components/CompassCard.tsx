interface Props {
  heading: number
}

export function CompassCard({ heading }: Props) {
  const r = 55
  const cx = 70
  const cy = 70

  return (
    <div className="flex flex-col items-center p-2 rounded-lg"
      style={{ background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border-accent)' }}>
      <div className="text-xs font-mono tracking-widest mb-1" style={{ color: 'var(--color-text-muted)' }}>
        HEADING
      </div>

      <svg width="140" height="140" viewBox="0 0 140 140">
        {/* Degree ring */}
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--color-border-accent)" strokeWidth="1" />

        {/* Tick marks */}
        {Array.from({ length: 36 }, (_, i) => {
          const angle = (i * 10 * Math.PI) / 180
          const isCardinal = i % 9 === 0
          const inner = isCardinal ? r - 12 : r - 6
          return (
            <line
              key={i}
              x1={cx + inner * Math.sin(angle)}
              y1={cy - inner * Math.cos(angle)}
              x2={cx + r * Math.sin(angle)}
              y2={cy - r * Math.cos(angle)}
              stroke={isCardinal ? 'var(--color-accent-green)' : 'var(--color-text-muted)'}
              strokeWidth={isCardinal ? 2 : 1}
            />
          )
        })}

        {/* Cardinal labels */}
        {[
          { label: 'N', angle: 0 },
          { label: 'E', angle: 90 },
          { label: 'S', angle: 180 },
          { label: 'W', angle: 270 },
        ].map(({ label, angle }) => {
          const rad = (angle * Math.PI) / 180
          const d = r - 24
          return (
            <text
              key={label}
              x={cx + d * Math.sin(rad)}
              y={cy - d * Math.cos(rad) + 5}
              textAnchor="middle"
              fill={label === 'N' ? 'var(--color-danger)' : 'var(--color-text-primary)'}
              fontSize="10"
              fontFamily="Share Tech Mono, monospace"
              fontWeight="bold"
            >
              {label}
            </text>
          )
        })}

        {/* Rotating needle group */}
        <g transform={`rotate(${heading}, ${cx}, ${cy})`}>
          {/* North pointer (red) */}
          <polygon
            points={`${cx},${cy - r + 8} ${cx - 6},${cy + 10} ${cx + 6},${cy + 10}`}
            fill="var(--color-danger)"
            opacity="0.9"
          />
          {/* South pointer (muted) */}
          <polygon
            points={`${cx},${cy + r - 8} ${cx - 6},${cy - 10} ${cx + 6},${cy - 10}`}
            fill="var(--color-text-muted)"
            opacity="0.6"
          />
        </g>

        {/* Center dot */}
        <circle cx={cx} cy={cy} r={4} fill="var(--color-accent-green)" />
      </svg>

      <div className="font-mono text-xl mt-1" style={{ color: 'var(--color-accent-green)' }}>
        {heading.toFixed(1)}°
      </div>
    </div>
  )
}
