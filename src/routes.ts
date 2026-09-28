import { route, type RouteConfig } from '@react-router/dev/routes'

/**
 * Tabla de rutas. Los casos de estudio van anidados en la ruta de inicio para que la página siga montada
 * debajo (la posición del scroll, la galería fijada y el estado se conservan mientras un caso está abierto).
 */
export default [
  route('', 'routes/home.tsx', [route('casos/:slug', 'routes/case.tsx')]),
  route('*', 'routes/notFound.tsx'),
] satisfies RouteConfig
