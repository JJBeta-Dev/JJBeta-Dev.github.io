import type { ScrollLock } from '@/contexts/ScrollContext'

/**
 * Activa o libera un motivo de bloqueo de scroll sin mutar el conjunto original. Devuelve el mismo
 * conjunto cuando no cambia nada, para que React no vuelva a renderizar.
 *
 * @param {ReadonlySet<ScrollLock>} locks - Bloqueos activos.
 * @param {ScrollLock} reason - Motivo que se activa o libera.
 * @param {boolean} locked - `true` para activar, `false` para liberar.
 * @returns {ReadonlySet<ScrollLock>} Los bloqueos resultantes.
 * @example
 * toggleLock(new Set(), 'menu', true) // Set { 'menu' }
 */
export const toggleLock = (
  locks: ReadonlySet<ScrollLock>,
  reason: ScrollLock,
  locked: boolean,
): ReadonlySet<ScrollLock> => {
  if (locks.has(reason) === locked) return locks
  const next = new Set(locks)
  if (locked) next.add(reason)
  else next.delete(reason)
  return next
}
