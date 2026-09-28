import { use, type Context } from 'react'

/**
 * Lee un contexto y falla de forma explícita cuando falta su proveedor, en lugar de devolver `null`
 * en silencio y romperse más adelante.
 *
 * @template T - Tipo del valor del contexto.
 * @param {import('react').Context<T | null>} context - Contexto de React que se lee.
 * @param {string} name - Nombre del proveedor usado en el mensaje de error.
 * @returns {T} El valor del contexto.
 * @throws {Error} Cuando el componente se renderiza fuera del proveedor.
 * @example
 * const toast = useRequiredContext(ToastContext, 'ToastProvider')
 */
export const useRequiredContext = <T>(context: Context<T | null>, name: string): T => {
  const value = use(context)
  if (!value) throw new Error(`${name} is missing in the component tree`)
  return value
}
