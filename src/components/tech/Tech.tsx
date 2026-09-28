import { useRef } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { TECHNOLOGIES } from '@/data/technologies'
import { useTechPlayground } from '@/hooks/useTechPlayground'
import TechChip from './TechChip'

/**
 * Sección Tecnologías: introducción, título alineado a la derecha y el patio de juegos con los
 * chips que se pueden agarrar y lanzar.
 *
 * @returns {import('react').JSX.Element} Sección de tecnologías.
 * @example
 * <Tech />
 */
export default function Tech() {
  const { t } = useTranslation()
  const root = useRef<HTMLElement>(null)
  useTechPlayground(root)

  return (
    <section className="tech" id="tecnologias" aria-labelledby="t-tech" ref={root}>
      <div className="tech__intro">
        <p>
          <Trans i18nKey="tech.intro" components={{ b: <b /> }} />
        </p>
      </div>
      <h2 className="big-title split-title" id="t-tech">
        {t('tech.title')}
      </h2>
      <div className="playground" data-cursor={t('tech.cursor')} data-label={t('tech.label')}>
        <ul className="chips">
          {TECHNOLOGIES.map((technology) => (
            <TechChip key={technology.icon} technology={technology} />
          ))}
        </ul>
      </div>
    </section>
  )
}
