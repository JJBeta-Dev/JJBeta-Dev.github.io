import { act, fireEvent, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createRoutesStub } from 'react-router'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ScrollTrigger } from '@/plugins/gsap'
import { i18n } from '@/plugins/i18n'
import AppProviders from '@/providers/AppProviders'
import CaseRoute from '@/routes/case'
import NotFoundRoute from '@/routes/notFound'
import HomeView from '@/views/HomeView'
import { mockMedia } from '../renderWithProviders'
import { intersectAll } from '../setupTest'

vi.mock('@/services/githubService', () => ({
  getRepositoryActivity: vi.fn(async () => ({
    pushedAt: new Date(Date.now() - 2 * 86_400_000),
    version: 'v0.1.0',
  })),
}))

/**
 * Monta la app con las rutas reales en un router en memoria.
 *
 * @param {string} path - Ruta inicial.
 * @returns {import('@testing-library/react').RenderResult} Resultado del render.
 * @example
 * renderApp('/casos/perfil')
 */
const renderApp = (path = '/') => {
  const Stub = createRoutesStub([
    {
      path: '/',
      Component: () => (
        <AppProviders>
          <HomeView />
        </AppProviders>
      ),
      children: [{ path: 'casos/:slug', Component: CaseRoute }],
    },
    {
      path: '*',
      Component: () => (
        <AppProviders>
          <NotFoundRoute />
        </AppProviders>
      ),
    },
  ])
  return render(<Stub initialEntries={[path]} />)
}

const fakeContext = new Proxy({}, { get: () => () => ({ addColorStop: () => {} }) })

beforeEach(() => {
  HTMLCanvasElement.prototype.getContext = vi.fn(() => fakeContext) as never
  vi.stubGlobal('navigator', { ...navigator, clipboard: { writeText: vi.fn().mockResolvedValue(undefined) } })
})

afterEach(() => {
  vi.unstubAllGlobals()
  mockMedia([])
  document.body.className = ''
  document.documentElement.className = ''
})

