import { useSyncExternalStore } from 'react'
import { formatClock } from '@/utils/formatClock'

const TICK = 30_000

/**
 * Se suscribe a un temporizador que avisa cada 30 segundos.
 *
 * @param {() => void} onChange - Función que React ejecuta en cada tic.
 * @returns {() => void} Función que cancela la suscripción.
 * @example
 * const unsubscribe = subscribe(() => render())
 */
const subscribe = (onChange: () => void) => {
  const timer = window.setInterval(onChange, TICK)
  return () => window.clearInterval(timer)
}

/**
 * Índice del tramo de 30 segundos actual, para que la instantánea solo cambie en cada tic.
 *
 * @returns {number} Índice del tramo actual.
 * @example
 * const tick = getSnapshot()
 */
const getSnapshot = () => Math.floor(Date.now() / TICK)

/**
 * Instantánea del servidor: durante el prerenderizado no hay hora.
 *
 * @returns {null} Siempre `null`.
 * @example
 * getServerSnapshot() // null
 */
const getServerSnapshot = () => null

/**
 * Hora local actual en una zona horaria, refrescada cada 30 segundos. Vale `null` durante el
 * prerenderizado, para que el HTML estático nunca guarde una hora desfasada.
 *
 * @param {string} timeZone - Zona horaria IANA.
 * @returns {string | null} La hora formateada, o `null` en el servidor.
 * @example
 * const time = useLocalTime('America/Bogota') // '9:05 a. m.'
 */
export const useLocalTime = (timeZone: string): string | null => {
  const tick = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
  return tick === null ? null : formatClock(new Date(tick * TICK), timeZone)
}
