import { useState } from 'react'
import { useSocket } from './hooks/useSocket'
import { useKeyboard } from './hooks/useKeyboard'
import { useGamepad } from './hooks/useGamepad'
import { TopBar } from './components/TopBar'
import { VideoPanel } from './components/VideoPanel'
import { CompassCard } from './components/CompassCard'
import { DPad } from './components/DPad'
import { TelemetryGrid } from './components/TelemetryGrid'
import { ThrottleBar } from './components/ThrottleBar'
import { EventLog } from './components/EventLog'
import { Login } from './components/Login'

function MainApp({ username, onLogout }: { username: string; onLogout: () => void }) {
<<<<<<< Updated upstream
  const { sendCmd, telemetry, connected, log } = useSocket()
=======
  const [streamOnline, setStreamOnline] = useState(false)
  const { sendCmd, telemetry, log } = useSocket()
  const [gamepadSpeed, setGamepadSpeed] = useState<number | null>(null)
>>>>>>> Stashed changes
  useKeyboard(sendCmd)
  useGamepad(sendCmd)

  return (
    <div className="flex flex-col h-full" style={{ background: 'var(--color-bg-primary)' }}>
      {/* Top bar */}
      <TopBar connected={streamOnline} username={username} onLogout={onLogout} />

      {/* Main content: video + right panel */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left: video */}
        <div className="flex flex-col flex-1 p-3 overflow-hidden">
          <VideoPanel onStatusChange={setStreamOnline} />
        </div>

        {/* Right: compass + dpad + direction */}
        <div
          className="flex flex-col shrink-0 overflow-hidden pt-3"
          style={{
            width: '320px',
            borderLeft: '1px solid var(--color-border-accent)',
            background: 'var(--color-bg-surface)',
          }}>
          <CompassCard heading={telemetry.heading} />
          <div style={{ borderTop: '1px solid var(--color-border-accent)' }}>
            <DPad sendCmd={sendCmd} direction={telemetry.direction} />
          </div>
          {/* Last CMD display */}
          <div className="p-4 text-center" style={{ borderTop: '1px solid var(--color-border-accent)' }}>
            <div className="text-xs font-mono tracking-widest mb-1" style={{ color: 'var(--color-text-muted)' }}>
              LAST CMD
            </div>
            <div className="font-mono text-lg" style={{ color: 'var(--color-accent-cyan)' }}>
              {log.length > 0 ? log[log.length - 1].cmd : '—'}
            </div>
            <div className="font-mono text-xs" style={{ color: 'var(--color-text-muted)' }}>
              {log.length > 0 ? log[log.length - 1].direction : 'no command yet'}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom: telemetry + throttle + log */}
      <div style={{ borderTop: '1px solid var(--color-border-accent)', background: 'var(--color-bg-surface)' }}>
        <TelemetryGrid
          speed={telemetry.speed}
          heading={telemetry.heading}
          signal={telemetry.signal}
        />
        <ThrottleBar speed={telemetry.speed} />
        <EventLog entries={log} />
      </div>
    </div>
  )
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const storedAuth = localStorage.getItem('scubaaaa-auth')
    if (storedAuth) {
      const { timestamp } = JSON.parse(storedAuth)
      // Check if login is still valid (24 hours)
      return Date.now() - timestamp < 24 * 60 * 60 * 1000
    }
    return false
  })
  const [username, setUsername] = useState(() => {
    const storedAuth = localStorage.getItem('scubaaaa-auth')
    if (storedAuth) {
      const { username: storedUsername, timestamp } = JSON.parse(storedAuth)
      return Date.now() - timestamp < 24 * 60 * 60 * 1000 ? storedUsername : ''
    }
    return ''
  })

  const handleLogin = (user: string) => {
    setIsAuthenticated(true)
    setUsername(user)
    localStorage.setItem('scubaaaa-auth', JSON.stringify({
      username: user,
      timestamp: Date.now(),
    }))
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    setUsername('')
    localStorage.removeItem('scubaaaa-auth')
  }

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />
  }

  return <MainApp username={username} onLogout={handleLogout} />
}