describe.each([
  ['movimiento reducido', ['prefers-reduced-motion', 'pointer: fine']],
  ['animaciones activas', ['pointer: fine']],
  ['escritorio', ['pointer: fine', 'min-width: 901px']],
])('Página principal con %s', (_, media) => {
  beforeEach(() => mockMedia(media))

  it('renderiza las secciones, el menú y el juego de secretos', async () => {
    const user = userEvent.setup()
    renderApp()
    expect(await screen.findByRole('heading', { level: 1 })).toHaveTextContent('JJBeta')
    expect(screen.getByRole('main')).toBeInTheDocument()
    ;['proyectos', 'acerca', 'tecnologias', 'contacto'].forEach((id) =>
      expect(document.getElementById(id)).toBeInTheDocument(),
    )

    const menuButton = screen.getByRole('button', { name: i18n.t('a11y.openMenu') })
    await user.click(menuButton)
    expect(menuButton).toHaveAttribute('aria-expanded', 'true')
    expect(document.body).toHaveClass('menu-open')
    await user.keyboard('{Escape}')
    expect(menuButton).toHaveAttribute('aria-expanded', 'false')
    await user.click(menuButton)
    await user.click(
      within(screen.getByRole('navigation', { name: i18n.t('a11y.mainNav') })).getByText(
        i18n.t('menu.contact'),
      ),
    )
    expect(menuButton).toHaveAttribute('aria-expanded', 'false')

    await user.click(screen.getByRole('button', { name: /Secretos/ }))
    expect(document.getElementById('hint')).toHaveClass('show')
    intersectAll(true)
    intersectAll(false)
    act(() => window.dispatchEvent(new Event('resize')))
    act(() => window.dispatchEvent(new Event('load')))
  })

  it('los easter eggs revelan secretos', async () => {
    const user = userEvent.setup()
    renderApp()
    const heading = await screen.findByRole('heading', { level: 1 })
    await user.click(heading)
    expect(await screen.findByText(i18n.t('secrets.found.name'))).toBeInTheDocument()

    const spheres = document.querySelectorAll('.pop')
    ;[0, 1, 2].forEach((i) => fireEvent.click(spheres[i] as Element))
    expect(screen.getByText(/1\/5|2\/5/)).toBeInTheDocument()

    await user.keyboard('beta')
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 900))
    })
    const toolbar = screen.getByRole('toolbar', { name: i18n.t('a11y.wireToolbar') })
    await user.click(within(toolbar).getByRole('button', { name: i18n.t('wire.grid') }))
    await user.click(within(toolbar).getByRole('button', { name: i18n.t('wire.measure') }))
    fireEvent.pointerMove(window, { clientX: 10, clientY: 10 })
    await user.keyboard('{Escape}')
    await user.click(within(toolbar).getByRole('button', { name: /Salir/ }))

    fireEvent.pointerDown(document.body, { button: 0, clientX: 5, clientY: 5, pointerType: 'mouse' })
    fireEvent.pointerMove(window, { clientX: 900, clientY: 5 })
    fireEvent.pointerUp(window)
    fireEvent.pointerOver(heading)
    fireEvent.pointerMove(window, { clientX: 20, clientY: 20 })
    fireEvent.scroll(window)
    fireEvent.pointerLeave(document.documentElement)
  })

  it('el editor da formato, cambia fuente y tamaño, y el correo se copia', async () => {
    const user = userEvent.setup()
    renderApp()
    const bold = await screen.findByRole('button', { name: i18n.t('a11y.bold') })
    await user.click(bold)
    expect(bold).toHaveAttribute('aria-pressed', 'true')
    expect(document.getElementById('editor')).toHaveClass('bold')
    await user.click(bold)

    await user.click(screen.getByRole('button', { name: /^Fuente: / }))
    await user.click(screen.getByRole('option', { name: 'Comic Sans' }))
    await user.click(screen.getByRole('button', { name: /^Fuente: / }))
    await user.click(screen.getByRole('option', { name: 'Poppins' }))
    await user.click(screen.getByRole('button', { name: /^Tamaño: / }))
    await user.click(screen.getByRole('option', { name: '16pt' }))

    await user.click(screen.getByRole('button', { name: /Escríbeme/ }))
    expect(
      await screen.findByText(i18n.t('contact.copied', { email: 'jjbetacode@gmail.com' })),
    ).toBeInTheDocument()
  })

  it('los callbacks de scroll dibujan el hilo, aceleran la banda e inclinan la galería', async () => {
    renderApp()
    await screen.findByRole('main')
    const frames = [0, 0.5, 1].map((progress) => ({
      progress,
      direction: 1,
      isActive: progress === 0.5,
      getVelocity: () => 800,
    }))
    act(() =>
      ScrollTrigger.getAll().forEach((trigger) => {
        const vars = trigger.vars
        frames.forEach((frame) => {
          vars.onUpdate?.(frame as never)
          vars.onToggle?.(frame as never)
        })
        vars.onLeave?.(frames[2] as never)
        vars.onLeaveBack?.(frames[0] as never)
        if (typeof vars.start === 'function') vars.start(trigger)
        if (typeof vars.end === 'function') vars.end(trigger)
      }),
    )
    expect(document.querySelector('.thread-a')).toHaveAttribute('d')
  })

  it('abre un caso desde su tarjeta, pasa al siguiente y se cierra con Escape', async () => {
    const user = userEvent.setup()
    renderApp()
    await user.click(await screen.findByRole('link', { name: /Sistema visual de mi perfil/ }))
    const dialog = await screen.findByRole('dialog', {}, { timeout: 3000 })
    expect(within(dialog).getByRole('heading', { level: 2, name: /cuida/ })).toBeInTheDocument()
    expect(screen.getByRole('main')).toHaveAttribute('inert')
    expect(await within(dialog).findByText(/v0\.1\.0/)).toBeInTheDocument()
    intersectAll(true)

    await user.click(within(dialog).getByRole('link', { name: /Tailwind Strict Colors/ }))
    expect(await screen.findByRole('heading', { name: /respetado/ }, { timeout: 3000 })).toBeInTheDocument()

    await user.keyboard('{Escape}')
    await vi.waitFor(() => expect(screen.queryByRole('dialog')).toBeNull(), { timeout: 4000 })
  })
})

describe('Casos de borde', () => {
  beforeEach(() => mockMedia(['prefers-reduced-motion', 'pointer: fine']))

  it('si el portapapeles falla abre el cliente de correo', async () => {
    const user = userEvent.setup()
    vi.stubGlobal('navigator', {
      ...navigator,
      clipboard: { writeText: vi.fn().mockRejectedValue(new Error('no')) },
    })
    const location = { href: '' }
    vi.stubGlobal('location', location)
    Object.defineProperty(window, 'location', { value: location, configurable: true })
    renderApp()
    await user.click(await screen.findByRole('button', { name: /Escríbeme/ }))
    await vi.waitFor(() => expect(location.href).toBe('mailto:jjbetacode@gmail.com'))
  })

  it('escribir «beta» dentro de un campo de texto no activa el modo beta', async () => {
    const user = userEvent.setup()
    renderApp()
    await screen.findByRole('main')
    const input = document.createElement('input')
    document.body.append(input)
    input.focus()
    await user.keyboard('beta')
    expect(document.body).not.toHaveClass('wire')
    input.remove()
  })
})

describe('Rutas directas', () => {
  beforeEach(() => mockMedia(['prefers-reduced-motion']))

  it('un enlace directo a un caso lo muestra y «Volver» regresa al inicio', async () => {
    const user = userEvent.setup()
    renderApp('/casos/asistente')
    const dialog = await screen.findByRole('dialog')
    expect(within(dialog).getByText(i18n.t('cases.asistente.linkLabel'))).toBeInTheDocument()
    await user.click(within(dialog).getByRole('button', { name: i18n.t('case.back') }))
    await vi.waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
  })

  it('un caso inexistente y una ruta desconocida muestran la página 404', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    renderApp('/pagina-que-no-existe')
    expect(await screen.findByRole('heading', { name: i18n.t('notFound.title') })).toBeInTheDocument()
    expect(() => renderApp('/casos/no-existe')).not.toThrow()
  })
})
