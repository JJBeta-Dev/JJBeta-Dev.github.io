import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import RichText from '@/components/ui/rich-text/RichText'
import type { CaseStudy } from '@/data/caseStudies'

/**
 * Un bloque de lectura del caso con su número y título.
 *
 * @param {{ number: string, title: string, children: ReactNode }} props - Número, título y contenido.
 * @returns {import('react').JSX.Element} Sección del caso.
 * @example
 * <CaseBlock number="01" title="El reto"><p>…</p></CaseBlock>
 */
function CaseBlock({ number, title, children }: { number: string; title: string; children: ReactNode }) {
  return (
    <section>
      <h2>
        <span>{number}</span>
        {title}
      </h2>
      {children}
    </section>
  )
}

/**
 * Los cuatro bloques de lectura de un caso (el reto, qué hice, decisiones y resultado),
 * dispuestos en asimetría. «Qué hice» se numera cuando el caso describe una secuencia de pasos.
 *
 * @param {{ study: CaseStudy }} props - Caso de estudio a mostrar.
 * @returns {import('react').JSX.Element} Rejilla con los bloques del caso.
 * @example
 * <CaseSections study={CASE_STUDIES.perfil} />
 */
export default function CaseSections({ study }: { study: CaseStudy }) {
  const { t } = useTranslation()
  const { slug } = study
  const items = t(`cases.${slug}.work`, { returnObjects: true })
  const List = study.ordered ? 'ol' : 'ul'

  return (
    <div className="case__grid">
      <CaseBlock number="01" title={t('case.sections.challenge')}>
        <p>
          <RichText text={t(`cases.${slug}.challenge`)} />
        </p>
      </CaseBlock>
      <CaseBlock number="02" title={t('case.sections.work')}>
        <List className={study.ordered ? 'steps' : undefined}>
          {items.map((item) => (
            <li key={item}>
              <RichText text={item} />
            </li>
          ))}
        </List>
      </CaseBlock>
      <CaseBlock number="03" title={t('case.sections.decisions')}>
        <p>
          <RichText text={t(`cases.${slug}.decisions`)} />
        </p>
      </CaseBlock>
      <CaseBlock number="04" title={t('case.sections.result')}>
        <p>{t(`cases.${slug}.result`)}</p>
      </CaseBlock>
    </div>
  )
}
