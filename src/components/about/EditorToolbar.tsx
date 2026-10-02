import { useTranslation } from 'react-i18next'
import Dropdown from '@/components/ui/dropdown/Dropdown'
import {
  FONT_OPTIONS,
  SIZE_OPTIONS,
  TEXT_FORMATS,
  type EditorOption,
  type TextFormat,
} from '@/data/editorOptions'

const FORMAT_LABELS: Record<TextFormat, { letter: string; className: string }> = {
  bold: { letter: 'B', className: 'tb' },
  italic: { letter: 'I', className: 'tb i' },
  underline: { letter: 'U', className: 'tb u' },
  strike: { letter: 'S', className: 'tb s' },
}

/**
 * Props de {@link EditorToolbar}.
 */
export interface EditorToolbarProps {
  formats: ReadonlySet<TextFormat>
  font: number
  size: number
  onToggle: (format: TextFormat) => void
  onFont: (index: number) => void
  onSize: (index: number) => void
}

/**
 * Vista previa de una fuente dentro de su propia opción del menú.
 *
 * @param {EditorOption} option - Opción de fuente.
 * @returns {import('react').CSSProperties} Estilo con la familia tipográfica de la opción.
 * @example
 * fontPreview(FONT_OPTIONS[2]) // { fontFamily: 'var(--font-title)' }
 */
const fontPreview = (option: EditorOption) => ({ fontFamily: option.value ?? 'var(--font-body)' })

/**
 * Vista previa de un tamaño dentro de su propia opción del menú.
 *
 * @param {EditorOption} option - Opción de tamaño.
 * @returns {import('react').CSSProperties} Estilo con el tamaño de letra de la opción.
 * @example
 * sizePreview(SIZE_OPTIONS[3]) // { fontSize: '1.36rem' }
 */
const sizePreview = (option: EditorOption) => ({ fontSize: option.value ?? '1rem' })

/**
 * Barra de herramientas del editor: negrita, cursiva, subrayado y tachado como interruptores
 * reales (`aria-pressed`), y menús desplegables de fuente y tamaño.
 *
 * @param {Readonly<EditorToolbarProps>} props - Estado actual del editor y sus acciones.
 * @returns {import('react').JSX.Element} Barra de herramientas accesible.
 * @example
 * <EditorToolbar formats={formats} font={0} size={1} onToggle={toggle} onFont={setFont} onSize={setSize} />
 */
export default function EditorToolbar({
  formats,
  font,
  size,
  onToggle,
  onFont,
  onSize,
}: Readonly<EditorToolbarProps>) {
  const { t } = useTranslation()

  return (
    <div className="toolbar" role="toolbar" aria-label={t('a11y.formatToolbar')}>
      {TEXT_FORMATS.map((format) => (
        <button
          key={format}
          className={FORMAT_LABELS[format].className}
          type="button"
          aria-pressed={formats.has(format)}
          aria-label={t(`a11y.${format}`)}
          onClick={() => onToggle(format)}
        >
          {FORMAT_LABELS[format].letter}
        </button>
      ))}
      <span className="sep" aria-hidden="true" />
      <Dropdown
        name={t('a11y.fontLabel')}
        listLabel={t('a11y.fontList')}
        options={FONT_OPTIONS}
        selected={font}
        onSelect={onFont}
        preview={fontPreview}
      />
      <Dropdown
        name={t('a11y.sizeLabel')}
        listLabel={t('a11y.sizeList')}
        options={SIZE_OPTIONS}
        selected={size}
        onSelect={onSize}
        preview={sizePreview}
        compact
      />
    </div>
  )
}
