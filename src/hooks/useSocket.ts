import { useEffect, useRef, useState, useCallback } from 'react'

export interface Telemetry {
  speed: number
  heading: number
  signal: number
  direction: string
}

export interface LogEntry {
  ts: string
  cmd: string
  direction: string
}

function nowUTC(): string {
  const d = new Date()
  return d.toUTCString().slice(17, 25)
}

const DIRECTIONS: Record<string, string> = {
  F: 'forward',
  B: 'reverse',
  L: 'port',
  R: 'starboard',
  S: 'stopped',
}

const WS_URL = 'ws://192.168.2.1:8000/ws'

export function useSocket() {
  const [connected, setConnected] = useState(false)
  const [telemetry, setTelemetry] = useState<Telemetry>({
    speed: 0,
    heading: 0,
    signal: -62,
    direction: 'stopped',
  })
  const [log, setLog] = useState<LogEntry[]>([])
  const directionRef = useRef('stopped')
  const wsRef = useRef<WebSocket | null>(null)

  // ── REAL WEBSOCKET ─────────────────────────────────────────────────────────
  useEffect(() => {
    function connect() {
      const ws = new WebSocket(WS_URL)
      wsRef.current = ws

      ws.onopen = () => setConnected(true)
      ws.onclose = () => {
        setConnected(false)
        // Reconnect after 2s
        setTimeout(connect, 2000)
      }
      ws.onerror = () => ws.close()

      // If the ROV sends telemetry back, handle it here
      ws.onmessage = (e) => {
        try {
          const data = JSON.parse(e.data)
          if (data.heading !== undefined || data.speed !== undefined) {
            setTelemetry(prev => ({ ...prev, ...data }))
          }
        } catch { /* ignore non-JSON */ }
      }
    }

    connect()
    return () => {
      wsRef.current?.close()
    }
  }, [])

  // ── MOCK telemetry (heading + signal only — remove when ROV sends real data)
  useEffect(() => {
    const id = setInterval(() => {
      setTelemetry(prev => ({
        ...prev,
        heading: parseFloat(((prev.heading + (Math.random() * 6 - 3) + 360) % 360).toFixed(1)),
        signal: Math.round(-40 - Math.random() * 60),
      }))
    }, 800)
    return () => clearInterval(id)
  }, [])

  const sendCmd = useCallback((cmd: string) => {
    const direction = DIRECTIONS[cmd] ?? cmd
    directionRef.current = direction
    setTelemetry(prev => ({ ...prev, direction }))
    const entry: LogEntry = { ts: nowUTC(), cmd, direction }
    setLog(prev => [...prev.slice(-19), entry])

    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ cmd }))
    }
  }, [])

  return { sendCmd, telemetry, connected, log }
}
