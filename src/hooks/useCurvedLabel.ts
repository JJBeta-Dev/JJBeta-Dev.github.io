import { useEffect, useState, type RefObject } from 'react'
import { blobArcPath, type BlobArc } from '@/utils/blobArcPath'

const MARGIN = 70

/**
 * Geometría de la etiqueta curva, posicionada sobre el blob de la foto.
 */
export interface CurvedLabelGeometry extends BlobArc {
  left: number
  top: number
}

/**
 * Mantiene la etiqueta curva "Diseñador UX/UI · Desarrollador Front-End" pegada al borde inferior
 * interno del blob de la foto, recalculando el arco cada vez que el blob cambia de tamaño.
 *
 * @param {import('react').RefObject<HTMLElement | null>} blob - Elemento orgánico del blob de la foto.
 * @returns {CurvedLabelGeometry | null} El trazado del arco y la caja del SVG, o `null` hasta que se
 * haya medido el blob.
 * @example
 * const arc = useCurvedLabel(blob)
 */
export const useCurvedLabel = (blob: RefObject<HTMLElement | null>): CurvedLabelGeometry | null => {
  const [geometry, setGeometry] = useState<CurvedLabelGeometry | null>(null)

  useEffect(() => {
    const element = blob.current
    if (!element) return
    /**
     * Mide el blob y guarda la geometría del arco con su posición.
     *
     * @returns {void} No devuelve nada.
     * @example
     * new ResizeObserver(measure)
     */
    const measure = () =>
      setGeometry({
        ...blobArcPath(element.offsetWidth, element.offsetHeight, MARGIN),
        left: element.offsetLeft - MARGIN,
        top: element.offsetTop - MARGIN,
      })
    const observer = new ResizeObserver(measure)
    observer.observe(element)
    document.fonts?.ready.then(measure)
    return () => observer.disconnect()
  }, [blob])

  return geometry
}
