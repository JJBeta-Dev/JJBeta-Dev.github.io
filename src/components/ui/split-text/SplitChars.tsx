import { Fragment } from 'react'
import { splitWords } from '@/utils/parseRichText'

/**
 * Pinta un texto letra por letra (`.char`) para animarlo, sin que ninguna librería reescriba el
 * DOM que controla React. Las letras quedan ocultas para los lectores de pantalla, que leen el
 * texto completo desde una copia accesible.
 *
 * @param {{ text: string }} props - Texto a dividir.
 * @returns {import('react').JSX.Element} Letras animables más su texto accesible.
 * @example
 * <h2 className="big-title"><SplitChars text="Proyectos" /></h2>
 */
export default function SplitChars({ text }: { text: string }) {
  return (
    <>
      <span aria-hidden="true">
        {splitWords(text).map((part, i) =>
          /^\s+$/.test(part) ? (
            <Fragment key={i}>{part}</Fragment>
          ) : (
            <span className="word" key={i}>
              {[...part].map((letter, j) => (
                <span className="char" key={j}>
                  {letter}
                </span>
              ))}
            </span>
          ),
        )}
      </span>
      <span className="sr-only">{text}</span>
    </>
  )
}
