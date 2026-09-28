import { notFoundMeta } from '@/helpers/pageMeta'
import NotFoundView from '@/views/NotFoundView'

export const meta = notFoundMeta

/**
 * Ruta comodín para las URL desconocidas.
 *
 * @returns {import('react').JSX.Element} La vista de no encontrado.
 * @example
 * route('*', 'routes/notFound.tsx')
 */
export default function NotFoundRoute() {
  return <NotFoundView />
}
