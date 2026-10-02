import { useEffect, useEffectEvent, type RefObject } from 'react'
import { drawRibbon, ribbonPalettes } from '@/helpers/drawRibbon'
import { fitCanvas } from '@/helpers/fitCanvas'
import { gsap } from '@/plugins/gsap'
import type { TimedPoint } from '@/types/geometry'
import { pruneTrail } from '@/utils/ribbonOutline'
import { useSecrets } from '@/hooks/useSecrets'

const LIFE = 900
const TRAVEL_FOR_SECRET = 600
const INTERACTIVE = 'a, button, .tchip, .editor, .playground, input, textarea, .hint, .case, .foot'
const TEXT = 'p, h1, h2, h3, li, span, b, strong, small, .card-p'

/**
 * Easter egg de la estela de cinta: al mantener pulsado el botón del ratón y arrastrar sobre el
 * fondo vacío se dibuja una cinta sedosa que sigue al puntero y se desvanece. Arrastrar lo
 * suficiente revela el secreto. Nunca empieza sobre texto ni sobre elementos interactivos.
 *
 * @param {import('react').RefObject<HTMLCanvasElement | null>} canvas - Canvas a pantalla completa donde
 * se pinta la estela.
 * @returns {void} No devuelve nada.
 * @example
 * useRibbonTrail(canvas)
 */
export const useRibbonTrail = (canvas: RefObject<HTMLCanvasElement | null>): void => {
  const secrets = useSecrets()
  const onLongTrail = useEffectEvent(() => secrets.reveal('paint'))

  useEffect(() => {
    const element = canvas.current
    const context = element?.getContext('2d')
    if (!element || !context) return
    const ratio = Math.min(window.devicePixelRatio || 1, 2)
    const palettes = ribbonPalettes()
    let points: TimedPoint[] = []
    let painting = false
    let active = false
    let onBrand = false
    let travel = 0
    let head = { x: 0, y: 0 }
    let target = { x: 0, y: 0 }

    /**
     * Reajusta el canvas cuando cambia el tamaño de la ventana.
     *
     * @returns {void} No devuelve nada.
     * @example
     * window.addEventListener('resize', resize)
     */
    const resize = () => fitCanvas(element, ratio)
    /**
     * Empieza a pintar si se pulsa el botón principal del ratón sobre el fondo vacío.
     *
     * @param {PointerEvent} event - Pulsación del puntero.
     * @returns {void} No devuelve nada.
     * @example
     * window.addEventListener('pointerdown', onDown)
     */
    const onDown = (event: PointerEvent) => {
      const origin = event.target as Element
      if (
        event.pointerType !== 'mouse' ||
        event.button !== 0 ||
        origin.closest(INTERACTIVE) ||
        origin.closest(TEXT)
      )
        return
      event.preventDefault()
      painting = true
      active = true
      onBrand = document.body.classList.contains('menu-open')
      head = { x: event.clientX, y: event.clientY }
      target = { ...head }
      document.body.classList.add('painting')
    }
    /**
     * Deja de pintar al soltar el botón; la estela sigue desvaneciéndose.
     *
     * @returns {void} No devuelve nada.
     * @example
     * window.addEventListener('pointerup', onUp)
     */
    const onUp = () => {
      painting = false
      document.body.classList.remove('painting')
    }
    /**
     * Actualiza el destino de la cinta y acumula la distancia recorrida para el secreto.
     *
     * @param {PointerEvent} event - Movimiento del puntero.
     * @returns {void} No devuelve nada.
     * @example
     * window.addEventListener('pointermove', onMove)
     */
    const onMove = (event: PointerEvent) => {
      if (!painting) return
      travel += Math.hypot(event.clientX - target.x, event.clientY - target.y)
      target = { x: event.clientX, y: event.clientY }
      if (travel > TRAVEL_FOR_SECRET) onLongTrail()
    }
    /**
     * Fotograma de la animación: suaviza la cabeza, añade puntos, descarta los caducados y
     * redibuja la cinta. Se detiene cuando ya no queda nada que pintar.
     *
     * @returns {void} No devuelve nada.
     * @example
     * gsap.ticker.add(tick)
     */
    const tick = () => {
      if (!active) return
      const now = performance.now()
      if (painting) {
        head = { x: head.x + (target.x - head.x) * 0.5, y: head.y + (target.y - head.y) * 0.5 }
        const last = points[points.length - 1]
        if (!last || Math.hypot(head.x - last.x, head.y - last.y) > 1.5) points.push({ ...head, t: now })
      }
      points = pruneTrail(points, now, LIFE)
      context.clearRect(0, 0, element.width, element.height)
      if (points.length < 3) {
        if (!painting && !points.length) active = false
        return
      }
      drawRibbon(context, points, {
        now,
        life: LIFE,
        ratio,
        painting,
        palette: palettes[onBrand ? 'brand' : 'light'],
      })
    }

    resize()
    window.addEventListener('resize', resize)
    window.addEventListener('pointerdown', onDown)
    window.addEventListener('pointerup', onUp)
    window.addEventListener('pointermove', onMove, { passive: true })
    gsap.ticker.add(tick)
    return () => {
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('pointermove', onMove)
      gsap.ticker.remove(tick)
    }
  }, [canvas])
}
