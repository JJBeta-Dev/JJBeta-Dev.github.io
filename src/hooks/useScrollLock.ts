import { useEffect } from 'react'
import type { ScrollLock } from '@/contexts/ScrollContext'
import { toggleLock } from '@/utils/scrollLocks'
import { useScrollControls } from '@/hooks/useScrollControls'

/**
 * Pausa el scroll de la página mientras `active` sea `true` y lo libera al desmontar, identificando
 * el motivo para que varios bloqueos convivan sin pisarse.
 *
 * @param {ScrollLock} reason - Motivo del bloqueo.
 * @param {boolean} active - Si el bloqueo está vigente.
 * @returns {void} No devuelve nada.
 * @example
 * useScrollLock('menu', open)
 */
export const useScrollLock = (reason: ScrollLock, active: boolean): void => {
  const { setLocks } = useScrollControls()

  useEffect(() => {
    setLocks((locks) => toggleLock(locks, reason, active))
    return () => setLocks((locks) => toggleLock(locks, reason, false))
  }, [reason, active, setLocks])
}
