import { useEffect, useEffectEvent, useState, type RefObject } from 'react'
import { useTranslation } from 'react-i18next'
import { SECTIONS } from '@/data/navigation'
import { describeLayer, labelFrames, pickLayer } from '@/helpers/wireFrames'
import { gsap, ScrollTrigger } from '@/plugins/gsap'
import { usePrefersReducedMotion } from './usePrefersReducedMotion'
import { useSecrets } from './useSecrets'
import { useTypedWord } from './useTypedWord'

/**
 * Easter egg "beta": al escribir la palabra, la página pasa a una vista de contornos al estilo Figma
 * (sin rellenos, rejilla de 12 columnas, etiquetas de frames y una selección azul que sigue al puntero).
 * Una línea de escaneo barre la pantalla durante el cambio. Escape o el botón de la barra lo desactivan.
 *
 * @param {import('react').RefObject<HTMLElement | null>} overlay - Raíz de la interfaz beta (rejilla,
 * caja de selección, línea de escaneo y barra de herramientas).
 * @returns {{ on: boolean, grid: boolean, measure: boolean, toggleGrid: () => void,
 * toggleMeasure: () => void, exit: () => void }} Si está activo, los interruptores de rejilla y
 * medidas, y una acción para salir.
 * @example
 * const wire = useWireMode(overlay)
 */
export const useWireMode = (overlay: RefObject<HTMLElement | null>) => {
  const { t } = useTranslation()
  const reduced = usePrefersReducedMotion()
  const secrets = useSecrets()
  const [on, setOn] = useState(false)
  const [grid, setGrid] = useState(true)
  const [measure, setMeasure] = useState(true)

  /**
   * Activa o desactiva el modo beta; salvo con movimiento reducido, lo hace tras el barrido de la
   * línea de escaneo.
   *
   * @param {boolean} next - `true` para activar el modo, `false` para salir.
   * @returns {void} No devuelve nada.
   * @example
   * switchTo(false)
   */
  const switchTo = (next: boolean) => {
    if (reduced || !overlay.current) return setOn(next)
    const scan = overlay.current.querySelector('.wire-scan')
    gsap
      .timeline()
      .set(scan, { yPercent: -100, opacity: 1 })
      .to(scan, {
        yPercent: 100,
        duration: 0.7,
        ease: 'power2.inOut',
        /**
         * Aplica el cambio de modo cuando la línea termina de barrer la pantalla.
         *
         * @returns {void} No devuelve nada.
         * @example
         * onComplete()
         */
        onComplete: () => setOn(next),
      })
      .set(scan, { opacity: 0 })
  }

  const exitFromKeyboard = useEffectEvent(() => switchTo(false))

  useTypedWord('beta', () => {
    switchTo(!on)
    secrets.reveal('beta')
  })

  useEffect(() => {
    const body = document.body
    body.classList.toggle('wire', on)
    body.classList.toggle('wire-no-grid', on && !grid)
    body.classList.toggle('wire-no-measure', on && !measure)
  }, [on, grid, measure])

  useEffect(() => {
    const root = overlay.current
    const main = document.getElementById('contenido')
    if (!on || !root || !main) return
    const names = Object.fromEntries(SECTIONS.map(({ id }) => [id, t(`wire.frames.${id}`)]))
    const selection = root.querySelector<HTMLElement>('.wire-sel')
    const label = root.querySelector('.wire-name')
    const size = root.querySelector('.wire-size')
    /**
     * Vuelve a colocar las etiquetas de frame sobre cada sección.
     *
     * @returns {void} No devuelve nada.
     * @example
     * window.addEventListener('resize', relabel)
     */
    const relabel = () => labelFrames(main, names)
    /**
     * Mueve la caja de selección sobre la capa que hay bajo el puntero y muestra su nombre y tamaño.
     *
     * @param {PointerEvent} event - Movimiento del puntero.
     * @returns {void} No devuelve nada.
     * @example
     * window.addEventListener('pointermove', onMove)
     */
    const onMove = (event: PointerEvent) => {
      const layer = pickLayer(document.elementFromPoint(event.clientX, event.clientY))
      if (!selection) return
      if (!layer) {
        selection.style.opacity = '0'
        return
      }
      const described = describeLayer(layer)
      gsap.set(selection, {
        x: described.box.left,
        y: described.box.top,
        width: described.box.width,
        height: described.box.height,
        opacity: 1,
      })
      if (label) label.textContent = described.name
      if (size) size.textContent = described.size
    }
    /**
     * Sale del modo beta al pulsar Escape.
     *
     * @param {KeyboardEvent} event - Tecla pulsada.
     * @returns {void} No devuelve nada.
     * @example
     * document.addEventListener('keydown', onKey)
     */
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') exitFromKeyboard()
    }
    relabel()
    ScrollTrigger.refresh()
    if (!reduced)
      gsap.fromTo(root.querySelector('.wire-bar'), { y: -80 }, { y: 0, duration: 0.5, ease: 'back.out(2)' })
    window.addEventListener('pointermove', onMove)
    window.addEventListener('resize', relabel)
    document.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('resize', relabel)
      document.removeEventListener('keydown', onKey)
      if (selection) selection.style.opacity = '0'
      ScrollTrigger.refresh()
    }
  }, [on, overlay, reduced, t])

  return {
    on,
    grid,
    measure,
    /**
     * Muestra u oculta la rejilla de columnas.
     *
     * @returns {void} No devuelve nada.
     * @example
     * wire.toggleGrid()
     */
    toggleGrid: () => setGrid((value) => !value),
    /**
     * Muestra u oculta las medidas de la selección.
     *
     * @returns {void} No devuelve nada.
     * @example
     * wire.toggleMeasure()
     */
    toggleMeasure: () => setMeasure((value) => !value),
    /**
     * Sale del modo beta.
     *
     * @returns {void} No devuelve nada.
     * @example
     * wire.exit()
     */
    exit: () => switchTo(false),
  }
}
