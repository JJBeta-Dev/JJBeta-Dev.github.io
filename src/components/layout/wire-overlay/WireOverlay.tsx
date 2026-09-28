import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useWireMode } from '@/hooks/useWireMode'

const COLUMNS = Array.from({ length: 12 }, (_, i) => i)

/**
 * Interfaz del modo contorno "beta": retícula de 12 columnas, caja de selección azul, línea de escaneo y
 * una barra de herramientas estilo Figma para alternar la retícula y las medidas o salir del modo.
 *
 * @returns {import('react').JSX.Element} La capa del modo beta.
 * @example
 * <WireOverlay />
 */
export default function WireOverlay() {
  const { t } = useTranslation()
  const root = useRef<HTMLDivElement>(null)
  const wire = useWireMode(root)

  return (
    <div className="wire-ui" ref={root}>
      <div className="wire-grid" aria-hidden="true">
        {COLUMNS.map((column) => (
          <i key={column} />
        ))}
      </div>
      <div className="wire-sel" aria-hidden="true">
        <b className="wire-name" />
        <span className="wire-size" />
        <i />
        <i />
        <i />
        <i />
      </div>
      <div className="wire-scan" aria-hidden="true" />
      <div className="wire-bar" role="toolbar" aria-label={t('a11y.wireToolbar')} inert={!wire.on}>
        <span className="wire-logo" aria-hidden="true">
          β
        </span>
        <span className="wire-title">
          {t('wire.title')} <em>{t('wire.subtitle')}</em>
        </span>
        <button className="wire-btn" type="button" aria-pressed={wire.grid} onClick={wire.toggleGrid}>
          {t('wire.grid')}
        </button>
        <button className="wire-btn" type="button" aria-pressed={wire.measure} onClick={wire.toggleMeasure}>
          {t('wire.measure')}
        </button>
        <button className="wire-exit" type="button" onClick={wire.exit}>
          {t('wire.exit')} <kbd>Esc</kbd>
        </button>
      </div>
    </div>
  )
}
