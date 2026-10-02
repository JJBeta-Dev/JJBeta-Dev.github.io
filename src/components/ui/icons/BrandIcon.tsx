import brandIcons from '@/data/brandIcons.json'
import type { BrandIconName } from '@/data/technologies'
import LineIcon from '@/components/ui/icons/LineIcon'

/**
 * Props de {@link BrandIcon}.
 */
export interface BrandIconProps {
  name: BrandIconName
}

/**
 * Logo de marca relleno de Simple Icons. El lápiz personalizado se dibuja como icono de línea.
 *
 * @param {Readonly<BrandIconProps>} props - Nombre de la marca tal como aparece en `brandIcons.json`, o
 * `pencil`.
 * @returns {import('react').JSX.Element} Un elemento SVG con `aria-hidden`.
 * @example
 * <BrandIcon name="react" />
 */
export default function BrandIcon({ name }: BrandIconProps) {
  if (name === 'pencil') return <LineIcon name="pencil" />
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d={brandIcons[name]} />
    </svg>
  )
}
