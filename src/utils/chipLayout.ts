/**
 * Posición e inclinación de un chip dentro del playground.
 */
export interface ChipPlacement {
  x: number
  y: number
  rotate: number
}

/**
 * Tamaño de un chip en píxeles.
 */
export interface ChipSize {
  width: number
  height: number
}

/**
 * Reparte los chips de tecnologías sobre una cuadrícula para que parezcan tirados en una mesa, sin
 * tapar nunca la etiqueta del playground ni salirse de sus límites.
 *
 * @param {readonly ChipSize[]} sizes - Tamaño medido de cada chip, en orden.
 * @param {number} width - Ancho del playground en píxeles.
 * @param {number} height - Alto del playground en píxeles.
 * @param {() => number} random - Fuente de aleatoriedad en `[0, 1)`; inyectable para pruebas deterministas.
 * @param {number} columns - Número de columnas de la cuadrícula.
 * @returns {ChipPlacement[]} Una ubicación por chip.
 * @example
 * layoutChips([{ width: 120, height: 48 }], 1000, 470)[0] // { x: …, y: …, rotate: … }
 */
export const layoutChips = (
  sizes: readonly ChipSize[],
  width: number,
  height: number,
  random: () => number = Math.random,
  columns = 5,
): ChipPlacement[] => {
  const rows = Math.ceil(sizes.length / columns)
  const cellWidth = (width - 60) / columns
  const cellHeight = (height - 110) / rows
  /**
   * Devuelve un número aleatorio entre dos límites.
   *
   * @param {number} min - Límite inferior.
   * @param {number} max - Límite superior.
   * @returns {number} Un valor dentro de `[min, max)`.
   * @example
   * between(-8, 8)
   */
  const between = (min: number, max: number) => min + random() * (max - min)
  return sizes.map((size, i) => {
    const column = i % columns
    const row = Math.floor(i / columns)
    return {
      x: 30 + column * cellWidth + between(0, Math.max(0, cellWidth - size.width - 10)),
      y: 70 + row * cellHeight + between(0, Math.max(0, cellHeight - size.height - 6)),
      rotate: between(-8, 8),
    }
  })
}
