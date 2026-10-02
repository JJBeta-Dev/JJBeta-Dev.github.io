import type { Config } from '@react-router/dev/config'
import { CASE_SLUGS } from './src/data/caseSlugs'

/**
 * Configuración de React Router en modo framework: un sitio estático (sin servidor) donde cada ruta
 * se prerrenderiza a HTML al compilar, para que los rastreadores y las vistas previas sociales lean
 * contenido real.
 *
 * @example
 * npm run build
 */
export default {
  appDirectory: 'src',
  ssr: false,
  prerender: ['/', ...CASE_SLUGS.map((slug) => `/casos/${slug}`)],
} satisfies Config
