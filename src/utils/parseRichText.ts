/**
 * Etiquetas de énfasis que pueden aparecer en los textos traducidos.
 */
export type RichTag = 'strong' | 'b' | 'em' | 'code' | 'acc'

/**
 * Tramo de texto con su énfasis (o `null` si es texto normal).
 */
export interface RichSegment {
  text: string
  tag: RichTag | null
}

const TAGS = /<(strong|b|em|code|acc)>(.*?)<\/\1>/g

/**
 * Convierte un texto traducido con énfasis simples (`<strong>`, `<b>`, `<em>`, `<code>` y el
 * acento `<acc>`) en tramos planos, para que React pinte cada palabra o letra sin que ninguna
 * librería reescriba nodos que React controla. No admite etiquetas anidadas.
 *
 * @param {string} source - Texto con etiquetas de énfasis.
 * @returns {RichSegment[]} Tramos en orden de lectura.
 * @example
 * parseRichText('Hola <strong>mundo</strong>') // [{ text: 'Hola ', tag: null }, { text: 'mundo', tag: 'strong' }]
 */
export const parseRichText = (source: string): RichSegment[] => {
  const segments: RichSegment[] = []
  let cursor = 0
  for (const match of source.matchAll(TAGS)) {
    if (match.index > cursor) segments.push({ text: source.slice(cursor, match.index), tag: null })
    segments.push({ text: match[2] ?? '', tag: match[1] as RichTag })
    cursor = match.index + match[0].length
  }
  if (cursor < source.length) segments.push({ text: source.slice(cursor), tag: null })
  return segments
}

/**
 * Parte un texto en palabras y espacios conservando los espacios, para envolver solo las palabras.
 *
 * @param {string} text - Texto a partir.
 * @returns {string[]} Palabras y espacios alternados.
 * @example
 * splitWords('Hola mundo') // ['Hola', ' ', 'mundo']
 */
export const splitWords = (text: string): string[] => text.split(/(\s+)/).filter(Boolean)
