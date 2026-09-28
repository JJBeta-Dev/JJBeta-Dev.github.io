import Lenis from 'lenis'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { ScrollContext, type ScrollLock } from '@/contexts/ScrollContext'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { gsap, ScrollTrigger } from '@/plugins/gsap'

/**
 * Scroll suave con Lenis, sincronizado con el ticker de GSAP y ScrollTrigger. Con movimiento reducido se
 * mantiene el scroll nativo. El scroll se pausa mientras haya algún bloqueo activo (menú o caso de estudio).
 * La instancia de Lenis vive en un `ref` porque solo la usan los manejadores y efectos, nunca el render.
 *
 * @param {{ children: ReactNode }} props - Subárbol de la aplicación.
 * @returns {import('react').JSX.Element} El provider de scroll.
 * @example
 * <ScrollProvider><HomeView /></ScrollProvider>
 */
export default function ScrollProvider({ children }: { children: ReactNode }) {
  const reduced = usePrefersReducedMotion()
  const lenis = useRef<Lenis | null>(null)
  const [locks, setLocks] = useState<ReadonlySet<ScrollLock>>(new Set())

  useEffect(() => {
    if (reduced) return
    const instance = new Lenis({ lerp: 0.09 })
    /**
     * Avanza Lenis en cada tick de GSAP.
     *
     * @param {number} time - Tiempo del ticker de GSAP, en segundos.
     * @returns {void} No devuelve nada.
     * @example
     * gsap.ticker.add(tick)
     */
    const tick = (time: number) => instance.raf(time * 1000)
    instance.on('scroll', ScrollTrigger.update)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)
    lenis.current = instance
    return () => {
      gsap.ticker.remove(tick)
      instance.destroy()
      lenis.current = null
    }
  }, [reduced])

  useEffect(() => {
    if (locks.size) lenis.current?.stop()
    else lenis.current?.start()
  }, [locks])

  /**
   * Desplaza la página hasta un elemento y le pasa el foco sin volver a desplazar.
   *
   * @param {string | HTMLElement} target - Selector CSS o elemento de destino.
   * @returns {void} No devuelve nada.
   * @example
   * scrollTo('#contacto')
   */
  const scrollTo = (target: string | HTMLElement) => {
    const element = typeof target === 'string' ? document.querySelector<HTMLElement>(target) : target
    if (!element) return
    if (lenis.current) lenis.current.scrollTo(element, { offset: 0, duration: 1.4 })
    else element.scrollIntoView()
    element.setAttribute('tabindex', '-1')
    element.focus({ preventScroll: true })
  }

  /**
   * Crea una sola vez la función estable que activa o libera un bloqueo de scroll.
   *
   * @returns {(reason: ScrollLock, locked: boolean) => void} La función `setLock`.
   * @example
   * setLock('menu', true)
   */
  const [setLock] = useState(
    () => (reason: ScrollLock, locked: boolean) =>
      setLocks((previous) => {
        if (previous.has(reason) === locked) return previous
        const next = new Set(previous)
        if (locked) next.add(reason)
        else next.delete(reason)
        return next
      }),
  )

  return <ScrollContext value={{ scrollTo, setLock }}>{children}</ScrollContext>
}
