import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import SplitWords from '@/components/ui/split-text/SplitWords'
import { Link } from 'react-router'
import BrowserWindow from '@/components/ui/browser-window/BrowserWindow'
import LineIcon from '@/components/ui/icons/LineIcon'
import { CASE_COUNT, CASE_STUDIES, casePath } from '@/data/caseStudies'
import type { CaseSlug } from '@/data/caseSlugs'
import { PROJECT_IMAGES } from '@/data/projects'
import { useCaseControls } from '@/hooks/useCaseNavigation'
import { useCaseView } from '@/hooks/useCaseView'
import { useMagnetic } from '@/hooks/useMagnetic'
import CaseMeta from '@/components/case-study/CaseMeta'
import CaseSections from '@/components/case-study/CaseSections'

/**
 * Vista completa de un caso de estudio sobre la página: diálogo modal con barra de regreso,
 * titular con palabra acento, ficha, captura, bloques de lectura y el enlace al siguiente caso.
 *
 * @param {{ slug: CaseSlug }} props - Caso de estudio a mostrar.
 * @returns {import('react').JSX.Element} Diálogo del caso de estudio.
 * @example
 * <CaseStudy slug="tailwind" />
 */
export default function CaseStudy({ slug }: { slug: CaseSlug }) {
  const { t } = useTranslation()
  const root = useRef<HTMLDivElement>(null)
  const { nextCase, closeCase } = useCaseControls()
  const study = CASE_STUDIES[slug]
  const next = CASE_STUDIES[study.next]
  const titleId = `case-title-${slug}`
  useCaseView(root, slug, closeCase)
  useMagnetic(root)

  return (
    <div
      className="case"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      data-lenis-prevent=""
      ref={root}
    >
      <div className="case__bar">
        <button className="case__back" type="button" data-cursor={t('case.back')} onClick={closeCase}>
          <LineIcon name="arrowLeft" strokeWidth={2.4} />
          {t('case.back')}
        </button>
        <span className="case__count">
          <span aria-hidden="true">{`${study.number} / ${CASE_COUNT}`}</span>
          <span className="sr-only">{t('case.position', { current: study.number, total: CASE_COUNT })}</span>
        </span>
      </div>
      <header className="case__hero">
        <p className="case__kicker">{t(`cases.${slug}.kicker`)}</p>
        <h1 className="case__title" id={titleId} tabIndex={-1}>
          <SplitWords text={t(`cases.${slug}.title`)} />
        </h1>
        <CaseMeta study={study} />
      </header>
      <figure className="case__shot">
        <BrowserWindow image={PROJECT_IMAGES[slug]} alt={t(`projects.${slug}.alt`)} />
      </figure>
      <CaseSections study={study} />
      <Link
        className="case__next"
        to={casePath(next.slug)}
        preventScrollReset
        onClick={nextCase(next.slug)}
        data-cursor={t('case.nextCursor')}
        data-magnetic=""
      >
        <small>{t(next.number === '01' ? 'case.first' : 'case.next')}</small>
        {t(`projects.${next.slug}.title`)} <span aria-hidden="true">→</span>
      </Link>
    </div>
  )
}
