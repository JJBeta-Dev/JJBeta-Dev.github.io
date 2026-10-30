import { useTranslation } from 'react-i18next'
import LineIcon from '@/components/ui/icons/LineIcon'

/** Ruta pública del PDF de la hoja de vida (vive en `public/`). */
export const RESUME_FILE = '/Jeronimo-Jimenez-Betancur-HV.pdf'

/**
 * Archivo adjunto del editor de Acerca de mí: descarga la hoja de vida en PDF.
 * Se ve como un documento pegado en la esquina de la tarjeta.
 *
 * @returns {import('react').JSX.Element} Enlace de descarga de la hoja de vida.
 * @example
 * <ResumeDownload />
 */
export default function ResumeDownload() {
  const { t } = useTranslation()

  return (
    <a
      className="resume"
      href={RESUME_FILE}
      download
      aria-label={t('about.resume.aria')}
      data-cursor-link=""
      data-magnetic="soft"
    >
      <span className="resume__file" aria-hidden="true">
        <span className="resume__ext">PDF</span>
      </span>
      <span className="resume__label">{t('about.resume.label')}</span>
      <span className="resume__cta">
        {t('about.resume.cta')}
        <LineIcon name="arrowDown" className="resume__arrow" strokeWidth={2.4} />
      </span>
    </a>
  )
}
