import { SOCIAL_LINKS } from './site'
import type { CaseSlug } from './caseSlugs'

/**
 * Datos no textuales de un caso de estudio. Los textos viven en las claves i18n `cases.<slug>`.
 * `repository` activa la fila de actividad en vivo de GitHub; `href` es el enlace externo, si es público.
 */
export interface CaseStudy {
  slug: CaseSlug
  number: string
  href: string | null
  repository: string | null
  next: CaseSlug
}

/**
 * Casos de estudio indexados por slug, en orden de lectura.
 */
export const CASE_STUDIES: Record<CaseSlug, CaseStudy> = {
  perfil: {
    slug: 'perfil',
    number: '01',
    href: SOCIAL_LINKS.github,
    repository: 'JJBeta-Dev',
    next: 'tailwind',
  },
  tailwind: {
    slug: 'tailwind',
    number: '02',
    href: `${SOCIAL_LINKS.github}/tailwind-strict-colors`,
    repository: 'tailwind-strict-colors',
    next: 'asistente',
  },
  asistente: { slug: 'asistente', number: '03', href: null, repository: null, next: 'perfil' },
}

/**
 * Número total de casos de estudio públicos, mostrado como `01 / 03`.
 */
export const CASE_COUNT = String(Object.keys(CASE_STUDIES).length).padStart(2, '0')
