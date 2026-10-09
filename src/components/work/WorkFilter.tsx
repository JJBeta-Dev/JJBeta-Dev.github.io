import { useTranslation } from 'react-i18next'
import { WORK_FILTERS, type WorkFilter as Filter } from '@/hooks/useWorkFilter'

/**
 * Control segmentado para filtrar los proyectos por tipo de trabajo. Cada opción es un botón con
 * `aria-pressed`, así funciona con teclado y los lectores de pantalla anuncian cuál está activa. Una
 * píldora morada se desliza a la opción activa.
 *
 * @param {{ filter: Filter, onChange: (filter: Filter) => void, count: number }} props - Filtro
 * activo, cómo cambiarlo y cuántos proyectos quedan visibles.
 * @returns {import('react').JSX.Element} El grupo de botones del filtro.
 * @example
 * <WorkFilter filter={filter} onChange={setFilter} count={projects.length} />
 */
export default function WorkFilter({
  filter,
  onChange,
  count,
}: {
  filter: Filter
  onChange: (filter: Filter) => void
  count: number
}) {
  const { t } = useTranslation()
  const active = WORK_FILTERS.indexOf(filter)

  return (
    <div className="work-filter" role="group" aria-label={t('work.filters.label')}>
      <span className="work-filter__pill" aria-hidden="true" style={{ translate: `${active * 100}% 0` }} />
      {WORK_FILTERS.map((option) => (
        <button
          key={option}
          type="button"
          className="work-filter__option"
          aria-pressed={option === filter}
          onClick={() => onChange(option)}
          data-cursor-link=""
        >
          {t(`work.filters.${option}`)}
        </button>
      ))}
      <span className="sr-only" aria-live="polite">
        {t('work.filters.count', { count })}
      </span>
    </div>
  )
}
