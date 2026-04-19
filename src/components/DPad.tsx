import { useState, useEffect } from 'react'

interface Props {
  sendCmd: (cmd: string) => void
  direction: string
}

const KEY_CMD: Record<string, string> = {
  w: 'F', arrowup: 'F',
  s: 'B', arrowdown: 'B',
  a: 'L', arrowleft: 'L',
  d: 'R', arrowright: 'R',
}

function DBtn({
  label, cmd, sendCmd, active,
}: {
  label: string; cmd: string; sendCmd: (c: string) => void; active: boolean
}) {
  return (
    <button
      tabIndex={-1}
      className="flex items-center justify-center rounded text-xl font-mono select-none transition-all duration-75"
      style={{
        background: active ? 'rgba(0,255,144,0.08)' : 'var(--color-bg-surface)',
        border: active ? '2px solid var(--color-accent-green)' : '1px solid var(--color-border-accent)',
        color: active ? 'var(--color-accent-green)' : 'var(--color-text-primary)',
        boxShadow: active ? '0 0 10px rgba(0,255,144,0.35)' : 'none',
        minWidth: '64px',
        minHeight: '64px',
        touchAction: 'none',
      }}
      onMouseDown={(e) => e.preventDefault()}
      onPointerDown={(e) => { e.preventDefault(); e.currentTarget.setPointerCapture(e.pointerId); sendCmd(cmd) }}
      onPointerUp={() => sendCmd('S')}
      onPointerLeave={() => sendCmd('S')}
    >
      {label}
    </button>
  )
}

export function DPad({ sendCmd, direction }: Props) {
  const [activeCmd, setActiveCmd] = useState<string | null>(null)

  // Track keyboard presses for visual highlight
  useEffect(() => {
    const onDown = (e: KeyboardEvent) => {
      const cmd = KEY_CMD[e.key.toLowerCase()]
      if (cmd) setActiveCmd(cmd)
    }
    const onUp = (e: KeyboardEvent) => {
      if (KEY_CMD[e.key.toLowerCase()]) setActiveCmd(null)
    }
    window.addEventListener('keydown', onDown)
    window.addEventListener('keyup', onUp)
    return () => {
      window.removeEventListener('keydown', onDown)
      window.removeEventListener('keyup', onUp)
    }
  }, [])

  const wrappedSend = (cmd: string) => {
    if (cmd === 'S') setActiveCmd(null)
    else setActiveCmd(cmd)
    sendCmd(cmd)
  }

  return (
    <div className="flex flex-col items-center gap-2 p-4">
      <div className="text-xs font-mono tracking-widest mb-1" style={{ color: 'var(--color-text-muted)' }}>
        CONTROL
      </div>
      {/* Row 1: up */}
      <div className="flex gap-2">
        <div style={{ width: 64, height: 64 }} />
        <DBtn label="▲" cmd="F" sendCmd={wrappedSend} active={activeCmd === 'F'} />
        <div style={{ width: 64, height: 64 }} />
      </div>
      {/* Row 2: left / stop / right */}
      <div className="flex gap-2">
        <DBtn label="◀" cmd="L" sendCmd={wrappedSend} active={activeCmd === 'L'} />
        <button
          tabIndex={-1}
          className="flex items-center justify-center rounded font-mono text-sm select-none"
          style={{
            background: 'var(--color-bg-elevated)',
            border: '2px solid var(--color-accent-green)',
            color: 'var(--color-accent-green)',
            minWidth: '64px',
            minHeight: '64px',
            touchAction: 'none',
          }}
          onMouseDown={(e) => e.preventDefault()}
          onPointerDown={() => wrappedSend('S')}
        >
          ■
        </button>
        <DBtn label="▶" cmd="R" sendCmd={wrappedSend} active={activeCmd === 'R'} />
      </div>
      {/* Row 3: down */}
      <div className="flex gap-2">
        <div style={{ width: 64, height: 64 }} />
        <DBtn label="▼" cmd="B" sendCmd={wrappedSend} active={activeCmd === 'B'} />
        <div style={{ width: 64, height: 64 }} />
      </div>

      <div className="text-xs font-mono mt-2" style={{ color: 'var(--color-text-muted)' }}>
        DIR: <span style={{ color: 'var(--color-accent-cyan)' }}>{direction.toUpperCase()}</span>
      </div>
    </div>
  )
}
