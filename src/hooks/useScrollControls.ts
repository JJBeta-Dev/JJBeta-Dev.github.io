import { ScrollContext, type ScrollApi } from '@/contexts/ScrollContext'
import { useRequiredContext } from './useRequiredContext'

/**
 * Da acceso a los controles del scroll suave.
 *
 * @returns {import('@/contexts/ScrollContext').ScrollApi} La {@link ScrollApi}.
 * @example
 * const { scrollTo } = useScrollControls()
 * scrollTo('#contacto')
 */
export const useScrollControls = (): ScrollApi => useRequiredContext(ScrollContext, 'ScrollProvider')
