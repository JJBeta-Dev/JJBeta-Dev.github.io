import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import RichText from '@/components/ui/rich-text/RichText'
import AnchorLink from '@/components/ui/anchor-link/AnchorLink'
import ExternalLink from '@/components/ui/external-link/ExternalLink'
import LineIcon from '@/components/ui/icons/LineIcon'
import { SECTIONS } from '@/data/navigation'
import { EMAIL, PROFILES, TIME_ZONE } from '@/data/site'
import { useFooterMotion } from '@/hooks/useFooterMotion'
import { useLocalTime } from '@/hooks/useLocalTime'
import { useMagnetic } from '@/hooks/useMagnetic'

const SIGNATURE = ['J', 'J', 'B', 'e', 't', 'a']

/**
 * Pie del sitio: navegación, perfiles sociales, colofón con la hora local, un botón magnético de
 * "volver arriba" y la firma gigante con contorno.
 *
 * @param {{ inert: boolean }} props - `inert` lo desactiva mientras hay un caso de estudio abierto.
 * @returns {import('react').JSX.Element} El pie de página.
 * @example
 * <Footer inert={false} />
 */
export default function Footer({ inert }: { inert: boolean }) {
  const { t } = useTranslation()
  const root = useRef<HTMLElement>(null)
  const time = useLocalTime(TIME_ZONE)
  useFooterMotion(root)
  useMagnetic(root)

  return (
    <footer className="foot" ref={root} inert={inert}>
      <div className="foot__top">
        <div className="foot__col">
          <h2 className="foot__h">{t('footer.navigate')}</h2>
          <ul>
            {SECTIONS.map(({ id, labelKey }) => (
              <li key={id}>
                <AnchorLink to={`#${id}`}>{t(labelKey)}</AnchorLink>
              </li>
            ))}
          </ul>
        </div>
        <div className="foot__col">
          <h2 className="foot__h">{t('footer.social')}</h2>
          <ul>
            {PROFILES.map((profile) => (
              <li key={profile.icon}>
                <ExternalLink href={profile.href}>
                  {profile.label} <span aria-hidden="true">↗</span>
                </ExternalLink>
              </li>
            ))}
            <li>
              <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
            </li>
          </ul>
        </div>
        <div className="foot__col foot__colophon">
          <h2 className="foot__h">{t('footer.colophon')}</h2>
          <p>{t('footer.colophonText')}</p>
          <p>{time ? t('footer.clock', { time }) : t('footer.place')}</p>
        </div>
        <AnchorLink to="#inicio" className="to-top" label={t('a11y.toTop')} cursor={t('footer.top')} magnetic>
          <LineIcon name="arrowUp" strokeWidth={2.6} />
        </AnchorLink>
      </div>
      <p className="foot__mark" aria-hidden="true">
        {SIGNATURE.map((letter, i) => (
          <span key={`${letter}-${i}`}>{letter}</span>
        ))}
      </p>
      <div className="foot__bottom">
        <span suppressHydrationWarning>
          <RichText text={t('footer.copyright', { year: new Date().getFullYear() })} />
        </span>
        <span>{t('footer.motto')}</span>
      </div>
    </footer>
  )
}
