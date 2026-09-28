import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import AnchorLink from '@/components/ui/anchor-link/AnchorLink'
import { SECTIONS } from '@/data/navigation'
import { useMagnetic } from '@/hooks/useMagnetic'
import { MENU_BUTTON_ID, useMenu } from '@/hooks/useMenu'
import { useMenuMotion } from '@/hooks/useMenuMotion'

/**
 * Botón del menú y menú a pantalla completa que se abre como un círculo desde el botón.
 *
 * @param {{ inert: boolean }} props - `inert` la desactiva mientras hay un caso de estudio abierto.
 * @returns {import('react').JSX.Element} La navegación.
 * @example
 * <Navigation inert={false} />
 */
export default function Navigation({ inert }: { inert: boolean }) {
  const { t } = useTranslation()
  const root = useRef<HTMLDivElement>(null)
  const { open, setMenu } = useMenu()
  useMagnetic(root)
  useMenuMotion(root, open)

  return (
    <div ref={root} inert={inert}>
      <button
        className="menu-btn"
        id={MENU_BUTTON_ID}
        type="button"
        aria-label={t(open ? 'a11y.closeMenu' : 'a11y.openMenu')}
        aria-expanded={open}
        aria-controls="menu"
        onClick={() => setMenu(!open)}
        data-magnetic=""
      >
        <span />
      </button>
      <nav className={open ? 'menu open' : 'menu'} id="menu" aria-label={t('a11y.mainNav')} inert={!open}>
        <ol>
          {SECTIONS.map(({ id, labelKey }) => (
            <li key={id}>
              <AnchorLink to={`#${id}`} onNavigate={() => setMenu(false)}>
                {t(labelKey)}
              </AnchorLink>
            </li>
          ))}
        </ol>
        <p className="menu__foot">{t('menu.foot')}</p>
      </nav>
    </div>
  )
}
