import { layerName } from '@/utils/layerName'

const SKIPPED_TAGS = new Set(['path', 'tspan', 'text', 'textPath'])
const HELPER_CLASSES = ['char', 'nx', 'w']

/**
 * Escribe la etiqueta "Frame · Nombre — An × Al" que muestra cada sección en el modo contorno beta.
 *
 * @param {HTMLElement} main - Elemento principal.
 * @param {Record<string, string>} names - Nombre visible de cada sección, indexado por su id.
 * @returns {void} No devuelve nada.
 * @example
 * labelFrames(main, { inicio: 'Hero' })
 */
export const labelFrames = (main: HTMLElement, names: Record<string, string>): void => {
  main.querySelectorAll<HTMLElement>(':scope > section').forEach((section) => {
    const name = names[section.id] ?? section.id
    section.dataset.frame = `Frame · ${name}  —  ${Math.round(section.offsetWidth)} × ${Math.round(section.offsetHeight)}`
  })
}

/**
 * Busca la capa que se selecciona bajo el puntero, saliendo de las letras divididas y de los nodos de
 * texto SVG igual que Figma selecciona una capa con sentido.
 *
 * @param {Element | null} element - Elemento bajo el puntero.
 * @returns {Element | null} La capa que se resalta, o `null` sobre la propia página o la UI beta.
 * @example
 * pickLayer(document.elementFromPoint(x, y))
 */
export const pickLayer = (element: Element | null): Element | null => {
  let current = element
  while (
    current &&
    (HELPER_CLASSES.some((name) => current?.classList.contains(name)) || SKIPPED_TAGS.has(current.tagName))
  ) {
    current = current.parentElement
  }
  if (
    !current ||
    current === document.body ||
    current === document.documentElement ||
    current.closest('.wire-ui')
  )
    return null
  return current
}

/**
 * Describe una capa seleccionada para la caja de selección azul.
 *
 * @param {Element} element - Capa seleccionada.
 * @returns {{ box: DOMRect; name: string; size: string }} Su caja, su nombre y su tamaño redondeado.
 * @example
 * describeLayer(editor) // { name: 'div.editor', size: '906 × 516' }
 */
export const describeLayer = (element: Element) => {
  const box = element.getBoundingClientRect()
  return { box, name: layerName(element), size: `${Math.round(box.width)} × ${Math.round(box.height)}` }
}
