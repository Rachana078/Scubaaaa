import { useEffect, useState } from 'react'

interface Props {
  connected: boolean
}

export function TopBar({ connected }: Props) {
  const [utc, setUtc] = useState('')

  useEffect(() => {
    const tick = () => setUtc(
      new Date().toLocaleString('en-US', {
        timeZone: 'America/Los_Angeles',
        weekday: 'short', day: '2-digit', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false,
      }) + ' PST'
    )
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="flex items-center justify-between px-4 py-2 border-b"
      style={{ borderColor: 'var(--color-border-accent)', background: 'var(--color-bg-surface)' }}>
      {/* Left: Logo */}
      <div className="font-mono text-lg tracking-widest" style={{ color: 'var(--color-accent-green)' }}>
        DEEPRUN
      </div>

      {/* Center: UTC clock */}
      <div className="font-mono text-sm" style={{ color: 'var(--color-text-muted)' }}>
        {utc}
      </div>

      {/* Right: WS status */}
      <div className="flex items-center gap-2">
        <span
          className="w-2 h-2 rounded-full animate-pulse-dot"
          style={{ backgroundColor: connected ? 'var(--color-accent-green)' : 'var(--color-danger)' }}
        />
        <span className="font-mono text-xs tracking-widest"
          style={{ color: connected ? 'var(--color-accent-green)' : 'var(--color-danger)' }}>
          {connected ? 'CONNECTED' : 'OFFLINE'}
        </span>
      </div>
    </div>
  )
}
