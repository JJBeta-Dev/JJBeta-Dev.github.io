import { afterEach, describe, expect, it, vi } from 'vitest'
import { copyText } from '@/services/clipboardService'

afterEach(() => vi.unstubAllGlobals())

describe('copyText', () => {
  it('copia y confirma', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    vi.stubGlobal('navigator', { clipboard: { writeText } })
    await expect(copyText('hola')).resolves.toBe(true)
    expect(writeText).toHaveBeenCalledWith('hola')
  })

  it('devuelve false cuando el portapapeles falla', async () => {
    vi.stubGlobal('navigator', { clipboard: { writeText: vi.fn().mockRejectedValue(new Error('denegado')) } })
    await expect(copyText('hola')).resolves.toBe(false)
  })
})
