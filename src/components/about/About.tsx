import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useAboutMotion } from '@/hooks/useAboutMotion'
import Editor from '@/components/about/Editor'
import PortraitBlob from '@/components/about/PortraitBlob'

/**
 * Sección Acerca de mí: título apilado montado sobre el editor vivo y el retrato apoyado.
 *
 * @returns {import('react').JSX.Element} Sección Acerca de mí.
 * @example
 * <About />
 */
export default function About() {
  const { t } = useTranslation()
  const root = useRef<HTMLElement>(null)
  useAboutMotion(root)

  return (
    <section className="about" id="acerca" aria-labelledby="t-about" ref={root}>
      <div className="about__left">
        <h2 className="stack-title" id="t-about">
          <span className="t1">{t('about.titleA')}</span> <span className="t2">{t('about.titleB')}</span>
        </h2>
        <Editor />
      </div>
      <PortraitBlob />
    </section>
  )
}
