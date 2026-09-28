import CaseStudy from '@/components/case-study/CaseStudy'
import type { CaseSlug } from '@/data/caseSlugs'

/**
 * Vista de un caso de estudio. Se muestra sobre la página principal, que sigue montada debajo.
 *
 * @param {{ slug: CaseSlug }} props - Caso de estudio a mostrar.
 * @returns {import('react').JSX.Element} Caso de estudio.
 * @example
 * <CaseView slug="perfil" />
 */
export default function CaseView({ slug }: { slug: CaseSlug }) {
  return <CaseStudy slug={slug} />
}
