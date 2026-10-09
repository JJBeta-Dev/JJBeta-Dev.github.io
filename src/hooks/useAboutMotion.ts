import type { RefObject } from 'react'
import { pauseOffscreen } from '@/helpers/pauseOffscreen'
import { riseIn } from '@/helpers/reveals'
import { gsap, useGSAP } from '@/plugins/gsap'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'

/**
 * Animación de la sección "Sobre mí": el título apilado entra deslizándose, el editor aterriza
 * inclinado, sus palabras se encienden con el scroll (como si se estuvieran escribiendo), el blob
 * de la foto entra con rebote y la esfera lateral flota mientras está visible.
 *
 * @param {import('react').RefObject<HTMLElement | null>} scope - Sección "Sobre mí".
 * @returns {void} No devuelve nada.
 * @example
 * useAboutMotion(section)
 */
export const useAboutMotion = (scope: RefObject<HTMLElement | null>): void => {
  const reduced = usePrefersReducedMotion()

  useGSAP(
    () => {
      const root = scope.current
      if (!root || reduced) return
      riseIn('.stack-title span', '.stack-title', { xPercent: -30, stagger: 0.15, duration: 1.1 }, 'top 80%')
      riseIn('.editor', '.editor', { y: 80, rotate: 4, duration: 1.2 })
      riseIn(
        '.photo-blob',
        '.about__right',
        { scale: 0.4, duration: 1.4, ease: 'elastic.out(1, .6)' },
        'top 75%',
      )
      riseIn('.leaning', '.about__right', { y: 120, duration: 1.2 }, 'top 70%')
      gsap.to(root.querySelectorAll('.reveal .w'), {
        opacity: 1,
        stagger: 0.05,
        ease: 'none',
        scrollTrigger: { trigger: '.editor', start: 'top 90%', end: 'bottom bottom', scrub: true },
      })
      const side = root.querySelector('.side-ball')
      const float = gsap.to('.side-ball', {
        y: -22,
        x: 8,
        duration: 3.2,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
      })
      return side ? pauseOffscreen(float, side) : undefined
    },
    { scope, dependencies: [reduced], revertOnUpdate: true },
  )
}
