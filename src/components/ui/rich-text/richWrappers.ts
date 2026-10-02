import type { RichTag } from '@/utils/parseRichText'

/**
 * Elemento HTML (y clase opcional) con que se pinta cada énfasis de los textos traducidos.
 * `acc` es la palabra acento del sistema de diseño.
 */
export const RICH_WRAPPERS: Record<
  RichTag,
  { tag: 'strong' | 'b' | 'em' | 'code' | 'span'; className?: string }
> = {
  strong: { tag: 'strong' },
  b: { tag: 'b' },
  em: { tag: 'em' },
  code: { tag: 'code' },
  acc: { tag: 'span', className: 'acc' },
}
