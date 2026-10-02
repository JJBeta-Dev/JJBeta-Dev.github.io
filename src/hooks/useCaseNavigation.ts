import type { MouseEvent } from 'react'
import { useLocation, useNavigate, type NavigateOptions } from 'react-router'
import { casePath } from '@/data/caseStudies'
import type { CaseSlug } from '@/data/caseSlugs'
import { useCurtain } from '@/hooks/useCurtain'
import { eventOrigin } from '@/utils/eventOrigin'
import { isModifiedClick } from '@/utils/isModifiedClick'

/**
 * Estado que viaja en el historial al abrir un caso.
 */
interface CaseLocationState {
  fromHome?: boolean
}

/**
 * Manejador de clic de un enlace a un caso.
 */
export type CaseClickHandler = (event: MouseEvent<HTMLElement>) => void

/**
 * Crea el manejador que lleva a un caso envuelto en la cortina: crece desde el punto del clic y la
 * ruta se abre debajo. Pasa por el candado de la cortina, así que un doble clic nunca navega dos
 * veces, y deja al navegador los clics con modificadores (Ctrl/Cmd, Shift, Alt) para abrir pestañas.
 *
 * @returns {(slug: CaseSlug, options: NavigateOptions) => CaseClickHandler} Fábrica de manejadores.
 * @example
 * const toCase = useCaseLink()
 * <Link onClick={toCase('perfil', { state: { fromHome: true } })} />
 */
const useCaseLink = () => {
  const navigate = useNavigate()
  const curtain = useCurtain()

  return (slug: CaseSlug, options: NavigateOptions): CaseClickHandler =>
    (event) => {
      if (isModifiedClick(event)) return
      event.preventDefault()
      const origin = eventOrigin(event)
      void curtain.transition(async () => {
        await curtain.cover(origin)
        await navigate(casePath(slug), { preventScrollReset: true, ...options })
      })
    }
}

/**
 * Abre un caso desde la página principal. No lee la ubicación actual, así que las tarjetas no se
 * vuelven a renderizar con cada navegación.
 *
 * @returns {(slug: CaseSlug) => CaseClickHandler} Crea el manejador de clic de cada tarjeta.
 * @example
 * const openCase = useOpenCase()
 * <Link to={casePath('perfil')} onClick={openCase('perfil')} />
 */
export const useOpenCase = () => {
  const toCase = useCaseLink()
  return (slug: CaseSlug) => toCase(slug, { state: { fromHome: true } })
}

/**
 * Controles de un caso abierto: pasar al siguiente reemplazando la entrada del historial y cerrar.
 * Al cerrar, la cortina baja, se vuelve a la página exactamente donde estaba (o a la raíz si se
 * llegó directo al caso) y se encoge.
 *
 * @returns {{ nextCase: (slug: CaseSlug) => CaseClickHandler, closeCase: () => Promise<void> }} Manejadores del caso.
 * @example
 * const { nextCase, closeCase } = useCaseControls()
 */
export const useCaseControls = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const curtain = useCurtain()
  const toCase = useCaseLink()
  const state = location.state as CaseLocationState | null

  /**
   * Cierra el caso con la cortina y vuelve a la página principal.
   *
   * @returns {Promise<void>} Se resuelve cuando la cortina termina de encogerse.
   * @example
   * <button onClick={closeCase}>Volver</button>
   */
  const closeCase = (): Promise<void> =>
    curtain.transition(async () => {
      await curtain.drop()
      if (state?.fromHome) await navigate(-1)
      else await navigate('/', { replace: true, preventScrollReset: true })
      await curtain.close()
    })

  return {
    nextCase: (slug: CaseSlug) => toCase(slug, { replace: true, state }),
    closeCase,
  }
}
