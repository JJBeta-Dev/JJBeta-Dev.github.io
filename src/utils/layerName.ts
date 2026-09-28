const HELPER_CLASSES = /^(char|w|nx|pop)$/

/**
 * Forma mínima de elemento necesaria para nombrar una capa. Cualquier `Element` del DOM la cumple.
 */
export interface NamedElement {
  tagName: string
  id: string
  classList: Iterable<string>
}

/**
 * Nombra un elemento como Figma nombra las capas en su modo contorno: `tag#id` si tiene id y, si no,
 * `tag.primeraClase`, ignorando las clases auxiliares que añade la división del texto.
 *
 * @param {NamedElement} element - Elemento que se nombra.
 * @returns {string} Un nombre de capa corto.
 * @example
 * layerName(document.querySelector('.editor')!) // 'div.editor'
 */
export const layerName = (element: NamedElement): string => {
  const tag = element.tagName.toLowerCase()
  if (element.id) return `${tag}#${element.id}`
  const className = [...element.classList].find((name) => !HELPER_CLASSES.test(name))
  return className ? `${tag}.${className}` : tag
}
