import type { CSSProperties } from 'react'
import type { EditorOption } from '@/data/editorOptions'
import { useListbox } from '@/hooks/useListbox'
import LineIcon from '../icons/LineIcon'

/**
 * Props de {@link Dropdown}.
 */
export interface DropdownProps {
  name: string
  listLabel: string
  options: readonly EditorOption[]
  selected: number
  onSelect: (index: number) => void
  preview: (option: EditorOption) => CSSProperties
  compact?: boolean
}

/**
 * Desplegable accesible del editor en vivo. Cada opción se previsualiza a sí misma (en su fuente o tamaño)
 * y la seleccionada muestra una marca de verificación.
 *
 * @param {Readonly<DropdownProps>} props - Opciones, índice seleccionado, callback de selección y cómo
 * previsualizar cada opción.
 * @returns {import('react').JSX.Element} El botón y su listbox.
 * @example
 * <Dropdown name="Fuente" listLabel="Fuente" options={FONT_OPTIONS} selected={0} onSelect={setFont} preview={(o) => ({ fontFamily: o.value })} />
 */
export default function Dropdown({
  name,
  listLabel,
  options,
  selected,
  onSelect,
  preview,
  compact,
}: DropdownProps) {
  const listbox = useListbox({ count: options.length, selected, onSelect })
  const current = options[selected]?.label ?? ''

  return (
    <div className="dd-wrap">
      <button className="dd" type="button" aria-label={`${name}: ${current}`} {...listbox.buttonProps}>
        {current}
      </button>
      <ul
        className={compact ? 'dd-menu dd-menu--size' : 'dd-menu'}
        aria-label={listLabel}
        {...listbox.listProps}
      >
        {options.map((option, index) => (
          <li key={option.label} style={preview(option)} {...listbox.optionProps(index)}>
            <span>{option.label}</span>
            <LineIcon name="check" strokeWidth={2.4} />
          </li>
        ))}
      </ul>
    </div>
  )
}
