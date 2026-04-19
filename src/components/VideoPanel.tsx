import { useEffect, useRef, useState } from 'react'
import { useDetection } from '../hooks/useDetection'
import type { Detection } from '../hooks/useDetection'

const STREAM_URL = import.meta.env.VITE_STREAM_URL as string | undefined

interface Props {
  onStatusChange?: (online: boolean) => void
  onDetection?:   (detections: Detection[]) => void
}

export function VideoPanel({ onStatusChange, onDetection }: Props) {
  const [streaming, setStreaming]   = useState(false)
  const [elapsed,   setElapsed]     = useState(0)
  const [camReady,  setCamReady]    = useState(false)

  const imgRef    = useRef<HTMLImageElement | null>(null)
  const videoRef  = useRef<HTMLVideoElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const startRef  = useRef<number | null>(null)

  // ── Webcam fallback (when no STREAM_URL) ──────────────────────────────────
  useEffect(() => {
    if (STREAM_URL) return
    let stream: MediaStream | null = null
    navigator.mediaDevices?.getUserMedia({ video: true }).then(s => {
      stream = s
      if (videoRef.current) {
        videoRef.current.srcObject = s
        setCamReady(true)
        onStatusChange?.(true)
      }
    }).catch(() => { /* no webcam — stay offline */ })
    return () => { stream?.getTracks().forEach(t => t.stop()) }
  }, [onStatusChange])

  // ── REC timer ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!streaming && !camReady) return
    startRef.current = Date.now()
    const id = setInterval(() => {
      if (startRef.current) setElapsed(Math.floor((Date.now() - startRef.current) / 1000))
    }, 1000)
    return () => clearInterval(id)
  }, [streaming, camReady])

  // ── Detection ─────────────────────────────────────────────────────────────
  const sourceRef = (STREAM_URL ? imgRef : videoRef) as React.RefObject<HTMLImageElement | HTMLVideoElement | null>
  const detections = useDetection(sourceRef, streaming || camReady)

  // ── Draw bounding boxes on overlay canvas ─────────────────────────────────
  useEffect(() => {
    onDetection?.(detections)
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    detections.forEach(d => {
      const x = (d.x - d.width  / 2) * canvas.width
      const y = (d.y - d.height / 2) * canvas.height
      const w = d.width  * canvas.width
      const h = d.height * canvas.height

      ctx.strokeStyle = '#00E5FF'
      ctx.lineWidth   = 2
      ctx.strokeRect(x, y, w, h)

      const label = `${d.class.toUpperCase()} ${Math.round(d.confidence * 100)}%`
      ctx.font      = 'bold 12px monospace'
      const tw      = ctx.measureText(label).width
      ctx.fillStyle = 'rgba(0,229,255,0.15)'
      ctx.fillRect(x, y - 18, tw + 8, 18)
      ctx.fillStyle = '#00E5FF'
      ctx.fillText(label, x + 4, y - 4)
    })
  }, [detections, onDetection])

  function fmtElapsed(s: number) {
    const h   = Math.floor(s / 3600).toString().padStart(2, '0')
    const m   = Math.floor((s % 3600) / 60).toString().padStart(2, '0')
    const sec = (s % 60).toString().padStart(2, '0')
    return `${h}:${m}:${sec}`
  }

  const live = streaming || camReady

  return (
    <div
      className="relative flex-1 rounded-lg overflow-hidden"
      style={{
        background:    'var(--color-bg-surface)',
        borderLeft:    '1px solid var(--color-border-accent)',
        borderRight:   '1px solid var(--color-border-accent)',
        borderBottom:  '1px solid var(--color-border-accent)',
        minHeight:     '240px',
      }}
    >
      {/* MJPEG stream */}
      {STREAM_URL && (
        <img
          ref={imgRef}
          src={STREAM_URL}
          className="w-full h-full object-cover"
          onLoad={() => {
            if (!streaming) { setStreaming(true); startRef.current = Date.now() }
            onStatusChange?.(true)
          }}
          onError={() => { setStreaming(false); onStatusChange?.(false) }}
        />
      )}

      {/* Webcam fallback */}
      {!STREAM_URL && (
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className="w-full h-full object-cover"
        />
      )}

      {/* Offline label */}
      {!live && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
          <span className="font-mono text-sm tracking-widest" style={{ color: 'var(--color-text-muted)' }}>
            STREAM OFFLINE
          </span>
        </div>
      )}

      {/* Bounding box overlay canvas */}
      <canvas
        ref={canvasRef}
        width={1280}
        height={720}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />

      {/* Sonar scanlines */}
      <div className="sonar-scanlines" />

      {/* Crosshair */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: 0.25 }}>
        <line x1="50%" y1="0" x2="50%" y2="100%" stroke="var(--color-accent-green)" strokeWidth="1" />
        <line x1="0"   y1="50%" x2="100%" y2="50%" stroke="var(--color-accent-green)" strokeWidth="1" />
        <circle cx="50%" cy="50%" r="20" fill="none" stroke="var(--color-accent-green)" strokeWidth="1" />
      </svg>

      {/* REC indicator */}
      {live && (
        <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 rounded"
          style={{ background: 'rgba(8,13,18,0.75)', backdropFilter: 'blur(4px)' }}>
          <span className="w-2 h-2 rounded-full animate-blink" style={{ background: 'var(--color-danger)' }} />
          <span className="font-mono text-xs" style={{ color: 'var(--color-danger)' }}>
            REC {fmtElapsed(elapsed)}
          </span>
        </div>
      )}

      {/* TARGETS badge */}
      {live && (
        <div className="absolute bottom-2 right-2 flex items-center gap-2 px-2 py-1 rounded"
          style={{ background: 'rgba(8,13,18,0.75)', backdropFilter: 'blur(4px)' }}>
          <span className="font-mono text-xs tracking-widest" style={{ color: 'var(--color-text-muted)' }}>
            TARGETS
          </span>
          <span className="font-mono text-sm font-bold" style={{ color: detections.length > 0 ? 'var(--color-accent-cyan)' : 'var(--color-text-muted)' }}>
            {detections.length}
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
