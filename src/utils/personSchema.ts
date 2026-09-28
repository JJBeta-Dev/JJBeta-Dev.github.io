/**
 * Datos usados para describir al dueño del sitio con schema.org.
 */
export interface PersonData {
  siteUrl: string
  email: string
  profiles: readonly string[]
}

/**
 * Construye el grafo `Person` de schema.org (JSON-LD) que describe a Jerónimo Jiménez Betancur para
 * buscadores y asistentes de IA.
 *
 * @param {PersonData} person - URL del sitio, correo de contacto y perfiles públicos.
 * @returns {Record<string, unknown>} Un objeto de esquema serializable a JSON.
 * @example
 * JSON.stringify(buildPersonSchema({ siteUrl, email, profiles }))
 */
export const buildPersonSchema = ({ siteUrl, email, profiles }: PersonData) => ({
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Jerónimo Jiménez Betancur',
  alternateName: 'JJBeta',
  url: siteUrl,
  image: new URL('og.png', siteUrl).href,
  jobTitle: 'Diseñador UX/UI y desarrollador Front-End',
  worksFor: { '@type': 'Organization', name: 'Asincode' },
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'El Carmen de Viboral',
    addressRegion: 'Antioquia',
    addressCountry: 'CO',
  },
  email: `mailto:${email}`,
  knowsAbout: [
    'Diseño UX/UI',
    'Figma',
    'React',
    'TypeScript',
    'Tailwind CSS',
    'Accesibilidad web',
    'GSAP',
    'Automatización con Make y n8n',
  ],
  sameAs: [...profiles],
})
