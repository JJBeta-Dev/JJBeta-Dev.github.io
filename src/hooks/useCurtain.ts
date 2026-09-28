import { CurtainContext, type CurtainApi } from '@/contexts/CurtainContext'
import { useRequiredContext } from './useRequiredContext'

/**
 * Da acceso a la cortina de transición entre páginas.
 *
 * @returns {CurtainApi} La {@link CurtainApi}.
 * @example
 * const curtain = useCurtain()
 * await curtain.cover({ x: 200, y: 300 })
 */
export const useCurtain = (): CurtainApi => useRequiredContext(CurtainContext, 'CurtainProvider')
