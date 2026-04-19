import { useState, useCallback, useRef } from 'react'
import { useSocket } from './hooks/useSocket'
import type { LogEntry } from './hooks/useSocket'
import type { Detection } from './hooks/useDetection'
import { useKeyboard } from './hooks/useKeyboard'
import { useGamepad } from './hooks/useGamepad'
import { TopBar } from './components/TopBar'
import { VideoPanel } from './components/VideoPanel'
import { DPad } from './components/DPad'
import { TelemetryGrid } from './components/TelemetryGrid'
import { ThrottleBar } from './components/ThrottleBar'
import { EventLog } from './components/EventLog'
import { Login } from './components/Login'

function MainApp({ username, onLogout }: { username: string; onLogout: () => void }) {
  const [streamOnline, setStreamOnline] = useState(false)
  const { sendCmd, telemetry, log } = useSocket()
  const [gamepadSpeed, setGamepadSpeed] = useState<number | null>(null)
  const [detectionLog, setDetectionLog] = useState<LogEntry[]>([])
  const prevCountRef = useRef(0)
  useKeyboard(sendCmd)
  useGamepad(sendCmd, setGamepadSpeed)

  const handleDetection = useCallback((detections: Detection[]) => {
    const count = detections.length
    if (count === prevCountRef.current) return
    prevCountRef.current = count
    if (count === 0) return
    const now = new Date()
    const ts  = now.toUTCString().slice(17, 25)
    const classes = [...new Set(detections.map(d => d.class.toUpperCase()))].join(', ')
    const entry: LogEntry = { ts, cmd: `${count}`, direction: classes }
    setDetectionLog(prev => [...prev.slice(-19), entry])
  }, [])

  const speed: number | null = streamOnline ? (gamepadSpeed ?? telemetry.speed) : null

  return (
    <div className="flex flex-col h-full" style={{ background: 'var(--color-bg-primary)' }}>
      {/* Ocean bubble background */}
      <div className="ocean-bubbles" aria-hidden="true">
        <span className="bubble" /><span className="bubble" /><span className="bubble" />
        <span className="bubble" /><span className="bubble" /><span className="bubble" />
        <span className="bubble" /><span className="bubble" />
      </div>

      {/* Submarine background layer */}
      <div className="fixed pointer-events-none" style={{ top: '38%', zIndex: 0 }} aria-hidden="true">
        <div className="submarine">
          <svg width="220" height="80" viewBox="0 0 220 80" fill="none" opacity="0.12" style={{ transform: 'scaleX(-1)' }}>
            {/* Hull */}
            <ellipse cx="105" cy="52" rx="95" ry="22" fill="#00E5FF" />
            {/* Conning tower */}
            <rect x="85" y="28" width="40" height="26" rx="6" fill="#00E5FF" />
            {/* Periscope */}
            <rect x="118" y="14" width="3" height="16" rx="1.5" fill="#00E5FF" />
            <rect x="112" y="14" width="12" height="3" rx="1.5" fill="#00E5FF" />
            {/* Portholes */}
            <circle cx="70" cy="52" r="7" fill="#020B18" stroke="#00E5FF" strokeWidth="2" />
            <circle cx="120" cy="52" r="7" fill="#020B18" stroke="#00E5FF" strokeWidth="2" />
            {/* Propeller */}
            <circle cx="200" cy="52" r="6" fill="none" stroke="#00E5FF" strokeWidth="2" />
            <line x1="200" y1="46" x2="200" y2="58" stroke="#00E5FF" strokeWidth="2" />
            <line x1="194" y1="52" x2="206" y2="52" stroke="#00E5FF" strokeWidth="2" />
            {/* Tail fin */}
            <path d="M195 40 L210 30 L210 42 Z" fill="#00E5FF" />
            <path d="M195 64 L210 74 L210 62 Z" fill="#00E5FF" />
          </svg>
        </div>
      </div>
      {/* Top bar */}
      <TopBar connected={streamOnline} username={username} onLogout={onLogout} />

      {/* Main content: video + right panel */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left: video */}
        <div className="flex flex-col flex-1 p-3 overflow-hidden">
          <VideoPanel onStatusChange={setStreamOnline} onDetection={handleDetection} />
        </div>

        {/* Right: compass + dpad + direction */}
        <div
          className="flex flex-col shrink-0 overflow-hidden pt-3"
          style={{
            width: '320px',
            borderLeft: '1px solid var(--color-border-accent)',
            background: 'var(--color-bg-surface)',
          }}>
          {/* Detection log */}
          <div className="flex flex-col p-3 gap-2" style={{ borderBottom: '1px solid var(--color-border-accent)' }}>
            <div className="text-xs font-mono tracking-widest" style={{ color: 'var(--color-text-muted)' }}>
              DETECTION LOG
            </div>
            <div className="font-mono text-xs tracking-widest mb-1" style={{ color: 'var(--color-accent-cyan)' }}>
              TARGETS: {detectionLog.length > 0 ? detectionLog[detectionLog.length - 1].cmd : '0'}
            </div>
            <div className="overflow-y-auto font-mono text-xs space-y-1" style={{ height: '140px' }}>
              {detectionLog.length === 0 && (
                <div style={{ color: 'var(--color-text-muted)' }}>— awaiting detections —</div>
              )}
              {detectionLog.map((e, i) => (
                <div key={i}>
                  <span style={{ color: 'var(--color-text-muted)' }}>[{e.ts}] </span>
                  <span style={{ color: 'var(--color-accent-cyan)' }}>{e.cmd} TARGET{parseInt(e.cmd) !== 1 ? 'S' : ''}</span>
                  <br />
                  <span style={{ color: 'var(--color-text-primary)', paddingLeft: '8px' }}>{e.direction}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
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
          speed={speed}
          heading={telemetry.heading}
          signal={telemetry.signal}
        />
        <ThrottleBar speed={speed} />
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
