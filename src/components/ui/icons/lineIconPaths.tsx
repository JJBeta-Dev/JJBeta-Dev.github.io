import type { ReactElement } from 'react'

/**
 * Marcado SVG interno de cada icono de línea (retícula de 24×24, dibujado con `currentColor`).
 */
export const LINE_ICON_PATHS = {
  spark: <path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5L18 18M18 6l-2.5 2.5M8.5 15.5L6 18" />,
  type: <path d="M4 7V5h16v2M9 19h6M12 5v14" />,
  pen: (
    <>
      <path d="M4 20l1.1-4.4L16.2 4.5a2.1 2.1 0 0 1 3 0l.3.3a2.1 2.1 0 0 1 0 3L8.4 18.9Z" />
      <path d="M14.5 6.2l3.3 3.3" />
    </>
  ),
  pencil: (
    <>
      <path d="M4 20l1.1-4.4L16.2 4.5a2.1 2.1 0 0 1 3 0l.3.3a2.1 2.1 0 0 1 0 3L8.4 18.9Z" />
      <path d="M14.5 6.2l3.3 3.3M4 20l4.4-1.1" />
    </>
  ),
  copy: (
    <>
      <rect x="8" y="8" width="12" height="12" rx="3" />
      <path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" />
    </>
  ),
  bubble: (
    <>
      <circle cx="9" cy="10" r="5" />
      <circle cx="17" cy="16" r="3" />
      <circle cx="17.5" cy="6.5" r="1.5" />
    </>
  ),
  trail: (
    <>
      <path d="M3 17c4-1 5-8 9-8s4 5 8 3" />
      <circle cx="20" cy="12" r="1.6" />
    </>
  ),
  trophy: <path d="M8 4h8v5a4 4 0 0 1-8 0ZM8 6H5a3 3 0 0 0 3 4M16 6h3a3 3 0 0 1-3 4M12 13v4M8 20h8" />,
  font: <path d="M4 20L10 4h2l6 16M7 14h8" />,
  beta: <path d="M8 21V7a4 4 0 0 1 8 0c0 2-1.6 3-3.5 3.4C15 10.8 17 12.3 17 15a4 4 0 0 1-6.5 3.1" />,
  egg: (
    <>
      <path d="M12 3c3.6 0 6.5 5.4 6.5 10a6.5 6.5 0 0 1-13 0C5.5 8.4 8.4 3 12 3Z" />
      <path d="M8.5 13.5l2 1.5 3-3 2 1.5" />
    </>
  ),
  lock: (
    <>
      <rect x="5" y="11" width="14" height="9" rx="2.5" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </>
  ),
  arrowDown: <path d="M12 5v14M6 13l6 6 6-6" />,
  arrowUp: <path d="M12 19V5M6 11l6-6 6 6" />,
  arrowLeft: <path d="M19 12H5M11 6l-6 6 6 6" />,
  check: <path d="M5 12.5l4.5 4.5L19 7.5" />,
} satisfies Record<string, ReactElement>

/**
 * Nombre de un icono de línea disponible.
 */
export type LineIconName = keyof typeof LINE_ICON_PATHS
