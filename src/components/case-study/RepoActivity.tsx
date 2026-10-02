import { useTranslation } from 'react-i18next'
import { useRepoActivity } from '@/hooks/useRepoActivity'
import { formatRelativeTime } from '@/utils/formatRelativeTime'

/**
 * Fila de la ficha del caso con la actividad pública del repositorio (último cambio y versión),
 * obtenida en vivo desde GitHub. No se muestra nada mientras carga o si la petición falla.
 *
 * @param {{ repository: string | null }} props - Repositorio del caso, o `null` si no es público.
 * @returns {import('react').JSX.Element | null} Fila de actividad o nada.
 * @example
 * <RepoActivity repository="tailwind-strict-colors" />
 */
export default function RepoActivity({ repository }: { repository: string | null }) {
  const { t } = useTranslation()
  const { data } = useRepoActivity(repository)
  if (!data) return null

  const parts = [t('case.updated', { when: formatRelativeTime(data.pushedAt) })]
  if (data.version) parts.push(t('case.release', { version: data.version }))

  return (
    <div>
      <dt>{t('case.activity')}</dt>
      <dd>{parts.join(' · ')}</dd>
    </div>
  )
}
