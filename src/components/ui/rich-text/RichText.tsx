import { createElement, Fragment } from 'react'
import { parseRichText } from '@/utils/parseRichText'
import { RICH_WRAPPERS } from './richWrappers'

/**
 * Pinta un texto traducido con sus énfasis simples (`<strong>`, `<b>`, `<em>`, `<code>`, `<acc>`)
 * como elementos reales de React, sin HTML crudo ni `dangerouslySetInnerHTML`.
 *
 * @param {{ text: string }} props - Texto con énfasis.
 * @returns {import('react').JSX.Element} El texto con sus énfasis.
 * @example
 * <RichText text={t('hero.intro')} />
 */
export default function RichText({ text }: { text: string }) {
  return (
    <>
      {parseRichText(text).map((segment, i) => {
        if (!segment.tag) return <Fragment key={i}>{segment.text}</Fragment>
        const wrapper = RICH_WRAPPERS[segment.tag]
        return createElement(wrapper.tag, { key: i, className: wrapper.className }, segment.text)
      })}
    </>
  )
}
