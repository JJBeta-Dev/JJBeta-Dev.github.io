import type { ReactNode } from 'react'

/**
 * Etiqueta redondeada con un punto del color de marca, usada para los roles en el hero.
 *
 * @param {{ children: import('react').ReactNode }} props - Contenido de la etiqueta.
 * @returns {import('react').JSX.Element} La píldora.
 * @example
 * <Pill>Diseñador UX/UI</Pill>
 */
export default function Pill({ children }: { children: ReactNode }) {
  return (
    <span className="pill">
      <i aria-hidden="true" />
      {children}
    </span>
  )
}
