import type { RefObject } from 'react'
import { revealTitle } from '@/helpers/reveals'
import { Draggable, gsap, useGSAP } from '@/plugins/gsap'
import { layoutChips } from '@/utils/chipLayout'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'

/**
 * Movimiento de la sección de tecnologías. En escritorio las fichas se reparten por el área de juego,
 * se pueden agarrar y lanzar con inercia, y salen disparadas desde el centro en cuanto el área aparece.
 * En pantallas pequeñas (y con movimiento reducido) quedan ordenadas en filas.
 *
 * @param {import('react').RefObject<HTMLElement | null>} scope - Sección de tecnologías.
 * @returns {void} No devuelve nada.
 * @example
 * useTechPlayground(section)
 */
export const useTechPlayground = (scope: RefObject<HTMLElement | null>): void => {
  const reduced = usePrefersReducedMotion()

  useGSAP(
    () => {
      const root = scope.current
      if (!root || reduced) return
      const title = root.querySelector('.split-title')
      if (title) revealTitle(title)
      const media = gsap.matchMedia()
      media.add('(min-width: 901px)', () => {
        const playground = root.querySelector<HTMLElement>('.playground')
        if (!playground) return
        const chips = [...playground.querySelectorAll<HTMLElement>('.tchip')]
        /**
         * Mide las fichas y las coloca repartidas dentro del área de juego.
         *
         * @returns {void} No devuelve nada.
         * @example
         * window.addEventListener('resize', place)
         */
        const place = () => {
          const sizes = chips.map((chip) => ({ width: chip.offsetWidth, height: chip.offsetHeight }))
          layoutChips(sizes, playground.clientWidth, playground.clientHeight).forEach((spot, i) =>
            gsap.set(chips[i] ?? null, spot),
          )
        }
        place()
        let layer = 10
        const drags = Draggable.create(chips, {
          type: 'x,y',
          bounds: playground,
          inertia: true,
          edgeResistance: 0.85,
          onPress() {
            this.target.style.zIndex = String(++layer)
            gsap.to(this.target, { scale: 1.08, duration: 0.2 })
          },
          onRelease() {
            gsap.to(this.target, { scale: 1, duration: 0.3 })
          },
          onDragStart() {
            gsap.to(this.target, { rotate: gsap.utils.random(-14, 14), duration: 0.3 })
          },
        })
        gsap.from(chips, {
          x: playground.clientWidth / 2 - 60,
          y: playground.clientHeight / 2 - 20,
          scale: 0,
          rotate: 0,
          stagger: { each: 0.04, from: 'random' },
          duration: 1.1,
          ease: 'elastic.out(1, .6)',
          scrollTrigger: { trigger: playground, start: 'top 92%' },
        })
        let pending: gsap.core.Tween | null = null
        /**
         * Reacomoda los chips cuando la ventana deja de cambiar de tamaño.
         *
         * @returns {void} No devuelve nada.
         * @example
         * window.addEventListener('resize', onResize)
         */
        const onResize = () => {
          pending?.kill()
          pending = gsap.delayedCall(0.2, place)
        }
        window.addEventListener('resize', onResize)
        return () => {
          drags.forEach((drag) => drag.kill())
          pending?.kill()
          window.removeEventListener('resize', onResize)
          gsap.set(chips, { clearProps: 'all' })
        }
      })
      return () => media.revert()
    },
    { scope, dependencies: [reduced], revertOnUpdate: true },
  )
}
