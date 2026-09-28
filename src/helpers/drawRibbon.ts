import type { Point, TimedPoint } from '@/types/geometry'
import { withAlpha } from '@/utils/colorAlpha'
import { ribbonOutline } from '@/utils/ribbonOutline'
import { readToken } from '@/helpers/readToken'

/**
 * Colores de un tema de la cinta.
 */
export interface RibbonPalette {
  from: string
  mid: string
  to: string
  glow: string
  tip: string
}

/**
 * Construye las paletas de la cinta a partir de los tokens de diseño: de magenta a morado sobre fondos
 * claros y blanco sobre el menú con el color de marca.
 *
 * @returns {Record<'light' | 'brand', RibbonPalette>} Las paletas clara y de marca.
 * @example
 * const palettes = ribbonPalettes()
 */
export const ribbonPalettes = (): Record<'light' | 'brand', RibbonPalette> => {
  const hover = readToken('--color-hover')
  const main = readToken('--color-main')
  const white = readToken('--color-on-brand')
  const deep = readToken('--color-deep')
  return {
    light: {
      from: withAlpha(hover, 0),
      mid: withAlpha(hover, 0.55),
      to: withAlpha(main, 0.95),
      glow: withAlpha(main, 0.35),
      tip: main,
    },
    brand: {
      from: withAlpha(white, 0),
      mid: withAlpha(white, 0.45),
      to: withAlpha(white, 0.95),
      glow: withAlpha(deep, 0.25),
      tip: white,
    },
  }
}

/**
 * Dibuja un fotograma de la estela de cinta en un canvas: una forma afilada con degradado, un brillo
 * suave y una punta luminosa.
 *
 * @param {CanvasRenderingContext2D} context - Contexto 2D del canvas a pantalla completa.
 * @param {readonly TimedPoint[]} points - Puntos de la estela del más antiguo al más nuevo (al menos tres).
 * @param {{ now: number; life: number; ratio: number; painting: boolean; palette: RibbonPalette }} frame -
 *   Tiempo actual, vida de los puntos, densidad de píxeles, estado de pintado y paleta.
 * @returns {void} No devuelve nada.
 * @example
 * drawRibbon(context, points, { now, life: 900, ratio: 2, painting: true, palette })
 */
export const drawRibbon = (
  context: CanvasRenderingContext2D,
  points: readonly TimedPoint[],
  frame: { now: number; life: number; ratio: number; painting: boolean; palette: RibbonPalette },
): void => {
  const { now, life, ratio, painting, palette } = frame
  const first = points[0] as TimedPoint
  const tip = points[points.length - 1] as TimedPoint
  const { left, right } = ribbonOutline(points, now, life)
  const gradient = context.createLinearGradient(
    first.x * ratio,
    first.y * ratio,
    tip.x * ratio,
    tip.y * ratio,
  )
  gradient.addColorStop(0, palette.from)
  gradient.addColorStop(0.45, palette.mid)
  gradient.addColorStop(1, palette.to)

  /**
   * Traza un borde de la cinta con curvas cuadráticas entre los puntos medios.
   *
   * @param {readonly Point[]} edge - Puntos del borde que se traza.
   * @param {boolean} move - Si es `true`, empieza un subtrazado nuevo; si no, continúa el actual.
   * @returns {void} No devuelve nada.
   * @example
   * trace(left, true)
   */
  const trace = (edge: readonly Point[], move: boolean) =>
    edge.forEach(([x, y], i) => {
      if (i === 0) {
        if (move) context.moveTo(x * ratio, y * ratio)
        else context.lineTo(x * ratio, y * ratio)
        return
      }
      const [px, py] = edge[i - 1] as Point
      context.quadraticCurveTo(px * ratio, py * ratio, ((px + x) / 2) * ratio, ((py + y) / 2) * ratio)
    })

  context.beginPath()
  trace(left, true)
  trace(right, false)
  context.closePath()
  context.fillStyle = gradient
  context.shadowColor = palette.glow
  context.shadowBlur = 14 * ratio
  context.fill()
  context.shadowBlur = 0

  const fade = painting ? 1 : Math.max(0, 1 - (now - tip.t) / life)
  context.beginPath()
  context.arc(tip.x * ratio, tip.y * ratio, 5 * ratio * fade, 0, Math.PI * 2)
  context.fillStyle = palette.tip
  context.fill()
}
