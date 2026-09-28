import { homeMeta } from '@/helpers/pageMeta'
import HomeView from '@/views/HomeView'

export const meta = homeMeta

/**
 * Ruta de inicio: el portafolio de una sola página. Los casos de estudio se pintan dentro de ella a través
 * de su outlet.
 *
 * @returns {import('react').JSX.Element} La vista de inicio.
 * @example
 * route('', 'routes/home.tsx')
 */
export default function HomeRoute() {
  return <HomeView />
}
