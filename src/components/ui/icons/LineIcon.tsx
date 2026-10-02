import { LINE_ICON_PATHS, type LineIconName } from '@/components/ui/icons/lineIconPaths'

/**
 * Props de {@link LineIcon}.
 */
export interface LineIconProps {
  name: LineIconName
  className?: string
  strokeWidth?: number
}

/**
 * Icono de línea decorativo dibujado con `currentColor`. En la interfaz nunca se usan emojis.
 *
 * @param {Readonly<LineIconProps>} props - Nombre del icono, clase opcional y grosor del trazo.
 * @returns {import('react').JSX.Element} Un elemento SVG con `aria-hidden`.
 * @example
 * <LineIcon name="copy" />
 */
export default function LineIcon({ name, className, strokeWidth = 1.9 }: LineIconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {LINE_ICON_PATHS[name]}
    </svg>
  )
}
