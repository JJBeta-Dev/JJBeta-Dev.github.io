import type { MouseEvent, ReactNode } from 'react'
import { useScrollControls } from '@/hooks/useScrollControls'
import { isModifiedClick } from '@/utils/isModifiedClick'

/**
 * Props de {@link AnchorLink}.
 */
export interface AnchorLinkProps {
  to: string
  children: ReactNode
  className?: string
  onNavigate?: () => void
  label?: string
  cursor?: string
  magnetic?: 'soft' | true
  linkCursor?: boolean
}

/**
 * Enlace interno que se desliza hasta una sección con el scroll suave y le mueve el foco. Conserva un
 * `href` real, así que también funciona sin JavaScript y para los rastreadores.
 *
 * @param {Readonly<AnchorLinkProps>} props - Id de destino (con `#`), contenido y comportamiento opcional
 * de cursor/magnético.
 * @returns {import('react').JSX.Element} Un elemento de enlace.
 * @example
 * <AnchorLink to="#contacto">Contacto</AnchorLink>
 */
export default function AnchorLink({
  to,
  children,
  className,
  onNavigate,
  label,
  cursor,
  magnetic,
  linkCursor,
}: AnchorLinkProps) {
  const { scrollTo } = useScrollControls()

  /**
   * Cancela la navegación nativa, avisa a `onNavigate` y desliza el scroll suave hasta el destino.
   *
   * @param {MouseEvent<HTMLAnchorElement>} event - Clic sobre el enlace.
   * @returns {void} No devuelve nada.
   * @example
   * onClick(event)
   */
  const onClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (isModifiedClick(event)) return
    event.preventDefault()
    onNavigate?.()
    scrollTo(to)
  }

  return (
    <a
      className={className}
      href={to}
      onClick={onClick}
      aria-label={label}
      data-cursor={cursor}
      data-magnetic={magnetic === true ? '' : magnetic}
      data-cursor-link={linkCursor ? '' : undefined}
    >
      {children}
    </a>
  )
}
