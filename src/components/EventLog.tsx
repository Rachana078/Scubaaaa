import { useEffect, useRef } from 'react'
import type { LogEntry } from '../hooks/useSocket'

interface Props {
  entries: LogEntry[]
}

export function EventLog({ entries }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [entries])

  return (
    <div className="p-3" style={{ borderTop: '1px solid var(--color-border-accent)' }}>
      <div className="text-xs font-mono tracking-widest mb-2" style={{ color: 'var(--color-text-muted)' }}>
        EVENT LOG
      </div>
      <div
        className="overflow-y-auto font-mono text-xs space-y-0.5"
        style={{ height: '80px', background: 'var(--color-bg-surface)', borderRadius: '4px', padding: '6px' }}>
        {entries.length === 0 && (
          <div style={{ color: 'var(--color-text-muted)' }}>— awaiting commands —</div>
        )}
        {entries.map((e, i) => (
          <div key={i}>
            <span style={{ color: 'var(--color-text-muted)' }}>[{e.ts} UTC] </span>
            <span style={{ color: 'var(--color-accent-cyan)' }}>CMD: {e.cmd}</span>
            <span style={{ color: 'var(--color-text-muted)' }}> → </span>
            <span style={{ color: 'var(--color-text-primary)' }}>direction: {e.direction}</span>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
    </div>
  )
}
