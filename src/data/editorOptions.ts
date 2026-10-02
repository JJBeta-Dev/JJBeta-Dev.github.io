/**
 * Una opción de los desplegables del editor en vivo. `value` es un valor CSS; `null` restaura el predeterminado.
 */
export interface EditorOption {
  label: string
  value: string | null
}

/**
 * Familias tipográficas que ofrece el editor. Cada opción se previsualiza con su propia fuente.
 */
export const FONT_OPTIONS: readonly EditorOption[] = [
  { label: 'Montserrat', value: null },
  { label: 'Poppins', value: 'var(--font-display)' },
  { label: 'Clash Display', value: 'var(--font-title)' },
  { label: 'Georgia', value: 'Georgia, serif' },
  { label: 'Courier', value: "'Courier New', monospace" },
  { label: 'Comic Sans', value: "'Comic Sans MS', 'Comic Neue', cursive" },
]

/**
 * Tamaños de texto que ofrece el editor. El índice 1 (12pt) es el tamaño predeterminado.
 */
export const SIZE_OPTIONS: readonly EditorOption[] = [
  { label: '10pt', value: '.9rem' },
  { label: '12pt', value: null },
  { label: '14pt', value: '1.22rem' },
  { label: '16pt', value: '1.36rem' },
]

/**
 * Formatos de texto en línea que activa y desactiva la barra de herramientas del editor.
 */
export const TEXT_FORMATS = ['bold', 'italic', 'underline', 'strike'] as const

/**
 * Un formato de texto que alterna la barra de herramientas.
 */
export type TextFormat = (typeof TEXT_FORMATS)[number]
