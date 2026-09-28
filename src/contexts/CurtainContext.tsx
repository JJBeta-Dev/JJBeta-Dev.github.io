import { createContext } from 'react'

/**
 * Punto del viewport desde el que crece la cortina, normalmente donde hizo clic el visitante.
 */
export interface CurtainOrigin {
  x: number
  y: number
}

/**
 * Cortina de transición entre páginas. Cada paso se resuelve cuando termina su animación y
 * `transition` garantiza que nunca corran dos transiciones a la vez.
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
