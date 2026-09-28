import { useTranslation } from 'react-i18next'

/**
 * Enlace "Saltar al contenido", el primer elemento enfocable de la página.
 *
 * @returns {import('react').JSX.Element} El enlace de salto.
 * @example
 * <SkipLink />
 */
export default function SkipLink() {
  const { t } = useTranslation()
  return (
    <a className="skip" href="#contenido">
      {t('a11y.skip')}
    </a>
  )
}
