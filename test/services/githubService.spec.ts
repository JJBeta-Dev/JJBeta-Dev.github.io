import { afterEach, describe, expect, it, vi } from 'vitest'
import { githubClient } from '@/plugins/axios'
import { getLatestRelease, getRepositoryActivity } from '@/services/githubService'

afterEach(() => vi.restoreAllMocks())

describe('getLatestRelease', () => {
  it('devuelve la etiqueta de la última versión', async () => {
    const get = vi.spyOn(githubClient, 'get').mockResolvedValue({ data: [{ tag_name: 'v0.1.0' }] })
    await expect(getLatestRelease('tailwind-strict-colors')).resolves.toBe('v0.1.0')
    expect(get).toHaveBeenCalledWith(expect.stringMatching(/\/releases$/), { params: { per_page: 1 } })
  })

  it('devuelve null cuando el repositorio no tiene versiones', async () => {
    vi.spyOn(githubClient, 'get').mockResolvedValue({ data: [] })
    await expect(getLatestRelease('JJBeta-Dev')).resolves.toBeNull()
  })

  it('propaga cualquier otro error', async () => {
    vi.spyOn(githubClient, 'get').mockRejectedValue(new Error('red caída'))
    await expect(getLatestRelease('x')).rejects.toThrow('red caída')
  })

  it('rechaza respuestas que no cumplen el esquema', async () => {
    vi.spyOn(githubClient, 'get').mockResolvedValue({ data: [{ tag_name: '' }] })
    await expect(getLatestRelease('x')).rejects.toThrow()
  })
})

describe('getRepositoryActivity', () => {
  it('combina el último push y la versión', async () => {
    vi.spyOn(githubClient, 'get').mockImplementation(async (url: string) =>
      url.endsWith('/releases')
        ? { data: [{ tag_name: 'v1.0.0' }] }
        : { data: { pushed_at: '2026-09-26T10:00:00Z', html_url: 'https://github.com/JJBeta-Dev/x' } },
    )
    const activity = await getRepositoryActivity('x')
    expect(activity.version).toBe('v1.0.0')
    expect(activity.pushedAt.toISOString()).toBe('2026-09-26T10:00:00.000Z')
  })
})
