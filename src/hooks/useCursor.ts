import { useEffect, type RefObject } from 'react'
import { cursorTarget } from '@/helpers/cursorTarget'
import { gsap } from '@/plugins/gsap'
import { useFinePointer } from '@/hooks/useFinePointer'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'

/**
 * Controla el cursor personalizado: un anillo que sigue al puntero con un leve retraso, un punto
 * preciso, etiquetas contextuales (`data-cursor`) y un estado de pulsación. El objetivo se reevalúa
 * al hacer scroll, porque el elemento bajo un puntero quieto cambia. Solo funciona con ratón.
 *
 * @param {import('react').RefObject<HTMLElement | null>} ring - Elemento del anillo (contiene el span de la etiqueta).
 * @param {import('react').RefObject<HTMLElement | null>} dot - Elemento del punto.
 * @returns {void} No devuelve nada.
 * @example
 * useCursor(ring, dot)
 */
export const useCursor = (ring: RefObject<HTMLElement | null>, dot: RefObject<HTMLElement | null>): void => {
  const fine = useFinePointer()
  const reduced = usePrefersReducedMotion()

  useEffect(() => {
    const ringElement = ring.current
    const dotElement = dot.current
    const label = ringElement?.querySelector('span')
    if (!fine || !ringElement || !dotElement || !label) return
    const body = document.body
    body.classList.add('has-cursor')
    const lag = reduced ? 0.01 : 0.16
    const ringX = gsap.quickTo(ringElement, 'x', { duration: lag, ease: 'power3' })
    const ringY = gsap.quickTo(ringElement, 'y', { duration: lag, ease: 'power3' })
    const dotX = gsap.quickTo(dotElement, 'x', { duration: 0.06 })
    const dotY = gsap.quickTo(dotElement, 'y', { duration: 0.06 })
    let last: PointerEvent | null = null
    let queued = false

    /**
     * Aplica al anillo la etiqueta y el estado de enlace del elemento bajo el puntero.
     *
     * @param {Element | null} element - Elemento bajo el puntero.
     * @returns {void} No devuelve nada.
     * @example
     * apply(event.target as Element)
     */
    const apply = (element: Element | null) => {
      const target = cursorTarget(element)
      ringElement.classList.toggle('is-label', Boolean(target.label))
      ringElement.classList.toggle('is-link', target.link)
      label.textContent = target.label
    }
    /**
     * Mueve el anillo y el punto hacia la posición del puntero y lo muestra en el primer movimiento.
     *
     * @param {PointerEvent} event - Evento de movimiento del puntero.
     * @returns {void} No devuelve nada.
     * @example
     * window.addEventListener('pointermove', onMove)
     */
    const onMove = (event: PointerEvent) => {
      if (!body.classList.contains('cursor-on')) {
        gsap.set([ringElement, dotElement], { x: event.clientX, y: event.clientY })
        body.classList.add('cursor-on')
      }
      last = event
      ringX(event.clientX)
      ringY(event.clientY)
      dotX(event.clientX)
      dotY(event.clientY)
    }
    /**
     * Reevalúa el objetivo cuando el puntero entra en un elemento nuevo.
     *
     * @param {PointerEvent} event - Evento `pointerover` del documento.
     * @returns {void} No devuelve nada.
     * @example
     * document.addEventListener('pointerover', onOver)
     */
    const onOver = (event: PointerEvent) => apply(event.target as Element)
    /**
     * Activa el estado de pulsación del anillo.
     *
     * @returns {void} No devuelve nada.
     * @example
     * window.addEventListener('pointerdown', onDown)
     */
    const onDown = () => ringElement.classList.add('is-down')
    /**
     * Quita el estado de pulsación del anillo.
     *
     * @returns {void} No devuelve nada.
     * @example
     * window.addEventListener('pointerup', onUp)
     */
    const onUp = () => ringElement.classList.remove('is-down')
    /**
     * Oculta el cursor cuando el puntero sale de la ventana.
     *
     * @returns {void} No devuelve nada.
     * @example
     * document.documentElement.addEventListener('pointerleave', onLeave)
     */
    const onLeave = () => body.classList.remove('cursor-on')
    /**
     * Programa, una vez por fotograma, la reevaluación del elemento bajo el puntero durante el scroll.
     *
     * @returns {void} No devuelve nada.
     * @example
     * window.addEventListener('scroll', onScroll, { passive: true, capture: true })
     */
    const onScroll = () => {
      if (queued || !last) return
      queued = true
      requestAnimationFrame(() => {
        queued = false
        if (last) apply(document.elementFromPoint(last.clientX, last.clientY))
      })
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('pointerover', onOver)
    window.addEventListener('pointerdown', onDown)
    window.addEventListener('pointerup', onUp)
    window.addEventListener('scroll', onScroll, { passive: true, capture: true })
    document.documentElement.addEventListener('pointerleave', onLeave)
    return () => {
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerover', onOver)
      window.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('scroll', onScroll, { capture: true })
      document.documentElement.removeEventListener('pointerleave', onLeave)
      body.classList.remove('has-cursor', 'cursor-on')
    }
  }, [fine, reduced, ring, dot])
}
