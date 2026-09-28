import type { RefObject } from 'react'
import { pauseOffscreen } from '@/helpers/pauseOffscreen'
import { gsap, ScrollTrigger, useGSAP } from '@/plugins/gsap'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'

/**
 * Marquesina infinita de la banda de borde a borde: el texto siempre avanza hacia la derecha, se
 * acelera con la velocidad del scroll y vuelve suavemente a su velocidad de crucero. Se pausa
 * mientras está fuera de pantalla.
 *
 * @param {import('react').RefObject<HTMLElement | null>} scope - Elemento de la banda (contiene `.band__track`).
 * @returns {void} No devuelve nada.
 * @example
 * useBandMarquee(band)
 */
export const useBandMarquee = (scope: RefObject<HTMLElement | null>): void => {
  const reduced = usePrefersReducedMotion()

  useGSAP(
    () => {
      const root = scope.current
      if (!root || reduced) return
      const band = gsap.fromTo(
        '.band__track',
        { xPercent: -50 },
        { xPercent: 0, duration: 32, ease: 'none', repeat: -1 },
      )
      const stop = pauseOffscreen(band, root)
      ScrollTrigger.create({
        trigger: root,
        start: 'top bottom',
        end: 'bottom top',
        onUpdate: (self) =>
          gsap.to(band, {
            timeScale: 1 + Math.min(4, Math.abs(self.getVelocity()) / 700),
            duration: 0.25,
            overwrite: true,
            onComplete: () => {
              gsap.to(band, { timeScale: 1, duration: 1.2, ease: 'power2.out' })
            },
          }),
      })
      return stop
    },
    { scope, dependencies: [reduced], revertOnUpdate: true },
  )
}
