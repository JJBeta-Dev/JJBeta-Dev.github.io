import { Fragment } from 'react'
import { renderRich } from '@/components/ui/rich-text/renderRich'
import { splitWords } from '@/utils/parseRichText'

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
      {renderRich(text, (plain) =>
        splitWords(plain).map((part, i) =>
          /^\s+$/.test(part) ? (
            <Fragment key={i}>{part}</Fragment>
          ) : (
            <span className="w" key={i}>
              {part}
            </span>
          ),
        ),
      )}
    </>
  )
}
