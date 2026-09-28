import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import SplitWords from '@/components/ui/split-text/SplitWords'
import { useEditor } from '@/hooks/useEditor'
import EditorToolbar from '@/components/about/EditorToolbar'

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
  const paragraphs = t('about.paragraphs', { returnObjects: true })

  return (
    <div className={`editor ${editor.className}`} id="editor" ref={root} style={editor.style}>
      <div className="editor__text">
        {paragraphs.map((paragraph, i) => (
          <p className="reveal" key={i}>
            <SplitWords text={paragraph} />
          </p>
        ))}
        <EditorToolbar
          formats={editor.formats}
          font={editor.font}
          size={editor.size}
          onToggle={editor.toggleFormat}
          onFont={editor.selectFont}
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
