import { useSyncExternalStore } from 'react'
import { createMediaQueryStore } from '@/helpers/mediaQueryStore'

const store = createMediaQueryStore('(prefers-reduced-motion: reduce)')

/**
 * Indica si el visitante pidió al sistema reducir el movimiento. Cuando es `true`, se omiten todas
 * las animaciones y el sitio se muestra completo y quieto.
 *
 * @returns {boolean} `true` cuando se prefiere movimiento reducido.
 * @example
 * const reduced = usePrefersReducedMotion()
 */
export const usePrefersReducedMotion = (): boolean =>
  useSyncExternalStore(store.subscribe, store.getSnapshot, store.getServerSnapshot)
