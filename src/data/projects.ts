import automation from '@/assets/images/photos/automatizacion.webp'
import profile from '@/assets/images/photos/perfil-github.webp'
import strictColors from '@/assets/images/photos/tailwind-strict-colors.webp'
import type { CaseSlug } from './caseSlugs'

/**
 * Datos intrínsecos de una imagen. El ancho y el alto se declaran siempre para evitar saltos de maquetación.
 */
export interface ImageAsset {
  src: string
  width: number
  height: number
}

/**
 * Una tarjeta de proyecto de la galería horizontal. Los textos viven en las claves i18n `projects.<id>`.
 * `slug` es `null` en un proyecto bloqueado que aún no tiene caso de estudio público.
 */
export interface Project {
  id: 'perfil' | 'tailwind' | 'sunra' | 'asistente'
  slug: CaseSlug | null
  image: ImageAsset | null
}

/**
 * Capturas compartidas por las tarjetas y los casos de estudio.
 */
export const PROJECT_IMAGES = {
  perfil: { src: profile, width: 1200, height: 480 },
  tailwind: { src: strictColors, width: 960, height: 392 },
  asistente: { src: automation, width: 1200, height: 585 },
} as const satisfies Record<CaseSlug, ImageAsset>

/**
 * Orden de la galería. El proyecto de movilidad eléctrica sigue bloqueado hasta su lanzamiento público.
 */
export const PROJECTS: readonly Project[] = [
  { id: 'perfil', slug: 'perfil', image: PROJECT_IMAGES.perfil },
  { id: 'tailwind', slug: 'tailwind', image: PROJECT_IMAGES.tailwind },
  { id: 'sunra', slug: null, image: null },
  { id: 'asistente', slug: 'asistente', image: PROJECT_IMAGES.asistente },
]
