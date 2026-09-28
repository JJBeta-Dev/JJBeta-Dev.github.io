import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import BrowserWindow from '@/components/ui/browser-window/BrowserWindow'
import LineIcon from '@/components/ui/icons/LineIcon'
import type { Project } from '@/data/projects'
import { useCaseNavigation } from '@/hooks/useCaseNavigation'

/**
 * Tarjeta de la galería de proyectos. Los proyectos públicos abren su caso de estudio (un enlace real, así
 * que los rastreadores y "abrir en pestaña nueva" también funcionan); el bloqueado muestra un estado
 * honesto de "próximamente".
 *
 * @param {{ project: Project; index: number }} props - Datos del proyecto y su posición en la galería.
 * @returns {import('react').JSX.Element} La tarjeta del proyecto.
 * @example
 * <ProjectCard project={PROJECTS[0]} index={0} />
 */
export default function ProjectCard({ project, index }: { project: Project; index: number }) {
  const { t } = useTranslation()
  const { openCase } = useCaseNavigation()
  const tags = t(`projects.${project.id}.tags`, { returnObjects: true }) as string[]
  const body = (
    <div className="body">
      <div>
        <span className="num">{String(index + 1).padStart(2, '0')}</span>
        <h3>{t(`projects.${project.id}.title`)}</h3>
        <p>{t(`projects.${project.id}.description`)}</p>
        <div className="tags">
          {tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
      </div>
      {project.slug && (
        <span className="go" aria-hidden="true">
          →
        </span>
      )}
    </div>
  )

  if (!project.slug || !project.image) {
    return (
      <article className="card-p locked" data-cursor={t('work.soon')}>
        <div className="thumb">
          <div>
            <LineIcon name="lock" />
            {t('work.locked')}
          </div>
        </div>
        {body}
      </article>
    )
  }

  return (
    <Link
      className="card-p"
      to={`/casos/${project.slug}`}
      preventScrollReset
      onClick={openCase(project.slug)}
      data-cursor={t('work.viewCase')}
      data-case-link={project.slug}
    >
      <div className="thumb">
        <BrowserWindow image={project.image} alt={t(`projects.${project.id}.alt`)} />
      </div>
      {body}
    </Link>
  )
}
