import { createElement, Fragment } from 'react'
import { RICH_WRAPPERS } from '@/components/ui/rich-text/richWrappers'
import { parseRichText, splitWords } from '@/utils/parseRichText'

/**
 * Pinta cada palabra de un texto traducido como `.w` para animarla (revelado con el scroll,
 * entrada de títulos), respetando sus énfasis. React es dueño de cada nodo, así que el texto se
 * puede volver a renderizar sin romper nada.
 *
 * @param {{ text: string }} props - Texto con énfasis simples (`<strong>`, `<b>`, `<em>`, `<code>`, `<acc>`).
 * @returns {import('react').JSX.Element} Palabras animables con sus énfasis.
 * @example
 * <p className="reveal"><SplitWords text={t('about.paragraphs.0')} /></p>
 */
export default function SplitWords({ text }: { text: string }) {
  return (
    <>
      {parseRichText(text).map((segment, i) => {
        const words = splitWords(segment.text).map((part, j) =>
          /^\s+$/.test(part) ? (
            <Fragment key={j}>{part}</Fragment>
          ) : (
            <span className="w" key={j}>
              {part}
            </span>
          ),
        )
        if (!segment.tag) return <Fragment key={i}>{words}</Fragment>
        const wrapper = RICH_WRAPPERS[segment.tag]
        return createElement(wrapper.tag, { key: i, className: wrapper.className }, words)
      })}
    </>
  )
}
