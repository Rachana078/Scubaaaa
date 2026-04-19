import { useEffect, useState } from 'react'

interface Props {
  connected: boolean
  username?: string
  onLogout?: () => void
}

export function TopBar({ connected, username, onLogout }: Props) {
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

      {/* Right: WS status + user */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="relative inline-flex w-2 h-2">
            {connected && (
              <span className="absolute inset-0 rounded-full sonar-ping-ring"
                style={{ backgroundColor: 'var(--color-accent-green)' }} />
            )}
            <span className="w-2 h-2 rounded-full"
              style={{ backgroundColor: connected ? 'var(--color-accent-green)' : 'var(--color-danger)' }} />
          </span>
          <span className="font-mono text-xs tracking-widest"
            style={{ color: connected ? 'var(--color-accent-green)' : 'var(--color-danger)' }}>
            {connected ? 'CONNECTED' : 'OFFLINE'}
          </span>
        </div>

        {username && onLogout && (
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs tracking-widest" style={{ color: 'var(--color-text-muted)' }}>
              {username}
            </span>
            <button
              onClick={onLogout}
              className="text-xs font-mono uppercase tracking-widest px-3 py-1 rounded border"
              style={{
                borderColor: 'var(--color-border-accent)',
                color: 'var(--color-text-primary)',
                background: 'transparent'
              }}>
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  )
}