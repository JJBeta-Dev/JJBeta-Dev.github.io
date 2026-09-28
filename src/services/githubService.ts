import { isAxiosError } from 'axios'
import { z } from 'zod'
import { GITHUB_OWNER } from '@/data/site'
import { githubClient } from '@/plugins/axios'

const repositorySchema = z.object({ pushed_at: z.string().datetime(), html_url: z.string().url() })
const releaseSchema = z.object({ tag_name: z.string().min(1) })

/**
 * Actividad pública de un repositorio que se muestra en un caso de estudio.
 */
export interface RepositoryActivity {
  pushedAt: Date
  version: string | null
}

/**
 * Obtiene la etiqueta del último release publicado de un repositorio.
 *
 * @param {string} repository - Nombre del repositorio dentro de {@link GITHUB_OWNER}.
 * @returns {Promise<string | null>} La etiqueta del release, o `null` si el repositorio no tiene releases.
 * @throws {Error} Cuando la petición falla por cualquier motivo distinto de "sin releases" (404).
 * @example
 * await getLatestRelease('tailwind-strict-colors') // 'v0.1.0'
 */
export const getLatestRelease = async (repository: string): Promise<string | null> => {
  try {
    const { data } = await githubClient.get(`/repos/${GITHUB_OWNER}/${repository}/releases/latest`)
    return releaseSchema.parse(data).tag_name
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 404) return null
    throw error
  }
}

/**
 * Obtiene cuándo recibió un repositorio su último push y su último release, validando ambas respuestas
 * con Zod para que ningún contenido inesperado llegue a la UI.
 *
 * @param {string} repository - Nombre del repositorio dentro de {@link GITHUB_OWNER}.
 * @returns {Promise<RepositoryActivity>} La fecha del último push y la última versión, si existe.
 * @example
 * const { pushedAt, version } = await getRepositoryActivity('tailwind-strict-colors')
 */
export const getRepositoryActivity = async (repository: string): Promise<RepositoryActivity> => {
  const [response, version] = await Promise.all([
    githubClient.get(`/repos/${GITHUB_OWNER}/${repository}`),
    getLatestRelease(repository),
  ])
  const { pushed_at } = repositorySchema.parse(response.data)
  return { pushedAt: new Date(pushed_at), version }
}
