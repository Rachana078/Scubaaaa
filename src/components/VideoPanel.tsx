import { useEffect, useRef, useState } from 'react'

const STREAM_URL = import.meta.env.VITE_STREAM_URL as string | undefined

interface Props {
  onStatusChange?: (online: boolean) => void
}

export function VideoPanel({ onStatusChange }: Props) {
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
            onStatusChange?.(true)
          }}
          onError={() => {
            setStreaming(false)
            onStatusChange?.(false)
          }}
        />
      ) : null}

      {/* Placeholder when no stream — jellyfish */}
      {!STREAM_URL && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
          <div className="jelly-wrap">
            <svg width="72" height="90" viewBox="0 0 72 90" fill="none">
              {/* Bell */}
              <ellipse className="jelly-bell" cx="36" cy="32" rx="28" ry="22"
                fill="rgba(0,229,255,0.07)" stroke="rgba(0,229,255,0.35)" strokeWidth="1.2" />
              {/* Inner shimmer */}
              <ellipse cx="36" cy="35" rx="16" ry="10"
                fill="rgba(0,229,255,0.04)" stroke="rgba(0,229,255,0.12)" strokeWidth="0.8" />
              {/* Tentacles */}
              <path className="tentacle" d="M18 52 Q14 62 18 72 Q22 82 18 90"
                stroke="rgba(0,229,255,0.3)" strokeWidth="1.2" fill="none" strokeLinecap="round" />
              <path className="tentacle" d="M28 56 Q24 66 28 76 Q32 86 28 90"
                stroke="rgba(0,229,255,0.25)" strokeWidth="1" fill="none" strokeLinecap="round" />
              <path className="tentacle" d="M44 56 Q48 66 44 76 Q40 86 44 90"
                stroke="rgba(0,229,255,0.25)" strokeWidth="1" fill="none" strokeLinecap="round" />
              <path className="tentacle" d="M54 52 Q58 62 54 72 Q50 82 54 90"
                stroke="rgba(0,229,255,0.3)" strokeWidth="1.2" fill="none" strokeLinecap="round" />
            </svg>
          </div>
          <span className="font-mono text-sm tracking-widest" style={{ color: 'var(--color-text-muted)' }}>
            STREAM OFFLINE
          </span>
        </div>
      )}

      {/* Sonar scanlines */}
      <div className="sonar-scanlines" />

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
