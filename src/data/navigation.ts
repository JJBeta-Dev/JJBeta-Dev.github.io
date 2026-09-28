/**
 * Anclas de sección que usan el menú, el footer y el modo contorno beta.
 * `labelKey` apunta a la clave i18n de la etiqueta visible.
 */
export const SECTIONS = [
  { id: 'inicio', labelKey: 'menu.home' },
  { id: 'proyectos', labelKey: 'menu.projects' },
  { id: 'acerca', labelKey: 'menu.about' },
  { id: 'tecnologias', labelKey: 'menu.tech' },
  { id: 'contacto', labelKey: 'menu.contact' },
] as const

/**
 * Identificador de una sección de la página.
 */
export type SectionId = (typeof SECTIONS)[number]['id']
