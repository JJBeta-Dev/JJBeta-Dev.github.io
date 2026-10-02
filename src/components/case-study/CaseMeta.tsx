import { useTranslation } from 'react-i18next'
import type { CaseStudy } from '@/data/caseStudies'
import RepoActivity from '@/components/case-study/RepoActivity'
import ExternalLink from '@/components/ui/external-link/ExternalLink'

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
  const { slug } = study
  const link = t(`cases.${slug}.linkLabel`)

  return (
    <dl className="case__meta">
      <div>
        <dt>{t('case.role')}</dt>
        <dd>{t(`cases.${slug}.role`)}</dd>
      </div>
      <div>
        <dt>{t('case.year')}</dt>
        <dd>{t(`cases.${slug}.year`)}</dd>
      </div>
      <div>
        <dt>{t('case.stack')}</dt>
        <dd>{t(`cases.${slug}.stack`)}</dd>
      </div>
      <div>
        <dt>{t('case.link')}</dt>
        <dd>{study.href ? <ExternalLink href={study.href}>{link}</ExternalLink> : link}</dd>
      </div>
      <RepoActivity repository={study.repository} />
    </dl>
  )
}
