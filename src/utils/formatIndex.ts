/**
 * Formatea una posición como número de dos cifras, como en la numeración editorial de las tarjetas.
 *
 * @param {number} index - Posición empezando en cero.
 * @returns {string} Número con relleno a dos cifras, empezando en `01`.
 * @example
 * formatIndex(0) // '01'
 */
export const formatIndex = (index: number): string => String(index + 1).padStart(2, '0')
