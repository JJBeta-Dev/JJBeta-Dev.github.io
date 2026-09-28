import { useMatch } from 'react-router'

/**
 * Indica si hay un caso de estudio abierto sobre la página principal.
 *
 * @returns {boolean} `true` cuando la ruta actual es `/casos/:slug`.
 * @example
 * const caseOpen = useCaseOpen()
 */
export const useCaseOpen = (): boolean => Boolean(useMatch('/casos/:slug'))
