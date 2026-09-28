import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import LineIcon from '@/components/ui/icons/LineIcon'

/**
 * Página 404 con el mismo lenguaje visual del sitio y un camino claro de regreso al inicio.
 *
 * @returns {import('react').JSX.Element} Página de «no encontrado».
 * @example
 * <NotFoundView />
 */
export default function NotFoundView() {
  const { t } = useTranslation()

  return (
    <main className="not-found" id="contenido">
      <p className="not-found__code" aria-hidden="true">
        404
      </p>
      <h1 className="not-found__title">{t('notFound.title')}</h1>
      <p className="not-found__text">{t('notFound.text')}</p>
      <Link className="not-found__cta" to="/">
        <LineIcon name="arrowLeft" strokeWidth={2.4} />
        {t('notFound.cta')}
      </Link>
    </main>
  )
}
