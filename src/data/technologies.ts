import type brandIcons from './brandIcons.json'

/**
 * Nombre de un icono disponible en `brandIcons.json`, más el lápiz propio dibujado como icono de línea.
 */
export type BrandIconName = keyof typeof brandIcons | 'pencil'

/**
 * Variante visual de un chip de tecnología: color de marca relleno, icono de línea con contorno o "aprendiendo".
 */
export type ChipVariant = 'default' | 'hot' | 'stroke' | 'next'

/**
 * Un chip de tecnología arrastrable. `labelKey` se usa cuando la etiqueta debe traducirse.
 */
export interface Technology {
  icon: BrandIconName
  label?: string
  labelKey?: 'tech.pencil' | 'tech.next'
  variant: ChipVariant
}

/**
 * Stack seleccionado que se muestra en el playground, en orden de lectura.
 */
export const TECHNOLOGIES: readonly Technology[] = [
  { icon: 'pencil', labelKey: 'tech.pencil', variant: 'stroke' },
  { icon: 'figma', label: 'Figma', variant: 'hot' },
  { icon: 'adobephotoshop', label: 'Photoshop', variant: 'default' },
  { icon: 'react', label: 'React', variant: 'hot' },
  { icon: 'typescript', label: 'TypeScript', variant: 'hot' },
  { icon: 'javascript', label: 'JavaScript', variant: 'default' },
  { icon: 'html5', label: 'HTML', variant: 'default' },
  { icon: 'css', label: 'CSS', variant: 'default' },
  { icon: 'tailwindcss', label: 'Tailwind CSS', variant: 'hot' },
  { icon: 'reactquery', label: 'TanStack Query', variant: 'default' },
  { icon: 'zod', label: 'Zod', variant: 'default' },
  { icon: 'reacthookform', label: 'React Hook Form', variant: 'default' },
  { icon: 'make', label: 'Make', variant: 'default' },
  { icon: 'n8n', label: 'n8n', variant: 'default' },
  { icon: 'ollama', label: 'Ollama', variant: 'default' },
  { icon: 'vite', label: 'Vite', variant: 'default' },
  { icon: 'vitest', label: 'Vitest', variant: 'default' },
  { icon: 'git', label: 'Git', variant: 'default' },
  { icon: 'zedindustries', label: 'Zed', variant: 'default' },
  { icon: 'nextdotjs', labelKey: 'tech.next', variant: 'next' },
]
