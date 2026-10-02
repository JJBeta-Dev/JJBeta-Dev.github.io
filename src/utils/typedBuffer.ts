/**
 * Añade una tecla pulsada a un búfer circular que solo conserva los últimos `size` caracteres.
 * Sirve para detectar palabras secretas escritas en cualquier parte de la página.
 *
 * @param {string} buffer - Caracteres escritos hasta ahora.
 * @param {string} key - Tecla recién pulsada; solo se guardan los caracteres individuales.
 * @param {number} size - Longitud máxima del búfer (la de la palabra secreta).
 * @returns {string} El búfer actualizado y en minúsculas.
 * @example
 * appendTypedKey('bet', 'A', 4) // 'beta'
 */
export const appendTypedKey = (buffer: string, key: string, size: number): string =>
  key.length === 1 ? (buffer + key.toLowerCase()).slice(-size) : buffer
