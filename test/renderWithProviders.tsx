import { render } from '@testing-library/react'
import type { ReactElement } from 'react'
import { createRoutesStub } from 'react-router'
import AppProviders from '@/providers/AppProviders'

/**
 * Renderiza un elemento dentro de todos los proveedores de la app y de un router en memoria.
 *
 * @param {ReactElement} element - Elemento a probar.
 * @param {string} path - Ruta inicial.
 * @returns {import('@testing-library/react').RenderResult} Resultado de Testing Library.
 * @example
 * renderWithProviders(<Toast message="Hola" icon="spark" visible />)
 */
export const renderWithProviders = (element: ReactElement, path = '/') => {
  const Stub = createRoutesStub([
    {
      path: '/',
      Component: () => <AppProviders>{element}</AppProviders>,
      children: [{ path: 'casos/:slug', Component: () => null }],
    },
  ])
  return render(<Stub initialEntries={[path]} />)
}

/**
 * Hace que `matchMedia` responda `true` para las consultas indicadas (por ejemplo, mouse fino).
 *
 * @param {string[]} queries - Fragmentos de media query que deben coincidir.
 * @returns {void} No devuelve nada.
 * @example
 * mockMedia(['pointer: fine'])
 */
export const mockMedia = (queries: string[]): void => {
  window.matchMedia = ((query: string) => ({
    matches: queries.some((fragment) => query.includes(fragment)),
    media: query,
    addEventListener: () => {},
    removeEventListener: () => {},
  })) as unknown as typeof window.matchMedia
}
