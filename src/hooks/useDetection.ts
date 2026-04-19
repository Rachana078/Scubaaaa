import { useEffect, useRef, useState, useCallback } from 'react'

const API_KEY  = import.meta.env.VITE_ROBOFLOW_API_KEY as string
const MODEL    = import.meta.env.VITE_ROBOFLOW_MODEL as string
const VERSION  = import.meta.env.VITE_ROBOFLOW_VERSION as string

export interface Detection {
  class: string
  confidence: number
  /** center x, normalised 0-1 */
  x: number
  /** center y, normalised 0-1 */
  y: number
  /** normalised 0-1 */
  width: number
  /** normalised 0-1 */
  height: number
}

const ENDPOINT = `https://detect.roboflow.com/${MODEL}/${VERSION}?api_key=${API_KEY}`

export function useDetection(
  sourceRef: React.RefObject<HTMLImageElement | HTMLVideoElement | null>,
  enabled: boolean,
  intervalMs = 2000,
) {
  const [detections, setDetections] = useState<Detection[]>([])
  const inFlight = useRef(false)

  const runDetect = useCallback(async () => {
    const el = sourceRef.current
    if (!el || inFlight.current) return

    const isVideo = el instanceof HTMLVideoElement
    const w = isVideo ? el.videoWidth  : (el as HTMLImageElement).naturalWidth  || el.clientWidth
    const h = isVideo ? el.videoHeight : (el as HTMLImageElement).naturalHeight || el.clientHeight
    if (!w || !h) return

    const canvas = document.createElement('canvas')
    canvas.width  = w
    canvas.height = h
    canvas.getContext('2d')?.drawImage(el, 0, 0)
    const base64 = canvas.toDataURL('image/jpeg', 0.8).split(',')[1]
    if (!base64) return

    inFlight.current = true
    try {
      const res  = await fetch(ENDPOINT, {
        method:  'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body:    base64,
      })
      const data = await res.json()
      const imgW: number = data.image?.width  ?? w
      const imgH: number = data.image?.height ?? h

      const preds: Detection[] = (data.predictions ?? []).map((p: {
        class: string; confidence: number; x: number; y: number; width: number; height: number
      }) => ({
        class:      p.class,
        confidence: p.confidence,
        x:          p.x / imgW,
        y:          p.y / imgH,
        width:      p.width  / imgW,
        height:     p.height / imgH,
      }))
      setDetections(preds)
    } catch {
      /* ignore transient network errors */
    } finally {
      inFlight.current = false
    }
  }, [sourceRef])

  useEffect(() => {
    if (!enabled) { setDetections([]); return }
    const id = setInterval(runDetect, intervalMs)
    return () => clearInterval(id)
  }, [enabled, intervalMs, runDetect])

  return detections
}
