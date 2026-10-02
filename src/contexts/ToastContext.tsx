import { createContext } from 'react'
import type { LineIconName } from '@/components/ui/icons/lineIconPaths'

/**
 * API imperativa para mostrar un mensaje de estado breve y no intrusivo.
 */
export interface ToastApi {
  show: (message: string, icon?: LineIconName, duration?: number) => void
}

/**
 * Contexto que expone {@link ToastApi}. Lo provee `ToastProvider`.
 */
export const ToastContext = createContext<ToastApi | null>(null)
