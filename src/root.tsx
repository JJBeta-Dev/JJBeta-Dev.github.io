import '@fontsource/montserrat/400.css'
import '@fontsource/montserrat/500.css'
import '@fontsource/montserrat/500-italic.css'
import '@fontsource/montserrat/600.css'
import '@fontsource/montserrat/700.css'
import '@fontsource/poppins/500.css'
import '@fontsource/poppins/600.css'
import '@fontsource/poppins/700.css'
import '@fontsource/poppins/800.css'
import type { ReactNode } from 'react'
import { isRouteErrorResponse, Links, Meta, Outlet, Scripts, ScrollRestoration } from 'react-router'
import clashDisplayBold from '@/assets/fonts/clash-display-700.woff2?url'
import { EMAIL, SITE_URL, SOCIAL_LINKS } from '@/data/site'
import AppProviders from '@/providers/AppProviders'
import { buildPersonSchema } from '@/utils/personSchema'
import NotFoundView from '@/views/NotFoundView'
import type { Route } from './+types/root'
import './styles/app.css'

/**
 * Script en línea síncrono que cambia `no-js` por `js` antes del primer pintado, para que el precargador y
 * los estados de entrada nunca parpadeen. Su hash se añade a la Content-Security-Policy durante el build.
 */
export const JS_CLASS_SCRIPT = "document.documentElement.classList.replace('no-js','js')"

const PERSON_SCHEMA = JSON.stringify(
  buildPersonSchema({ siteUrl: SITE_URL, email: EMAIL, profiles: Object.values(SOCIAL_LINKS) }),
)

/**
 * Enlaces a nivel de documento: iconos y una precarga de la fuente display del hero.
 *
 * @returns {import('react-router').LinkDescriptor[]} Descriptores de enlaces.
 * @example
 * export const links = rootLinks
 */
export const links: Route.LinksFunction = () => [
  { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' },
  { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
  { rel: 'preload', href: clashDisplayBold, as: 'font', type: 'font/woff2', crossOrigin: 'anonymous' },
]

/**
 * Estructura HTML compartida por todas las rutas.
 *
 * @param {{ children: import('react').ReactNode }} props - Ruta renderizada.
 * @returns {import('react').JSX.Element} El documento completo.
 * @example
 * <Layout><App /></Layout>
 */
export function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="es" className="no-js">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#6F3AF8" />
        <meta name="author" content="Jerónimo Jiménez Betancur" />
        <script>{JS_CLASS_SCRIPT}</script>
        <Meta />
        <Links />
        <script type="application/ld+json">{PERSON_SCHEMA}</script>
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}

/**
 * Raíz de la aplicación: los proveedores globales alrededor de la ruta coincidente.
 *
 * @returns {import('react').JSX.Element} La aplicación enrutada.
 * @example
 * export default App
 */
export default function App() {
  return (
    <AppProviders>
      <Outlet />
    </AppProviders>
  )
}

/**
 * Muestra la página de no encontrado para las respuestas 404 y registra cualquier otro error inesperado
 * antes de recurrir a la misma página amigable.
 *
 * @param {Route.ErrorBoundaryProps} props - El error lanzado.
 * @returns {import('react').JSX.Element} La página de error.
 * @example
 * export { ErrorBoundary }
 */
export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  if (!isRouteErrorResponse(error)) console.error(error)
  return (
    <AppProviders>
      <NotFoundView />
    </AppProviders>
  )
}
