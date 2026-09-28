import { useEffect, useState, type ReactNode } from 'react'
import type { LineIconName } from '@/components/ui/icons/lineIconPaths'
import Toast from '@/components/ui/toast/Toast'
import { ToastContext, type ToastApi } from '@/contexts/ToastContext'

interface ToastState {
  id: number
  message: string
  icon: LineIconName
  duration: number
  visible: boolean
}

const INITIAL: ToastState = { id: 0, message: '', icon: 'spark', duration: 0, visible: false }

/**
 * Gestiona el único toast global. El objeto de la API se crea una sola vez, así que mostrar un toast
 * nunca vuelve a renderizar los componentes que solo lo disparan.
 *
 * @param {{ children: ReactNode }} props - Subárbol de la aplicación.
 * @returns {import('react').JSX.Element} El provider con el toast pintado después de sus hijos.
 * @example
 * <ToastProvider><App /></ToastProvider>
 */
export default function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState(INITIAL)
  const [api] = useState<ToastApi>(() => ({
    /**
     * Muestra un mensaje en el toast, reemplazando el anterior.
     *
     * @param {string} message - Texto del mensaje.
     * @param {LineIconName} icon - Icono que acompaña al mensaje.
     * @param {number} duration - Milisegundos que permanece visible.
     * @returns {void} No devuelve nada.
     * @example
     * show('Correo copiado', 'check')
     */
    show: (message, icon = 'spark', duration = 3200) =>
      setToast((previous) => ({ id: previous.id + 1, message, icon, duration, visible: true })),
  }))

  useEffect(() => {
    if (!toast.visible) return
    const timer = window.setTimeout(
      () => setToast((current) => ({ ...current, visible: false })),
      toast.duration,
    )
    return () => window.clearTimeout(timer)
  }, [toast.id, toast.visible, toast.duration])

  return (
    <ToastContext value={api}>
      {children}
      <Toast message={toast.message} icon={toast.icon} visible={toast.visible} />
    </ToastContext>
  )
}
