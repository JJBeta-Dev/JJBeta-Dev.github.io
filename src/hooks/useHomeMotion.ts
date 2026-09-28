import { useEffect, type RefObject } from 'react'
import { useTranslation } from 'react-i18next'
import { greetConsole } from '@/helpers/greetConsole'
import { readToken } from '@/helpers/readToken'
import { ScrollTrigger } from '@/plugins/gsap'
import { useIntro } from '@/hooks/useIntro'
import { useMagnetic } from '@/hooks/useMagnetic'
import { useMouseParallax } from '@/hooks/useMouseParallax'
import { usePopSpheres } from '@/hooks/usePopSpheres'
import { useScrollParallax } from '@/hooks/useScrollParallax'
import { useThread } from '@/hooks/useThread'

/**
 * Orquesta los efectos que abarcan toda la página principal: entrada, parallax del mouse y del
 * scroll, hilo punteado, magnetismo, esferas que se revientan y el saludo de la consola. Recalcula
 * ScrollTrigger cuando cargan las fuentes y la página, para que todas las posiciones sean exactas.
 *
 * @param {import('react').RefObject<HTMLElement | null>} main - Elemento `main` de la página.
 * @param {boolean} introReady - `true` cuando el cargador empieza a revelar la página.
 * @returns {void} No devuelve nada.
 * @example
 * useHomeMotion(main, introReady)
 */
export const useHomeMotion = (main: RefObject<HTMLElement | null>, introReady: boolean): void => {
  const { t } = useTranslation()
  useIntro(main, introReady)
  useScrollParallax(main)
  useMouseParallax(main)
  useThread(main)
  useMagnetic(main)
  usePopSpheres(main)

  useEffect(() => {
    /**
     * Recalcula todas las posiciones de ScrollTrigger.
     *
     * @returns {void} No devuelve nada.
     * @example
     * window.addEventListener('load', refresh)
     */
    const refresh = () => ScrollTrigger.refresh()
    document.fonts?.ready.then(refresh)
    window.addEventListener('load', refresh)
    return () => window.removeEventListener('load', refresh)
  }, [])

  useEffect(() => {
    greetConsole(t('toasts.console'), t('toasts.consoleText'), readToken('--color-main'))
  }, [t])
}
