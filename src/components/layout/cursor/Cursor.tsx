import { useRef } from 'react'
import { useCursor } from '@/hooks/useCursor'

/**
 * Cursor personalizado: un anillo que sigue al puntero con retraso (con etiquetas según el contexto) y un
 * punto preciso.
 *
 * @returns {import('react').JSX.Element} Las dos capas del cursor.
 * @example
 * <Cursor />
 */
export default function Cursor() {
  const ring = useRef<HTMLDivElement>(null)
  const dot = useRef<HTMLDivElement>(null)
  useCursor(ring, dot)

  return (
    <>
      <div className="cursor" ref={ring} aria-hidden="true">
        <span />
      </div>
      <div className="cursor-dot" ref={dot} aria-hidden="true" />
    </>
  )
}
