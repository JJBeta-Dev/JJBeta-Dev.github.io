import type { RefObject } from 'react'
import { revealTitle, riseIn } from '@/helpers/reveals'
import { useGSAP } from '@/plugins/gsap'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'

/**
 * Animación de la sección de contacto: el título sube letra por letra, el botón redondo del correo
 * entra girando con rebote y los enlaces sociales lo siguen en cascada.
 *
 * @param {import('react').RefObject<HTMLElement | null>} scope - Sección de contacto.
 * @returns {void} No devuelve nada.
 * @example
 * useContactMotion(section)
 */
export const useContactMotion = (scope: RefObject<HTMLElement | null>): void => {
  const reduced = usePrefersReducedMotion()

  useGSAP(
    () => {
      const root = scope.current
      if (!root || reduced) return
      const title = root.querySelector('.split-title')
      if (title) revealTitle(title)
      riseIn(
        '.contact__links .slink',
        '.contact__links',
        { y: 40, stagger: 0.08, duration: 0.8, ease: 'power3.out' },
        'top 90%',
      )
      riseIn(
        '.mag',
        root,
        { scale: 0, rotate: -90, opacity: 1, duration: 1.2, ease: 'elastic.out(1, .5)' },
        'top 60%',
      )
    },
    { scope, dependencies: [reduced], revertOnUpdate: true },
  )
}
