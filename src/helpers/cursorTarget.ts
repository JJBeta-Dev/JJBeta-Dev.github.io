/**
 * Lo que debe mostrar el cursor personalizado sobre un elemento dado.
 */
export interface CursorTarget {
  label: string
  link: boolean
}

/**
 * Resuelve el estado del cursor para el elemento bajo el puntero: una etiqueta de texto cuando un
 * ancestro declara `data-cursor`, o el anillo de "enlace" sobre cualquier cosa clicable.
 *
 * @param {Element | null} element - Elemento bajo el puntero (o `null`).
 * @returns {CursorTarget} La etiqueta (vacía si no hay) y si el objetivo es clicable.
 * @example
 * cursorTarget(document.querySelector('.playground')) // { label: 'Arrastra', link: false }
 */
export const cursorTarget = (element: Element | null): CursorTarget => {
  const labelled = element?.closest<HTMLElement>('[data-cursor]')
  if (labelled) return { label: labelled.dataset.cursor ?? '', link: false }
  return { label: '', link: Boolean(element?.closest('a, button, [data-cursor-link], .pop')) }
}
