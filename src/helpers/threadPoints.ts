import type { Point } from '@/types/geometry'

/**
 * Mide los puntos de anclaje de los dos hilos punteados respecto al elemento principal: el primero va
 * de la foto sentada al título de proyectos y el segundo, del final de la galería al botón de contacto.
 *
 * @param {HTMLElement} main - Elemento principal que contiene todas las secciones.
 * @returns {[Point[], Point[]] | null} Las dos listas de puntos, o `null` si falta alguna sección.
 * @example
 * const threads = threadPoints(main)
 */
export const threadPoints = (main: HTMLElement): [Point[], Point[]] | null => {
  const origin = main.getBoundingClientRect()
  const width = main.scrollWidth
  /**
   * Busca un elemento dentro del elemento principal.
   *
   * @param {string} selector - Selector CSS.
   * @returns {Element | null} El elemento encontrado, o `null`.
   * @example
   * find('.hero')
   */
  const find = (selector: string) => main.querySelector(selector)
  /**
   * Calcula un punto relativo a la caja de un elemento, en coordenadas del elemento principal.
   *
   * @param {string} selector - Selector CSS del elemento de referencia.
   * @param {number} fx - Fracción horizontal de la caja (0 a 1).
   * @param {number} fy - Fracción vertical de la caja (0 a 1).
   * @param {number} dx - Desplazamiento horizontal extra en píxeles.
   * @returns {Point | null} El punto, o `null` si el elemento no existe.
   * @example
   * at('.hero__sit', 0.15, 0.55)
   */
  const at = (selector: string, fx = 0.5, fy = 0.5, dx = 0): Point | null => {
    const element = find(selector)
    if (!element) return null
    const box = element.getBoundingClientRect()
    return [box.left - origin.left + box.width * fx + dx, box.top - origin.top + box.height * fy]
  }
  const heroBottom = at('.hero', 0, 1)?.[1]
  const workBottom = at('.work', 0, 1)?.[1]
  /**
   * Calcula un punto a una fracción del ancho total y a cierta distancia vertical de una base.
   *
   * @param {number | undefined} base - Coordenada vertical de referencia.
   * @param {number} fx - Fracción del ancho del elemento principal.
   * @param {number} dy - Desplazamiento vertical en píxeles.
   * @returns {Point | null} El punto, o `null` si no hay base.
   * @example
   * below(heroBottom, 0.62, -60)
   */
  const below = (base: number | undefined, fx: number, dy: number): Point | null =>
    base === undefined ? null : [width * fx, base + dy]
  const first = [
    at('.hero__sit', 0.15, 0.55),
    below(heroBottom, 0.62, -60),
    below(heroBottom, 0.3, 40),
    at('#t-work', 0, 0.1, -30),
  ]
  const second = [
    below(workBottom, 0.82, -30),
    below(workBottom, 0.7, 60),
    at('.editor__side', 0.5, 0.25),
    at('.about__right', 0.2, 0.95),
    at('.tech__intro', 0.05, 0),
    at('.playground', 0.02, 0.6),
    at('#t-contact', 0.98, 0.3, 40),
    at('.mag', 0.5, 0.5),
  ]
  /**
   * Comprueba que todos los puntos de una lista existan.
   *
   * @param {(Point | null)[]} list - Puntos que pueden faltar.
   * @returns {boolean} `true` cuando ningún punto es `null`.
   * @example
   * valid(first)
   */
  const valid = (list: (Point | null)[]): list is Point[] => list.every(Boolean)
  return valid(first) && valid(second) ? [first, second] : null
}
