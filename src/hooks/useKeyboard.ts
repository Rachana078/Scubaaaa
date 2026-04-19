import { useEffect } from 'react'

const KEY_CMD: Record<string, string> = {
  w: 'F', arrowup: 'F',
  s: 'B', arrowdown: 'B',
  a: 'L', arrowleft: 'L',
  d: 'R', arrowright: 'R',
}

export function useKeyboard(sendCmd: (cmd: string) => void) {
  useEffect(() => {
    const onDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA') return
      const cmd = KEY_CMD[e.key.toLowerCase()]
      if (cmd) {
        e.preventDefault()
        sendCmd(cmd)
      }
    }

    const onUp = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA') return
      if (KEY_CMD[e.key.toLowerCase()]) {
        sendCmd('S')
      }
    }

    window.addEventListener('keydown', onDown)
    window.addEventListener('keyup', onUp)
    return () => {
      window.removeEventListener('keydown', onDown)
      window.removeEventListener('keyup', onUp)
    }
  }, [sendCmd])
}
