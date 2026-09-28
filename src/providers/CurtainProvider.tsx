import { useRef, type ReactNode } from 'react'
import { CurtainContext, type CurtainApi, type CurtainOrigin } from '@/contexts/CurtainContext'
import { curtainTimeline, finished, type CurtainStep } from '@/helpers/curtainTimelines'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'

/**
 * Cortina del color de marca para las transiciones: crece como un círculo desde el punto del clic,
 * sube para revelar la vista nueva y baja desde abajo al cerrarla. Con movimiento reducido cada
 * paso se resuelve al instante. Los `ref` guardan el elemento animado y un candado que evita
 * transiciones simultáneas; ninguno de los dos se usa para renderizar.
 *
 * @param {{ children: ReactNode }} props - Subárbol de la aplicación.
 * @returns {import('react').JSX.Element} El provider con el elemento de la cortina.
 * @example
 * <CurtainProvider><App /></CurtainProvider>
 */
export default function CurtainProvider({ children }: { children: ReactNode }) {
  const curtain = useRef<HTMLDivElement>(null)
  const busy = useRef(false)
  const reduced = usePrefersReducedMotion()

  /**
   * Reproduce un paso de la cortina, o no hace nada con movimiento reducido.
   *
   * @param {CurtainStep} step - Paso a reproducir.
   * @param {CurtainOrigin} origin - Punto de origen del paso `cover`.
   * @returns {Promise<void>} Se resuelve al terminar el paso.
   * @example
   * play('lift')
   */
  const play = (step: CurtainStep, origin: CurtainOrigin = { x: 0, y: 0 }): Promise<void> =>
    reduced || !curtain.current ? Promise.resolve() : finished(curtainTimeline(curtain.current, step, origin))

  const api: CurtainApi = {
    cover: (origin = { x: window.innerWidth / 2, y: window.innerHeight / 2 }) => play('cover', origin),
    lift: () => play('lift'),
    drop: () => play('drop'),
    close: () => play('close'),
    transition: async (task) => {
      if (busy.current) return
      busy.current = true
      try {
        await task()
      } finally {
        busy.current = false
      }
    },
  }

  return (
    <CurtainContext value={api}>
      {children}
      <div className="curtain" ref={curtain} aria-hidden="true" />
    </CurtainContext>
  )
}
