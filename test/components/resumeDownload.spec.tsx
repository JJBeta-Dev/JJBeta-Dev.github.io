import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import ResumeDownload, { RESUME_FILE } from '@/components/about/ResumeDownload'
import { renderWithProviders } from '@test/renderWithProviders'

describe('ResumeDownload', () => {
  it('descarga el PDF de la hoja de vida con un nombre accesible', async () => {
    renderWithProviders(<ResumeDownload />)
    const link = await screen.findByRole('link', { name: 'Descargar mi hoja de vida en PDF' })
    expect(link).toHaveAttribute('href', RESUME_FILE)
    expect(link).toHaveAttribute('download')
    expect(link).toHaveAttribute('data-cursor-link')
  })
})
