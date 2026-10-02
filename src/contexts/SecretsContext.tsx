import { createContext } from 'react'

/**
 * Los cinco easter eggs del sitio.
 */
export const SECRET_KEYS = ['name', 'beta', 'pop', 'paint', 'font'] as const

/**
 * Identificador de un easter egg.
 */
export type SecretKey = (typeof SECRET_KEYS)[number]

/**
 * Estado y acciones del juego de secretos.
 */
export interface SecretsApi {
  enabled: boolean
  found: ReadonlySet<SecretKey>
  reveal: (key: SecretKey) => void
}

/**
 * Contexto que expone {@link SecretsApi}. Lo provee `SecretsProvider`.
 */
export const SecretsContext = createContext<SecretsApi | null>(null)
