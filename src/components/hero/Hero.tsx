import { Trans, useTranslation } from 'react-i18next'
import Pill from '@/components/ui/pill/Pill'
import HeroName from './HeroName'
import ScrollBadge from './ScrollBadge'
import SeatScene from './SeatScene'

/**
 * Hero asimétrico: el saludo antioqueño gigante que se sale por el borde izquierdo, el nombre, el rol
 * actual, una breve presentación, la insignia de scroll y el retrato sentado.
 *
 * @returns {import('react').JSX.Element} La sección hero.
 * @example
 * <Hero />
 */
export default function Hero() {
  const { t } = useTranslation()
  const pills = t('hero.pills', { returnObjects: true }) as string[]

  return (
    <section className="hero" id="inicio" aria-labelledby="hero-title">
      <span className="ball pop hball" data-depth="1.2" aria-hidden="true" />
      <span className="ball pop hball small" data-depth="0.9" aria-hidden="true" />
      <span className="ball pop hball tiny" data-depth="0.7" aria-hidden="true" />
      <div className="hero__title">
        <p className="welcome" aria-hidden="true">
          {t('hero.welcome')}
        </p>
        <span className="welcome__note" aria-hidden="true">
          {t('hero.note')}
        </span>
        <HeroName />
      </div>
      <p className="hero__now">
        <span className="live" aria-hidden="true" />
        <span>
          <Trans i18nKey="hero.now" components={{ b: <b /> }} />
        </span>
      </p>
      <div className="hero__meta">
        <p>
          <Trans i18nKey="hero.intro" components={{ b: <b /> }} />
        </p>
        <div className="pills">
          {pills.map((pill) => (
            <Pill key={pill}>{pill}</Pill>
          ))}
        </div>
      </div>
      <ScrollBadge />
      <SeatScene />
    </section>
  )
}
