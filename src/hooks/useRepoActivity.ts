import { useQuery } from '@tanstack/react-query'
import { getRepositoryActivity } from '@/services/githubService'

/**
 * Actividad pública en vivo de un repositorio (último push y última versión), cacheada por TanStack
 * Query. Se desactiva cuando el caso de estudio no tiene repositorio público.
 *
 * @param {string | null} repository - Nombre del repositorio, o `null` para omitir la petición.
 * @returns {import('@tanstack/react-query').UseQueryResult<import('@/services/githubService').RepositoryActivity>}
 * El resultado de la consulta.
 * @example
 * const { data } = useRepoActivity('tailwind-strict-colors')
 */
export const useRepoActivity = (repository: string | null) =>
  useQuery({
    queryKey: ['repository-activity', repository],
    queryFn: () => getRepositoryActivity(repository as string),
    enabled: repository !== null,
  })
