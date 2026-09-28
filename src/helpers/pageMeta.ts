import type { CaseSlug } from '@/data/caseSlugs'
import { SITE_URL } from '@/data/site'
import { i18n } from '@/plugins/i18n'
import { buildMeta, type MetaDescriptor } from '@/utils/seoMeta'

/**
 * Datos comunes a los metadatos de todas las páginas: URL del sitio, nombre y texto alternativo de la imagen.
 *
 * @returns {{ siteUrl: string; siteName: string; imageAlt: string }} Los campos compartidos.
 * @example
 * buildMeta({ ...base(), path: '/', title, description, socialDescription })
 */
const base = () => ({
  siteUrl: SITE_URL,
  siteName: i18n.t('meta.siteName'),
  imageAlt: i18n.t('meta.imageAlt'),
})

/**
 * Metadatos de la página de inicio.
 *
 * @returns {MetaDescriptor[]} Descriptores para el export `meta` de la ruta de inicio.
 * @example
 * export const meta = homeMeta
 */
export const homeMeta = (): MetaDescriptor[] =>
  buildMeta({
    ...base(),
    path: '/',
    title: i18n.t('meta.title'),
    description: i18n.t('meta.description'),
    socialDescription: i18n.t('meta.socialDescription'),
  })

/**
 * Metadatos de la página de un caso de estudio, con su propio título y resumen.
 *
 * @param {CaseSlug} slug - Slug del caso de estudio.
 * @returns {MetaDescriptor[]} Descriptores para el export `meta` de la ruta del caso.
 * @example
 * caseMeta('tailwind')
 */
export const caseMeta = (slug: CaseSlug): MetaDescriptor[] => {
  const description = i18n.t(`cases.${slug}.description`)
  return buildMeta({
    ...base(),
    path: `/casos/${slug}`,
    type: 'article',
    title: i18n.t('meta.caseTitle', { title: i18n.t(`cases.${slug}.plainTitle`) }),
    description,
    socialDescription: description,
  })
}

/**
 * Metadatos de la página no encontrada; pide a los rastreadores que no la indexen.
 *
 * @returns {MetaDescriptor[]} Descriptores para la ruta no encontrada.
 * @example
 * export const meta = notFoundMeta
 */
export const notFoundMeta = (): MetaDescriptor[] => [
  { title: i18n.t('meta.notFoundTitle') },
  { name: 'robots', content: 'noindex' },
]
