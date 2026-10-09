import type { CaseSlug } from '@/data/caseSlugs'
import { SOCIAL_LINKS } from '@/data/site'

/**
 * Datos no textuales de un caso de estudio. Los textos viven en las claves i18n `cases.<slug>`.
 * `repository` activa la fila de actividad en vivo de GitHub; `href` es el enlace externo, si es
 * público; `ordered` indica que «Qué hice» es una secuencia de pasos y se muestra numerada.
 */
export interface CaseStudy {
  slug: CaseSlug
  number: string
  href: string | null
  repository: string | null
  ordered: boolean
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
    ordered: false,
    next: 'tailwind',
  },
  tailwind: {
    slug: 'tailwind',
    number: '02',
    href: `${SOCIAL_LINKS.github}/tailwind-strict-colors`,
    repository: 'tailwind-strict-colors',
    ordered: false,
    next: 'asistente',
  },
  asistente: {
    slug: 'asistente',
    number: '03',
    href: null,
    repository: null,
    ordered: true,
    next: 'tarjeta',
  },
  tarjeta: {
    slug: 'tarjeta',
    number: '04',
    href: null,
    repository: null,
    ordered: true,
    next: 'perfil',
  },
}

/**
 * Número total de casos de estudio públicos, mostrado como `01 / 03`.
 */
export const CASE_COUNT = String(Object.keys(CASE_STUDIES).length).padStart(2, '0')

/**
 * Ruta pública de un caso de estudio. Termina en `/` porque cada caso se publica como
 * `casos/<slug>/index.html` y así la URL canónica nunca pasa por una redirección.
 *
 * @param {CaseSlug} slug - Caso de estudio.
 * @returns {string} Ruta absoluta dentro del sitio.
 * @example
 * casePath('perfil') // '/casos/perfil/'
 */
export const casePath = (slug: CaseSlug): string => `/casos/${slug}/`
