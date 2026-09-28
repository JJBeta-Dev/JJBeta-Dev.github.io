import type { RefObject } from 'react'
import { gsap, useGSAP } from '@/plugins/gsap'
import { useFinePointer } from './useFinePointer'
import { usePrefersReducedMotion } from './usePrefersReducedMotion'

/**
 * Mueve un poco cada elemento `[data-depth]` con el ratón; a mayor profundidad, más movimiento, lo que
 * escalona en el espacio las formas, esferas y fotos. Solo con ratón y nunca con movimiento reducido.
 *
 * @param {import('react').RefObject<HTMLElement | null>} scope - Contenedor cuyas capas reaccionan al ratón.
 * @returns {void} No devuelve nada.
 * @example
 * useMouseParallax(main)
 */
export const useMouseParallax = (scope: RefObject<HTMLElement | null>): void => {
  const fine = useFinePointer()
  const reduced = usePrefersReducedMotion()

  useGSAP(
    () => {
      if (!fine || reduced || !scope.current) return
      const layers = [...scope.current.querySelectorAll<HTMLElement>('[data-depth]')].map((element) => ({
        depth: Number(element.dataset.depth),
        x: gsap.quickTo(element, 'x', { duration: 1.2, ease: 'power3' }),
        y: gsap.quickTo(element, 'y', { duration: 1.2, ease: 'power3' }),
      }))
      /**
       * Desplaza cada capa según la posición del puntero respecto al centro de la ventana.
       *
       * @param {PointerEvent} event - Movimiento del puntero.
       * @returns {void} No devuelve nada.
       * @example
       * window.addEventListener('pointermove', onMove)
       */
      const onMove = (event: PointerEvent) => {
        const nx = event.clientX / window.innerWidth - 0.5
        const ny = event.clientY / window.innerHeight - 0.5
        layers.forEach((layer) => {
          layer.x(nx * layer.depth * 40)
          layer.y(ny * layer.depth * 40)
        })
      }
      window.addEventListener('pointermove', onMove, { passive: true })
      return () => window.removeEventListener('pointermove', onMove)
    },
    { scope, dependencies: [fine, reduced] },
  )
}
