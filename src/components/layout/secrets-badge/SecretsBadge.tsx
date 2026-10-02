import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import LineIcon from '@/components/ui/icons/LineIcon'
import { SECRET_KEYS } from '@/contexts/SecretsContext'
import { useSecretsPulse } from '@/hooks/useSecretsPulse'
import { useSecrets } from '@/hooks/useSecrets'

/**
 * Contador de secretos encontrados con una lista de pistas que se puede desplegar. No se muestra en
 * pantallas táctiles, donde el juego no se puede completar.
 *
 * @param {{ inert: boolean }} props - `inert` lo desactiva mientras hay un caso de estudio abierto.
 * @returns {import('react').JSX.Element | null} La insignia y sus pistas, o nada en dispositivos táctiles.
 * @example
 * <SecretsBadge inert={false} />
 */
export default function SecretsBadge({ inert }: { inert: boolean }) {
  const { t } = useTranslation()
  const { enabled, found } = useSecrets()
  const [open, setOpen] = useState(false)
  const root = useRef<HTMLDivElement>(null)
  useSecretsPulse(root, found.size)

  if (!enabled) return null
  return (
    <div ref={root} inert={inert}>
      <button
        className="secrets"
        type="button"
        aria-expanded={open}
        aria-controls="hint"
        onClick={() => setOpen(!open)}
      >
        <LineIcon name="egg" className="egg" />
        <span className="label">{t('secrets.label')}</span> <b>{`${found.size}/${SECRET_KEYS.length}`}</b>
      </button>
      <div className={open ? 'hint show' : 'hint'} id="hint">
        {t('secrets.intro')}
        <ul>
          {SECRET_KEYS.map((key) => (
            <li key={key} className={found.has(key) ? 'done' : undefined}>
              {t(`secrets.hints.${key}`)}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
