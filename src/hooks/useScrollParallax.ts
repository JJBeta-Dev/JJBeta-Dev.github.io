import type { RefObject } from 'react'
import { gsap, useGSAP } from '@/plugins/gsap'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'

/**
 * Hace que cada elemento `[data-speed]` se desplace a su propia velocidad durante el scroll, para que
 * las formas decorativas floten en un plano distinto al del contenido.
 *
 * @param {import('react').RefObject<HTMLElement | null>} scope - Contenedor de los elementos que se desplazan.
 * @returns {void} No devuelve nada.
 * @example
 * useScrollParallax(main)
 */
export const useScrollParallax = (scope: RefObject<HTMLElement | null>): void => {
  const reduced = usePrefersReducedMotion()

  useGSAP(
    () => {
      if (reduced || !scope.current) return
      scope.current.querySelectorAll<HTMLElement>('[data-speed]').forEach((element) => {
        gsap.to(element, {
          y: () => Number(element.dataset.speed) * window.innerHeight,
          ease: 'none',
          scrollTrigger: { trigger: element, start: 'top bottom', end: 'bottom top', scrub: true },
        })
      })
    },
    { scope, dependencies: [reduced], revertOnUpdate: true },
  )
}
