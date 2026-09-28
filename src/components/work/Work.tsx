import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import AnchorLink from '@/components/ui/anchor-link/AnchorLink'
import { PROJECTS } from '@/data/projects'
import { useWorkRail } from '@/hooks/useWorkRail'
import ProjectCard from './ProjectCard'

/**
 * Sección de proyectos: título, una nota breve y la galería horizontal que termina con una invitación a
 * ser el próximo proyecto.
 *
 * @returns {import('react').JSX.Element} La sección de proyectos.
 * @example
 * <Work />
 */
export default function Work() {
  const { t } = useTranslation()
  const root = useRef<HTMLElement>(null)
  useWorkRail(root)

  return (
    <section className="work" id="proyectos" aria-labelledby="t-work" ref={root}>
      <div className="work__head">
        <h2 className="big-title split-title" id="t-work">
          {t('work.title')}
        </h2>
        <div className="note">
          <h3>{t('work.noteTitle')}</h3>
          <p>{t('work.noteText')}</p>
        </div>
      </div>
      <div className="rail">
        <div className="track">
          {PROJECTS.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
          <AnchorLink to="#contacto" className="card-end" cursor={t('work.nextCursor')} magnetic>
            {t('work.next')}
            <small>{t('work.nextSmall')}</small>
          </AnchorLink>
        </div>
      </div>
    </section>
  )
}
