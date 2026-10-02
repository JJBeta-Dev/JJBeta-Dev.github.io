/**
 * URL pública del sitio, usada en los enlaces canónicos, Open Graph y el sitemap.
 * Se puede sobrescribir en tiempo de build con `VITE_SITE_URL`.
 */
export const SITE_URL: string = import.meta.env.VITE_SITE_URL ?? 'https://jjbeta-dev.github.io/'

/**
 * Correo de contacto que se muestra y se copia en todo el sitio.
 */
export const EMAIL = 'jjbetacode@gmail.com'

/**
 * Cuenta de GitHub dueña de los repositorios que aparecen en los casos de estudio.
 */
export const GITHUB_OWNER = 'JJBeta-Dev'

/**
 * Perfiles externos. Siempre se abren en una pestaña nueva.
 */
export const SOCIAL_LINKS = {
  linkedin: 'https://www.linkedin.com/in/jjbeta',
  github: `https://github.com/${GITHUB_OWNER}`,
  instagram: 'https://www.instagram.com/soyjjbeta/',
  behance: 'https://www.behance.net/soyjjbeta',
  dribbble: 'https://dribbble.com/soyjjbeta',
} as const

/**
 * Perfiles públicos en el orden en que se muestran (contacto y footer). Los nombres son marcas.
 */
export const PROFILES = [
  { icon: 'linkedin', label: 'LinkedIn', href: SOCIAL_LINKS.linkedin },
  { icon: 'github', label: 'GitHub', href: SOCIAL_LINKS.github },
  { icon: 'instagram', label: 'Instagram', href: SOCIAL_LINKS.instagram },
  { icon: 'behance', label: 'Behance', href: SOCIAL_LINKS.behance },
  { icon: 'dribbble', label: 'Dribbble', href: SOCIAL_LINKS.dribbble },
] as const

/**
 * Zona horaria IANA de El Carmen de Viboral, que usa el reloj del footer.
 */
export const TIME_ZONE = 'America/Bogota'
