import { useState, type RefObject } from 'react'
import { gsap } from '@/plugins/gsap'
import { nameFitScale } from '@/utils/nameFitScale'
import { usePrefersReducedMotion } from './usePrefersReducedMotion'
import { useSecrets } from './useSecrets'

/**
 * Easter egg del nombre del hero: al hacer clic en "JJBeta" se despliega en su sitio como
 * J·erónimo J·iménez Beta·ncur, se resalta y vuelve a cerrarse al cabo de un momento.
 * El significado también se anuncia a los lectores de pantalla mediante una región viva.
 *
 * @param {import('react').RefObject<HTMLElement | null>} scope - Elemento que contiene `.me-name` y sus
 * partes ocultas `.name-extra`.
 * @returns {{ reveal: (message: string) => void, announcement: string }} El manejador del clic y el texto
 * que se anuncia.
 * @example
 * const { reveal, announcement } = useNameReveal(title)
 */
export const useNameReveal = (scope: RefObject<HTMLElement | null>) => {
  const reduced = usePrefersReducedMotion()
  const secrets = useSecrets()
  const [announcement, setAnnouncement] = useState('')

  /**
   * Despliega el nombre completo, lo anuncia y marca el secreto como descubierto. Si la animación
   * ya está en curso, no hace nada.
   *
   * @param {string} message - Texto que se anuncia a los lectores de pantalla.
   * @returns {void} No devuelve nada.
   * @example
   * reveal('JJBeta significa Jerónimo Jiménez Betancur')
   */
  const reveal = (message: string) => {
    const root = scope.current
    const name = root?.querySelector<HTMLElement>('.me-name')
    if (!root || !name || name.dataset.revealing) return
    name.dataset.revealing = 'true'
    const extras = [...root.querySelectorAll<HTMLElement>('.name-extra')]
    const letters = extras.map((extra) => extra.children)
    const chars = root.querySelectorAll('.me-name > .char')
    const widths = extras.map((extra) => extra.scrollWidth)
    const box = name.getBoundingClientRect()
    const scale = nameFitScale(box.left, box.width, widths, window.innerWidth)
    const speed = reduced ? 0 : 1
    setAnnouncement(message)
    gsap
      .timeline({
        defaults: { ease: 'power4.out' },
        /**
         * Libera el nombre para una nueva revelación y limpia el anuncio.
         *
         * @returns {void} No devuelve nada.
         * @example
         * onComplete()
         */
        onComplete: () => {
          delete name.dataset.revealing
          setAnnouncement('')
        },
      })
      .to(name, { scale, duration: 0.7 * speed }, 0)
      .to(
        extras,
        {
          /**
           * Ancho natural de cada parte oculta del nombre.
           *
           * @param {number} i - Índice de la parte.
           * @returns {number} Ancho en píxeles al que se despliega.
           * @example
           * width(0)
           */
          width: (i: number) => widths[i] ?? 0,
          duration: 0.8 * speed,
          stagger: 0.12,
        },
        0,
      )
      .fromTo(
        letters,
        { yPercent: 110, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 0.6 * speed, stagger: 0.03 },
        0.1,
      )
      .to(chars, { color: 'var(--color-hover)', duration: 0.3, stagger: 0.04 }, 0.2)
      .add(() => {}, '+=2.6')
      .to(letters, { yPercent: -110, opacity: 0, duration: 0.4 * speed, stagger: 0.015, ease: 'power2.in' })
      .to(extras, { width: 0, duration: 0.6 * speed, ease: 'power3.inOut' }, '<.2')
      .to(name, { scale: 1, duration: 0.6 * speed, ease: 'power3.inOut' }, '<')
      .to(chars, { color: 'var(--color-main)', duration: 0.3 }, '<')
    secrets.reveal('name')
  }

  return { reveal, announcement }
}
