import { useRef, type ReactNode } from 'react'
import { CurtainContext, type CurtainApi, type CurtainOrigin } from '@/contexts/CurtainContext'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { gsap } from '@/plugins/gsap'

/**
 * Cortina con el color de marca para las transiciones de página: crece como un círculo desde el punto del
 * clic, sube para revelar la vista nueva y cae desde abajo al cerrarla.
 * Con movimiento reducido, cada paso se resuelve al instante.
 *
 * @param {{ children: ReactNode }} props - Subárbol de la aplicación.
 * @returns {import('react').JSX.Element} El provider con el elemento de la cortina.
 * @example
 * <CurtainProvider><App /></CurtainProvider>
 */
export default function CurtainProvider({ children }: { children: ReactNode }) {
  const curtain = useRef<HTMLDivElement>(null)
  const reduced = usePrefersReducedMotion()

  /**
   * Ejecuta un paso de la cortina construyendo su timeline sobre el elemento.
   *
   * @param {(timeline: gsap.core.Timeline, element: HTMLDivElement) => void} build - Arma la animación del paso.
   * @returns {Promise<void>} Se resuelve cuando termina la animación (al instante con movimiento reducido).
   * @example
   * play((timeline, element) => timeline.to(element, { yPercent: 0 }))
   */
  const play = (build: (timeline: gsap.core.Timeline, element: HTMLDivElement) => void): Promise<void> => {
    const element = curtain.current
    if (reduced || !element) return Promise.resolve()
    const timeline = gsap.timeline()
    build(timeline, element)
    return new Promise((resolve) => timeline.eventCallback('onComplete', () => resolve()))
  }

  const api: CurtainApi = {
    /**
     * Cubre la pantalla con un círculo que crece desde el origen indicado.
     *
     * @param {CurtainOrigin} origin - Punto del viewport desde el que crece; por defecto, el centro.
     * @returns {Promise<void>} Se resuelve cuando la cortina cubre la pantalla.
     * @example
     * await curtain.cover(eventOrigin(event))
     */
    cover: ({ x, y }: CurtainOrigin = { x: window.innerWidth / 2, y: window.innerHeight / 2 }) =>
      play((timeline, element) =>
        timeline
          .set(element, { visibility: 'visible', yPercent: 0, clipPath: `circle(0% at ${x}px ${y}px)` })
          .to(element, { clipPath: `circle(150% at ${x}px ${y}px)`, duration: 0.75, ease: 'power3.inOut' }),
      ),
    /**
     * Sube la cortina para revelar la vista nueva.
     *
     * @returns {Promise<void>} Se resuelve cuando la cortina se ha ocultado.
     * @example
     * await curtain.lift()
     */
    lift: () =>
      play((timeline, element) =>
        timeline
          .to(element, { yPercent: -100, duration: 0.8, ease: 'power4.inOut', delay: 0.05 })
          .set(element, { visibility: 'hidden', yPercent: 0 }),
      ),
    /**
     * Deja caer la cortina desde abajo hasta cubrir la pantalla.
     *
     * @returns {Promise<void>} Se resuelve cuando la cortina cubre la pantalla.
     * @example
     * await curtain.drop()
     */
    drop: () =>
      play((timeline, element) =>
        timeline
          .set(element, { visibility: 'visible', clipPath: 'circle(150% at 50% 50%)', yPercent: 100 })
          .to(element, { yPercent: 0, duration: 0.65, ease: 'power4.inOut' }),
      ),
    /**
     * Cierra la cortina encogiéndola en un círculo hacia el centro.
     *
     * @returns {Promise<void>} Se resuelve cuando la cortina se ha ocultado.
     * @example
     * await curtain.close()
     */
    close: () =>
      play((timeline, element) =>
        timeline
          .to(element, {
            clipPath: 'circle(0% at 50% 50%)',
            duration: 0.7,
            ease: 'power3.inOut',
            delay: 0.05,
          })
          .set(element, { visibility: 'hidden' }),
      ),
  }

  return (
    <CurtainContext value={api}>
      {children}
      <div className="curtain" ref={curtain} aria-hidden="true" />
    </CurtainContext>
  )
}
