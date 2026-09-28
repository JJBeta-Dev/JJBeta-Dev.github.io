import type { RefObject } from 'react'
import { pauseOffscreen } from '@/helpers/pauseOffscreen'
import { gsap, SplitText, useGSAP } from '@/plugins/gsap'
import { usePrefersReducedMotion } from './usePrefersReducedMotion'

/**
 * Entrada de la página cuando se va el precargador: el saludo sube letra por letra, el nombre
 * aparece de golpe, las esferas caen y rebotan, las formas crecen y la foto sentada entra
 * deslizándose. La insignia de scroll sigue girando, pero solo mientras está en pantalla.
 *
 * @param {import('react').RefObject<HTMLElement | null>} scope - Elemento principal (hero más la capa decorativa).
 * @param {boolean} ready - `true` cuando el cargador empieza a revelar la página.
 * @returns {void} No devuelve nada.
 * @example
 * useIntro(main, introReady)
 */
export const useIntro = (scope: RefObject<HTMLElement | null>, ready: boolean): void => {
  const reduced = usePrefersReducedMotion()

  useGSAP(
    () => {
      const root = scope.current
      if (!root || reduced) return
      const badge = root.querySelector('.badge-spin')
      const spin = gsap.to('.badge-spin > svg', {
        rotate: 360,
        duration: 18,
        repeat: -1,
        ease: 'none',
        transformOrigin: '50% 50%',
      })
      const stopSpin = badge ? pauseOffscreen(spin, badge) : undefined
      if (!ready) return stopSpin
      const welcome = new SplitText('.welcome', { type: 'chars', charsClass: 'char' })
      gsap
        .timeline({ defaults: { ease: 'power4.out' } })
        .from(welcome.chars, { yPercent: 120, rotate: 14, opacity: 0, stagger: 0.045, duration: 1.1 })
        .from(
          '.me-name > .char',
          { yPercent: 80, scale: 0.3, opacity: 0, stagger: 0.06, duration: 1.2, ease: 'elastic.out(1, .55)' },
          '-=.7',
        )
        .from('.me .soy', { scale: 0, rotate: -40, duration: 0.8, ease: 'back.out(3)' }, '-=.9')
        .from('.hero__meta > *', { y: 30, opacity: 0, stagger: 0.1, duration: 0.9 }, '-=.8')
        .from(
          '.hero__now',
          { y: 40, rotate: -10, opacity: 0, duration: 1, ease: 'elastic.out(1, .7)' },
          '-=.8',
        )
        .from('.welcome__note', { scale: 0, rotate: -30, duration: 0.7, ease: 'back.out(3)' }, '-=.7')
        .from('.decor .ball, .hball', { y: -420, duration: 1.4, stagger: 0.12, ease: 'bounce.out' }, 0.2)
        .from(
          '.decor img',
          { scale: 0.6, opacity: 0, duration: 1.4, stagger: 0.08, transformOrigin: 'top left' },
          0,
        )
        .from('.hero__sit', { x: 260, opacity: 0, duration: 1.3 }, '-=1.2')
        .from('.badge-spin', { scale: 0, rotate: -180, duration: 1, ease: 'back.out(2)' }, '-=1')
      return stopSpin
    },
    { scope, dependencies: [ready, reduced] },
  )
}
