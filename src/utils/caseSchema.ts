/**
 * Datos de un caso de estudio para describirlo con schema.org.
 */
export interface CaseSchemaData {
  siteUrl: string
  path: string
  title: string
  description: string
  homeLabel: string
  projectsLabel: string
}

/**
 * Construye el JSON-LD de un caso de estudio: un `CreativeWork` firmado por JJBeta y la ruta de
 * migas (`BreadcrumbList`) Inicio › Proyectos › Caso, para buscadores y asistentes de IA.
 *
 * @param {CaseSchemaData} data - URL del sitio, ruta, título, descripción y etiquetas de las migas.
 * @returns {Record<string, unknown>} Un grafo schema.org serializable a JSON.
 * @example
 * buildCaseSchema({ siteUrl, path: '/casos/perfil/', title, description, homeLabel: 'Inicio', projectsLabel: 'Proyectos' })
 */
export const buildCaseSchema = ({
  siteUrl,
  path,
  title,
  description,
  homeLabel,
  projectsLabel,
}: CaseSchemaData) => {
  const url = new URL(path, siteUrl).href
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CreativeWork',
        '@id': `${url}#caso`,
        name: title,
        description,
        url,
        inLanguage: 'es',
        author: {
          '@type': 'Person',
          name: 'Jerónimo Jiménez Betancur',
          alternateName: 'JJBeta',
          url: siteUrl,
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: homeLabel, item: siteUrl },
          {
            '@type': 'ListItem',
            position: 2,
            name: projectsLabel,
            item: new URL('#proyectos', siteUrl).href,
          },
          { '@type': 'ListItem', position: 3, name: title, item: url },
        ],
      },
    ],
  }
}
