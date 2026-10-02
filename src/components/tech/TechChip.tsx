import { useTranslation } from 'react-i18next'
import BrandIcon from '@/components/ui/icons/BrandIcon'
import type { Technology } from '@/data/technologies'

/**
 * Chip arrastrable de una tecnología, con su logo y la variante visual que le corresponde.
 *
 * @param {{ technology: Technology }} props - Tecnología a mostrar.
 * @returns {import('react').JSX.Element} Elemento de la lista de tecnologías.
 * @example
 * <TechChip technology={TECHNOLOGIES[0]} />
 */
export default function TechChip({ technology }: { technology: Technology }) {
  const { t } = useTranslation()
  const label = technology.labelKey ? t(technology.labelKey) : technology.label
  const className = technology.variant === 'default' ? 'tchip' : `tchip ${technology.variant}`

  return (
    <li className={className}>
      <BrandIcon name={technology.icon} />
      {label}
    </li>
  )
}
