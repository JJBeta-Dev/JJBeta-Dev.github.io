import Lenis from 'lenis'
import { useEffect, useRef, type RefObject } from 'react'
import { gsap, ScrollTrigger } from '@/plugins/gsap'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'

/**
 * Crea el scroll suave de Lenis sincronizado con el ticker de GSAP y ScrollTrigger, y lo destruye
 * al desmontar. Con movimiento reducido no se crea (se mantiene el scroll nativo). Mientras haya
 * algún bloqueo activo, Lenis queda detenido; al recrearse respeta los bloqueos vigentes.
 *
 * @param {boolean} locked - `true` mientras algún motivo pida pausar el scroll.
 * @returns {RefObject<Lenis | null>} Referencia a la instancia activa (solo para manejadores).
 * @example
 * const lenis = useLenis(locks.size > 0)
 */
export const useLenis = (locked: boolean): RefObject<Lenis | null> => {
  const reduced = usePrefersReducedMotion()
  const lenis = useRef<Lenis | null>(null)

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
      gsap.ticker.lagSmoothing(500, 33)
      instance.destroy()
      lenis.current = null
    }
  }, [reduced])

  useEffect(() => {
    if (locked) lenis.current?.stop()
    else lenis.current?.start()
  }, [locked, reduced])

  return lenis
}
