import { useTranslation } from 'react-i18next'
import RichText from '@/components/ui/rich-text/RichText'
import Pill from '@/components/ui/pill/Pill'
import SplitChars from '@/components/ui/split-text/SplitChars'
import HeroName from '@/components/hero/HeroName'
import ScrollBadge from '@/components/hero/ScrollBadge'
import SeatScene from '@/components/hero/SeatScene'

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
  const pills = t('hero.pills', { returnObjects: true })

  return (
    <section className="hero" id="inicio" aria-labelledby="hero-title">
      <span className="ball pop hball" data-depth="1.2" aria-hidden="true" />
      <span className="ball pop hball small" data-depth="0.9" aria-hidden="true" />
      <span className="ball pop hball tiny" data-depth="0.7" aria-hidden="true" />
      <div className="hero__title">
        <p className="welcome" aria-hidden="true">
          <SplitChars text={t('hero.welcome')} />
        </p>
        <span className="welcome__note" aria-hidden="true">
          {t('hero.note')}
        </span>
        <HeroName />
      </div>
      <p className="hero__now">
        <span className="live" aria-hidden="true" />
        <span>
          <RichText text={t('hero.now')} />
        </span>
      </p>
      <div className="hero__meta">
        <p>
          <RichText text={t('hero.intro')} />
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
