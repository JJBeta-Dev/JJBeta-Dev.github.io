import { useRef } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { useEditor } from '@/hooks/useEditor'
import { useFontEasterEggs } from '@/hooks/useFontEasterEggs'
import EditorToolbar from './EditorToolbar'

/**
 * Editor "vivo" de la sección Acerca de mí: el texto de presentación dentro de una tarjeta tipo
 * documento, con formato, fuente y tamaño que realmente cambian el texto.
 *
 * @returns {import('react').JSX.Element} Tarjeta del editor.
 * @example
 * <Editor />
 */
export default function Editor() {
  const { t } = useTranslation()
  const root = useRef<HTMLDivElement>(null)
  const editor = useEditor(root)
  const onFontPicked = useFontEasterEggs()
  const paragraphs = t('about.paragraphs', { returnObjects: true }) as string[]

  return (
    <div className={`editor ${editor.className}`} id="editor" ref={root} style={editor.style}>
      <div className="editor__text">
        {paragraphs.map((_, i) => (
          <p className="reveal" key={i}>
            <Trans i18nKey={`about.paragraphs.${i}`} components={{ strong: <strong /> }} />
          </p>
        ))}
        <EditorToolbar
          formats={editor.formats}
          font={editor.font}
          size={editor.size}
          onToggle={editor.toggleFormat}
          onFont={(index) => {
            editor.selectFont(index)
            onFontPicked(index)
          }}
          onSize={editor.selectSize}
        />
      </div>
      <div className="editor__side" aria-hidden="true">
        <div className="dots">
          <i />
          <i />
          <i />
        </div>
      </div>
    </div>
  )
}
