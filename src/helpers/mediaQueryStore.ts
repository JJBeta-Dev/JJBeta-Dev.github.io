/**
 * Store externo sobre una media query de CSS, con la forma que espera `useSyncExternalStore`.
 */
export interface MediaQueryStore {
  subscribe: (onChange: () => void) => () => void
  getSnapshot: () => boolean
  getServerSnapshot: () => boolean
}

/**
 * Crea un store estable para una media query. Declara los stores a nivel de módulo para que sus
 * funciones mantengan la misma identidad entre renders y React nunca se vuelva a suscribir sin motivo.
 *
 * @param {string} query - Media query de CSS, como `(prefers-reduced-motion: reduce)`.
 * @param {boolean} serverValue - Valor usado al pre-renderizar, donde no existe `window`.
 * @returns {MediaQueryStore} Las funciones del store.
 * @example
 * const store = createMediaQueryStore('(pointer: fine)')
 * useSyncExternalStore(store.subscribe, store.getSnapshot, store.getServerSnapshot)
 */
export const createMediaQueryStore = (query: string, serverValue = false): MediaQueryStore => ({
  subscribe(onChange) {
    const list = window.matchMedia(query)
    list.addEventListener('change', onChange)
    return () => list.removeEventListener('change', onChange)
  },
  getSnapshot: () => window.matchMedia(query).matches,
  getServerSnapshot: () => serverValue,
})
