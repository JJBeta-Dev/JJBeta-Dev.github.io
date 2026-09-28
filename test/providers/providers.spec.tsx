import { act, render, renderHook, screen } from '@testing-library/react'
import type { ReactNode } from 'react'
import { I18nextProvider } from 'react-i18next'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { SECRET_KEYS } from '@/contexts/SecretsContext'
import { ToastContext } from '@/contexts/ToastContext'
import { useCurtain } from '@/hooks/useCurtain'
import { useRequiredContext } from '@/hooks/useRequiredContext'
import { useScrollControls } from '@/hooks/useScrollControls'
import { useSecrets } from '@/hooks/useSecrets'
import { useToast } from '@/hooks/useToast'
import { i18n } from '@/plugins/i18n'
import CurtainProvider from '@/providers/CurtainProvider'
import ScrollProvider from '@/providers/ScrollProvider'
import SecretsProvider from '@/providers/SecretsProvider'
import ToastProvider from '@/providers/ToastProvider'
import { mockMedia } from '../renderWithProviders'

vi.mock('@/helpers/confetti', () => ({ rainConfetti: vi.fn(), burstAt: vi.fn() }))

/**
 * Proveedores mínimos para probar los hooks de contexto.
 *
 * @param {{ children: ReactNode }} props - Árbol a envolver.
 * @returns {import('react').JSX.Element} Árbol con proveedores.
 * @example
 * renderHook(useToast, { wrapper: Wrapper })
 */
const Wrapper = ({ children }: { children: ReactNode }) => (
  <I18nextProvider i18n={i18n}>
    <ToastProvider>
      <SecretsProvider>
        <ScrollProvider>
          <CurtainProvider>{children}</CurtainProvider>
        </ScrollProvider>
      </SecretsProvider>
    </ToastProvider>
  </I18nextProvider>
)

afterEach(() => {
  vi.useRealTimers()
  mockMedia([])
})

describe('useRequiredContext', () => {
  it('falla con un mensaje claro fuera del proveedor', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    expect(() => renderHook(() => useRequiredContext(ToastContext, 'ToastProvider'))).toThrow(
      'ToastProvider is missing in the component tree',
    )
  })
})

describe('ToastProvider', () => {
  it('muestra el mensaje y lo oculta al terminar su duración', () => {
    vi.useFakeTimers()
    const { result } = renderHook(useToast, { wrapper: Wrapper })
    act(() => result.current.show('Correo copiado', 'copy', 1000))
    expect(screen.getByRole('status')).toHaveClass('show')
    expect(screen.getByText('Correo copiado')).toBeInTheDocument()
    act(() => vi.advanceTimersByTime(1000))
    expect(screen.getByRole('status')).not.toHaveClass('show')
  })

  it('usa icono y duración por defecto', () => {
    vi.useFakeTimers()
    const { result } = renderHook(useToast, { wrapper: Wrapper })
    act(() => result.current.show('Hola'))
    act(() => vi.advanceTimersByTime(3200))
    expect(screen.getByRole('status')).not.toHaveClass('show')
  })
})

describe('SecretsProvider', () => {
  it('está desactivado sin mouse: revelar no hace nada', () => {
    const { result } = renderHook(useSecrets, { wrapper: Wrapper })
    act(() => result.current.reveal('name'))
    expect(result.current.enabled).toBe(false)
    expect(result.current.found.size).toBe(0)
  })

  it('con mouse cuenta cada secreto una vez y celebra al completar los cinco', () => {
    mockMedia(['pointer: fine'])
    const { result } = renderHook(useSecrets, { wrapper: Wrapper })
    act(() => result.current.reveal('name'))
    act(() => result.current.reveal('name'))
    expect(result.current.found.size).toBe(1)
    expect(screen.getByText(i18n.t('secrets.found.name'))).toBeInTheDocument()
    SECRET_KEYS.forEach((key) => act(() => result.current.reveal(key)))
    expect(result.current.found.size).toBe(SECRET_KEYS.length)
    expect(screen.getByText(i18n.t('secrets.all'))).toBeInTheDocument()
  })
})

describe('ScrollProvider', () => {
  beforeEach(() => mockMedia(['prefers-reduced-motion']))

  it('desplaza y enfoca la sección de destino', () => {
    const { result } = renderHook(useScrollControls, { wrapper: Wrapper })
    render(<section id="destino">Destino</section>)
    const target = document.getElementById('destino') as HTMLElement
    target.scrollIntoView = vi.fn()
    act(() => result.current.scrollTo('#destino'))
    expect(target.scrollIntoView).toHaveBeenCalled()
    expect(target).toHaveFocus()
    act(() => result.current.scrollTo(target))
    act(() => result.current.scrollTo('#no-existe'))
  })

  it('los bloqueos son idempotentes', () => {
    const { result } = renderHook(useScrollControls, { wrapper: Wrapper })
    const setLock = result.current.setLock
    act(() => setLock('menu', true))
    act(() => setLock('menu', true))
    act(() => setLock('menu', false))
    expect(result.current.setLock).toBe(setLock)
  })

  it('con movimiento activo crea el scroll suave y lo destruye al desmontar', () => {
    mockMedia([])
    const { result, unmount } = renderHook(useScrollControls, { wrapper: Wrapper })
    render(<section id="suave">Suave</section>)
    act(() => result.current.setLock('case', true))
    act(() => result.current.setLock('case', false))
    act(() => result.current.scrollTo('#suave'))
    unmount()
  })
})

describe('CurtainProvider', () => {
  it('con movimiento reducido cada paso se resuelve al instante', async () => {
    mockMedia(['prefers-reduced-motion'])
    const { result } = renderHook(useCurtain, { wrapper: Wrapper })
    await act(async () => {
      await result.current.cover({ x: 10, y: 10 })
      await result.current.lift()
      await result.current.drop()
      await result.current.close()
    })
    expect(document.querySelector('.curtain')).toBeInTheDocument()
  })
})
