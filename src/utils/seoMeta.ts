/**
 * Descriptor que acepta el export `meta` de React Router (un `<meta>`, un `<title>` o un `<link>`).
 */
export type MetaDescriptor =
  | { title: string }
  | { name: string; content: string }
  | { property: string; content: string }
  | { tagName: 'link'; rel: string; href: string }

/**
 * Datos de una página necesarios para construir sus metadatos SEO y sociales.
 */
export interface PageMeta {
  title: string
  description: string
  socialDescription: string
  imageAlt: string
  siteUrl: string
  path: string
  siteName: string
  type?: 'website' | 'article'
}

/**
 * Construye los metadatos completos de una página: título, descripción, enlace canónico, Open Graph y
 * tarjeta de Twitter. React Router los escribe en el HTML pre-renderizado, así que no hace falta un
 * gestor de `<head>` en el cliente.
 *
 * @param {PageMeta} page - Textos de la página, URL absoluta del sitio y ruta.
 * @returns {MetaDescriptor[]} Los descriptores para el export `meta` de la ruta.
 * @example
 * export const meta = () => buildMeta({ title: 'JJBeta', path: '/', … })
 */
export const buildMeta = (page: PageMeta): MetaDescriptor[] => {
  const url = new URL(page.path, page.siteUrl).href
  const image = new URL('og.png', page.siteUrl).href
  return [
    { title: page.title },
    { name: 'description', content: page.description },
    { tagName: 'link', rel: 'canonical', href: url },
    { property: 'og:type', content: page.type ?? 'website' },
    { property: 'og:locale', content: 'es_CO' },
    { property: 'og:site_name', content: page.siteName },
    { property: 'og:title', content: page.title },
    { property: 'og:description', content: page.socialDescription },
    { property: 'og:url', content: url },
    { property: 'og:image', content: image },
    { property: 'og:image:width', content: '1200' },
    { property: 'og:image:height', content: '630' },
    { property: 'og:image:alt', content: page.imageAlt },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: page.title },
    { name: 'twitter:description', content: page.socialDescription },
    { name: 'twitter:image', content: image },
  ]
}
