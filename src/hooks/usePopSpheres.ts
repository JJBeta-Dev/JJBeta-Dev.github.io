import { useEffect, useEffectEvent, type RefObject } from 'react'
import { burstAt } from '@/helpers/confetti'
import { gsap } from '@/plugins/gsap'
import { useSecrets } from '@/hooks/useSecrets'

const POPS_FOR_SECRET = 3

/**
 * Easter egg de las esferas moradas: al hacer clic en cualquier `.pop` del ámbito, estalla en
 * pequeñas esferas y vuelve a crecer dos segundos después. Reventar tres revela el secreto.
 *
 * @param {import('react').RefObject<HTMLElement | null>} scope - Contenedor de las esferas que se pueden reventar.
 * @returns {void} No devuelve nada.
 * @example
 * usePopSpheres(main)
 */
export const usePopSpheres = (scope: RefObject<HTMLElement | null>): void => {
  const secrets = useSecrets()
  const onThirdPop = useEffectEvent(() => secrets.reveal('pop'))

  useEffect(() => {
    const root = scope.current
    if (!root) return
    let pops = 0
    /**
     * Revienta la esfera pulsada con confeti, la hace reaparecer y cuenta los estallidos.
     *
     * @param {MouseEvent} event - Clic dentro del contenedor.
     * @returns {void} No devuelve nada.
     * @example
     * root.addEventListener('click', onClick)
     */
    const onClick = (event: MouseEvent) => {
      const sphere = (event.target as Element).closest<HTMLElement>('.pop')
      if (!sphere || sphere.dataset.popped) return
      sphere.dataset.popped = 'true'
      const box = sphere.getBoundingClientRect()
      burstAt(box.left + box.width / 2, box.top + box.height / 2)
      gsap
        .timeline()
        .to(sphere, { scale: 1.3, duration: 0.12, ease: 'power2.out' })
        .to(sphere, { scale: 0, opacity: 0, duration: 0.18, ease: 'power2.in' })
        .to(sphere, {
          scale: 1,
          opacity: 1,
          duration: 1,
          ease: 'elastic.out(1, .5)',
          delay: 2.2,
          onComplete: () => delete sphere.dataset.popped,
        })
      pops += 1
      if (pops === POPS_FOR_SECRET) onThirdPop()
    }
    root.addEventListener('click', onClick)
    return () => root.removeEventListener('click', onClick)
  }, [scope])
}
