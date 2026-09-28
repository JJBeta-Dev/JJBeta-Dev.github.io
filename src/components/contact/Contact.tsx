import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import BrandIcon from '@/components/ui/icons/BrandIcon'
import { EMAIL, SOCIAL_LINKS } from '@/data/site'
import { useContactMotion } from '@/hooks/useContactMotion'
import { useCopyEmail } from '@/hooks/useCopyEmail'

const PROFILES = [
  { icon: 'linkedin', label: 'LinkedIn', href: SOCIAL_LINKS.linkedin },
  { icon: 'github', label: 'GitHub', href: SOCIAL_LINKS.github },
  { icon: 'instagram', label: 'Instagram', href: SOCIAL_LINKS.instagram },
] as const

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
        {t('contact.title')}
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
          <a
            key={profile.icon}
            className="slink"
            href={profile.href}
            target="_blank"
            rel="noopener noreferrer"
            data-cursor-link=""
            data-magnetic="soft"
          >
            <BrandIcon name={profile.icon} />
            {profile.label}
          </a>
        ))}
      </div>
    </section>
  )
}
