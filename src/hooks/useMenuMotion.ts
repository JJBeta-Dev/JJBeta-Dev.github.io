import type { RefObject } from 'react'
import { gsap, useGSAP } from '@/plugins/gsap'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'

/**
 * Hace subir los enlaces del menú de forma escalonada cada vez que el menú se abre.
 *
 * @param {import('react').RefObject<HTMLElement | null>} scope - Raíz de la navegación.
 * @param {boolean} open - Si el menú está abierto.
 * @returns {void} No devuelve nada.
 * @example
 * useMenuMotion(root, open)
 */
export const useMenuMotion = (scope: RefObject<HTMLElement | null>, open: boolean): void => {
  const reduced = usePrefersReducedMotion()

  useGSAP(
    () => {
      if (!open || reduced) return
      gsap.fromTo(
        '.menu li',
        { yPercent: 120, opacity: 0 },
        { yPercent: 0, opacity: 1, stagger: 0.06, duration: 0.7, delay: 0.15, ease: 'power4.out' },
      )
    },
    { scope, dependencies: [open, reduced] },
  )
}
