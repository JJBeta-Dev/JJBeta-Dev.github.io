import type { ComponentProps } from 'react'
import { useTranslation } from 'react-i18next'

/**
 * Enlace a otro sitio: se abre en una pestaña nueva sin darle acceso a esta página y avisa a los
 * lectores de pantalla de ese cambio de pestaña.
 *
 * @param {ComponentProps<'a'>} props - Atributos del enlace; `href` y el contenido son obligatorios.
 * @returns {import('react').JSX.Element} Enlace externo accesible.
 * @example
 * <ExternalLink href="https://github.com/JJBeta-dev">GitHub</ExternalLink>
 */
export default function ExternalLink({ children, ...props }: ComponentProps<'a'>) {
  const { t } = useTranslation()

  return (
    <a {...props} target="_blank" rel="noopener noreferrer">
      {children}
      <span className="sr-only">{t('a11y.newTab')}</span>
    </a>
  )
}
