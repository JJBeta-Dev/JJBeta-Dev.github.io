import { Fragment, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useNameReveal } from '@/hooks/useNameReveal'

const EXTRA_AFTER: Record<number, string> = { 0: 'erónimo ', 1: 'iménez ', 5: 'ncur' }

/**
 * Letras de un fragmento oculto del nombre, que revela el easter egg del nombre.
 *
 * @param {{ text: string }} props - Texto del fragmento.
 * @returns {import('react').JSX.Element} El fragmento oculto.
 * @example
 * <NameExtra text="ncur" />
 */
function NameExtra({ text }: { text: string }) {
  return (
    <span className="name-extra" aria-hidden="true">
      {[...text].map((letter, i) => (
        <span className="nx" key={`${letter}-${i}`}>
          {letter === ' ' ? ' ' : letter}
        </span>
      ))}
    </span>
  )
}

/**
 * Titular del hero "Soy JJBeta". Al hacer clic, el nombre se expande a Jerónimo Jiménez Betancur. React
 * pinta las letras (no se dividen en tiempo de ejecución) para que el easter egg nunca le dispute el DOM a
 * React, y los lectores de pantalla leen "Soy JJBeta" más el significado anunciado.
 *
 * @returns {import('react').JSX.Element} El `h1` del hero.
 * @example
 * <HeroName />
 */
export default function HeroName() {
  const { t } = useTranslation()
  const root = useRef<HTMLHeadingElement>(null)
  const { reveal, announcement } = useNameReveal(root)
  const name = t('hero.name')

  return (
    <h1
      className="me"
      id="hero-title"
      ref={root}
      data-cursor={t('hero.cursor')}
      onClick={() => reveal(t('a11y.nameMeaning'))}
    >
      <span className="soy">{t('hero.soy')}</span>{' '}
      <span className="me-name" aria-hidden="true">
        {[...name].map((letter, i) => (
          <Fragment key={`${letter}-${i}`}>
            <span className="char">{letter}</span>
            {EXTRA_AFTER[i] && <NameExtra text={EXTRA_AFTER[i]} />}
          </Fragment>
        ))}
      </span>
      <span className="sr-only">{name}</span>
      <span className="sr-only" aria-live="polite">
        {announcement}
      </span>
    </h1>
  )
}
