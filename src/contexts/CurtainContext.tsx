import { createContext } from 'react'

/**
 * Punto del viewport desde el que crece la cortina, normalmente donde hizo clic el visitante.
 */
export interface CurtainOrigin {
  x: number
  y: number
}

/**
 * Cortina de transición entre páginas. Cada paso se resuelve cuando termina su animación;
 * `transition` impide que arranquen dos navegaciones a la vez, y cada paso lleva al anterior a su
 * final si sigue corriendo, así dos animaciones de la cortina nunca se pisan.
 */
export interface CurtainApi {
  cover: (origin?: CurtainOrigin) => Promise<void>
  lift: () => Promise<void>
  drop: () => Promise<void>
  close: () => Promise<void>
  transition: (task: () => Promise<void>) => Promise<void>
}

/**
 * Contexto que expone {@link CurtainApi}. Lo provee `CurtainProvider`.
 */
export const CurtainContext = createContext<CurtainApi | null>(null)
