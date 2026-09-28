import { ToastContext, type ToastApi } from '@/contexts/ToastContext'
import { useRequiredContext } from './useRequiredContext'

/**
 * Da acceso al aviso (toast) global.
 *
 * @returns {import('@/contexts/ToastContext').ToastApi} La {@link ToastApi}.
 * @example
 * const { show } = useToast()
 * show('Correo copiado', 'copy')
 */
export const useToast = (): ToastApi => useRequiredContext(ToastContext, 'ToastProvider')
