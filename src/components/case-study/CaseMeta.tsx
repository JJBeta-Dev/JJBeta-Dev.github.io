import { useTranslation } from 'react-i18next'
import type { CaseStudy } from '@/data/caseStudies'
import RepoActivity from './RepoActivity'

/**
 * Ficha flotante del caso: rol, año, stack, enlace externo y, si el repositorio es público,
 * su actividad en vivo.
 *
 * @param {{ study: CaseStudy }} props - Datos del caso de estudio.
 * @returns {import('react').JSX.Element} Lista de definiciones con la ficha.
 * @example
 * <CaseMeta study={CASE_STUDIES.tailwind} />
 */
export default function CaseMeta({ study }: { study: CaseStudy }) {
  const { t } = useTranslation()
  const key = `cases.${study.slug}`
  const link = t(`${key}.linkLabel`)

  return (
    <dl className="case__meta">
      <div>
        <dt>{t('case.role')}</dt>
        <dd>{t(`${key}.role`)}</dd>
      </div>
      <div>
        <dt>{t('case.year')}</dt>
        <dd>{t(`${key}.year`)}</dd>
      </div>
      <div>
        <dt>{t('case.stack')}</dt>
        <dd>{t(`${key}.stack`)}</dd>
      </div>
      <div>
        <dt>{t('case.link')}</dt>
        <dd>
          {study.href ? (
            <a href={study.href} target="_blank" rel="noopener noreferrer">
              {link}
            </a>
          ) : (
            link
          )}
        </dd>
      </div>
      <RepoActivity repository={study.repository} />
    </dl>
  )
}
