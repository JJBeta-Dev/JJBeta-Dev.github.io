import { createElement, Fragment, type ReactNode } from 'react'
import { RICH_WRAPPERS } from '@/components/ui/rich-text/richWrappers'
import { parseRichText } from '@/utils/parseRichText'

/**
 * Convierte un texto traducido con énfasis simples en nodos de React: cada énfasis se envuelve en su
 * elemento real y el texto de cada tramo se pinta con `renderText`, para que `RichText` y
 * `SplitWords` compartan la misma lectura del marcado.
 *
 * @param {string} text - Texto con énfasis (`<strong>`, `<b>`, `<em>`, `<code>`, `<acc>`).
 * @param {(plain: string) => ReactNode} renderText - Cómo pintar el texto plano de cada tramo.
 * @returns {ReactNode[]} Un nodo con key por tramo.
 * @example
 * renderRich(t('hero.intro'), (plain) => plain)
 */
export const renderRich = (text: string, renderText: (plain: string) => ReactNode): ReactNode[] =>
  parseRichText(text).map((segment, i) => {
    const content = renderText(segment.text)
    if (!segment.tag) return <Fragment key={i}>{content}</Fragment>
    const wrapper = RICH_WRAPPERS[segment.tag]
    return createElement(wrapper.tag, { key: i, className: wrapper.className }, content)
  })
