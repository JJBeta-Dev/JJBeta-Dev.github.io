import { useRef } from 'react'
import { useRibbonTrail } from '@/hooks/useRibbonTrail'

/**
 * Canvas a pantalla completa para el easter egg de la estela de cinta.
 *
 * @returns {import('react').JSX.Element} El canvas.
 * @example
 * <InkTrail />
 */
export default function InkTrail() {
  const canvas = useRef<HTMLCanvasElement>(null)
  useRibbonTrail(canvas)
  return <canvas className="ink" ref={canvas} aria-hidden="true" />
}
