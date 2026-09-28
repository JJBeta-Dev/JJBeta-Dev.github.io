/**
 * Lee el valor resuelto de un token de diseño (una propiedad personalizada de CSS declarada por el tema).
 *
 * @param {string} name - Nombre del token con los guiones iniciales, como `--color-main`.
 * @returns {string} El valor calculado, por ejemplo `oklch(53.87% 0.2584 286.8)`.
 * @example
 * readToken('--color-hover')
 */
export const readToken = (name: string): string =>
  getComputedStyle(document.documentElement).getPropertyValue(name).trim()
