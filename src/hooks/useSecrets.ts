import { SecretsContext, type SecretsApi } from '@/contexts/SecretsContext'
import { useRequiredContext } from './useRequiredContext'

/**
 * Da acceso al juego de secretos: qué easter eggs se han encontrado y cómo revelar uno.
 *
 * @returns {import('@/contexts/SecretsContext').SecretsApi} La {@link SecretsApi}.
 * @example
 * const { reveal } = useSecrets()
 * reveal('font')
 */
export const useSecrets = (): SecretsApi => useRequiredContext(SecretsContext, 'SecretsProvider')
