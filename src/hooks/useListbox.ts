import { useEffect, useId, useState, type KeyboardEvent } from 'react'
import { gsap } from '@/plugins/gsap'
import { usePrefersReducedMotion } from './usePrefersReducedMotion'

/**
 * Opciones de {@link useListbox}.
 */
export interface ListboxOptions {
  count: number
  selected: number
  onSelect: (index: number) => void
}

/**
 * Desplegable accesible de selección única que sigue el patrón listbox de WAI-ARIA: se abre con
 * clic, Enter, Espacio o las flechas; Flechas/Inicio/Fin recorren las opciones; Enter o Espacio
 * eligen; Escape, Tab o un clic fuera lo cierran y el foco vuelve al botón.
 *
 * @param {ListboxOptions} options - Número de opciones, índice seleccionado y callback de selección.
 * @returns {{ open: boolean, buttonProps: object, listProps: object, optionProps: (index: number) => object }}
 * El estado y las props que se esparcen en el botón, la lista y cada opción.
 * @example
 * const listbox = useListbox({ count: 6, selected: 0, onSelect: setFont })
 * <button {...listbox.buttonProps} />
 */
export const useListbox = ({ count, selected, onSelect }: ListboxOptions) => {
  const id = useId()
  const reduced = usePrefersReducedMotion()
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(selected)
  const buttonId = `${id}-button`
  const listId = `${id}-list`
  /**
   * Construye el id del DOM de una opción.
   *
   * @param {number} index - Índice de la opción.
   * @returns {string} Id único de la opción.
   * @example
   * optionId(2)
   */
  const optionId = (index: number) => `${id}-option-${index}`

  /**
   * Abre la lista con la opción seleccionada como activa.
   *
   * @returns {void} No devuelve nada.
   * @example
   * openList()
   */
  const openList = () => {
    setActive(selected)
    setOpen(true)
  }
  /**
   * Cierra la lista y, opcionalmente, devuelve el foco al botón.
   *
   * @param {boolean} [returnFocus] - Si el foco debe volver al botón (por defecto `true`).
   * @returns {void} No devuelve nada.
   * @example
   * close(false)
   */
  const close = (returnFocus = true) => {
    setOpen(false)
    if (returnFocus) document.getElementById(buttonId)?.focus()
  }
  /**
   * Elige una opción, cierra la lista y avisa solo si la selección cambió.
   *
   * @param {number} index - Índice de la opción elegida.
   * @returns {void} No devuelve nada.
   * @example
   * pick(3)
   */
  const pick = (index: number) => {
    close()
    if (index !== selected) onSelect(index)
  }
  /**
   * Mueve la opción activa de forma circular.
   *
   * @param {number} index - Índice destino (puede salirse del rango; se ajusta con módulo).
   * @returns {void} No devuelve nada.
   * @example
   * move(active + 1)
   */
  const move = (index: number) => setActive((index + count) % count)

  useEffect(() => {
    if (open) document.getElementById(`${id}-option-${active}`)?.focus()
  }, [open, active, id])

  useEffect(() => {
    if (!open) return
    const list = document.getElementById(listId)
    if (!reduced && list) {
      gsap.fromTo(
        list,
        { opacity: 0, y: 12, scale: 0.94 },
        { opacity: 1, y: 0, scale: 1, duration: 0.38, ease: 'back.out(2.2)' },
      )
      gsap.fromTo(
        list.children,
        { opacity: 0, y: 8 },
        { opacity: 1, y: 0, duration: 0.3, stagger: 0.035, ease: 'power3.out', delay: 0.05 },
      )
    }
    /**
     * Cierra la lista cuando se pulsa fuera de ella y del botón.
     *
     * @param {PointerEvent} event - Evento `pointerdown` del documento.
     * @returns {void} No devuelve nada.
     * @example
     * document.addEventListener('pointerdown', onOutside)
     */
    const onOutside = (event: PointerEvent) => {
      if (!(event.target as Element).closest(`#${CSS.escape(listId)}, #${CSS.escape(buttonId)}`))
        setOpen(false)
    }
    document.addEventListener('pointerdown', onOutside)
    return () => document.removeEventListener('pointerdown', onOutside)
  }, [open, listId, buttonId, reduced])

  /**
   * Gestiona el teclado dentro de la lista abierta.
   *
   * @param {import('react').KeyboardEvent} event - Evento de teclado de la lista.
   * @returns {void} No devuelve nada.
   * @example
   * <ul onKeyDown={onListKey} />
   */
  const onListKey = (event: KeyboardEvent) => {
    const actions: Record<string, () => void> = {
      /**
       * Activa la opción siguiente.
       *
       * @returns {void} No devuelve nada.
       * @example
       * actions.ArrowDown()
       */
      ArrowDown: () => move(active + 1),
      /**
       * Activa la opción anterior.
       *
       * @returns {void} No devuelve nada.
       * @example
       * actions.ArrowUp()
       */
      ArrowUp: () => move(active - 1),
      /**
       * Activa la primera opción.
       *
       * @returns {void} No devuelve nada.
       * @example
       * actions.Home()
       */
      Home: () => move(0),
      /**
       * Activa la última opción.
       *
       * @returns {void} No devuelve nada.
       * @example
       * actions.End()
       */
      End: () => move(count - 1),
      /**
       * Elige la opción activa.
       *
       * @returns {void} No devuelve nada.
       * @example
       * actions.Enter()
       */
      Enter: () => pick(active),
      /**
       * Elige la opción activa con la barra espaciadora.
       *
       * @returns {void} No devuelve nada.
       * @example
       * actions[' ']()
       */
      ' ': () => pick(active),
      /**
       * Cierra la lista y devuelve el foco al botón.
       *
       * @returns {void} No devuelve nada.
       * @example
       * actions.Escape()
       */
      Escape: () => close(),
    }
    const action = actions[event.key]
    if (action) {
      event.preventDefault()
      event.stopPropagation()
      action()
    } else if (event.key === 'Tab') close(false)
  }

  return {
    open,
    buttonProps: {
      id: buttonId,
      'aria-haspopup': 'listbox' as const,
      'aria-expanded': open,
      'aria-controls': listId,
      /**
       * Abre o cierra la lista al pulsar el botón.
       *
       * @returns {void} No devuelve nada.
       * @example
       * <button onClick={listbox.buttonProps.onClick} />
       */
      onClick: () => (open ? close() : openList()),
      /**
       * Abre la lista con las flechas arriba o abajo desde el botón.
       *
       * @param {import('react').KeyboardEvent} event - Evento de teclado del botón.
       * @returns {void} No devuelve nada.
       * @example
       * <button onKeyDown={listbox.buttonProps.onKeyDown} />
       */
      onKeyDown: (event: KeyboardEvent) => {
        if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return
        event.preventDefault()
        openList()
      },
    },
    listProps: { id: listId, role: 'listbox' as const, hidden: !open, onKeyDown: onListKey },
    /**
     * Devuelve las props de una opción de la lista.
     *
     * @param {number} index - Índice de la opción.
     * @returns {object} Props de la opción (id, rol, tabIndex, `aria-selected` y clic).
     * @example
     * <li {...listbox.optionProps(0)} />
     */
    optionProps: (index: number) => ({
      id: optionId(index),
      role: 'option' as const,
      tabIndex: -1,
      'aria-selected': index === selected,
      /**
       * Elige esta opción al hacer clic.
       *
       * @returns {void} No devuelve nada.
       * @example
       * <li onClick={onClick} />
       */
      onClick: () => pick(index),
    }),
  }
}
