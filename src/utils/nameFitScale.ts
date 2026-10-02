/**
 * Calcula cuánto debe encogerse el nombre del hero para que "JJBeta" pueda expandirse a
 * "Jerónimo Jiménez Betancur" sin desbordar el viewport.
 *
 * @param {number} left - Borde izquierdo del nombre en píxeles del viewport.
 * @param {number} width - Ancho actual del nombre en píxeles.
 * @param {readonly number[]} extras - Anchos de las letras que se van a revelar.
 * @param {number} viewport - Ancho del viewport en píxeles.
 * @param {number} gutter - Espacio que se deja libre en el borde derecho.
 * @returns {number} Un factor de escala entre 0 y 1.
 * @example
 * nameFitScale(300, 600, [400, 380, 200], 1440) // 0.706…
 */
export const nameFitScale = (
  left: number,
  width: number,
  extras: readonly number[],
  viewport: number,
  gutter = 24,
): number => {
  const total = width + extras.reduce((sum, extra) => sum + extra, 0)
  return Math.min(1, (viewport - left - gutter) / total)
}
