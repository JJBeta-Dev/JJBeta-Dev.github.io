import type { MouseEvent } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { casePath } from '@/data/caseStudies'
import type { CaseSlug } from '@/data/caseSlugs'
import { useCurtain } from '@/hooks/useCurtain'
import { eventOrigin } from '@/utils/eventOrigin'
import { isModifiedClick } from '@/utils/isModifiedClick'

interface CaseLocationState {
  fromHome?: boolean
}

/**
 * Manejador de clic de un enlace a un caso.
 */
export type CaseClickHandler = (event: MouseEvent<HTMLElement>) => void

/**
 * Navegación entre la página principal y los casos de estudio envuelta en la cortina: crece desde
 * la tarjeta, la ruta del caso se abre debajo y la cortina sube; al cerrar, la cortina baja, se
 * vuelve a la página exactamente donde estaba y se encoge. Cada transición pasa por el candado de
 * la cortina, así que un doble clic o un doble Escape nunca navega dos veces. Los clics con
 * modificadores (Ctrl/Cmd, Shift, Alt) se dejan al navegador para abrir pestañas nuevas.
 *
 * @returns {{ openCase: (slug: CaseSlug) => CaseClickHandler, nextCase: (slug: CaseSlug) => CaseClickHandler, closeCase: () => Promise<void> }} Manejadores de navegación.
 * @example
 * const { openCase } = useCaseNavigation()
 * <Link to={casePath('perfil')} onClick={openCase('perfil')} />
 */
export const useCaseNavigation = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const curtain = useCurtain()
  const state = location.state as CaseLocationState | null

  /**
   * Crea el manejador de clic que navega a un caso con la cortina.
   *
   * @param {CaseSlug} slug - Caso de destino.
   * @param {boolean} replace - `true` para reemplazar la entrada del historial (de caso a caso).
   * @returns {CaseClickHandler} Manejador para el `onClick` del enlace.
   * @example
   * go('perfil', false)
   */
  const go =
    (slug: CaseSlug, replace: boolean): CaseClickHandler =>
    (event) => {
      if (isModifiedClick(event)) return
      event.preventDefault()
      const origin = eventOrigin(event)
      void curtain.transition(async () => {
        await curtain.cover(origin)
        await navigate(casePath(slug), {
          replace,
          preventScrollReset: true,
          state: replace ? state : { fromHome: true },
        })
      })
    }

  /**
   * Cierra el caso abierto: baja la cortina, vuelve a la página principal y encoge la cortina.
   *
   * @returns {Promise<void>} Se resuelve cuando la transición termina (o se descarta si ya había una).
   * @example
   * await closeCase()
   */
  const closeCase = (): Promise<void> =>
    curtain.transition(async () => {
      await curtain.drop()
      if (state?.fromHome) await navigate(-1)
      else await navigate('/', { replace: true, preventScrollReset: true })
      await curtain.close()
    })

  return {
    openCase: (slug: CaseSlug) => go(slug, false),
    nextCase: (slug: CaseSlug) => go(slug, true),
    closeCase,
  }
}
