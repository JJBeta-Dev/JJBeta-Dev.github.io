import { useEffect } from 'react'

/**
 * Pone una clase en `<html>` o `<body>` mientras `active` sea `true` y la quita al desmontar, para
 * que ningún estado global de la página (menú abierto, scroll bloqueado, modo beta) quede colgado si
 * el árbol se reemplaza de golpe.
 *
 * @param {'html' | 'body'} target - Elemento del documento que recibe la clase.
 * @param {string} className - Clase a alternar.
 * @param {boolean} active - Si la clase debe estar presente.
 * @returns {void} No devuelve nada.
 * @example
 * useDocumentClass('body', 'menu-open', open)
 */
export const useDocumentClass = (target: 'html' | 'body', className: string, active: boolean): void => {
  useEffect(() => {
    const element = target === 'html' ? document.documentElement : document.body
    element.classList.toggle(className, active)
    return () => element.classList.remove(className)
  }, [target, className, active])
}
