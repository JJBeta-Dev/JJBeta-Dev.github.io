import type { Point, TimedPoint } from '@/types/geometry'

/**
 * Los dos bordes de la estela de cinta, listos para dibujarse como una forma cerrada.
 */
export interface RibbonOutline {
  left: Point[]
  right: Point[]
}

/**
 * Calcula el contorno de la estela de cinta: cada punto se desplaza sobre su normal con un ancho
 * grueso en la punta (punto más nuevo) que se afina hasta cero en la cola (punto más antiguo).
 *
 * @param {readonly TimedPoint[]} points - Puntos de la estela ordenados del más antiguo al más nuevo.
 * @param {number} now - Marca de tiempo actual en milisegundos.
 * @param {number} life - Cuánto vive un punto, en milisegundos.
 * @param {number} maxWidth - Medio ancho de la cinta en la punta, en píxeles.
 * @returns {RibbonOutline} Bordes izquierdo y derecho; el derecho va de la punta a la cola para cerrar la forma.
 * @example
 * const { left, right } = ribbonOutline(points, performance.now(), 900)
 */
export const ribbonOutline = (
  points: readonly TimedPoint[],
  now: number,
  life: number,
  maxWidth = 11,
): RibbonOutline => {
  const left: Point[] = []
  const right: Point[] = []
  const last = points.length - 1
  points.forEach((point, i) => {
    const before = points[Math.max(0, i - 1)] as TimedPoint
    const after = points[Math.min(last, i + 1)] as TimedPoint
    const nx = -(after.y - before.y)
    const ny = after.x - before.x
    const length = Math.hypot(nx, ny) || 1
    const age = (now - point.t) / life
    const width = Math.max(0, 1 - age) ** 1.2 * maxWidth * Math.min(1, i / 4 + 0.2)
    left.push([point.x + (nx / length) * width, point.y + (ny / length) * width])
    right.push([point.x - (nx / length) * width, point.y - (ny / length) * width])
  })
  return { left, right: right.reverse() }
}

/**
 * Descarta los puntos de la estela más antiguos que `life`, conservando el orden del arreglo.
 *
 * @param {readonly TimedPoint[]} points - Puntos de la estela ordenados del más antiguo al más nuevo.
 * @param {number} now - Marca de tiempo actual en milisegundos.
 * @param {number} life - Cuánto vive un punto, en milisegundos.
 * @returns {TimedPoint[]} Los puntos que siguen vivos.
 * @example
 * pruneTrail([{ x: 0, y: 0, t: 0 }], 1000, 900) // []
 */
export const pruneTrail = (points: readonly TimedPoint[], now: number, life: number): TimedPoint[] =>
  points.filter((point) => now - point.t <= life)
