import { useTranslation } from 'react-i18next'

/**
 * Enlace "Saltar al contenido", el primer elemento enfocable de la página.
 *
 * @param {{ inert: boolean }} props - `inert` lo desactiva mientras hay un diálogo abierto.
 * @returns {import('react').JSX.Element} El enlace de salto.
 * @example
 * <SkipLink inert={false} />
 */
export default function SkipLink({ inert }: { inert: boolean }) {
  const { t } = useTranslation()
  return (
    <a className="skip" href="#contenido" inert={inert}>
      {t('a11y.skip')}
    </a>
  )
}
