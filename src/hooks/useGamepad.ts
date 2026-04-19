import { useEffect, useRef } from 'react'

const DEADZONE = 0.25

function getCmd(gp: Gamepad): string | null {
  // D-pad buttons (standard mapping: 12=Up 13=Down 14=Left 15=Right)
  if (gp.buttons[12]?.pressed) return 'F'
  if (gp.buttons[13]?.pressed) return 'B'
  if (gp.buttons[14]?.pressed) return 'L'
  if (gp.buttons[15]?.pressed) return 'R'

  // Left stick (axis 0 = X, axis 1 = Y)
  const x = gp.axes[0] ?? 0
  const y = gp.axes[1] ?? 0
  if (Math.abs(x) < DEADZONE && Math.abs(y) < DEADZONE) return null

  if (Math.abs(y) >= Math.abs(x)) return y < 0 ? 'F' : 'B'
  return x < 0 ? 'L' : 'R'
}

const MAX_SPEED = 15

function getThrottle(gp: Gamepad): number {
  // Standard mapping (Chrome/macOS DualSense): R2 = buttons[7].value 0..1
  if (gp.mapping === 'standard') {
    return gp.buttons[7]?.value ?? 0
  }
  // Non-standard mapping: triggers often appear as axes[5] in range -1..1
  // (-1 = released, +1 = fully pressed) — convert to 0..1
  const axis = gp.axes[5]
  if (axis !== undefined && axis !== 0) return Math.max(0, (axis + 1) / 2)
  // Fallback: still try buttons[7]
  return gp.buttons[7]?.value ?? 0
}

export function useGamepad(
  sendCmd: (cmd: string) => void,
  onThrottle?: (speed: number) => void,
) {
  const lastCmd = useRef<string | null>(null)
  const rafId = useRef<number | null>(null)

  useEffect(() => {
    function poll() {
      const gamepads = navigator.getGamepads()
      let cmd: string | null = null
      let throttle = 0

      for (const gp of gamepads) {
        if (!gp) continue
        cmd = getCmd(gp)
        throttle = Math.max(throttle, getThrottle(gp))
        if (cmd) break
      }

      if (cmd !== lastCmd.current) {
        if (cmd) sendCmd(cmd)
        else sendCmd('S')
        lastCmd.current = cmd
      }

      onThrottle?.(parseFloat((throttle * MAX_SPEED).toFixed(1)))

      rafId.current = requestAnimationFrame(poll)
    }

    const onConnect = () => {
      if (rafId.current === null) rafId.current = requestAnimationFrame(poll)
    }
    const onDisconnect = () => {
      if (navigator.getGamepads().every(g => !g)) {
        if (rafId.current !== null) { cancelAnimationFrame(rafId.current); rafId.current = null }
        if (lastCmd.current !== null) { sendCmd('S'); lastCmd.current = null }
      }
    }

    window.addEventListener('gamepadconnected', onConnect)
    window.addEventListener('gamepaddisconnected', onDisconnect)

    // Start polling if a gamepad is already connected
    if (navigator.getGamepads().some(g => !!g)) {
      rafId.current = requestAnimationFrame(poll)
    }

    return () => {
      window.removeEventListener('gamepadconnected', onConnect)
      window.removeEventListener('gamepaddisconnected', onDisconnect)
      if (rafId.current !== null) cancelAnimationFrame(rafId.current)
    }
  }, [sendCmd])
}
