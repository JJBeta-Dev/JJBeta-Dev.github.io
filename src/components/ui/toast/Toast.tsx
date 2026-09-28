import LineIcon from '../icons/LineIcon'
import type { LineIconName } from '../icons/lineIconPaths'

/**
 * Props de {@link Toast}.
 */
export interface ToastProps {
  message: string
  icon: LineIconName
  visible: boolean
}

/**
 * Mensaje de estado discreto que sube desde abajo. Permanece montado para que los lectores de pantalla
 * anuncien cada cambio a través de su región viva.
 *
 * @param {Readonly<ToastProps>} props - Mensaje, icono y visibilidad.
 * @returns {import('react').JSX.Element} La región viva del toast.
 * @example
 * <Toast message="Correo copiado" icon="copy" visible />
 */
export default function Toast({ message, icon, visible }: ToastProps) {
  return (
    <div className={visible ? 'toast show' : 'toast'} role="status" aria-live="polite">
      {message && <LineIcon name={icon} />}
      <span>{message}</span>
    </div>
  )
}
