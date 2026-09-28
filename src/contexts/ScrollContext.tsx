import { createContext } from 'react'

/**
 * Motivo por el que se pausa el scroll de la página (un menú abierto o un caso de estudio abierto).
 */
export type ScrollLock = 'menu' | 'case'

/**
 * Controles de scroll suave compartidos por todo el sitio.
 */
export interface ScrollApi {
  scrollTo: (target: string | HTMLElement) => void
  setLock: (reason: ScrollLock, locked: boolean) => void
}

/**
 * Contexto que expone {@link ScrollApi}. Lo provee `ScrollProvider`.
 */
export const ScrollContext = createContext<ScrollApi | null>(null)
