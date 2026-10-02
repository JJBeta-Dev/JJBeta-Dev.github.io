import { useTranslation } from 'react-i18next'
import AnchorLink from '@/components/ui/anchor-link/AnchorLink'
import LineIcon from '@/components/ui/icons/LineIcon'

/**
 * Insignia circular giratoria que invita a bajar hasta los proyectos.
 *
 * @returns {import('react').JSX.Element} El enlace de la insignia.
 * @example
 * <ScrollBadge />
 */
export default function ScrollBadge() {
  const { t } = useTranslation()
  return (
    <AnchorLink to="#proyectos" className="badge-spin" label={t('a11y.toProjects')} magnetic linkCursor>
      <svg viewBox="0 0 132 132" aria-hidden="true">
        <defs>
          <path id="badge-circle" d="M66 66m-52 0a52 52 0 1 1 104 0a52 52 0 1 1-104 0" />
        </defs>
        <text>
          <textPath href="#badge-circle" textLength="322" lengthAdjust="spacing">
            {t('hero.badge')}
          </textPath>
        </text>
      </svg>
      <span className="core" aria-hidden="true">
        <LineIcon name="arrowDown" strokeWidth={2.6} />
      </span>
    </AnchorLink>
  )
}
