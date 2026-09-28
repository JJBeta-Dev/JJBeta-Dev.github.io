import { Fragment, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import RichText from '@/components/ui/rich-text/RichText'
import { useBandMarquee } from '@/hooks/useBandMarquee'

const GROUPS = [0, 1, 2, 3]

/**
 * Franja inclinada de borde a borde que cruza de los proyectos a "Sobre mí", con el manifiesto de diseño
 * corriendo sin fin. Cuatro grupos idénticos hacen que media pista sea un bucle exacto.
 *
 * @returns {import('react').JSX.Element} La franja decorativa.
 * @example
 * <Band />
 */
export default function Band() {
  const { t } = useTranslation()
  const root = useRef<HTMLDivElement>(null)
  const phrases = t('band', { returnObjects: true })
  useBandMarquee(root)

  return (
    <div className="band" ref={root} aria-hidden="true">
      <div className="band__track">
        {GROUPS.map((group) => (
          <div className="band__group" key={group}>
            {phrases.map((phrase) => (
              <Fragment key={phrase}>
                <span>
                  <RichText text={phrase} />
                </span>
                <i />
              </Fragment>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
