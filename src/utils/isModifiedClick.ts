/**
 * Datos mínimos de un clic para saber si el visitante quiere abrir el enlace a su manera.
 */
export interface ClickModifiers {
  button: number
  metaKey: boolean
  ctrlKey: boolean
  shiftKey: boolean
  altKey: boolean
}

/**
 * Indica si un clic debe dejarse al navegador: con Ctrl/Cmd (pestaña nueva), Shift (ventana
 * nueva), Alt (descarga) o con un botón distinto al principal. En esos casos no se intercepta el
 * enlace con transiciones ni scroll suave.
 *
 * @param {ClickModifiers} event - Evento de clic (o cualquier objeto con la misma forma).
 * @returns {boolean} `true` cuando el navegador debe manejar el clic.
 * @example
 * if (isModifiedClick(event)) return
 */
export const isModifiedClick = (event: ClickModifiers): boolean =>
  event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey
