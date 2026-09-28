import type { MouseEvent } from 'react'
import { useLocation, useNavigate } from 'react-router'
import type { CaseSlug } from '@/data/caseSlugs'
import { eventOrigin } from '@/utils/eventOrigin'
import { useCurtain } from './useCurtain'

interface CaseLocationState {
  fromHome?: boolean
}

/**
 * Navegación entre la página de inicio y los casos de estudio, envuelta en la transición de la
 * cortina: la cortina crece desde la tarjeta pulsada, la ruta del caso se abre debajo y la cortina
 * se levanta. Al cerrar, la cortina cae, se vuelve a la página justo donde estaba y se encoge.
 *
 * @returns {{ openCase: (slug: CaseSlug) => (event: import('react').MouseEvent<HTMLElement>) => Promise<void>, nextCase: (slug: CaseSlug) => (event: import('react').MouseEvent<HTMLElement>) => Promise<void>, closeCase: () => Promise<void> }}
 * Manejadores para abrir un caso desde una tarjeta, saltar al siguiente caso y cerrar el caso.
 * @example
 * const { openCase } = useCaseNavigation()
 * <Link to="/casos/perfil" onClick={openCase('perfil')} />
 */
export const useCaseNavigation = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const curtain = useCurtain()
  const state = location.state as CaseLocationState | null

  /**
   * Crea el manejador de clic que abre un caso desde su tarjeta en la página de inicio.
   *
   * @param {CaseSlug} slug - Slug del caso que se abre.
   * @returns {(event: import('react').MouseEvent<HTMLElement>) => Promise<void>} Manejador del clic.
   * @example
   * <Link to="/casos/perfil" onClick={openCase('perfil')} />
   */
  const openCase = (slug: CaseSlug) => async (event: MouseEvent<HTMLElement>) => {
    event.preventDefault()
    await curtain.cover(eventOrigin(event))
    await navigate(`/casos/${slug}`, { preventScrollReset: true, state: { fromHome: true } })
  }

  /**
   * Crea el manejador de clic que salta al siguiente caso sin añadir una entrada al historial.
   *
   * @param {CaseSlug} slug - Slug del siguiente caso.
   * @returns {(event: import('react').MouseEvent<HTMLElement>) => Promise<void>} Manejador del clic.
   * @example
   * <Link to="/casos/sunra" onClick={nextCase('sunra')} />
   */
  const nextCase = (slug: CaseSlug) => async (event: MouseEvent<HTMLElement>) => {
    event.preventDefault()
    await curtain.cover(eventOrigin(event))
    await navigate(`/casos/${slug}`, { replace: true, preventScrollReset: true, state })
  }

  /**
   * Cierra el caso abierto y vuelve a la página de inicio tras la cortina.
   *
   * @returns {Promise<void>} Se resuelve cuando la cortina termina de cerrarse.
   * @example
   * await closeCase()
   */
  const closeCase = async () => {
    await curtain.drop()
    if (state?.fromHome) await navigate(-1)
    else await navigate('/', { replace: true, preventScrollReset: true })
    await curtain.close()
  }

  return { openCase, nextCase, closeCase }
}
