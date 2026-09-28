import { useState, type ReactNode } from 'react'
import { ScrollContext, type ScrollLock } from '@/contexts/ScrollContext'
import { useDocumentClass } from '@/hooks/useDocumentClass'
import { useLenis } from '@/hooks/useLenis'

/**
 * Comparte el scroll suave con todo el sitio: los bloqueos activos (menú, caso de estudio) y el
 * desplazamiento hacia una sección. Lenis vive en `useLenis`; con movimiento reducido se usa el
 * scroll nativo.
 *
 * @param {{ children: ReactNode }} props - Subárbol de la aplicación.
 * @returns {import('react').JSX.Element} El provider de scroll.
 * @example
 * <ScrollProvider><HomeView /></ScrollProvider>
 */
export default function ScrollProvider({ children }: { children: ReactNode }) {
  const [locks, setLocks] = useState<ReadonlySet<ScrollLock>>(new Set())
  const locked = locks.size > 0
  const lenis = useLenis(locked)
  useDocumentClass('html', 'scroll-locked', locked)

  /**
   * Desplaza la página hasta un elemento y le pasa el foco sin volver a desplazar. Usa `force`
   * porque puede llamarse en el mismo instante en que se libera un bloqueo (al cerrar el menú), y
   * mueve el foco en el siguiente frame, cuando React ya quitó el `inert` de la página.
   *
   * @param {string | HTMLElement} target - Selector CSS o elemento de destino.
   * @returns {void} No devuelve nada.
   * @example
   * scrollTo('#contacto')
   */
  const scrollTo = (target: string | HTMLElement) => {
    const element = typeof target === 'string' ? document.querySelector<HTMLElement>(target) : target
    if (!element) return
    if (lenis.current) lenis.current.scrollTo(element, { offset: 0, duration: 1.4, force: true })
    else element.scrollIntoView()
    element.setAttribute('tabindex', '-1')
    requestAnimationFrame(() => element.focus({ preventScroll: true }))
  }

  return <ScrollContext value={{ scrollTo, setLocks }}>{children}</ScrollContext>
}
