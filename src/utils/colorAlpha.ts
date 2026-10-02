/**
 * Añade un canal alfa a un color `oklch(...)`, para las API de canvas que no pueden leer
 * propiedades personalizadas de CSS ni colores relativos.
 *
 * @param {string} color - Color en forma `oklch(L C H)`, tal como se resuelve desde un token de diseño.
 * @param {number} alpha - Opacidad entre 0 y 1.
 * @returns {string} El mismo color con el canal alfa.
 * @example
 * withAlpha('oklch(53.87% 0.2584 286.8)', 0.5) // 'oklch(53.87% 0.2584 286.8 / 0.5)'
 */
export const withAlpha = (color: string, alpha: number): string =>
  color.trim().replace(/\s*(\/\s*[\d.]+)?\s*\)$/, ` / ${alpha})`)
