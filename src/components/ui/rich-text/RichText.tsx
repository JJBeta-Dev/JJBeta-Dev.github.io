import { renderRich } from '@/components/ui/rich-text/renderRich'

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
  return <>{renderRich(text, (plain) => plain)}</>
}
