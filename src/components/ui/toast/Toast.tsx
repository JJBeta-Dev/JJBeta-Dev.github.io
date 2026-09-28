import LineIcon from '@/components/ui/icons/LineIcon'
import type { LineIconName } from '@/components/ui/icons/lineIconPaths'

/**
 * Props de {@link Toast}.
 */
export interface ToastProps {
  message: string
  icon: LineIconName
  visible: boolean
}

/**
 * Mensaje de estado que sube desde abajo. La región viva para lectores de pantalla está siempre
 * expuesta (visualmente oculta) y recibe el texto al mostrarse; la tarjeta visible es decorativa.
 *
 * @param {Readonly<ToastProps>} props - Mensaje, icono y visibilidad.
 * @returns {import('react').JSX.Element} La región viva y la tarjeta visual del aviso.
 * @example
 * <Toast message="Correo copiado" icon="copy" visible />
 */
export default function Toast({ message, icon, visible }: ToastProps) {
  return (
    <>
      <div className="sr-only" role="status" aria-live="polite">
        {visible ? message : ''}
      </div>
      <div className={visible ? 'toast show' : 'toast'} aria-hidden="true">
        {message && <LineIcon name={icon} />}
        <span>{message}</span>
      </div>
    </>
  )
}
