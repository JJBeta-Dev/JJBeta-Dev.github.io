import type { RefObject } from 'react'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { gsap, useGSAP } from '@/plugins/gsap'

/**
 * Callbacks del precargador.
 */
export interface LoaderCallbacks {
  onReveal: () => void
  onFinish: () => void
}

/**
 * Reproduce el precargador: un contador de 0 a 100 y luego el panel de marca sube. `onReveal` se
 * dispara cuando el panel empieza a irse (la intro del hero arranca debajo) y `onFinish` cuando ya
 * no está. Con movimiento reducido ambos se disparan de inmediato.
 *
 * @param {import('react').RefObject<HTMLElement | null>} scope - Elemento raíz del cargador.
 * @param {LoaderCallbacks} callbacks - Callbacks de revelado y de fin.
 * @returns {void} No devuelve nada.
 * @example
 * useLoader(loader, { onReveal: startIntro, onFinish: () => setGone(true) })
 */
export const useLoader = (
  scope: RefObject<HTMLElement | null>,
  { onReveal, onFinish }: LoaderCallbacks,
): void => {
  const reduced = usePrefersReducedMotion()

  useGSAP(
    () => {
      if (reduced) {
        onReveal()
        onFinish()
        return
      }
      const counter = { value: 0 }
      const label = scope.current?.querySelector('.loader__count')
      gsap
        .timeline()
        .to(counter, {
          value: 100,
          duration: 1.1,
          ease: 'power2.inOut',
          onUpdate: () => {
            if (label) label.textContent = String(Math.round(counter.value))
          },
        })
        .to(
          scope.current,
          { yPercent: -100, duration: 0.9, ease: 'power4.inOut', onStart: onReveal, onComplete: onFinish },
          '+=.1',
        )
    },
    { scope, dependencies: [reduced] },
  )
}
