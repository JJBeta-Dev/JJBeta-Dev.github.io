/**
 * Copia un texto al portapapeles del sistema.
 *
 * @param {string} text - Texto que se copia.
 * @returns {Promise<boolean>} `true` si se copió, `false` si el portapapeles no está disponible o se denegó.
 * @example
 * if (!(await copyText('jjbetacode@gmail.com'))) location.href = 'mailto:jjbetacode@gmail.com'
 */
export const copyText = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    return false
  }
}
