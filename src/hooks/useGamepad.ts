import { useEffect, useRef } from 'react'

const DEADZONE  = 0.25
const MAX_SPEED = 5   // knots, for UI display only

// Left stick + D-pad → motor direction
function getMotorCmd(gp: Gamepad): string | null {
  if (gp.buttons[12]?.pressed) return 'F'
  if (gp.buttons[13]?.pressed) return 'B'
  if (gp.buttons[14]?.pressed) return 'L'
  if (gp.buttons[15]?.pressed) return 'R'

  const x = gp.axes[0] ?? 0
  const y = gp.axes[1] ?? 0
  if (Math.abs(x) < DEADZONE && Math.abs(y) < DEADZONE) return null
  if (Math.abs(y) >= Math.abs(x)) return y < 0 ? 'F' : 'B'
  return x < 0 ? 'L' : 'R'
}

// Right stick X axis → servo
function getServoCmd(gp: Gamepad): string | null {
  const x = gp.axes[2] ?? 0
  if (x < -DEADZONE) return 'X'  // left  → 180°
  if (x >  DEADZONE) return 'Z'  // right →   0°
  return null
}

// R2 → 0-255 for ROV, 0-MAX_SPEED for UI
function getR2(gp: Gamepad): number {
  if (gp.mapping === 'standard') return gp.buttons[7]?.value ?? 0
  const axis = gp.axes[5]
  if (axis !== undefined && axis !== 0) return Math.max(0, (axis + 1) / 2)
  return gp.buttons[7]?.value ?? 0
}

export function useGamepad(
  sendCmd: (cmd: string, speed?: number) => void,
  onSpeed?: (speed: number) => void,
) {
  const lastMotor = useRef<string | null>(null)
  const lastServo = useRef<string | null>(null)
  const rafId     = useRef<number | null>(null)

  useEffect(() => {
    function poll() {
      const gamepads = navigator.getGamepads()
      let motorCmd: string | null = null
      let servoCmd: string | null = null
      let r2 = 0

      for (const gp of gamepads) {
        if (!gp) continue
        motorCmd = motorCmd ?? getMotorCmd(gp)
        servoCmd = servoCmd ?? getServoCmd(gp)
        r2       = Math.max(r2, getR2(gp))
      }

      const speed = Math.round(r2 * 255)  // 0-255 for ROV

      // Motor — send on change, stop on release
      if (motorCmd !== lastMotor.current) {
        sendCmd(motorCmd ?? 'S', motorCmd ? speed || 200 : undefined)
        lastMotor.current = motorCmd
      }

      // Servo — send on change, center on release
      if (servoCmd !== lastServo.current) {
        sendCmd(servoCmd ?? 'C')
        lastServo.current = servoCmd
      }

      onSpeed?.(parseFloat((r2 * MAX_SPEED).toFixed(1)))

      rafId.current = requestAnimationFrame(poll)
    }

    const onConnect = () => {
      if (rafId.current === null) rafId.current = requestAnimationFrame(poll)
    }
    const onDisconnect = () => {
      if (navigator.getGamepads().every(g => !g)) {
        if (rafId.current !== null) { cancelAnimationFrame(rafId.current); rafId.current = null }
        if (lastMotor.current !== null) { sendCmd('S'); lastMotor.current = null }
        if (lastServo.current !== null) { sendCmd('C'); lastServo.current = null }
      }
    }

    window.addEventListener('gamepadconnected', onConnect)
    window.addEventListener('gamepaddisconnected', onDisconnect)
    if (navigator.getGamepads().some(g => !!g)) rafId.current = requestAnimationFrame(poll)

    return () => {
      window.removeEventListener('gamepadconnected', onConnect)
      window.removeEventListener('gamepaddisconnected', onDisconnect)
      if (rafId.current !== null) cancelAnimationFrame(rafId.current)
    }
  }, [sendCmd, onSpeed])
}
