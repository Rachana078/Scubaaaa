import { useSocket } from './hooks/useSocket'
import { useKeyboard } from './hooks/useKeyboard'
import { TopBar } from './components/TopBar'
import { VideoPanel } from './components/VideoPanel'
import { CompassCard } from './components/CompassCard'
import { DPad } from './components/DPad'
import { TelemetryGrid } from './components/TelemetryGrid'
import { ThrottleBar } from './components/ThrottleBar'
import { EventLog } from './components/EventLog'

export default function App() {
  const { sendCmd, telemetry, connected, log } = useSocket()
  useKeyboard(sendCmd)

  return (
    <div className="flex flex-col h-full" style={{ background: 'var(--color-bg-primary)' }}>
      {/* Top bar */}
      <TopBar connected={connected} />

      {/* Main content: video + right panel */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left: video */}
        <div className="flex flex-col flex-1 p-3 overflow-hidden">
          <VideoPanel />
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
