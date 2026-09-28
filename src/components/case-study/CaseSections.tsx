import { Trans, useTranslation } from 'react-i18next'
import type { CaseSlug } from '@/data/caseSlugs'

const RICH = { b: <b />, code: <code /> }

/**
 * Los cuatro bloques de lectura de un caso: el reto, qué hice, decisiones y resultado,
 * dispuestos en asimetría.
 *
 * @param {{ slug: CaseSlug }} props - Caso de estudio a mostrar.
 * @returns {import('react').JSX.Element} Rejilla con los bloques del caso.
 * @example
 * <CaseSections slug="perfil" />
 */
export default function CaseSections({ slug }: { slug: CaseSlug }) {
  const { t } = useTranslation()
  const key = `cases.${slug}`
  const items = t(`${key}.work`, { returnObjects: true }) as string[]
  const List = slug === 'asistente' ? 'ol' : 'ul'

  return (
    <div className="case__grid">
      <section>
        <h3>
          <span>01</span>
          {t('case.sections.challenge')}
        </h3>
        <p>
          <Trans i18nKey={`${key}.challenge`} components={RICH} />
        </p>
      </section>
      <section>
        <h3>
          <span>02</span>
          {t('case.sections.work')}
        </h3>
        <List className={slug === 'asistente' ? 'steps' : undefined}>
          {items.map((_, i) => (
            <li key={i}>
              <Trans i18nKey={`${key}.work.${i}`} components={RICH} />
            </li>
          ))}
        </List>
      </section>
      <section>
        <h3>
          <span>03</span>
          {t('case.sections.decisions')}
        </h3>
        <p>
          <Trans i18nKey={`${key}.decisions`} components={RICH} />
        </p>
      </section>
      <section>
        <h3>
          <span>04</span>
          {t('case.sections.result')}
        </h3>
        <p>{t(`${key}.result`)}</p>
      </section>
    </div>
  )
}
