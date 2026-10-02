import type { Point } from '@/types/geometry'

/**
 * Construye un trazado SVG suave que pasa por todos los puntos, convirtiendo una spline Catmull-Rom
 * en segmentos Bézier cúbicos. Lo usa el hilo punteado que cose la página.
 *
 * @param {readonly Point[]} points - Puntos ordenados por los que debe pasar la curva (al menos uno).
 * @returns {string} Un atributo `d` de trazado SVG.
 * @example
 * catmullRomPath([[0, 0], [100, 50], [200, 0]]) // 'M0 0C16.66… 200 0'
 */
export const catmullRomPath = (points: readonly Point[]): string => {
  const [first] = points
  if (!first) return ''
  let d = `M${first[0]} ${first[1]}`
  for (let i = 0; i < points.length - 1; i++) {
    const p1 = points[i] as Point
    const p2 = points[i + 1] as Point
    const p0 = points[i - 1] ?? p1
    const p3 = points[i + 2] ?? p2
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6]
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6]
    d += `C${c1[0]} ${c1[1]} ${c2[0]} ${c2[1]} ${p2[0]} ${p2[1]}`
  }
  return d
}
