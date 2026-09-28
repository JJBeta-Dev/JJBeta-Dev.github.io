import type { MouseEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { EMAIL } from '@/data/site'
import { gsap } from '@/plugins/gsap'
import { copyText } from '@/services/clipboardService'
import { usePrefersReducedMotion } from './usePrefersReducedMotion'
import { useToast } from './useToast'

/**
 * Copia el correo de contacto con una animación de pulsación elástica y un aviso de confirmación.
 * Si el portapapeles no está disponible, abre el cliente de correo.
 *
 * @returns {(event: import('react').MouseEvent<HTMLElement>) => Promise<void>} Manejador de clic
 * para el botón de contacto.
 * @example
 * const copyEmail = useCopyEmail()
 * <button onClick={copyEmail} />
 */
export const useCopyEmail = () => {
  const { t } = useTranslation()
  const { show } = useToast()
  const reduced = usePrefersReducedMotion()

  return async (event: MouseEvent<HTMLElement>) => {
    const button = event.currentTarget
    if (!reduced) gsap.fromTo(button, { scale: 0.9 }, { scale: 1, duration: 0.8, ease: 'elastic.out(1, .4)' })
    if (await copyText(EMAIL)) show(t('contact.copied', { email: EMAIL }), 'copy')
    else window.location.href = `mailto:${EMAIL}`
  }
}
