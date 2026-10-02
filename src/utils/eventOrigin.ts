/**
 * Datos mínimos de un clic necesarios para saber dónde debe empezar una transición.
 */
export interface ClickLike {
  clientX: number
  clientY: number
  detail: number
  currentTarget: { getBoundingClientRect: () => { left: number; top: number; width: number; height: number } }
}

/**
 * Punto desde el que debe crecer una transición de página: la posición del puntero en clics con
 * ratón o táctiles, o el centro del elemento cuando se activó con el teclado (`detail` es 0).
 *
 * @param {ClickLike} event - Evento de clic (o cualquier objeto con la misma forma).
 * @returns {{ x: number; y: number }} El origen en coordenadas del viewport.
 * @example
 * curtain.cover(eventOrigin(event))
 */
export const eventOrigin = (event: ClickLike): { x: number; y: number } => {
  if (event.detail > 0) return { x: event.clientX, y: event.clientY }
  const box = event.currentTarget.getBoundingClientRect()
  return { x: box.left + box.width / 2, y: box.top + box.height / 2 }
}
