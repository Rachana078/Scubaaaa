import { useEffect, useRef, useState } from 'react'

const STREAM_URL = import.meta.env.VITE_STREAM_URL as string | undefined

export function VideoPanel() {
  const [streaming, setStreaming] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const startRef = useRef<number | null>(null)

  useEffect(() => {
    if (!streaming) return
    const id = setInterval(() => {
      if (startRef.current) setElapsed(Math.floor((Date.now() - startRef.current) / 1000))
    }, 1000)
    return () => clearInterval(id)
  }, [streaming])

  function fmtElapsed(s: number): string {
    const h = Math.floor(s / 3600).toString().padStart(2, '0')
    const m = Math.floor((s % 3600) / 60).toString().padStart(2, '0')
    const sec = (s % 60).toString().padStart(2, '0')
    return `${h}:${m}:${sec}`
  }

  return (
    <div className="relative flex-1 rounded-lg overflow-hidden"
      style={{ background: 'var(--color-bg-surface)', borderLeft: '1px solid var(--color-border-accent)',
        borderRight: '1px solid var(--color-border-accent)',
        borderBottom: '1px solid var(--color-border-accent)', minHeight: '240px' }}>

      {STREAM_URL ? (
        <img
          src={STREAM_URL}
          className="w-full h-full object-cover"
          onLoad={() => {
            if (!streaming) {
              setStreaming(true)
              startRef.current = Date.now()
            }
          }}
        />
      ) : null}

      {/* Placeholder when no stream */}
      {!STREAM_URL && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-muted)" strokeWidth="1.5">
            <path d="M15 10l4.55-2.5A1 1 0 0121 8.5v7a1 1 0 01-1.45.9L15 14M3 8a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
          </svg>
          <span className="font-mono text-sm tracking-widest" style={{ color: 'var(--color-text-muted)' }}>
            STREAM OFFLINE
          </span>
        </div>
      )}

      {/* Crosshair overlay */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: 0.25 }}>
        <line x1="50%" y1="0" x2="50%" y2="100%" stroke="var(--color-accent-green)" strokeWidth="1" />
        <line x1="0" y1="50%" x2="100%" y2="50%" stroke="var(--color-accent-green)" strokeWidth="1" />
        <circle cx="50%" cy="50%" r="20" fill="none" stroke="var(--color-accent-green)" strokeWidth="1" />
      </svg>

      {/* REC indicator */}
      {streaming && (
        <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 rounded"
          style={{ background: 'rgba(8,13,18,0.75)', backdropFilter: 'blur(4px)' }}>
          <span className="w-2 h-2 rounded-full animate-blink" style={{ background: 'var(--color-danger)' }} />
          <span className="font-mono text-xs" style={{ color: 'var(--color-danger)' }}>
            REC {fmtElapsed(elapsed)}
          </span>
        </div>
      )}

      {/* Top-left label */}
      <div className="absolute top-2 left-2 font-mono text-xs tracking-widest px-2 py-1 rounded"
        style={{ background: 'rgba(8,13,18,0.75)', color: 'var(--color-text-muted)' }}>
        CAM-01 / FWD
      </div>
    </div>
  )
}
