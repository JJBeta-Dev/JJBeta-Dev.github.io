import { createContext, type Dispatch, type SetStateAction } from 'react'

/**
 * Motivo por el que se pausa el scroll de la página (un menú abierto o un caso de estudio abierto).
 */
export type ScrollLock = 'menu' | 'case'

/**
 * Controles de scroll suave compartidos por todo el sitio. `setLocks` es el setter de estado de
 * React (estable por definición); los componentes lo usan a través de `useScrollLock`.
 */
export interface ScrollApi {
  scrollTo: (target: string | HTMLElement) => void
  setLocks: Dispatch<SetStateAction<ReadonlySet<ScrollLock>>>
}

/**
 * Contexto que expone {@link ScrollApi}. Lo provee `ScrollProvider`.
 */
export const ScrollContext = createContext<ScrollApi | null>(null)
