import { useEffect, useEffectEvent, type RefObject } from 'react'
import type { CaseSlug } from '@/data/caseSlugs'
import { useCurtain } from '@/hooks/useCurtain'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { useScrollLock } from '@/hooks/useScrollLock'
import { gsap, useGSAP } from '@/plugins/gsap'

/**
 * Ciclo de vida de un caso de estudio abierto: se pausa el scroll de la página (que además deja de
 * pintarse mientras el caso la cubre), el foco pasa al título, Escape lo cierra, la cortina sube,
 * el título entra palabra por palabra y cada bloque aparece al entrar en pantalla. Al cerrar, el
 * foco vuelve a la tarjeta del caso que estaba abierto. Si el modo beta está activo, Escape solo
 * cierra el modo beta.
 *
 * @param {import('react').RefObject<HTMLElement | null>} scope - Raíz del caso de estudio (el diálogo desplazable).
 * @param {CaseSlug} slug - Slug del caso, usado para devolver el foco a su tarjeta.
 * @param {() => void} onClose - Se llama cuando el visitante pulsa Escape.
 * @returns {void} No devuelve nada.
 * @example
 * useCaseView(dialog, 'perfil', closeCase)
 */
export const useCaseView = (
  scope: RefObject<HTMLElement | null>,
  slug: CaseSlug,
  onClose: () => void,
): void => {
  const reduced = usePrefersReducedMotion()
  const curtain = useCurtain()
  const close = useEffectEvent(onClose)
  const lift = useEffectEvent(() => curtain.lift())
  useScrollLock('case', true)

  useEffect(() => {
    const root = document.documentElement
    root.classList.add('case-open')
    scope.current?.querySelector<HTMLElement>('.case__title')?.focus({ preventScroll: true })
    lift()
    /**
     * Cierra el caso con Escape, salvo que el modo beta esté activo (ese Escape es suyo).
     *
     * @param {KeyboardEvent} event - Evento de teclado del documento.
     * @returns {void} No devuelve nada.
     * @example
     * document.addEventListener('keydown', onKey)
     */
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !document.body.classList.contains('wire')) close()
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      root.classList.remove('case-open')
      document.querySelector<HTMLElement>(`[data-case-link="${slug}"]`)?.focus({ preventScroll: true })
    }
  }, [scope, slug])

  useGSAP(
    (_, contextSafe) => {
      const root = scope.current
      if (!root || reduced || !contextSafe) return
      gsap
        .timeline({ delay: 0.35, defaults: { ease: 'power4.out' } })
        .fromTo(
          root.querySelectorAll('.case__title .w'),
          { yPercent: 110, opacity: 0, rotate: 6 },
          { yPercent: 0, opacity: 1, rotate: 0, stagger: 0.06, duration: 1 },
        )
        .fromTo('.case__kicker', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, 0)
        .fromTo(
          '.case__meta',
          { y: 60, rotate: 8, opacity: 0 },
          { y: 0, rotate: 1.5, opacity: 1, duration: 1.1, ease: 'elastic.out(1, .75)' },
          0.15,
        )
        .fromTo('.case__shot', { y: 90, opacity: 0 }, { y: 0, opacity: 1, duration: 1.1 }, 0.25)
      const blocks = root.querySelectorAll('.case__grid section, .case__next')
      gsap.set(blocks, { y: 60, opacity: 0 })
      const reveal = contextSafe((target: Element) =>
        gsap.to(target, { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out' }),
      )
      const observer = new IntersectionObserver(
        (entries) =>
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return
            reveal(entry.target)
            observer.unobserve(entry.target)
          }),
        { threshold: 0, rootMargin: '0px 0px -10% 0px' },
      )
      blocks.forEach((block) => observer.observe(block))
      return () => observer.disconnect()
    },
    { scope, dependencies: [reduced] },
  )
}
