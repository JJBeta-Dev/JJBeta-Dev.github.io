import type { RefObject } from 'react'
import { gsap, useGSAP } from '@/plugins/gsap'
import { useFinePointer } from '@/hooks/useFinePointer'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'

/**
 * Hace que cada elemento `[data-magnetic]` del ámbito se incline hacia el puntero y vuelva a su
 * sitio con un rebote elástico al salir. `data-magnetic="soft"` atrae menos. Solo con ratón.
 *
 * @param {import('react').RefObject<HTMLElement | null>} scope - Contenedor cuyos elementos magnéticos se activan.
 * @returns {void} No devuelve nada.
 * @example
 * useMagnetic(section)
 */
export const useMagnetic = (scope: RefObject<HTMLElement | null>): void => {
  const fine = useFinePointer()
  const reduced = usePrefersReducedMotion()

  useGSAP(
    () => {
      if (!fine || reduced || !scope.current) return
      const cleanups = [...scope.current.querySelectorAll<HTMLElement>('[data-magnetic]')].map((element) => {
        const moveX = gsap.quickTo(element, 'x', { duration: 0.6, ease: 'elastic.out(1, .4)' })
        const moveY = gsap.quickTo(element, 'y', { duration: 0.6, ease: 'elastic.out(1, .4)' })
        const strength = element.dataset.magnetic === 'soft' ? 0.2 : 0.35
        /**
         * Desplaza el elemento hacia el puntero según la distancia a su centro.
         *
         * @param {PointerEvent} event - Movimiento del puntero sobre el elemento.
         * @returns {void} No devuelve nada.
         * @example
         * element.addEventListener('pointermove', onMove)
         */
        const onMove = (event: PointerEvent) => {
          const box = element.getBoundingClientRect()
          moveX((event.clientX - box.left - box.width / 2) * strength)
          moveY((event.clientY - box.top - box.height / 2) * strength)
        }
        /**
         * Devuelve el elemento a su posición original cuando el puntero sale.
         *
         * @returns {void} No devuelve nada.
         * @example
         * element.addEventListener('pointerleave', onLeave)
         */
        const onLeave = () => {
          moveX(0)
          moveY(0)
        }
        element.addEventListener('pointermove', onMove)
        element.addEventListener('pointerleave', onLeave)
        return () => {
          element.removeEventListener('pointermove', onMove)
          element.removeEventListener('pointerleave', onLeave)
        }
      })
      return () => cleanups.forEach((cleanup) => cleanup())
    },
    { scope, dependencies: [fine, reduced] },
  )
}
