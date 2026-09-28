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
  /**
   * Se suscribe a los cambios de la media query.
   *
   * @param {() => void} onChange - Callback que React invoca cuando cambia el resultado.
   * @returns {() => void} Función que cancela la suscripción.
   * @example
   * const unsubscribe = store.subscribe(onChange)
   */
  subscribe(onChange) {
    const list = window.matchMedia(query)
    list.addEventListener('change', onChange)
    return () => list.removeEventListener('change', onChange)
  },
  /**
   * Lee si la media query coincide ahora mismo en el navegador.
   *
   * @returns {boolean} `true` cuando la media query coincide.
   * @example
   * store.getSnapshot()
   */
  getSnapshot: () => window.matchMedia(query).matches,
  /**
   * Devuelve el valor fijo usado durante el pre-renderizado.
   *
   * @returns {boolean} El valor de servidor configurado.
   * @example
   * store.getServerSnapshot()
   */
  getServerSnapshot: () => serverValue,
})
