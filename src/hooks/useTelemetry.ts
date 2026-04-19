import { useSocket } from './useSocket'

export function useTelemetry() {
  const { sendCmd, telemetry, connected, log } = useSocket()
  return {
    speed: telemetry.speed,
    heading: telemetry.heading,
    signal: telemetry.signal,
    direction: telemetry.direction,
    sendCmd,
    connected,
    log,
  }
}
