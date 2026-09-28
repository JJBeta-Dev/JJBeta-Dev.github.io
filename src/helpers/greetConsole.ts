/**
 * Quinto secreto: un saludo en la consola del navegador para quien inspecciona el sitio.
 *
 * @param {string} title - Saludo principal.
 * @param {string} text - Mensaje de invitación a escribir.
 * @param {string} color - Color del saludo, leído del token de marca.
 * @returns {void} No devuelve nada.
 * @example
 * greetConsole('¡Hola, curioso!', 'Escríbeme: jjbetacode@gmail.com', readToken('--color-main'))
 */
export const greetConsole = (title: string, text: string, color: string): void => {
  console.log(`%c${title}`, `font: 800 22px Poppins, sans-serif; color: ${color}`)
  console.log(`%c${text}`, 'font: 500 13px Montserrat, sans-serif')
}
