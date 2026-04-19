import { useEffect, useRef, useState } from 'react'

const STREAM_URL = import.meta.env.VITE_STREAM_URL as string | undefined

// Downsampled canvas size for performance
const OPT_W = 160
const OPT_H = 120

interface Props {
  onStatusChange?: (online: boolean) => void
  onOpticalSpeed?: (speed: number) => void
}

export function VideoPanel({ onStatusChange, onOpticalSpeed }: Props) {
  const [streaming, setStreaming] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const [optSpeed, setOptSpeed] = useState<number | null>(null)
  const startRef = useRef<number | null>(null)
  const imgRef = useRef<HTMLImageElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const prevDataRef = useRef<Uint8ClampedArray | null>(null)
  const emaRef = useRef(0)

  useEffect(() => {
    if (!streaming) return
    const id = setInterval(() => {
      if (startRef.current) setElapsed(Math.floor((Date.now() - startRef.current) / 1000))
    }, 1000)
    return () => clearInterval(id)
  }, [streaming])

  // Optical flow: mean absolute difference between successive frames
  useEffect(() => {
    if (!streaming) {
      prevDataRef.current = null
      emaRef.current = 0
      setOptSpeed(null)
      return
    }

    const id = setInterval(() => {
      const img = imgRef.current
      const canvas = canvasRef.current
      if (!img || !canvas) return

      canvas.width = OPT_W
      canvas.height = OPT_H
      const ctx = canvas.getContext('2d', { willReadFrequently: true })
      if (!ctx) return

      try {
        ctx.drawImage(img, 0, 0, OPT_W, OPT_H)
        const { data } = ctx.getImageData(0, 0, OPT_W, OPT_H)

        if (prevDataRef.current) {
          let sum = 0
          for (let i = 0; i < data.length; i += 4) {
            const dr = data[i]     - prevDataRef.current[i]
            const dg = data[i + 1] - prevDataRef.current[i + 1]
            const db = data[i + 2] - prevDataRef.current[i + 2]
            sum += Math.sqrt(dr * dr + dg * dg + db * db)
          }
          // MAD in color-distance units (0–441); scale to 0–15 knot-equivalent
          const mad = sum / (data.length / 4)
          emaRef.current = 0.7 * emaRef.current + 0.3 * mad
          const scaled = parseFloat(Math.min((emaRef.current / 50) * 5, 5).toFixed(1))
          setOptSpeed(scaled)
          onOpticalSpeed?.(scaled)
        }

        prevDataRef.current = new Uint8ClampedArray(data)
      } catch {
        // Stream is cross-origin and canvas is tainted — optical flow unavailable
      }
    }, 200)

    return () => clearInterval(id)
  }, [streaming, onOpticalSpeed])

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

      {/* Hidden canvas for optical flow frame capture */}
      <canvas ref={canvasRef} className="hidden" />

      {STREAM_URL ? (
        <img
          ref={imgRef}
          src={STREAM_URL}
          crossOrigin="anonymous"
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

      {/* Disconnected indicator */}
      {STREAM_URL && !streaming && (
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="font-mono text-2xl tracking-widest animate-blink" style={{ color: 'var(--color-danger)' }}>
            DISCONNECTED
          </span>
        </div>
      )}

      {/* Optical speed estimate */}
      {streaming && optSpeed !== null && (
        <div className="absolute bottom-2 right-2 flex items-center gap-1 px-2 py-1 rounded"
          style={{ background: 'rgba(8,13,18,0.75)', backdropFilter: 'blur(4px)' }}>
          <span className="font-mono text-xs" style={{ color: 'var(--color-accent-green)' }}>
            OPT ~{optSpeed.toFixed(1)} mph
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
