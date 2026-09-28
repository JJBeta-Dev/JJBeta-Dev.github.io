import { useEffect, useEffectEvent, useState } from 'react'
import { useScrollControls } from './useScrollControls'

/**
 * Id del botón del menú, usado para devolverle el foco cuando el menú se cierra.
 */
export const MENU_BUTTON_ID = 'menu-button'

/**
 * Estado del menú a pantalla completa. Al abrirlo se pausa el scroll de la página y el cursor se
 * vuelve blanco (el fondo del menú es el color de marca); Escape lo cierra y devuelve el foco al botón.
 *
 * @returns {{ open: boolean, setMenu: (next: boolean) => void }} Si el menú está abierto y su setter.
 * @example
 * const { open, setMenu } = useMenu()
 * <button onClick={() => setMenu(!open)} />
 */
export const useMenu = () => {
  const [open, setOpen] = useState(false)
  const { setLock } = useScrollControls()

  /**
   * Abre o cierra el menú, bloqueando el scroll y marcando el `body` mientras está abierto.
   *
   * @param {boolean} next - `true` para abrir el menú, `false` para cerrarlo.
   * @returns {void} No devuelve nada.
   * @example
   * setMenu(false)
   */
  const setMenu = (next: boolean) => {
    setOpen(next)
    setLock('menu', next)
    document.body.classList.toggle('menu-open', next)
  }

  const closeFromKeyboard = useEffectEvent(() => {
    setMenu(false)
    document.getElementById(MENU_BUTTON_ID)?.focus()
  })

  useEffect(() => {
    if (!open) return
    /**
     * Cierra el menú al pulsar Escape.
     *
     * @param {KeyboardEvent} event - Tecla pulsada.
     * @returns {void} No devuelve nada.
     * @example
     * document.addEventListener('keydown', onKey)
     */
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeFromKeyboard()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  return { open, setMenu }
}
