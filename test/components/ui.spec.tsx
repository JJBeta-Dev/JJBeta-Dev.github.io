import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import AnchorLink from '@/components/ui/anchor-link/AnchorLink'
import BrowserWindow from '@/components/ui/browser-window/BrowserWindow'
import Dropdown from '@/components/ui/dropdown/Dropdown'
import BrandIcon from '@/components/ui/icons/BrandIcon'
import LineIcon from '@/components/ui/icons/LineIcon'
import Pill from '@/components/ui/pill/Pill'
import Toast from '@/components/ui/toast/Toast'
import { FONT_OPTIONS } from '@/data/editorOptions'
import { mockMedia, renderWithProviders } from '../renderWithProviders'

describe('iconos', () => {
  it('LineIcon es decorativo y usa currentColor', () => {
    const { container } = render(<LineIcon name="copy" />)
    const svg = container.querySelector('svg')
    expect(svg).toHaveAttribute('aria-hidden', 'true')
    expect(svg).toHaveAttribute('stroke', 'currentColor')
  })

  it('BrandIcon dibuja el logo o el lápiz propio', () => {
    const { container, rerender } = render(<BrandIcon name="react" />)
    expect(container.querySelector('path')?.getAttribute('d')).toMatch(/^M/)
    rerender(<BrandIcon name="pencil" />)
    expect(container.querySelector('svg')).toHaveAttribute('stroke', 'currentColor')
  })
})

describe('Toast, Pill y BrowserWindow', () => {
  it('Toast es una región viva y solo muestra el icono con mensaje', () => {
    const { container, rerender } = render(<Toast message="" icon="spark" visible={false} />)
    expect(container.querySelector('.toast')).not.toHaveClass('show')
    expect(container.querySelector('svg')).toBeNull()
    rerender(<Toast message="Hola" icon="spark" visible />)
    expect(container.querySelector('.toast')).toHaveClass('show')
    expect(container.querySelector('.toast')).toHaveAttribute('aria-hidden', 'true')
    expect(screen.getByRole('status')).toHaveTextContent('Hola')
  })

  it('Pill muestra su contenido', () => {
    render(<Pill>Diseñador UX/UI</Pill>)
    expect(screen.getByText('Diseñador UX/UI')).toBeInTheDocument()
  })

  it('BrowserWindow declara tamaño y carga diferida', () => {
    render(<BrowserWindow image={{ src: '/a.webp', width: 1200, height: 480 }} alt="Captura" />)
    const image = screen.getByAltText('Captura')
    expect(image).toHaveAttribute('width', '1200')
    expect(image).toHaveAttribute('loading', 'lazy')
  })
})

describe('AnchorLink', () => {
  it('conserva el href y avisa al navegar', async () => {
    const onNavigate = vi.fn()
    renderWithProviders(
      <>
        <AnchorLink to="#destino" onNavigate={onNavigate} magnetic linkCursor cursor="Ir">
          Ir
        </AnchorLink>
        <section id="destino">Destino</section>
      </>,
    )
    const link = await screen.findByRole('link', { name: 'Ir' })
    expect(link).toHaveAttribute('href', '#destino')
    expect(link).toHaveAttribute('data-magnetic', '')
    fireEvent.click(link, { ctrlKey: true })
    expect(onNavigate).not.toHaveBeenCalled()
    fireEvent.click(link)
    expect(onNavigate).toHaveBeenCalled()
    await waitFor(() => expect(document.getElementById('destino')).toHaveFocus())
  })

  it('no falla si el destino no existe', async () => {
    renderWithProviders(<AnchorLink to="#nada">Nada</AnchorLink>)
    fireEvent.click(await screen.findByRole('link', { name: 'Nada' }))
    expect(screen.getByRole('link', { name: 'Nada' })).toBeInTheDocument()
  })
})

describe('Dropdown', () => {
  beforeEach(() => mockMedia(['prefers-reduced-motion']))
  afterEach(() => mockMedia([]))

  const setup = () => {
    const onSelect = vi.fn()
    render(
      <>
        <Dropdown
          name="Fuente"
          listLabel="Fuentes"
          options={FONT_OPTIONS}
          selected={0}
          onSelect={onSelect}
          preview={(option) => ({ fontFamily: option.value ?? 'inherit' })}
        />
        <button type="button">afuera</button>
      </>,
    )
    return { onSelect, button: screen.getByRole('button', { name: 'Fuente: Montserrat' }) }
  }

  it('abre con clic, navega con flechas y elige con Enter', async () => {
    const user = userEvent.setup()
    const { onSelect, button } = setup()
    await user.click(button)
    expect(button).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByRole('option', { name: 'Montserrat' })).toHaveFocus()
    await user.keyboard('{ArrowDown}{ArrowDown}{Enter}')
    expect(onSelect).toHaveBeenCalledWith(2)
    expect(button).toHaveFocus()
    expect(button).toHaveAttribute('aria-expanded', 'false')
  })

  it('abre con la flecha, recorre con Inicio/Fin y cierra con Escape', async () => {
    const user = userEvent.setup()
    const { onSelect, button } = setup()
    button.focus()
    await user.keyboard('{ArrowDown}')
    await user.keyboard('{End}')
    expect(screen.getByRole('option', { name: 'Comic Sans' })).toHaveFocus()
    await user.keyboard('{Home}{ArrowUp}')
    expect(screen.getByRole('option', { name: 'Comic Sans' })).toHaveFocus()
    await user.keyboard('{Escape}')
    expect(button).toHaveAttribute('aria-expanded', 'false')
    expect(onSelect).not.toHaveBeenCalled()
  })

  it('elegir la opción actual no dispara cambios y un clic afuera cierra', async () => {
    const user = userEvent.setup()
    const { onSelect, button } = setup()
    await user.click(button)
    await user.click(screen.getByRole('option', { name: 'Montserrat' }))
    expect(onSelect).not.toHaveBeenCalled()
    await user.click(button)
    await user.click(screen.getByRole('button', { name: 'afuera' }))
    expect(button).toHaveAttribute('aria-expanded', 'false')
  })

  it('el tabulador cierra sin robar el foco y otras teclas se ignoran', async () => {
    const user = userEvent.setup()
    const { button } = setup()
    await user.click(button)
    await user.keyboard('a')
    expect(button).toHaveAttribute('aria-expanded', 'true')
    await user.keyboard('{Tab}')
    expect(button).toHaveAttribute('aria-expanded', 'false')
    fireEvent.keyDown(button, { key: 'a' })
    expect(button).toHaveAttribute('aria-expanded', 'false')
    await user.keyboard('{Space}')
  })

  it('con movimiento activo anima la apertura', async () => {
    mockMedia([])
    const user = userEvent.setup()
    const { button } = setup()
    await user.click(button)
    expect(screen.getByRole('listbox')).toBeVisible()
  })
})
