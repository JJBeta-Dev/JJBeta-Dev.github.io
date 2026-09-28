import type { RefObject } from 'react'
import { revealTitle } from '@/helpers/reveals'
import { gsap, useGSAP } from '@/plugins/gsap'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'

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
          x: () => -distance(),
          ease: 'none',
          scrollTrigger: {
            trigger: rail,
            start: 'center center',
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => skew(gsap.utils.clamp(-7, 7, self.getVelocity() / -400)),
            onLeave: () => skew(0),
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
        /**
         * Al enfocar con el teclado una tarjeta fuera de pantalla, desplaza la página hasta el punto
         * del recorrido horizontal donde la tarjeta queda visible.
         *
         * @param {FocusEvent} event - Foco que entra en la galería.
         * @returns {void} No devuelve nada.
         * @example
         * track.addEventListener('focusin', onFocus)
         */
        const onFocus = (event: FocusEvent) => {
          const card = (event.target as Element).closest<HTMLElement>('.card-p, .card-end')
          const trigger = move.scrollTrigger
          if (!card || !trigger) return
          const progress = gsap.utils.clamp(0, 1, (card.offsetLeft - window.innerWidth * 0.1) / distance())
          window.scrollTo({ top: trigger.start + (trigger.end - trigger.start) * progress })
        }
        track.addEventListener('focusin', onFocus)
        return () => {
          track.removeEventListener('focusin', onFocus)
          skew(0)
        }
      })
      return () => media.revert()
    },
    { scope, dependencies: [reduced] },
  )
}
