import { useSyncExternalStore } from 'react'
import { createMediaQueryStore } from '@/helpers/mediaQueryStore'

const store = createMediaQueryStore('(hover: hover) and (pointer: fine)')

/**
 * Indica si la entrada principal es un puntero preciso con hover (un ratón o un trackpad).
 * El cursor personalizado, el magnetismo y el juego de secretos solo existen en ese caso.
 *
 * @returns {boolean} `true` en dispositivos que se manejan con ratón.
 * @example
 * const fine = useFinePointer()
 */
export const useFinePointer = (): boolean =>
  useSyncExternalStore(store.subscribe, store.getSnapshot, store.getServerSnapshot)
