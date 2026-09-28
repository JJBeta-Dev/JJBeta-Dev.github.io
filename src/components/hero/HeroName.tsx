import { Fragment, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useCaseOpen } from '@/hooks/useCaseOpen'
import { useNameReveal } from '@/hooks/useNameReveal'

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
 * Titular del hero «Soy JJBeta». El nombre es un botón real (clic, Enter o espacio) que lo expande
 * a Jerónimo Jiménez Betancur y anuncia su significado a los lectores de pantalla. React pinta las
 * letras, así el easter egg nunca le disputa el DOM a React. Con un caso de estudio abierto el
 * titular pasa a ser un párrafo, para que la página del caso tenga un solo `h1`.
 *
 * @returns {import('react').JSX.Element} El titular del hero y su región de anuncios.
 * @example
 * <HeroName />
 */
export default function HeroName() {
  const { t } = useTranslation()
  const trigger = useRef<HTMLButtonElement>(null)
  const { reveal, announcement } = useNameReveal(trigger)
  const Heading = useCaseOpen() ? 'p' : 'h1'
  const name = t('hero.name')
  const extras: Record<string, string> = t('hero.nameExtras', { returnObjects: true })

  return (
    <>
      <Heading className="me" id="hero-title" data-cursor={t('hero.cursor')}>
        <span className="soy">{t('hero.soy')}</span>{' '}
        <button
          className="me__trigger"
          type="button"
          ref={trigger}
          onClick={() => reveal(t('a11y.nameMeaning'))}
        >
          <span className="me-name" aria-hidden="true">
            {[...name].map((letter, i) => (
              <Fragment key={`${letter}-${i}`}>
                <span className="char">{letter}</span>
                {extras[i] && <NameExtra text={extras[i]} />}
              </Fragment>
            ))}
          </span>
          <span className="sr-only">{name}</span>
        </button>
      </Heading>
      <span className="sr-only" aria-live="polite">
        {announcement}
      </span>
    </>
  )
}
