/**
 * Un punto 2D como `[x, y]` en píxeles CSS.
 */
export type Point = readonly [x: number, y: number]

/**
 * Un punto de la estela de cinta con la marca de tiempo (ms) en que se registró.
 */
export interface TimedPoint {
  x: number
  y: number
  t: number
}
