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

export function useSocket() {
  const [connected, setConnected] = useState(true)
  const [telemetry, setTelemetry] = useState<Telemetry>({
    speed: 0,
    heading: 0,
    signal: -62,
    direction: 'stopped',
  })
  const [log, setLog] = useState<LogEntry[]>([])
  const directionRef = useRef('stopped')

  // ── MOCK MODE ──────────────────────────────────────────────────────────────
  // To switch to real socket.io, comment out the block below and uncomment
  // the real socket block further down.

  useEffect(() => {
    setConnected(true)
    const id = setInterval(() => {
      setTelemetry(prev => ({
        speed: parseFloat((Math.random() * 12).toFixed(1)),
        heading: parseFloat(((prev.heading + (Math.random() * 6 - 3) + 360) % 360).toFixed(1)),
        signal: Math.round(-40 - Math.random() * 60),
        direction: directionRef.current,
      }))
    }, 800)
    return () => clearInterval(id)
  }, [])

  // ── REAL SOCKET (swap in at hackathon) ────────────────────────────────────
  // import { io } from 'socket.io-client'
  // useEffect(() => {
  //   const socket = io('http://your-vessel-ip:3001')
  //   socket.on('connect', () => setConnected(true))
  //   socket.on('disconnect', () => setConnected(false))
  //   socket.on('telemetry', (data: Telemetry) => setTelemetry(data))
  //   return () => { socket.disconnect() }
  // }, [])
  // ─────────────────────────────────────────────────────────────────────────

  const sendCmd = useCallback((cmd: string) => {
    const direction = DIRECTIONS[cmd] ?? cmd
    directionRef.current = direction
    setTelemetry(prev => ({ ...prev, direction }))
    const entry: LogEntry = { ts: nowUTC(), cmd, direction }
    setLog(prev => [...prev.slice(-19), entry])
  }, [])

  return { sendCmd, telemetry, connected, log }
}
