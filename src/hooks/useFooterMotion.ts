import type { RefObject } from 'react'
import { gsap, useGSAP } from '@/plugins/gsap'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'

/**
 * Animación del pie de página: la firma gigante "JJBeta" en contorno sube letra por letra. Después
 * se limpian las transformaciones para que el efecto hover en CSS de cada letra siga funcionando.
 *
 * @param {import('react').RefObject<HTMLElement | null>} scope - Elemento del pie de página.
 * @returns {void} No devuelve nada.
 * @example
 * useFooterMotion(footer)
 */
export const useFooterMotion = (scope: RefObject<HTMLElement | null>): void => {
  const reduced = usePrefersReducedMotion()

  useGSAP(
    () => {
      if (reduced) return
      gsap.from('.foot__mark span', {
        yPercent: 90,
        opacity: 0,
        stagger: 0.06,
        duration: 1.1,
        ease: 'power4.out',
        clearProps: 'transform,opacity',
        scrollTrigger: { trigger: '.foot__mark', start: 'top 98%' },
      })
    },
    { scope, dependencies: [reduced] },
  )
}
