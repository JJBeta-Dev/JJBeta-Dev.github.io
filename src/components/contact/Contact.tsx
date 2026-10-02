import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import ExternalLink from '@/components/ui/external-link/ExternalLink'
import SplitChars from '@/components/ui/split-text/SplitChars'
import BrandIcon from '@/components/ui/icons/BrandIcon'
import { EMAIL, PROFILES } from '@/data/site'
import { useContactMotion } from '@/hooks/useContactMotion'
import { useCopyEmail } from '@/hooks/useCopyEmail'

/**
 * Sección de contacto: el gran «¿Hablamos?», el botón circular magnético que copia el correo y
 * los enlaces a redes (que abren en una pestaña nueva).
 *
 * @returns {import('react').JSX.Element} Sección de contacto.
 * @example
 * <Contact />
 */
export default function Contact() {
  const { t } = useTranslation()
  const root = useRef<HTMLElement>(null)
  const copyEmail = useCopyEmail()
  useContactMotion(root)

  return (
    <section className="contact" id="contacto" aria-labelledby="t-contact" ref={root}>
      <h2 className="big-title split-title" id="t-contact">
        <SplitChars text={t('contact.title')} />
      </h2>
      <div className="contact__cta">
        <button
          className="mag"
          id="copy-mail"
          type="button"
          data-cursor={t('contact.cursor')}
          data-magnetic=""
          onClick={copyEmail}
        >
          <span>
            {t('contact.cta')}
            <small>{EMAIL}</small>
          </span>
        </button>
      </div>
      <div className="contact__links">
        <a className="slink" href={`mailto:${EMAIL}`} data-cursor-link="" data-magnetic="soft">
          <BrandIcon name="gmail" />
          {t('contact.mail')}
        </a>
        {PROFILES.map((profile) => (
          <ExternalLink
            key={profile.icon}
            className="slink"
            href={profile.href}
            data-cursor-link=""
            data-magnetic="soft"
          >
            <BrandIcon name={profile.icon} />
            {profile.label}
          </ExternalLink>
        ))}
      </div>
    </section>
  )
}
