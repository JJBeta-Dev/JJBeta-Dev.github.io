import { data, useParams } from 'react-router'
import { isCaseSlug } from '@/data/caseSlugs'
import { caseMeta, notFoundMeta } from '@/helpers/pageMeta'
import CaseView from '@/views/CaseView'
import type { Route } from './+types/case'

/**
 * Metadatos del caso de estudio; los slugs desconocidos se marcan como no indexables.
 *
 * @param {Route.MetaArgs} args - Argumentos de la ruta con el parámetro `slug`.
 * @returns {import('react-router').MetaDescriptor[]} Descriptores meta del caso.
 * @example
 * meta({ params: { slug: 'perfil' } })
 */
export const meta = ({ params }: Route.MetaArgs) =>
  isCaseSlug(params.slug) ? caseMeta(params.slug) : notFoundMeta()

/**
 * Ruta del caso de estudio. Valida el slug y pinta el caso sobre la página de inicio.
 *
 * @returns {import('react').JSX.Element} La vista del caso.
 * @throws {Response} Una respuesta 404 cuando el slug no existe.
 * @example
 * route('casos/:slug', 'routes/case.tsx')
 */
export default function CaseRoute() {
  const { slug } = useParams()
  if (!isCaseSlug(slug)) throw data(null, { status: 404 })
  return <CaseView slug={slug} key={slug} />
}
