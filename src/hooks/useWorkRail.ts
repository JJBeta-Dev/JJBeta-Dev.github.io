import type { RefObject } from 'react'
import { revealTitle } from '@/helpers/reveals'
import { gsap, useGSAP } from '@/plugins/gsap'
import { usePrefersReducedMotion } from './usePrefersReducedMotion'

/**
 * Movimiento de la sección de proyectos. En escritorio la galería queda fijada y se desplaza en
 * horizontal, las tarjetas se inclinan según la velocidad del scroll y se enderezan al entrar. En
 * pantallas pequeñas las tarjetas simplemente se apilan.
 *
 * @param {import('react').RefObject<HTMLElement | null>} scope - Sección de proyectos.
 * @returns {void} No devuelve nada.
 * @example
 * useWorkRail(section)
 */
export const useWorkRail = (scope: RefObject<HTMLElement | null>): void => {
  const reduced = usePrefersReducedMotion()

  useGSAP(
    () => {
      const root = scope.current
      if (!root || reduced) return
      const title = root.querySelector('.split-title')
      if (title) revealTitle(title)
      const media = gsap.matchMedia()
      media.add('(min-width: 901px)', () => {
        const track = root.querySelector<HTMLElement>('.track')
        const rail = root.querySelector('.rail')
        if (!track || !rail) return
        const cards = [...track.querySelectorAll('.card-p, .card-end')]
        /**
         * Distancia horizontal que debe recorrer la pista para mostrar todas las tarjetas.
         *
         * @returns {number} Distancia en píxeles.
         * @example
         * const total = distance()
         */
        const distance = () => track.scrollWidth - window.innerWidth
        const skew = gsap.quickTo(cards, 'skewX', { duration: 0.5, ease: 'power3' })
        const move = gsap.to(track, {
          /**
           * Posición horizontal final de la pista.
           *
           * @returns {number} Desplazamiento negativo en píxeles.
           * @example
           * x()
           */
          x: () => -distance(),
          ease: 'none',
          scrollTrigger: {
            trigger: rail,
            start: 'center center',
            /**
             * Final del tramo fijado, tan largo como el recorrido de la pista.
             *
             * @returns {string} Posición relativa de fin, p. ej. `'+=1200'`.
             * @example
             * end()
             */
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
            /**
             * Inclina las tarjetas según la velocidad del scroll, con un límite de ±7 grados.
             *
             * @param {ScrollTrigger} self - Disparador con la velocidad actual.
             * @returns {gsap.core.Tween} La animación de inclinación.
             * @example
             * onUpdate(trigger)
             */
            onUpdate: (self) => skew(gsap.utils.clamp(-7, 7, self.getVelocity() / -400)),
            /**
             * Endereza las tarjetas al salir del tramo por abajo.
             *
             * @returns {gsap.core.Tween} La animación de inclinación.
             * @example
             * onLeave()
             */
            onLeave: () => skew(0),
            /**
             * Endereza las tarjetas al salir del tramo por arriba.
             *
             * @returns {gsap.core.Tween} La animación de inclinación.
             * @example
             * onLeaveBack()
             */
            onLeaveBack: () => skew(0),
          },
        })
        cards.forEach((card, i) => {
          gsap.from(card, {
            rotate: i % 2 ? 6 : -6,
            y: 60,
            opacity: 0.3,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: card,
              containerAnimation: move,
              start: 'left 95%',
              end: 'left 55%',
              scrub: true,
            },
          })
        })
        return () => skew(0)
      })
      return () => media.revert()
    },
    { scope, dependencies: [reduced] },
  )
}
