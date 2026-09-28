import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach, vi } from 'vitest'

afterEach(() => cleanup())

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn((query: string) => ({
    matches: false,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })),
})

/**
 * Registro de los observadores creados en las pruebas, para poder simular intersecciones.
 */
export const observers: ObserverStub[] = []

/**
 * Doble de prueba de IntersectionObserver y ResizeObserver que guarda su callback.
 */
export class ObserverStub {
  callback: (entries: unknown[]) => void
  targets: Element[] = []
  unobserve = vi.fn()
  disconnect = vi.fn()

  /**
   * Crea el observador y lo registra.
   *
   * @param {(entries: unknown[]) => void} callback - Función que recibe las entradas.
   * @example
   * new ObserverStub(() => {})
   */
  constructor(callback: (entries: unknown[]) => void) {
    this.callback = callback
    observers.push(this)
  }

  /**
   * Empieza a observar un elemento.
   *
   * @param {Element} target - Elemento observado.
   * @returns {void} No devuelve nada.
   * @example
   * observer.observe(document.body)
   */
  observe(target: Element): void {
    this.targets.push(target)
  }
}

/**
 * Dispara todas las intersecciones registradas como visibles o no visibles.
 *
 * @param {boolean} isIntersecting - Si los elementos se consideran en pantalla.
 * @returns {void} No devuelve nada.
 * @example
 * intersectAll(true)
 */
export const intersectAll = (isIntersecting: boolean): void =>
  observers.forEach((observer) =>
    observer.callback(observer.targets.map((target) => ({ target, isIntersecting }))),
  )

Object.assign(window, { IntersectionObserver: ObserverStub, ResizeObserver: ObserverStub })
Object.assign(document, {
  fonts: { ready: Promise.resolve(), addEventListener: vi.fn(), removeEventListener: vi.fn() },
})
Object.assign(SVGElement.prototype, {
  getTotalLength: () => 100,
  getPointAtLength: () => ({ x: 0, y: 0 }),
})
HTMLCanvasElement.prototype.getContext = vi.fn(() => null) as unknown as HTMLCanvasElement['getContext']
Element.prototype.scrollIntoView = vi.fn()
document.elementFromPoint = vi.fn(() => document.body)

/**
 * jsdom no calcula layout y deja `offsetParent` siempre en `null`; GSAP interpreta eso como un
 * elemento oculto y lo saca del DOM para medirlo, desordenando los espacios entre palabras. En el
 * navegador un elemento visible sí tiene `offsetParent`, así que se simula con su padre.
 */
Object.defineProperty(HTMLElement.prototype, 'offsetParent', {
  configurable: true,
  get(this: HTMLElement) {
    return this.parentElement
  },
})
