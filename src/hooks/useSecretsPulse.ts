import type { RefObject } from 'react'
import { gsap, useGSAP } from '@/plugins/gsap'

/**
 * Hace rebotar el contador de secretos cada vez que se encuentra uno nuevo.
 *
 * @param {import('react').RefObject<HTMLElement | null>} scope - Raíz de la insignia de secretos.
 * @param {number} count - Número de secretos encontrados hasta ahora.
 * @returns {void} No devuelve nada.
 * @example
 * useSecretsPulse(root, found.size)
 */
export const useSecretsPulse = (scope: RefObject<HTMLElement | null>, count: number): void => {
  useGSAP(
    () => {
      if (count === 0) return
      gsap.fromTo('.secrets', { scale: 1.25 }, { scale: 1, duration: 0.6, ease: 'elastic.out(1, .4)' })
    },
    { scope, dependencies: [count] },
  )
}
