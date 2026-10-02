import { useEffect, useEffectEvent, useState } from 'react'
import { useDocumentClass } from '@/hooks/useDocumentClass'
import { useScrollLock } from '@/hooks/useScrollLock'

/**
 * Id del botón del menú, usado para devolverle el foco cuando el menú se cierra.
 */
export const MENU_BUTTON_ID = 'menu-button'

/**
 * Estado del menú a pantalla completa. Abrirlo pausa el scroll y pone el cursor en blanco (el
 * fondo del menú es del color de marca); Escape lo cierra y devuelve el foco al botón.
 *
 * @returns {{ open: boolean, setMenu: (next: boolean) => void }} Si el menú está abierto y cómo cambiarlo.
 * @example
 * const menu = useMenu()
 * <button onClick={() => menu.setMenu(!menu.open)} />
 */
export const useMenu = () => {
  const [open, setMenu] = useState(false)
  useScrollLock('menu', open)
  useDocumentClass('body', 'menu-open', open)

  const closeFromKeyboard = useEffectEvent(() => {
    setMenu(false)
    document.getElementById(MENU_BUTTON_ID)?.focus()
  })

  useEffect(() => {
    if (!open) return
    /**
     * Cierra el menú con Escape.
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
